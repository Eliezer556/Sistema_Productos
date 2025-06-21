document.addEventListener('DOMContentLoaded', function() {
    // 1. Cargar el carrito desde localStorage
    const carrito = JSON.parse(localStorage.getItem('carrito')) || {};
    const carritoInput = document.getElementById('carrito');
    if (carritoInput) {
        carritoInput.value = JSON.stringify(carrito);
    }

    // 2. Configurar validación del formulario
    const form = document.getElementById('formPago');
    if (form) {
        // 3. Manejar el envío del formulario
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;
            window.scrolledToFirstError = false;

            // Limpiar errores previos
            document.querySelectorAll('.mensaje-error').forEach(el => {
                el.style.display = 'none';
            });
            document.querySelectorAll('.campo-invalido').forEach(el => {
                el.classList.remove('campo-invalido');
            });

            // Validación según método de pago
            if ('{{ metodo }}' === 'tarjeta') {
                // Validar cédula (7-9 dígitos)
                const cedula = form.querySelector('[name="cedula"]');
                if (cedula && !/^\d{7,9}$/.test(cedula.value)) {
                    mostrarError(cedula, 'error-cedula');
                    isValid = false;
                }

                // Validar tipo de cuenta (seleccionado)
                const tipoCuenta = form.querySelector('[name="tipo_cuenta"]');
                if (tipoCuenta && !tipoCuenta.value) {
                    mostrarError(tipoCuenta, 'error-cuenta');
                    isValid = false;
                }

                // Validar clave (4-6 dígitos)
                const clave = form.querySelector('[name="clave"]');
                if (clave && !/^\d{4,6}$/.test(clave.value)) {
                    mostrarError(clave, 'error-clave');
                    isValid = false;
                }

            } else if ('{{ metodo }}' === 'pago_movil') {
                // Validar cédula (7-9 dígitos)
                const cedula = form.querySelector('[name="cedula"]');
                if (cedula && !/^\d{7,9}$/.test(cedula.value)) {
                    mostrarError(cedula, 'error-cedula');
                    isValid = false;
                }

                // Validar teléfono (formato venezolano)
                const telefono = form.querySelector('[name="telefono"]');
                if (telefono && !/^04(12|14|16|24|26)\d{7}$/.test(telefono.value)) {
                    mostrarError(telefono, 'error-telefono');
                    isValid = false;
                }

                // Validar banco (seleccionado)
                const banco = form.querySelector('[name="tipo_banco"]');
                if (banco && !banco.value) {
                    mostrarError(banco, 'error-banco');
                    isValid = false;
                }
            }

            // 4. Enviar formulario si es válido
            if (isValid) {
                form.submit();
            }
        });

        // 5. Configurar validación en tiempo real mejorada
        const configurarValidacionInput = (input, regex) => {
            if (!input) return;

            // Solo números para campos numéricos
            if (regex.test('123')) { // Si es un regex numérico
                input.addEventListener('input', function() {
                    // Permite borrar y mantener el valor actual
                    this.value = this.value.replace(/[^0-9]/g, '');
                });
            }

            // Validar al perder el foco
            input.addEventListener('blur', function() {
                if (this.value && !regex.test(this.value)) {
                    this.classList.add('campo-invalido');
                    const errorId = 'error-' + this.name;
                    const errorElement = document.getElementById(errorId);
                    if (errorElement) {
                        errorElement.style.display = 'block';
                    }
                }
            });

            // Limpiar error al empezar a editar
            input.addEventListener('focus', function() {
                this.classList.remove('campo-invalido');
                const errorId = 'error-' + this.name;
                const errorElement = document.getElementById(errorId);
                if (errorElement) {
                    errorElement.style.display = 'none';
                }
            });
        };

        // 6. Aplicar a los campos según el método de pago
        if ('{{ metodo }}' === 'tarjeta') {
            configurarValidacionInput(form.querySelector('[name="cedula"]'), /^\d{7,9}$/);
            configurarValidacionInput(form.querySelector('[name="clave"]'), /^\d{4,6}$/);
        } else if ('{{ metodo }}' === 'pago_movil') {
            configurarValidacionInput(form.querySelector('[name="cedula"]'), /^\d{7,9}$/);
            configurarValidacionInput(form.querySelector('[name="telefono"]'), /^04(12|14|16|24|26)\d{7}$/);
        }
    }

    // 7. Función para mostrar errores
    function mostrarError(campo, idError) {
        if (!campo || !idError) return;
        
        campo.classList.add('campo-invalido');
        const errorElement = document.getElementById(idError);
        if (errorElement) {
            errorElement.style.display = 'block';
            // Scroll al primer error
            if (!window.scrolledToFirstError) {
                errorElement.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                window.scrolledToFirstError = true;
            }
        }
    }
});