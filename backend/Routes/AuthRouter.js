import { Router } from "express";
import { SignUp, Login, Logout } from "../Controllers/authcontroller.js";
import {
  SignUpValidation,
  LoginValidation,
} from "../Middleware/AuthValidation.js";

const router = Router();

// POST /api/auth/login
router.post("/login", LoginValidation, Login);

// POST /api/auth/signup
router.post("/signup", SignUpValidation, SignUp);

// GET /api/auth/logout
router.get("/logout", Logout);

export default router;
