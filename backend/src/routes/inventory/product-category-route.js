import {getProductCategories,createProductCategory} from '../../controllers/inventory/product-category-controller.js';
import { authenticateToken } from '../../middlewares/auth-middleware.js';
import express from 'express';

const router = express.Router();

// Product Category routes
// GET /api/inventory/:businessId/product-categories
router.get('/:businessId/product-categories', authenticateToken, getProductCategories);
router.post('/product-categories', authenticateToken, createProductCategory);

export default router;