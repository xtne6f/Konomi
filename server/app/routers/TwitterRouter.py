
import asyncio
import json
import re
import tweepy
import tweepy.models
import tweepy.parsers
from fastapi import APIRouter
from fastapi import Body
from fastapi import Depends
from fastapi import File
from fastapi import Form
from fastapi import HTTPException
from fastapi import Path
from fastapi import Query
from fastapi import status
from fastapi import UploadFile
from tweepy_authlib import CookieSessionUserHandler
from typing import Any, cast, Coroutine
from zoneinfo import ZoneInfo

from app import schemas
from app.models.TwitterAccount import TwitterAccount
from app.models.User import User
from app.routers.UsersRouter import GetCurrentUser
from app.utils import Logging
from app.utils.TwitterGraphQLAPI import TwitterGraphQLAPI


# ルーター
router = APIRouter(
    tags = ['Twitter'],
    prefix = '/api/twitter',
)


async def GetCurrentTwitterAccount(
    screen_name: str = Path(..., description='Twitter アカウントのスクリーンネーム。'),
    current_user: User = Depends(GetCurrentUser),
) -> TwitterAccount:
    """ 現在ログイン中のユーザーに紐づく Twitter アカウントを取得する """

    # 指定されたスクリーンネームに紐づく Twitter アカウントを取得
    # 自分が所有していない Twitter アカウントでツイートできないよう、ログイン中のユーザーに限って絞り込む
    twitter_account = await TwitterAccount.filter(user_id=current_user.id, screen_name=screen_name).get_or_none()

    # 指定された Twitter アカウントがユーザーアカウントに紐付けられていない or 登録されていない
    ## 実際に Twitter にそのスクリーンネームのアカウントが登録されているかとは無関係
    if not twitter_account:
        Logging.error(f'[TwitterRouter][GetCurrentTwitterAccount] TwitterAccount associated with screen_name does not exist [screen_name: {screen_name}]')
        raise HTTPException(
            status_code = status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail = 'TwitterAccount associated with screen_name does not exist',
        )

    return twitter_account


def GetCurrentTwitterAccountAPI(twitter_account: TwitterAccount = Depends(GetCurrentTwitterAccount)) -> tweepy.API:
    """ 現在ログイン中のユーザーに紐づく Twitter アカウントの Tweepy インスタンスを取得する """
    return twitter_account.getTweepyAPI()


def RaiseHTTPException(ex: tweepy.HTTPException) -> None:
    """ Twitter API のエラーコードからエラーメッセージを生成して HTTPException を発生させる """
    if len(ex.api_codes) > 0 and len(ex.api_messages) > 0:
        error_message = f'Code: {ex.api_codes[0]}, Message: {TwitterGraphQLAPI.ERROR_MESSAGES.get(ex.api_codes[0], ex.api_messages[0])}'
    else:
        error_message = f'Unknown Error (HTTP Error {ex.response.status_code})'
    raise HTTPException(
        status_code = status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail = f'Failed to Twitter API operation ({error_message})'
    )


