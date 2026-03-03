// routes/ProductRouteDynamic.js
import express from "express";
import mongoose from "mongoose";
import ProductModel from "../model/Product.js";
import Counter from "../model/Counter.js";
import ensureAuthenticated from "../Middleware/AuthProduct.js";

const router = express.Router();

/* ---------------- CREATE PRODUCT ---------------- */
router.post("/", async (req, res) => {
  try {
    const { title, description, price, category, image, gallery } = req.body;

    const counter = await Counter.findOneAndUpdate(
      { name: "productId" },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );

    const newProduct = new ProductModel({
      productId: counter.value,
      title,
      description,
      price,
      category,
      image,        // URL string
      gallery       // array of URLs
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error("❌ Create product error:", err);
    res.status(500).json({ message: err.message });
  }
});

/* ---------------- GET PRODUCT ---------------- */
router.get("/:id", ensureAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    let product = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await ProductModel.findById(id);
    }

    if (!product && !isNaN(id)) {
      product = await ProductModel.findOne({ productId: Number(id) });
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------------- UPDATE PRODUCT ---------------- */
router.put("/:id", async (req, res) => {
  try {
    const updated = await ProductModel.findOneAndUpdate(
      {
        $or: [
          ...(mongoose.Types.ObjectId.isValid(req.params.id)
            ? [{ _id: req.params.id }]
            : []),
          ...(!isNaN(req.params.id)
            ? [{ productId: Number(req.params.id) }]
            : [])
        ]
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* ---------------- DELETE PRODUCT ---------------- */
router.delete("/:id", async (req, res) => {
  try {
    let product = null;

    if (!isNaN(req.params.id)) {
      product = await ProductModel.findOneAndDelete({
        productId: Number(req.params.id)
      });
    }

    if (!product) {
      product = await ProductModel.findByIdAndDelete(req.params.id);
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
