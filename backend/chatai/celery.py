import os
from celery import Celery

# Establece la configuración por defecto de Django para 'celery'.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chatai.settings')

app = Celery('chatai')

# Usando una cadena aquí significa que el trabajador no tiene que
# serializar el objeto de configuración.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Carga las tareas desde todos los archivos de tareas registrados en las apps de Django.
app.autodiscover_tasks()