def FormatTweet(tweet: tweepy.models.Status) -> schemas.Tweet:
    """
    Twitter API のツイートオブジェクトを API レスポンス用のツイートオブジェクトにフォーマットする

    Args:
        tweet (tweepy.models.Status): Twitter API のツイートオブジェクト

    Returns:
        schemas.Tweet: API レスポンス用にフォーマットしたツイートオブジェクト
    """

    # tweepy のモデルには型定義がないため、Any 型にキャスト
    tweet_data = cast(Any, tweet)

    # リツイートがある場合は、リツイート元のツイートの情報を取得
    retweeted_tweet = None
    if hasattr(tweet_data, 'retweeted_status'):
        retweeted_tweet = FormatTweet(tweet_data.retweeted_status)

    # 引用リツイートがある場合は、引用リツイート元のツイートの情報を取得
    quoted_tweet = None
    if hasattr(tweet_data, 'quoted_status'):
        quoted_tweet = FormatTweet(tweet_data.quoted_status)

    # 画像の URL を取得
    image_urls = []
    movie_url = None
    if hasattr(tweet_data, 'extended_entities'):
        for media in tweet_data.extended_entities['media']:
            if media['type'] == 'photo':
                image_urls.append(media['media_url_https'])
            elif media['type'] in ['video', 'animated_gif']:
                movie_url = media['video_info']['variants'][0]['url']  # bitrate が最も高いものを取得

    # t.co の URL を展開した URL に置換
    expanded_text = tweet_data.full_text
    if hasattr(tweet_data, 'entities') and 'urls' in tweet_data.entities:
        for url_entity in tweet_data.entities['urls']:
            expanded_text = expanded_text.replace(url_entity['url'], url_entity['expanded_url'])

    # 残った t.co の URL を削除
    if len(image_urls) > 0 or movie_url:
        expanded_text = re.sub(r'\s*https://t\.co/\w+$', '', expanded_text)

    return schemas.Tweet(
        id = tweet_data.id_str,
        created_at = tweet_data.created_at.astimezone(ZoneInfo('Asia/Tokyo')),
        user = schemas.TweetUser(
            id = tweet_data.user.id_str,
            name = tweet_data.user.name,
            screen_name = tweet_data.user.screen_name,
            # (ランダムな文字列)_normal.jpg だと画像サイズが小さいので、(ランダムな文字列).jpg に置換
            icon_url = tweet_data.user.profile_image_url_https.replace('_normal', ''),
        ),
        text = expanded_text,
        lang = tweet_data.lang,
        via = re.sub(r'<.+?>', '', tweet_data.source),
        image_urls = image_urls if len(image_urls) > 0 else None,
        movie_url = movie_url,
        retweet_count = tweet_data.retweet_count,
        favorite_count = tweet_data.favorite_count,
        retweeted = tweet_data.retweeted,
        favorited = tweet_data.favorited,
        retweeted_tweet = retweeted_tweet,
        quoted_tweet = quoted_tweet,
    )


@router.post(
    '/password-auth',
    summary = 'Twitter パスワード認証 API',
    status_code = status.HTTP_204_NO_CONTENT,
)
async def TwitterPasswordAuthAPI(
    password_auth_request: schemas.TwitterPasswordAuthRequest = Body(..., description='Twitter パスワード認証リクエスト'),
    current_user: User = Depends(GetCurrentUser),
):
    """
    tweepy-authlib を利用してパスワード認証で Twitter 連携を行い、ログイン中のユーザーアカウントと Twitter アカウントを紐づける。
    """

    # 万が一スクリーンネームに @ が含まれていた場合は事前に削除する
    password_auth_request.screen_name = password_auth_request.screen_name.replace('@', '')

    # スクリーンネームとパスワードを指定して認証
    try:
        # ログインには数秒かかるため、非同期で実行
        auth_handler = await asyncio.to_thread(CookieSessionUserHandler,
            screen_name=password_auth_request.screen_name,
            password=password_auth_request.password,
        )
    except tweepy.HTTPException as ex:
        # パスワードが間違っているなどの理由で認証に失敗した
        if len(ex.api_codes) > 0 and len(ex.api_messages) > 0:
            error_message = f'Code: {ex.api_codes[0]}, Message: {ex.api_messages[0]}'
        else:
            error_message = f'Unknown Error (HTTP Error {ex.response.status_code})'
        Logging.error(f'[TwitterRouter][TwitterPasswordAuthAPI] Failed to authenticate with password ({error_message}) [screen_name: {password_auth_request.screen_name}]')
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail = f'Failed to authenticate with password ({error_message})',
        )
    except tweepy.TweepyException as ex:
        # 認証フローの途中で予期せぬエラーが発生し、ログインに失敗した
        error_message = f'Message: {ex}'
        Logging.error(f'[TwitterRouter][TwitterPasswordAuthAPI] Unexpected error occurred while authenticate with password ({error_message}) [screen_name: {password_auth_request.screen_name}]')
        raise HTTPException(
            status_code = status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail = f'Unexpected error occurred while authenticate with password ({error_message})',
        )

    # 現在のログインセッションの Cookie を取得
    cookies: dict[str, str] = auth_handler.get_cookies().get_dict()

    # TwitterAccount のレコードを作成
    ## アクセストークンは今までの OAuth 認証 (廃止) との互換性を保つため "COOKIE_SESSION" の固定値、
    ## アクセストークンシークレットとして Cookie を JSON 化した文字列を入れる
    ## ここではまだ保存しない
    twitter_account = TwitterAccount(
        user = current_user,
        name = 'Temporary',
        screen_name = 'Temporary',
        icon_url = 'Temporary',
        access_token = 'COOKIE_SESSION',
        access_token_secret = json.dumps(cookies, ensure_ascii=False),
    )

    # tweepy の API インスタンスを取得
    tweepy_api = twitter_account.getTweepyAPI()

    # アカウント情報を更新
    try:
        verify_credentials = await asyncio.to_thread(tweepy_api.verify_credentials)
    except tweepy.TweepyException:
        Logging.error('[TwitterRouter][TwitterPasswordAuthAPI] Failed to get user information')
        return HTTPException(
            status_code = status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail = 'Failed to get user information',
        )

    # アカウント名
    twitter_account.name = verify_credentials.name
    # スクリーンネーム
    twitter_account.screen_name = verify_credentials.screen_name
    # アイコン URL
    ## (ランダムな文字列)_normal.jpg だと画像サイズが小さいので、(ランダムな文字列).jpg に置換
    twitter_account.icon_url = verify_credentials.profile_image_url_https.replace('_normal', '')

    # ログインセッションとアカウント情報を保存
    await twitter_account.save()

    # 同じスクリーンネームを持つアカウントが重複している場合、古い方のレコードのデータを更新する
    # すでに作成されている新しいレコード（まだ save() していないので仮の情報しか入っていない）は削除される
    twitter_account_existing = await TwitterAccount.filter(
        user_id = cast(Any, twitter_account).user_id,
        screen_name = twitter_account.screen_name,
    )
    if len(twitter_account_existing) > 1:
        twitter_account_existing[0].name = twitter_account.name  # アカウント名
        twitter_account_existing[0].icon_url = twitter_account.icon_url  # アイコン URL
        twitter_account_existing[0].access_token = twitter_account.access_token  # アクセストークン
        twitter_account_existing[0].access_token_secret = twitter_account.access_token_secret  # アクセストークンシークレット
        await twitter_account_existing[0].save()
        await twitter_account.delete()


