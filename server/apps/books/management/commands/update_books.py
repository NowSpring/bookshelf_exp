import json
import os
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from books.models import Book, BookList, BookListType

User = get_user_model()

class Command(BaseCommand):
    help = 'Update Book instances from JSON files based on BookListType and username'

    def handle(self, *args, **kwargs):
        # データフォルダのパス
        data_folder_path = 'apps/books/datas/raw'

        # すべてのBookListTypeを取得
        booklist_types = BookListType.objects.all()

        for booklist_type in booklist_types:
            # JSONファイル名を生成
            json_file_name = f"{booklist_type.type}_book_lists.json"
            json_file_path = os.path.join(data_folder_path, json_file_name)

            # JSONファイルが存在するか確認
            if not os.path.exists(json_file_path):
                self.stdout.write(self.style.WARNING(f'File {json_file_name} does not exist. Skipping...'))
                continue

            # JSONファイルを読み込む
            with open(json_file_path, 'r', encoding='utf-8') as file:
                data = json.load(file)

                # 各エントリに対してBookインスタンスを更新
                for entry in data:
                    owner_data = entry.get('owner')
                    if not owner_data:
                        self.stdout.write(self.style.ERROR('Owner data not found in JSON entry.'))
                        continue

                    username = owner_data.get('username')
                    if not username:
                        self.stdout.write(self.style.ERROR('Username not found in owner data.'))
                        continue

                    try:
                        user = User.objects.get(username=username)
                    except User.DoesNotExist:
                        self.stdout.write(self.style.ERROR(f'User with username {username} does not exist.'))
                        continue

                    # BookListを取得
                    try:
                        booklist = BookList.objects.get(owner=user, type=booklist_type)
                    except BookList.DoesNotExist:
                        self.stdout.write(self.style.ERROR(f'BookList for user {username} with type {booklist_type.type} does not exist.'))
                        continue

                    # 各本の情報を更新
                    for book_data in entry.get('books', []):
                        order = book_data.get('order')
                        if order is None:
                            self.stdout.write(self.style.ERROR('Order not found in book data.'))
                            continue

                        try:
                            book = Book.objects.get(booklist=booklist, order=order)
                            book.title = book_data['title']
                            book.description = book_data['description']
                            book.image = book_data['image']
                            book.save()
                            self.stdout.write(self.style.SUCCESS(f'Book "{book.title}" updated successfully for user "{username}".'))
                        except Book.DoesNotExist:
                            self.stdout.write(self.style.ERROR(f'Book with order {order} does not exist in BookList for user "{username}".'))
