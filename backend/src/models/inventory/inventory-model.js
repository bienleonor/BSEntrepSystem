//models/inventory/inventory-model.js
import pool from "../../config/pool.js";

export const startTransaction = async () => {
  try {
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    return conn;
  } catch (err) {
    console.error("startTransaction(inventory) error:", err);
    throw err;
  }
};

export const commitTransaction = async (conn) => {
  try {
    await conn.commit();
  } catch (err) {
    console.error("commitTransaction(inventory) error:", err);
    throw err;
  } finally {
    try { conn.release(); } catch (e) { /* ignore */ }
  }
};

export const rollbackTransaction = async (conn) => {
  try {
    await conn.rollback();
  } catch (err) {
    console.error("rollbackTransaction(inventory) error:", err);
    throw err;
  } finally {
    try { conn.release(); } catch (e) { /* ignore */ }
  }
};

export const lockInventory = async (conn, product_id) => {
  try {
    const [rows] = await conn.execute(
      `SELECT * FROM inventory_table WHERE product_id = ? FOR UPDATE`,
      [product_id]
    );
    return rows[0] || null;
  } catch (err) {
    console.error("lockInventory error:", err);
    throw err;
  }
};

export const createInventoryRow = async (conn, product_id, qty) => {
  try {
    const [result] = await conn.execute(
      `INSERT INTO inventory_table (product_id, quantity, created_at, updated_at) VALUES (?, ?, NOW(), NOW())`,
      [product_id, qty]
    );
    return result.insertId;
  } catch (err) {
    console.error("createInventoryRow error:", err);
    throw err;
  }
};

export const updateInventoryQty = async (conn, product_id, change) => {
  try {
    const [result] = await conn.execute(
      `UPDATE inventory_table SET quantity = quantity + ?, updated_at = NOW() WHERE product_id = ?`,
      [change, product_id]
    );
    return result;
  } catch (err) {
    console.error("updateInventoryQty error:", err);
    throw err;
  }
};
//NO TRY CATCH HERE, HANDLE ERRORS IN CONTROLLER
export const insertInventoryTransaction = async (
  conn,
  { business_id, product_id, change_qty, reason, reference, user_id }
) => {
  try {
    const [result] = await conn.execute(
      `INSERT INTO inventory_transactions_table
       (business_id, product_id, change_qty, reason, reference, user_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [business_id, product_id, change_qty, reason, reference, user_id]
    );
    return result.insertId;
  } catch (err) {
    console.error("insertInventoryTransaction error:", err);
    throw err;
  }
};