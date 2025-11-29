import pool from '../../config/pool.js';
import { recordTransactionWithDetails } from './inventory-model.js';


// Create a stock-in record
 
export const createStockIn = async ({ businessId, userId, totalAmount }) => {
  const [result] = await pool.execute(
    `INSERT INTO stockin_table (business_id, user_id, total_amount, created_at)
     VALUES (?, ?, ?, NOW())`,
    [businessId, userId, totalAmount]
  );
  return result.insertId;
};
//NO TRY CATCH HERE, HANDLE ERRORS IN CONTROLLER
/**
 * Validate that all products are simple type
 * @param {Array} items - [{ productId, quantity, unit_price }]
 * @throws {Error} if any product is not simple
 */
export const validateSimpleProducts = async (items) => {
  const connection = await pool.getConnection();
  
  try {
    for (const item of items) {
      const [rows] = await connection.execute(
        `SELECT product_id, name, product_type FROM product_table WHERE product_id = ?`,
        [item.productId]
      );

      if (rows.length === 0) {
        throw new Error(`Product ${item.productId} not found`);
      }

      const product = rows[0];
      
      if (product.product_type !== 'simple') {
        throw new Error(
          `Cannot stock-in ${product.product_type} product "${product.name}". ` +
          `Only simple products can be stocked in.`
        );
      }
    }
  } finally {
    connection.release();
  }
};

/**
 * Insert stock-in items (with validation)
 * @param {Number} stockinId
 * @param {Array} items - [{ productId, quantity, unit_price }]
 */
export const insertStockInItems = async (stockinId, items, { businessId = null, userId = null } = {}) => {
  // Instead of inserting into deprecated stockin_item_table, record an inventory transaction with details
  // Build details for inventory_transaction_details
  const details = [];

  // Validate simple products and build details
  for (const item of items) {
    const { productId, quantity, unit_price } = item;

    // Read product and its current inventory unit (unit_id moved to inventory_table)
    const [productRows] = await pool.execute(
      `SELECT p.product_id, p.name, p.product_type, i.unit_id
       FROM product_table p
       LEFT JOIN inventory_table i ON p.product_id = i.product_id
       WHERE p.product_id = ?`,
      [productId]
    );

    if (productRows.length === 0) {
      throw new Error(`Product ${productId} not found`);
    }

    const product = productRows[0];
    if (product.product_type !== 'simple') {
      throw new Error(`Cannot stock-in ${product.product_type} product "${product.name}". Only simple products allowed in stock-in.`);
    }

    const qtyChange = Number(quantity);
    const unitId = product.unit_id ?? null;
    const unitCost = Number(unit_price) || 0;
    const totalCost = unitCost * Math.abs(qtyChange);

    details.push({ productId, qtyChange, unitId, unitCost, totalCost });
  }

  // Create inventory transaction with reference to the stockin header
  await recordTransactionWithDetails({
    businessId,
    userId,
    transactionType: 'purchase',
    reference: `stockin:${stockinId}`,
    details,
  });
};

/**
 * Insert stock-in items (without validation - use with caution)
 * @param {Number} stockinId
 * @param {Array} items - [{ productId, quantity, unit_price }]
 */
export const insertStockInItemsUnsafe = async (stockinId, items, { businessId = null, userId = null } = {}) => {
  // Unsafe insert: directly create inventory transaction details without product-type validation
  const details = [];
  // For each item, fetch product/inventory info and only accept client unit_multiplier when product is a pack
  for (const item of items) {
    const qtyChange = Number(item.quantity);
    const unitCost = Number(item.unit_price) || 0;

    // fetch product + inventory row to determine pack status
    const [prodRows] = await pool.execute(
      `SELECT p.product_id, p.product_type, i.unit_multiplier FROM product_table p LEFT JOIN inventory_table i ON p.product_id = i.product_id WHERE p.product_id = ?`,
      [item.productId]
    );

    if (prodRows.length === 0) throw new Error(`Product ${item.productId} not found`);

    const prod = prodRows[0];
    const invUnitMultiplier = Number(prod.unit_multiplier ?? 1);
    const isPack = (invUnitMultiplier > 1) || (String(prod.product_type || '').toLowerCase() === 'pack');

    const providedMultiplier = Number(item.unit_multiplier ?? 1);
    const unitMultiplier = isPack ? providedMultiplier : 1;

    details.push({
      productId: item.productId,
      qtyChange,
      // Prefer provided unit_id, otherwise we'll let recordTransactionWithDetails resolve from inventory/product
      unitId: item.unit_id ?? null,
      unitMultiplier,
      unitCost,
      totalCost: unitCost * Math.abs(qtyChange),
    });
  }

  await recordTransactionWithDetails({
    businessId,
    userId,
    transactionType: 'purchase',
    reference: `stockin:${stockinId}`,
    details,
  });
};


