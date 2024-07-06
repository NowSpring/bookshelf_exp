from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.forms import ModelForm
from django.utils.html import format_html
from django.urls import reverse

from members.models import Member
from books.models import BookList


class BookListLikesInlineForm(ModelForm):
    class Meta:
        model = BookList.likes.through
        fields = []

class BookListInline(admin.TabularInline):
    model = BookList.likes.through  # ManyToMany中間テーブルへの参照
    form = BookListLikesInlineForm
    extra = 0
    can_delete = False
    readonly_fields = ('booklist_id', 'booklist_owner', 'booklist_type')
    verbose_name = 'いいねしたBOOKLIST'
    verbose_name_plural = 'いいねしたBOOKLIST'

    def has_add_permission(self, request, obj=None):
        return False

    def booklist_id(self, obj):
        link = reverse('admin:books_booklist_change', args=[obj.booklist.id])
        return format_html('<a href="{}">{}</a>', link, obj.booklist.id)
    booklist_id.short_description = 'ID'

    def booklist_owner(self, obj):
        return obj.booklist.owner.username
    booklist_owner.short_description = '編集者'

    def booklist_type(self, obj):
        return obj.booklist.type
    booklist_type.short_description = 'テーマ'

class UserAdminConfig(UserAdmin):
    model = Member
    search_fields = ('username', 'email',)
    list_filter = ('username', 'email', 'is_active', 'is_staff', 'is_superuser')
    ordering = ('username',)
    list_display = ('username', 'email', 'is_active', 'is_staff', 'is_superuser')
    fieldsets = (
        (None, {'fields': ('username', 'email', 'birthday', 'password')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'is_active', 'is_staff', 'is_superuser')}
        ),
    )
    inlines = [BookListInline]

admin.site.register(Member, UserAdminConfig)