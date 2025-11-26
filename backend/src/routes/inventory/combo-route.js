// routes/comboRoutes.js
import express from 'express';
import { addCombo, getCombo, deleteCombo } from '../../controllers/inventory/combo-controllers.js';
import { authenticateToken } from '../../middlewares/auth-middleware.js';


const router = express.Router();

// Add combo items to a parent product
router.post('/add', authenticateToken, addCombo);

// Get all combo items for a parent product
router.get('/:parentProductId', authenticateToken, getCombo);

// Delete all combo items for a parent product
router.delete('/:parentProductId', authenticateToken, deleteCombo);

export default router;
