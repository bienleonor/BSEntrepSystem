// models/analysis-model.js
import pool from '../config/pool.js';

/**
 * Get sales trend by category for a business
 * @param {number|string} businessId
 * @param {object} filters - { startDate, endDate }
 */
export const getSalesTrendByCategory = async (businessId, filters = {}) => {
  let query = 'SELECT * FROM v_sales_trend_by_category WHERE 1=1';
  const params = [];

  if (businessId) {
    query += ' AND business_id = ?';
    params.push(businessId);
  }

  if (filters.startDate) {
    query += ' AND month >= ?';
    params.push(filters.startDate);
  }

  if (filters.endDate) {
    query += ' AND month <= ?';
    params.push(filters.endDate);
  }

  query += ' ORDER BY month ASC';

  const [rows] = await pool.query(query, params);
  return rows;
};

/**
 * Get profit by category for a business
 * @param {number|string} businessId
 */
export const getProfitByCategory = async (businessId) => {
  let query = 'SELECT * FROM v_profit_by_category WHERE 1=1';
  const params = [];

  if (businessId) {
    query += ' AND business_id = ?';
    params.push(businessId);
  }

  query += ' ORDER BY total_profit DESC';

  const [rows] = await pool.query(query, params);
  return rows;
};

/**
 * Get ingredient consumption for a business
 * @param {number|string} businessId
 */
export const getIngredientConsumption = async (businessId) => {
  let query = 'SELECT * FROM v_ingredient_consumption WHERE 1=1';
  const params = [];

  if (businessId) {
    query += ' AND business_id = ?';
    params.push(businessId);
  }

  query += ' ORDER BY total_consumed DESC';

  const [rows] = await pool.query(query, params);
  return rows;
};

/**
 * Get business summary
 * @param {number|string} businessId
 */
export const getBusinessSummary = async (businessId) => {
  let query = 'SELECT * FROM v_business_summary WHERE 1=1';
  const params = [];

  if (businessId) {
    query += ' AND business_id = ?';
    params.push(businessId);
  }

  const [rows] = await pool.query(query, params);
  return rows;
};

/**
 * Get top selling products for a business
 * @param {number|string} businessId
 * @param {number} limit
 */
export const getTopSellingProducts = async (businessId, limit = 10) => {
  let query = `
    SELECT 
      t.business_id,
      p.product_id,
      p.name AS product_name,
      pc.name AS category_name,
      SUM(pit.quantity) AS total_sold,
      SUM(pit.quantity * pit.price) AS total_revenue
    FROM transaction_table t
    JOIN purchase_items_table pit ON pit.purchase_id = t.purchase_id
    JOIN product_table p ON p.product_id = pit.product_id
    LEFT JOIN product_category_table pc ON pc.category_id = p.category_id
    WHERE t.stat_id = 1
  `;
  const params = [];

  if (businessId) {
    query += ' AND t.business_id = ?';
    params.push(businessId);
  }

  query += `
    GROUP BY t.business_id, p.product_id, p.name, pc.name
    ORDER BY total_sold DESC
    LIMIT ?
  `;
  params.push(limit);

  const [rows] = await pool.query(query, params);
  return rows;
};

/**
 * Get sales by date range
 * @param {number|string} businessId
 * @param {string} startDate - YYYY-MM-DD
 * @param {string} endDate - YYYY-MM-DD
 * @param {string} groupBy - 'day' | 'week' | 'month'
 */
export const getSalesByDateRange = async (businessId, startDate, endDate, groupBy = 'day') => {
  let dateFormat;
  switch (groupBy) {
    case 'week':
      dateFormat = '%Y-%u'; // Year-Week
      break;
    case 'month':
      dateFormat = '%Y-%m';
      break;
    default:
      dateFormat = '%Y-%m-%d';
  }

  let query = `
    SELECT 
      t.business_id,
      DATE_FORMAT(t.created_at, '${dateFormat}') AS period,
      COUNT(DISTINCT t.transaction_id) AS transaction_count,
      SUM(pit.quantity) AS total_items_sold,
      SUM(pit.quantity * pit.price) AS total_revenue
    FROM transaction_table t
    JOIN purchase_items_table pit ON pit.purchase_id = t.purchase_id
    WHERE t.stat_id = 1
  `;
  const params = [];

  if (businessId) {
    query += ' AND t.business_id = ?';
    params.push(businessId);
  }

  if (startDate) {
    query += ' AND DATE(t.created_at) >= ?';
    params.push(startDate);
  }

  if (endDate) {
    query += ' AND DATE(t.created_at) <= ?';
    params.push(endDate);
  }

  query += `
    GROUP BY t.business_id, DATE_FORMAT(t.created_at, '${dateFormat}')
    ORDER BY period ASC
  `;

  const [rows] = await pool.query(query, params);
  return rows;
};

/**
 * Get hourly sales distribution
 * @param {number|string} businessId
 */
export const getHourlySalesDistribution = async (businessId) => {
  let query = `
    SELECT 
      t.business_id,
      HOUR(t.created_at) AS hour,
      COUNT(DISTINCT t.transaction_id) AS transaction_count,
      SUM(pit.quantity * pit.price) AS total_revenue
    FROM transaction_table t
    JOIN purchase_items_table pit ON pit.purchase_id = t.purchase_id
    WHERE t.stat_id = 1
  `;
  const params = [];

  if (businessId) {
    query += ' AND t.business_id = ?';
    params.push(businessId);
  }

  query += `
    GROUP BY t.business_id, HOUR(t.created_at)
    ORDER BY hour ASC
  `;

  const [rows] = await pool.query(query, params);
  return rows;
};

/**
 * Get slowest-moving products (least sold)
 * @param {number|string} businessId
 * @param {number} limit
 */
export const getSlowestMovingProducts = async (businessId, limit = 10) => {
  let query = `
    SELECT 
      t.business_id,
      p.product_id,
      p.name AS product_name,
      pc.name AS category_name,
      COALESCE(SUM(pit.quantity), 0) AS total_sold,
      COALESCE(SUM(pit.quantity * pit.price), 0) AS total_revenue
    FROM product_table p
    LEFT JOIN product_category_table pc ON pc.category_id = p.category_id
    LEFT JOIN purchase_items_table pit ON pit.product_id = p.product_id
    LEFT JOIN transaction_table t ON t.purchase_id = pit.purchase_id AND t.stat_id = 1
    WHERE p.business_id = ?
  `;
  const params = [businessId];

  query += `
    GROUP BY p.product_id, p.name, pc.name, t.business_id
    ORDER BY total_sold ASC
    LIMIT ?
  `;
  params.push(limit);

  const [rows] = await pool.query(query, params);
  return rows;
};

/**
 * Get sales KPI summary (total sales, transactions, AOV, quantity sold)
 * @param {number|string} businessId
 */
