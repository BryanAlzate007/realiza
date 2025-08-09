from django.db import models
from django.contrib.auth.models import User

class PerfilUsuario(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    fecha_de_nacimiento = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"Perfil de {self.usuario.username}"