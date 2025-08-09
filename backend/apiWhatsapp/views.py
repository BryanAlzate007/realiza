from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from pathlib import Path
from environ import Env
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.db.models import Max
from .models import WhatsAppMessage
from .serializers import WhatsAppMessageSerializer
from .services import WhatsAppService
import json
import requests

# Configurar la ruta del archivo .env de forma absoluta
BASE_DIR = Path(__file__).resolve().parent.parent
env_path = BASE_DIR / "config" / ".env"

config = Env()
config.read_env(str(env_path))

# WhatsApp API Configuration
WHATSAPP_API_VERSION = config("WHATSAPP_API_VERSION", cast=str)
PHONE_NUMBER_ID = config("BUSSINESS_PHONE", cast=str)
ACCESS_TOKEN = config("API_TOKEN", cast=str)
VERIFY_TOKEN = config("WEBHOOK_VERIFY_TOKEN", cast=str)

def send_whatsapp_message(phone_number, message):
    """
    Send a message through WhatsApp API
    """
    api_url = f"https://graph.facebook.com/{WHATSAPP_API_VERSION}/{PHONE_NUMBER_ID}/messages"
    
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }
    
    if not phone_number.startswith("57"):
        phone_number = "57" + phone_number
    
    data = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": phone_number,
        "type": "text",
        "text": {
            "body": message
        }
    }
    
    try:
        response = requests.post(api_url, headers=headers, json=data)
        response.raise_for_status()  
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error sending WhatsApp message: {str(e)}")
        if hasattr(e.response, 'text'):
            print(f"Response: {e.response.text}")
        raise

@method_decorator(csrf_exempt, name='dispatch')
class WhatsAppWebhookView(APIView):
    def get(self, request):
        """
        Handle the webhook verification from WhatsApp
        """
        # WhatsApp sends these parameters for verification
        mode = request.GET.get('hub.mode')
        token = request.GET.get('hub.verify_token')
        challenge = request.GET.get('hub.challenge')
        
        # Log verification attempt
        print(f"Webhook Verification - Mode: {mode}, Token: {token}, Challenge: {challenge}")
        
                
        # Validate all required parameters are present
        if not all([mode, token, challenge]):
            missing = []
            if not mode: missing.append('hub.mode')
            if not token: missing.append('hub.verify_token')
            if not challenge: missing.append('hub.challenge')
            return Response(
                {'error': f'Missing required parameters: {", ".join(missing)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verify the mode and token
        if mode == 'subscribe' and token == VERIFY_TOKEN:
            try:
                # Convert challenge to integer and return
                challenge_int = int(challenge)
                return Response(challenge_int, status=status.HTTP_200_OK)
            except ValueError:
                return Response(
                    {'error': 'Challenge parameter must be an integer'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # If we reach here, the verification failed
        if token != VERIFY_TOKEN:
            return Response(
                {'error': 'Invalid verification token'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        return Response(
            {'error': f'Invalid mode. Expected "subscribe", got "{mode}"'},
            status=status.HTTP_400_BAD_REQUEST
        )

    def post(self, request):
        """
        Handle incoming messages and events from WhatsApp
        """
        try:
            data = request.data
            print("Received WhatsApp webhook data:", json.dumps(data, indent=2))
            
            if 'entry' in data and len(data['entry']) > 0:
                entry = data['entry'][0]
                
                if 'changes' in entry and len(entry['changes']) > 0:
                    change = entry['changes'][0]
                    
                    if change.get('value', {}).get('messages', []):
                        message = change['value']['messages'][0]
                        
                        # Get the phone number
                        phone_number = message.get('from', '')
                        
                        # Handle different types of messages
                        if 'text' in message:
                            # Save text message
                            WhatsAppMessage.objects.create(
                                phone_number=phone_number,
                                message=message['text']['body'],
                                message_type='text'
                            )
                        elif 'image' in message:
                            # Save image message
                            WhatsAppMessage.objects.create(
                                phone_number=phone_number,
                                message=message['image'].get('caption', '[Image]'),
                                message_type='image'
                            )
                        # Add more message types as needed
                        
                return Response('OK', status=status.HTTP_200_OK)
            
            return Response('No message data', status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            print(f"Error processing message: {str(e)}")
            return Response(f'Error processing message: {str(e)}', 
                          status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class WhatsAppMessagesView(APIView):
    def get(self, request):
        """
        Get all conversations grouped by phone number
        """
        try:
            # Get all unique phone numbers with their latest message
            latest_messages = WhatsAppMessage.objects.values('phone_number').annotate(
                latest_timestamp=Max('timestamp')
            ).order_by('-latest_timestamp')
            
            conversations = {}
            for item in latest_messages:
                phone = item['phone_number']
                messages = WhatsAppMessage.objects.filter(phone_number=phone).order_by('timestamp')
                serializer = WhatsAppMessageSerializer(messages, many=True)
                conversations[phone] = serializer.data
            
            return Response(conversations)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        """
        Send a new message to a specific phone number
        """
        try:
            phone_number = request.data.get('phone_number')
            message = request.data.get('message')
            
            print(f"Attempting to send message to {phone_number}: {message}")
            
            if not phone_number or not message:
                return Response(
                    {'error': 'Both phone_number and message are required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            result = WhatsAppService.send_message(phone_number, message)
            
            if result['success']:
                serializer = WhatsAppMessageSerializer(result['message'])
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                print(f"WhatsApp API error: {result['error']}")
                return Response(
                    {'error': 'Failed to send WhatsApp message', 'details': result['error']},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        except Exception as e:
            print(f"Unexpected error in WhatsAppMessagesView.post: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )