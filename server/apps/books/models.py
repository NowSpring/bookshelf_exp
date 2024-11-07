import uuid
from django.db import models
from django.conf import settings
from multiselectfield import MultiSelectField


class BookListType(models.Model):

  id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
  type = models.CharField(verbose_name = "種類", max_length = 100)

  def __str__(self):

    return f"{self.type}"


class BookList(models.Model):

  id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
  owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name="所有者", related_name='owned_booklists')
  type = models.ForeignKey(BookListType, on_delete=models.CASCADE, related_name='booklisttype')
  is_completed = models.BooleanField(verbose_name = "作成状況", default = False)
  likes = models.ManyToManyField('members.Member', verbose_name="いいね", blank=True)

  def __str__(self):

    return f"{self.type} by {self.owner}"


class Book(models.Model):

  id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
  booklist = models.ForeignKey(BookList, on_delete=models.CASCADE, related_name='booklist')
  title = models.CharField(verbose_name = "タイトル", max_length = 100, default = "未登録")
  description = models.CharField(verbose_name = "概要", max_length = 2000, default = "未登録")
  image = models.CharField(verbose_name="イメージ図", max_length=500, null=True, blank=True, default=None)
  order = models.IntegerField(verbose_name = "本順")

  class Meta:

    ordering = ['order']

  def __str__(self):

    return f"{self.title}"


class RecBook(models.Model):

  REC_METHOD_CHOICES = (
    ('pca_avg_vector_normal', 'PCA平均ベクトル(重みなし)'),
    ('pca_avg_vector_weighted', 'PCA平均ベクトル(重みあり)'),
    ('collaborative', '協調フィルタリング'),
    ('w2v_avg_vector', 'Word2Vec平均ベクトル'),
  )

  id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
  booklist = models.ForeignKey(BookList, on_delete=models.CASCADE, related_name='recbooklist')
  title = models.CharField(verbose_name = "タイトル", max_length = 100, default = "未登録")
  description = models.CharField(verbose_name = "概要", max_length = 2000, default = "未登録")
  image = models.CharField(verbose_name="イメージ図", max_length=500, null=True, blank=True, default=None)
  rec_method = MultiSelectField(choices=REC_METHOD_CHOICES, verbose_name="推薦手法", blank=True)
  want_to_see = models.BooleanField(verbose_name="読みたいフラグ", default=False)
  want_to_rewatch = models.BooleanField(verbose_name="ランキングインフラグ", default=False)

  def __str__(self):

    return f"{self.title}"
