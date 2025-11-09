import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.warn("❌ No token provided");
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.warn("❌ Invalid token:", err.message);
      return res.status(403).json({ error: 'Invalid token' });
    }

    
    req.user = user;
    next();
  });
};
