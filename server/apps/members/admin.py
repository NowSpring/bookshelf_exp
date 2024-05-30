from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from members.models import Member

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


admin.site.register(Member, UserAdminConfig)