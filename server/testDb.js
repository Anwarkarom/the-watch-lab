import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('Testing connection to:', process.env.MONGODB_URI);

try {
  const conn = await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000
  });
  console.log('✅ SUCCESS! Connected to:', conn.connection.host);
  process.exit(0);
} catch (err) {
  console.error('❌ Connection error:', err.name, err.message);
  process.exit(1);
}
