import express from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { initialProducts } from '../data/initialProducts.js';
import { connectDB } from '../config/db.js';

const router = express.Router();

// GET all products with filtering & sorting
router.get('/', async (req, res) => {
  try {
    await connectDB();
    const { category, search, sort, gender } = req.query;
    let products = [];

    if (mongoose.connection.readyState === 1) {
      try {
        let query = {};
        if (category && category !== 'All') query.category = category;
        if (gender && gender !== 'All') query.gender = gender;
        if (search) {
          query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ];
        }

        let sortOption = {};
        if (sort === 'price-low') sortOption.price = 1;
        else if (sort === 'price-high') sortOption.price = -1;
        else if (sort === 'rating') sortOption.rating = -1;
        else sortOption.createdAt = -1;

        products = await Product.find(query).sort(sortOption);
      } catch (dbErr) {
        console.warn('DB query error, switching to fallback:', dbErr.message);
      }
    }

    // Fallback if DB disconnected or empty
    if (!products || products.length === 0) {
      products = [...initialProducts];
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
      if (sort === 'price-low') products.sort((a, b) => a.price - b.price);
      else if (sort === 'price-high') products.sort((a, b) => b.price - a.price);
      else if (sort === 'rating') products.sort((a, b) => b.rating - a.rating);
    }

    res.json(products);
  } catch (error) {
    console.error('Unhandled error in /api/products:', error.message);
    res.json(initialProducts);
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    await connectDB();
    let product;
    if (mongoose.connection.readyState === 1) {
      try {
        product = await Product.findById(req.params.id);
      } catch (err) {}
    }

    if (!product) {
      product = initialProducts.find(p => p._id === req.params.id || p.id === req.params.id);
    }

    if (!product) return res.status(404).json({ message: 'Watch not found' });
    res.json(product);
  } catch (error) {
    const fallback = initialProducts.find(p => p._id === req.params.id);
    res.json(fallback || initialProducts[0]);
  }
});

// POST new product (Admin)
router.post('/', async (req, res) => {
  try {
    await connectDB();
    if (mongoose.connection.readyState === 1) {
      const product = new Product(req.body);
      const createdProduct = await product.save();
      return res.status(201).json(createdProduct);
    }
    
    // In-memory response if DB disconnected
    const mockCreated = { ...req.body, _id: `mem_${Date.now()}` };
    res.status(201).json(mockCreated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
