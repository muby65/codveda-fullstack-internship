// Server Code
const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// Read Operation: Start
let products = [
  { id: 1, name: 'Laptop', price: 850 },
  { id: 2, name: 'Phone', price: 500 },
  { id: 3, name: 'Headphones', price: 60 },
];

app.get('/products', (req, res) => {
  res.json(products);
});

app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === Number(req.params.id));

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.json(product);
});
// END

// Create Operation: Start
app.post('/products', (req, res) => {
  const { name, price } = req.body;

  if (!name || typeof price !== 'number') {
    return res.status(400).json({ message: 'Name and price are required' });
  }

  const newProduct = {
    id: products.length ? products[products.length - 1].id + 1 : 1,
    name,
    price,
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});
// END

// Update Operation: Start
app.put('/products/:id', (req, res) => {
  const product = products.find(p => p.id === Number(req.params.id));

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const { name, price } = req.body;

  if (name !== undefined) product.name = name;
  if (price !== undefined) product.price = price;

  res.json(product);
});
// END

// Delete Operation: Start
app.delete('/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  products.splice(index, 1);
  res.json({ message: 'Product deleted' });
});
// END

// Error Handling Code
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});
// End



// Server Code
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
