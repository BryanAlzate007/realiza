from django.shortcuts import redirect
from django.http import JsonResponse
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.tokens import RefreshToken
import json

@csrf_exempt
def google_login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            id_token_google = data.get('id_token')

            if not id_token_google:
                return JsonResponse({'error': 'ID Token no proporcionado'}, status=400)

            try:
                idinfo = id_token.verify_oauth2_token(id_token_google, requests.Request(), settings.GOOGLE_CLIENT_ID)

                if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                    raise ValueError('Emisor incorrecto')

                email = idinfo.get('email')
                name = idinfo.get('name')
                picture = idinfo.get('picture')

                if not email:
                    return JsonResponse({'error': 'No se pudo obtener el correo electrónico de Google'}, status=400)

                try:
                    user = User.objects.get(email=email)
                    # Generar tokens JWT
                    refresh = RefreshToken.for_user(user)
                    
                    return JsonResponse({
                        'success': True,
                        'access': str(refresh.access_token),
                        'refresh': str(refresh),
                        'user': {
                            'email': user.email,
                            'name': user.first_name,
                            'picture': picture
                        }
                    })
                except User.DoesNotExist:
                    return JsonResponse({
                        'success': False,
                        'error': 'Usuario no existe en la base de datos'
                    }, status=404)

            except ValueError as e:
                return JsonResponse({'error': f'Token de Google inválido: {e}'}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Datos JSON inválidos'}, status=400)
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)