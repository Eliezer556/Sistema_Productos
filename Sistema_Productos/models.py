from django.db import models

# MODELOS PARA MI BASE DE DATOS


class Producto(models.Model):

    STATUS_CHOICES = [
        ('disponible', 'Disponible' ),
        ('agotado', 'Agotado' ),
        ('oferta', 'Oferta'),
    ]

    name = models.CharField(max_length=50)
    precio = models.IntegerField()
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='disponible')



