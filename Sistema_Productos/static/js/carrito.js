function addProducto() {
    const selectButtons = document.querySelectorAll('.select-button');
    const cartItems = document.getElementById('cart-items');
    const checkoutButton = document.getElementById('checkout');
    const resetCarrito = document.getElementById('clear-car');
    const carrito = JSON.parse(localStorage.getItem('carrito')) || {};

    // Función para verificar materia prima disponible
    async function verificarMateriaPrimaDisponible(productId) {
        try {
            const response = await fetch(`/api/obtener-materia-prima/${productId}/`);
            if (!response.ok) throw new Error('Error en la respuesta del servidor');
            return await response.json();
        } catch (error) {
            console.error('Error al verificar materia prima:', error);
            return {
                disponible: false,
                mensaje: 'Error al verificar disponibilidad'
            };
        }
    }

    // Función para mostrar alertas
    function mostrarAlerta(mensaje, tipo = 'warning') {
        const alertasPrevias = document.querySelectorAll('.dynamic-alert');
        alertasPrevias.forEach(alerta => alerta.remove());

        const alerta = document.createElement('div');
        alerta.className = `dynamic-alert alert alert-${tipo} alert-dismissible fade show position-fixed`;
        alerta.style.cssText = `
            top: 20px;
            right: 20px;
            z-index: 1100;
            min-width: 300px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;
        alerta.innerHTML = `
            <div class="d-flex align-items-center">
                <span data-lucide="${tipo === 'warning' ? 'alert-triangle' : tipo === 'danger' ? 'ban' : 'check-circle'}" class="me-2"></span>
                <span>${mensaje}</span>
                <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        
        document.body.appendChild(alerta);
        
        if(window.lucide) {
            lucide.createIcons();
        }
        
        setTimeout(() => {
            if(alerta.parentNode) {
                alerta.remove();
            }
        }, 5000);
    }

    // Función para verificar límites antes de agregar
    async function puedeAgregarProducto(productId) {
        const { materia_prima_disponible, unidades_posibles } = await verificarMateriaPrimaDisponible(productId);
        
        // Calcular cantidad actual en carrito
        const cantidadEnCarrito = carrito[productId] ? carrito[productId].cantidad : 0;
        
        if (materia_prima_disponible <= 0) {
            return {
                puedeAgregar: false,
                mensaje: 'No hay materia prima disponible para este producto'
            };
        }
        
        if (cantidadEnCarrito >= unidades_posibles) {
            return {
                puedeAgregar: false,
                mensaje: `Has alcanzado el límite disponible (${unidades_posibles} unidades)`
            };
        }
        
        return {
            puedeAgregar: true,
            mensaje: ''
        };
    }

    // Función para aplicar estilos a productos no disponibles
    async function aplicarEstilosProductosNoDisponibles() {
        const productos = document.querySelectorAll('.producto-tarjeta');
        
        for (const producto of productos) {
            const boton = producto.querySelector('.select-button');
            if (!boton) continue;
            
            const productId = boton.getAttribute('data-id');
            const { materia_prima_disponible } = await verificarMateriaPrimaDisponible(productId);
            
            if (materia_prima_disponible <= 0) {
                // Aplicar estilos visuales
                producto.classList.add('producto-no-disponible');
                
                // Actualizar el badge de estado
                const statusBadge = producto.querySelector('.status-badge');
                if (statusBadge) {
                    statusBadge.className = 'status-badge status-unavailable';
                    statusBadge.innerHTML = `
                        <span data-lucide="x-circle" class="status-icon"></span>
                        SIN STOCK
                    `;
                }
                
                // Actualizar el botón
                boton.disabled = true;
                boton.innerHTML = `
                    <span data-lucide="ban" class="button-icon"></span>
                    No disponible
                `;
                
                // Reactivar iconos de Lucide
                if (window.lucide) {
                    lucide.createIcons();
                }
            } else {
                // Remover estilos si vuelve a estar disponible
                producto.classList.remove('producto-no-disponible');
            }
        }
    }

    // Función para renderizar el carrito
    function renderCarrito() {
        cartItems.innerHTML = '';
        let totalGeneral = 0;
        let totalItems = 0;

        for(const id in carrito) {
            const producto = carrito[id];
            totalGeneral += producto.precioTotal;
            totalItems += producto.cantidad;
            
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center py-3';
            
            listItem.innerHTML = `
                <div class="d-flex align-items-center">
                    <span class="fw-bold me-2">x${producto.cantidad}</span>
                    <span class="me-2">${producto.nombre}</span>
                    <span class="text-success fw-bold">$${producto.precioTotal.toFixed(2)}</span>
                </div>
                <button class="btn btn-sm btn-outline-danger remove-from-cart" data-id="${id}">
                    <span data-lucide="trash-2" class="me-1"></span>
                    Eliminar
                </button>
            `;

            cartItems.appendChild(listItem);
        }

        const cartCount = document.getElementById('cart-count');
        if(cartCount) {
            cartCount.textContent = totalItems;
        }

        if(window.lucide) {
            lucide.createIcons();
        }
    }

    // Actualizar estado de los botones
    async function actualizarBotones() {
        for(const boton of selectButtons) {
            const productId = boton.getAttribute('data-id');
            const { puedeAgregar } = await puedeAgregarProducto(productId);
            
            boton.disabled = !puedeAgregar;
            if(boton.querySelector('[data-lucide]')) {
                boton.querySelector('[data-lucide]').setAttribute(
                    'data-lucide', 
                    puedeAgregar ? 'shopping-cart' : 'ban'
                );
                lucide.createIcons();
            }
        }
        await aplicarEstilosProductosNoDisponibles();
    }

    // Event listeners para los botones de agregar
    selectButtons.forEach(boton => {
        boton.addEventListener('click', async function() {
            const productId = this.getAttribute('data-id');
            const productName = this.getAttribute('data-name');
            const productPrice = parseFloat(this.getAttribute('data-price'));
            
            const { puedeAgregar, mensaje } = await puedeAgregarProducto(productId);
            
            if (!puedeAgregar) {
                mostrarAlerta(mensaje || `No se puede agregar más ${productName}`, 'danger');
                return;
            }

            if(carrito[productId]) {
                carrito[productId].cantidad += 1;
                carrito[productId].precioTotal += productPrice; 
            } else {
                carrito[productId] = {
                    nombre: productName,
                    precioUnitario: productPrice,
                    precioTotal: productPrice,
                    cantidad: 1,
                }
            }

            localStorage.setItem('carrito', JSON.stringify(carrito));
            renderCarrito();
            mostrarAlerta(`${productName} agregado al carrito`, 'success');
            await actualizarBotones();
        });
    });

    // Event listener para eliminar items
    cartItems.addEventListener('click', async function(e) {
        if(e.target.closest('.remove-from-cart')) {
            const button = e.target.closest('.remove-from-cart');
            const productId = button.getAttribute('data-id');
            const productName = carrito[productId]?.nombre || 'el producto';
            
            delete carrito[productId];
            localStorage.setItem('carrito', JSON.stringify(carrito));
            renderCarrito();
            mostrarAlerta(`${productName} eliminado del carrito`, 'info');
            await actualizarBotones();
        }
    });
    
    // Vaciar carrito
    resetCarrito.addEventListener('click', async () => {
        if(Object.keys(carrito).length > 0) {
            localStorage.removeItem('carrito');
            for(const borrar in carrito) {
                delete carrito[borrar];
            }
            renderCarrito();
            mostrarAlerta('Carrito vaciado correctamente', 'info');
            await actualizarBotones();
        }
    });

    // Checkout
    checkoutButton.addEventListener('click', (event) => {
        if (Object.keys(carrito).length === 0) {
            event.preventDefault();
            mostrarAlerta('El carrito está vacío. Agrega productos antes de continuar.', 'warning');
        }
    });

    // Inicialización
    renderCarrito();
    actualizarBotones();
}

document.addEventListener('DOMContentLoaded', addProducto);