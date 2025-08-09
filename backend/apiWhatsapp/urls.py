from django.urls import path
from .views import WhatsAppWebhookView, WhatsAppMessagesView

app_name = 'apiWhatsapp'

urlpatterns = [
    path('webhook/', WhatsAppWebhookView.as_view(), name='whatsapp-webhook'),
    path('messages/', WhatsAppMessagesView.as_view(), name='whatsapp-messages'),
]