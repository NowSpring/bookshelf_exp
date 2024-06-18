from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.decorators import action

from books.models import BookListType, BookList, Book
from books.serializers import BookListTypeSerializer, BookListSerializer, BookSerializer, BulkBookUpdateSerializer


class BookListTypeViewSet(viewsets.ModelViewSet):

  queryset = BookListType.objects.all()
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

    if booklisttype_id is not None:

      queryset = queryset.filter(type__id=booklisttype_id)

    if member_id is not None:

      queryset = queryset.filter(owner__id=member_id)

    queryset = queryset.order_by('owner__username')

    return queryset


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
