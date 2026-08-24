import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: String },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  image: { type: String }
});

const orderSchema = new mongoose.Schema({
  trackingNumber: { type: String, required: true, unique: true },
  customer: {
    fullName: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    notes: { type: String }
  },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  paymentMethod: { 
    type: String, 
    required: true,
    enum: ['COD', 'CREDIT_CARD', 'PAYPAL'],
    default: 'COD'
  },
  status: {
    type: String,
    enum: ['Order Placed', 'Processing', 'Shipped from Supplier', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Order Placed'
  },
  estimatedDeliveryDays: { type: String, default: '3-5 Business Days' }
}, {
  timestamps: true
});

export default mongoose.model('Order', orderSchema);
