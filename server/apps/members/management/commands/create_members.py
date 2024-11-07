import json
from django.core.management.base import BaseCommand
from members.models import Member  # Memberモデルのインポート

class Command(BaseCommand):
  help = 'Create Member instances from JSON file'

  def handle(self, *args, **kwargs):
    # JSONファイルのパス
    json_file_path = 'apps/books/datas/raw/ギャグ_book_lists.json'

    # JSONファイルを読み込む
    with open(json_file_path, 'r', encoding='utf-8') as file:
      data = json.load(file)

      # Memberインスタンスを生成
      for item in data:
        base_email = 'test@co.jp'  # 基本のemail
        username = item['owner']['username']  # usernameを設定

        # ユニークなemailを生成
        email = base_email
        count = 1
        while Member.objects.filter(email=email).exists():
          email = f'test{count:02d}@co.jp'  # test01@co.jp, test02@co.jp の形式で生成
          count += 1

        # Memberインスタンスを作成
        member = Member(
          email=email,
          username=username,
          password='password',
          # 他の必要なフィールドがあればここに追加
        )
        member.save()  # データベースに保存

    self.stdout.write(self.style.SUCCESS('Successfully created Member instances.'))