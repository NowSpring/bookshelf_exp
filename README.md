# Web アプリ環境テンプレ

## Docker 環境構築（Django×Vue）

- [Docker で Python×Django×Vue.js の環境を構築する(サーバー起動編)](https://www.miracleave.co.jp/contents/1715/post-1715/)
- [Docker で Python×Django×Vue.js の環境を構築する(CORS 認証編)](https://www.miracleave.co.jp/contents/1863/post-1863/)

## バックエンドサーバー 編集

### DB 関連

- `python manage.py dbbackup`：DB のバックアップ作成
- `python manage.py dbrestore`：バックアップからデータをリストア
- `rm db.sqlite3`：DB ファイルを削除
- `rm apps/app_name/migrations/00*`：マイグレーション設定ファイルを削除

### フィルタを実装したデータ取得

- [Django Rest Framework で 特定のデータだけレスポンスするようにフィルタを設定する](https://qiita.com/Ajyarimochi/items/7e22de20292ca57ea8dc)
- [【Django Rest Framework】Django-Filter を使ってフィルタ機能をカスタマイズする](https://qiita.com/Ajyarimochi/items/a88331825667ce27cf48)

### その他

- [Django でアプリをアプリだけのフォルダににまとめる方法](https://qiita.com/HiroakiIwata/items/b75fff69c61fddd4487d)

## フロントエンドサーバー 編集

### Vite, Pinia, Router

- [Vite, Pinia, Router の導入](https://designsupply-web.com/media/programming/7603/)

### デザイン

- [Vuetify, mdi の導入](https://ashitaka-blog.com/vuetify3%E3%81%93%E3%81%A8%E3%81%AF%E3%81%98%E3%82%812%EF%BC%88vite%EF%BC%89/)

### eslint, prettier

- [eslint, prettier の導入](https://youtu.be/TTutJJUGMbY?si=-XiGVdyOhuT9Lsup)
  - [VSCode の editor.codeActionsOnSave の指定方法が boolean 値から変更されていた](https://zenn.dev/braveryk7/articles/source-fixall-eslint-value)
  - [【Vuetify】Component name "Home" should always be multi-word](https://zenn.dev/teba_eleven/articles/5af8f29e9e200d)
  - [Module is not defined and process is not defined in eslint in visual studio code](https://itecnote.com/tecnote/module-is-not-defined-and-process-is-not-defined-in-eslint-in-visual-studio-code/)
  - [【vue.js】VSCode で vue/no-multiple-template-root エラーの原因と対策](https://qiita.com/Moris_Mk-II/items/af0f986531e99e6bf3f0#:~:text=%27vue/no%2Dmultiple%2Dtemplate%2Droot%27%3A%20%27off%27%20%20%20%20//%20%E3%81%93%E3%82%8C%E3%81%A7%E3%81%93%E3%81%AE%E4%BD%99%E8%A8%88%E3%81%AA%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF%E6%A9%9F%E8%83%BD%E3%82%92%E3%81%8A%E3%81%A3%E3%81%B5%E3%81%AB%E5%87%BA%E6%9D%A5%E3%82%8B%E7%AD%88%E3%81%AA%E3%81%AE%E3%81%AB%E3%80%81%E3%82%A8%E3%83%A9%E3%83%BC%E3%81%AF%E8%A7%A3%E6%B6%88%E3%81%95%E3%82%8C%E3%81%9A%E3%80%82)

### エラー対応

- `rm -rf node_modules package-lock.json && npm install`：client サーバーで`npm run serve`実行に`sh: vue-cli-service: not found`のエラーが出た場合の対処

## その他

### vscode 操作

- [タブは半角スペース 2 つにしたい](https://simplesimples.com/web/application/vscode/tab-space/)
- [VSCode と Docker コンテナを接続](https://zenn.dev/ochamikan/articles/24465ac14a9e24#vscode%E3%81%A8docker%E3%82%B3%E3%83%B3%E3%83%86%E3%83%8A%E3%82%92%E6%8E%A5%E7%B6%9A)

### git 操作

- `rm -rf .git`：git ファイルを削除
- `git branch --contains`：作業中のブランチを表示
- [github アカウント切り替え](https://note.com/bluecode_inc/n/n3f67774c8642)
- `chown -R 【パーミッション値】 【ファイルパス】`：ディレクトリ以下のファイルの権限を一括変更