//  Get all stock-in records for a business

export const getStockInsByBusiness = async (businessId) => {
  try {
    const [rows] = await pool.execute(
      `SELECT 
         si.stockin_id,
         si.business_id,
         si.user_id,
         si.total_amount,
         si.created_at,
         u.username
       FROM stockin_table si
       LEFT JOIN user_table u ON si.user_id = u.user_id
       WHERE si.business_id = ?
       ORDER BY si.created_at DESC`,
      [businessId]
    );
    return rows;
  } catch (err) {
    console.error("getStockInsByBusiness error:", err);
    throw err;
  }
};

export const getStockInDetails = async (stockinId) => {
  try {
    const [header] = await pool.execute(
      `SELECT 
         si.stockin_id,
         si.business_id,
         si.user_id,
         si.total_amount,
         si.created_at,
         u.username,
         b.business_name
       FROM stockin_table si
       LEFT JOIN user_table u ON si.user_id = u.user_id
       LEFT JOIN business_table b ON si.business_id = b.business_id
       WHERE si.stockin_id = ?`,
      [stockinId]
    );

    if (header.length === 0) {
      return null;
    }

    const [items] = await pool.execute(
      `SELECT 
         sii.stockin_item_id,
         sii.product_id,
         sii.quantity,
         sii.unit_price,
         sii.total_price,
         p.name AS product_name,
         p.product_type,
         u.name AS unit_name
       FROM stockin_item_table sii
       LEFT JOIN product_table p ON sii.product_id = p.product_id
       LEFT JOIN unit_table u ON p.unit_id = u.unit_id
       WHERE sii.stockin_id = ?`,
      [stockinId]
    );

    return {
      ...header[0],
      items
    };
  } catch (err) {
    console.error("getStockInDetails error:", err);
    throw err;
  }

  // Get stock-in items with product types
  const [items] = await pool.execute(
     `SELECT 
       d.detail_id,
       d.product_id,
       d.qty_change AS quantity,
       d.unit_multiplier,
       d.total_quantity,
       d.unit_cost AS unit_price,
       d.total_cost AS total_price,
       p.name AS product_name,
       p.product_type,
       u.name AS unit_name
     FROM inventory_transaction_details d
     JOIN inventory_transactions t ON d.invent_transact_id = t.transaction_id AND t.reference = ?
     LEFT JOIN product_table p ON d.product_id = p.product_id
     LEFT JOIN unit_table u ON d.unit_id = u.unit_id
     WHERE t.reference = ?`,
    [ `stockin:${stockinId}`, `stockin:${stockinId}` ]
  );

  return {
    ...header[0],
    items
  };
};

export const deleteStockIn = async (stockinId) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Delete inventory transaction details and header associated with this stockin via reference
    const reference = `stockin:${stockinId}`;

    // Delete detail rows
    await connection.execute(
      `DELETE d FROM inventory_transaction_details d
       JOIN inventory_transactions t ON d.invent_transact_id = t.transaction_id
       WHERE t.reference = ?`,
      [reference]
    );

    // Delete transaction headers
    await connection.execute(
      `DELETE FROM inventory_transactions WHERE reference = ?`,
      [reference]
    );

    // Delete stockin header
    const [result] = await connection.execute(
      `DELETE FROM stockin_table WHERE stockin_id = ?`,
      [stockinId]
    );

    await connection.commit();
    return result;
  } catch (err) {
    console.error("deleteStockIn error:", err);
    try { await connection.rollback(); } catch (e) { /* ignore */ }
    throw err;
  } finally {
    try { connection.release(); } catch (e) { /* ignore */ }
  }
};

export default {
  createStockIn,
  validateSimpleProducts,
  insertStockInItems,
  insertStockInItemsUnsafe,
  getStockInsByBusiness,
  getStockInDetails,
  deleteStockIn
};