// models/forecast-data-model.js
import pool from '../config/pool.js';

/**
 * Get daily revenue history for a business
 * Used for revenue forecasting
 */
export const getDailyRevenueHistory = async (businessId, days = 30) => {
  const query = `
    WITH RECURSIVE date_range AS (
      SELECT DATE_SUB(CURDATE(), INTERVAL ? DAY) as date
      UNION ALL
      SELECT DATE_ADD(date, INTERVAL 1 DAY)
      FROM date_range
      WHERE date < CURDATE()
    ),
    daily_revenue AS (
      SELECT 
        DATE(p.purchase_date) as sale_date,
        SUM(p.total_amount) as daily_total
      FROM purchases_table p
      JOIN business_user_position_table bup ON p.user_id = bup.user_id
      WHERE bup.business_id = ?
      AND p.status_id != 3
      AND p.purchase_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY DATE(p.purchase_date)
    )
    SELECT 
      dr.date,
      COALESCE(rev.daily_total, 0) as value
    FROM date_range dr
    LEFT JOIN daily_revenue rev ON dr.date = rev.sale_date
    ORDER BY dr.date ASC
  `;
  
  const [rows] = await pool.query(query, [days - 1, businessId, days]);
  return rows.map(row => ({
    date: row.date.toISOString().split('T')[0],
    value: parseFloat(row.value)
  }));
};

/**
 * Get category sales history for demand forecasting
 */
export const getCategorySalesHistory = async (businessId, categoryId, days = 30) => {
  const query = `
    WITH RECURSIVE date_range AS (
      SELECT DATE_SUB(CURDATE(), INTERVAL ? DAY) as date
      UNION ALL
      SELECT DATE_ADD(date, INTERVAL 1 DAY)
      FROM date_range
      WHERE date < CURDATE()
    ),
    category_sales AS (
      SELECT 
        DATE(pu.purchase_date) as sale_date,
        SUM(pi.quantity) as daily_total
      FROM purchases_table pu
      JOIN purchase_items_table pi ON pu.purchase_id = pi.purchase_id
      JOIN product_table p ON pi.product_id = p.product_id
      WHERE p.business_id = ?
      AND p.category_id = ?
      AND pu.status_id != 3
      AND pu.purchase_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY DATE(pu.purchase_date)
    )
    SELECT 
      dr.date,
      COALESCE(cs.daily_total, 0) as value
    FROM date_range dr
    LEFT JOIN category_sales cs ON dr.date = cs.sale_date
    ORDER BY dr.date ASC
  `;
  
  const [rows] = await pool.query(query, [days - 1, businessId, categoryId, days]);
  return rows.map(row => ({
    date: row.date.toISOString().split('T')[0],
    value: parseFloat(row.value)
  }));
};

/**
 * Get product usage history for ingredient forecasting
 */
export const getProductUsageHistory = async (businessId, productId, days = 30) => {
  const query = `
    SELECT 
      DATE(pu.purchase_date) as date,
      SUM(pi.quantity) as value
    FROM purchases_table pu
    JOIN purchase_items_table pi ON pu.purchase_id = pi.purchase_id
    WHERE pi.product_id = ?
    AND pu.status_id != 3
    AND pu.purchase_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
    GROUP BY DATE(pu.purchase_date)
    ORDER BY date ASC
  `;
  
  const [rows] = await pool.query(query, [productId, days]);
  return rows.map(row => ({
    date: row.date.toISOString().split('T')[0],
    value: parseFloat(row.value)
  }));
};

/**
 * Get inventory items with low stock for reorder alerts
 */
export const getInventoryForReorderAlerts = async (businessId) => {
  const query = `
    SELECT 
      i.inventory_id,
      i.product_id,
      p.name as product_name,
      i.total_quantity as current_stock,
      COALESCE(
        (SELECT SUM(pi.quantity) / COUNT(DISTINCT DATE(pu.purchase_date))
         FROM purchase_items_table pi
         JOIN purchases_table pu ON pi.purchase_id = pu.purchase_id
         WHERE pi.product_id = p.product_id
         AND pu.purchase_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
         AND pu.status_id != 3
        ), 0
      ) as avg_daily_usage
    FROM inventory_table i
    JOIN product_table p ON i.product_id = p.product_id
    WHERE p.business_id = ?
    AND p.is_active = 1
    HAVING avg_daily_usage > 0
    ORDER BY (current_stock / NULLIF(avg_daily_usage, 0)) ASC
    LIMIT 20
  `;
  
  const [rows] = await pool.query(query, [businessId]);
  return rows;
};

/**
 * Get all active categories for a business
 */
export const getActiveCategories = async (businessId) => {
  const query = `
    SELECT 
      category_id,
      name
    FROM product_category_table
    WHERE business_id = ?
    ORDER BY name ASC
  `;
  
  const [rows] = await pool.query(query, [businessId]);
  return rows;
};

/**
 * Get all active products for a business
 */
export const getActiveProducts = async (businessId, limit = 20) => {
  const query = `
    SELECT 
      p.product_id,
      p.name,
      i.total_quantity as current_stock
    FROM product_table p
    LEFT JOIN inventory_table i ON p.product_id = i.product_id
    WHERE p.business_id = ?
    AND p.is_active = 1
    ORDER BY p.name ASC
    LIMIT ?
  `;
  
  const [rows] = await pool.query(query, [businessId, limit]);
  return rows;
};

export default {
  getDailyRevenueHistory,
  getCategorySalesHistory,
  getProductUsageHistory,
  getInventoryForReorderAlerts,
  getActiveCategories,
  getActiveProducts
};
