from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import AllowAny, IsAuthenticated

from members.models import Member
from members.serializers import MemberSerializer

class MemberViewSet(viewsets.ModelViewSet):
  
  queryset = Member.objects.all()
  serializer_class = MemberSerializer
  authentication_classes = (TokenAuthentication,)
  # permission_classes = (IsAuthenticated, )
  
  def get_permissions(self):
    
    if self.action == 'create':
      
      permission_classes = [AllowAny]
    
    else:
      
      permission_classes = [IsAuthenticated]
    
    return [permission() for permission in permission_classes]
  


class CustmAuthToken(ObtainAuthToken):
  
  def post(self, request, *args, **kwargs):
    
    serializer = self.serializer_class(data = request.data, context = {'request':request})
    serializer.is_valid(raise_exception = True)
    user = serializer.validated_data['user']
    token, created = Token.objects.get_or_create(user = user)
    
    user_serializer = MemberSerializer(user)
    
    return Response({'token':token.key, 'user': user_serializer.data})