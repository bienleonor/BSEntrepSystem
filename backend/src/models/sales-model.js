// src/models/sales-models.js
import pool from '../config/pool.js';

/**
 * Create sale (transactional).
 * Returns created purchaseId.
 */
export const createSale = async (saleData) => {
  const { user_id, total_amount, items, business_id } = saleData;
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("No items to create sale");
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();   
    
    // Step 1: Insert into purchases_table
    const [purchaseResult] = await conn.execute(
      `INSERT INTO purchases_table (user_id, total_amount, purchase_date) 
      VALUES (?, ?, NOW())`,
      [user_id, total_amount]
    );
    const purchaseId = purchaseResult.insertId;


    // Step A: Get today's count and business_code
    const [rows] = await conn.execute(
      `SELECT b.business_code, 
              (SELECT COUNT(*) 
               FROM transaction_table t 
               WHERE t.business_id = b.business_id 
                 AND DATE(t.created_at) = CURDATE()) AS cnt
       FROM business_table b
       WHERE b.business_id = ? 
       FOR UPDATE`,
      [business_id]
    );

    if (!rows.length) throw new Error("Business not found");

    const businessCode = rows[0].business_code;
    const nextReceiptNo = rows[0].cnt + 1;

    // Optional: update snapshot counter in business_table
    await conn.execute(
      `UPDATE business_table SET last_receipt_no = ? WHERE business_id = ?`,
      [nextReceiptNo, business_id]
    );

    // Step B: Build receipt string with businessCode + datePart + nextReceiptNo
      const now = new Date();
      const month = String(now.getMonth() + 1).padStart(2, "0"); // months are 0-based
      const day = String(now.getDate()).padStart(2, "0");
      const datePart = `${month}${day}`;

      const receiptNo = `${businessCode}-${datePart}${nextReceiptNo}`;


    // Step 2: Insert into transaction_table
    await conn.execute(
      `INSERT INTO transaction_table 
       (purchase_id, custom_receipt_no, payment_method, business_id, stat_id, user_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [
        purchaseId,
        receiptNo,
        saleData.payment_method || "Cash",
        business_id,
        saleData.stat_id || 2,
        user_id,
      ]
    );

    // Step 3: Insert purchase items and update inventory
    for (const it of items) {
      const productId = Number(it.product_id);
      const qty = Number(it.quantity);
      const price = Number(it.price);

      await conn.execute(
        `INSERT INTO purchase_items_table (purchase_id, product_id, quantity, price) 
         VALUES (?, ?, ?, ?)`,
        [purchaseId, productId, qty, price]
      );

      const [res] = await conn.execute(
        `UPDATE inventory_table SET total_quantity = total_quantity - ? WHERE product_id = ?`,
        [qty, productId]
      );
      if (res.affectedRows === 0) {
        throw new Error(`Inventory update failed for product ${productId}`);
      }
    }

    await conn.commit();
   return { sale_id: purchaseId, custom_receipt_no: receiptNo };
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

  // 1️⃣ Count total completed transactions for the business
  const [countRows] = await pool.execute(
    `SELECT COUNT(DISTINCT t.purchase_id) AS total
     FROM transaction_table t
     JOIN purchases_table p ON t.purchase_id = p.purchase_id
     WHERE t.business_id = ? AND p.status_id = 2`,
    [bizId]
  );
  const totalRows = Number(countRows[0]?.total || 0);

  if (totalRows === 0) {
    return { orders: [], meta: { page, pageSize, totalRows: 0 } };
  }

  // 2️⃣ Fetch paginated transactions with items + receipt
  const [rows] = await pool.execute(
    `SELECT 
      t.purchase_id AS purchaseId,
      t.business_id,
      p.purchase_date,
      p.total_amount,
      t.custom_receipt_no,
      i.purchase_item_id AS itemId,
      i.product_id,
      pr.name AS product_name,
      i.quantity,
      i.price,
      pr.picture
    FROM transaction_table t
    JOIN purchases_table p ON t.purchase_id = p.purchase_id
    JOIN purchase_items_table i ON p.purchase_id = i.purchase_id
    JOIN product_table pr ON i.product_id = pr.product_id
    WHERE t.business_id = ? AND p.status_id = 2
    ORDER BY t.purchase_id ASC
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
        receiptNo: r.custom_receipt_no ?? null,
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
  if (!pid) throw new Error("purchaseId is required");

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Lock purchase row
    const [purchaseRows] = await conn.execute(
      `SELECT purchase_id, status_id 
       FROM purchases_table 
       WHERE purchase_id = ? 
       FOR UPDATE`,
      [pid]
    );
    if (purchaseRows.length === 0) {
      throw new Error(`Purchase ${pid} not found`);
    }

    const status = purchaseRows[0].status_id;
    if (status === 3) throw new Error(`Purchase ${pid} is already cancelled`);
    if (status === 1) throw new Error(`Purchase ${pid} is already finished`);

    // Restore inventory
    const [items] = await conn.execute(
      `SELECT product_id, quantity 
       FROM purchase_items_table 
       WHERE purchase_id = ?`,
      [pid]
    );

    for (const item of items) {
      const qty = Number(item.quantity) || 0;
      if (qty <= 0) continue;

      const [res] = await conn.execute(
        `UPDATE inventory_table 
         SET total_quantity = total_quantity + ? 
         WHERE product_id = ?`,
        [qty, item.product_id]
      );

      if (res.affectedRows === 0) {
        throw new Error(`Inventory update failed for product ${item.product_id}`);
      }
    }

    // Mark purchase as cancelled
    await conn.execute(
      `UPDATE purchases_table 
       SET status_id = 3, purchase_date = NOW()
       WHERE purchase_id = ?`,
      [pid]
    );

    // Mark transaction as cancelled
    await conn.execute(
      `UPDATE transaction_table 
       SET stat_id = 3, created_at = NOW()
       WHERE purchase_id = ?`,
      [pid]
    );

    await conn.commit();
    return true;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export const finishOrder = async (purchaseId) => {
  const pid = Number(purchaseId);
  if (!pid) throw new Error("purchaseId is required");

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // Lock purchase row
    const [purchaseRows] = await conn.execute(
      `SELECT purchase_id, status_id 
       FROM purchases_table 
       WHERE purchase_id = ? 
       FOR UPDATE`,
      [pid]
    );

    if (purchaseRows.length === 0) {
      throw new Error(`Purchase ${pid} not found`);
    }

    const status = purchaseRows[0].status_id;

    if (status === 1) throw new Error(`Purchase ${pid} is already finished`);
    if (status === 3) throw new Error(`Purchase ${pid} was cancelled`);

    // Mark purchase as finished
    await conn.execute(
      `UPDATE purchases_table 
       SET status_id = 1, purchase_date = NOW()
       WHERE purchase_id = ?`,
      [pid]
    );

    // Also mark transaction as finished
    await conn.execute(
      `UPDATE transaction_table 
       SET stat_id = 1, created_at = NOW()
       WHERE purchase_id = ?`,
      [pid]
    );

    await conn.commit();

    // We now treat purchase_id itself as the sales_id
    return pid;

  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export const getFinishOrderByBusiness = async (businessId, opts = {}) => {
  const bizId = Number(businessId);
  const sortBy = opts.sortBy || "id";       // default sort field
  const sortOrder = opts.sortOrder || "desc"; // "asc" or "desc"

  // 1️⃣ Count total finished transactions
  const [countRows] = await pool.execute(
    `SELECT COUNT(DISTINCT t.purchase_id) AS total
     FROM transaction_table t
     JOIN purchases_table p ON t.purchase_id = p.purchase_id
     WHERE t.business_id = ? AND p.status_id IN (1, 3)`,
    [bizId]
  );
  const totalRows = Number(countRows[0]?.total || 0);

  if (totalRows === 0) {
    return { orders: [], meta: { totalRows: 0 } };
  }

  // 2️⃣ Fetch all finished orders (no LIMIT/OFFSET)
  const [rows] = await pool.execute(
    `SELECT 
      t.purchase_id AS purchaseId,
      t.business_id,
      t.user_id,
      u.username AS username,
      t.custom_receipt_no,
      p.purchase_date,
      p.finished_at,
      p.total_amount,
      p.status_id,
      i.purchase_item_id AS itemId,
      i.product_id,
      pr.name AS product_name,
      i.quantity,
      i.price,
      pr.picture
    FROM transaction_table t
    JOIN purchases_table p ON t.purchase_id = p.purchase_id
    JOIN purchase_items_table i ON p.purchase_id = i.purchase_id
    JOIN product_table pr ON i.product_id = pr.product_id
    JOIN user_table u ON t.user_id = u.user_id
    WHERE t.business_id = ? AND p.status_id IN (1, 3)
    ORDER BY t.purchase_id ASC;`,
    [bizId]
  );

  // 3️⃣ Group items by purchaseId
  const ordersMap = new Map();
  for (const r of rows) {
    const pid = Number(r.purchaseId);
    if (!ordersMap.has(pid)) {
      ordersMap.set(pid, {
        id: pid,
        businessId: Number(r.business_id),
        userId: r.user_id !== null ? Number(r.user_id) : null,
        username: r.username ?? null,
        receiptNo: r.custom_receipt_no ?? null,
        purchaseDate: r.purchase_date ? new Date(r.purchase_date).toISOString() : null,
        finishedAt: r.finished_at ? new Date(r.finished_at).toISOString() : null,
        total: r.total_amount !== null ? Number(r.total_amount) : 0,
        statusId: r.status_id,
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

  // 4️⃣ Sorting logic
  const orders = Array.from(ordersMap.values()).sort((a, b) => {
    let valA, valB;
    switch (sortBy) {
      case "date":
        valA = a.purchaseDate ? new Date(a.purchaseDate).getTime() : 0;
        valB = b.purchaseDate ? new Date(b.purchaseDate).getTime() : 0;
        break;
      case "time":
        valA = a.finishedAt ? new Date(a.finishedAt).getTime() : 0;
        valB = b.finishedAt ? new Date(b.finishedAt).getTime() : 0;
        break;
      case "total":
        valA = a.total;
        valB = b.total;
        break;
      case "username":
        valA = a.username?.toLowerCase() || "";
        valB = b.username?.toLowerCase() || "";
        break;
      default: // id
        valA = a.id;
        valB = b.id;
    }

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return {
    orders,
    meta: { totalRows }
  };
};


export const getSalesTotal = async (businessId) => {
  const bizId = Number(businessId);

  const [rows] = await pool.execute(
    `SELECT COALESCE(SUM(p.total_amount), 0) AS total_sales
     FROM transaction_table t
     JOIN purchases_table p ON t.purchase_id = p.purchase_id
     WHERE t.business_id = ? AND p.status_id = 1`,
    [bizId]
  );

  return { total_sales: Number(rows[0]?.total_sales || 0) }; // ✅ consistent key
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
