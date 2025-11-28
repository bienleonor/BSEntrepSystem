import pool from '../../config/pool.js';

/**
 * Add a recipe ingredient for a product
 * @param {Object} data - { productId, ingredientProductId, consumptionAmount, ingredientUnitId }
 */
export const addIngredient = async ({ productId, ingredientProductId, consumptionAmount, ingredientUnitId }) => {
  const [result] = await pool.execute(
    `INSERT INTO recipe_ingredients_table 
       (product_id, ingredient_product_id, consumption_amount, ingredient_unit_id)
     VALUES (?, ?, ?, ?)`,
    [productId, ingredientProductId, consumptionAmount, ingredientUnitId]
  );
  return result.insertId;
};

/**
 * Get all ingredients for a product
 * @param {Number} productId
 */
export const getIngredientsByProduct = async (productId) => {
  const [rows] = await pool.execute(
    `SELECT 
        ri.recipe_id, 
        ri.ingredient_product_id, 
        ri.consumption_amount, 
        ri.ingredient_unit_id,
        p.name AS ingredient_name
     FROM recipe_ingredients_table ri
     JOIN product_table p 
       ON ri.ingredient_product_id = p.product_id
     WHERE ri.product_id = ?`,
    [productId]
  );
  return rows;
};

/**
 * Delete all ingredients for a product (useful when updating recipe)
 * @param {Number} productId
 */
export const deleteIngredientsByProduct = async (productId) => {
  const [result] = await pool.execute(
    `DELETE FROM recipe_ingredients_table WHERE product_id = ?`,
    [productId]
  );
  return result;
};
//NO TRY CATCH HERE, HANDLE ERRORS IN CONTROLLER
export default { addIngredient, getIngredientsByProduct, deleteIngredientsByProduct };