export const getSalesKPISummary = async (businessId) => {
  let query = `
    SELECT 
      t.business_id,
      COUNT(DISTINCT t.transaction_id) AS total_transactions,
      COALESCE(SUM(pit.quantity), 0) AS total_quantity_sold,
      COALESCE(SUM(pit.quantity * pit.price), 0) AS total_sales,
      COALESCE(AVG(sub.order_total), 0) AS average_order_value
    FROM transaction_table t
    JOIN purchase_items_table pit ON pit.purchase_id = t.purchase_id
    JOIN (
      SELECT t2.transaction_id, SUM(pit2.quantity * pit2.price) AS order_total
      FROM transaction_table t2
      JOIN purchase_items_table pit2 ON pit2.purchase_id = t2.purchase_id
      WHERE t2.stat_id = 1 AND t2.business_id = ?
      GROUP BY t2.transaction_id
    ) sub ON sub.transaction_id = t.transaction_id
    WHERE t.stat_id = 1 AND t.business_id = ?
  `;
  const params = [businessId, businessId];

  const [rows] = await pool.query(query, params);
  return rows[0] || { total_transactions: 0, total_quantity_sold: 0, total_sales: 0, average_order_value: 0 };
};

/**
 * Get sales by category
 * @param {number|string} businessId
 */
export const getSalesByCategory = async (businessId) => {
  let query = `
    SELECT 
      t.business_id,
      pc.category_id,
      pc.name AS category_name,
      SUM(pit.quantity) AS total_quantity,
      SUM(pit.quantity * pit.price) AS total_revenue,
      COUNT(DISTINCT t.transaction_id) AS transaction_count
    FROM transaction_table t
    JOIN purchase_items_table pit ON pit.purchase_id = t.purchase_id
    JOIN product_table p ON p.product_id = pit.product_id
    LEFT JOIN product_category_table pc ON pc.category_id = p.category_id
    WHERE t.stat_id = 1
  `;
  const params = [];

  if (businessId) {
    query += ' AND t.business_id = ?';
    params.push(businessId);
  }

  query += `
    GROUP BY t.business_id, pc.category_id, pc.name
    ORDER BY total_revenue DESC
  `;

  const [rows] = await pool.query(query, params);
  return rows;
};

/**
 * Get sales by product
 * @param {number|string} businessId
 */
export const getSalesByProduct = async (businessId) => {
  let query = `
    SELECT 
      t.business_id,
      p.product_id,
      p.name AS product_name,
      pc.name AS category_name,
      SUM(pit.quantity) AS total_quantity,
      SUM(pit.quantity * pit.price) AS total_revenue,
      COUNT(DISTINCT t.transaction_id) AS transaction_count
    FROM transaction_table t
    JOIN purchase_items_table pit ON pit.purchase_id = t.purchase_id
    JOIN product_table p ON p.product_id = pit.product_id
    LEFT JOIN product_category_table pc ON pc.category_id = p.category_id
    WHERE t.stat_id = 1
  `;
  const params = [];

  if (businessId) {
    query += ' AND t.business_id = ?';
    params.push(businessId);
  }

  query += `
    GROUP BY t.business_id, p.product_id, p.name, pc.name
    ORDER BY total_revenue DESC
  `;

  const [rows] = await pool.query(query, params);
  return rows;
};

/**
 * Get average transaction duration (purchase_date → finished_at)
 * @param {number|string} businessId
 */
export const getTransactionDurationStats = async (businessId) => {
  let query = `
    SELECT 
      COUNT(*) AS total_transactions,
      AVG(TIMESTAMPDIFF(SECOND, p.purchase_date, p.finished_at)) AS avg_duration_seconds,
      MIN(TIMESTAMPDIFF(SECOND, p.purchase_date, p.finished_at)) AS min_duration_seconds,
      MAX(TIMESTAMPDIFF(SECOND, p.purchase_date, p.finished_at)) AS max_duration_seconds
    FROM transaction_table t
    JOIN purchases_table p ON p.purchase_id = t.purchase_id
    WHERE t.stat_id = 1 
      AND p.purchase_date IS NOT NULL 
      AND p.finished_at IS NOT NULL
      AND p.finished_at > p.purchase_date
  `;
  const params = [];

  if (businessId) {
    query += ' AND t.business_id = ?';
    params.push(businessId);
  }

  const [rows] = await pool.query(query, params);
  return rows[0] || { total_transactions: 0, avg_duration_seconds: 0, min_duration_seconds: 0, max_duration_seconds: 0 };
};

/**
 * Get cancelled/returned transactions count
 * stat_id: 1 = completed, 2 = pending, 3 = cancelled/voided
 * @param {number|string} businessId
 */
export const getCancelledTransactions = async (businessId) => {
  let query = `
    SELECT 
      COUNT(CASE WHEN t.stat_id = 3 THEN 1 END) AS cancelled_count,
      COUNT(CASE WHEN t.stat_id = 1 THEN 1 END) AS completed_count,
      COUNT(*) AS total_count,
      COALESCE(SUM(CASE WHEN t.stat_id = 3 THEN pit.quantity * pit.price END), 0) AS cancelled_value
    FROM transaction_table t
    LEFT JOIN purchase_items_table pit ON pit.purchase_id = t.purchase_id
    WHERE 1=1
  `;
  const params = [];

  if (businessId) {
    query += ' AND t.business_id = ?';
    params.push(businessId);
  }

  const [rows] = await pool.query(query, params);
  const row = rows[0] || {};
  return {
    cancelled_count: row.cancelled_count || 0,
    completed_count: row.completed_count || 0,
    total_count: row.total_count || 0,
    total_lost_revenue: row.cancelled_value || 0,
    cancellation_rate: row.total_count > 0 ? ((row.cancelled_count / row.total_count) * 100).toFixed(2) : 0,
  };
};

/**
 * Get stock-out / fill-rate metrics
 * Products with 0 or low stock
 * @param {number|string} businessId
 */
export const getStockOutMetrics = async (businessId) => {
  let query = `
    SELECT 
      COUNT(*) AS total_products,
      COUNT(CASE WHEN COALESCE(i.total_quantity, 0) = 0 THEN 1 END) AS out_of_stock_count,
      COUNT(CASE WHEN COALESCE(i.total_quantity, 0) > 0 AND COALESCE(i.total_quantity, 0) <= 10 THEN 1 END) AS low_stock_count,
      COUNT(CASE WHEN COALESCE(i.total_quantity, 0) > 10 THEN 1 END) AS in_stock_count
    FROM product_table p
    LEFT JOIN inventory_table i ON i.product_id = p.product_id
    WHERE p.business_id = ?
  `;
  const params = [businessId];

  const [rows] = await pool.query(query, params);
  const row = rows[0] || {};
  return {
    total_products: row.total_products || 0,
    out_of_stock_count: row.out_of_stock_count || 0,
    low_stock_count: row.low_stock_count || 0,
    in_stock_count: row.in_stock_count || 0,
    fill_rate: row.total_products > 0 ? ((row.in_stock_count / row.total_products) * 100).toFixed(2) : 0,
  };
};

/**
 * Get overall stock metrics summary
 * @param {number|string} businessId
 */
