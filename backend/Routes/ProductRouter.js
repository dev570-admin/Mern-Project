// Routes/ProductRoute.js
import { Router } from "express";
import ensureAuthenticated from "../Middleware/AuthProduct.js";

const router = Router();

router.get('/', ensureAuthenticated, (req, res) => {
  res.status(200).json([
    {
      id: 1,
      title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
      price: 109.95,
      discount:10, 
      description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve.",
      category: "men's clothing"
    },
    {
      id: 2,
      title: "Del Laptop Model no Del-0785",
      price: 30556.95,
       discount:30, 
      description: "Perfect pack for everyday use. Stash your laptop (up to 15 inches) in the padded sleeve.",
      category: "Electronics"
    },
     {
      id: 3,
      title: "Acer Laptop Model no Ac-0785",
      price: 30556.95,
       discount:10, 
      description: "Perfect pack for everyday use. Stash your laptop (up to 15 inches) in the padded sleeve.",
      category: "Electronics"
    }
  ]);
});

export default router;
