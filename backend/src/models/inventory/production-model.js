// models/inventory/production-model.js
import pool from "../../config/pool.js";

export const startTransaction = async () => {
  try {
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    return conn;
  } catch (err) {
    console.error("startTransaction error:", err);
    throw err;
  }
};
//NO TRY CATCH HERE, HANDLE ERRORS IN CONTROLLER
// Commit and release
export const commitTransaction = async (conn) => {
  try {
    await conn.commit();
  } catch (err) {
    console.error("commitTransaction error:", err);
    throw err;
  } finally {
    try { conn.release(); } catch (e) { /* ignore */ }
  }
};
//NO TRY CATCH HERE, HANDLE ERRORS IN CONTROLLER
// Rollback and release
export const rollbackTransaction = async (conn) => {
  try {
    await conn.rollback();
  } catch (err) {
    console.error("rollbackTransaction error:", err);
    throw err;
  } finally {
    try { conn.release(); } catch (e) { /* ignore */ }
  }
};

export const insertProduction = async (conn, { product_id, quantity_produced, user_id }) => {
  try {
    const [result] = await conn.execute(
      `INSERT INTO production_table (product_id, quantity_produced, user_id, created_at)
       VALUES (?, ?, ?, NOW())`,
      [product_id, quantity_produced, user_id]
    );
    return result.insertId;
  } catch (err) {
    console.error("insertProduction error:", err);
    throw err;
  }
};

export const getInventoryRowForUpdate = async (conn, product_id) => {
  try {
    const [rows] = await conn.execute(
      `SELECT * FROM inventory_table WHERE product_id = ? FOR UPDATE`,
      [product_id]
    );
    return rows[0] || null;
  } catch (err) {
    console.error("getInventoryRowForUpdate error:", err);
    throw err;
  }
};

export const updateInventoryQty = async (conn, product_id, qty) => {
  try {
    const [result] = await conn.execute(
      `UPDATE inventory_table SET quantity = ?, updated_at = NOW() WHERE product_id = ?`,
      [qty, product_id]
    );
    return result;
  } catch (err) {
    console.error("updateInventoryQty error:", err);
    throw err;
  }
};

export const insertInventoryRow = async (conn, product_id, qty) => {
  try {
    const [result] = await conn.execute(
      `INSERT INTO inventory_table (product_id, quantity, created_at, updated_at) VALUES (?, ?, NOW(), NOW())`,
      [product_id, qty]
    );
    return result.insertId;
  } catch (err) {
    console.error("insertInventoryRow error:", err);
    throw err;
  }
};

export const insertInventoryTransaction = async (
  conn,
  { business_id, reason, reference, user_id }
) => {
  // Insert header only — product-level changes should be recorded in details
  await conn.execute(
    `INSERT INTO inventory_transactions
      (business_id, transaction_type, reference, user_id, created_at)
     VALUES (?, ?, ?, ?, NOW())`,
    [business_id, reason, reference, user_id]
  );
};
