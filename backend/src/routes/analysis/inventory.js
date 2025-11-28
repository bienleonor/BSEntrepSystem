import express from 'express';
import pool from '../../config/pool.js';
import { authenticateToken } from '../../middlewares/auth-middleware.js';

const router = express.Router();

router.get('/ingredient-consumption', authenticateToken, async (req, res) => {
  try {
    const businessId = req.user.business_id; // ✅ from JWT

    const [rows] = await pool.query(
      'SELECT * FROM v_ingredient_consumption WHERE business_id = ?',
      [businessId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
