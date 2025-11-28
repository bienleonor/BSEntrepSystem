import pool from '../../config/pool.js';


// Add a recipe ingredient for a product
export const addIngredient = async ({ productId, ingredientProductId, consumptionAmount, ingredientUnitId }) => {
  try {
    const [result] = await pool.execute(
      `INSERT INTO recipe_ingredients_table (product_id, ingredient_product_id, consumption_amount, ingredient_unit_id)
       VALUES (?, ?, ?, ?)`,
      [productId, ingredientProductId, consumptionAmount, ingredientUnitId]
    );
    return result.insertId;
  } catch (err) {
    console.error("addIngredient error:", err);
    throw err;
  }
};


//  Get all ingredients for a product
export const getIngredientsByProduct = async (productId) => {
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM recipe_ingredients_table WHERE product_id = ?`,
      [productId]
    );
    return rows;
  } catch (err) {
    console.error("getIngredientsByProduct error:", err);
    throw err;
  }
};


//  Delete all ingredients for a product (useful when updating recipe)
export const deleteIngredientsByProduct = async (productId) => {
  try {
    const [result] = await pool.execute(
      `DELETE FROM recipe_ingredients_table WHERE product_id = ?`,
      [productId]
    );
    return result.affectedRows;
  } catch (err) {
    console.error("deleteIngredientsByProduct error:", err);
    throw err;
  }
};

// Exports all functions
export default { addIngredient, getIngredientsByProduct, deleteIngredientsByProduct };
