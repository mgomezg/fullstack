from rest_framework import serializers
from .models import *


class BookSerializer(serializers.ModelSerializer):

    category = serializers.StringRelatedField()
    
    class Meta:
        model = Book
        fields = ('id','title','category','thumbnail','description','price','stock','upc')


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name')