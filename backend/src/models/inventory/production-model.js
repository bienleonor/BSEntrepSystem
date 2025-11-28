// models/inventory/production-model.js
import pool from "../../config/pool.js";

// Start transaction
export const startTransaction = async () => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  return connection;
};
//NO TRY CATCH HERE, HANDLE ERRORS IN CONTROLLER
// Commit and release
export const commitTransaction = async (conn) => {
  await conn.commit();
  conn.release();
};
//NO TRY CATCH HERE, HANDLE ERRORS IN CONTROLLER
// Rollback and release
export const rollbackTransaction = async (conn) => {
  await conn.rollback();
  conn.release();
};

export const insertProduction = async (conn, { product_id, quantity_produced, user_id }) => {
  const [result] = await conn.execute(
    `INSERT INTO production_table (product_id, quantity_produced, user_id, created_at)
     VALUES (?, ?, ?, NOW())`,
    [product_id, quantity_produced, user_id]
  );
  return result.insertId;
};

export const getInventoryRowForUpdate = async (conn, product_id) => {
  const [rows] = await conn.execute(
    `SELECT inventory_id FROM inventory_table WHERE product_id = ? FOR UPDATE`,
    [product_id]
  );
  return rows[0];
};

export const updateInventoryQty = async (conn, product_id, qty) => {
  await conn.execute(
    `UPDATE inventory_table 
     SET quantity = quantity + ?, updated_at = NOW() 
     WHERE product_id = ?`,
    [qty, product_id]
  );
};

export const insertInventoryRow = async (conn, product_id, qty) => {
  await conn.execute(
    `INSERT INTO inventory_table (product_id, quantity, updated_at) 
     VALUES (?, ?, NOW())`,
    [product_id, qty]
  );
};

export const insertInventoryTransaction = async (
  conn,
  { business_id, product_id, change_qty, reason, reference, user_id }
) => {
  await conn.execute(
    `INSERT INTO inventory_transactions
      (business_id, product_id, change_qty, reason, reference, user_id, created_at)
     VALUES (?, ?, ?, ?, ?, ?, NOW())`,
    [business_id, product_id, change_qty, reason, reference, user_id]
  );
};