export const getStockMetrics = async (businessId) => {
  const query = `
    SELECT 
      COUNT(DISTINCT p.product_id) AS total_products,
      SUM(CASE WHEN COALESCE(i.total_quantity, 0) = 0 THEN 1 ELSE 0 END) AS out_of_stock_count,
      SUM(CASE WHEN COALESCE(i.total_quantity, 0) > 0 AND COALESCE(i.total_quantity, 0) <= 10 THEN 1 ELSE 0 END) AS low_stock_count,
      SUM(CASE WHEN COALESCE(i.total_quantity, 0) > 10 THEN 1 ELSE 0 END) AS in_stock_count,
      COALESCE(SUM(i.total_quantity), 0) AS total_inventory_units
    FROM product_table p
    LEFT JOIN inventory_table i ON i.product_id = p.product_id
    WHERE p.business_id = ?
  `;

  const [rows] = await pool.query(query, [businessId]);
  return rows[0] || {};
};

/**
 * Get products that are out of stock or low stock
 * @param {number|string} businessId
 */
export const getStockAlerts = async (businessId) => {
  const query = `
    SELECT 
      p.product_id,
      p.name AS product_name,
      pc.name AS category_name,
      COALESCE(i.total_quantity, 0) AS total_quantity,
      COALESCE(i.quantity, 0) AS quantity,
      CASE 
        WHEN COALESCE(i.total_quantity, 0) = 0 THEN 'out_of_stock'
        WHEN COALESCE(i.total_quantity, 0) <= 10 THEN 'low_stock'
        ELSE 'in_stock'
      END AS stock_status
    FROM product_table p
    LEFT JOIN inventory_table i ON i.product_id = p.product_id
    LEFT JOIN product_category_table pc ON pc.category_id = p.category_id
    WHERE p.business_id = ?
      AND COALESCE(i.total_quantity, 0) <= 10
    ORDER BY i.total_quantity ASC
  `;

  const [rows] = await pool.query(query, [businessId]);
  return rows;
};

/**
 * Get inventory turnover (COGS / Average Inventory)
 * Turnover = Total units sold / Average inventory
 * @param {number|string} businessId
 */
export const getInventoryTurnover = async (businessId) => {
  // Get total sold quantity
  const soldQuery = `
    SELECT 
      p.product_id,
      p.name AS ingredient_name,
      COALESCE(SUM(pit.quantity), 0) AS total_sold
    FROM product_table p
    LEFT JOIN purchase_items_table pit ON pit.product_id = p.product_id
    LEFT JOIN transaction_table t ON t.purchase_id = pit.purchase_id AND t.stat_id = 1 AND t.business_id = ?
    WHERE p.business_id = ?
    GROUP BY p.product_id, p.name
  `;

  // Get current inventory
  const inventoryQuery = `
    SELECT 
      p.product_id,
      p.name AS ingredient_name,
      COALESCE(i.total_quantity, 0) AS current_stock
    FROM product_table p
    LEFT JOIN inventory_table i ON i.product_id = p.product_id
    WHERE p.business_id = ?
  `;

  const [soldRows] = await pool.query(soldQuery, [businessId, businessId]);
  const [invRows] = await pool.query(inventoryQuery, [businessId]);

  // Merge data
  const productMap = new Map();
  
  invRows.forEach(row => {
    productMap.set(row.product_id, {
      product_id: row.product_id,
      ingredient_name: row.ingredient_name,
      current_stock: parseFloat(row.current_stock) || 0,
      total_sold: 0,
      avg_stock: 0,
      turnover_rate: 0,
    });
  });

  soldRows.forEach(row => {
    if (productMap.has(row.product_id)) {
      const prod = productMap.get(row.product_id);
      prod.total_sold = parseFloat(row.total_sold) || 0;
      // Avg stock approximation: (current + sold) / 2
      prod.avg_stock = (prod.current_stock + prod.total_sold) / 2;
      // Turnover = Sold / Avg Stock
      prod.turnover_rate = prod.avg_stock > 0 ? (prod.total_sold / prod.avg_stock) : 0;
    }
  });

  return Array.from(productMap.values())
    .filter(p => p.total_sold > 0 || p.current_stock > 0)
    .sort((a, b) => b.turnover_rate - a.turnover_rate);
};

/**
 * Get stock aging (how long items remain in stock)
 * Based on last stock-in date vs current date
 * @param {number|string} businessId
 */
export const getStockAging = async (businessId) => {
  const query = `
    SELECT 
      p.product_id,
      p.name AS ingredient_name,
      pc.name AS category_name,
      COALESCE(i.total_quantity, 0) AS current_stock,
      i.updated_at AS last_stock_update,
      DATEDIFF(NOW(), i.updated_at) AS days_since_update,
      latest_stockin.last_stockin_date AS last_restock_date,
      COALESCE(DATEDIFF(NOW(), latest_stockin.last_stockin_date), 999) AS days_since_last_restock
    FROM product_table p
    LEFT JOIN inventory_table i ON i.product_id = p.product_id
    LEFT JOIN product_category_table pc ON pc.category_id = p.category_id
    LEFT JOIN (
      SELECT 
        d.product_id,
        MAX(t.created_at) AS last_stockin_date
      FROM inventory_transaction_details d
      JOIN inventory_transactions t ON t.transaction_id = d.invent_transact_id
      WHERE t.transaction_type = 'purchase' AND d.qty_change > 0
      GROUP BY d.product_id
    ) latest_stockin ON latest_stockin.product_id = p.product_id
    WHERE p.business_id = ?
      AND COALESCE(i.total_quantity, 0) > 0
    ORDER BY 
      CASE WHEN latest_stockin.last_stockin_date IS NULL THEN 1 ELSE 0 END,
      days_since_last_restock DESC
  `;

  const [rows] = await pool.query(query, [businessId]);
  
  // Categorize by age
  return rows.map(row => ({
    ...row,
    days_since_last_restock: row.days_since_last_restock === 999 ? null : row.days_since_last_restock,
    age_category: 
      row.days_since_last_restock === 999 ? 'unknown' :
      row.days_since_last_restock <= 7 ? 'fresh' :
      row.days_since_last_restock <= 30 ? 'normal' :
      row.days_since_last_restock <= 90 ? 'aging' : 'old'
  }));
};

/**
 * Get stock aging summary
 * @param {number|string} businessId
 */
