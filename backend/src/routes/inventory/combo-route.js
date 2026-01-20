// routes/comboRoutes.js
import express from 'express';
import { addCombo, getCombo, deleteCombo } from '../../controllers/inventory/combo-controllers.js';
import { authenticateToken } from '../../middlewares/auth-middleware.js';
import { requireBusinessAccess } from '../../middlewares/business-access.js';
import { requirePermission } from '../../middlewares/permission-middleware.js';

const router = express.Router();

// ============================================
// COMBO PRODUCT ROUTES (Requires combo permission)
// ============================================

// Add combo items - requires combo:create
router.post('/add', 
  authenticateToken, 
  requireBusinessAccess,
  requirePermission('combo:create'),
  addCombo
);

// Get combo items - requires combo:read
router.get('/:parentProductId', 
  authenticateToken, 
  requireBusinessAccess,
  requirePermission('combo:read'),
  getCombo
);

// Delete combo items - requires combo:delete
router.delete('/:parentProductId', 
  authenticateToken, 
  requireBusinessAccess,
  requirePermission('combo:delete'),
  deleteCombo
);

export default router;
