import express from 'express';
import pool from '../../config/pool.js';

const router = express.Router();

router.get('/by-category', async (req, res) => {
  try {
    const { businessId } = req.query;
    let rows;
    if (businessId) {
      [rows] = await pool.query('SELECT * FROM v_profit_by_category WHERE business_id = ?', [businessId]);
    } else {
      [rows] = await pool.query('SELECT * FROM v_profit_by_category');
    }
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;