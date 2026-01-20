// services/analysisApi.js
import axiosInstance from '../utils/axiosInstance';

const API_BASE = '/analysis';

/**
 * Get dashboard data (combined KPIs)
 */
export const getDashboardData = async (businessId) => {
  const res = await axiosInstance.get(`${API_BASE}/dashboard`, {
    params: { businessId },
  });
  return res.data;
};

/**
 * Get sales trend by category
 */
export const getSalesTrendByCategory = async (businessId, filters = {}) => {
  const res = await axiosInstance.get(`${API_BASE}/sales/trend-by-category`, {
    params: { businessId, ...filters },
  });
  return res.data;
};

/**
 * Get sales by date range
 * @param {string} groupBy - 'day' | 'week' | 'month'
 */
export const getSalesByDateRange = async (businessId, startDate, endDate, groupBy = 'day') => {
  const res = await axiosInstance.get(`${API_BASE}/sales/by-date-range`, {
    params: { businessId, startDate, endDate, groupBy },
  });
  return res.data;
};

/**
 * Get hourly sales distribution
 */
export const getHourlySalesDistribution = async (businessId) => {
  const res = await axiosInstance.get(`${API_BASE}/sales/hourly-distribution`, {
    params: { businessId },
  });
  return res.data;
};

/**
 * Get profit by category
 */
export const getProfitByCategory = async (businessId) => {
  const res = await axiosInstance.get(`${API_BASE}/profit/by-category`, {
    params: { businessId },
  });
  return res.data;
};

/**
 * Get ingredient consumption
 */
export const getIngredientConsumption = async (businessId) => {
  const res = await axiosInstance.get(`${API_BASE}/inventory/ingredient-consumption`, {
    params: { businessId },
  });
  return res.data;
};

/**
 * Get top selling products
 */
export const getTopSellingProducts = async (businessId, limit = 10) => {
  const res = await axiosInstance.get(`${API_BASE}/products/top-selling`, {
    params: { businessId, limit },
  });
  return res.data;
};

/**
 * Get business summary
 */
export const getBusinessSummary = async (businessId) => {
  const res = await axiosInstance.get(`${API_BASE}/summary`, {
    params: { businessId },
  });
  return res.data;
};

/**
 * Get slowest moving products
 */
export const getSlowestMovingProducts = async (businessId, limit = 10) => {
  const res = await axiosInstance.get(`${API_BASE}/products/slowest-moving`, {
    params: { businessId, limit },
  });
  return res.data;
};

/**
 * Get sales KPI summary (total sales, transactions, AOV, quantity sold)
 */
export const getSalesKPISummary = async (businessId) => {
  const res = await axiosInstance.get(`${API_BASE}/sales/kpi-summary`, {
    params: { businessId },
  });
  return res.data;
};

/**
 * Get sales by category
 */
export const getSalesByCategory = async (businessId) => {
  const res = await axiosInstance.get(`${API_BASE}/sales/by-category`, {
    params: { businessId },
  });
  return res.data;
};

/**
 * Get sales by product
 */
export const getSalesByProduct = async (businessId) => {
  const res = await axiosInstance.get(`${API_BASE}/sales/by-product`, {
    params: { businessId },
  });
  return res.data;
};

/**
 * Get transaction duration stats (avg, min, max checkout time)
 */
export const getTransactionDurationStats = async (businessId) => {
  const res = await axiosInstance.get(`${API_BASE}/transactions/duration`, {
    params: { businessId },
  });
  return res.data;
};

/**
 * Get cancelled/returned transactions count
 */
export const getCancelledTransactions = async (businessId, startDate, endDate) => {
  const res = await axiosInstance.get(`${API_BASE}/transactions/cancelled`, {
    params: { businessId, startDate, endDate },
  });
  return res.data;
};

/**
 * Get stock metrics (stock levels and alerts)
 */
export const getStockMetrics = async (businessId) => {
  const res = await axiosInstance.get(`${API_BASE}/inventory/stock-metrics`, {
    params: { businessId },
  });
  return res.data;
};

/**
 * Get stock alerts (low stock items)
 */
export const getStockAlerts = async (businessId) => {
  const res = await axiosInstance.get(`${API_BASE}/inventory/stock-alerts`, {
    params: { businessId },
  });
  return res.data;
};

/**
 * Get inventory turnover rates
 */
