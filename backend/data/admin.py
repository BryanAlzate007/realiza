from django.contrib import admin
from .models import PalabraClave, RespuestaTexto, RespuestaAudio, RespuestaVideo, RespuestaDocumento

admin.site.register(PalabraClave)
admin.site.register(RespuestaTexto)
admin.site.register(RespuestaAudio)
admin.site.register(RespuestaVideo)
admin.site.register(RespuestaDocumento)