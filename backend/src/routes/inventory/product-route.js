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

// Create product - requires "products:create" permission
router.post('/products', 
  authenticateToken, 
  requireBusinessAccess, 
  requirePermission('products:create'),
  uploadLocal.single('picture'), 
  createProduct
);

// Update product - requires "products:update" permission
router.put('/products/:productId', 
  authenticateToken, 
  requireBusinessAccess, 
  requirePermission('products:update'),
  uploadLocal.single('picture'), 
  modifyProduct
);

// Delete product - requires "products:delete" permission
router.delete('/products/:productId', 
  authenticateToken, 
  requireBusinessAccess, 
  requirePermission('products:delete'),
  removeProduct
);

// Toggle product status - requires "products:update" permission
router.patch('/products/:productId/status', 
  authenticateToken, 
  requireBusinessAccess, 
  requirePermission('products:update'),
  toggleProductStatus
);

// ============================================
// READ ROUTES (Require auth + business access + read permission)
// ============================================

router.get('/products', 
  authenticateToken,
  requirePermission('products:read'),
  fetchAllProducts
);

router.get('/products/:productId', 
  authenticateToken,
  requirePermission('products:read'),
  fetchProductById
);

router.get('/products/active', 
  authenticateToken,
  requirePermission('products:read'),
  fetchActiveProducts
);

router.get('/products/inventory-details', 
  authenticateToken,
  requireBusinessAccess,
  requirePermission('products:read'),
  fetchProductWithInventoryDetails
);

router.get('/businesses/:businessId/products', 
  authenticateToken,
  requireBusinessAccess,
  requirePermission('products:read'),
  fetchProductsByBusiness
);

router.get('/products/active/inventory-details/:businessId', 
  authenticateToken,
  requireBusinessAccess,
  requirePermission('products:read'),
  fetchActiveProductWithInventoryDetailsByBusiness
);

// ============================================
// PUBLIC ROUTES (No permission required)
// ============================================

router.get('/units', fetchUnits);

export default router;
