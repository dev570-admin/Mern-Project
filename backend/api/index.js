import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

// Import your routers
import AuthRouter from "../Routes/AuthRouter.js";
import ProductRouter from "../Routes/ProductRouter.js";
import ProductRouteDynamic from "../Routes/ProductRouteDynamic.js";
import GetAllProducts from "../Routes/GetAllProducts.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "https://productstack.vercel.app", process.env.FRONTEND_URL],
    credentials: true
}));

// Database Connection Logic for Serverless
const connectDB = async () => {
    // Check if we already have a connection to the database
    if (mongoose.connections[0].readyState) {
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB connected");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err.message);
        // In serverless, we don't want to throw the error immediately 
        // to avoid crashing the entire function instance prematurely
    }
};

// Middleware to ensure DB is connected before processing requests
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// Routes
app.get("/", (req, res) => {
    res.json({ message: "API running on Vercel ✅" });
});

app.use("/api/auth", AuthRouter);
app.use("/api/products", ProductRouter);
app.use("/api/addproduct", ProductRouteDynamic);
app.use("/api/getallproducts", GetAllProducts);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("❌ Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
});

export default app;
