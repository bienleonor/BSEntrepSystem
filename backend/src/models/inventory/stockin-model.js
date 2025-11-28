import pool from '../../config/pool.js';


// Create a stock-in record
 
export const createStockIn = async ({ businessId, userId, totalAmount }) => {
  try {
    const [result] = await pool.execute(
      `INSERT INTO stockin_table (business_id, user_id, total_amount, created_at)
       VALUES (?, ?, ?, NOW())`,
      [businessId, userId, totalAmount]
    );
    return result.insertId;
  } catch (err) {
    console.error("createStockIn error:", err);
    throw err;
  }
};


//  Validate that all products are simple type

export const validateSimpleProducts = async (items) => {
  try {
    if (!Array.isArray(items) || !items.length) return true;
    const ids = items.map(i => i.productId);
    const placeholders = ids.map(() => "?").join(",");
    const [rows] = await pool.execute(
      `SELECT product_id, product_type FROM product_table WHERE product_id IN (${placeholders})`,
      ids
    );
    const map = {};
    rows.forEach(r => { map[r.product_id] = r.product_type; });
    for (const it of items) {
      if (map[it.productId] !== 'simple') {
        throw new Error(`Product ${it.productId} is not simple`);
      }
    }
    return true;
  } catch (err) {
    console.error("validateSimpleProducts error:", err);
    throw err;
  }
};


// Insert stock-in items (with validation)

export const insertStockInItems = async (stockinId, items) => {
  try {
    if (!items || !items.length) return;
    const vals = [];
    const placeholders = items.map(() => "(?, ?, ?, ?)").join(", ");
    const params = [];
    for (const it of items) {
      params.push(stockinId, it.productId, it.quantity, it.unit_price);
    }
    await pool.execute(
      `INSERT INTO stockin_items_table (stockin_id, product_id, quantity, unit_price) VALUES ${placeholders}`,
      params
    );
  } catch (err) {
    console.error("insertStockInItems error:", err);
    throw err;
  }
};


//  Insert stock-in items (without validation - use with caution)

export const insertStockInItemsUnsafe = async (stockinId, items) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    for (const item of items) {
      const { productId, quantity, unit_price } = item;
      const total_price = Number(quantity) * Number(unit_price);

      await connection.execute(
        `INSERT INTO stockin_item_table (stockin_id, product_id, quantity, unit_price, total_price)
         VALUES (?, ?, ?, ?, ?)`,
        [stockinId, productId, quantity, unit_price, total_price]
      );
    }

    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
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
};

export const deleteStockIn = async (stockinId) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Delete items first
    await connection.execute(
      `DELETE FROM stockin_item_table WHERE stockin_id = ?`,
      [stockinId]
    );

    // Delete header
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