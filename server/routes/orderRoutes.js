import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import { connectDB } from '../config/db.js';

const router = express.Router();

const inMemoryOrders = [];

const generateTrackingNumber = () => {
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `TWL-${randomDigits}`;
};

// POST create new order
router.post('/', async (req, res) => {
  try {
    await connectDB();
    const { customer, items, totalAmount, currency, paymentMethod } = req.body;

    if (!customer || !customer.fullName || !customer.phone || !customer.address) {
      return res.status(400).json({ message: 'Customer details (name, phone, address) are required.' });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one watch.' });
    }

    const trackingNumber = generateTrackingNumber();

    const formattedItems = items.map(i => ({
      product: String(i.product || i._id || i.id || ''),
      title: String(i.title || 'Watch'),
      price: Number(i.price || 0),
      quantity: Number(i.quantity || 1),
      image: String(i.image || '')
    }));

    const orderData = {
      trackingNumber,
      customer: {
        fullName: String(customer.fullName),
        email: customer.email ? String(customer.email) : '',
        phone: String(customer.phone),
        city: String(customer.city),
        address: String(customer.address),
        notes: customer.notes ? String(customer.notes) : ''
      },
      items: formattedItems,
      totalAmount: Number(totalAmount || 0),
      currency: String(currency || 'USD'),
      paymentMethod: String(paymentMethod || 'COD'),
      status: 'Order Placed',
      createdAt: new Date()
    };

    let newOrder;
    if (mongoose.connection.readyState === 1) {
      try {
        const order = new Order(orderData);
        newOrder = await order.save();
        console.log(`✅ Order saved to MongoDB Atlas! Tracking: ${newOrder.trackingNumber}`);
      } catch (dbErr) {
        console.error('❌ DB Save Error:', dbErr.message);
      }
    } else {
      console.warn('⚠️ Mongoose not connected (readyState !== 1), using in-memory store.');
    }

    if (!newOrder) {
      newOrder = { ...orderData, _id: `mem_${Date.now()}` };
      inMemoryOrders.unshift(newOrder);
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      trackingNumber: newOrder.trackingNumber,
      order: newOrder
    });
  } catch (error) {
    console.error('Error creating order:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// GET track order by tracking number
router.get('/track/:trackingNumber', async (req, res) => {
  try {
    await connectDB();
    const { trackingNumber } = req.params;
    let order;

    if (mongoose.connection.readyState === 1) {
      try {
        order = await Order.findOne({ trackingNumber: trackingNumber.toUpperCase() });
      } catch (err) {}
    }

    if (!order) {
      order = inMemoryOrders.find(o => o.trackingNumber.toUpperCase() === trackingNumber.toUpperCase());
    }

    if (!order) {
      return res.status(404).json({ message: 'Order tracking ID not found. Please check your order code.' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all orders (Admin)
router.get('/', async (req, res) => {
  try {
    await connectDB();
    let orders = [];

    if (mongoose.connection.readyState === 1) {
      try {
        orders = await Order.find().sort({ createdAt: -1 });
      } catch (err) {}
    }

    if (!orders || orders.length === 0) {
      orders = inMemoryOrders;
    }

    res.json(orders);
  } catch (error) {
    res.json(inMemoryOrders);
  }
});

// PATCH update order status (Admin)
router.patch('/:id/status', async (req, res) => {
  try {
    await connectDB();
    const { status } = req.body;
    const { id } = req.params;

    let updatedOrder;
    if (mongoose.connection.readyState === 1) {
      try {
        updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
      } catch (err) {}
    }

    if (!updatedOrder) {
      const orderInMem = inMemoryOrders.find(o => o._id === id);
      if (orderInMem) {
        orderInMem.status = status;
        updatedOrder = orderInMem;
      }
    }

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