@router.delete(
    '/accounts/{screen_name}',
    summary = 'Twitter アカウント連携解除 API',
    status_code = status.HTTP_204_NO_CONTENT,
)
async def TwitterAccountDeleteAPI(
    twitter_account: TwitterAccount = Depends(GetCurrentTwitterAccount),
):
    """
    指定された Twitter アカウントの連携を解除する。<br>
    JWT エンコードされたアクセストークンがリクエストの Authorization: Bearer に設定されていないとアクセスできない。
    """

    # 明示的にログアウト処理を行う
    ## 単に Cookie を削除するだけだと Twitter 側にログインセッションが残り続けてしまう
    assert twitter_account.access_token == 'COOKIE_SESSION', 'OAuth session is no longer available.'
    auth_handler = twitter_account.getTweepyAuthHandler()
    try:
        await asyncio.to_thread(auth_handler.logout)
    except tweepy.HTTPException as ex:
        # サーバーエラーが発生した
        if len(ex.api_codes) > 0 and len(ex.api_messages) > 0:
            error_message = f'Code: {ex.api_codes[0]}, Message: {ex.api_messages[0]}'
        else:
            error_message = f'Unknown Error (HTTP Error {ex.response.status_code})'
        Logging.error(f'[TwitterRouter][TwitterAccountDeleteAPI] Failed to logout ({error_message}) [screen_name: {twitter_account.screen_name}]')
        raise HTTPException(
            status_code = status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail = f'Failed to logout ({error_message})',
        )
    except tweepy.TweepyException as ex:
        # 予期せぬエラーが発生した
        error_message = f'Message: {ex}'
        Logging.error(f'[TwitterRouter][TwitterAccountDeleteAPI] Unexpected error occurred while logout ({error_message}) [screen_name: {twitter_account.screen_name}]')
        raise HTTPException(
            status_code = status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail = f'Unexpected error occurred while logging out ({error_message})',
        )

    # 指定された Twitter アカウントのレコードを削除
    ## アクセストークンなどが保持されたレコードを削除することで連携解除とする
    await twitter_account.delete()


