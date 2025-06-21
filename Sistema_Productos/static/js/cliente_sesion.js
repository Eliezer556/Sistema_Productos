
    document.addEventListener("DOMContentLoaded", () => {
        const toggleBtn = document.getElementById("togglePanel");
        const loginSection = document.getElementById("loginSection");
        const registerSection = document.getElementById("registerSection");
        const panelText = document.getElementById("panelText");
        const panelSubtext = document.getElementById("panelSubtext");
        const toggleText = document.getElementById("toggleText");


        let showingLogin = true;

        const fadeOut = (el, callback) => {
            el.style.opacity = 1;
            let op = 1;
            const interval = setInterval(() => {
                op -= 0.1;
                el.style.opacity = op;
                if (op <= 0) {
                    el.classList.remove('active');
                    clearInterval(interval);
                    if (callback) callback();
                }
            }, 30);
        };

        const fadeIn = (el) => {
            el.style.opacity = 0;
            el.classList.add('active');
            let op = 0;
            const interval = setInterval(() => {
                op += 0.1;
                el.style.opacity = op;
                if (op >= 1) clearInterval(interval);
            }, 30);
        };

        const toggleForms = () => {
            showingLogin = !showingLogin;

            if (showingLogin) {
                // Si se va a mostrar el login
                fadeOut(registerSection, () => {
                    fadeIn(loginSection);
                    // Actualizar texto del panel/botones
                    panelText.textContent = "¿No tienes cuenta?";
                    panelSubtext.textContent = "Presiona para registrarte";
                    toggleText.textContent = "Registrarse";
                });
            } else {
                fadeOut(loginSection, () => {
                    fadeIn(registerSection);
                    panelText.textContent = "¿Ya tienes cuenta?";
                    panelSubtext.textContent = "Presiona para ingresar";
                    toggleText.textContent = "Ingresar";
                });
            }
        };

        toggleBtn.addEventListener("click", toggleForms);

        window.handleLogin = async (event) => {
            event.preventDefault(); 
            const form = event.target;
            const formData = new FormData(form);
            const cedula = formData.get('cedula');

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': formData.get('csrfmiddlewaretoken'),
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams(formData).toString(),
                });

                const data = await response.json(); 

                if (response.ok && data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Bienvenido!',
                        text: data.message || 'Inicio de sesión exitoso.',
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => {
                        window.location.href = data.redirect_url || '/'; 
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de ingreso',
                        text: data.message || 'Cédula no encontrada o error al iniciar sesión.',
                    });
                }
            } catch (error) {
                console.error('Error al iniciar sesión:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.',
                });
            }
        };

        window.handleRegister = async (event) => {
            event.preventDefault();
            const form = event.target;
            const formData = new FormData(form);
            const nombre = formData.get('nombre');
            const apellido = formData.get('apellido');
            const cedula = formData.get('cedula');

            try {
                
                const response = await fetch('/registro_cliente/', {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': formData.get('csrfmiddlewaretoken'),
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams(formData).toString(),
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Registro exitoso!',
                        text: data.message || 'Tu cuenta ha sido creada con éxito. Ahora puedes ingresar.',
                        showConfirmButton: false,
                        timer: 2000
                    }).then(() => {
                        toggleForms();
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de registro',
                        text: data.message || 'Hubo un problema al registrar la cuenta. Inténtalo de nuevo.',
                    });
                }
            } catch (error) {
                console.error('Error al registrar:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.',
                });
            }
        };

        loginSection.classList.add('active');
    });
