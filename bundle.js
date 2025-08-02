const tallasPorProducto = {
    "AirMax Runner Pro":    ["22", "22.5", "23", "23.5", "24", "24.5", "25", "25.5", "26", "26.5", "27", "27.5", "28", "28.5", "29", "29.5", "30"],
    "Urban Flex 2023":      ["22", "23", "24", "25", "26", "27", "28", "29", "30"]
};

const coloresPorProducto = {
  "AirMax Runner Pro":    ["#2a2a72", "#1e1e24", "#ffa400"],
  "Urban Flex 2023":      ["#1e1e24", "#6c757d", "#f8f9fa"]
};

const products = [
  {
    name: "AirMax Runner Pro",
    badge: "Nuevo",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1350&q=80"
    ],
    description: "Tenis deportivos con tecnología de amortiguación AirMax para máxima comodidad durante tus entrenamientos.",
    price: "$1,499",
    originalPrice: "$1,799"
  },
  {
    name: "Urban Flex 2023",
    badge: "",
    images: [
      "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1350&q=80"
    ],
    description: "Tenis ligeros y flexibles ideales para la ciudad.",
    price: "$1,499",
    originalPrice: "$1,799"
  }
];

function renderProducts() {
  const grid = document.getElementById('products-grid');
  const template = document.getElementById('product-template');
  products.forEach(prod => {
    const clone = template.content.cloneNode(true);
    const badge = clone.querySelector('.product-badge');
    if (prod.badge) {
      badge.textContent = prod.badge;
    } else {
      badge.remove();
    }
    const mainImage = clone.querySelector('.product-main-image');
    mainImage.src = prod.images[0];
    mainImage.alt = prod.name;
    mainImage.loading = 'lazy';
    mainImage.srcset = `${prod.images[0]}?w=300 300w, ${prod.images[0]}?w=600 600w`;
    mainImage.sizes = '(max-width: 600px) 300px, 600px';
    const thumbContainer = clone.querySelector('.product-thumbnails');
    prod.images.forEach((img, idx) => {
      const t = document.createElement('img');
      t.src = img;
      t.alt = `${prod.name} miniatura ${idx+1}`;
      t.className = 'product-thumbnail';
      t.loading = 'lazy';
      t.srcset = `${img}?w=150 150w, ${img}?w=300 300w`;
      t.sizes = '(max-width: 600px) 150px, 300px';
      thumbContainer.appendChild(t);
    });
    clone.querySelector('h3').textContent = prod.name;
    clone.querySelector('.product-description').textContent = prod.description;
    const sizeSelect = clone.querySelector('.size-select');
    const sizeLabel = clone.querySelector('.size-label');
    const sizeId = `size-${prod.name.replace(/\s+/g,'-')}`;
    sizeSelect.id = sizeId;
    sizeLabel.setAttribute('for', sizeId);
    sizeLabel.textContent = 'Talla:';
    const sizes = tallasPorProducto[prod.name] || [];
    sizes.forEach(t => {
      const option = document.createElement('option');
      option.value = t;
      option.textContent = t;
      sizeSelect.appendChild(option);
    });
    const colorContainer = clone.querySelector('.color-options');
    const colors = coloresPorProducto[prod.name] || [];
    colors.forEach(code => {
      const div = document.createElement('div');
      div.className = 'color-option';
      div.dataset.color = code;
      div.style.backgroundColor = code;
      colorContainer.appendChild(div);
    });
    clone.querySelector('.price').textContent = prod.price;
    clone.querySelector('.original-price').textContent = prod.originalPrice;
    grid.appendChild(clone);
  });
}

function throttle(fn, wait) {
  let last = 0;
  return function(...args) {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn.apply(this, args);
    }
  };
}