@router.post(
    '/accounts/{screen_name}/tweets',
    summary = 'ツイート送信 API',
    response_description = 'ツイートの送信結果。',
    response_model = schemas.TweetResult,
)
async def TwitterTweetAPI(
    tweet: str = Form('', description='ツイートの本文 (基本的には140文字までだが、プレミアムの加入状態や英数字の量に依存する) 。'),
    images: list[UploadFile] = File([], description='ツイートに添付する画像 (4枚まで) 。'),
    twitter_account: TwitterAccount = Depends(GetCurrentTwitterAccount),
):
    """
    Twitter にツイートを送信する。ツイート本文 or 画像のみ送信することもできる。<br>
    ツイートには screen_name で指定したスクリーンネームに紐づく Twitter アカウントが利用される。

    JWT エンコードされたアクセストークンがリクエストの Authorization: Bearer に設定されていないとアクセスできない。
    """

    tweepy_api = twitter_account.getTweepyAPI()

    # 画像が4枚を超えている
    if len(images) > 4:
        Logging.error(f'[TwitterRouter][TwitterTweetAPI] Can tweet up to 4 images [image length: {len(images)}]')
        raise HTTPException(
            status_code = status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail = 'Can tweet up to 4 images',
        )

    # アップロードした画像の media_id のリスト
    media_ids: list[str] = []

    try:

        # 画像をアップロードするタスク
        image_upload_task: list[Coroutine[Any, Any, Any | None]] = []
        for image in images:
            image_upload_task.append(asyncio.to_thread(tweepy_api.media_upload, filename=image.filename, file=image.file))

        # 画像を Twitter にアップロード
        ## asyncio.gather() で同時にアップロードし、ツイートをより早く送信できるように
        ## ref: https://developer.twitter.com/ja/docs/media/upload-media/api-reference/post-media-upload-init
        for image_upload_result in await asyncio.gather(*image_upload_task):
            if image_upload_result is not None:
                media_ids.append(str(image_upload_result.media_id))

    # 画像のアップロードに失敗した
    except tweepy.HTTPException as ex:
        if len(ex.api_codes) > 0 and len(ex.api_messages) > 0:
            # 定義されていないエラーコードの時は Twitter API から返ってきたエラーメッセージをそのまま返す
            error_message = 'ツイート画像のアップロードに失敗しました。' + \
                TwitterGraphQLAPI.ERROR_MESSAGES.get(ex.api_codes[0], f'Code: {ex.api_codes[0]}, Message: {ex.api_messages[0]}')
        else:
            error_message = f'ツイート画像のアップロード中に Twitter API から HTTP {ex.response.status_code} エラーが返されました。'
            if len(ex.api_errors) > 0:
                error_message += f'Message: {ex.api_errors[0]}'  # エラーメッセージがあれば追加
        return {
            'is_success': False,
            'detail': error_message,
        }

    # GraphQL API を使ってツイートを送信し、結果をそのまま返す
    return await TwitterGraphQLAPI(twitter_account).createTweet(tweet, media_ids)


@router.put(
    '/accounts/{screen_name}/tweets/{tweet_id}/retweet',
    summary = 'リツイート実行 API',
    status_code = status.HTTP_204_NO_CONTENT,
)
async def TwitterRetweetAPI(
    tweet_id: str = Path(..., description='リツイートするツイートの ID。'),
    twitter_account_api: tweepy.API = Depends(GetCurrentTwitterAccountAPI),
):
    """
    指定されたツイートをリツイートする。<br>
    リツイートには screen_name で指定したスクリーンネームに紐づく Twitter アカウントが利用される。

    JWT エンコードされたアクセストークンがリクエストの Authorization: Bearer に設定されていないとアクセスできない。
    """

    # ツイートをリツイート
    try:
        await asyncio.to_thread(twitter_account_api.retweet, tweet_id)
    except tweepy.HTTPException as ex:
        RaiseHTTPException(ex)


@router.delete(
    '/accounts/{screen_name}/tweets/{tweet_id}/retweet',
    summary = 'リツイート取り消し API',
    status_code = status.HTTP_204_NO_CONTENT,
)
async def TwitterRetweetCancelAPI(
    tweet_id: str = Path(..., description='リツイートを取り消すツイートの ID。'),
    twitter_account_api: tweepy.API = Depends(GetCurrentTwitterAccountAPI),
):
    """
    指定されたツイートのリツイートを取り消す。<br>
    リツイートの取り消しには screen_name で指定したスクリーンネームに紐づく Twitter アカウントが利用される。

    JWT エンコードされたアクセストークンがリクエストの Authorization: Bearer に設定されていないとアクセスできない。
    """

    # ツイートのリツイートを取り消し
    try:
        await asyncio.to_thread(twitter_account_api.unretweet, tweet_id)
    except tweepy.HTTPException as ex:
        RaiseHTTPException(ex)


