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

    MEDICION_CHOICES = [
        ('unidad', 'Unidad'),
        ('peso', 'Peso (kg)'),
    ]

    name = models.CharField(max_length=50)
    imagen = models.ImageField(upload_to='productos', null=True, blank=True)
    status = models.CharField( max_length=50,choices=STATUS_CHOICES, default='disponible')
    descripcion = models.TextField(max_length=100, blank=True, null=True)
    categoria = models.ForeignKey(Categoria_Producto, on_delete=models.CASCADE, null=True, blank=True, related_name='Productos')
    materia_prima = models.ForeignKey("Materia_Prima", on_delete=models.SET_NULL, null=True, blank=True)
    # cantidad_por_unidad = models.DecimalField(max_digits=10, decimal_places=2, default=1.0, help_text="Cantidad de materia prima que consume una unidad de producto.")
    
    precio = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        help_text='Precio por unidad o por kg según corresponda'
    )
    
    unidad_medida = models.CharField(
        max_length=10, 
        choices=MEDICION_CHOICES, 
        default='unidad', 
        help_text="¿El producto se descuenta por unidad o por peso?"
    )

    contenido_neto = models.DecimalField(
        max_digits=10,
        decimal_places=3,
        default=1.0,
        help_text='Contenido en kg si es por peso, o 1 si es por unidad'
    )

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
        return f"Compra {self.id} de {self.cliente.name} {self.cliente.apellido}"
    
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
        return f"{self.cantidad} x {self.producto.name} en la compra {self.compra.id}"
    
    @property
    def subtotal(self):
        return self.cantidad * self.precio_unitario


class Materia_Prima(models.Model):
    UNIDAD_CHOICES = [
        ('kg', 'Kilogramos'),
        ('g', 'Gramos'),
        ('l', 'Litros'),
        ('ml', 'Mililitros'),
        ('unidad', 'Unidad'),
    ]

    nombre = models.CharField(max_length=50, unique=True)
    cantidad_disponible = models.DecimalField(max_digits=10, decimal_places=2)
    unidad = models.CharField(max_length=10, choices=UNIDAD_CHOICES, default='kg')
    stock_minimo = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    descripcion = models.TextField(max_length=200, blank=True, null=True)
    ultima_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.nombre} - {self.cantidad_disponible} {self.unidad}"

    @property
    def bajo_stock(self):
        return self.cantidad_disponible <= self.stock_minimo 
    
    @property
    def cantidad_formateada(self):
        if self.unidad == 'unidad':
            return int(self.cantidad_disponible)
        return float(self.cantidad_disponible)