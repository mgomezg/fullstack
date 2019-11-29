from rest_framework import viewsets
from .serializers import *
from .models import *
from django.http import JsonResponse


    
class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    
    def destroy(self, request, pk=None):
        try:
            book = self.get_object()
            book.delete()
            response_data = {
                'status' : 'ok'
            }
            return JsonResponse(response_data)
        except Exception as e:
            response_data = {
                'status' : 'error',
                'exception': str(e),
            }
            return JsonResponse(response_data)

        

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer