import { getProductCategories, createProductCategory, deleteProductCategory } from '../../controllers/inventory/product-category-controller.js';
import { authenticateToken } from '../../middlewares/auth-middleware.js';
import { requireBusinessAccess } from '../../middlewares/business-access.js';
import { requirePermission } from '../../middlewares/permission-middleware.js';
import express from 'express';

const router = express.Router();

// ============================================
// PRODUCT CATEGORY ROUTES (Requires product_category permission)
// ============================================

// Get categories - requires category:read
router.get('/:businessId/product-categories', 
  authenticateToken, 
  requireBusinessAccess,
  requirePermission('category:read'),
  getProductCategories
);

// Create category - requires category:create
router.post('/product-categories', 
  authenticateToken, 
  requireBusinessAccess,
  requirePermission('category:create'),
  createProductCategory
);

// Delete category - requires category:delete
router.delete('/product-categories/:categoryId', 
  authenticateToken, 
  requireBusinessAccess,
  requirePermission('category:delete'),
  deleteProductCategory
);

export default router;