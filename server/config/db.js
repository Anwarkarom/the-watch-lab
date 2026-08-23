import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/the_watch_lab';
    const conn = await mongoose.connect(mongoUri, {
      tls: true,
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`⚠️ MongoDB Atlas Connection Note: ${error.message}`);
    console.log(`ℹ️ Server operating with dynamic catalog fallback if Atlas is offline.`);
  }
};
