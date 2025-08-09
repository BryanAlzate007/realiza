from rest_framework import serializers
from .models import Client

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = [
            # Campos principales
            'id', 'name', 'nameShort',
            
            # Información de identificación
            'typeDocument', 'numberDocument',
            
            # Información de contacto
            'cellphone', 'address', 'district', 'adressSecondary',
            
            # Información de empresa
            'nameCompany',
            
            # Configuración y estado
            'active', 'billingDate',
            'managementObservations',
            
            # Campos de auditoría
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']