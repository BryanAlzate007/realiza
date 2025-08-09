from django.db import models

    
class PromptMessage(models.Model):
    message = models.TextField()
    date = models.TimeField()
    active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Prompt Message"
        verbose_name_plural = "Prompt Messages"

    def __str__(self):
        return f"{self.message[:50]} - {'Active' if self.active else 'Inactive'}"