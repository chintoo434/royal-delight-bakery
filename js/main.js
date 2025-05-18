const products = [
    {
      name: 'Chocolate Cake',
      desc: 'Delicious rich chocolate cake',
      price: 300,
      img: 'img/cake1.jpg'
    },
    {
      name: 'Red Velvet Cupcake',
      desc: 'Creamy red velvet cupcake',
      price: 150,
      img: 'img/cake2.jpg'
    }
  ];
  
  const productList = document.getElementById('product-list');
  const cartItems = document.getElementById('cart-items');
  let cart = [];
  
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
    cart.push({ name, price });
    updateCart();
  }
  
  function updateCart() {
    cartItems.innerHTML = cart.map(item => `<li>${item.name} - ₹${item.price}</li>`).join('');
  }
  
  document.getElementById('search').addEventListener('input', e => {
    renderProducts(e.target.value);
  });
  
  renderProducts();
  