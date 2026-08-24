import mongoose from 'mongoose';

// Disable command buffering so requests fail fast & fallback instantly if DB is not connected
mongoose.set('bufferCommands', false);

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/the_watch_lab';
    await mongoose.connect(mongoUri, {
      tls: true,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });
    console.log('✅ MongoDB Connected successfully!');
  } catch (error) {
    console.warn(`⚠️ MongoDB Atlas Connection Note: ${error.message}`);
    console.log(`ℹ️ API operating with dynamic fallback catalog.`);
  }
};
