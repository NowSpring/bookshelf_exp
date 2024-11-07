from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.decorators import action
from django.db.models import Prefetch
from itertools import groupby
from operator import attrgetter

from members.models import Member
from books.models import BookListType, BookList, Book, RecBook
from books.serializers import BookListTypeSerializer, BookListSerializer, BookSerializer, RecBookSerializer, BulkBookUpdateSerializer


class BookListTypeViewSet(viewsets.ModelViewSet):

  queryset = BookListType.objects.all()
  queryset = queryset.order_by('type')
  serializer_class = BookListTypeSerializer

  def get_serializer_context(self):

    context = super().get_serializer_context()
    context['owner_id'] = self.request.query_params.get('owner_id')

    return context


class BookListViewSet(viewsets.ModelViewSet):

  queryset = BookList.objects.all()
  serializer_class = BookListSerializer

  def get_queryset(self):

    queryset = super().get_queryset().select_related('owner').prefetch_related('booklist')
    booklisttype_id = self.request.query_params.get('booklisttype_id', None)
    member_id = self.request.query_params.get('member_id', None)

    if booklisttype_id:

      queryset = queryset.filter(type__id=booklisttype_id)

    if member_id:

      queryset = queryset.filter(owner__id=member_id)

    queryset = queryset.order_by('owner__username', 'type__type')

    return queryset

  @action(detail=False, methods=['get'], url_path='admin_view')
  def admin_view(self, request):

    booklisttype_id = request.query_params.get('booklisttype_id', None)

    if not booklisttype_id:

      return Response({"error": "booklisttype_id is required"}, status=status.HTTP_400_BAD_REQUEST)

    booklists = BookList.objects.filter(type__id=booklisttype_id).select_related('owner').prefetch_related('likes', 'booklist').order_by('owner__username')
    response_data = []

    for booklist in booklists:

      owner = booklist.owner
      books = booklist.booklist.all()
      likes = booklist.likes.all()

      book_data = {
        'id': booklist.id,
        'books': [
            {
                'id': book.id,
                'title': book.title,
                'order': book.order
            } for book in books
        ],
        'like_by': [
            {
                'id': like.id,
                'name': like.username
            } for like in likes
        ]
      }

      owner_data = {
        'id': owner.id,
        'name': owner.username
      }

      like_booklists = [
        str(liked_booklist.id) for liked_booklist in owner.liked_booklists.filter(type__id=booklisttype_id)
      ]

      response_data.append({
        'owner': owner_data,
        'booklist': book_data,
        'like_booklist': like_booklists
      })

    return Response(response_data, status=status.HTTP_200_OK)

  @action(detail=False, methods=['post'], url_path='like')
  def like(self, request):

    booklist_id = request.data.get('booklist_id')
    reviewer_id = request.data.get('reviewer_id')
    like = request.data.get('like')

    try:

      booklist = BookList.objects.get(id=booklist_id)
      reviewer = Member.objects.get(id=reviewer_id)

      if like:

        if not booklist.likes.filter(id=reviewer_id).exists():

          booklist.likes.add(reviewer)

      else:

        if booklist.likes.filter(id=reviewer_id).exists():

          booklist.likes.remove(reviewer)

      booklist.save()

      return Response(status=status.HTTP_204_NO_CONTENT)

    except BookList.DoesNotExist:

      return Response({'error': 'BookList not found'}, status=status.HTTP_404_NOT_FOUND)

    except Member.DoesNotExist:

      return Response({'error': 'Member not found'}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:

      return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class BookViewSet(viewsets.ModelViewSet):

  queryset = Book.objects.all()
  serializer_class = BookSerializer

  def get_queryset(self):

    queryset = super().get_queryset()
    booklist_id = self.request.query_params.get('booklist_id', None)

    if booklist_id is not None:

      queryset = queryset.filter(booklist=booklist_id)

    return queryset

  @action(detail=False, methods=['put'], url_path='bulk_update')
  def bulk_update(self, request, *args, **kwargs):

    serializer = BulkBookUpdateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    books = serializer.update(instance=None, validated_data=serializer.validated_data)

    return Response(BookSerializer(books, many=True).data, status=status.HTTP_200_OK)


class RecBookViewSet(viewsets.ModelViewSet):

  queryset = RecBook.objects.all()
  serializer_class = RecBookSerializer

  def get_queryset(self):

    queryset = super().get_queryset()
    booklist_id = self.request.query_params.get('booklist_id', None)

    if booklist_id is not None:

      queryset = queryset.filter(booklist=booklist_id)

    return queryset

  @action(detail=True, methods=['put'], url_path='update_wants')
  def update_wants(self, request, pk=None):
    try:
      rec_book = self.get_object()
      want_to_see = request.data.get('want_to_see')
      want_to_rewatch = request.data.get('want_to_rewatch')

      if want_to_see is not None:
        rec_book.want_to_see = want_to_see

      if want_to_rewatch is not None:
        rec_book.want_to_rewatch = want_to_rewatch

      rec_book.save()
      return Response(RecBookSerializer(rec_book).data, status=status.HTTP_200_OK)

    except RecBook.DoesNotExist:
      return Response({'error': 'RecBook not found'}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
      return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

  @action(detail=False, methods=['get'], url_path='admin_view')
  def admin_view(self, request):
    try:
      booklisttype_id = request.query_params.get('booklisttype_id')
      if not booklisttype_id:
        return Response(
          {'error': 'booklisttype_id is required'},
          status=status.HTTP_400_BAD_REQUEST
        )

      # BookListを通じてRecBookを取得
      rec_books = RecBook.objects.filter(
        booklist__type_id=booklisttype_id
      ).select_related('booklist__owner')

      # ユーザーごとにグループ化
      grouped_data = []
      for owner_id, books in groupby(rec_books, key=lambda x: x.booklist.owner):
        books_list = list(books)
        if books_list:
          grouped_data.append({
            'username': books_list[0].booklist.owner.username,
            'rec_books': [{
              'title': book.title,
              'description': book.description,
              'image': book.image,
              'rec_method': book.rec_method,
              'want_to_see': book.want_to_see,
              'want_to_rewatch': book.want_to_rewatch,
            } for book in books_list]
          })

      return Response(grouped_data, status=status.HTTP_200_OK)

    except Exception as e:
      return Response(
        {'error': str(e)},
        status=status.HTTP_400_BAD_REQUEST
      )
