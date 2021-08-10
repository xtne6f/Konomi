
import asyncio
import copy
from fastapi import APIRouter
from fastapi import HTTPException
from fastapi import Path
from fastapi import status
from fastapi.responses import Response
from fastapi.responses import StreamingResponse
from sse_starlette.sse import EventSourceResponse

from app import schemas
from app.constants import LIVESTREAM_QUALITY
from app.models import Channels
from app.models import LiveStream


# ルーター
router = APIRouter(
    tags=['Streams'],
    prefix='/api/streams',
)


@router.get(
    '/live',
    summary = 'ライブストリーム API',
    response_description = 'ステータスごとに分類された全てのライブストリームの状態。',
    response_model = schemas.LiveStreams,  # Response の構造を明示
)
async def LiveStreamsAPI():
    """
    全てのライブストリームの状態を Offline・Standby・ONAir・Idling の各ステータスごとに取得する。
    """

    # 返却するデータ
    # 逆順なのは大半を占める Offline なストリームを最初に見ることになるのを避けるため
    result = {
        'Idling' : dict(),
        'ONAir'  : dict(),
        'Standby': dict(),
        'Offline': dict(),
    }

    # 全てのストリームごとに
    # 本来はインスタンス化してから取得するのがベターではあるのだが、チャンネル数×映像の品質数 個あるライブストリームを
    # 全部インスタンス化していてはパフォーマンスが落ちるので、あえてライブストリームの「実態」にアクセスする
    for livestream_id, livestream_entity in LiveStream.livestreams.items():
        result[livestream_entity['status']][livestream_id] = {
            'status': livestream_entity['status'],
            'detail': livestream_entity['detail'],
            'updated_at': livestream_entity['updated_at'],
            'client_count': len(list(filter(None, livestream_entity['client']))),
        }

    # データを返す
    return result


@router.get(
    '/live/{channel_id}/{quality}',
    summary = 'ライブストリーム API',
    response_description = 'ライブストリームの状態。',
    response_model = schemas.LiveStream,  # Response の構造を明示
)
async def LiveStreamAPI(
    channel_id:str = Path(..., description='チャンネル ID 。ex:gr011'),
    quality:str = Path(..., description='映像の品質。ex:1080p'),
):
    """
    ライブストリームの状態を取得する。<br>
    ライブストリーム イベント API にて配信されるイベントと同一のデータだが、一回限りの取得である点が異なる。
    """

    # ***** バリデーション *****

    # 指定されたチャンネル ID が存在しない
    if await Channels.filter(channel_id=channel_id).get_or_none() is None:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail='Specified channel_id was not found',
        )

    # 指定された映像の品質が存在しない
    if quality not in LIVESTREAM_QUALITY:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail='Specified quality was not found',
        )

    # ***** ライブストリームの状態を返却する *****

    # ライブストリームを取得
    # ステータスを取得したいだけなので、接続はしない
    livestream = LiveStream(channel_id, quality)

    # そのまま返す
    return livestream.getStatus()


@router.get(
    '/live/{channel_id}/{quality}/events',
    summary = 'ライブストリーム イベント API',
    response_class = Response,
    responses = {
        status.HTTP_200_OK: {
            'description': 'ライブストリームのイベントが随時配信されるイベントストリーム。',
            'content': {'text/event-stream': {}}
        }
    }
)
async def LiveStreamEventAPI(
    channel_id:str = Path(..., description='チャンネル ID 。ex:gr011'),
    quality:str = Path(..., description='映像の品質。ex:1080p'),
):
    """
    ライブストリームのイベントを Server-Sent Events で随時配信する。

    イベントには、

    - ステータスの更新を示す **status_update**
    - ステータス詳細の更新を示す **detail_update**
    - クライアント数の更新を示す **client_update**

    の3種類がある。

    どのイベントでも配信される JSON 構造は同じ。<br>
    ステータスが Offline になった、あるいは既にそうなっている時は、status_update イベントが配信された後に接続を終了する。
    """

    # ***** バリデーション *****

    # 指定されたチャンネル ID が存在しない
    if await Channels.filter(channel_id=channel_id).get_or_none() is None:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail='Specified channel_id was not found',
        )

    # 指定された映像の品質が存在しない
    if quality not in LIVESTREAM_QUALITY:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail='Specified quality was not found',
        )

    # ***** イベントの配信 *****

    # ライブストリームを取得
    # ステータスを取得したいだけなので、接続はしない
    livestream = LiveStream(channel_id, quality)

    # ステータスの変更を監視し、変更があればステータスをイベントストリームとして出力する
    async def generator():
        """イベントストリームを出力するジェネレーター"""
        previous_status = livestream.getStatus()  # 初期値
        while True:

            # 現在のライブストリームのステータスを取得
            status = livestream.getStatus()

            # 取得したステータスが Offline であれば配信を停止する
            # 実際には JavaScript 側での対応が必要（自動で再接続してしまうため）
            if status['status'] == 'Offline':
                yield {
                    'event': 'status_update',  # status_update イベントを設定
                    'data': status,
                }
                break

            # 以前の結果と異なっている場合のみレスポンスを返す
            if previous_status != status:

                # ステータスが以前と異なる
                if previous_status['status'] != status['status']:
                    yield {
                        'event': 'status_update',  # status_update イベントを設定
                        'data': status,
                    }
                # 詳細が以前と異なる
                elif previous_status['detail'] != status['detail']:
                    yield {
                        'event': 'detail_update',  # detail_update イベントを設定
                        'data': status,
                    }
                # クライアント数が以前と異なる
                elif previous_status['client_count'] != status['client_count']:
                    yield {
                        'event': 'client_update',  # client_update イベントを設定
                        'data': status,
                    }

                # 取得結果を保存
                previous_status = copy.copy(status)

            # 一応スリープを入れておく
            await asyncio.sleep(0.05)

    # EventSourceResponse でイベントストリームを配信する
    return EventSourceResponse(generator())


