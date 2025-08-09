from django.db import models


class Client(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, null=True)
    nameShort = models.CharField(max_length=255)
    typeDocument = models.CharField(max_length=255)
    numberDocument = models.CharField(max_length=255, unique=True)
    address = models.CharField(max_length=255)
    district = models.CharField(max_length=255)
    managementObservations = models.TextField(null=True)
    cellphone = models.CharField(max_length=255, null=True)
    nameCompany = models.CharField(max_length=255, null=True)
    adressSecondary = models.CharField(max_length=255, null=True)
    billingDate = models.IntegerField(help_text="Day of the month for billing", null=True)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Client {self.client_id} for user {self.user.username}"

