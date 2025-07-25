//Models/Product.js 
import mongoose from "mongoose";

const { Schema } = mongoose;

const ProductSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: String, // ✅ Consider using Number if doing math
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String, // ✅ URLs should be strings, not "url"
  },
  gallery: {
    type: [String], // ✅ Array of image URLs
    default: [],
  }
}, { timestamps: true });

// ✅ Correct name and export
const ProductModel = mongoose.model("product_item", ProductSchema, "product_items");
export default ProductModel;
