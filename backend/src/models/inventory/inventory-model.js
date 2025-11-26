import pool from "../../config/pool.js";

export const startTransaction = async () => {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  return conn;
};

export const commitTransaction = async (conn) => {
  await conn.commit();
  conn.release();
};

export const rollbackTransaction = async (conn) => {
  await conn.rollback();
  conn.release();
};

export const lockInventory = async (conn, product_id) => {
  const [rows] = await conn.execute(
    `SELECT * FROM inventory_table WHERE product_id = ? FOR UPDATE`,
    [product_id]
  );
  return rows[0];
};

export const createInventoryRow = async (conn, product_id, qty) => {
  await conn.execute(
    `INSERT INTO inventory_table (product_id, quantity, updated_at)
     VALUES (?, ?, NOW())`,
    [product_id, qty]
  );
};

export const updateInventoryQty = async (conn, product_id, change) => {
  await conn.execute(
    `UPDATE inventory_table 
     SET quantity = quantity + ?, updated_at = NOW()
     WHERE product_id = ?`,
    [change, product_id]
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