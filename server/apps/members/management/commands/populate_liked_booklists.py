from django.core.management.base import BaseCommand
from books.models import BookList
from members.models import Member

class Command(BaseCommand):

  help = 'Populate liked_booklists for existing members'

  def handle(self, *args, **kwargs):

    for member in Member.objects.all():

      liked_booklists = BookList.objects.filter(likes=member)
      member.liked_booklists.set(liked_booklists)

    self.stdout.write(self.style.SUCCESS('Successfully populated liked_booklists'))
