import pool from '../../config/pool.js';

export const fetchProductCategories = async (businessId) => {
  try {
    const [rows] = await pool.execute(
      `SELECT category_id, name, description, business_id FROM product_category_table WHERE business_id = ?`,
        [businessId]
    );
    return rows;
  }
    catch (error) { 
        throw error;
    }
};
//NO TRY CATCH HERE, HANDLE ERRORS IN CONTROLLER
export const addProductCategory = async (categoryData) => {
  const {
    name = null,
    description = null,
    businessId = null,
  } = categoryData;
    const [categoryResult] = await pool.execute(
      `INSERT INTO product_category_table (name, description, business_id) VALUES (?, ?, ?)`,
      [name, description, businessId]
    );
    return categoryResult;
};

export const removeProductCategory = async ({ categoryId, businessId }) => {
  try {
    const [result] = await pool.execute(
      `DELETE FROM product_category_table WHERE category_id = ? AND business_id = ?`,
      [categoryId, businessId]
    );
    return result.affectedRows || 0;
  } catch (error) {
    console.error("removeProductCategory error:", error);
    throw error;
  }
};

export default {
  fetchProductCategories,
  addProductCategory,
  removeProductCategory,
};