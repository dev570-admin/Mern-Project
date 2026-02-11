import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

// Routes
import AuthRouter from '../backend/Routes/AuthRouter.js';
import ProductRouter from '../backend/Routes/ProductRouter.js';
import ProductRouteDynamic from '../backend/Routes/ProductRouteDynamic.js';
import GetAllProducts from '../backend/Routes/GetAllProducts.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// CORS configuration for Vercel
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://productstack.vercel.app',
  process.env.FRONTEND_URL || 'http://localhost:5173'
];

console.log('🚀 API Starting...')
console.log('Allowed Origins:', allowedOrigins);
console.log('Node Env:', process.env.NODE_ENV);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API is running on Vercel', status: 'ok' });
});

// Health check for Vercel
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', mongoConnected: mongoose.connection.readyState === 1 });
});

// Test route
app.get('/api/test', (req, res) => {
  res.status(200).json({ 
    message: 'Test endpoint working',
    mongoConnected: mongoose.connection.readyState === 1,
    env: {
      nodeEnv: process.env.NODE_ENV,
      frontendUrl: process.env.FRONTEND_URL
    }
  });
});

// API Routes
app.use('/api/auth', AuthRouter);
app.use('/api/products', ProductRouter);
app.use('/api/addproduct', ProductRouteDynamic);
app.use('/api/getallproducts', GetAllProducts);

// Serve uploads folder as static
app.use('/uploads', express.static(path.join(process.cwd(), 'backend', 'uploads')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    success: false
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    success: false
  });
});

// Export for Vercel serverless
export default app;

// Also export as handler for compatibility
export const handler = (req, res) => {
  return app(req, res);
};
