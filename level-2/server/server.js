const mongoose = require('mongoose');
const express = require('express');
const Product = require('./models/Product');
const Category = require('./models/Category');

mongoose
  .connect('mongodb://127.0.0.1:27017/codveda_store')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err.message));

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// ---------- Categories ----------
app.get('/categories', async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

app.post('/categories', async (req, res, next) => {
  try {
    const category = await Category.create({ name: req.body.name });
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
});

// ---------- Products ----------
app.get('/products', async (req, res, next) => {
  try {
    const products = await Product.find()
      .populate('category', 'name')
      .sort({ createdAt: 1 });
    res.json(products);
  } catch (err) {
    next(err);
  }
});

app.get('/products/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    next(err);
  }
});

app.post('/products', async (req, res, next) => {
  try {
    const { name, price, category } = req.body;
    const product = await Product.create({ name, price, category });
    await product.populate('category', 'name');
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

app.put('/products/:id', async (req, res, next) => {
  try {
    const updates = {};
    ['name', 'price', 'category'].forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate('category', 'name');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    next(err);
  }
});

app.delete('/products/:id', async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
});

// ---------- Errors ----------
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(e => e.message).join(', ');
    return res.status(400).json({ message });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid id' });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: 'That name already exists' });
  }

  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
