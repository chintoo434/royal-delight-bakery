const products = [
    { name: 'Chocolate Cake', desc: 'Delicious rich chocolate cake', price: 300, img: 'img/cake1.jpg' },
    { name: 'Red Velvet Cupcake', desc: 'Creamy red velvet cupcake', price: 150, img: 'img/cake2.jpg' },
    { name: 'Black Forest Cake', desc: 'Classic black forest cake', price: 250, img: 'img/cake2.jpg' }
  ];
  
  const productList = document.getElementById('product-list');
  const cartItems = document.getElementById('cart-items');
  const cartCount = document.getElementById('cart-count');
  const cartIcon = document.getElementById('cart-icon');
  const cartBox = document.getElementById('cart');
  const whatsappLink = document.getElementById('whatsapp-link');
  const clearCartBtn = document.getElementById('clear-cart');
  
  let cart = {}; // { productName: { price, quantity } }
  
  function renderProducts(filter = '') {
    productList.innerHTML = '';
    products
      .filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
      .forEach(p => {
        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `
          <img src="${p.img}" alt="${p.name}" />
          <h3>${p.name}</h3>
          <p>${p.desc}</p>
          <strong>₹${p.price}</strong><br>
          <button onclick='addToCart("${p.name}", ${p.price})'>Add to Cart</button>
        `;
        productList.appendChild(div);
      });
  }
  
  function addToCart(name, price) {
    if (cart[name]) {
      cart[name].quantity += 1;
    } else {
      cart[name] = { price, quantity: 1 };
    }
    updateCart();
  }
  
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
      cartItems.innerHTML += `<li>${name} x${item.quantity} - ₹${itemTotal}</li>`;
      message += `${i + 1}. ${name} x${item.quantity} - ₹${itemTotal}\n`;
    });
  
    cartCount.textContent = cartCountValue;
  
    if (cartCountValue === 1) {
      const name = Object.keys(cart)[0];
      const item = cart[name];
      whatsappLink.href = `https://wa.me/+919760648714?text=${encodeURIComponent(`Order: ${name} x${item.quantity} - ₹${item.price * item.quantity}`)}`;
    } else if (cartCountValue > 1) {
      message += `Total: ₹${total}`;
      whatsappLink.href = `https://wa.me/+919760648714?text=${encodeURIComponent(message)}`;
    } else {
      whatsappLink.href = `https://wa.me/+919760648714`;
    }
  }
  
  cartIcon.addEventListener('click', () => {
    cartBox.style.display = cartBox.style.display === 'none' ? 'block' : 'none';
  });
  
  clearCartBtn.addEventListener('click', () => {
    cart = {};
    updateCart();
  });
  
  document.getElementById('search').addEventListener('input', e => {
    renderProducts(e.target.value);
  });
  
  renderProducts();
  updateCart();
  