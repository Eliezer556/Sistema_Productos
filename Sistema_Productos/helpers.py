from django.shortcuts import render, HttpResponseRedirect
from django.http import HttpResponseRedirect
from .models import Producto, Cliente, Compra, Compra_Detalle, Materia_Prima
import json
from datetime import datetime
from decimal import Decimal

def get_cliente_from_session(request):
    """Obtiene el cliente de la sesión o None si no existe"""
    cliente_id = request.session.get('cliente_id')
    if cliente_id:
        try:
            return Cliente.objects.get(id=cliente_id)
        except Cliente.DoesNotExist:
            return None
    return None

def redirect_if_no_cliente(request, redirect_url='/index'):
    """Redirige si no hay cliente en sesión"""
    if not request.session.get('cliente_id'):
        return HttpResponseRedirect(redirect_url)
    return None

def calcular_precios_productos(productos):
    """Calcula los precios reales para una lista de productos"""
    return [{
        'producto': producto,
        'precio_real': producto.precio * producto.contenido_neto
    } for producto in productos]

def procesar_carrito(carrito_json):
    """Procesa el carrito JSON y devuelve el diccionario"""
    if not carrito_json:
        return None
    return json.loads(carrito_json)

def calcular_cantidad_consumida(producto, cantidad, materia_prima):
    """Calcula la cantidad consumida de materia prima según las unidades"""
    cantidad_base = producto.contenido_neto * cantidad
    
    if materia_prima.unidad == 'kg':
        return cantidad_base
    elif materia_prima.unidad == 'g':
        return cantidad_base * Decimal('1000')
    elif materia_prima.unidad == 'l':
        return cantidad_base
    elif materia_prima.unidad == 'ml':
        return cantidad_base * Decimal('1000')
    elif materia_prima.unidad == 'unidad':
        return cantidad_base
    return cantidad_base