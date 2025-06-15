from django.shortcuts import render
from .models import Producto, Cliente, Compra, Compra_Detalle, Materia_Prima, Categoria_Producto
from django.http import HttpResponseRedirect
import json
from datetime import datetime
from decimal import Decimal

def Ingreso_Cliente(request):
    if request.method == 'POST':
        cedula = request.POST.get('cedula')
        if Cliente.objects.filter(cedula=cedula).exists():

            cliente = Cliente.objects.get(cedula=cedula)
            request.session['cliente_id'] = cliente.id
            return HttpResponseRedirect('/index')
        else:
            print('Cliente no existe, por favor registrese')
            return HttpResponseRedirect('/')

def Cliente_Sesion(request):

    if request.method == 'POST':
        print(request.POST)
        nombre = request.POST.get('nombre')
        apellido = request.POST.get('apellido')
        cedula = request.POST.get('cedula')

        cliente = Cliente.objects.create(
            name =  nombre,
            apellido = apellido,
            cedula = cedula 
        )           

        cliente.save()

        request.session['cliente_id'] = cliente.id
        return HttpResponseRedirect('/index')
    
    return render(request, 'Cliente_Sesion.html', {})

def Index(request):

    cliente_id = request.session.get('cliente_id')
    cliente = None
    if cliente_id:
        cliente =  Cliente.objects.get(id=cliente_id)

    return render(request, 'index.html', {'cliente':cliente})

def cerrar_sesion(request):
    try:
        del request.session['cliente_id']
    except KeyError:
        pass
    return HttpResponseRedirect('/')

def Charcuteria(request):
    cliente_id = request.session.get('cliente_id')
    cliente = None
    if cliente_id:
        cliente = Cliente.objects.get(id=cliente_id)

    productos = Producto.objects.filter(categoria_id=1)

    productos_precio = []

    for producto in productos:
        precio_real = producto.precio * producto.contenido_neto
        productos_precio.append({
            'producto': producto,
            'precio_real':precio_real,
        })

    return render(request, 'charcuteria.html', {'productos_precio':productos_precio, 'cliente':cliente})

def chucherias(request):
    cliente_id = request.session.get('cliente_id')
    cliente = None
    if cliente_id:
        cliente = Cliente.objects.get(id=cliente_id)
        
    productos = Producto.objects.filter(categoria_id=4)

    productos_precio = []

    for producto in productos:
        precio_real = producto.precio * producto.contenido_neto
        productos_precio.append({
            'producto': producto,
            'precio_real':precio_real
        })

    return render(request, 'chucherias.html', {'productos_precio':productos_precio, 'cliente':cliente})

def Harinas(request):
    cliente_id = request.session.get('cliente_id')
    cliente = None
    if cliente_id:
        cliente = Cliente.objects.get(id=cliente_id)
    productos = Producto.objects.filter(categoria_id=6)

    productos_precio = []

    for producto in productos:
        precio_real = producto.precio * producto.contenido_neto
        productos_precio.append({
            'producto': producto,
            'precio_real':precio_real
        })

    return render(request, 'harinas.html', {'productos_precio':productos_precio, 'cliente':cliente})

def Pago_producto(request):
    cliente_id = request.session.get('cliente_id')
    cliente = None
    if cliente_id:
        cliente = Cliente.objects.get(id=cliente_id)
    else:
        return HttpResponseRedirect('/index')
    
    metodos_pago = [
        ('pago_movil', 'img/pagoImg2.png', 'Pago Móvil'),
        ('tarjeta', 'img/pagoImg.png', 'Tarjeta'),
        ('efectivo', 'img/pagoImg3.jpg', 'Efectivo')
    ]

    return render(request, 'pago_producto.html', {'cliente': cliente, 'metodos_pago':metodos_pago})

def metodo_pago(request):

    metodo = request.GET.get('metodo', '')


    return render(request, 'metodo_pago.html', {'metodo':metodo})

