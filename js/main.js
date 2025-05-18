const products = [
  { name: '[C01] Doll Cake', desc: 'Delicious rich chocolate cake', size: '1 pound', price: 300, img: 'img/C01.jpg', category: 'Cake' },
  { name: 'Red Velvet Cupcake', desc: 'Creamy red velvet cupcake', price: 150, img: 'img/cake2.jpg', category: 'Cake' },
  { name: 'Black Forest Cake', desc: 'Classic black forest cake', size: '1.5 pounds', price: 250, img: 'img/cake2.jpg', category: 'Cake' },
  { name: 'Cheese Pizza', desc: 'Hot cheesy pizza', price: 350, img: 'img/pizza1.jpg', category: 'Pizza' },
  { name: 'Veg Burger', desc: 'Crispy vegetable burger', price: 180, img: 'img/burger1.jpg', category: 'Burger' },
  { name: 'Paneer Sandwich', desc: 'Grilled paneer sandwich', price: 120, img: 'img/sandwich1.jpg', category: 'Sandwich' },
  { name: 'Cold Drink', desc: 'Chilled fizzy drink', price: 50, img: 'img/softdrink1.jpg', category: 'Soft Drink' },
  { name: 'Fairy Lights', desc: 'Warm LED string lights', price: 199, img: 'img/decor1.jpg', category: 'Decoration' },
  { name: 'Table Flower Vase', desc: 'Glass vase with artificial flowers', price: 349, img: 'img/decor2.jpg', category: 'Decoration' }
];

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
let cart = {}; // { productName: { price, quantity } }

// Render product cards
function renderProducts(filter = '', category = '') {
  productList.innerHTML = '';
  products
    .filter(p =>
      p.name.toLowerCase().includes(filter.toLowerCase()) &&
      (category === '' || p.category === category)
    )
    .forEach(p => {
      const quantity = cart[p.name]?.quantity || 0;
      const div = document.createElement('div');
      div.className = 'product';

      div.innerHTML = quantity === 0
        ? `
          <img src="${p.img}" alt="${p.name}" />
          <h3>${p.name}</h3>
          <p>${p.desc}</p>
          ${p.size ? `<p><em>Size: ${p.size}</em></p>` : ''}
          <strong>₹${p.price}</strong><br>
          <button onclick='addToCart("${p.name}", ${p.price})'>Add to Cart</button>
        `
        : `
          <img src="${p.img}" alt="${p.name}" />
          <h3>${p.name}</h3>
          <p>${p.desc}</p>
          ${p.size ? `<p><em>Size: ${p.size}</em></p>` : ''}
          <strong>₹${p.price}</strong><br>
          <div class="qty-controls">
            <button class="qty-btn" onclick='changeQty("${p.name}", -1)'>−</button>
            <span>${quantity}</span>
            <button class="qty-btn" onclick='changeQty("${p.name}", 1)'>＋</button>
          </div>
        `;

      productList.appendChild(div);
    });
}

// Add item to cart
function addToCart(name, price) {
  if (cart[name]) {
    cart[name].quantity += 1;
  } else {
    cart[name] = { price, quantity: 1 };
  }
  updateCart();
}

// Change item quantity
function changeQty(name, delta) {
  if (cart[name]) {
    cart[name].quantity += delta;
    if (cart[name].quantity <= 0) {
      delete cart[name];
    }
    updateCart();
  }
}

// Update cart display and WhatsApp link
function updateCart() {
  cartItems.innerHTML = '';
  let cartCountValue = 0;
  let total = 0;
  let message = 'Order details:\n';

  Object.keys(cart).forEach((name, i) => {
    const item = cart[name];
    cartCountValue += item.quantity;
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    // Find product to get size
    const product = products.find(p => p.name === name);
    const sizeText = product?.size ? ` (${product.size})` : '';

    // Add to cart UI
    cartItems.innerHTML += `
      <li>
        ${name}${sizeText} x${item.quantity} - ₹${itemTotal}
        <br>
        <button class="qty-btn" onclick='changeQty("${name}", -1)'>−</button>
        <button class="qty-btn" onclick='changeQty("${name}", 1)'>＋</button>
      </li>`;

    // Add to WhatsApp message
    message += `${i + 1}. ${name}${sizeText} x${item.quantity} - ₹${itemTotal}\n`;
  });

  cartCount.textContent = cartCountValue;

  if (cartCountValue > 0) {
    cartItems.innerHTML += `<li><strong>Total: ₹${total}</strong></li>`;
  }

  if (cartCountValue === 1) {
    const name = Object.keys(cart)[0];
    const item = cart[name];
    const product = products.find(p => p.name === name);
    const sizeText = product?.size ? ` (${product.size})` : '';
    whatsappLink.href = `https://wa.me/+919760648714?text=${encodeURIComponent(`Order: ${name}${sizeText} x${item.quantity} - ₹${item.price * item.quantity}`)}`;
  } else if (cartCountValue > 1) {
    message += `Total: ₹${total}`;
    whatsappLink.href = `https://wa.me/+919760648714?text=${encodeURIComponent(message)}`;
  } else {
    whatsappLink.href = `https://wa.me/+919760648714`;
  }

  renderProducts(searchInput.value, selectedCategory);
}



// Clear the cart
clearCartBtn.addEventListener('click', () => {
  cart = {};
  updateCart();
});

// Show cart box on cart icon click
cartIcon.addEventListener('click', () => {
  cartBox.style.display = 'block';
  cartBox.scrollIntoView({ behavior: 'smooth' });
});

// Handle search input
searchInput.addEventListener('input', e => {
  renderProducts(e.target.value, selectedCategory);
});

// Handle category selection
document.querySelectorAll('#category-menu button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#category-menu button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedCategory = btn.dataset.category;
    renderProducts(searchInput.value, selectedCategory);
  });
});

// Move bakery name to top-right on scroll
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    bakeryName.classList.add('fixed');
  } else {
    bakeryName.classList.remove('fixed');
  }
});

// Initial render
renderProducts();
updateCart();
