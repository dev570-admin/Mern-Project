import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import connection from "./Models/db.js";

import AuthRouter from "./Routes/AuthRouter.js";
import ProductRouter from "./Routes/ProductRouter.js";
import ProductRouteDynamic from "./Routes/ProductRouteDynamic.js";
import GetAllProducts from "./Routes/GetAllProducts.js";

dotenv.config();

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
      process.env.FRONTEND_URL, // Vercel frontend
    ],
    credentials: true,
  })
);

/* ================= DB ================= */
connection();

/* ================= ROUTES ================= */
app.get("/", (req, res) => {
  res.json({ message: "API running ✅" });
});

app.use("/api/auth", AuthRouter);
app.use("/api/products", ProductRouter);
app.use("/api/addproduct", ProductRouteDynamic);
app.use("/api/getallproducts", GetAllProducts);

/* ================= ERROR HANDLING ================= */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
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
