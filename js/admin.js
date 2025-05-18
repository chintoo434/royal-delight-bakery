const form = document.getElementById('product-form');
const preview = document.getElementById('admin-preview');

form.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('product-name').value;
  const desc = document.getElementById('product-desc').value;
  const price = document.getElementById('product-price').value;
  const image = document.getElementById('product-image').files[0];

  const reader = new FileReader();
  reader.onload = function(e) {
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
      <img src="${e.target.result}" alt="${name}" />
      <h3>${name}</h3>
      <p>${desc}</p>
      <strong>₹${price}</strong>
    `;
    preview.appendChild(div);
  };
  reader.readAsDataURL(image);
});
