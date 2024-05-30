# from drf_writable_nested import WritableNestedModelSerializer
from django.contrib.auth import password_validation
from rest_framework import serializers, fields
from members.models import Member

class MemberSerializer(serializers.ModelSerializer):

  class Meta:

    model = Member
    fields = '__all__'

  def validate_password(self, password):
    """入力JSONで指定されたpasswordに対してsettings.AUTH_PASSWORD_VALIDATORSで指定したバリデーションを実行"""
    if password_validation.validate_password(password) is False:
      raise serializers.ValidationError(f'The password {password} is not valid')
    return password

  # ユーザー作成時にパスワードを暗号化する
  def create(self, validated_data):
    # 後で使うので入力された生のパスワードを取得しておく
    unhashed_password = validated_data.pop('password', None)
    # パスワードを削除した入力データからUser型のインスタンスを生成
    new_user = self.Meta.model(**validated_data)
    # パスワードをハッシュ化してセットし、DBに保存
    if unhashed_password is not None:
      new_user.set_password(unhashed_password)
    new_user.save()
    return new_user

  # ユーザー更新時にパスワードを暗号化する
  def update(self, pre_update_user, validated_data):
    # 更新されるユーザーのフィールドを入力データの値に書き換えていく
    for field_name, value in validated_data.items():
      # passwordを更新する際は入力データの値をset_password()の引数に渡してハッシュ化
      if field_name == 'password':
        pre_update_user.set_password(value)
      # password以外のフィールドを更新する際は入力データでそのまま上書きでOK
      else:
        setattr(pre_update_user, field_name, value)
    pre_update_user.save()
    return pre_update_user