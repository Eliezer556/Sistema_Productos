from django.contrib import admin
from .models import Producto, Cliente, Compra, Compra_Detalle, Categoria_Producto, Materia_Prima
# Register your models here.
admin.site.register(Cliente)
admin.site.register(Producto)
admin.site.register(Compra)
admin.site.register(Compra_Detalle)
admin.site.register(Categoria_Producto)
admin.site.register(Materia_Prima)