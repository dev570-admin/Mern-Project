import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "https://productstack.vercel.app", process.env.FRONTEND_URL],
    credentials: true
}));

let isConnected = false;

async function connectDB() {
    if (isConnected) return;
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        isConnected = true;
        console.log("✅ MongoDB connected");
    } catch (err) {
        console.error("❌ MongoDB error:", err.message);
        throw err;
    }
}

async function withDB(req, res, next) {
    try {
        await connectDB();
        next();
    } catch (err) {
        res.status(500).json({ message: "Database connection failed" });
    }
}

import AuthRouter from "../Routes/AuthRouter.js";
import ProductRouter from "../Routes/ProductRouter.js";
import ProductRouteDynamic from "../Routes/ProductRouteDynamic.js";
import GetAllProducts from "../Routes/GetAllProducts.js";

app.get("/", withDB, (req, res) => {
    res.json({ message: "API running ✅" });
});

app.use("/api/auth", withDB, AuthRouter);
app.use("/api/products", withDB, ProductRouter);
app.use("/api/addproduct", withDB, ProductRouteDynamic);
app.use("/api/getallproducts", withDB, GetAllProducts);

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
    console.error("❌ Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
});

export default app;