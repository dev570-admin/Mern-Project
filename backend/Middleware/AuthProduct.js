import jwt from 'jsonwebtoken';

const ensureAuthenticated = (req, res, next) => {
  const token = req.cookies.token; // ✅ get token from cookie

  if (!token) {
    return res.status(403).json({ message: 'Unauthorized, JWT token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Unauthorized, invalid token' });
  }
};

export default ensureAuthenticated;
