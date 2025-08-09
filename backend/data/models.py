from django.db import models
from django.contrib.auth.models import User

class PalabraClave(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    palabra = models.CharField(max_length=255)

    class Meta:
        unique_together = ('usuario', 'palabra') # Asegura que cada usuario tenga palabras clave únicas

    def __str__(self):
        return f"Palabra clave: '{self.palabra}' de {self.usuario.username}"

class RespuestaTexto(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    palabra_clave = models.ForeignKey(PalabraClave, on_delete=models.CASCADE, related_name='respuestas_texto')
    texto = models.TextField()

    def __str__(self):
        return f"Texto asociado a '{self.palabra_clave.palabra}' por {self.usuario.username}"

class RespuestaAudio(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    palabra_clave = models.ForeignKey(PalabraClave, on_delete=models.CASCADE, related_name='respuestas_audio')
    archivo_audio = models.FileField(upload_to='audios/')

    def __str__(self):
        return f"Audio asociado a '{self.palabra_clave.palabra}' por {self.usuario.username}"

class RespuestaVideo(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    palabra_clave = models.ForeignKey(PalabraClave, on_delete=models.CASCADE, related_name='respuestas_video')
    archivo_video = models.FileField(upload_to='videos/')

    def __str__(self):
        return f"Video asociado a '{self.palabra_clave.palabra}' por {self.usuario.username}"

class RespuestaDocumento(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    palabra_clave = models.ForeignKey(PalabraClave, on_delete=models.CASCADE, related_name='respuestas_documento')
    archivo_documento = models.FileField(upload_to='documentos/')

    def __str__(self):
        return f"Documento asociado a '{self.palabra_clave.palabra}' por {self.usuario.username}"


