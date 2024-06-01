from django.db import transaction
from rest_framework import serializers

from members.serializers import MemberSerializer
from books.models import Book, BookList, BookListType

import logging

logger = logging.getLogger(__name__)


class BookSerializer(serializers.ModelSerializer):

  id = serializers.UUIDField(required=True)

  class Meta:

    model = Book
    fields = ['id', 'title', 'description', 'image', 'order', 'booklist']


class BulkBookUpdateSerializer(serializers.Serializer):

  books = BookSerializer(many=True)
  id = serializers.UUIDField()
  is_completed = serializers.BooleanField()

  def update(self, instance, validated_data):

    books_data = validated_data.pop('books')
    id = validated_data.pop('id')
    is_completed = validated_data.pop('is_completed')
    books_to_update = []

    for book_data in books_data:

      book = Book.objects.get(id=book_data['id'])
      book.title = book_data['title']
      book.description = book_data['description']
      book.image = book_data['image']
      book.order = book_data['order']
      books_to_update.append(book)

    with transaction.atomic():

      Book.objects.bulk_update(books_to_update, ['title', 'description', 'image', 'order'])

      booklist = BookList.objects.get(id = id)
      booklist.is_completed = is_completed
      booklist.save()

    return books_to_update


class BookListSerializer(serializers.ModelSerializer):

  owner = MemberSerializer(read_only=True)
  books = BookSerializer(many=True, read_only=True, source='booklist')

  class Meta:

    model = BookList
    fields = "__all__"

  def get_books(self, obj):

    books = obj.booklist.order_by('order')

    return BookSerializer(books, many=True, read_only=True).data


class BookListTypeSerializer(serializers.ModelSerializer):

  class Meta:

    model = BookListType
    fields = "__all__"
