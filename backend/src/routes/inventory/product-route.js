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

const router = express.Router();

// Upload middleware
const uploadLocal = multer({ storage: localStorage });
const uploadCloud = multer({ storage: cloudinaryStorage });

// Use one of these depending on your strategy:
//router.post('/products', uploadCloud.single('picture'), createProduct);
// OR
 router.post('/products', authenticateToken, requireBusinessAccess, uploadLocal.single('picture'), createProduct);

// Product routes
router.get('/products', fetchAllProducts);
router.get('/products/:productId', fetchProductById);

// Use the same storage middleware you used for POST
router.put('/products/:productId', authenticateToken, requireBusinessAccess, uploadLocal.single('picture'), modifyProduct);

// If you configured cloudinaryStorage and prefer it for updates:
//router.put('/products/:productId', uploadCloud.single('picture'), modifyProduct);

router.delete('/products/:productId', authenticateToken, requireBusinessAccess, removeProduct);
router.get('/units', fetchUnits);
router.patch('/products/:productId/status', authenticateToken, requireBusinessAccess, toggleProductStatus);
router.get('/products/active', fetchActiveProducts);
router.get('/products/inventory-details', fetchProductWithInventoryDetails);
router.get('/businesses/:businessId/products', fetchProductsByBusiness);
router.get('/products/active/inventory-details/:businessId', fetchActiveProductWithInventoryDetailsByBusiness);



export default router;
