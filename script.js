// Cambiar imágenes al hacer clic en las miniaturas
document.querySelectorAll('.product-thumbnail').forEach(thumbnail => {
    thumbnail.addEventListener('click', function() {
        const mainImage = this.closest('.product-images').querySelector('.product-main-image');
        mainImage.src = this.src;
        
        // Remover clase activa de todas las miniaturas
        this.closest('.product-thumbnails').querySelectorAll('.product-thumbnail').forEach(img => {
            img.classList.remove('active-thumbnail');
        });
        
        // Agregar clase activa a la miniatura clickeada
        this.classList.add('active-thumbnail');
    });
});

// Botón de WhatsApp
document.querySelectorAll('.whatsapp-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const productName = this.closest('.product-info').querySelector('h3').textContent;
        const price = this.closest('.product-price').querySelector('.price').textContent;
        const message = `¡Hola! Estoy interesado en comprar: ${productName} (${price}). ¿Podrían darme más información?`;
        const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });
});

// Efecto de scroll para el header
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Activar la primera miniatura de cada producto
document.querySelectorAll('.product-thumbnails').forEach(thumbnails => {
    if (thumbnails.children.length > 0) {
        thumbnails.children[0].classList.add('active-thumbnail');
    }
});

// Carrito simple con persistencia
let cart = [];
if (localStorage.getItem('cart')) {
    cart = JSON.parse(localStorage.getItem('cart'));
}

function updateCartCount() {
    document.getElementById('cart-count').textContent = cart.reduce((sum, item) => sum + item.qty, 0);
    localStorage.setItem('cart', JSON.stringify(cart)); // Guarda el carrito
}

function updateCartModal() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>El carrito está vacío.</p>';
        cartTotal.textContent = '';
        return;
    }
    cartItems.innerHTML = cart.map((item, idx) =>
        `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;gap:10px;">
            <span>${item.name} <span style="font-size:0.9em;color:#888;">(${item.color}, Talla: ${item.talla})</span></span>
            <div style="display:flex;align-items:center;gap:5px;">
                <button class="cart-qty-btn" data-idx="${idx}" data-action="decrease" style="padding:2px 8px;">-</button>
                <span>${item.qty}</span>
                <button class="cart-qty-btn" data-idx="${idx}" data-action="increase" style="padding:2px 8px;">+</button>
            </div>
            <span>${item.price}</span>
            <button class="cart-remove-btn" data-idx="${idx}" style="color:red;background:none;border:none;font-size:1.2rem;cursor:pointer;">&times;</button>
        </div>`
    ).join('');
    // Listeners para aumentar/disminuir cantidad
    cartItems.querySelectorAll('.cart-qty-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.getAttribute('data-idx'));
            const action = this.getAttribute('data-action');
            if (action === 'increase') {
                cart[idx].qty += 1;
            } else if (action === 'decrease' && cart[idx].qty > 1) {
                cart[idx].qty -= 1;
            }
            updateCartCount();
            updateCartModal();
        });
    });
    // Listener para quitar producto
    cartItems.querySelectorAll('.cart-remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.getAttribute('data-idx'));
            cart.splice(idx, 1);
            updateCartCount();
            updateCartModal();
        });
    });
    // Validación segura para el precio
    const total = cart.reduce((sum, item) => {
        let price = typeof item.price === 'string' ? item.price : '';
        price = price.replace('$','').replace(',','');
        const num = parseFloat(price) || 0;
        return sum + (num * item.qty);
    }, 0);
    cartTotal.textContent = 'Total: $' + total.toLocaleString();
}

// Botón agregar al carrito
document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const product = this.closest('.product-card');
        const nameElem = product.querySelector('.product-info h3');
        const priceElem = product.querySelector('.price');
        const sizeSelect = product.querySelector('.size-select');
        const selectedColor = product.querySelector('.color-option.selected-color');
        if (!selectedColor) {
            alert('Por favor selecciona un color antes de agregar al carrito.');
            return;
        }
        if (!sizeSelect || !sizeSelect.value) {
            alert('Por favor selecciona una talla antes de agregar al carrito.');
            return;
        }
        const color = selectedColor.getAttribute('data-color');
        const talla = sizeSelect.value;
        if (!nameElem || !priceElem) return;
        const name = nameElem.textContent;
        const price = priceElem.textContent;
        const existing = cart.find(item => item.name === name && item.price === price && item.color === color && item.talla === talla);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ name, price, qty: 1, color, talla });
        }
        updateCartCount();
    });
});

// Mostrar/ocultar modal del carrito
document.getElementById('cart-link').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('cart-modal').style.display = 'flex';
    updateCartModal();
});
document.getElementById('close-cart').addEventListener('click', function() {
    document.getElementById('cart-modal').style.display = 'none';
});

document.getElementById('send-cart-whatsapp').addEventListener('click', function() {
    if (cart.length === 0) {
        alert('El carrito está vacío.');
        return;
    }
    
    let message = '¡Hola! Quiero comprar estos productos:%0A';
    
    cart.forEach(item => {
        let colorText = item.color ? `, Color: ${item.color}` : '';
        let tallaText = item.talla ? `, Talla: ${item.talla}` : '';
        let unidades = `${item.qty} unidad${item.qty > 1 ? 'es' : ''}`; // ✅ aquí se cambia el formato
        message += `• ${item.name} - ${unidades} (${item.price}${colorText}${tallaText})%0A`;
    });
    
    const total = cart.reduce((sum, item) => sum + (parseFloat(item.price.replace('$','').replace(',','')) * item.qty), 0);
    message += `%0ATotal: $${total.toLocaleString()}`;
    
    const whatsappUrl = `https://wa.me/522261032568?text=${message}`;
    window.open(whatsappUrl, '_blank');
});


// Paginación de productos
document.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Quitar clase activa de todos los botones
        document.querySelectorAll('.page-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        // Ocultar todas las páginas de productos
        document.querySelectorAll('.products-page').forEach(page => page.style.display = 'none');
        // Mostrar la página seleccionada
        const pageNum = this.getAttribute('data-page');
        const pageToShow = document.querySelector('.products-page-' + pageNum);
        if (pageToShow) pageToShow.style.display = '';
    });
});

// Acciones que dependen del DOM completo
window.addEventListener('DOMContentLoaded', () => {
    // Selección de color en productos
    document.querySelectorAll('.color-options').forEach(options => {
        options.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', function() {
                options.querySelectorAll('.color-option').forEach(opt =>
                    opt.classList.remove('selected-color'));
                this.classList.add('selected-color');
            });
        });
    });

    // Llenar las tallas disponibles
    document.querySelectorAll('.product-card').forEach(card => {
        const nameElem = card.querySelector('.product-info h3');
        const select = card.querySelector('.size-select');
        if (nameElem && select && typeof tallasPorProducto !== 'undefined') {
            const nombre = nameElem.textContent.trim();
            const tallas = tallasPorProducto[nombre];
            if (Array.isArray(tallas)) {
                tallas.forEach(talla => {
                    const option = document.createElement('option');
                    option.value = talla;
                    option.textContent = talla;
                    select.appendChild(option);
                });
            }
        }
    });

    // Al cargar la página, actualiza el contador
    updateCartCount();
});
