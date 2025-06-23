const updateProductStatus = (productoElement, status) => {
    const isUnavailable = status === 'agotado';
    
    // Botón
    const btn = productoElement.querySelector('.select-button');
    if (btn) {
        btn.disabled = isUnavailable;
        const icon = btn.querySelector('.button-icon');
        if (icon) {
            icon.setAttribute('data-lucide', isUnavailable ? 'ban' : 'check');
        }
        const textSpan = btn.querySelector('span:not([data-lucide])') || document.createElement('span');
        textSpan.textContent = isUnavailable ? ' AGOTADO' : ' DISPONIBLE';
    }
    
    // Badge
    const badge = productoElement.querySelector('.status-badge');
    if (badge) {
        badge.setAttribute('data-status', isUnavailable ? 'unavailable' : 'available');
        const icon = badge.querySelector('.status-icon');
        if (icon) {
            icon.setAttribute('data-lucide', isUnavailable ? 'x-circle' : 'check-circle');
        }
        const textSpan = badge.querySelector('.status-text');
        if (textSpan) {
            textSpan.textContent = isUnavailable ? 'AGOTADO' : 'DISPONIBLE';
        }
    }
    
    if (window.lucide) {
        lucide.createIcons();
    }
};

// Uso:
updateProductStatus(productoElement, 'agotado');