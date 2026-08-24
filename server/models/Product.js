import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  supplierPrice: { type: Number, default: 45 },
  supplierUrl: { type: String, default: "https://www.aliexpress.com" },
  affiliateUrl: { type: String },
  category: { 
    type: String, 
    required: true,
    enum: ['Chronograph', 'Automatic', 'Minimalist', 'Diver/Sport', 'Smart Hybrid']
  },
  gender: { type: String, enum: ['Men', 'Women', 'Unisex'], default: 'Unisex' },
  image: { type: String, required: true },
  images: [{ type: String }],
  specs: {
    movement: { type: String, default: 'Japanese Quartz / Automatic' },
    caseDiameter: { type: String, default: '41mm' },
    waterResistance: { type: String, default: '5 ATM / 50m' },
    strapMaterial: { type: String, default: '316L Stainless Steel / Genuine Leather' },
    glass: { type: String, default: 'Sapphire Crystal' }
  },
  stock: { type: Number, default: 15 },
  rating: { type: Number, default: 4.8 },
  reviewsCount: { type: Number, default: 24 },
  isFeatured: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  discountBadge: { type: String },
  tags: [{ type: String }]
}, {
  timestamps: true
});

export default mongoose.model('Product', productSchema);