export const getStockAgingSummary = async (businessId) => {
  const query = `
    SELECT 
      COUNT(*) AS total_products,
      COUNT(CASE WHEN DATEDIFF(NOW(), latest_stockin.last_stockin_date) <= 7 THEN 1 END) AS fresh_count,
      COUNT(CASE WHEN DATEDIFF(NOW(), latest_stockin.last_stockin_date) BETWEEN 8 AND 30 THEN 1 END) AS normal_count,
      COUNT(CASE WHEN DATEDIFF(NOW(), latest_stockin.last_stockin_date) BETWEEN 31 AND 90 THEN 1 END) AS aging_count,
      COUNT(CASE WHEN DATEDIFF(NOW(), latest_stockin.last_stockin_date) > 90 THEN 1 END) AS old_count,
      COUNT(CASE WHEN latest_stockin.last_stockin_date IS NULL THEN 1 END) AS unknown_count
    FROM product_table p
    LEFT JOIN inventory_table i ON i.product_id = p.product_id
    LEFT JOIN (
      SELECT 
        d.product_id,
        MAX(t.created_at) AS last_stockin_date
      FROM inventory_transaction_details d
      JOIN inventory_transactions t ON t.transaction_id = d.invent_transact_id
      WHERE t.transaction_type = 'purchase' AND d.qty_change > 0
      GROUP BY d.product_id
    ) latest_stockin ON latest_stockin.product_id = p.product_id
    WHERE p.business_id = ?
      AND COALESCE(i.total_quantity, 0) > 0
  `;

  const [rows] = await pool.query(query, [businessId]);
  return rows[0] || { total_products: 0, fresh_count: 0, normal_count: 0, aging_count: 0, old_count: 0, unknown_count: 0 };
};

/**
 * Get category performance trends (this period vs last period)
 * @param {number|string} businessId
 */
export const getCategoryPerformanceTrends = async (businessId) => {
  const query = `
    SELECT 
      pc.category_id,
      pc.name AS category_name,
      -- Current period (last 30 days)
      COALESCE(SUM(CASE 
        WHEN t.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) 
        THEN pit.quantity * pit.price 
      END), 0) AS current_revenue,
      COALESCE(SUM(CASE 
        WHEN t.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) 
        THEN pit.quantity 
      END), 0) AS current_qty,
      -- Previous period (30-60 days ago)
      COALESCE(SUM(CASE 
        WHEN t.created_at >= DATE_SUB(CURDATE(), INTERVAL 60 DAY) 
          AND t.created_at < DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        THEN pit.quantity * pit.price 
      END), 0) AS previous_revenue,
      COALESCE(SUM(CASE 
        WHEN t.created_at >= DATE_SUB(CURDATE(), INTERVAL 60 DAY) 
          AND t.created_at < DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        THEN pit.quantity 
      END), 0) AS previous_qty
    FROM product_category_table pc
    LEFT JOIN product_table p ON p.category_id = pc.category_id AND p.business_id = ?
    LEFT JOIN purchase_items_table pit ON pit.product_id = p.product_id
    LEFT JOIN transaction_table t ON t.purchase_id = pit.purchase_id AND t.stat_id = 1
    WHERE pc.business_id = ?
    GROUP BY pc.category_id, pc.name
    ORDER BY current_revenue DESC
  `;

  const [rows] = await pool.query(query, [businessId, businessId]);
  
  return rows.map(row => {
    const currentRev = parseFloat(row.current_revenue) || 0;
    const previousRev = parseFloat(row.previous_revenue) || 0;
    const change = previousRev > 0 ? ((currentRev - previousRev) / previousRev * 100) : (currentRev > 0 ? 100 : 0);
    
    let trend = 'stable';
    if (change > 10) trend = 'growing';
    else if (change < -10) trend = 'declining';
    
    return {
      category_id: row.category_id,
      category_name: row.category_name,
      // Current names for frontend compatibility
      this_month_revenue: currentRev,
      last_month_revenue: previousRev,
      this_month_orders: parseFloat(row.current_qty) || 0,
      last_month_orders: parseFloat(row.previous_qty) || 0,
      // Also include original names
      current_revenue: currentRev,
      previous_revenue: previousRev,
      current_qty: parseFloat(row.current_qty) || 0,
      previous_qty: parseFloat(row.previous_qty) || 0,
      // Growth metrics
      growth_rate: parseFloat(change.toFixed(1)),
      revenue_change_percent: change.toFixed(1),
      trend,
    };
  });
};

/**
 * Get product lifecycle stages
 * New (< 14 days), Growing (sales increasing), Peak (high stable), Declining (sales decreasing), Stagnant (no recent sales)
 * @param {number|string} businessId
 */
export const getProductLifecycle = async (businessId) => {
  const query = `
    SELECT 
      p.product_id,
      p.name AS product_name,
      pc.name AS category_name,
      p.created_at AS product_created,
      DATEDIFF(NOW(), p.created_at) AS days_since_created,
      -- Last 14 days sales
      COALESCE(SUM(CASE 
        WHEN pu.purchase_date >= DATE_SUB(CURDATE(), INTERVAL 14 DAY) 
        THEN pi.quantity 
      END), 0) AS recent_sales,
      -- 14-28 days ago sales
      COALESCE(SUM(CASE 
        WHEN pu.purchase_date >= DATE_SUB(CURDATE(), INTERVAL 28 DAY) 
          AND pu.purchase_date < DATE_SUB(CURDATE(), INTERVAL 14 DAY)
        THEN pi.quantity 
      END), 0) AS previous_sales,
      -- Total all-time sales
      COALESCE(SUM(pi.quantity), 0) AS total_sold
    FROM product_table p
    LEFT JOIN product_category_table pc ON pc.category_id = p.category_id
    LEFT JOIN purchase_items_table pi ON pi.product_id = p.product_id
    LEFT JOIN purchases_table pu ON pu.purchase_id = pi.purchase_id AND pu.status_id != 3
    WHERE p.business_id = ?
    GROUP BY p.product_id, p.name, pc.name, p.created_at
    HAVING total_sold > 0
    ORDER BY recent_sales DESC
  `;

  const [rows] = await pool.query(query, [businessId]);
  
  return rows.map(row => {
    const daysSinceCreated = row.days_since_created || 0;
    const recentSales = parseFloat(row.recent_sales) || 0;
    const previousSales = parseFloat(row.previous_sales) || 0;
    const totalSold = parseFloat(row.total_sold) || 0;
    
    // Calculate average daily sales
    const avgDailySales = daysSinceCreated > 0 ? totalSold / daysSinceCreated : 0;
    
    // Calculate recent trend (last 14 days avg - previous 14 days avg)
    const recentAvg = recentSales / 14;
    const previousAvg = previousSales / 14;
    const recentTrend = recentAvg - previousAvg;
    
    let lifecycle_stage = 'stagnant';
    
    if (daysSinceCreated <= 14) {
      lifecycle_stage = 'new';
    } else if (recentSales === 0 && previousSales === 0 && totalSold <= 5) {
      lifecycle_stage = 'stagnant';
    } else if (recentSales > previousSales * 1.2) {
      lifecycle_stage = 'growing';
    } else if (recentSales < previousSales * 0.8 && previousSales > 0) {
      lifecycle_stage = 'declining';
    } else if (recentSales > 0) {
      lifecycle_stage = 'peak';
    }
    
    return {
      product_id: row.product_id,
      product_name: row.product_name,
      category_name: row.category_name || 'Uncategorized',
      days_since_created: daysSinceCreated,
      total_sold: totalSold,
      avg_daily_sales: avgDailySales,
      recent_trend: recentTrend,
      lifecycle_stage,
    };
  });
};

