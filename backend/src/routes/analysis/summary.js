import express from 'express';
import pool from '../../config/pool.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { businessId } = req.query;
    let rows;
    if (businessId) {
      [rows] = await pool.query('SELECT * FROM v_business_summary WHERE business_id = ?', [businessId]);
    } else {
      [rows] = await pool.query('SELECT * FROM v_business_summary');
    }
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;