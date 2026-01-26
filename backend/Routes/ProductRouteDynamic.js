//routes/ProductRouteDynamic.js
import express  from 'express';
import ProductModel from '../Models/Product.js';
import Counter from '../Models/Counter.js'; //
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import ensureAuthenticated from '../Middleware/AuthProduct.js';



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
let mainImage = null;
let galleryImages = [];

if (req.files) {
  if (req.files["image"] && req.files["image"].length > 0) {
    mainImage = `/uploads/${req.files["image"][0].filename}`; // Save full path
  }
  if (req.files["gallery"] && req.files["gallery"].length > 0) {
    galleryImages = req.files["gallery"].map((file) => `/uploads/${file.filename}`); // Save full path
  }
}

    // ✅ Generate auto-increment productId
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

// Get single product by ID
router.get('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    let product;

    // Try to find by MongoDB _id first
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await ProductModel.findById(id);
    }

    // If not found, try by productId (numeric)
    if (!product && !isNaN(id)) {
      product = await ProductModel.findOne({ productId: Number(id) });
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update product by ID
router.put('/:id', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'gallery', maxCount: 5 },
]), async (req, res) => {
  try {
    const { title, description, price, category, discount, existingGallery } = req.body;
    const updateData = { 
      title, 
      description, 
      price,
      category,
      discount: parseFloat(discount) || 0
    };

    // Handle image update if provided
    if (req.files) {
      if (req.files['image'] && req.files['image'].length > 0) {
        // Remove old image if it exists
        const existingProduct = await ProductModel.findById(req.params.id);
        if (existingProduct && existingProduct.image) {
          const oldImagePath = path.join(process.cwd(), existingProduct.image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        updateData.image = `/uploads/${req.files['image'][0].filename}`;
      }
      
      if (req.files['gallery'] && req.files['gallery'].length > 0) {
        const newGalleryImages = req.files['gallery'].map(file => `/uploads/${file.filename}`);
        // Combine existing gallery with new images
        const existing = existingGallery ? JSON.parse(existingGallery) : [];
        updateData.gallery = [...existing, ...newGalleryImages];
      } else if (existingGallery) {
        // No new files, just update with existing
        updateData.gallery = JSON.parse(existingGallery);
      }
    }

    const updatedProduct = await ProductModel.findOneAndUpdate(
      { 
        $or: [
          ...(mongoose.Types.ObjectId.isValid(req.params.id) ? [{ _id: req.params.id }] : []),
          ...(!isNaN(req.params.id) ? [{ productId: Number(req.params.id) }] : [])
        ]
      },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({ 
      message: 'Failed to update product',
      error: error.message 
    });
  }
});

// Delete product by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let product;
    
    // Try to match by productId first (numeric ID)
    if (!isNaN(id)) {
      product = await ProductModel.findOneAndDelete({ productId: Number(id) });
    }
    
    // If not found by productId, try by MongoDB _id
    if (!product) {
      product = await ProductModel.findByIdAndDelete(id);
    }
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Delete associated images if they exist
    if (product.image) {
      const imagePath = path.join(process.cwd(), product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Delete gallery images if they exist
    if (product.gallery && product.gallery.length > 0) {
      product.gallery.forEach(image => {
        const galleryPath = path.join(process.cwd(), image);
        if (fs.existsSync(galleryPath)) {
          fs.unlinkSync(galleryPath);
        }
      });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
});

// Bulk delete products
router.delete('/', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Array of product IDs is required' });
    }

    const result = await ProductModel.deleteMany({ _id: { $in: ids } });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No products found to delete' });
    }

    res.json({ 
      message: `${result.deletedCount} product(s) deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;