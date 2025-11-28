// models/comboModel.js
import pool from '../../config/pool.js';

export const addComboItems = async (parentProductId, components) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    for (const comp of components) {
      const { component_product_id, quantity } = comp;
      await connection.execute(
        `INSERT INTO combo_items_table (parent_product_id, component_product_id, quantity)
         VALUES (?, ?, ?)`,
        [parentProductId, component_product_id, quantity]
      );
    }

    await connection.commit();
  } catch (err) {
    console.error("addComboItems error:", err);
    try { await connection.rollback(); } catch (e) { /* ignore */ }
    throw err;
  } finally {
    try { connection.release(); } catch (e) { /* ignore */ }
  }
};

export const getComboByParent = async (parentProductId) => {
  try {
    const [rows] = await pool.execute(
      `SELECT c.component_id, c.component_product_id, c.quantity, p.name AS component_name, p.product_type
       FROM combo_items_table c
       JOIN product_table p ON c.component_product_id = p.product_id
       WHERE c.parent_product_id = ?`,
      [parentProductId]
    );
    return rows;
  } catch (err) {
    console.error("getComboByParent error:", err);
    throw err;
  }
};

export const deleteComboByParent = async (parentProductId) => {
  try {
    const [result] = await pool.execute(
      `DELETE FROM combo_items_table WHERE parent_product_id = ?`,
      [parentProductId]
    );
    return result;
  } catch (err) {
    console.error("deleteComboByParent error:", err);
    throw err;
  }
};
//NO TRY CATCH HERE, HANDLE ERRORS IN CONTROLLER
export default { addComboItems, getComboByParent, deleteComboByParent };
