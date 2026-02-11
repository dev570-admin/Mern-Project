import mongoose from "mongoose";

let isConnected = false;

const connection = async () => {
  if (isConnected) {
    return;
  }

  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI not defined");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
  }
};

export default connection;
