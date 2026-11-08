
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing from backend .env');
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
    });

    console.log('MongoDB Connected Successfully');

    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB Connection Failed:', error.message);
    throw error;
  }
};

export default connectDB;
