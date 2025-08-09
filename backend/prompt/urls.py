from django.urls import path
from .views import PromptDateActiveView

app_name = 'prompt'

urlpatterns = [
    path('api/v1/prompt/', PromptDateActiveView.as_view(), name='prompt-date-active'),
    path('api/v1/prompt/<int:pk>/', PromptDateActiveView.as_view(), name='prompt-detail'),
    ]