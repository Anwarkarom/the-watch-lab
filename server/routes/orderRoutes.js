import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// In-memory fallback orders storage if MongoDB is disconnected
const inMemoryOrders = [];

// Helper to generate unique tracking number
const generateTrackingNumber = () => {
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `TWL-${randomDigits}`;
};

// POST create new order
router.post('/', async (req, res) => {
  try {
    const { customer, items, totalAmount, currency, paymentMethod } = req.body;

    if (!customer || !customer.fullName || !customer.phone || !customer.address) {
      return res.status(400).json({ message: 'Customer details (name, phone, address) are required.' });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one watch.' });
    }

    const trackingNumber = generateTrackingNumber();

    const orderData = {
      trackingNumber,
      customer,
      items,
      totalAmount,
      currency: currency || 'USD',
      paymentMethod: paymentMethod || 'COD',
      status: 'Order Placed',
      createdAt: new Date()
    };

    let newOrder;
    try {
      const order = new Order(orderData);
      newOrder = await order.save();
    } catch (dbErr) {
      console.log('Saved order to in-memory store (DB fallback)');
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
    res.status(500).json({ message: error.message });
  }
});

// GET track order by tracking number
router.get('/track/:trackingNumber', async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    let order;

    try {
      order = await Order.findOne({ trackingNumber: trackingNumber.toUpperCase() });
    } catch (err) {}

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
    let orders = [];
    try {
      orders = await Order.find().sort({ createdAt: -1 });
    } catch (err) {}

    if (!orders || orders.length === 0) {
      orders = inMemoryOrders;
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH update order status (Admin)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    let updatedOrder;
    try {
      updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
    } catch (err) {}

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
