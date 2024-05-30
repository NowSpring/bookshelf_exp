import uuid
from django.db import models
from django.conf import settings


class BookListType(models.Model):

  id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
  type = models.CharField(verbose_name = "種類", max_length = 100)

  def __str__(self):

    return f"{self.type}"


class BookList(models.Model):

  id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
  owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name = "所有者")
  type = models.ForeignKey(BookListType, on_delete=models.CASCADE, related_name='booklisttype')
  is_completed = models.BooleanField(verbose_name = "作成状況", default = False)

  def __str__(self):

    return f"{self.type} by {self.owner}"


class Book(models.Model):

  id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
  booklist = models.ForeignKey(BookList, on_delete=models.CASCADE, related_name='booklist')
  title = models.CharField(verbose_name = "タイトル", max_length = 100, default = "未登録")
  description = models.CharField(verbose_name = "概要", max_length = 500, default = "未登録")
  image = models.CharField(verbose_name = "イメージ図", max_length = 500, default = "http://0.0.0.0:8000/media/no_image.jpg")
  order = models.IntegerField(verbose_name = "本順")

  class Meta:

    ordering = ['order']

  def __str__(self):

    return f"{self.title}"