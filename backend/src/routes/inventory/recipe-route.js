// routes/recipeRoutes.js
import express from 'express';
import { addOrUpdateRecipe, getRecipe } from '../../controllers/inventory/recipe-controller.js';
import { authenticateToken } from '../../middlewares/auth-middleware.js';
import { requireBusinessAccess } from '../../middlewares/business-access.js';
import { requirePermission } from '../../middlewares/permission-middleware.js';

const router = express.Router();

// ============================================
// RECIPE ROUTES (Requires recipe permission)
// ============================================

// Add or update recipe ingredients - requires recipe:create
router.post('/', 
  authenticateToken, 
  requireBusinessAccess,
  requirePermission('recipe:create'), 
  addOrUpdateRecipe
);

// Get recipe ingredients - requires recipe:read
router.get('/:productId', 
  authenticateToken, 
  requireBusinessAccess,
  requirePermission('recipe:read'), 
  getRecipe
);

// Alias for frontend compatibility
router.get('/recipes/:productId', 
  authenticateToken, 
  requireBusinessAccess,
  requirePermission('recipe:read'), 
  getRecipe
);

export default router;
