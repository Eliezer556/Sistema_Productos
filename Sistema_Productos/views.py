from django.shortcuts import render
from .models import Producto, Cliente, Compra, Compra_Detalle
from django.http import HttpResponseRedirect
import json
from datetime import datetime

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

    producto = Producto.objects.filter(categoria_id=1)
    
    return render(request, 'Charcuteria.html', { 'producto': producto })

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
        # metodo = request.GET.get('metodo')
        print(request.POST)
        carrito_json = request.POST.get('carrito')
        print(f"Carrito JSON: {carrito_json}")

        if not carrito_json:
            print('NOT CARRITO_JASON')
            return render(request, 'metodo_pago.html', {'error': 'El carrito está vacío o no se envió correctamente.'})

        
        carrito = json.loads(carrito_json)
        print(f"Carrito procesado: {carrito}")

        
        for producto_id, producto_data in carrito.items():
            producto = Producto.objects.get(id=producto_id)

            compra = Compra.objects.create(
                cliente = cliente,
                fecha = datetime.now()
            )

            Compra_Detalle.objects.create(
                compra = compra,
                producto = producto,
                cantidad = producto_data['cantidad'],
                precio_unitario = producto_data['precioUnitario']
            )

        print('FACTURA GENERADA')
        return HttpResponseRedirect('/factura')  

    return HttpResponseRedirect('/')

def factura(request):

    
    
    return render(request, 'factura.html', {})


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