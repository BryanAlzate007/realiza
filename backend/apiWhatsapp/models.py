from django.db import models

class WhatsAppMessage(models.Model):
    phone_number = models.CharField(max_length=20)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_from_me = models.BooleanField(default=False)
    message_type = models.CharField(max_length=20, default='text')  # text, image, etc.
    
    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"{self.phone_number}: {self.message[:50]}"
