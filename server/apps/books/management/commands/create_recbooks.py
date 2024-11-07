import json
import os
from django.core.management.base import BaseCommand
from books.models import RecBook, BookList, BookListType
from django.contrib.auth import get_user_model
from django.db import IntegrityError

User = get_user_model()

class Command(BaseCommand):
    help = 'Create or update RecBook instances from JSON files'

    def handle(self, *args, **options):
        base_path = 'apps/books/datas/rec'
        rec_methods = [d for d in os.listdir(base_path) if os.path.isdir(os.path.join(base_path, d))]

        for rec_method in rec_methods:
            method_path = os.path.join(base_path, rec_method)
            json_files = [f for f in os.listdir(method_path) if f.endswith('_recbook_lists.json')]

            for json_file in json_files:
                genre = json_file.split('_')[0]
                file_path = os.path.join(method_path, json_file)

                with open(file_path, 'r', encoding='utf-8') as file:
                    data = json.load(file)

                    for user_data in data:
                        username = user_data['username']
                        try:
                            user = User.objects.get(username=username)
                        except User.DoesNotExist:
                            try:
                                user = User.objects.create(username=username, email=f"{username}@example.com")
                            except IntegrityError:
                                self.stdout.write(self.style.WARNING(f"Could not create user {username}. Skipping..."))
                                continue

                        booklist_type, _ = BookListType.objects.get_or_create(type=genre)
                        booklist, _ = BookList.objects.get_or_create(owner=user, type=booklist_type)

                        for book in user_data['rec_books']:
                            recbook, created = RecBook.objects.update_or_create(
                                booklist=booklist,
                                title=book['title'],
                                defaults={
                                    'description': book['description'],
                                    'image': book['image'],
                                }
                            )

                            # rec_methodを更新
                            current_methods = list(recbook.rec_method)
                            if rec_method not in current_methods:
                                current_methods.append(rec_method)
                                recbook.rec_method = current_methods
                                recbook.save()

                            action = 'Created' if created else 'Updated'
                            self.stdout.write(self.style.SUCCESS(f'{action} RecBook: {recbook.title} for {username} with method {rec_method}'))
