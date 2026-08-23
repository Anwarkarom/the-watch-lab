import express from 'express';
import Product from '../models/Product.js';
import { initialProducts } from '../data/initialProducts.js';

const router = express.Router();

// GET all products with filtering & sorting
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, gender } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }
    if (gender && gender !== 'All') {
      query.gender = gender;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let products = [];
    try {
      let sortOption = {};
      if (sort === 'price-low') sortOption.price = 1;
      else if (sort === 'price-high') sortOption.price = -1;
      else if (sort === 'rating') sortOption.rating = -1;
      else sortOption.createdAt = -1;

      products = await Product.find(query).sort(sortOption);
    } catch (dbErr) {
      console.log('Using in-memory fallback for products');
    }

    // Fallback if DB empty or disconnected
    if (!products || products.length === 0) {
      products = initialProducts;
      if (category && category !== 'All') {
        products = products.filter(p => p.category === category);
      }
      if (gender && gender !== 'All') {
        products = products.filter(p => p.gender === gender);
      }
      if (search) {
        const s = search.toLowerCase();
        products = products.filter(p => p.title.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
      }
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    let product;
    try {
      product = await Product.findById(req.params.id);
    } catch (err) {}

    if (!product) {
      product = initialProducts.find(p => p._id === req.params.id || p.id === req.params.id);
    }

    if (!product) return res.status(404).json({ message: 'Watch not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new product (Admin)
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
