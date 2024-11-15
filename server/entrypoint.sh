#!/bin/sh

# 初期化フラグファイルのパス
INIT_FLAG="/usr/src/init/init.flag"

# 初期化が済んでいない場合のみ実行
if [ ! -f "$INIT_FLAG" ]; then
    echo "Running initial setup..."

    # データベースのマイグレーション
    python manage.py migrate

    # スーパーユーザーの作成
    echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser(username='admin', email='admin@co.jp', password='admin') if not User.objects.filter(username='admin').exists() else None" | python manage.py shell

    # 各種初期データの作成
    python manage.py create_members
    python manage.py create_booklisttypes
    python manage.py update_books
    python manage.py create_recbooks

    # 初期化完了フラグを作成
    mkdir -p /usr/src/init
    touch "$INIT_FLAG"
    echo "Initial setup completed."
else
    echo "Initial setup already done. Skipping..."
fi

# Djangoの開発サーバーを起動
python manage.py runserver 0.0.0.0:8000
