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
            const producto = carrito[id]
            const listItem = document.createElement('li')
            listItem.classList.add('list-group-item')

            listItem.innerHTML = `
                <span>x${producto.cantidad} - ${producto.nombre} $${producto.precioTotal.toFixed(2)}</span>
                <button class="btn btn-danger btn-sm remove-from-cart" data-id="${id}">ELIMINAR</button>
            `;

            cartItems.appendChild(listItem)
        }

        const elimnarProducto = document.querySelectorAll('.remove-from-cart');
        elimnarProducto.forEach(button => {
            button.addEventListener('click', function() {
                console.log('borrado')
                const id = this.getAttribute('data-id');
                delete carrito[id];
                localStorage.setItem('carrito', JSON.stringify(carrito));
                renderCarrito();
            });
        });                
    }
    
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
    