/**
 * Get stock replenishment performance metrics
 * @param {number|string} businessId
 */
export const getReplenishmentPerformance = async (businessId) => {
  const query = `
    SELECT 
      p.product_id,
      p.name AS product_name,
      COALESCE(i.total_quantity, 0) AS current_stock,
      -- Count of restocks (purchase transactions)
      COUNT(DISTINCT CASE WHEN t.transaction_type = 'purchase' AND d.qty_change > 0 THEN t.transaction_id END) AS restock_count,
      -- Average days between restocks
      MIN(t.created_at) AS first_restock,
      MAX(t.created_at) AS last_restock,
      -- Count stockout events (when qty went to 0 or below)
      COUNT(DISTINCT CASE WHEN d.qty_change < 0 AND d.qty_after <= 0 THEN t.transaction_id END) AS stockout_events
    FROM product_table p
    LEFT JOIN inventory_table i ON i.product_id = p.product_id
    LEFT JOIN inventory_transaction_details d ON d.product_id = p.product_id
    LEFT JOIN inventory_transactions t ON t.transaction_id = d.invent_transact_id
    WHERE p.business_id = ?
    GROUP BY p.product_id, p.name, i.total_quantity
    HAVING restock_count > 0
    ORDER BY restock_count DESC
  `;

  const [rows] = await pool.query(query, [businessId]);
  
  return rows.map(row => {
    const restockCount = parseInt(row.restock_count) || 0;
    const firstRestock = row.first_restock ? new Date(row.first_restock) : null;
    const lastRestock = row.last_restock ? new Date(row.last_restock) : null;
    
    let avgDaysBetweenRestocks = null;
    if (firstRestock && lastRestock && restockCount > 1) {
      const daysDiff = (lastRestock - firstRestock) / (1000 * 60 * 60 * 24);
      avgDaysBetweenRestocks = (daysDiff / (restockCount - 1)).toFixed(1);
    }
    
    const stockoutEvents = parseInt(row.stockout_events) || 0;
    
    // Performance rating
    let performance = 'good';
    if (stockoutEvents > 3) performance = 'poor';
    else if (stockoutEvents > 0) performance = 'fair';
    
    // Calculate days since last restock
    let daysSinceLastRestock = null;
    if (lastRestock) {
      daysSinceLastRestock = Math.floor((new Date() - lastRestock) / (1000 * 60 * 60 * 24));
    }

    return {
      product_id: row.product_id,
      product_name: row.product_name,
      ingredient_name: row.product_name, // alias for frontend
      current_stock: parseFloat(row.current_stock) || 0,
      restock_count: restockCount,
      total_restocks: restockCount, // alias for frontend
      avg_days_between_restocks: avgDaysBetweenRestocks,
      stockout_events: stockoutEvents,
      total_stockouts: stockoutEvents, // alias for frontend
      last_restock: lastRestock,
      last_restock_date: lastRestock, // alias for frontend
      days_since_last_restock: daysSinceLastRestock,
      performance,
    };
  });
};

// ==================== SEGMENTATION ANALYTICS ====================

/**
 * Basket Size Segmentation - Classify transactions by item count
 * Small: 1-2 items, Medium: 3-5 items, Large: 6+ items
 * @param {number|string} businessId
 * @param {string} startDate
 * @param {string} endDate
 */
export const getBasketSizeSegmentation = async (businessId, startDate, endDate) => {
  let query = `
    SELECT 
      CASE 
        WHEN item_count <= 2 THEN 'small'
        WHEN item_count <= 5 THEN 'medium'
        ELSE 'large'
      END AS basket_size,
      COUNT(*) AS transaction_count,
      SUM(total_amount) AS total_revenue,
      AVG(total_amount) AS avg_transaction_value,
      AVG(item_count) AS avg_items_per_basket
    FROM (
      SELECT 
        t.transaction_id,
        COUNT(pit.purchase_item_id) AS item_count,
        SUM(pit.quantity * pit.price) AS total_amount
      FROM transaction_table t
      JOIN purchase_items_table pit ON pit.purchase_id = t.purchase_id
      WHERE t.stat_id = 1 AND t.business_id = ?
  `;
  const params = [businessId];

  if (startDate) {
    query += ' AND DATE(t.created_at) >= ?';
    params.push(startDate);
  }
  if (endDate) {
    query += ' AND DATE(t.created_at) <= ?';
    params.push(endDate);
  }

  query += `
      GROUP BY t.transaction_id
    ) AS baskets
    GROUP BY basket_size
    ORDER BY FIELD(basket_size, 'small', 'medium', 'large')
  `;

  const [rows] = await pool.query(query, params);
  
  // Calculate percentages
  const total = rows.reduce((sum, r) => sum + parseInt(r.transaction_count), 0);
  return rows.map(row => ({
    ...row,
    percentage: total > 0 ? ((row.transaction_count / total) * 100).toFixed(1) : 0,
  }));
};

/**
 * Basket Value Segmentation - Classify by spend amount
 * Uses percentile-based thresholds dynamically calculated
 * @param {number|string} businessId
 * @param {string} startDate
 * @param {string} endDate
 */
export const getBasketValueSegmentation = async (businessId, startDate, endDate) => {
  // First, get the percentile thresholds
  let thresholdQuery = `
    SELECT 
      PERCENTILE_CONT(0.33) WITHIN GROUP (ORDER BY total_amount) AS p33,
      PERCENTILE_CONT(0.66) WITHIN GROUP (ORDER BY total_amount) AS p66
    FROM (
      SELECT SUM(pit.quantity * pit.price) AS total_amount
      FROM transaction_table t
      JOIN purchase_items_table pit ON pit.purchase_id = t.purchase_id
      WHERE t.stat_id = 1 AND t.business_id = ?
  `;
  
  // MySQL doesn't have PERCENTILE_CONT, so we'll use a simpler approach
  let query = `
    SELECT 
      CASE 
        WHEN total_amount <= 100 THEN 'low'
        WHEN total_amount <= 500 THEN 'medium'
        ELSE 'high'
      END AS spend_segment,
      COUNT(*) AS transaction_count,
      SUM(total_amount) AS total_revenue,
      AVG(total_amount) AS avg_transaction_value,
      MIN(total_amount) AS min_spend,
      MAX(total_amount) AS max_spend
    FROM (
      SELECT 
        t.transaction_id,
        SUM(pit.quantity * pit.price) AS total_amount
      FROM transaction_table t
      JOIN purchase_items_table pit ON pit.purchase_id = t.purchase_id
      WHERE t.stat_id = 1 AND t.business_id = ?
  `;
  const params = [businessId];

  if (startDate) {
    query += ' AND DATE(t.created_at) >= ?';
    params.push(startDate);
  }
  if (endDate) {
    query += ' AND DATE(t.created_at) <= ?';
    params.push(endDate);
  }

  query += `
      GROUP BY t.transaction_id
    ) AS baskets
    GROUP BY spend_segment
    ORDER BY FIELD(spend_segment, 'low', 'medium', 'high')
  `;

  const [rows] = await pool.query(query, params);
  
  const total = rows.reduce((sum, r) => sum + parseInt(r.transaction_count), 0);
  return rows.map(row => ({
    ...row,
    percentage: total > 0 ? ((row.transaction_count / total) * 100).toFixed(1) : 0,
  }));
};

