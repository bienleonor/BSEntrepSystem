import express from 'express';
import {
  createProduct,
  fetchProductsByBusiness,
  fetchUnits,
  fetchAllProducts,
  fetchProductById,
  modifyProduct,
  removeProduct
} from '../../controllers/inventory/product-controller.js';
import multer from 'multer';
import storage from '../../config/storage.js'; // adjust path if needed

export const upload = multer({ storage });


const router = express.Router();

// Product routes
router.post('/products', upload.single('picture'), createProduct);
 // POST /products
router.get('/products', fetchAllProducts); // GET /products
router.get('/products/:productId', fetchProductById); // GET /products/:productId
router.put('/products/:productId', modifyProduct); // PUT /products/:productId
router.delete('/products/:productId', removeProduct); // DELETE /products/:productId

// Business-specific products
router.get('/businesses/:businessId/products', fetchProductsByBusiness); // GET /businesses/:businessId/products

// Units
router.get('/units', fetchUnits); // GET /units

export default router;
