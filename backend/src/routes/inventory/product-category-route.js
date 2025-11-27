import {getProductCategories,createProductCategory} from '../../controllers/inventory/product-category-controller.js';
import express from 'express';

const router = express.Router();

// Product Category routes
// GET /api/inventory/:businessId/product-categories
router.get('/:businessId/product-categories', getProductCategories);
router.post('/product-categories', createProductCategory);

export default router;