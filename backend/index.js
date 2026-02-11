import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import connection from "../Models/db.js";

import AuthRouter from "../Routes/AuthRouter.js";
import ProductRouter from "../Routes/ProductRouter.js";
import ProductRouteDynamic from "../Routes/ProductRouteDynamic.js";
import GetAllProducts from "../Routes/GetAllProducts.js";

dotenv.config();

const app = express();

/* ---------- Middleware ---------- */
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      process.env.https://productstack.vercel.app/, // ✅ Vercel frontend
    ],
    credentials: true,
  })
);

/* ---------- DB Connection (Safe for Serverless) ---------- */
connection();

/* ---------- Routes ---------- */
app.get("/", (req, res) => {
  res.json({ message: "API is running on Vercel 🚀" });
});

app.get("/api/cors-test", (req, res) => {
  res.json({ origin: req.headers.origin });
}); // temporary route to test CORS functionality 


app.use("/api/auth", AuthRouter);
app.use("/api/products", ProductRouter);
app.use("/api/addproduct", ProductRouteDynamic);
app.use("/api/getallproducts", GetAllProducts);

/* ❌ DO NOT use app.listen() */
export default app;
