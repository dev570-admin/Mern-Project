// Middleware/AuthProduct.js
import jwt from 'jsonwebtoken';

const ensureAuthenticated = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // support Bearer token

  if (!token) {
    return res.status(403).json({ message: 'Unauthorized, JWT token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user to req
    next(); // Proceed to the next middleware/route
  } catch (err) {
    return res.status(403).json({ message: 'Unauthorized, invalid token' });
  }
};

export default ensureAuthenticated;
