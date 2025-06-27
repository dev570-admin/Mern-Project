   // Routes/Authrouter.js
import { Router } from "express";
import ensureAuthenticated from "../Middleware/AuthProduct";

//import { SignUpValidation, LoginValidation } from '../Middleware/AuthValidation.js';
const router = Router();

// GET /api/auth/signup
router.get('/', ensureAuthenticated,(req,res)=>{
 res.status(200).json([

    {
        title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
    price: 109.95,
    description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
    category: "men's clothing"
    },
    {
    title: " Del Laptop Model no Del-0785",
    price: 30556.95,
    description: "Your perfect pack for everyday use . Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
    category: "Electronics"
    },
    
 ])
});

