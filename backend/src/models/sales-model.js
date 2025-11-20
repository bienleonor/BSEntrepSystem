// src/models/sales-models.js
import pool from '../config/pool.js';

/**
 * Create sale (transactional).
 * Returns created purchaseId.
 */
export const createSale = async (saleData) => {
  const { user_id, total_amount, items, business_id } = saleData;
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('No items to create sale');
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [purchaseResult] = await conn.execute(
      `INSERT INTO purchases_table (user_id, total_amount, purchase_date, business_id) VALUES (?, ?, NOW(), ?)`,
      [user_id, total_amount, business_id]
    );
    const purchaseId = purchaseResult.insertId;

    for (const it of items) {
      const productId = Number(it.product_id);
      const qty = Number(it.quantity);
      const price = Number(it.price);

      await conn.execute(
        `INSERT INTO purchase_items_table (purchase_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
        [purchaseId, productId, qty, price]
      );

      const [res] = await conn.execute(
        `UPDATE inventory_table SET quantity = quantity - ? WHERE product_id = ?`,
        [qty, productId]
      );
      if (res.affectedRows === 0) {
        throw new Error(`Inventory update failed for product ${productId}`);
      }
    }

    await conn.commit();
    return purchaseId;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

/**
 * Get purchase items by purchase id (rename for clarity).
 */
export const getOrderItemsByPurchaseId = async (purchaseId) => {
  const id = Number(purchaseId);
  const [rows] = await pool.execute(
    `SELECT purchase_item_id AS itemId, purchase_id AS purchaseId, product_id, quantity, price
     FROM purchase_items_table
     WHERE purchase_id = ?`,
    [id]
  );
  return rows;
};

/**
 * Fetch orders (completed: status_id = 2) for a business with pagination.
 * Returns { orders: [...], meta: { page, pageSize, totalRows } }
 */
export const getAllOrdersByBusiness = async (businessId, opts = {}) => {
  const bizId = Number(businessId);
  const page = Math.max(1, Number(opts.page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(opts.pageSize) || 25));
  const offset = (page - 1) * pageSize;

  // 1️⃣ Count total completed orders
  const [countRows] = await pool.execute(
    `SELECT COUNT(DISTINCT purchase_id) AS total
     FROM purchases_table
     WHERE business_id = ? AND status_id = 2`,
    [bizId]
  );
  const totalRows = Number(countRows[0]?.total || 0);

  if (totalRows === 0) {
    return { orders: [], meta: { page, pageSize, totalRows: 0 } };
  }

  // 2️⃣ Fetch paginated orders with items
  const [rows] = await pool.execute(
    `SELECT 
      p.purchase_id AS purchaseId,
      p.business_id,
      p.purchase_date,
      p.total_amount,
      i.purchase_item_id AS itemId,
      i.product_id,
      pr.name AS product_name,
      i.quantity,
      i.price,
      pr.picture
    FROM purchases_table p
    JOIN purchase_items_table i ON p.purchase_id = i.purchase_id
    JOIN product_table pr ON i.product_id = pr.product_id
    WHERE p.business_id = ? AND p.status_id = 2
    ORDER BY p.purchase_id ASC
    LIMIT ? OFFSET ?`,
    [bizId, pageSize, offset]
  );

  // 3️⃣ Group items by purchaseId
  const ordersMap = new Map();
  for (const r of rows) {
    const pid = Number(r.purchaseId);
    if (!ordersMap.has(pid)) {
      ordersMap.set(pid, {
        id: pid,
        businessId: Number(r.business_id),
        purchaseDate: r.purchase_date ? new Date(r.purchase_date).toISOString() : null,
        total: r.total_amount !== null ? Number(r.total_amount) : 0,
        items: []
      });
    }

    const order = ordersMap.get(pid);
    order.items.push({
      id: r.itemId !== null ? Number(r.itemId) : null,
      productId: r.product_id !== null ? Number(r.product_id) : null,
      productName: r.product_name ?? null,
      quantity: r.quantity !== null ? Number(r.quantity) : 0,
      price: r.price !== null ? Number(r.price) : 0,
      picture: r.picture ?? null
    });
  }

  return {
    orders: Array.from(ordersMap.values()).sort((a, b) => a.id - b.id),
    meta: { page, pageSize, totalRows }
  };
};

/**
 * getAllOrders - generic grouping across all purchases
 */
export const getAllOrders = async () => {
  const [rows] = await pool.execute(`
    SELECT 
      pit.purchase_item_id,
      pit.purchase_id,
      pit.product_id,
      pit.quantity,
      pit.price AS item_price,
      p.name AS product_name,
      p.picture AS picture,
      pur.total_amount AS purchase_total,
      pur.purchase_date
    FROM purchase_items_table pit
    LEFT JOIN product_table p ON pit.product_id = p.product_id
    LEFT JOIN purchases_table pur ON pit.purchase_id = pur.purchase_id
  `);

  const grouped = rows.reduce((acc, row) => {
    if (!acc[row.purchase_id]) {
      acc[row.purchase_id] = {
        purchaseId: row.purchase_id,
        total: row.purchase_total,
        date: row.purchase_date,
        items: []
      };
    }

    acc[row.purchase_id].items.push({
      id: row.purchase_item_id,
      name: row.product_name,
      picture: row.picture,
      quantity: row.quantity,
      price: row.item_price
    });

    return acc;
  }, {});

  return Object.values(grouped);
};

/**
 * Cancel sale (transactional).
 * Restores inventory, deletes purchase_items then purchase.
 */
export const cancelSale = async (purchaseId) => {
  const pid = Number(purchaseId);
  if (!pid) throw new Error('purchaseId is required');

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [purchaseRows] = await conn.execute(
      `SELECT purchase_id FROM purchases_table WHERE purchase_id = ? FOR UPDATE`,
      [pid]
    );
    if (purchaseRows.length === 0) {
      throw new Error(`Purchase ${pid} not found`);
    }

    const [items] = await conn.execute(
      `SELECT product_id, quantity FROM purchase_items_table WHERE purchase_id = ?`,
      [pid]
    );

    for (const item of items) {
      const qty = Number(item.quantity) || 0;
      if (qty <= 0) continue;

      const [res] = await conn.execute(
        `UPDATE inventory_table SET quantity = quantity + ? WHERE product_id = ?`,
        [qty, item.product_id]
      );

      if (res.affectedRows === 0) {
        throw new Error(`Inventory update failed for product ${item.product_id}`);
      }
    }

    // delete items first, then purchase
    await conn.execute(`DELETE FROM purchase_items_table WHERE purchase_id = ?`, [pid]);
    await conn.execute(`DELETE FROM purchases_table WHERE purchase_id = ?`, [pid]);

    await conn.commit();
    return true;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

/**
 * Finish order (transactional).
 * Marks purchase finished and inserts into sales tables.
 * Returns sales_id.
 */
export const finishOrder = async (purchaseId) => {
  const pid = Number(purchaseId);
  if (!pid) throw new Error('purchaseId is required');

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [purchaseRows] = await conn.execute(
      `SELECT purchase_id, status_id FROM purchases_table WHERE purchase_id = ? FOR UPDATE`,
      [pid]
    );
    if (purchaseRows.length === 0) throw new Error(`Purchase ${pid} not found`);

    const currentStatusId = purchaseRows[0].status_id;
    if (currentStatusId === 1) throw new Error(`Purchase ${pid} is already finished`);
    if (currentStatusId === 3) throw new Error(`Purchase ${pid} was cancelled`);

    await conn.execute(
      `UPDATE purchases_table SET status_id = 1, finished_at = NOW() WHERE purchase_id = ?`,
      [pid]
    );
      //to be deleted
    const [purchaseMeta] = await conn.execute(
      `SELECT total_amount, business_id FROM purchases_table WHERE purchase_id = ?`,
      [pid]
    );
    if (purchaseMeta.length === 0) throw new Error(`Purchase ${pid} metadata not found`);
    const { total_amount, business_id } = purchaseMeta[0];

    const [salesResult] = await conn.execute(
      `INSERT INTO sales_table (business_id, total_amount, created_at) VALUES (?, ?, NOW())`,
      [business_id, total_amount]
    );
    const sales_id = salesResult.insertId;

    const [purchaseItems] = await conn.execute(
      `SELECT product_id, quantity FROM purchase_items_table WHERE purchase_id = ?`,
      [pid]
    );
    if (purchaseItems.length === 0) throw new Error(`Purchase ${pid} has no items`);

    for (const item of purchaseItems) {
      await conn.execute(
        `INSERT INTO sales_item_table (sales_id, product_id, quantity) VALUES (?, ?, ?)`,
        [sales_id, item.product_id, item.quantity]
      );
    }

    await conn.commit();
    return sales_id;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export const getFinishOrderByBusiness = async (businessId, opts = {}) => {
  const bizId = Number(businessId);
  const page = Math.max(1, Number(opts.page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(opts.pageSize) || 25));
  const offset = (page - 1) * pageSize;

  // 1️⃣ Count total finished orders
  const [countRows] = await pool.execute(
    `SELECT COUNT(DISTINCT purchase_id) AS total
     FROM purchases_table
     WHERE business_id = ? AND status_id = 1`,
    [bizId]
  );
  const totalRows = Number(countRows[0]?.total || 0);

  if (totalRows === 0) {
    return { orders: [], meta: { page, pageSize, totalRows: 0 } };
  }

  // 2️⃣ Fetch paginated finished orders with items
  const [rows] = await pool.execute(
    `SELECT 
      p.purchase_id AS purchaseId,
      p.business_id,
      p.purchase_date,
      p.finished_at,
      p.total_amount,
      i.purchase_item_id AS itemId,
      i.product_id,
      pr.name AS product_name,
      i.quantity,
      i.price,
      pr.picture
    FROM purchases_table p
    JOIN purchase_items_table i ON p.purchase_id = i.purchase_id
    JOIN product_table pr ON i.product_id = pr.product_id
    WHERE p.business_id = ? AND p.status_id = 1
    ORDER BY p.purchase_id ASC
    LIMIT ? OFFSET ?`,
    [bizId, pageSize, offset]
  );

  // 3️⃣ Group items by purchaseId
  const ordersMap = new Map();
  for (const r of rows) {
    const pid = Number(r.purchaseId);
    if (!ordersMap.has(pid)) {
      ordersMap.set(pid, {
        id: pid,
        businessId: Number(r.business_id),
        purchaseDate: r.purchase_date ? new Date(r.purchase_date).toISOString() : null,
        finishedAt: r.finished_at ? new Date(r.finished_at).toISOString() : null,
        total: r.total_amount !== null ? Number(r.total_amount) : 0,
        items: []
      });
    }

    const order = ordersMap.get(pid);
    order.items.push({
      id: r.itemId !== null ? Number(r.itemId) : null,
      productId: r.product_id !== null ? Number(r.product_id) : null,
      productName: r.product_name ?? null,
      quantity: r.quantity !== null ? Number(r.quantity) : 0,
      price: r.price !== null ? Number(r.price) : 0,
      picture: r.picture ?? null
    });
  }

  return {
    orders: Array.from(ordersMap.values()).sort((a, b) => b.id - a.id),

    meta: { page, pageSize, totalRows }
  };
};

export const getSalesTotal = async (businessId) => {
  const bizId = Number(businessId);
  const [rows] = await pool.execute(
    `SELECT COALESCE(SUM(total_amount),0) AS total_sales 
     FROM purchases_table 
     WHERE business_id = ? AND status_id = 1 `,
    [bizId]
  );
  return rows[0];
};



export default {
  createSale,
  getSalesTotal,
  getAllOrders,
  getOrderItemsByPurchaseId,
  getAllOrdersByBusiness,
  cancelSale,
  finishOrder
};
