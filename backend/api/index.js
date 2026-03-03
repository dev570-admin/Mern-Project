// backend/api/index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

// Routes
import AuthRouter from "../Routes/AuthRouter.js";
import ProductRouter from "../Routes/ProductRouter.js";
import ProductRouteDynamic from "../Routes/ProductRouteDynamic.js";
import GetAllProducts from "../Routes/GetAllProducts.js";

dotenv.config();

const app = express();

/* -------------------- Middleware -------------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://productstack.vercel.app",
      process.env.FRONTEND_URL
    ],
    credentials: true
  })
);

/* -------------------- MongoDB (SERVERLESS SAFE) -------------------- */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!process.env.MONGODB_URI) {
    console.error("❌ MONGODB_URI missing");
    return null;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI)
      .then((mongoose) => {
        console.log("✅ MongoDB connected");
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ MongoDB error:", err.message);
        cached.promise = null;
        return null; // ❗ DO NOT throw on Vercel
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

// Ensure DB connection before every request
app.use(async (req, res, next) => {
  const conn = await connectDB();
  if (!conn) {
    return res.status(500).json({ message: "Database unavailable" });
  }
  next();
});

/* -------------------- Routes -------------------- */
app.get("/", (req, res) => {
  res.json({ message: "API running on Vercel ✅" });
});

app.use("/api/auth", AuthRouter);
app.use("/api/products", ProductRouter);
app.use("/api/addproduct", ProductRouteDynamic);
app.use("/api/getallproducts", GetAllProducts);

/* -------------------- Error Handling -------------------- */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

/* -------------------- VERCEL EXPORT (CRITICAL) -------------------- */
export default function handler(req, res) {
  return app(req, res);
}
