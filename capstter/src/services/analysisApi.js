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

export default {
  getDashboardData,
  getSalesTrendByCategory,
  getSalesByDateRange,
  getHourlySalesDistribution,
  getProfitByCategory,
  getIngredientConsumption,
  getTopSellingProducts,
  getBusinessSummary,
};
