import os
from django.db.models.signals import post_save, pre_save, pre_delete
from django.dispatch import receiver, Signal
from django.conf import settings
from .models import BookListType, BookList, Book
from django.contrib.auth import get_user_model

User = get_user_model()
booklist_created = Signal()

@receiver(post_save, sender=User)
def create_user_booklist(sender, instance, created, **kwargs):

  if created:

    bookLists = []
    book_list_types = BookListType.objects.all()

    # 各BookListTypeに対してBookListを作成
    for book_list_type in book_list_types:

      xBookList = BookList(owner = instance, type = book_list_type)
      bookLists.append(xBookList)

    BookList.objects.bulk_create(bookLists)

    for booklist in bookLists:

      booklist_created.send(sender = BookList, instance = booklist)


@receiver(post_save, sender=BookListType)
def create_booklisttype_booklist(sender, instance, created, **kwargs):

  if created:

    bookLists = []
    users = User.objects.all()

    for xUser in users:

      xBookList = BookList(owner = xUser, type = instance)
      bookLists.append(xBookList)

    BookList.objects.bulk_create(bookLists)

    # すべてのBookListインスタンスに対してカスタムシグナルを送信
    for booklist in bookLists:

      booklist_created.send(sender = BookList, instance = booklist)


@receiver(booklist_created)
def create_booklist_books(sender, instance, **kwargs):

  books = []

  for i in range(5):

    xBook = Book(booklist = instance, order = i)
    books.append(xBook)

  Book.objects.bulk_create(books)


# @receiver(pre_save, sender=Book)
# def delete_old_image_on_change(sender, instance, **kwargs):

#   if not instance.pk:

#     return False

#   try:

#     old_image = Book.objects.get(pk=instance.pk).image

#   except Book.DoesNotExist:

#     return False

#   new_image = instance.image

#   if old_image and old_image.url != new_image.url and old_image.name != "no_image.jpg":

#     if os.path.isfile(old_image.path):

#       os.remove(old_image.path)


# @receiver(pre_delete, sender=Book)
# def delete_image_on_delete(sender, instance, **kwargs):

#   image = instance.image

#   if image and image.name != "no_image.jpg":

#     if os.path.isfile(image.path):

#       os.remove(image.path)