import UserModel from "../Models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// SignUp Logic
export const SignUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("📨 Signup request:", req.body);

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "❌ User already exists",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({ name, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET
    );

    res.status(201).json({
      message: "✅ User registered",
      success: true,
      token,
    });

  } catch (err) {
    console.error("❌ Signup Error:", err);
    res.status(500).json({ message: "❌ Internal server error", success: false });
  }
};


//Login logic
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "❌ User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "❌ Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET
    );

       // 🍪 Set cookie
    res.cookie("token", token, {
      httpOnly: true,           // prevents JS access
      secure: process.env.NODE_ENV === "production", // true on https
      sameSite: "strict",       // protects against CSRF
      maxAge: 365 * 24 * 60 * 60 * 1000,   // 1 year
    });
   
    res.status(200).json({
      message: "✅ Login successful",
      token,
     name: user.name,
      email: user.email,
    });

  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: "❌ Server error" });
  }
};

//Log-out

export const Logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  return res.status(200).json({
    message: "✅ Logged out successfully",
    success: true,
  });
};
export  default{ SignUp, Login };
