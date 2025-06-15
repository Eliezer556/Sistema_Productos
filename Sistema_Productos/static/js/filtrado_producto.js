document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('busqueda-producto');
    if (!input) return; // Solo ejecuta si existe el input

    const tarjetas = document.querySelectorAll('.producto-tarjeta');
    input.addEventListener('input', function() {
        const filtro = input.value.toLowerCase();
        tarjetas.forEach(function(tarjeta) {
            const nombre = tarjeta.querySelector('.nombre-producto').textContent.toLowerCase();
            if (nombre.includes(filtro)) {
                tarjeta.style.display = '';
            } else {
                tarjeta.style.display = 'none';
            }
        });
    });
});