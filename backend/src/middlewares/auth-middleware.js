// middlewares/auth-middleware.js
import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('authenticateToken: invalid token', err);
      return res.status(403).json({ error: "Invalid token" });
    }

    // Log decoded user for debugging (remove in production)
    //console.log('authenticateToken decoded user:', user);
   

    req.user = user; // contains user_id, username, role as in your token 
    //console.log(req.user)
    next();
  });
};
