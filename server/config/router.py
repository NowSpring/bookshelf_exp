from rest_framework import routers

from apps.members.views import MemberViewSet
from apps.books.views import BookListTypeViewSet, BookListViewSet, BookViewSet, RecBookViewSet

router = routers.DefaultRouter()
router.register('member', MemberViewSet)
router.register('booklisttype', BookListTypeViewSet)
router.register('booklist', BookListViewSet)
router.register('book', BookViewSet)
router.register('recbook', RecBookViewSet)