from django.urls import path
from .views import (
    ClientListView, 
    ClientDetailView,
    ClientCreateView,
)

app_name = 'clients'

urlpatterns = [
    path('api/v1/clients/', ClientListView.as_view(), name='client-list'),
    path('api/v1/createClient/', ClientCreateView.as_view(), name='client-create'),
    path('api/v1/clients/<int:pk>/', ClientDetailView.as_view(), name='client-detail'),
]