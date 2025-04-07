// document.addEventListener('DOMContentLoaded', function() {
//     const selectButtons = document.querySelectorAll('.select-button');
//     const cartItems = document.getElementById('cart-items');
//     const checkoutBtn = document.getElementById('checkout');

//     // Objeto para almacenar los productos en el carrito
//     const carrito = {};

//     selectButtons.forEach(button => {
//         button.addEventListener('click', function() {
//             const productId = this.getAttribute('data-id');
//             const productName = this.getAttribute('data-name');
//             const productPrice = parseFloat(this.getAttribute('data-price')); // Convertir a número

//             // Verificar si el producto ya está en el carrito
//             if (carrito[productId]) {
//                 // Si ya existe, incrementar la cantidad y actualizar el precio total
//                 carrito[productId].cantidad += 1;
//                 carrito[productId].precioTotal += productPrice;
//             } else {
//                 // Si no existe, agregarlo al carrito
//                 carrito[productId] = {
//                     nombre: productName,
//                     precioUnitario: productPrice,
//                     precioTotal: productPrice,
//                     cantidad: 1,
//                 };
//             }

//             // Guardar el carrito en localStorage
//             localStorage.setItem('carrito', JSON.stringify(carrito));

//             // Limpiar el carrito antes de volver a renderizar
//             cartItems.innerHTML = '';

//             // Renderizar los productos en el carrito
//             for (const id in carrito) {
//                 const producto = carrito[id];
//                 const listItem = document.createElement('li');
//                 listItem.classList.add('list-group-item');
//                 listItem.innerHTML = `
//                     ${producto.nombre} x${producto.cantidad} - $${producto.precioTotal.toFixed(2)}
//                     <button class="btn btn-danger btn-sm remove-from-cart" data-id="${id}">Eliminar</button>
//                 `;
//                 cartItems.appendChild(listItem);
//             }

//             // Agregar evento de eliminación a los botones "Eliminar"
//             const removeButtons = document.querySelectorAll('.remove-from-cart');
//             removeButtons.forEach(removeButton => {
//                 removeButton.addEventListener('click', function() {
//                     const id = this.getAttribute('data-id');
//                     delete carrito[id]; // Eliminar el producto del carrito
//                     localStorage.setItem('carrito', JSON.stringify(carrito)); // Actualizar localStorage
//                     this.parentElement.remove(); // Eliminar el elemento del DOM
//                 });
//             });
//         });
//     });

//     // Redirigir al usuario a la página de pago
//     checkoutBtn.addEventListener('click', function(event) {
//         event.preventDefault(); // Evitar que el enlace redirija inmediatamente
//         window.location.href = pagoProductoUrl; // Redirigir a la página de pago
//     });
// });