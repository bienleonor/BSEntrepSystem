import pool from '../../config/pool.js';

export const fetchProductCategories = async (businessId) => {
  try {
    const [rows] = await pool.execute(
      `SELECT category_id, name, description, business_id FROM product_category_table WHERE business_id = ?`,
      [businessId]
    );
    return rows;
  } catch (error) {
    console.error("fetchProductCategories error:", error);
    throw error;
  }
};

export const addProductCategory = async (categoryData) => {
  try {
    const {
      name = null,
      description = null,
      businessId = null,
    } = categoryData;
    const [categoryResult] = await pool.execute(
      `INSERT INTO product_category_table (name, description, business_id) VALUES (?, ?, ?)`,
      [name, description, businessId]
    );
    return categoryResult.insertId ?? categoryResult;
  } catch (error) {
    console.error("addProductCategory error:", error);
    throw error;
  }
};

export default {
  fetchProductCategories,
  addProductCategory,
};