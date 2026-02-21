import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

/* ================= ENV ================= */
dotenv.config();

/* ================= APP INIT ================= */
const app = express();

/* ================= MIDDLEWARE ================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://productstack.vercel.app",
      process.env.FRONTEND_URL,
    ],
    credentials: true,
  })
);

/* ================= DB (SERVERLESS SAFE) ================= */
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  }
};

/* ================= DB MIDDLEWARE ================= */
const withDB = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
};

/* ================= ROUTES ================= */
import AuthRouter from "./Routes/AuthRouter.js";
import ProductRouter from "./Routes/ProductRouter.js";
import ProductRouteDynamic from "./Routes/ProductRouteDynamic.js";
import GetAllProducts from "./Routes/GetAllProducts.js";

app.get("/", withDB, (req, res) => {
  res.json({ message: "API running ✅" });
});

app.use("/api/auth", withDB, AuthRouter);
app.use("/api/products", withDB, ProductRouter);
app.use("/api/addproduct", withDB, ProductRouteDynamic);
app.use("/api/getallproducts", withDB, GetAllProducts);

/* ================= ERROR HANDLING ================= */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

/* ================= LOCAL SERVER ================= */
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`🚀 Server running locally on port ${PORT}`)
  );
}

/* ================= EXPORT FOR VERCEL ================= */
export default app;
