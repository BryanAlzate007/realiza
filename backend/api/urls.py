from django.urls import path, re_path
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from drf_yasg import openapi
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from . import views 

schema_view = get_schema_view(
   openapi.Info(
      title="Mi API",
      default_version='v1',
      description="Documentación de la API",
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)
app_name = 'api'

urlpatterns = [
    # Otras URLs de tu aplicación...
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('google-login/', views.google_login, name='google_login'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # Endpoint para obtener tokens (login)
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # Endpoint para refrescar tokens
    # ...
] 