from rest_framework import serializers
from .models import *

class LogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Log
        fields = ('id', 'pos','message','create_at')