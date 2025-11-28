import express from 'express';
import pool from '../../config/pool.js';
import { authenticateToken } from '../../middlewares/auth-middleware.js';



const router = express.Router();

router.get('/by-category', authenticateToken, async (req, res) => {
try {
    const [rows] = await pool.query('SELECT * FROM v_profit_by_category WHERE business_id = ?');
    res.json(rows);
} catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
}
});

export default router;