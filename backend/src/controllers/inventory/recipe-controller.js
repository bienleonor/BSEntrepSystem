
import { deleteIngredientsByProduct, addIngredient, getIngredientsByProduct } from '../../models/inventory/recipe-model.js';

export const addOrUpdateRecipe = async (req, res) => {
  try {
    const { productId, ingredients } = req.body;
    console.log("This is the body", req.body)
    console.log("This is the ingredients", req.ingredients)

    if (!productId || !Array.isArray(ingredients)) {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    // Delete existing ingredients first
    await deleteIngredientsByProduct(productId);

    // Add new ingredients
    for (const ing of ingredients) {
      await addIngredient({
        productId,
        ingredientProductId: ing.ingredient_product_id,
        consumptionAmount: ing.consumption_amount,
        ingredientUnitId: ing.ingredient_unit_id
      });
    }

    res.status(200).json({ message: 'Recipe updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update recipe', error: err.message });
  }
};

/**
 * Get recipe ingredients for a product
 */
export const getRecipe = async (req, res) => {
  try {
    const { productId } = req.params;
    const ingredients = await getIngredientsByProduct(productId);
    res.status(200).json(ingredients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch recipe', error: err.message });
  }
};
