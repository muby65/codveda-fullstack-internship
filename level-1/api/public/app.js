const productList = document.getElementById('product-list');

function showMessage(text, isError = false) {
  productList.innerHTML = '';
  const p = document.createElement('p');
  p.className = isError ? 'message error' : 'message';
  p.textContent = text;
  productList.appendChild(p);
}

function createCard(product) {
  const card = document.createElement('article');
  card.className = 'card';

  const avatar = document.createElement('div');
  avatar.className = 'avatar';
  avatar.textContent = product.name.charAt(0);

  const name = document.createElement('h2');
  name.textContent = product.name;

  const price = document.createElement('p');
  price.className = 'price';
  price.textContent = `$${product.price}`;

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = 'Delete';
  deleteBtn.addEventListener('click', () => deleteProduct(product.id));

  card.append(avatar, name, price, deleteBtn);
  return card;
}

function displayProducts(products) {
  if (products.length === 0) {
    showMessage('No products yet.');
    return;
  }

  productList.innerHTML = '';
  products.forEach(product => {
    productList.appendChild(createCard(product));
  });
}

async function loadProducts() {
  showMessage('Loading products...');

  try {
    const response = await fetch('/products');

    if (!response.ok) {
      throw new Error('Failed to load products');
    }

    const products = await response.json();
    displayProducts(products);
  } catch (error) {
    showMessage(error.message, true);
  }
}

async function deleteProduct(id) {
  try {
    const response = await fetch(`/products/${id}`, { method: 'DELETE' });

    if (!response.ok) {
      throw new Error('Could not delete product');
    }

    loadProducts();
  } catch (error) {
    showMessage(error.message, true);
  }
}

const form = document.getElementById('product-form');
const formMessage = document.getElementById('form-message');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const price = Number(document.getElementById('price').value);

  try {
    const response = await fetch('/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, price }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message);
    }

    form.reset();
    formMessage.textContent = 'Product added!';
    formMessage.className = 'success';
    loadProducts();
  } catch (error) {
    formMessage.textContent = error.message;
    formMessage.className = 'error';
  }
});

loadProducts();
