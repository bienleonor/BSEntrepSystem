export default { recordTransactionWithDetails };
//models/inventory/inventory-model.js
import pool from "../../config/pool.js";
/**
 * Record an inventory transaction header and multiple detail rows atomically.
 * details: [{ productId, qtyChange, unitId, unitCost?, totalCost? }, ...]
 */

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

export async function recordTransactionWithDetails({ businessId, userId, transactionType, reference = null, details = [] }) {
  if (!Array.isArray(details) || details.length === 0) {
    throw new Error('No transaction details provided');
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Insert header
    const [hdr] = await conn.execute(
      `INSERT INTO inventory_transactions (business_id, transaction_type, reference, user_id, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [businessId, transactionType, reference, userId]
    );

    const transactionId = hdr.insertId;

    for (const d of details) {
      const productId = d.productId;
      const qtyChange = Number(d.qtyChange) || 0;
      const unitId = d.unitId ?? null;
      const unitCost = Number(d.unitCost ?? 0);
      const totalCost = Number(d.totalCost ?? (unitCost * Math.abs(qtyChange)));

      // lock inventory row
      const [invRows] = await conn.execute(
        `SELECT inventory_id, quantity, unit_id FROM inventory_table WHERE product_id = ? FOR UPDATE`,
        [productId]
      );

      let qtyBefore = 0;
      if (invRows.length > 0) {
        // read numeric without rounding
        qtyBefore = Number(invRows[0].quantity);
      } else {
        // create inventory row if missing
        await conn.execute(
          `INSERT INTO inventory_table (product_id, quantity, updated_at, unit_id) VALUES (?, ?, NOW(), ?)`,
          [productId, 0, unitId]
        );
        qtyBefore = 0;
      }

      const qtyAfter = qtyBefore + qtyChange;

      // insert detail
      await conn.execute(
        `INSERT INTO inventory_transaction_details
         (invent_transact_id, product_id, qty_before, qty_after, qty_change, unit_id, unit_cost, total_cost)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [transactionId, productId, qtyBefore, qtyAfter, qtyChange, unitId, unitCost, totalCost]
      );

      // update inventory
      await conn.execute(
        `UPDATE inventory_table SET quantity = ?, updated_at = NOW(), unit_id = COALESCE(?, unit_id) WHERE product_id = ?`,
        [qtyAfter, unitId, productId]
      );
    }

    await conn.commit();
    conn.release();
    return { transactionId };
  } catch (err) {
    await conn.rollback();
    conn.release();
    throw err;
  }
}


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


export const getAllInventoryTransactions = async (businessId) => {
  const [rows] = await pool.execute(
    `SELECT it.transaction_id,
            it.product_id,
            p.name AS product_name,
            it.change_qty,
            it.reason,
            it.reference,
            it.user_id,
            u.username AS username,
            it.created_at
     FROM inventory_transactions it
     JOIN product_table p ON it.product_id = p.product_id
     LEFT JOIN user_table u ON u.user_id = it.user_id
     WHERE it.business_id = ?
     ORDER BY it.created_at DESC`,
    [businessId]
  );
  return rows;
};