@router.put(
    '/accounts/{screen_name}/tweets/{tweet_id}/favorite',
    summary = 'いいね実行 API',
    status_code = status.HTTP_204_NO_CONTENT,
)
async def TwitterFavoriteAPI(
    tweet_id: str = Path(..., description='いいねするツイートの ID。'),
    twitter_account_api: tweepy.API = Depends(GetCurrentTwitterAccountAPI),
):
    """
    指定されたツイートをいいねする。<br>
    いいねには screen_name で指定したスクリーンネームに紐づく Twitter アカウントが利用される。

    JWT エンコードされたアクセストークンがリクエストの Authorization: Bearer に設定されていないとアクセスできない。
    """

    # ツイートをいいね
    try:
        await asyncio.to_thread(twitter_account_api.create_favorite, tweet_id)
    except tweepy.HTTPException as ex:
        RaiseHTTPException(ex)


@router.delete(
    '/accounts/{screen_name}/tweets/{tweet_id}/favorite',
    summary = 'いいね取り消し API',
    status_code = status.HTTP_204_NO_CONTENT,
)
async def TwitterFavoriteCancelAPI(
    tweet_id: str = Path(..., description='いいねを取り消すツイートの ID。'),
    twitter_account_api: tweepy.API = Depends(GetCurrentTwitterAccountAPI),
):
    """
    指定されたツイートのいいねを取り消す。<br>
    いいねの取り消しには screen_name で指定したスクリーンネームに紐づく Twitter アカウントが利用される。

    JWT エンコードされたアクセストークンがリクエストの Authorization: Bearer に設定されていないとアクセスできない。
    """
    # ツイートのいいねを取り消し
    try:
        await asyncio.to_thread(twitter_account_api.destroy_favorite, tweet_id)
    except tweepy.HTTPException as ex:
        RaiseHTTPException(ex)


@router.get(
    '/accounts/{screen_name}/timeline',
    summary = 'ホームタイムライン取得 API',
    response_description = 'タイムラインのツイートのリスト。',
    response_model = schemas.Tweets,
)
async def TwitterTimelineAPI(
    since_tweet_id: str | None = Query(None, description='このツイート ID 以降のツイートを取得する。'),
    twitter_account_api: tweepy.API = Depends(GetCurrentTwitterAccountAPI),
):
    """
    ホームタイムラインを取得する。<br>
    ホームタイムラインの取得には screen_name で指定したスクリーンネームに紐づく Twitter アカウントが利用される。

    JWT エンコードされたアクセストークンがリクエストの Authorization: Bearer に設定されていないとアクセスできない。
    """

    try:

        # ホームタイムラインを取得
        tweets = await asyncio.to_thread(twitter_account_api.home_timeline,
            count = 200,
            since_id = since_tweet_id,
            trim_user = False,
            exclude_replies = True,
            include_entities = True,
            tweet_mode = 'extended',
        )

        # レスポンス用に情報を整形
        formatted_tweets: list[schemas.Tweet] = []
        for tweet in tweets:

            # 最終的なツイートモデルを作成
            formatted_tweets.append(FormatTweet(tweet))

        return formatted_tweets

    except tweepy.HTTPException as ex:
        RaiseHTTPException(ex)


@router.get(
    '/accounts/{screen_name}/search',
    summary='ツイート検索 API',
    response_description='検索結果のツイートのリスト。',
    response_model=schemas.Tweets,
)
async def TwitterSearchAPI(
    query: str = Query(..., description='検索クエリ。'),
    since_tweet_id: str | None = Query(None, description='このツイート ID より後のツイートを取得する。'),
    max_tweet_id: str | None = Query(None, description='このツイート ID より前のツイートを取得する。'),
    twitter_account: TwitterAccount = Depends(GetCurrentTwitterAccount),
):
    """
    指定されたクエリでツイートを検索する。

    JWT エンコードされたアクセストークンがリクエストの Authorization: Bearer に設定されていないとアクセスできない。
    """

    # tweepy の API インスタンスを取得
    api = twitter_account.getTweepyAPI()

    try:

        # ツイートを検索
        tweets = api.search_tweets(
            q = query.strip() + ' exclude:nativeretweets exclude:retweets exclude:replies',
            count = 200,
            since_id = since_tweet_id,
            max_id = max_tweet_id,
            lang = 'ja',
            locale = 'ja',
            result_type = 'recent',
            include_entities = True,
            tweet_mode = 'extended',
        )

        # レスポンス用に情報を整形
        formatted_tweets: list[schemas.Tweet] = []
        for tweet in tweets:

            # 最終的なツイートモデルを作成
            ## id が max_id と一致するツイートは除外する
            formatted_tweet = FormatTweet(tweet)
            if formatted_tweet.id != max_tweet_id:
                formatted_tweets.append(formatted_tweet)

        return formatted_tweets

    except tweepy.HTTPException as ex:
        RaiseHTTPException(ex)
