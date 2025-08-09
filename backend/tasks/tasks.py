from celery import shared_task
from datetime import datetime, timedelta
import pytz
from clients.models import Client
from apiWhatsapp.services import WhatsAppService
from prompt.models import PromptMessage


@shared_task
def verificar_y_enviar_mensajes_programados():
    now_utc = datetime.now(pytz.utc)
    print(f"[TASK] Iniciando verificación de mensajes programados - Fecha actual: {now_utc}")
    
    # Obtener el mensaje programado activo para esta hora
    clients = Client.objects.filter(
        active=True,
    )
    print(f"[TASK] Clientes activos encontrados: {clients.count()}")
    
    mensaje_programado = PromptMessage.objects.filter(
        active=True,
    ).first()
    
    if not mensaje_programado:
        print("[TASK] No hay mensajes programados activos")
        return "No hay mensajes programados activos"
    
    print(f"[TASK] Mensaje programado encontrado: {mensaje_programado.message[:50]}...")
    
    mensajes_enviados = 0
    for client in clients:
        # Verificar si el cliente tiene fecha para hoy
        fecha_objetivo = client.billingDate - 2
        print(f"[TASK] Cliente: {client.name}, Fecha facturación: {client.billingDate}, Fecha objetivo: {fecha_objetivo}, Día actual: {now_utc.day}")
        
        # Comparar el día objetivo con el día actual
        if fecha_objetivo == now_utc.day:
            print(f"[TASK] Enviando mensaje a {client.name} ({client.cellphone})")
            
            mensaje_personalizado = mensaje_programado.message.format(
                nombre=client.name,
                fecha_facturacion=client.billingDate
            )
            # mensaje_personalizado = mensaje_programado.message

            result = WhatsAppService.send_message(
                        client.cellphone,
                        mensaje_personalizado
                    )
         
            if result['success']:
                print(f"[TASK] Mensaje enviado con éxito a {client.name}")
                mensajes_enviados += 1
            else:
                print(f"[TASK] Fallo el envío a {client.name}: {result.get('error', 'Error desconocido')}")
        else:
            print(f"[TASK] Cliente {client.name} no tiene mensaje programado para hoy")
    
    print(f"[TASK] Proceso completado. Mensajes enviados: {mensajes_enviados}")
    return f"Mensajes enviados: {mensajes_enviados}"



