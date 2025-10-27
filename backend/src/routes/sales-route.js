import pool from '../config/pool.js';
import { Router } from 'express';
import { GetAllTotalSales } from '../controllers/sales-controller.js';


const router = Router();

// Middleware to ensure user has business access
const requireBusinessAccess = (req, res, next) => {
  if (!req.user || !req.user.business_id) {
    return res.status(403).json({ message: 'Forbidden: No business access' });
  }
  next();
};

// Get total sales for the user's business only
router.get('/total_amount', requireBusinessAccess, GetAllTotalSales);

export default router;
