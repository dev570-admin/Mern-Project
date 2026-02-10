import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import connection from "./Models/db.js";

import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

import AuthRouter from './Routes/AuthRouter.js';
import ProductRouter from './Routes/ProductRouter.js';
import ProductRouteDynamic from './Routes/ProductRouteDynamic.js'
import GetAllProducts from './Routes/GetAllProducts.js';
import multer from 'multer';

import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.get('/', (req, res) => {
  res.send('API is running');
});

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}));


// serve uploads folder as static
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
// Routing
app.use('/api/auth', AuthRouter);
app.use('/api/products', ProductRouter);//// api for Getting (Static)  product Dynamically
app.use('/api/addproduct', ProductRouteDynamic);// api for Adding  new product Dynamically
app.use('/api/getallproducts', GetAllProducts);//api for Getting  app.use('/api/getallproducts', GetAllProducts);//api for Getting  allproduct Dynamicallyproduct Dynamically

connection();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
