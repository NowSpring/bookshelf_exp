from django.core.management.base import BaseCommand
from books.models import BookListType

class Command(BaseCommand):
    help = 'Create default BookListType instances'

    def handle(self, *args, **options):
        # 作成したいBookListTypeの一覧
        types = [
            'ギャグ',
            'バトル',
            'ラブコメ',
            '手に汗握る',
            '胸が締め付けられる',
            '心温まる'
        ]

        # 各タイプに対してBookListTypeを作成
        for type_name in types:
            booklist_type, created = BookListType.objects.get_or_create(
                type=type_name
            )

            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Successfully created BookListType "{type_name}"')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'BookListType "{type_name}" already exists')
                )