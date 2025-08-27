import express from 'express';
import dotenv from 'dotenv';
import connection from "./Models/db.js";

import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

import AuthRouter from './Routes/AuthRouter.js';
import ProductRouter from './Routes/ProductRouter.js';
import ProductRouteDynamic from './Routes/ProductRouteDynamic.js'

import UserModel from './Models/User.js';
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.get('/', (req, res) => {
  res.send('API is running');
});

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Serve static files (so uploaded images are accessible via URL)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routing
app.use('/api/auth', AuthRouter);
app.use('/api/product', ProductRouter);//// api for Getting (Static)  product Dynamically
app.use('/api/addproduct', ProductRouteDynamic);// api for Adding  new product Dynamically

connection();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
