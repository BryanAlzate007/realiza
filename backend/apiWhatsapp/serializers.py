from rest_framework import serializers
from .models import WhatsAppMessage

class WhatsAppMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = WhatsAppMessage
        fields = ['id', 'phone_number', 'message', 'timestamp', 'is_from_me', 'message_type']
