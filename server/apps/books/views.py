from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.decorators import action

from members.models import Member
from books.models import BookListType, BookList, Book
from books.serializers import BookListTypeSerializer, BookListSerializer, BookSerializer, BulkBookUpdateSerializer


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

  @action(detail=False, methods=['post'], url_path='like')
  def like(self, request):

    booklist_id = request.data.get('booklist_id')
    reviewer_id = request.data.get('reviewer_id')
    like = request.data.get('like')

    print()
    print("booklist_id:", booklist_id)
    print("reviewer_id:", reviewer_id)
    print("like:", like)
    print("like.type:", type(like))
    print()

    try:

      booklist = BookList.objects.get(id=booklist_id)
      reviewer = Member.objects.get(id=reviewer_id)

      if like:

        if not booklist.likes.filter(id=reviewer_id).exists():

          print()
          print("true")
          print()

          booklist.likes.add(reviewer)

      else:

        if booklist.likes.filter(id=reviewer_id).exists():

          print()
          print("false")
          print()

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
