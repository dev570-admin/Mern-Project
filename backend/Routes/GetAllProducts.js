import { Router } from "express";
import ensureAuthenticated from "../Middleware/AuthProduct.js";
import ProductModel from "../Models/Product.js";

const router = Router();

// GET /api/getallproducts
router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.status(200).json(products);
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({
      message: "Failed to fetch products",
      error: err.message
    });
  }
});

export default router;
