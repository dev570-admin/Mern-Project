//routes/ProductRouteDynamic.js
import express from 'express';
import ProductModel from '../Models/Product.js';
import Counter from '../Models/Counter.js';
import multer from 'multer';
import mongoose from 'mongoose';
import ensureAuthenticated from '../Middleware/AuthProduct.js';

const router = express.Router();

// ✅ VERCEL COMPATIBLE: Use memory storage instead of disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// Helper function to convert buffer to base64
const bufferToBase64 = (buffer) => {
  return 'data:image/jpeg;base64,' + buffer.toString('base64');
};

// POST /api/product — Create a new product
router.post('/', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'gallery', maxCount: 5 },
]), async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    
    // Handle main image (convert to base64)
    let mainImage = null;
    let galleryImages = [];

    if (req.files) {
      if (req.files['image'] && req.files['image'].length > 0) {
        // Store as base64 data URL
        mainImage = bufferToBase64(req.files['image'][0].buffer);
      }
      if (req.files['gallery'] && req.files['gallery'].length > 0) {
        // Store gallery images as base64
        galleryImages = req.files['gallery'].map((file) =>
          bufferToBase64(file.buffer)
        );
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
        // ✅ VERCEL SAFE: No need to delete files from disk
        // Base64 images are stored in MongoDB, files never touch disk
        if (existingProduct && existingProduct.image) {
          console.log('Image update: old image will be replaced in database');
        }
        updateData.image = bufferToBase64(req.files['image'][0].buffer);
      }
      
      if (req.files['gallery'] && req.files['gallery'].length > 0) {
        const newGalleryImages = req.files['gallery'].map(file => bufferToBase64(file.buffer));
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
    
    // ✅ VERCEL SAFE: No file system cleanup needed
    // Base64 images are stored in database, not on disk
    if (product.image) {
      console.log('Product deletion: image removed from database');
    }
    
    // Delete gallery images references (database cleanup only)
    if (product.gallery && product.gallery.length > 0) {
      console.log('Product deletion: gallery images removed from database');
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