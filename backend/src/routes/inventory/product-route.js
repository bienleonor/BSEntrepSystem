import express from 'express';
import multer from 'multer';
import { cloudinaryStorage, localStorage } from '../../config/storage.js'; // Adjust path if needed
import {
  createProduct,
  fetchProductsByBusiness,
  fetchUnits,
  fetchAllProducts,
  fetchProductById,
  modifyProduct,
  removeProduct,
  toggleProductStatus,
  fetchActiveProducts,
  fetchProductWithInventoryDetailsByBusiness,
  fetchProductWithInventoryDetails,
  insertInventoryStock,
} from '../../controllers/inventory/product-controller.js';

const router = express.Router();

// Upload middleware
const uploadLocal = multer({ storage: localStorage });
const uploadCloud = multer({ storage: cloudinaryStorage });

// Use one of these depending on your strategy:
//router.post('/products', uploadCloud.single('picture'), createProduct);
// OR
 router.post('/products', uploadLocal.single('picture'), createProduct);

// Product routes
router.get('/products', fetchAllProducts);
router.get('/products/:productId', fetchProductById);
router.put('/products/:productId', modifyProduct);
router.delete('/products/:productId', removeProduct);
router.get('/businesses/:businessId/products', fetchProductsByBusiness);
router.get('/units', fetchUnits);
router.patch('/products/:productId/status', toggleProductStatus);
router.get('/products/active', fetchActiveProducts);
router.get('/products/inventory-details', fetchProductWithInventoryDetails);
router.get('/products/active/inventory-details/:businessId', fetchProductWithInventoryDetailsByBusiness);
router.post('/inventory', insertInventoryStock);


export default router;
