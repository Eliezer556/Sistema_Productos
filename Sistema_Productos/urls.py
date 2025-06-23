from django.urls import path
from . import views

urlpatterns = [
    path('', views.Cliente_Sesion, name='Cliente_Sesion'),
    path('index/', views.Index, name='index'),
    path('cerrar_sesion/', views.cerrar_sesion, name='cerrar_sesion'),
    path('ingreso_cliente/', views.Ingreso_Cliente, name='Ingreso_Cliente'),
    path('charcuteria/', views.Charcuteria, name='Charcuteria'),
    path('pago_producto/', views.Pago_producto, name='Pago_producto'),
    path('metodo_pago/', views.metodo_pago, name='metodo_pago'),
    path('finalizarPago/', views.finalizarPago, name='finalizarPago'),
    path('factura/', views.factura, name='factura'),
    path('harinas/', views.Harinas, name='harinas'),
    path('chucherias/', views.chucherias, name='chucherias'),
    path('historial/', views.historial, name='historial'),
    path('api/obtener-materia-prima/<int:producto_id>/', views.obtener_materia_prima, name='obtener_materia_prima'),
] 
