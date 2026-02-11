import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

// Import Routes
import AuthRouter from '../Routes/AuthRouter.js';
import ProductRouter from '../Routes/ProductRouter.js';
import ProductRouteDynamic from '../Routes/ProductRouteDynamic.js';
import GetAllProducts from '../Routes/GetAllProducts.js';

// Import Database Connection
import connection from '../Models/db.js';

// Create Express app
const app = express();

// ============ MIDDLEWARE ============

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// ============ CORS CONFIGURATION ============
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://productstack.vercel.app',
  process.env.FRONTEND_URL || 'https://productstack.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️  CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ============ INITIALIZE DATABASE ============
console.log('🚀 Initializing API...');

// Initialize DB connection on startup
const initializeDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('❌ MONGO_URI is not set in environment variables');
    }
    await connection();
    console.log('✅ Database initialized');
  } catch (error) {
    console.error('⚠️  Database initialization error:', error.message);
    // Continue running even if DB fails initially
  }
};

initializeDB();

// ============ HEALTH CHECK ENDPOINTS ============

app.get('/', (req, res) => {
  res.status(200).json({
    message: '✅ API is running on Vercel',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  const mongoStatus = mongoose.connection.readyState;
  const isConnected = mongoStatus === 1; // Connected state
  
  res.status(200).json({
    status: isConnected ? 'healthy' : 'degraded',
    mongoConnected: isConnected,
    mongoState: mongoStatus,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test', (req, res) => {
  const mongoStatus = mongoose.connection.readyState;
  
  res.status(200).json({
    message: '✅ Test endpoint working',
    mongoConnected: mongoStatus === 1,
    mongoState: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoStatus],
    environment: {
      nodeEnv: process.env.NODE_ENV,
      frontendUrl: process.env.FRONTEND_URL
    },
    timestamp: new Date().toISOString()
  });
});

// ============ API ROUTES ============

app.use('/api/auth', AuthRouter);
app.use('/api/products', ProductRouter);
app.use('/api/addproduct', ProductRouteDynamic);
app.use('/api/getallproducts', GetAllProducts);

// ============ ERROR HANDLING ============

// 404 Not Found
app.use((req, res) => {
  console.warn(`⚠️  404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', {
    message: err.message,
    path: req.path,
    method: req.method,
    stack: err.stack
  });

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'production' ? {} : { stack: err.stack }
  });
});

// ============ EXPORT FOR VERCEL ============
export default app;
