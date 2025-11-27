// routes/recipeRoutes.js
import express from 'express';
// Corrected controller file name to match actual `recipe-controller.js`
import { addOrUpdateRecipe, getRecipe } from '../../controllers/inventory/recipe-controller.js';
import { authenticateToken } from '../../middlewares/auth-middleware.js';

const router = express.Router();

// Add or update recipe ingredients
router.post('/', authenticateToken, addOrUpdateRecipe);

// Get recipe ingredients for a product (singular path)
router.get('/:productId', authenticateToken, getRecipe);
// Added plural alias to match frontend call `/inventory/recipes/:productId`
router.get('/recipes/:productId', authenticateToken, getRecipe);

export default router;
