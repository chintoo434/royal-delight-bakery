const productList = document.getElementById('product-list');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartIcon = document.getElementById('cart-icon');
const cartBox = document.getElementById('cart');
const whatsappLink = document.getElementById('whatsapp-link');
const clearCartBtn = document.getElementById('clear-cart');
const searchInput = document.getElementById('search');
const bakeryName = document.getElementById('bakery-name');

let selectedCategory = '';
let cart = {}; // key: productName|sizeLabel, value: { name, size, price, quantity }

// Render all products
function renderProducts(filter = '', category = '') {
  productList.innerHTML = '';

  products
    .filter(p =>
      p.name.toLowerCase().includes(filter.toLowerCase()) &&
      (category === '' || p.category === category)
    )
    .forEach(p => {
      const div = document.createElement('div');
      div.className = 'product';

      let sizeOptionsHTML = '';
      let selectedSize = '';
      let price = p.price;

      if (p.sizes) {
        selectedSize = p.sizes[0].label;
        price = p.sizes[0].price;
        sizeOptionsHTML = `
          <select class="size-select" data-product="${p.name}">
            ${p.sizes.map(s => `<option value="${s.label}" data-price="${s.price}">${s.label}</option>`).join('')}
          </select>
        `;
      }

      const key = selectedSize ? `${p.name}|${selectedSize}` : p.name;
      const itemInCart = cart[key];

      let actionButtonsHTML = '';
      if (itemInCart) {
        actionButtonsHTML = `
          <div class="qty-controls">
            <button class="qty-btn" onclick='changeQty("${key}", -1)'>−</button>
            <span>${itemInCart.quantity}</span>
            <button class="qty-btn" onclick='changeQty("${key}", 1)'>＋</button>
          </div>
        `;
      } else {
        actionButtonsHTML = `<button onclick='addToCart("${p.name}")'>Add to Cart</button>`;
      }

      div.innerHTML = `
        <img src="${p.img}" alt="${p.name}" />
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        ${sizeOptionsHTML}
        <strong id="price-${p.name}">₹${price}</strong><br>
        <div id="action-${p.name}">${actionButtonsHTML}</div>
      `;

      productList.appendChild(div);
    });

  // Attach size change listener
  document.querySelectorAll('.size-select').forEach(select => {
    select.addEventListener('change', function () {
      updatePrice(this);
      const name = this.dataset.product;
      const selectedSize = this.value;
      const key = `${name}|${selectedSize}`;
      const itemInCart = cart[key];

      const actionDiv = document.getElementById(`action-${name}`);
      if (itemInCart) {
        actionDiv.innerHTML = `
          <div class="qty-controls">
            <button class="qty-btn" onclick='changeQty("${key}", -1)'>−</button>
            <span>${itemInCart.quantity}</span>
            <button class="qty-btn" onclick='changeQty("${key}", 1)'>＋</button>
          </div>
        `;
      } else {
        actionDiv.innerHTML = `<button onclick='addToCart("${name}")'>Add to Cart</button>`;
      }
    });
  });
}

// Update price display
function updatePrice(select) {
  const price = select.options[select.selectedIndex].dataset.price;
  const name = select.dataset.product;
  document.getElementById(`price-${name}`).innerText = `₹${price}`;
}

// Add item to cart
function addToCart(name) {
  const product = products.find(p => p.name === name);
  let size = '';
  let price = product.price;

  if (product.sizes) {
    const select = document.querySelector(`select[data-product="${name}"]`);
    size = select.value;
    price = parseInt(select.options[select.selectedIndex].dataset.price);
  }

  const key = size ? `${name}|${size}` : name;

  if (cart[key]) {
    cart[key].quantity += 1;
  } else {
    cart[key] = { name, size, price, quantity: 1 };
  }

  updateCart();

  // Manually update only this product’s action buttons
  const actionDiv = document.getElementById(`action-${name}`);
  actionDiv.innerHTML = `
    <div class="qty-controls">
      <button class="qty-btn" onclick='changeQty("${key}", -1)'>−</button>
      <span>${cart[key].quantity}</span>
      <button class="qty-btn" onclick='changeQty("${key}", 1)'>＋</button>
    </div>
  `;
}

// Change item quantity
function changeQty(key, delta) {
  if (cart[key]) {
    cart[key].quantity += delta;
    if (cart[key].quantity <= 0) {
      delete cart[key];
    }
    updateCart();

    const [name, size] = key.split('|');
    const actionDiv = document.getElementById(`action-${name}`);
    if (!cart[key]) {
      actionDiv.innerHTML = `<button onclick='addToCart("${name}")'>Add to Cart</button>`;
    } else {
      actionDiv.innerHTML = `
        <div class="qty-controls">
          <button class="qty-btn" onclick='changeQty("${key}", -1)'>−</button>
          <span>${cart[key].quantity}</span>
          <button class="qty-btn" onclick='changeQty("${key}", 1)'>＋</button>
        </div>
      `;
    }
  }
}

// Update cart UI
function updateCart() {
  cartItems.innerHTML = '';
  let cartCountValue = 0;
  let total = 0;
  let message = 'Order details:\n';

  Object.keys(cart).forEach((key, i) => {
    const item = cart[key];
    cartCountValue += item.quantity;
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    cartItems.innerHTML += `
      <li>
        ${item.name}${item.size ? ` (${item.size})` : ''} x${item.quantity} - ₹${itemTotal}
        <br>
        <button class="qty-btn" onclick='changeQty("${key}", -1)'>−</button>
        <button class="qty-btn" onclick='changeQty("${key}", 1)'>＋</button>
      </li>
    `;

    message += `${i + 1}. ${item.name}${item.size ? ` (${item.size})` : ''} x${item.quantity} - ₹${itemTotal}\n`;
  });

  cartCount.textContent = cartCountValue;

  if (cartCountValue > 0) {
    cartItems.innerHTML += `<li><strong>Total: ₹${total}</strong></li>`;
    message += `Total: ₹${total}`;
    whatsappLink.href = `https://wa.me/+919760648714?text=${encodeURIComponent(message)}`;
  } else {
    whatsappLink.href = `https://wa.me/+919760648714`;
  }

  // 🚫 Do NOT call renderProducts() here — size selection stays intact
}

// Init event listeners
clearCartBtn.addEventListener('click', () => {
  cart = {};
  updateCart();

  // Re-render action buttons for all visible products
  document.querySelectorAll('.product').forEach(productEl => {
    const name = productEl.querySelector('h3').innerText;
    const select = productEl.querySelector('select');
    const selectedSize = select ? select.value : '';
    const key = selectedSize ? `${name}|${selectedSize}` : name;

    const actionDiv = document.getElementById(`action-${name}`);
    actionDiv.innerHTML = `<button onclick='addToCart("${name}")'>Add to Cart</button>`;
  });
});


cartIcon.addEventListener('click', () => {
  cartBox.style.display = 'block';
  cartBox.scrollIntoView({ behavior: 'smooth' });
});

searchInput.addEventListener('input', e => {
  renderProducts(e.target.value, selectedCategory);
});

document.querySelectorAll('#category-menu button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#category-menu button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedCategory = btn.dataset.category;
    renderProducts(searchInput.value, selectedCategory);
  });
});

window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    bakeryName.classList.add('fixed');
  } else {
    bakeryName.classList.remove('fixed');
  }
});

// Init
renderProducts();
updateCart();
