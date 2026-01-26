//Models/Product.js 
import mongoose from "mongoose";
import Counter from "./Counter.js"; // Import Counter model

const { Schema } = mongoose;

const ProductSchema = new Schema({
   productId: {
    type: Number,
    unique: true,
  },
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
  },
  discount: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

// ✅ Correct name and export
const ProductModel = mongoose.model("product_item", ProductSchema, "product_items");
export default ProductModel;

// Function to create a new product
export const createProduct = async (productData) => {
  const { title, description, price, category, mainImage, galleryImages } = productData;

  // Use Counter to get the next productId
  const counter = await Counter.findOneAndUpdate(
    { name: "productId" },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );

  const newProduct = new ProductModel({
    productId: counter.value, // <-- assign auto-incremented value
    title,
    description,
    price,
    category,
    image: mainImage,
    gallery: galleryImages,
  });

  return await newProduct.save();
};
