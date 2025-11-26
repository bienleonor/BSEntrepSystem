// routes/recipeRoutes.js
import express from 'express';
import { addOrUpdateRecipe, getRecipe } from '../../controllers/inventory/recipe-controllers.js';
import { authenticateToken } from '../../middlewares/auth-middleware.js';

const router = express.Router();

// Add or update recipe ingredients
router.post('/recipe', authenticateToken, addOrUpdateRecipe);

// Get recipe ingredients for a product
router.get('/recipe/:productId', authenticateToken, getRecipe);

export default router;
