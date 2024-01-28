# 手順

## キューが作成済みであることを確認する
bin/list-queue.sh

## キューに登録されているメッセージをすべて削除する
bin/purge-queue.sh

## テーブルの状態をリセットする
bin/rebuild-db.sh

## コンテナをリビルドする
docker compose up --build -d

## データベースのコンテナに入ってテーブルを確認する
docker compose exec mysql bash
mysql -uroot -prootpassword
(中略)
select * from greetings;

## Node.jsのコンテナに入る
docker compose exec nodejs bash

### Workerのプロセスを確認する
pm2 list

### プロセスのログを開いておく
pm2 logs --raw

### クライアントからメッセージを送信する
node src/client.js