/**
 * Time-based Segmentation - Morning/Afternoon/Evening patterns
 * Morning: 6-11, Afternoon: 12-17, Evening: 18-23, Night: 0-5
 * @param {number|string} businessId
 * @param {string} startDate
 * @param {string} endDate
 */
export const getTimeBasedSegmentation = async (businessId, startDate, endDate) => {
  let query = `
    SELECT 
      CASE 
        WHEN HOUR(t.created_at) >= 6 AND HOUR(t.created_at) < 12 THEN 'morning'
        WHEN HOUR(t.created_at) >= 12 AND HOUR(t.created_at) < 18 THEN 'afternoon'
        WHEN HOUR(t.created_at) >= 18 AND HOUR(t.created_at) < 24 THEN 'evening'
        ELSE 'night'
      END AS time_segment,
      COUNT(DISTINCT t.transaction_id) AS transaction_count,
      SUM(pit.quantity * pit.price) AS total_revenue,
      AVG(pit.quantity * pit.price) AS avg_item_value,
      SUM(pit.quantity) AS total_items_sold
    FROM transaction_table t
    JOIN purchase_items_table pit ON pit.purchase_id = t.purchase_id
    WHERE t.stat_id = 1 AND t.business_id = ?
  `;
  const params = [businessId];

  if (startDate) {
    query += ' AND DATE(t.created_at) >= ?';
    params.push(startDate);
  }
  if (endDate) {
    query += ' AND DATE(t.created_at) <= ?';
    params.push(endDate);
  }

  query += `
    GROUP BY time_segment
    ORDER BY FIELD(time_segment, 'morning', 'afternoon', 'evening', 'night')
  `;

  const [rows] = await pool.query(query, params);
  
  const total = rows.reduce((sum, r) => sum + parseInt(r.transaction_count), 0);
  const peakSegment = rows.reduce((max, r) => 
    parseInt(r.transaction_count) > parseInt(max.transaction_count || 0) ? r : max
  , {});

  return {
    segments: rows.map(row => ({
      ...row,
      percentage: total > 0 ? ((row.transaction_count / total) * 100).toFixed(1) : 0,
      is_peak: row.time_segment === peakSegment.time_segment,
    })),
    peak_time: peakSegment.time_segment,
    total_transactions: total,
  };
};

/**
 * Category-based Customer Segmentation
 * Identifies what category dominates each transaction
 * @param {number|string} businessId
 * @param {string} startDate
 * @param {string} endDate
 */
export const getCategoryBasedSegmentation = async (businessId, startDate, endDate) => {
  let query = `
    SELECT 
      pc.name AS primary_category,
      COUNT(DISTINCT t.transaction_id) AS transaction_count,
      SUM(pit.quantity * pit.price) AS total_revenue,
      AVG(pit.quantity * pit.price) AS avg_spend_in_category,
      SUM(pit.quantity) AS total_items
    FROM transaction_table t
    JOIN purchase_items_table pit ON pit.purchase_id = t.purchase_id
    JOIN product_table p ON p.product_id = pit.product_id
    LEFT JOIN product_category_table pc ON pc.category_id = p.category_id
    WHERE t.stat_id = 1 AND t.business_id = ?
  `;
  const params = [businessId];

  if (startDate) {
    query += ' AND DATE(t.created_at) >= ?';
    params.push(startDate);
  }
  if (endDate) {
    query += ' AND DATE(t.created_at) <= ?';
    params.push(endDate);
  }

  query += `
    GROUP BY pc.category_id, pc.name
    ORDER BY total_revenue DESC
  `;

  const [rows] = await pool.query(query, params);
  
  const totalRevenue = rows.reduce((sum, r) => sum + parseFloat(r.total_revenue || 0), 0);
  return rows.map(row => ({
    ...row,
    revenue_share: totalRevenue > 0 ? ((parseFloat(row.total_revenue) / totalRevenue) * 100).toFixed(1) : 0,
    category_name: row.primary_category || 'Uncategorized',
  }));
};

// ==================== MARKET BASKET ANALYSIS ====================

/**
 * Product Affinity Analysis (Market Basket Analysis)
 * Find products frequently bought together
 * @param {number|string} businessId
 * @param {number} minSupport - Minimum number of co-occurrences
 */
export const getProductAffinityAnalysis = async (businessId, minSupport = 2) => {
  // Find product pairs that appear together in transactions
  const query = `
    SELECT 
      p1.product_id AS product_a_id,
      p1.name AS product_a,
      p2.product_id AS product_b_id,
      p2.name AS product_b,
      COUNT(DISTINCT t.transaction_id) AS co_occurrence_count,
      -- Calculate support (how often pair appears / total transactions)
      COUNT(DISTINCT t.transaction_id) / (
        SELECT COUNT(DISTINCT transaction_id) 
        FROM transaction_table 
        WHERE stat_id = 1 AND business_id = ?
      ) * 100 AS support_percent,
      -- Calculate confidence (P(B|A) = P(A and B) / P(A))
      COUNT(DISTINCT t.transaction_id) / (
        SELECT COUNT(DISTINCT t2.transaction_id)
        FROM transaction_table t2
        JOIN purchase_items_table pit2 ON pit2.purchase_id = t2.purchase_id
        WHERE t2.stat_id = 1 AND t2.business_id = ? AND pit2.product_id = p1.product_id
      ) * 100 AS confidence_a_to_b
    FROM transaction_table t
    JOIN purchase_items_table pit1 ON pit1.purchase_id = t.purchase_id
    JOIN purchase_items_table pit2 ON pit2.purchase_id = t.purchase_id AND pit2.product_id > pit1.product_id
    JOIN product_table p1 ON p1.product_id = pit1.product_id
    JOIN product_table p2 ON p2.product_id = pit2.product_id
    WHERE t.stat_id = 1 AND t.business_id = ?
    GROUP BY p1.product_id, p1.name, p2.product_id, p2.name
    HAVING co_occurrence_count >= ?
    ORDER BY co_occurrence_count DESC, confidence_a_to_b DESC
    LIMIT 20
  `;

  const [rows] = await pool.query(query, [businessId, businessId, businessId, minSupport]);
  
  return rows.map(row => ({
    ...row,
    recommendation: `Customers who buy "${row.product_a}" also buy "${row.product_b}" (${parseFloat(row.confidence_a_to_b).toFixed(1)}% of the time)`,
  }));
};

/**
 * Get frequently bought together products for a specific product
 * @param {number|string} businessId
 * @param {number} productId
 */
