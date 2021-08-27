
# Konomi

## 備考・注意事項

- 現在 α 版で、まだ実験的なプロダクトです。通常利用には耐えないでしょうし、サポートもできません。
  - 安定しているとは到底言いがたい品質ですが、それでも構わない方のみ導入してください。
  - 使い方などの説明も用意できていないため、自力でトラブルに対処できるエンジニアの方以外には現状おすすめできません。
  - 今後インストーラーを開発予定ですが、後述の通り現時点ではインストール方法がかなり煩雑になっています。
    - そもそも私の環境でしか動作確認をしていないため、他の環境で動作するのかさえも微妙です。
  - 完成予想はおろか、TVRemotePlus で実装していた機能に関してもほとんどカバーできていないため、現時点で TVRemotePlus を代替できるレベルには達していません。
- 機能的には TVRemotePlus の後継という位置づけですが、それはあくまで「精神的な」ものであり、実際の技術スタックや UI/UX は完全に新規設計となっています。
  - 確かに TVRemotePlus の開発で得られた知見を数多く活用していますし開発者も同じではありますが、ユーザービリティや操作感は大きく異なるはずです。
  - TVRemotePlus の技術スタックでは解決不可能なボトルネックを根本的に解消した上で、「同じものを作り直す」のではなく、ゼロから新しいテレビ視聴・録画視聴のユーザー体験を作り上げ、追求したいという想いから開発しています。
  - どちらかというと録画視聴機能の方がメインの予定でいますが、現時点ではテレビのライブ視聴機能のみの実装です。構想は壮大ですが、全て実装し終えるには年単位で時間がかかるでしょう。
- 将来的に EDCB (xtne6f版) にも対応予定ですが、現時点ではバックエンドとして Mirakurun が必要です。
  - お使いの録画環境に合わせ、番組情報などを取得するバックエンドを EDCB と Mirakurun のいずれかで選択できるようにする予定でいます。
- 現時点ではスマホには対応していません。Android であれば再生させる事自体は可能ですが、画面幅が PC 向けのため大幅に崩れ、まともに使えないでしょう。
  - タブレット (Fire HD 10 (2021), iPad mini 4) である程度動作することは確認しました。とはいえ、まだタッチデバイスに最適化できているわけではありません。
  - iPhone は Media Source Extensions API に対応していないため、現時点では動作しません。
    - 今後 HLS 再生モードを導入する予定ですが、私が iPhone を常用していない事もあり、実装時期は未定です。
