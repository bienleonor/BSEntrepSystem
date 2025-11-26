// routes/inventory.production.routes.js
import express from 'express';
import { createProduction } from '../../controllers/inventory/production-controllers.js';
import { authenticateToken } from '../../middlewares/auth-middleware.js'; // your auth middleware

const router = express.Router();

// POST /api/inventory/production
router.post('/', authenticateToken, createProduction);

export default router;