export const getFrequentlyBoughtTogether = async (businessId, productId) => {
  const query = `
    SELECT 
      p2.product_id,
      p2.name AS product_name,
      pc.name AS category_name,
      COUNT(DISTINCT t.transaction_id) AS times_bought_together,
      (
        SELECT COUNT(DISTINCT t3.transaction_id)
        FROM transaction_table t3
        JOIN purchase_items_table pit3 ON pit3.purchase_id = t3.purchase_id
        WHERE t3.stat_id = 1 AND t3.business_id = ? AND pit3.product_id = ?
      ) AS total_transactions_with_product,
      COUNT(DISTINCT t.transaction_id) / (
        SELECT COUNT(DISTINCT t3.transaction_id)
        FROM transaction_table t3
        JOIN purchase_items_table pit3 ON pit3.purchase_id = t3.purchase_id
        WHERE t3.stat_id = 1 AND t3.business_id = ? AND pit3.product_id = ?
      ) * 100 AS affinity_score
    FROM transaction_table t
    JOIN purchase_items_table pit1 ON pit1.purchase_id = t.purchase_id AND pit1.product_id = ?
    JOIN purchase_items_table pit2 ON pit2.purchase_id = t.purchase_id AND pit2.product_id != ?
    JOIN product_table p2 ON p2.product_id = pit2.product_id
    LEFT JOIN product_category_table pc ON pc.category_id = p2.category_id
    WHERE t.stat_id = 1 AND t.business_id = ?
    GROUP BY p2.product_id, p2.name, pc.name
    ORDER BY times_bought_together DESC
    LIMIT 10
  `;

  const [rows] = await pool.query(query, [businessId, productId, businessId, productId, productId, productId, businessId]);
  return rows;
};

// ==================== FORECASTING ====================

/**
 * Sales Forecasting - Simple moving average and trend analysis
 * @param {number|string} businessId
 * @param {number} daysHistory - Days of history to analyze
 */
export const getSalesForecast = async (businessId, daysHistory = 30) => {
  // Get daily sales for the period
  const query = `
    SELECT 
      DATE(t.created_at) AS sale_date,
      COUNT(DISTINCT t.transaction_id) AS transaction_count,
      SUM(pit.quantity * pit.price) AS daily_revenue,
      SUM(pit.quantity) AS items_sold,
      DAYOFWEEK(t.created_at) AS day_of_week
    FROM transaction_table t
    JOIN purchase_items_table pit ON pit.purchase_id = t.purchase_id
    WHERE t.stat_id = 1 
      AND t.business_id = ?
      AND t.created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
    GROUP BY DATE(t.created_at), DAYOFWEEK(t.created_at)
    ORDER BY sale_date ASC
  `;

  const [rows] = await pool.query(query, [businessId, daysHistory]);
  
  if (rows.length < 7) {
    return { forecast: null, message: 'Insufficient data for forecasting. Need at least 7 days of sales.' };
  }

  // Calculate metrics
  const revenues = rows.map(r => parseFloat(r.daily_revenue));
  const avgRevenue = revenues.reduce((a, b) => a + b, 0) / revenues.length;
  
  // Calculate 7-day moving average for recent trend
  const last7 = revenues.slice(-7);
  const movingAvg7 = last7.reduce((a, b) => a + b, 0) / 7;
  
  // Day of week averages for pattern
  const dayOfWeekAvg = {};
  rows.forEach(row => {
    const dow = row.day_of_week;
    if (!dayOfWeekAvg[dow]) dayOfWeekAvg[dow] = { total: 0, count: 0 };
    dayOfWeekAvg[dow].total += parseFloat(row.daily_revenue);
    dayOfWeekAvg[dow].count++;
  });

  const dayNames = ['', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const forecastByDay = Object.entries(dayOfWeekAvg).map(([dow, data]) => ({
    day_of_week: parseInt(dow),
    day_name: dayNames[parseInt(dow)],
    expected_revenue: (data.total / data.count).toFixed(2),
  }));

  // Simple trend (last 7 vs previous 7)
  const prev7 = revenues.slice(-14, -7);
  const prev7Avg = prev7.length > 0 ? prev7.reduce((a, b) => a + b, 0) / prev7.length : movingAvg7;
  const trendPercent = prev7Avg > 0 ? ((movingAvg7 - prev7Avg) / prev7Avg * 100) : 0;

  // Forecast next 7 days
  const today = new Date();
  const next7Days = [];
  for (let i = 1; i <= 7; i++) {
    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + i);
    const dow = futureDate.getDay() + 1; // MySQL DAYOFWEEK is 1-7 (Sun-Sat)
    const dayForecast = forecastByDay.find(f => f.day_of_week === dow);
    next7Days.push({
      date: futureDate.toISOString().split('T')[0],
      day_name: dayNames[dow],
      forecasted_revenue: dayForecast ? parseFloat(dayForecast.expected_revenue) : avgRevenue,
    });
  }

  return {
    history: rows,
    metrics: {
      avg_daily_revenue: avgRevenue.toFixed(2),
      moving_avg_7day: movingAvg7.toFixed(2),
      trend_percent: trendPercent.toFixed(1),
      trend_direction: trendPercent > 5 ? 'up' : trendPercent < -5 ? 'down' : 'stable',
    },
    forecast_by_day: forecastByDay.sort((a, b) => a.day_of_week - b.day_of_week),
    next_7_days: next7Days,
  };
};

/**
 * Category Demand Forecasting
 * @param {number|string} businessId
 */
export const getCategoryDemandForecast = async (businessId) => {
  const query = `
    SELECT 
      pc.category_id,
      pc.name AS category_name,
      DATE(t.created_at) AS sale_date,
      SUM(pit.quantity) AS qty_sold,
      SUM(pit.quantity * pit.price) AS revenue
    FROM transaction_table t
    JOIN purchase_items_table pit ON pit.purchase_id = t.purchase_id
    JOIN product_table p ON p.product_id = pit.product_id
    LEFT JOIN product_category_table pc ON pc.category_id = p.category_id
    WHERE t.stat_id = 1 
      AND t.business_id = ?
      AND t.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    GROUP BY pc.category_id, pc.name, DATE(t.created_at)
    ORDER BY pc.category_id, sale_date
  `;

  const [rows] = await pool.query(query, [businessId]);

  // Group by category and calculate forecasts
  const categoryData = {};
  rows.forEach(row => {
    const cat = row.category_name || 'Uncategorized';
    if (!categoryData[cat]) {
      categoryData[cat] = { category_id: row.category_id, daily_sales: [] };
    }
    categoryData[cat].daily_sales.push({
      date: row.sale_date,
      qty: parseFloat(row.qty_sold),
      revenue: parseFloat(row.revenue),
    });
  });

  return Object.entries(categoryData).map(([catName, data]) => {
    const qtys = data.daily_sales.map(d => d.qty);
    const avgQty = qtys.reduce((a, b) => a + b, 0) / qtys.length;
    const last7Qty = qtys.slice(-7);
    const recentAvg = last7Qty.length > 0 ? last7Qty.reduce((a, b) => a + b, 0) / last7Qty.length : avgQty;
    
    return {
      category_id: data.category_id,
      category_name: catName,
      avg_daily_demand: avgQty.toFixed(1),
      recent_daily_demand: recentAvg.toFixed(1),
      trend: recentAvg > avgQty * 1.1 ? 'increasing' : recentAvg < avgQty * 0.9 ? 'decreasing' : 'stable',
      forecasted_weekly_demand: (recentAvg * 7).toFixed(0),
    };
  });
};

