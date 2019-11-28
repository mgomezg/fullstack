from django.shortcuts import render
from rest_framework import viewsets
from .serializers import *
from .models import *


# Create your views here.
class LogViewSet(viewsets.ModelViewSet):
    queryset = Log.objects.all()
    serializer_class = LogSerializer