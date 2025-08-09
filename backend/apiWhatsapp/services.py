import requests
import os
from pathlib import Path
from .models import WhatsAppMessage
from .serializers import WhatsAppMessageSerializer
from environ import Env

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

class WhatsAppService:
    @classmethod
    def send_message(cls, phone_number: str, message: str):
        """
        Envía un mensaje de WhatsApp y guarda el registro en la base de datos
        """
        api_url = f"https://graph.facebook.com/{WHATSAPP_API_VERSION}/{PHONE_NUMBER_ID}/messages"
        
        headers = {
            "Authorization": f"Bearer {ACCESS_TOKEN}",
            "Content-Type": "application/json"
        }
        
        # Asegurar que el número comience con el código de país
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
            print(f"Sending WhatsApp message to {phone_number}")
            print(f"API URL: {api_url}")
            print(f"Using token: {ACCESS_TOKEN[:20]}...")
            
            # Enviar mensaje a WhatsApp
            response = requests.post(api_url, headers=headers, json=data)
            
            print(f"WhatsApp API response status: {response.status_code}")
            print(f"WhatsApp API response: {response.text}")
            
            response.raise_for_status()

            # Guardar mensaje en la base de datos
            message_obj = WhatsAppMessage.objects.create(
                phone_number=phone_number,
                message=message,
                is_from_me=True,
                message_type='text'
            )
            
            return {
                'success': True,
                'message': message_obj,
                'whatsapp_response': response.json()
            }
            
        except requests.exceptions.RequestException as e:
            error_msg = f"Error en API de WhatsApp: {str(e)}"
            if hasattr(e, 'response') and hasattr(e.response, 'text'):
                error_msg += f" - Respuesta: {e.response.text}"
            print(error_msg)
            return {
                'success': False,
                'error': error_msg
            }