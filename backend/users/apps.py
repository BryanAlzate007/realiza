from django.apps import AppConfig

class UsuariosConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'users' # O el nombre de tu aplicación

    def ready(self):
        import users.signals # Asegúrate de que la ruta sea correcta