from rest_framework.serializers import ModelSerializer
from .models import PromptMessage

class PromptMessageSerializer(ModelSerializer):
    class Meta:
        model = PromptMessage
        fields = ['id', 'message', 'date', 'active']