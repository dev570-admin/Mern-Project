import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import connection from "./Models/db.js";

import AuthRouter from "./Routes/AuthRouter.js";
import ProductRouter from "./Routes/ProductRouter.js";
import ProductRouteDynamic from "./Routes/ProductRouteDynamic.js";
import GetAllProducts from "./Routes/GetAllProducts.js";

dotenv.config();

const app = express();

/* ---------- Middleware ---------- */
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://productstack.vercel.app",
        process.env.FRONTEND_URL || "https://productstack.vercel.app",  // Vercel frontend URL from env
      ];
      
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`⚠️ CORS blocked origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
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

app.get("/api/health", (req, res) => {
  res.json({ 
    message: "✅ API is healthy",
    mongoConnected: true,
    nodeEnv: process.env.NODE_ENV
  });
}); 


app.use("/api/auth", AuthRouter);
app.use("/api/products", ProductRouter);
app.use("/api/addproduct", ProductRouteDynamic);
app.use("/api/getallproducts", GetAllProducts);

/* ---------- Error Handling ---------- */
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    success: false
  });
});

app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    success: false
  });
});

/* ❌ DO NOT use app.listen() */
export default app;

/* ---------- Local Development Server ---------- */
// Only start server if running locally (not in Vercel)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  
  connection().then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  }).catch(err => {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  });
}

