export default { recordTransactionWithDetails };
//models/inventory/inventory-model.js
import pool from "../../config/pool.js";
/**
 * Record an inventory transaction header and multiple detail rows atomically.
 * details: [{ productId, qtyChange, unitId, unitCost?, totalCost? }, ...]
 */

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
        const providedUnitId = d.unitId ?? null;
      const unitCost = Number(d.unitCost ?? 0);
      const totalCost = Number(d.totalCost ?? (unitCost * Math.abs(qtyChange)));

      // lock inventory row
      const [invRows] = await conn.execute(
        `SELECT inventory_id, quantity, unit_id, unit_multiplier, total_quantity FROM inventory_table WHERE product_id = ? FOR UPDATE`,
        [productId]
      );

      let qtyBefore = 0;
      if (invRows.length > 0) {
        // read numeric without rounding
        qtyBefore = Number(invRows[0].quantity);
      } else {
        // create inventory row if missing -> set unit_multiplier to 1 and total_quantity to 0
        const initialUnitMultiplier = d.unitMultiplier ?? 1;
        const initialUnitId = providedUnitId ?? null;

        // fetch conversion factor for unit (default 1)
        let conv = 1;
        if (initialUnitId) {
          const [uRows] = await conn.execute(`SELECT conversion_factor FROM unit_table WHERE unit_id = ?`, [initialUnitId]);
          conv = Number(uRows[0]?.conversion_factor ?? 1);
        }

        const initialQty = 0;
        const initialTotalQty = Math.round(initialQty * initialUnitMultiplier * conv);

        await conn.execute(
          `INSERT INTO inventory_table (product_id, unit_id, quantity, unit_multiplier, total_quantity, updated_at) VALUES (?, ?, ?, ?, ?, NOW())`,
          [productId, initialUnitId, initialQty, initialUnitMultiplier, initialTotalQty]
        );
        qtyBefore = 0;
      }

      const qtyAfter = qtyBefore + qtyChange;

      // Determine unit_id for the detail. Prefer provided unit, then existing inventory unit, then product default unit.
      let finalUnitId = providedUnitId;
      if (!finalUnitId) {
        finalUnitId = invRows.length > 0 ? invRows[0].unit_id : null;
      }
      if (!finalUnitId) {
        // try product default
        const [pRows] = await conn.execute(`SELECT unit_id FROM product_table WHERE product_id = ?`, [productId]);
        finalUnitId = pRows[0]?.unit_id ?? null;
      }

      if (!finalUnitId) {
        throw new Error(`Missing unit_id for product ${productId}. Provide a unit_id in details or set a default unit for the product.`);
      }

      // Determine final unit_multiplier (prefer provided, then inventory row, then default 1)
      let finalUnitMultiplier = d.unitMultiplier ?? null;
      if (!finalUnitMultiplier) {
        finalUnitMultiplier = invRows.length > 0 ? invRows[0].unit_multiplier ?? 1 : 1;
      }

      // fetch conversion factor for finalUnitId (default 1)
      let conversionFactor = 1;
      if (finalUnitId) {
        const [uRows] = await conn.execute(`SELECT conversion_factor FROM unit_table WHERE unit_id = ?`, [finalUnitId]);
        conversionFactor = Number(uRows[0]?.conversion_factor ?? 1);
      }

      // Compute total_quantity in base units incrementally to avoid recomputing
      // from qtyAfter * multiplier which can reset totals when multipliers change.
      // Prev total (base units) — prefer stored total_quantity if present.
      let prevTotalBase = 0;
      if (invRows.length > 0) {
        const storedTotal = invRows[0].total_quantity;
        if (storedTotal != null) {
          prevTotalBase = Number(storedTotal);
        } else {
          // fallback: compute previous total from stored qty and stored multiplier
          const prevQty = Number(invRows[0].quantity ?? 0);
          const prevMultiplier = Number(invRows[0].unit_multiplier ?? 1);
          // fetch prev conversion factor if unit_id present
          if (invRows[0].unit_id) {
            const [prevU] = await conn.execute(`SELECT conversion_factor FROM unit_table WHERE unit_id = ?`, [invRows[0].unit_id]);
            const prevConv = Number(prevU[0]?.conversion_factor ?? 1);
            prevTotalBase = Math.round(prevQty * prevMultiplier * prevConv);
          } else {
            prevTotalBase = Math.round(prevQty * prevMultiplier);
          }
        }
      }

      // compute change in base units for this detail
      const changeBase = Math.round(qtyChange * finalUnitMultiplier * conversionFactor);

      const totalQtyAfter = prevTotalBase + changeBase;

      // insert detail
      await conn.execute(
        `INSERT INTO inventory_transaction_details
         (invent_transact_id, product_id, qty_before, qty_after, qty_change, unit_id, unit_cost, total_cost)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [transactionId, productId, qtyBefore, qtyAfter, qtyChange, finalUnitId, unitCost, totalCost]
      );

      // derive product-level quantity from total_quantity and update inventory
      const derivedQty = Math.floor(totalQtyAfter / (finalUnitMultiplier * conversionFactor));
      await conn.execute(
        `UPDATE inventory_table SET quantity = ?, updated_at = NOW(), unit_id = COALESCE(?, unit_id), unit_multiplier = COALESCE(?, unit_multiplier), total_quantity = ? WHERE product_id = ?`,
        [derivedQty, finalUnitId, finalUnitMultiplier, totalQtyAfter, productId]
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
  // Insert a transaction header only — product-level data lives in inventory_transaction_details
  await conn.execute(
    `INSERT INTO inventory_transactions
     (business_id, transaction_type, reference, user_id, created_at)
     VALUES (?, ?, ?, ?, NOW())`,
    [business_id, reason, reference, user_id]
  );
};


export const getAllInventoryTransactions = async (businessId) => {
  // Return one row per detail so frontend can display product + qty per transaction
  const [rows] = await pool.execute(
    `SELECT t.transaction_id,
            d.product_id,
            p.name AS product_name,
            d.qty_change AS change_qty,
            t.transaction_type AS reason,
            t.reference,
            t.user_id,
            u.username AS username,
            t.created_at
     FROM inventory_transactions t
     JOIN inventory_transaction_details d ON d.invent_transact_id = t.transaction_id
     LEFT JOIN product_table p ON d.product_id = p.product_id
     LEFT JOIN user_table u ON u.user_id = t.user_id
     WHERE t.business_id = ?
     ORDER BY t.created_at DESC`,
    [businessId]
  );
  return rows;
};
