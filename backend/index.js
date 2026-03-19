import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

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

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://productstack.vercel.app", // ✅ No trailing slash
  process.env.FRONTEND_URL,
].filter(Boolean); // removes undefined if FRONTEND_URL isn't set

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);

/* ================= DB ================= */
// Awaited inside an async wrapper so routes aren't registered before DB is ready
(async () => {
  await connection();
})();

/* ================= ROUTES ================= */
app.get("/", (req, res) => {
  res.json({ message: "API running ✅" });
});

app.use("/api/auth", AuthRouter);
app.use("/api/products", ProductRouter);
app.use("/api/addproduct", ProductRouteDynamic);
app.use("/api/getallproducts", GetAllProducts);

/*
 * ================= STATIC UPLOADS =================
 * ❌ express.static('/uploads') does NOT work on Vercel —
 *    the filesystem is ephemeral and wiped on every redeploy.
 *
 * ✅ Use a cloud storage provider instead:
 *    - Cloudinary  → https://cloudinary.com
 *    - AWS S3      → https://aws.amazon.com/s3
 *    - Supabase    → https://supabase.com/storage
 *
 * After uploading a file, store the returned public URL in MongoDB
 * and serve it directly from the CDN — no Express static route needed.
 */

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
