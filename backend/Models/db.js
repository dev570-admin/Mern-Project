import mongoose from "mongoose";

let isConnected = false;

const connection = async () => {
  // ✅ Reuse connection if already connected
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("❌ MONGO_URI not defined");
  }

  try {
    console.log("🔄 Connecting to MongoDB...");

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    throw error; // ✅ IMPORTANT
  }
};

export default connection;
