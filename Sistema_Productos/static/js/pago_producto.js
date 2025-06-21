
        document.addEventListener('DOMContentLoaded', function() {
            const carrito = JSON.parse(localStorage.getItem('carrito')) || {};
            
            // Asignar carrito a campos ocultos
            document.querySelectorAll('input[name="carrito"]').forEach(input => {
                input.value = JSON.stringify(carrito);
            });

            // Mostrar productos con efecto dinámico
            const selectedProducts = document.getElementById('selected-products');
            const totalPriceElement = document.getElementById('total-price');
            let totalPrice = 0;

            for (const id in carrito) {
                const producto = carrito[id];
                const listItem = document.createElement('li');
                listItem.classList.add('list-group-item');
                
                listItem.innerHTML = `
                    <div class="product-info">
                        <div class="product-name-wrapper">
                            <span class="product-name">${producto.nombre}</span>
                            <span class="product-name-tooltip">${producto.nombre}</span>
                        </div>
                    </div>
                    <div class="product-meta">
                        <span class="product-quantity">${producto.cantidad} ${producto.cantidad > 1 ? 'unidades' : 'unidad'}</span>
                        <span class="product-price">$${producto.precioTotal.toFixed(2)}</span>
                    </div>
                `;
                
                selectedProducts.appendChild(listItem);
                totalPrice += producto.precioTotal;
            }

            totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
            
            // Inicializar iconos Lucide
            if(window.lucide) {
                lucide.createIcons();
            }
        });
        
        function enviarFormulario(formId) {
            const carrito = JSON.parse(localStorage.getItem('carrito')) || {};
            const carritoInput = document.querySelector(`#${formId} input[name="carrito"]`);
            carritoInput.value = JSON.stringify(carrito);
            document.getElementById(formId).submit();
        }
