import express from 'express';
import dotenv from 'dotenv';
import connection from "./Models/db.js";

import bodyParser from 'body-parser';
import cors from 'cors';  // cors enables cross-origin requests (e.g., frontend to backend calls).
import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';
import AuthRouter from './Routes/AuthRouter.js';

//import ProductRouter from './Routes/ProductRouter'; // adjust path and filename
import AuthValidation from './Middleware/AuthValidation.js';
//import ensureAuthenticated from "../Middleware/AuthProduct.js";

import UserModel from './Models/User.js';

import cookieParser from "cookie-parser";

dotenv.config(); // Load environment variables

const app = express();
app.get('/', (req, res) => {
  res.send('API is running');
});

//Backend code for backend to front end 


app.use(express.json()); // To parse JSON bodies
//app.use(cors());// front end to backend connection
app.use(cookieParser());// Read cookies from requests

// ✅ CORS setup (MUST come before routes)
app.use(cors({
  origin: "http://localhost:5173",  // Replace with your frontend origin
  credentials: true
}));

// configure Routing 
app.use('/api/auth',AuthRouter);
//app.use('/api/product', ProductRouter);

// MongoDB connection
connection(); 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