/**
 * Stock-out Prediction
 * Predict when products will run out based on consumption rate
 * @param {number|string} businessId
 */
export const getStockoutPrediction = async (businessId) => {
  const query = `
    SELECT 
      p.product_id,
      p.name AS product_name,
      COALESCE(i.total_quantity, 0) AS current_stock,
      COALESCE(
        (SELECT SUM(pit2.quantity) / COUNT(DISTINCT DATE(t2.created_at))
         FROM transaction_table t2
         JOIN purchase_items_table pit2 ON pit2.purchase_id = t2.purchase_id
         WHERE t2.stat_id = 1 AND t2.business_id = ? AND pit2.product_id = p.product_id
           AND t2.created_at >= DATE_SUB(CURDATE(), INTERVAL 14 DAY)
        ), 0
      ) AS avg_daily_consumption
    FROM product_table p
    LEFT JOIN inventory_table i ON i.product_id = p.product_id
    WHERE p.business_id = ? AND p.is_active = 1
    ORDER BY current_stock / NULLIF(avg_daily_consumption, 0) ASC
  `;

  const [rows] = await pool.query(query, [businessId, businessId]);

  return rows.map(row => {
    const stock = parseFloat(row.current_stock) || 0;
    const consumption = parseFloat(row.avg_daily_consumption) || 0;
    const daysUntilStockout = consumption > 0 ? Math.floor(stock / consumption) : null;
    
    let urgency = 'safe';
    if (daysUntilStockout !== null) {
      if (daysUntilStockout <= 3) urgency = 'critical';
      else if (daysUntilStockout <= 7) urgency = 'warning';
      else if (daysUntilStockout <= 14) urgency = 'monitor';
    }

    return {
      product_id: row.product_id,
      product_name: row.product_name,
      current_stock: stock,
      avg_daily_consumption: consumption.toFixed(2),
      days_until_stockout: daysUntilStockout,
      predicted_stockout_date: daysUntilStockout !== null 
        ? new Date(Date.now() + daysUntilStockout * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        : null,
      urgency,
      needs_reorder: daysUntilStockout !== null && daysUntilStockout <= 7,
    };
  }).filter(r => r.avg_daily_consumption > 0); // Only show products that are selling
};

/**
 * Reorder Point Alerts
 * Products that need to be reordered based on consumption and lead time
 * @param {number|string} businessId
 * @param {number} defaultLeadTime - Default lead time in days if not set per product
 */
export const getReorderAlerts = async (businessId, defaultLeadTime = 3) => {
  const predictions = await getStockoutPrediction(businessId);
  
  return predictions
    .filter(p => p.needs_reorder || p.urgency === 'critical' || p.urgency === 'warning')
    .map(p => ({
      ...p,
      recommended_order_qty: Math.ceil(parseFloat(p.avg_daily_consumption) * 14), // 2 weeks supply
      alert_message: p.urgency === 'critical' 
        ? `URGENT: ${p.product_name} will run out in ${p.days_until_stockout} days!`
        : p.urgency === 'warning'
        ? `WARNING: ${p.product_name} running low - ${p.days_until_stockout} days remaining`
        : `Reorder soon: ${p.product_name} below reorder level`,
    }));
};

// ==================== PRODUCT RECOMMENDATIONS ====================

/**
 * Get product recommendations based on association rules
 * @param {number|string} businessId
 * @param {number[]} cartProductIds - Products currently in cart
 */
export const getProductRecommendations = async (businessId, cartProductIds = []) => {
  if (!cartProductIds.length) {
    // Return top sellers if no cart context
    const query = `
      SELECT 
        p.product_id,
        p.name AS product_name,
        pc.name AS category_name,
        SUM(pit.quantity) AS total_sold,
        COUNT(DISTINCT t.transaction_id) AS transaction_count
      FROM transaction_table t
      JOIN purchase_items_table pit ON pit.purchase_id = t.purchase_id
      JOIN product_table p ON p.product_id = pit.product_id
      LEFT JOIN product_category_table pc ON pc.category_id = p.category_id
      WHERE t.stat_id = 1 AND t.business_id = ?
        AND t.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      GROUP BY p.product_id, p.name, pc.name
      ORDER BY total_sold DESC
      LIMIT 5
    `;
    const [rows] = await pool.query(query, [businessId]);
    return rows.map(r => ({ ...r, recommendation_type: 'popular' }));
  }

  // Find products frequently bought with items in cart
  const placeholders = cartProductIds.map(() => '?').join(',');
  const query = `
    SELECT 
      p2.product_id,
      p2.name AS product_name,
      pc.name AS category_name,
      COUNT(DISTINCT t.transaction_id) AS co_occurrence_count,
      'frequently_bought_together' AS recommendation_type
    FROM transaction_table t
    JOIN purchase_items_table pit1 ON pit1.purchase_id = t.purchase_id
    JOIN purchase_items_table pit2 ON pit2.purchase_id = t.purchase_id
    JOIN product_table p2 ON p2.product_id = pit2.product_id
    LEFT JOIN product_category_table pc ON pc.category_id = p2.category_id
    WHERE t.stat_id = 1 
      AND t.business_id = ?
      AND pit1.product_id IN (${placeholders})
      AND pit2.product_id NOT IN (${placeholders})
    GROUP BY p2.product_id, p2.name, pc.name
    ORDER BY co_occurrence_count DESC
    LIMIT 5
  `;

  const [rows] = await pool.query(query, [businessId, ...cartProductIds, ...cartProductIds]);
  return rows;
};

export default {
  getSalesTrendByCategory,
  getProfitByCategory,
  getIngredientConsumption,
  getBusinessSummary,
  getTopSellingProducts,
  getSalesByDateRange,
  getHourlySalesDistribution,
  getSlowestMovingProducts,
  getSalesKPISummary,
  getSalesByCategory,
  getSalesByProduct,
  getTransactionDurationStats,
  getCancelledTransactions,
  getStockOutMetrics,
  getStockMetrics,
  getStockAlerts,
  getInventoryTurnover,
  getStockAging,
  getStockAgingSummary,
  getCategoryPerformanceTrends,
  getProductLifecycle,
  getReplenishmentPerformance,
  // Segmentation
  getBasketSizeSegmentation,
  getBasketValueSegmentation,
  getTimeBasedSegmentation,
  getCategoryBasedSegmentation,
  // Market Basket Analysis
  getProductAffinityAnalysis,
  getFrequentlyBoughtTogether,
  // Forecasting
  getSalesForecast,
  getCategoryDemandForecast,
  getStockoutPrediction,
  getReorderAlerts,
  // Recommendations
  getProductRecommendations,
};