export const getInventoryTurnover = async (businessId, startDate, endDate) => {
  const res = await axiosInstance.get(`${API_BASE}/inventory/turnover`, {
    params: { businessId, startDate, endDate },
  });
  return res.data;
};

/**
 * Get stock aging (days since last restock)
 */
export const getStockAging = async (businessId) => {
  const res = await axiosInstance.get(`${API_BASE}/inventory/stock-aging`, {
    params: { businessId },
  });
  return res.data;
};

/**
 * Get category performance trends (current vs previous period)
 */
export const getCategoryPerformanceTrends = async (businessId) => {
  const res = await axiosInstance.get(`${API_BASE}/trends/category-performance`, {
    params: { businessId },
  });
  return res.data;
};

/**
 * Get product lifecycle stages
 */
export const getProductLifecycle = async (businessId) => {
  const res = await axiosInstance.get(`${API_BASE}/trends/product-lifecycle`, {
    params: { businessId },
  });
  return res.data;
};

/**
 * Get stock replenishment performance metrics
 */
export const getReplenishmentPerformance = async (businessId) => {
  const res = await axiosInstance.get(`${API_BASE}/trends/replenishment-performance`, {
    params: { businessId },
  });
  return res.data;
};

// ==================== SEGMENTATION APIs ====================

export const getBasketSizeSegmentation = async (businessId, startDate, endDate) => {
  const res = await axiosInstance.get(`${API_BASE}/segmentation/basket-size`, {
    params: { businessId, startDate, endDate },
  });
  return res.data;
};

export const getBasketValueSegmentation = async (businessId, startDate, endDate) => {
  const res = await axiosInstance.get(`${API_BASE}/segmentation/basket-value`, {
    params: { businessId, startDate, endDate },
  });
  return res.data;
};

export const getTimeBasedSegmentation = async (businessId, startDate, endDate) => {
  const res = await axiosInstance.get(`${API_BASE}/segmentation/time-based`, {
    params: { businessId, startDate, endDate },
  });
  return res.data;
};

export const getCategoryBasedSegmentation = async (businessId, startDate, endDate) => {
  const res = await axiosInstance.get(`${API_BASE}/segmentation/category-based`, {
    params: { businessId, startDate, endDate },
  });
  return res.data;
};

// ==================== MARKET BASKET ANALYSIS APIs ====================

export const getProductAffinityAnalysis = async (businessId, minSupport = 2) => {
  const res = await axiosInstance.get(`${API_BASE}/basket/affinity`, {
    params: { businessId, minSupport },
  });
  return res.data;
};

export const getFrequentlyBoughtTogether = async (businessId, productId) => {
  const res = await axiosInstance.get(`${API_BASE}/basket/frequently-bought-together`, {
    params: { businessId, productId },
  });
  return res.data;
};

// ==================== FORECASTING APIs ====================

export const getSalesForecast = async (businessId, daysHistory = 30) => {
  const res = await axiosInstance.get(`${API_BASE}/forecast/sales`, {
    params: { businessId, daysHistory },
  });
  return res.data;
};

export const getCategoryDemandForecast = async (businessId) => {
  const res = await axiosInstance.get(`${API_BASE}/forecast/category-demand`, {
    params: { businessId },
  });
  return res.data;
};

export const getStockoutPrediction = async (businessId) => {
  const res = await axiosInstance.get(`${API_BASE}/forecast/stockout-prediction`, {
    params: { businessId },
  });
  return res.data;
};

export const getReorderAlerts = async (businessId, leadTime = 3) => {
  const res = await axiosInstance.get(`${API_BASE}/forecast/reorder-alerts`, {
    params: { businessId, leadTime },
  });
  return res.data;
};

// ==================== RECOMMENDATIONS APIs ====================

export const getProductRecommendations = async (businessId, cartProductIds = []) => {
  const res = await axiosInstance.post(`${API_BASE}/recommendations`, 
    { cartProductIds },
    { params: { businessId } }
  );
  return res.data;
};

export default {
  getDashboardData,
  getSalesTrendByCategory,
  getSalesByDateRange,
  getHourlySalesDistribution,
  getProfitByCategory,
  getIngredientConsumption,
  getTopSellingProducts,
  getBusinessSummary,
  getSlowestMovingProducts,
  getSalesKPISummary,
  getSalesByCategory,
  getSalesByProduct,
  getTransactionDurationStats,
  getCancelledTransactions,
  getStockMetrics,
  getStockAlerts,
  getInventoryTurnover,
  getStockAging,
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
