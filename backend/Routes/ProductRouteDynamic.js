//routes/Dynamic product.js
import express  from 'express';
import ProductModel from '../Models/Product.js';


const router =express.Router();

// POST /api/product — Create a new product
router.post('/', async (req, res) => {
  try {
    const {  title, description, price, category, image, gallery } = req.body;

    const newProduct = new ProductModel({
      title,
      description,
      price,
      category,
      image,
      gallery, // should be an array of image URLs
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