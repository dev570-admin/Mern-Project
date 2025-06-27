// Middleware/verifyToken.js
export const verifyToken = (req, res, next) => {
  const token = req.cookies.token; // ✅ From cookie

  if (!token) {
    return res.status(401).json({ message: "❌ No token, access denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded data
    next();
  } catch (err) {
    return res.status(403).json({ message: "❌ Invalid token" });
  }
};
