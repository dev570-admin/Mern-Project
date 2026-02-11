import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

let cachedConnection = null;

const connection = async () => {
  // Reuse existing connection in serverless environment
  if (cachedConnection) {
    console.log('✅ Using cached MongoDB connection');
    return cachedConnection;
  }

  try {
    console.log('🔄 Establishing MongoDB connection...');
    
    // Check if MONGO_URI exists
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not set');
    }
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    cachedConnection = conn;
    return conn;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    // Re-throw for better debugging
    throw error;
  }
};

export default connection;
