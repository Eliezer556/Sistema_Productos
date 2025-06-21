document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('busqueda-producto');
    const productGrid = document.getElementById('product-grid');
    const products = document.querySelectorAll('.producto-tarjeta');
    
    // Inicializar iconos
    lucide.createIcons();
    
    // Filtrado de productos mejorado
    if (searchInput && productGrid) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            products.forEach(product => {
                const productName = product.getAttribute('data-name');
                const productCategory = product.getAttribute('data-category');
                
                if (searchTerm === '' || 
                    productName.includes(searchTerm) || 
                    productCategory.includes(searchTerm)) {
                    product.style.display = 'flex';
                    product.style.animation = 'fadeIn 0.5s ease';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    }
    
    // Efecto hover para imágenes
    products.forEach(product => {
        product.addEventListener('mouseenter', () => {
            const img = product.querySelector('img');
            if (img) img.style.transform = 'scale(1.05)';
        });
        
        product.addEventListener('mouseleave', () => {
            const img = product.querySelector('img');
            if (img) img.style.transform = 'scale(1)';
        });
    });
    
    // Animación al agregar al carrito
    document.querySelectorAll('.select-button:not(:disabled)').forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('[data-lucide]');
            const originalHTML = this.innerHTML;
            
            this.innerHTML = '<span data-lucide="check" class="button-icon"></span> Añadido';
            lucide.createIcons();
            
            setTimeout(() => {
                this.innerHTML = originalHTML;
                lucide.createIcons();
            }, 1500);
        });
    });
});

// Animación para el fadeIn
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);