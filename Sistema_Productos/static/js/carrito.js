function addProducto() {
    const selectButtons = document.querySelectorAll('.select-button');
    const cartItems = document.getElementById('cart-items');
    const checkoutButton = document.getElementById('checkout');
    const resetCarrito = document.getElementById('clear-car')

    const carrito = JSON.parse(localStorage.getItem('carrito')) || {};
    

    selectButtons.forEach(boton => {
        boton.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const productName = this.getAttribute('data-name');
            const productPrice = parseFloat(this.getAttribute('data-price'));

            if(carrito[productId]) {
               carrito[productId].cantidad += 1;
               carrito[productId].precioTotal += productPrice; 
            } else {
                carrito[productId] = {
                    nombre : productName,
                    precioUnitario : productPrice,
                    precioTotal : productPrice,
                    cantidad : 1,
                }
            }

            localStorage.setItem('carrito', JSON.stringify(carrito))
            renderCarrito()

            
            console.log('render carrito')
        })
    })

    function renderCarrito() {
        cartItems.innerHTML = '';

        for(const id in carrito) {
            const producto = carrito[id];
            const listItem = document.createElement('li');
            
            // Mantener todas las clases originales
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
            
            // Reactivar los iconos de Lucide para el nuevo elemento
            if(window.lucide) {
                lucide.createIcons();
            }
        }
    }

    cartItems.addEventListener('click', function(e) {
        if(e.target.closest('.remove-from-cart')) {
            const button = e.target.closest('.remove-from-cart');
            const productId = button.getAttribute('data-id');
            delete carrito[productId];
            localStorage.setItem('carrito', JSON.stringify(carrito));
            renderCarrito();
        }
    });
    
    resetCarrito.addEventListener('click', () => {
        console.log('BORRADOS')
        localStorage.removeItem('carrito');
        for(const borrar in carrito) {
            delete carrito[borrar];
        }
        renderCarrito();
    });   
    
    checkoutButton.addEventListener('click', (event) => {
        if (Object.keys(carrito).length === 0 ) {
            event.preventDefault()

            if(!document.querySelector('.alert')) {
                const alerts = document.createElement('div')
                alerts.classList.add('alert', 'alert-success')
                alerts.innerHTML = `
                    Carrito vacio por favor, seleccione algun producto.
                `
                cartItems.appendChild(alerts);    
                
                //Elimnar alerta
                setTimeout(() => {
                    cartItems.removeChild(alerts);
                }, 3000)
            }

        } else {
            window.location.href = '{% url "Pago_producto" %}';   
        }
    })

    renderCarrito();

        
}


document.addEventListener('DOMContentLoaded', addProducto);
    