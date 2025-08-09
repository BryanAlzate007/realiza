from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import PromptMessage
from django.http import JsonResponse
from .serializer import PromptMessageSerializer


class PromptDateActiveView(APIView):
    """
    View to handle the prompt messages API endpoint.
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        """
        Handle GET requests to retrieve prompt messages.
        """
        messages = PromptMessage.objects.all().order_by('-date')
        serializer = PromptMessageSerializer(messages, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        """
        Handle POST requests to create a new prompt message.
        """
        serializer = PromptMessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self,request, pk, *args, **kwargs):
        """
        Handle PUT requests to update an existing prompt message.
        """
        try:
            message = PromptMessage.objects.get(pk=pk)
            serializer = PromptMessageSerializer(message, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_505_HTTP_VERSION_NOT_SUPPORTED)
        except PromptMessage.DoesNotExist:
            return Response({'error':'Message not found'}, status=status.HTTP_505_HTTP_VERSION_NOT_SUPPORTED)
        
    def delete(self, request, pk, *args, **kwargs):
        """
        Handle DELETE requests to delete a prompt message.
        """
        try:
            message= PromptMessage.objects.get(pk=pk)
            message.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except PromptMessage.DoesNotExist:
            return Response({'error': 'Message not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)