from django.urls import reverse_lazy
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import Client
from .serializers import ClientSerializer

class ClientListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        clients = Client.objects.all()
        serializer = ClientSerializer(clients, many=True)
        return Response(serializer.data)

class ClientDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk):
        try:
            client = Client.objects.get(pk=pk)
            serializer = ClientSerializer(client)
            return Response(serializer.data)
        except Client.DoesNotExist:
            return Response(
                {"error": "Cliente no encontrado"}, 
                status=status.HTTP_404_NOT_FOUND
            )
    def put(self, request, pk):
        try:
            client = Client.objects.get(pk=pk)
            serializer = ClientSerializer(client, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    "message": "Cliente actualizado exitosamente",
                    "data": serializer.data
                })
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Client.DoesNotExist:
            return Response(
                {"error": "Cliente no encontrado"}, 
                status=status.HTTP_404_NOT_FOUND
            )
    def delete(self, request, pk):
        try:
            client = Client.objects.get(pk=pk)
            client.delete()
            return Response(
                {"message": "Cliente eliminado exitosamente"},
                status=status.HTTP_204_NO_CONTENT
            )
        except Client.DoesNotExist:
            return Response(
                {"error": "Cliente no encontrado"}, 
                status=status.HTTP_404_NOT_FOUND
            )

class ClientCreateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def post(self, request, *args, **kwargs):
        # Verificar si ya existe un cliente con el mismo número de documento
        number_document = request.data.get('numberDocument')
        if Client.objects.filter(numberDocument=number_document).exists():
            return Response({
                "error": "Ya existe un cliente con este número de documento en el sistema"
            }, status=status.HTTP_400_BAD_REQUEST)

        serializer = ClientSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Cliente creado exitosamente",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

