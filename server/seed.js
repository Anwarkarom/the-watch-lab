import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import { initialProducts } from './data/initialProducts.js';

dotenv.config();

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI not found in .env');
      process.exit(1);
    }

    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, {
      tls: true,
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000
    });
    console.log('✅ Connected to MongoDB Atlas for seeding!');

    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products.');

    const formattedProducts = initialProducts.map(({ _id, ...rest }) => rest);
    await Product.insertMany(formattedProducts);
    console.log('✨ Successfully seeded initial watches catalog into MongoDB Atlas!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDB();
