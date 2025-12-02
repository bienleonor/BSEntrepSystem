// controllers/analysis-controller.js
import * as AnalysisModel from '../models/analysis-model.js';

/**
 * GET /api/analysis/sales/trend-by-category
 */
export const getSalesTrend = async (req, res) => {
  try {
    const { businessId, startDate, endDate } = req.query;
    
    if (!businessId) {
      return res.status(400).json({ error: 'businessId is required' });
    }

    const data = await AnalysisModel.getSalesTrendByCategory(businessId, { startDate, endDate });
    res.json(data);
  } catch (err) {
    console.error('getSalesTrend error:', err);
    res.status(500).json({ error: 'Failed to fetch sales trend' });
  }
};

/**
 * GET /api/analysis/profit/by-category
 */
export const getProfitByCategory = async (req, res) => {
  try {
    const { businessId } = req.query;

    if (!businessId) {
      return res.status(400).json({ error: 'businessId is required' });
    }

    const data = await AnalysisModel.getProfitByCategory(businessId);
    res.json(data);
  } catch (err) {
    console.error('getProfitByCategory error:', err);
    res.status(500).json({ error: 'Failed to fetch profit data' });
  }
};

/**
 * GET /api/analysis/inventory/ingredient-consumption
 */
export const getIngredientConsumption = async (req, res) => {
  try {
    const { businessId } = req.query;

    if (!businessId) {
      return res.status(400).json({ error: 'businessId is required' });
    }

    const data = await AnalysisModel.getIngredientConsumption(businessId);
    res.json(data);
  } catch (err) {
    console.error('getIngredientConsumption error:', err);
    res.status(500).json({ error: 'Failed to fetch ingredient consumption' });
  }
};

/**
 * GET /api/analysis/summary
 */
export const getBusinessSummary = async (req, res) => {
  try {
    const { businessId } = req.query;

    if (!businessId) {
      return res.status(400).json({ error: 'businessId is required' });
    }

    const data = await AnalysisModel.getBusinessSummary(businessId);
    // Return single object if one business, else array
    res.json(data.length === 1 ? data[0] : data);
  } catch (err) {
    console.error('getBusinessSummary error:', err);
    res.status(500).json({ error: 'Failed to fetch business summary' });
  }
};

/**
 * GET /api/analysis/products/top-selling
 */
export const getTopSellingProducts = async (req, res) => {
  try {
    const { businessId, limit } = req.query;

    if (!businessId) {
      return res.status(400).json({ error: 'businessId is required' });
    }

    const data = await AnalysisModel.getTopSellingProducts(businessId, Number(limit) || 10);
    res.json(data);
  } catch (err) {
    console.error('getTopSellingProducts error:', err);
    res.status(500).json({ error: 'Failed to fetch top selling products' });
  }
};

/**
 * GET /api/analysis/sales/by-date-range
 */
export const getSalesByDateRange = async (req, res) => {
  try {
    const { businessId, startDate, endDate, groupBy } = req.query;

    if (!businessId) {
      return res.status(400).json({ error: 'businessId is required' });
    }

    const data = await AnalysisModel.getSalesByDateRange(businessId, startDate, endDate, groupBy);
    res.json(data);
  } catch (err) {
    console.error('getSalesByDateRange error:', err);
    res.status(500).json({ error: 'Failed to fetch sales by date range' });
  }
};

/**
 * GET /api/analysis/sales/hourly-distribution
 */
export const getHourlySalesDistribution = async (req, res) => {
  try {
    const { businessId } = req.query;

    if (!businessId) {
      return res.status(400).json({ error: 'businessId is required' });
    }

    const data = await AnalysisModel.getHourlySalesDistribution(businessId);
    res.json(data);
  } catch (err) {
    console.error('getHourlySalesDistribution error:', err);
    res.status(500).json({ error: 'Failed to fetch hourly distribution' });
  }
};

/**
 * GET /api/analysis/dashboard
 * Combined endpoint for dashboard - returns all KPIs in one call
 */
export const getDashboardData = async (req, res) => {
  try {
    const { businessId } = req.query;

    if (!businessId) {
      return res.status(400).json({ error: 'businessId is required' });
    }

    const [summary, salesTrend, profitByCategory, topProducts, ingredientConsumption] = await Promise.all([
      AnalysisModel.getBusinessSummary(businessId),
      AnalysisModel.getSalesTrendByCategory(businessId),
      AnalysisModel.getProfitByCategory(businessId),
      AnalysisModel.getTopSellingProducts(businessId, 5),
      AnalysisModel.getIngredientConsumption(businessId),
    ]);

    res.json({
      summary: summary[0] || null,
      salesTrend,
      profitByCategory,
      topProducts,
      ingredientConsumption,
    });
  } catch (err) {
    console.error('getDashboardData error:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

export default {
  getSalesTrend,
  getProfitByCategory,
  getIngredientConsumption,
  getBusinessSummary,
  getTopSellingProducts,
  getSalesByDateRange,
  getHourlySalesDistribution,
  getDashboardData,
};
