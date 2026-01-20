import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Custom hook for accessing forecast microservice through backend
 * All 4 business features: Ingredient Usage, Category Demand, Revenue, Reorder Alerts
 */
export const useForecast = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Forecast ingredient usage for next 7 days
   * @param {string} ingredientId - Ingredient identifier
   * @param {Array} usageHistory - Array of {date, value} objects
   * @param {number} steps - Number of days to forecast (default: 7)
   * @param {boolean} seasonal - Use seasonal model (default: false)
   * @returns {Object} { ingredient_id, forecast, total_forecasted_usage, average_daily_usage, peak_usage_day }
   */
  const forecastIngredientUsage = async (ingredientId, usageHistory, steps = 7, seasonal = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/forecast/ingredient/usage`, {
        ingredient_id: ingredientId,
        usage_history: usageHistory,
        steps,
        seasonal
      });
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to forecast ingredient usage');
      setLoading(false);
      throw err;
    }
  };

  /**
   * Forecast category demand
   * @param {string} categoryId - Category identifier
   * @param {Array} salesHistory - Array of {date, value} objects
   * @param {number} steps - Number of periods to forecast (default: 14)
   * @param {boolean} seasonal - Use seasonal model (default: false)
   * @returns {Object} { category_id, forecast, total_forecasted_demand, average_daily_demand, trend_analysis }
   */
  const forecastCategoryDemand = async (categoryId, salesHistory, steps = 14, seasonal = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/forecast/category/demand`, {
        category_id: categoryId,
        sales_history: salesHistory,
        steps,
        seasonal
      });
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to forecast category demand');
      setLoading(false);
      throw err;
    }
  };

  /**
   * Forecast revenue for next months
   * @param {string} businessId - Business identifier
   * @param {Array} revenueHistory - Array of {date, value} objects
   * @param {number} steps - Number of months to forecast (default: 12)
   * @param {boolean} seasonal - Use seasonal model (default: true)
   * @returns {Object} { business_id, forecast, total_forecasted_revenue, average_monthly_revenue, growth_rate }
   */
  const forecastRevenue = async (businessId, revenueHistory, steps = 12, seasonal = true) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/forecast/revenue`, {
        business_id: businessId,
        revenue_history: revenueHistory,
        steps,
        seasonal,
        seasonal_period: 12
      });
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to forecast revenue');
      setLoading(false);
      throw err;
    }
  };

  /**
   * Check reorder alert for ingredient
   * @param {string} ingredientId - Ingredient identifier
   * @param {number} currentStock - Current stock level
   * @param {Array} usageHistory - Array of {date, value} objects
   * @param {number} reorderPoint - Reorder point threshold
   * @param {number} leadTimeDays - Lead time in days (default: 3)
   * @param {number} safetyStock - Safety stock buffer (default: 20)
   * @returns {Object} { ingredient_id, alert_status, should_reorder, days_until_reorder, recommended_order_quantity }
   */
  const checkReorderAlert = async (ingredientId, currentStock, usageHistory, reorderPoint, leadTimeDays = 3, safetyStock = 20) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/forecast/reorder-alert`, {
        ingredient_id: ingredientId,
        current_stock: currentStock,
        usage_history: usageHistory,
        reorder_point: reorderPoint,
        lead_time_days: leadTimeDays,
        safety_stock: safetyStock
      });
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to check reorder alert');
      setLoading(false);
      throw err;
    }
  };

  /**
   * Check forecast service health
   * @returns {Object} { status, forecast_service }
   */
  const checkHealth = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/forecast/health`);
      return response.data;
    } catch (err) {
      throw new Error('Forecast service is not available');
    }
  };

  return {
    loading,
    error,
    forecastIngredientUsage,
    forecastCategoryDemand,
    forecastRevenue,
    checkReorderAlert,
    checkHealth
  };
};

export default useForecast;