let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function updateCartCount() {
  document.getElementById('cart-count').textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  localStorage.setItem('cart', JSON.stringify(cart));
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
  cartItems.querySelectorAll('.cart-qty-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const idx = parseInt(this.dataset.idx);
      const action = this.dataset.action;
      if (action === 'increase') cart[idx].qty += 1;
      if (action === 'decrease' && cart[idx].qty > 1) cart[idx].qty -= 1;
      updateCartCount();
      updateCartModal();
    });
  });
  cartItems.querySelectorAll('.cart-remove-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const idx = parseInt(this.dataset.idx);
      cart.splice(idx,1);
      updateCartCount();
      updateCartModal();
    });
  });
  const total = cart.reduce((sum, item) => {
    let price = item.price.replace('$','').replace(',','');
    const num = parseFloat(price) || 0;
    return sum + (num * item.qty);
  },0);
  cartTotal.textContent = 'Total: $' + total.toLocaleString();
}

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();

  document.querySelectorAll('.product-thumbnails').forEach(thumbnails => {
    if (thumbnails.children.length > 0) {
      thumbnails.children[0].classList.add('active-thumbnail');
    }
  });

  document.addEventListener('click', e => {
    if (e.target.classList.contains('product-thumbnail')) {
      const mainImage = e.target.closest('.product-images').querySelector('.product-main-image');
      mainImage.src = e.target.src;
      e.target.parentElement.querySelectorAll('.product-thumbnail').forEach(img => img.classList.remove('active-thumbnail'));
      e.target.classList.add('active-thumbnail');
    }
    if (e.target.classList.contains('color-option')) {
      const options = e.target.parentElement;
      options.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected-color'));
      e.target.classList.add('selected-color');
    }
  });

  document.querySelectorAll('.whatsapp-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const productName = this.closest('.product-card').querySelector('h3').textContent;
      const price = this.closest('.product-price').querySelector('.price').textContent;
      const message = `¡Hola! Estoy interesado en comprar: ${productName} (${price}). ¿Podrían darme más información?`;
      const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    });
  });

  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const product = this.closest('.product-card');
      const name = product.querySelector('h3').textContent;
      const price = product.querySelector('.price').textContent;
      const sizeSelect = product.querySelector('.size-select');
      const selectedColor = product.querySelector('.color-option.selected-color');
      if (!selectedColor) {
        alert('Por favor selecciona un color antes de agregar al carrito.');
        return;
      }
      if (!sizeSelect.value) {
        alert('Por favor selecciona una talla antes de agregar al carrito.');
        return;
      }
      const color = selectedColor.dataset.color;
      const talla = sizeSelect.value;
      const existing = cart.find(item => item.name === name && item.price === price && item.color === color && item.talla === talla);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ name, price, qty: 1, color, talla });
      }
      updateCartCount();
    });
  });

  document.getElementById('cart-link').addEventListener('click', e => {
    e.preventDefault();
    const modal = document.getElementById('cart-modal');
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    updateCartModal();
  });
  document.getElementById('close-cart').addEventListener('click', () => {
    const modal = document.getElementById('cart-modal');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  });
  document.getElementById('send-cart-whatsapp').addEventListener('click', () => {
    if (cart.length === 0) {
      alert('El carrito está vacío.');
      return;
    }
    let message = '¡Hola! Quiero comprar estos productos:%0A';
    cart.forEach(item => {
      let colorText = item.color ? `, Color: ${item.color}` : '';
      let tallaText = item.talla ? `, Talla: ${item.talla}` : '';
      let unidades = `${item.qty} unidad${item.qty > 1 ? 'es' : ''}`;
      message += `• ${item.name} - ${unidades} (${item.price}${colorText}${tallaText})%0A`;
    });
    const total = cart.reduce((sum, item) => sum + (parseFloat(item.price.replace('$','').replace(',','')) * item.qty), 0);
    message += `%0ATotal: $${total.toLocaleString()}`;
    const whatsappUrl = `https://wa.me/522261032568?text=${message}`;
    window.open(whatsappUrl, '_blank');
  });

  window.addEventListener('scroll', throttle(() => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, 200));

  const form = document.getElementById('contact-form');
  const formMessage = document.getElementById('form-message');
  form.addEventListener('submit', e => {
    e.preventDefault();
    formMessage.textContent = 'Mensaje enviado correctamente.';
  });

  document.getElementById('current-year').textContent = new Date().getFullYear();
  updateCartCount();
});
