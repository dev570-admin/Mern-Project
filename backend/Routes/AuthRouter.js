   // Routes/Authrouter.js
import { Router } from "express";
import { SignUp,Login ,Logout} from '../Controllers/authcontroller.js';
import { SignUpValidation, LoginValidation } from '../Middleware/AuthValidation.js';



const router = Router();

// POST /api/auth/login
router.post('/login', LoginValidation, Login);

// POST /api/auth/signup
router.post('/signup', SignUpValidation, SignUp);//http://localhost:5000/api/auth/signup
// Get Api
router.get("/logout", Logout) //http://localhost:5000/api/auth/logout
// add product api


export default router;
