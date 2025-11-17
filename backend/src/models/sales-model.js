import pool from '../config/pool.js';
import getAllProducts from './inventory/product-model.js';


export const createSale = async (saleData) => {
  const { user_id, total_amount, items,business_id } = saleData;

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("No items to create sale");
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    
    // insert into purchases
    const [purchaseResult] = await conn.execute(
      `INSERT INTO PURCHASES_TABLE (user_id, total_amount, purchase_date,business_id) VALUES (?, ?, NOW(),?)`,
      [user_id, total_amount, business_id]
    );
    const purchaseId = purchaseResult.insertId;

    // insert items and decrement inventory
    for (const it of items) {
      const { product_id, quantity, price } = it;
      // insert purchase item
      await conn.execute(
        `INSERT INTO PURCHASE_ITEMS_TABLE (purchase_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
        [purchaseId, product_id, quantity, price]
      );

      // decrement inventory for that business/product
      await conn.execute(
        `UPDATE INVENTORY_TABLE SET quantity = quantity - ? WHERE product_id = ?`,
        [quantity, product_id]
      );
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

export const getOrderById = async (orderId) => {
  const [rows] = await pool.execute(
    `SELECT * FROM purchase_items_table WHERE purchase_item_id = ?`,
    [orderId]
  );
  return rows;
};

export const getAllOrdersByBusiness = async (businessId) => {
  const [rows] = await pool.execute(
    `
    SELECT 
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
JOIN purchase_items_table i 
  ON p.purchase_id = i.purchase_id
JOIN product_table pr
  ON i.product_id = pr.product_id
WHERE p.business_id = ?
ORDER BY p.purchase_id ASC;

    `,
    [businessId]
  );

  const orders = rows.reduce((acc, row) => {
    let order = acc.find(o => o.purchaseId === row.purchaseId);
    if (!order) {
      order = {
        purchaseId: row.purchaseId,
        business_id: row.business_id,
        purchase_date: row.purchase_date,
        total_amount: row.total_amount,
        items: []
      };
      acc.push(order);
    }
    order.items.push({
      itemId: row.itemId,
      product_id: row.product_id,
      name: row.product_name,
      quantity: row.quantity,
      price: row.price,
      picture: row.picture
    });
    return acc;
  }, []);

  return orders;
};


export const getAllOrders = async () => {
  const [rows] = await pool.execute(`
    SELECT 
      pit.purchase_item_id ,
      pit.purchase_id,
      pit.product_id,
      pit.quantity,
      pit.price AS item_price,
      p.name AS product_name,
      p.picture AS picture,
      pur.total_amount AS purchase_total,
      pur.purchase_date
    FROM purchase_items_table pit
    LEFT JOIN product_table p 
           ON pit.product_id = p.product_id
    LEFT JOIN purchases_table pur 
           ON pit.purchase_id = pur.purchase_id
  `);

  // GROUP by purchase_id
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

export const cancelSale = async (purchaseId) => {
    if (!purchaseId) throw new Error('purchaseId is required');

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [purchaseRows] = await conn.execute(
        `SELECT purchase_id FROM purchases_table WHERE purchase_id = ? FOR UPDATE`,
        [purchaseId]
      );
      if (purchaseRows.length === 0) {
        throw new Error(`Purchase ${purchaseId} not found`);
      }

      const [items] = await conn.execute(
        `SELECT product_id, quantity FROM purchase_items_table WHERE purchase_id = ?`,
        [purchaseId]
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

      await conn.execute(
       `DELETE FROM purchases_table WHERE purchase_id = ?`,
      [purchaseId]
     );
    // purchase_items_table rows will be deleted automatically


      await conn.execute(
        `DELETE FROM purchases_table WHERE purchase_id = ?`,
        [purchaseId]
      );

      await conn.commit();
    } catch (err) {
      try { await conn.rollback(); } catch (e) { /* log rollback error */ }
      throw err;
    } finally {
      conn.release();
    }
};

export const finishOrder = async (purchaseId) => {
  if (!purchaseId) throw new Error('purchaseId is required');

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Lock the purchase row to avoid race conditions
    const [purchaseRows] = await conn.execute(
      `SELECT purchase_id, status FROM purchases_table WHERE purchase_id = ? FOR UPDATE`,
      [purchaseId]
    );

    if (purchaseRows.length === 0) {
      throw new Error(`Purchase ${purchaseId} not found`);
    }

    const currentStatus = purchaseRows[0].status;
    if (currentStatus === 'FINISHED') {
      throw new Error(`Purchase ${purchaseId} is already finished`);
    }
    if (currentStatus === 'CANCELED') {
      throw new Error(`Purchase ${purchaseId} was canceled and cannot be finished`);
    }

    // Update status to finished
    await conn.execute(
      `UPDATE purchases_table SET status = 'FINISHED', finished_at = NOW() WHERE purchase_id = ?`,
      [purchaseId]
    );

    await conn.commit();
  } catch (err) {
    try { await conn.rollback(); } catch (e) { /* log rollback error */ }
    throw err;
  } finally {
    conn.release();
  }
};


export const getSalesTotal = async (businessId) => {
  const [rows] = await pool.execute(
    `SELECT SUM(total_amount) AS total_sales 
     FROM sales_table 
     WHERE business_id = ?`,
    [businessId]
  );
  return rows[0];
};


export default  { createSale, getSalesTotal,getAllOrders,getOrderById,getAllOrdersByBusiness,cancelSale  }; 
