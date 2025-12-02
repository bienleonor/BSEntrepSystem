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

export default {
  getSalesTrendByCategory,
  getProfitByCategory,
  getIngredientConsumption,
  getBusinessSummary,
  getTopSellingProducts,
  getSalesByDateRange,
  getHourlySalesDistribution,
};
