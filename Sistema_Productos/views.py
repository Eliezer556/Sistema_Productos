from django.shortcuts import render
from .models import Producto, Cliente, Compra, Compra_Detalle, Categoria_Producto
from django.http import HttpResponseRedirect
from datetime import datetime  
from decimal import Decimal
from .helpers import (
    get_cliente_from_session, 
    redirect_if_no_cliente,
    calcular_precios_productos,
    procesar_carrito,
    calcular_cantidad_consumida
)

# Vistas de autenticación y sesión
def Ingreso_Cliente(request):
    if request.method == 'POST':
        cedula = request.POST.get('cedula')
        if Cliente.objects.filter(cedula=cedula).exists():
            cliente = Cliente.objects.get(cedula=cedula)
            request.session['cliente_id'] = cliente.id
            return HttpResponseRedirect('/index')
        return HttpResponseRedirect('/')

def Cliente_Sesion(request):
    if request.method == 'POST':
        cliente = Cliente.objects.create(
            name=request.POST.get('nombre'),
            apellido=request.POST.get('apellido'),
            cedula=request.POST.get('cedula')
        )
        request.session['cliente_id'] = cliente.id
        return HttpResponseRedirect('/index')
    return render(request, 'Cliente_Sesion.html', {})

def Index(request):
    return render(request, 'index.html', {'cliente': get_cliente_from_session(request)})

def cerrar_sesion(request):
    request.session.pop('cliente_id', None)
    return HttpResponseRedirect('/')

# Vistas de categorías de productos
def categoria_producto_view(request, categoria_id, template_name):
    cliente = get_cliente_from_session(request)
    productos = Producto.objects.filter(categoria_id=categoria_id)
    productos_precio = calcular_precios_productos(productos)
    return render(request, template_name, {
        'productos_precio': productos_precio,
        'cliente': cliente
    })

def Charcuteria(request):
    return categoria_producto_view(request, 1, 'charcuteria.html')

def chucherias(request):
    return categoria_producto_view(request, 4, 'chucherias.html')

def Harinas(request):
    return categoria_producto_view(request, 6, 'harinas.html')

# Vistas de pago
def Pago_producto(request):
    redirect = redirect_if_no_cliente(request)
    if redirect:
        return redirect
    
    metodos_pago = [
        ('pago_movil', 'img/pagoImg2.png', 'Pago Móvil'),
        ('tarjeta', 'img/pagoImg.png', 'Tarjeta'),
        ('efectivo', 'img/pagoImg3.jpg', 'Efectivo')
    ]
    
    return render(request, 'pago_producto.html', {
        'cliente': get_cliente_from_session(request),
        'metodos_pago': metodos_pago
    })

def metodo_pago(request):
    redirect = redirect_if_no_cliente(request)
    if redirect:
        return redirect
    
    return render(request, 'metodo_pago.html', {
        'metodo': request.GET.get('metodo', ''),
        'cliente': get_cliente_from_session(request)
    })

def finalizarPago(request):
    if request.method != "POST":
        return HttpResponseRedirect('/')
    
    redirect = redirect_if_no_cliente(request)
    if redirect:
        return redirect
    
    cliente = get_cliente_from_session(request)
    carrito = procesar_carrito(request.POST.get('carrito'))
    
    if not carrito:
        return render(request, 'metodo_pago.html', {'error': 'El carrito está vacío o no se envió correctamente.'})

    compra = Compra.objects.create(cliente=cliente, fecha=datetime.now())
    
    for producto_id, producto_data in carrito.items():
        producto = Producto.objects.get(id=producto_id)
        Compra_Detalle.objects.create(
            compra=compra,
            producto=producto,
            cantidad=producto_data['cantidad'],
            precio_unitario=producto_data['precioUnitario']
        )

        if producto.materia_prima:
            materia_prima = producto.materia_prima
            cantidad_consumida = calcular_cantidad_consumida(
                producto, 
                producto_data['cantidad'], 
                materia_prima
            )
            
            if materia_prima.cantidad_disponible >= cantidad_consumida:
                materia_prima.cantidad_disponible -= cantidad_consumida
                materia_prima.save()
            else:
                print(f"NO hay materia prima suficiente para {producto.name}")

    return HttpResponseRedirect('/factura')

def factura(request):
    cliente = get_cliente_from_session(request)
    if not cliente:
        return HttpResponseRedirect('/')
    
    ultima_compra = Compra.objects.filter(cliente=cliente).order_by('-fecha').first()
    if not ultima_compra:
        return render(request, 'factura.html', {'error': 'No se encontró ninguna compra.'})

    detalles = Compra_Detalle.objects.filter(compra=ultima_compra)
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

def historial(request):
    if 'cliente_id' not in request.session:
        return HttpResponseRedirect('Cliente_Sesion')
    
    cliente = get_cliente_from_session(request)
    compras_usuario = Compra.objects.filter(cliente=cliente).order_by('-fecha')
    
    return render(request, 'historial.html', {
        'cliente': cliente,
        'compras_usuario': compras_usuario
    })