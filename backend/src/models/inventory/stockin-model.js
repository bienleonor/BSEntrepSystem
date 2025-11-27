import pool from '../../config/pool.js';

/**
 * Create a stock-in record
 * @param {Object} data - { businessId, userId, totalAmount }
 * @returns {Number} stockinId
 */
export const createStockIn = async ({ businessId, userId, totalAmount }) => {
  const [result] = await pool.execute(
    `INSERT INTO stockin_table (business_id, user_id, total_amount, created_at)
     VALUES (?, ?, ?, NOW())`,
    [businessId, userId, totalAmount]
  );
  return result.insertId;
};

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
export const insertStockInItems = async (stockinId, items) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    for (const item of items) {
      const { productId, quantity, unit_price } = item;

      // ✅ Validate product type
      const [productRows] = await connection.execute(
        `SELECT product_id, name, product_type FROM product_table WHERE product_id = ?`,
        [productId]
      );

      if (productRows.length === 0) {
        throw new Error(`Product ${productId} not found`);
      }

      const product = productRows[0];
      
      if (product.product_type !== 'simple') {
        throw new Error(
          `Cannot stock-in ${product.product_type} product "${product.name}". ` +
          `Only simple products allowed in stock-in.`
        );
      }

      // ✅ Calculate total_price for each item
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

/**
 * Insert stock-in items (without validation - use with caution)
 * @param {Number} stockinId
 * @param {Array} items - [{ productId, quantity, unit_price }]
 */
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

/**
 * Get all stock-in records for a business
 * @param {Number} businessId
 */
export const getStockInsByBusiness = async (businessId) => {
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
};

/**
 * Get stock-in details with items
 * @param {Number} stockinId
 */
export const getStockInDetails = async (stockinId) => {
  // Get stock-in header
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

  // Get stock-in items with product types
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
};

/**
 * Delete a stock-in record (cascade deletes items)
 * @param {Number} stockinId
 */
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
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
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