from django.contrib import admin
from .models import BookListType, BookList, Book
from django.utils.html import format_html


@admin.register(BookListType)
class BookListTypeAdmin(admin.ModelAdmin):

  list_display = ('type',)



@admin.register(BookList)
class BookListAdmin(admin.ModelAdmin):

  list_display = ('owner_name', 'type', 'is_completed')

  @admin.display(ordering='owner__username', description='編集者')
  def owner_name(self, obj):

    return obj.owner.username


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):

  list_display = ('title', 'order', 'booklist_type', 'booklist_owner')
  search_fields = ('title', 'booklist__type__type', 'booklist__owner__username')
  ordering = ('booklist__owner__username', 'booklist__type__type', 'order', 'title')

  @admin.display(ordering='booklist__type', description='タイプ')
  def booklist_type(self, obj):

    return obj.booklist.type

  @admin.display(ordering='booklist__owner__username', description='編有者')
  def booklist_owner(self, obj):

    return obj.booklist.owner.username

  def get_queryset(self, request):

    queryset = super().get_queryset(request)

    return queryset.select_related('booklist', 'booklist__owner')
