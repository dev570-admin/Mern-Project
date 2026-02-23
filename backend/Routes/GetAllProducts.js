// Routes/GetAllProducts.js
import { Router } from "express";
import ensureAuthenticated from "../Middleware/AuthProduct.js";
import ProductModel from "../Models/Product.js";
import AuthRouter from "./AuthRouter.js";

const router = Router();

// GET /api/products - Fetch all products
router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.status(200).json(products);
  } catch (err) {
    console.error("❌ Error fetching products:", err.message);
    res.status(500).json({ error: "Failed to fetch products", message: err.message });
  }
});

export default router;