def finalizarPago(request):
    if request.method == "POST":
        cliente_id = request.session.get('cliente_id')
        if not cliente_id:
            return HttpResponseRedirect('/')
        
        cliente = Cliente.objects.get(id=cliente_id)
        print(request.POST)
        carrito_json = request.POST.get('carrito')
        print(f"Carrito JSON: {carrito_json}")

        if not carrito_json:
            print('NOT CARRITO_JASON')
            return render(request, 'metodo_pago.html', {'error': 'El carrito está vacío o no se envió correctamente.'})

        
        carrito = json.loads(carrito_json)
        print(f"Carrito procesado: {carrito}")

        compra = Compra.objects.create(
            cliente = cliente,
            fecha = datetime.now()            
        )
        
        for producto_id, producto_data in carrito.items():
            producto = Producto.objects.get(id=producto_id)

            Compra_Detalle.objects.create(
                compra = compra,
                producto = producto,
                cantidad = producto_data['cantidad'],
                precio_unitario = producto_data['precioUnitario']
            )

            if producto.materia_prima:
                materia_prima = producto.materia_prima
                cantidad_base = producto.contenido_neto * producto_data['cantidad']  # contenido_neto está en kg o unidades según el producto

                # Conversión según la unidad de la materia prima
                unidad_mp = materia_prima.unidad
                if unidad_mp == 'kg':
                    # contenido_neto ya está en kg si es por peso
                    cantidad_consumida = cantidad_base
                elif unidad_mp == 'g':
                    # Si materia prima está en gramos, convierte kg a gramos
                    cantidad_consumida = cantidad_base * Decimal('1000')
                elif unidad_mp == 'l':
                    # Si materia prima está en litros, asume contenido_neto está en litros
                    cantidad_consumida = cantidad_base
                elif unidad_mp == 'ml':
                    # Si materia prima está en mililitros, convierte litros a mililitros
                    cantidad_consumida = cantidad_base * Decimal('1000')
                elif unidad_mp == 'unidad':
                    # Si materia prima está en unidades, asume contenido_neto es unidades
                    cantidad_consumida = cantidad_base
                else:
                    # Por defecto, no convierte
                    cantidad_consumida = cantidad_base

                if materia_prima.cantidad_disponible >= cantidad_consumida:
                    materia_prima.cantidad_disponible -= cantidad_consumida
                    materia_prima.save()
                else:
                    print(f"NO hay materia prima suficiente para {producto.name}")

        print('FACTURA GENERADA')
        return HttpResponseRedirect('/factura')  

    return HttpResponseRedirect('/')

def factura(request):
    cliente_id = request.session.get('cliente_id')
    if not cliente_id:
        return HttpResponseRedirect('/')

    cliente = Cliente.objects.get(id=cliente_id)
    
    # carrito_json = request.POST.get('carrito')
    
    ultima_compra = Compra.objects.filter(cliente=cliente).order_by('-fecha').first()
    print(ultima_compra)

    if not ultima_compra:
        return render(request, 'factura.html', {'error': 'No se encontró ninguna compra.'})

    detalles = Compra_Detalle.objects.filter(compra=ultima_compra)
    print(detalles)
    subtotal = sum(detalle.cantidad * detalle.precio_unitario for detalle in detalles)
    iva = subtotal * Decimal('0.16')
    total = subtotal + iva

    return render(request, 'factura.html', {
        'cliente': cliente,
        'compra': ultima_compra,
        'detalles': detalles,
        'subtotal': subtotal,
        'iva': iva,
        'total': total,
    })


# DJANGO ORM (OBJECT - RELATIONAL - MAPPING)
# Metodos para trabajar con DJANGO ORM
# save() -> guardar datos, actualiza el objeto si ya existe...
# get() -> Se utiliza para obtener un unico registro, que coincida con un filtro indicado...
# filter() -> Se usa para obtener una lista de registros que coicidan con una condicion dada...
# all() -> devuelve todos los registros de una tabla...
# update() -> se usa para modificar registros existentes...
# delete() -> Su usa para borrar registros especificos de una tabla...
# create() -> El metodo un objeto y lo guarda en la base de datos...
# count() -> Cuenta la cantidad de registros.