- 今後、開発の過程で設定や構成が互換性なく大幅に変更される可能性があります。
- ユーザービリティなどのフィードバック・不具合報告・Pull Requests (PR) などは歓迎します。
  - 技術スタックはサーバー側が Python + [FastAPI](https://github.com/tiangolo/fastapi) + [Tortoise ORM](https://github.com/tortoise/tortoise-orm) + [Uvicorn](https://github.com/encode/uvicorn) 、クライアント側が Vue.js + [Vuetify](https://github.com/vuetifyjs/vuetify) の SPA です。
    - Vuetify は補助的に利用しているだけで、大部分は独自で書いた SCSS スタイルを適用しています。
  - コメントを多めに書いているので、少なくとも TVRemotePlus なんかよりかは読みやすいコードになっている…はず。
  - 他人が見るために書いたものではないのであれですが、一応自分用の[開発資料](https://mango-garlic-eff.notion.site/Konomi-90f4b25555c14b9ba0cf5498e6feb1c3)と[DB設計](https://www.notion.so/Konomi-544e02334c89420fa24804ec70f46b6d)的なメモを公開しておきます。もし PR される場合などの参考になれば。

## 動作環境

Python 3.9 がインストールされた Windows 10 Home で開発と動作確認を行っています。  
Python 3.8 でも動くとは思いますが、asyncio を多用しているため、3.7 以前ではまともに動作しない可能性が高いです。  
Linux での動作確認はしていませんが、今のところ OS 依存のコードはないはずなので、もしかすると動くかもしれません。

以下は Windows 10 での暫定的なインストール方法です。  
ただし、すべての環境でこの通りに進めて動くとは限りません。保証もできないので、すべて自己責任のもとでお願いします。

もし Linux で動かせた方がいましたら、ぜひ報告頂けると助かります。OS 依存の記述は今のところないはずです。  
将来的には Linux にも対応予定ですが、まだそこまでリソースを回せていません。

## インストール方法（暫定）

事前に Python 3.9 がインストールされている事を前提とします。  
なお、Microsoft ストアからインストールした Python では確実にまともに動作しません。

また、インストール先をデフォルトの AppData 以下にするとそのユーザーしか使えなくなってしまいますが、とはいえ `C:\Program Files` 以下にインストールするとパッケージのインストールで管理者権限が必要になるので厄介です。個人的には `C:\Applications\Python\Python3.9` あたりにインストールすることを推奨しておきます。

以下はほとんどコマンドメモです。詳細な解説はありませんし、開発者向けです。  
PowerShell にて実行してください。<s>cmd.exe? 今すぐ窓から投げ捨てろ</s>

### 1. pipenv のインストール

pipenv は pip の環境を仮想化してくれるツールです。  
pipenv を使えばパッケージをプロジェクトローカルにインストールできるので、依存関係の衝突などを気にする必要がありません。

```
pip install pipenv
```

### 2. Konomi 本体のインストール

現時点では Git を使うことを推奨します。

```
cd C:\Develop
git clone git@github.com:tsukumijima/Konomi.git
cd C:\Develop\Konomi\server
```

### 3. サードパーティライブラリのインストール

TVRemotePlus では Git の管理下に含めていましたが、Konomi ではバージョン情報のみを管理する方針としています。  
将来的にはインストーラー側で自動ダウンロード/アップデートするようにしたいところですが、現時点では手動でのダウンロードと配置が必要です。

一応 Linux 向けの実行ファイルも同梱してはいますが、実際に使えるかはわかりません。  
少なくとも、QSVEncC・NVEncC・VCEEncC に関しては別途 Intel Media Driver / NVIDIA Graphics Driver / AMD Driver のインストールが必要です。  
VCEEncC の Linux サポートはつい最近追加されたばかりなので、安定してエンコードできるかは微妙です。

[こちら](https://github.com/tsukumijima/Konomi/releases/download/v0.1.0/thirdparty.7z) からサードパーティライブラリをダウンロードし、`C:\Develop\Konomi\server\thirdparty` に配置してください。解凍後サイズは 600MB あるので注意。  
`C:\Develop\Konomi\server\thirdparty\FFmpeg` に `ffmpeg.exe` がある状態になっていれば OK です。

### 4. 依存パッケージのインストール

```
# pipenv のパッケージを直下に保存する環境変数を定義（これをつけないと AppData に置かれてしまい面倒）
$env:PIPENV_VENV_IN_PROJECT = "true"
pipenv install
```

### 5. データベースのアップグレード

[aerich](https://github.com/tortoise/aerich) という Tortoise ORM のマイグレーションツールを使っています。  
データベース構造が変更される度に、以下のコマンドを実行してデータベース構造を更新する必要があります。

```
pipenv run aerich upgrade
```

### 6. 設定ファイルの編集

ここまで手順通りにやっていれば `C:\Develop\Konomi\config.example.yaml` があるはずなので、同じ階層に config.yaml としてコピーします。  
設定ファイルは YAML ですが、JSON のようなスタイルで書いています。括弧がないとわかりにくいと思うので…

> JSON は YAML のサブセットなので、実は JSON は YAML として解釈可能です。

Mirakurun の URL だけ皆さんの録画環境に合わせて編集してください。  
他にも設定項目がありますが、おそらく変更する必要はありません。設定を反映するにはサーバーの再起動が必要です。  
今のところ、画質は `preferred_quality` の値がそのまま利用されます。プレイヤー側の画質切り替え機能は実装できていません。

なお、config.yaml が存在しなかったり、設定項目が誤っていると後述のサーバーの起動の時点でエラーが発生します。  
その際はエラーメッセージに従い、config.yaml の内容を確認してみてください。

### 7. サーバーの起動

FastAPI をホストする ASGI サーバーである Uvicorn を起動します。ポート 7000 にてリッスンされます。  
今のところ reload モードで起動させているため、コードの内容が変更されると自動的にサーバーが再起動されます。  

Uvicorn はアプリケーションサーバーであり、Konomi の場合は静的ファイルの配信も兼ねています。  
静的ファイル（ SPA クライアント）は `C:\Develop\Konomi\client\dist` にある、ビルド済みのファイルを配信するように設定されています。  
そのため、npm run build でクライアントのビルドを更新したのなら、サーバー側で配信されるファイルも更新されることになります。

クライアントは Vue.js で構築されており、コーディングとビルドには少なくとも Node.js が必要です。  
クライアント側のデバッグは client フォルダにて `npm run serve` を実行し、ポート 7001 にてリッスンされるデバッグ用サーバーにて行っています。  
`npm run serve` ではコードを変更すると自動的に差分の再ビルドがかかるため、毎回時間のかかる npm run build をする必要がありません。  
とはいえ API（サーバー）はポート 7000 にてリッスンされているので、開発時のみ API のアクセス先を同じホストのポート 7000 に固定しています。

```
pipenv run serve
```

起動してみて、何もエラーなく `Application startup complete.` と表示されていれば完了です。  
http://localhost:7000/ にアクセスすると、Konomi のホーム画面が表示されることでしょう。

初回起動時は Mirakurun から7日間分の番組情報をすべて取得してデータベースに保存するため、起動に1分くらいかかります。  
次回以降は差分のみをデータベースに保存・削除するので、最高でも10秒もすれば起動すると思います。  
番組情報の更新は今のところ15分に一度、バックグラウンドで自動的に行われます。ログにも出力されているはずです。

API ドキュメント (Swagger) は http://localhost:7000/api/docs にあります。  
リンクはいろいろありますが、ほとんどがまだ未着手のため 404 になっています。テレビのライブ視聴機能だけで見ても、まだ実装できていない箇所が多いです。  
とはいえ最低限視聴できる状態にはなっているはずです。まずは使ってみて、もしよければ感想をお聞かせください。

## License

[MIT License](License.txt)
