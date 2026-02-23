import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

/* ================= ENV ================= */
dotenv.config();

/* ================= APP ================= */
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

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
}

/* ================= DB MIDDLEWARE ================= */
async function withDB(req, res, next) {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
}

/* ================= ROUTES ================= */
import AuthRouter from "../routes/AuthRouter.js";
import ProductRouter from "../routes/ProductRouter.js";
import ProductRouteDynamic from "../routes/ProductRouteDynamic.js";
import GetAllProducts from "../routes/GetAllProducts.js";

app.get("/", withDB, (req, res) => {
  res.json({ message: "API running ✅" });
});

app.use("/api/auth", withDB, AuthRouter);
app.use("/api/products", withDB, ProductRouter);
app.use("/api/addproduct", withDB, ProductRouteDynamic);
app.use("/api/getallproducts", withDB, GetAllProducts);

/* ================= ERRORS ================= */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
