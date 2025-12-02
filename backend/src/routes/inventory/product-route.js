import express from 'express';
import multer from 'multer';
import { cloudinaryStorage, localStorage } from '../../config/storage.js'; // Adjust path if needed
import {
  createProduct,
  fetchProductsByBusiness,
  fetchUnits,
  fetchAllProducts,
  fetchProductById,
  removeProduct,
  toggleProductStatus,
  fetchActiveProducts,
  modifyProduct,
  fetchActiveProductWithInventoryDetailsByBusiness,
  fetchProductWithInventoryDetails,
} from '../../controllers/inventory/product-controller.js';
import { authenticateToken } from '../../middlewares/auth-middleware.js';
import { requireBusinessAccess } from '../../middlewares/business-access.js';
import { requirePermission } from '../../middlewares/permission-middleware.js';

const router = express.Router();

// Upload middleware
const uploadLocal = multer({ storage: localStorage });
const uploadCloud = multer({ storage: cloudinaryStorage });

// ============================================
// PROTECTED ROUTES (Require auth + business access + permission)
// ============================================

// Create product - requires "product:create" permission
router.post('/products', 
  authenticateToken, 
  requireBusinessAccess, 
  requirePermission('product:create'),
  uploadLocal.single('picture'), 
  createProduct
);

// Update product - requires "product:update" permission
router.put('/products/:productId', 
  authenticateToken, 
  requireBusinessAccess, 
  requirePermission('product:update'),
  uploadLocal.single('picture'), 
  modifyProduct
);

// Delete product - requires "product:delete" permission
router.delete('/products/:productId', 
  authenticateToken, 
  requireBusinessAccess, 
  requirePermission('product:delete'),
  removeProduct
);

// Toggle product status - requires "product:update" permission
router.patch('/products/:productId/status', 
  authenticateToken, 
  requireBusinessAccess, 
  requirePermission('product:update'),
  toggleProductStatus
);

// ============================================
// READ ROUTES (Require auth + business access + read permission)
// ============================================

router.get('/products', 
  authenticateToken,
  requirePermission('product:read'),
  fetchAllProducts
);

router.get('/products/:productId', 
  authenticateToken,
  requirePermission('product:read'),
  fetchProductById
);

router.get('/products/active', 
  authenticateToken,
  requirePermission('product:read'),
  fetchActiveProducts
);

router.get('/products/inventory-details', 
  authenticateToken,
  requireBusinessAccess,
  requirePermission('product:read'),
  fetchProductWithInventoryDetails
);

router.get('/businesses/:businessId/products', 
  authenticateToken,
  requireBusinessAccess,
  requirePermission('product:read'),
  fetchProductsByBusiness
);

router.get('/products/active/inventory-details/:businessId', 
  authenticateToken,
  requireBusinessAccess,
  requirePermission('product:read'),
  fetchActiveProductWithInventoryDetailsByBusiness
);

// ============================================
// PUBLIC ROUTES (No permission required)
// ============================================

router.get('/units', fetchUnits);

export default router;
