// backend/model/Product.js
import mongoose from "mongoose";
import Counter from "./Counter.js";

const { Schema } = mongoose;

const ProductSchema = new Schema(
  {
    productId: {
      type: Number,
      unique: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true,
      unique: true
    },
    price: {
      type: Number, // ✅ FIXED
      required: true
    },
    category: {
      type: String,
      required: true
    },
    image: {
      type: String
    },
    gallery: {
      type: [String],
      default: []
    },
    discount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// ✅ SERVERLESS-SAFE model export
const ProductModel =
  mongoose.models.product_item ||
  mongoose.model("product_item", ProductSchema, "product_items");

export default ProductModel;

/* -------------------- Create Product -------------------- */
export const createProduct = async (productData) => {
  const {
    title,
    description,
    price,
    category,
    mainImage,
    galleryImages
  } = productData;

  // ✅ SAFE Counter increment
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
    image: mainImage,
    gallery: galleryImages
  });

  return await newProduct.save();
};
