from django.db import models

# MODELOS PARA MI BASE DE DATOS
class Categoria_Producto(models.Model):
    nombre = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.nombre

class Producto(models.Model):

    STATUS_CHOICES = [
        ('disponible', 'Disponible'),
        ('agotado', 'Agotado'),
        ('oferta', 'Oferta'),
    ]

    name = models.CharField(max_length=50)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    imagen = models.ImageField(upload_to='productos', null=True, blank=True)
    status = models.CharField( max_length=50,choices=STATUS_CHOICES, default='disponible')
    categoria = models.ForeignKey(Categoria_Producto, on_delete=models.CASCADE, null=True, blank=True, related_name='Productos')
    materia_prima = models.ForeignKey("Materia_Prima", on_delete=models.SET_NULL, null=True, blank=True)
    cantidad_por_unidad = models.DecimalField(max_digits=10, decimal_places=2, default=1.0, help_text="Cantidad de materia prima que consume una unidad de producto.")

    def __str__(self):
        return f"{self.name}"

class Cliente(models.Model):
    cedula = models.IntegerField(unique=True)
    name = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.name} {self.apellido}"

# TABLA FACTURA
class Compra(models.Model):
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='compras')
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Compra {self.id} de {self.cliente.first_name} {self.cliente.last_name}"
    
    @property
    def precio_total(self):
        """ Calcula el precio total sumando los subtotales de los detalles de compra. """
        return sum(detalle.subtotal for detalle in self.detalles.all())

class Compra_Detalle(models.Model):
    compra = models.ForeignKey(Compra, related_name='detalles', on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.cantidad} x {self.producto.nombre} en la compra {self.compra.id}"


class Materia_Prima(models.Model):
    nombre = models.CharField(max_length=50, unique=True)
    cantidad_disponible = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.nombre} - {self.cantidad_disponible} kg" 