@router.get(
    '/live/{channel_id}/{quality}/mpegts',
    summary = 'ライブ MPEGTS ストリーム API',
    response_class = Response,
    responses = {
        status.HTTP_200_OK: {
            'description': 'ライブ MPEGTS ストリーム。',
            'content': {'video/mp2t': {}}
        }
    }
)
async def LiveMPEGTSStreamAPI(
    channel_id:str = Path(..., description='チャンネル ID 。ex:gr011'),
    quality:str = Path(..., description='映像の品質。ex:1080p'),
):
    """
    ライブ MPEGTS ストリームを配信する。

    同じチャンネル ID 、同じ画質のライブストリームが Offline 状態のときは、新たにエンコードタスクを立ち上げて、
    ONAir 状態になるのを待機してからストリームデータを配信する。<br>
    同じチャンネル ID 、同じ画質のライブストリームが ONAir 状態のときは、新たにエンコードタスクを立ち上げることなく、他のクライアントとストリームデータを共有して配信する。

    何らかの理由でライブストリームが終了しない限り、継続的にレスポンスが出力される（ストリーミング）。
    """

    # ***** バリデーション *****

    # 指定されたチャンネル ID が存在しない
    if await Channels.filter(channel_id=channel_id).get_or_none() is None:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail='Specified channel_id was not found',
        )

    # 指定された映像の品質が存在しない
    if quality not in LIVESTREAM_QUALITY:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail='Specified quality was not found',
        )

    # ***** エンコードタスクの開始 *****

    # ライブストリームに接続し、クライアント ID を取得する
    # 接続時に Offline だった場合は自動的にエンコードタスクが起動される
    livestream = LiveStream(channel_id, quality)
    client_id = livestream.connect('mpegts')

    # ***** ライブストリームの読み取り・出力 *****

    def generator():
        """ライブストリームを出力するジェネレーター"""
        while True:

            # ライブストリームが Offline ではない
            if livestream.getStatus()['status'] != 'Offline':

                # 登録した Queue から受信したストリームデータ
                stream_data = livestream.read(client_id)

                # ストリームデータが存在する
                if stream_data is not None:

                    # Queue から取得したストリームデータを yield で返す
                    yield stream_data

                # stream_data に None が入った場合はエンコードタスクが終了したものとみなす
                else:
                    break

            # ライブストリームが Offline になったのでループを抜ける
            else:
                break

    # リクエストがキャンセルされたときにライブストリームへの接続を切断できるよう、モンキーパッチを当てる
    # StreamingResponse はリクエストがキャンセルされるとレスポンスを強制終了してしまう
    # そうするとリクエストがキャンセルされたか判定できないため、StreamingResponse.listen_for_disconnect() を書き換える
    # ref: https://github.com/encode/starlette/pull/839
    from starlette.types import Receive
    async def listen_for_disconnect_monkeypatch(self, receive: Receive) -> None:
            while True:
                message = await receive()
                if message['type'] == 'http.disconnect':
                    # ライブストリームへの接続を切断する（クライアントを削除する）
                    livestream.disconnect(client_id)
                    break
    StreamingResponse.listen_for_disconnect = listen_for_disconnect_monkeypatch

    # StreamingResponse で読み取ったストリームデータをストリーミングする
    return StreamingResponse(generator(), media_type='video/mp2t')
