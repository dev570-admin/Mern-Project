//routes/ProductRouteDynamic.js
import express  from 'express';
import ProductModel from '../Models/Product.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';


const router =express.Router();
// ===================
// Uploads Directory
// ===================
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}


// ===================
// Multer Storage Config
// ===================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// POST /api/product — Create a new product
router.post('/',  upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'gallery', maxCount: 5 },
]), async (req, res) => {
  try {
    const {  title, description, price, category, image, gallery } = req.body;
    // handle main image 
    const mainImage = req.files["image"]
        ? `/uploads/${req.files["image"][0].filename}`
        : null;

        // Handle gallery images
      const galleryImages = req.files["gallery"]
        ? req.files["gallery"].map((file) => `/uploads/${file.filename}`)
        : [];

     const newProduct = new ProductModel({
        title,
        description,
        price,
        category,
        image: mainImage,
        gallery: galleryImages,
      });

 const savedProduct = await newProduct.save();
      res.status(201).json(savedProduct);

    console.log('Product deatil >>> ' ,savedProduct );
  } catch (err) {
    console.error('❌ Error creating product:', err.message);
    res.status(500).json({ error: 'Failed to create product', message: err.message });
  }
}); 

export default router;