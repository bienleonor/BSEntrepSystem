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
 * GET /api/analysis/products/slowest-moving
 */
export const getSlowestMovingProducts = async (req, res) => {
  try {
    const { businessId, limit } = req.query;

    if (!businessId) {
      return res.status(400).json({ error: 'businessId is required' });
    }

    const data = await AnalysisModel.getSlowestMovingProducts(businessId, parseInt(limit) || 10);
    res.json(data);
  } catch (err) {
    console.error('getSlowestMovingProducts error:', err);
    res.status(500).json({ error: 'Failed to fetch slowest moving products' });
  }
};

/**
 * GET /api/analysis/sales/kpi-summary
 */
export const getSalesKPISummary = async (req, res) => {
  try {
    const { businessId } = req.query;

    if (!businessId) {
      return res.status(400).json({ error: 'businessId is required' });
    }

    const data = await AnalysisModel.getSalesKPISummary(businessId);
    res.json(data);
  } catch (err) {
    console.error('getSalesKPISummary error:', err);
    res.status(500).json({ error: 'Failed to fetch sales KPI summary' });
  }
};

/**
 * GET /api/analysis/sales/by-category
 */
export const getSalesByCategory = async (req, res) => {
  try {
    const { businessId } = req.query;

    if (!businessId) {
      return res.status(400).json({ error: 'businessId is required' });
    }

    const data = await AnalysisModel.getSalesByCategory(businessId);
    res.json(data);
  } catch (err) {
    console.error('getSalesByCategory error:', err);
    res.status(500).json({ error: 'Failed to fetch sales by category' });
  }
};

/**
 * GET /api/analysis/sales/by-product
 */
export const getSalesByProduct = async (req, res) => {
  try {
    const { businessId } = req.query;

    if (!businessId) {
      return res.status(400).json({ error: 'businessId is required' });
    }

    const data = await AnalysisModel.getSalesByProduct(businessId);
    res.json(data);
  } catch (err) {
    console.error('getSalesByProduct error:', err);
    res.status(500).json({ error: 'Failed to fetch sales by product' });
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

/**
 * GET /api/analysis/transactions/duration
 */
export const getTransactionDuration = async (req, res) => {
  try {
    const { businessId } = req.query;

    if (!businessId) {
      return res.status(400).json({ error: 'businessId is required' });
    }

    const data = await AnalysisModel.getTransactionDurationStats(businessId);
    res.json(data);
  } catch (err) {
    console.error('getTransactionDuration error:', err);
    res.status(500).json({ error: 'Failed to fetch transaction duration stats' });
  }
};

/**
 * GET /api/analysis/transactions/cancelled
 */
export const getCancelledTransactions = async (req, res) => {
  try {
    const { businessId } = req.query;

    if (!businessId) {
      return res.status(400).json({ error: 'businessId is required' });
    }

    const data = await AnalysisModel.getCancelledTransactions(businessId);
    res.json(data);
  } catch (err) {
    console.error('getCancelledTransactions error:', err);
    res.status(500).json({ error: 'Failed to fetch cancelled transactions' });
  }
};

/**
 * GET /api/analysis/inventory/stock-metrics
 */
export const getStockMetrics = async (req, res) => {
  try {
    const { businessId } = req.query;

    if (!businessId) {
      return res.status(400).json({ error: 'businessId is required' });
    }

    const data = await AnalysisModel.getStockMetrics(businessId);
    res.json(data);
  } catch (err) {
    console.error('getStockMetrics error:', err);
    res.status(500).json({ error: 'Failed to fetch stock metrics' });
  }
};

/**
 * GET /api/analysis/inventory/stock-alerts
 */
export const getStockAlerts = async (req, res) => {
  try {
    const { businessId } = req.query;

    if (!businessId) {
      return res.status(400).json({ error: 'businessId is required' });
    }

    const data = await AnalysisModel.getStockAlerts(businessId);
    res.json(data);
  } catch (err) {
    console.error('getStockAlerts error:', err);
    res.status(500).json({ error: 'Failed to fetch stock alerts' });
  }
};

/**
 * GET /api/analysis/inventory/turnover
 */
export const getInventoryTurnover = async (req, res) => {
  try {
    const { businessId } = req.query;

    if (!businessId) {
      return res.status(400).json({ error: 'businessId is required' });
    }

    const data = await AnalysisModel.getInventoryTurnover(businessId);
    res.json(data);
  } catch (err) {
    console.error('getInventoryTurnover error:', err);
    res.status(500).json({ error: 'Failed to fetch inventory turnover' });
  }
};

/**
 * GET /api/analysis/inventory/stock-aging
 */
export const getStockAging = async (req, res) => {
  try {
    const { businessId } = req.query;

    if (!businessId) {
      return res.status(400).json({ error: 'businessId is required' });
    }

    const aging = await AnalysisModel.getStockAging(businessId);
    res.json(aging);
  } catch (err) {
    console.error('getStockAging error:', err);
    res.status(500).json({ error: 'Failed to fetch stock aging data' });
  }
};

/**
 * GET /api/analysis/trends/category-performance
 */
export const getCategoryPerformanceTrends = async (req, res) => {
  try {
    const { businessId } = req.query;

    if (!businessId) {
      return res.status(400).json({ error: 'businessId is required' });
    }

    const data = await AnalysisModel.getCategoryPerformanceTrends(businessId);
    res.json(data);
  } catch (err) {
    console.error('getCategoryPerformanceTrends error:', err);
    res.status(500).json({ error: 'Failed to fetch category performance trends' });
  }
};

/**
 * GET /api/analysis/trends/product-lifecycle
 */
export const getProductLifecycle = async (req, res) => {
  try {
    const { businessId } = req.query;

    if (!businessId) {
      return res.status(400).json({ error: 'businessId is required' });
    }

    const data = await AnalysisModel.getProductLifecycle(businessId);
    res.json(data);
  } catch (err) {
    console.error('getProductLifecycle error:', err);
    res.status(500).json({ error: 'Failed to fetch product lifecycle data' });
  }
};

/**
 * GET /api/analysis/trends/replenishment-performance
 */
export const getReplenishmentPerformance = async (req, res) => {
  try {
    const { businessId } = req.query;

    if (!businessId) {
      return res.status(400).json({ error: 'businessId is required' });
    }

    const data = await AnalysisModel.getReplenishmentPerformance(businessId);
    res.json(data);
  } catch (err) {
    console.error('getReplenishmentPerformance error:', err);
    res.status(500).json({ error: 'Failed to fetch replenishment performance data' });
  }
};

// ==================== SEGMENTATION CONTROLLERS ====================

/**
 * GET /api/analysis/segmentation/basket-size
 */
export const getBasketSizeSegmentation = async (req, res) => {
  try {
    const { businessId, startDate, endDate } = req.query;
    if (!businessId) return res.status(400).json({ error: 'businessId is required' });

    const data = await AnalysisModel.getBasketSizeSegmentation(businessId, startDate, endDate);
    res.json(data);
  } catch (err) {
    console.error('getBasketSizeSegmentation error:', err);
    res.status(500).json({ error: 'Failed to fetch basket size segmentation' });
  }
};

/**
 * GET /api/analysis/segmentation/basket-value
 */
export const getBasketValueSegmentation = async (req, res) => {
  try {
    const { businessId, startDate, endDate } = req.query;
    if (!businessId) return res.status(400).json({ error: 'businessId is required' });

    const data = await AnalysisModel.getBasketValueSegmentation(businessId, startDate, endDate);
    res.json(data);
  } catch (err) {
    console.error('getBasketValueSegmentation error:', err);
    res.status(500).json({ error: 'Failed to fetch basket value segmentation' });
  }
};

/**
 * GET /api/analysis/segmentation/time-based
 */
export const getTimeBasedSegmentation = async (req, res) => {
  try {
    const { businessId, startDate, endDate } = req.query;
    if (!businessId) return res.status(400).json({ error: 'businessId is required' });

    const data = await AnalysisModel.getTimeBasedSegmentation(businessId, startDate, endDate);
    res.json(data);
  } catch (err) {
    console.error('getTimeBasedSegmentation error:', err);
    res.status(500).json({ error: 'Failed to fetch time-based segmentation' });
  }
};

/**
 * GET /api/analysis/segmentation/category-based
 */
export const getCategoryBasedSegmentation = async (req, res) => {
  try {
    const { businessId, startDate, endDate } = req.query;
    if (!businessId) return res.status(400).json({ error: 'businessId is required' });

    const data = await AnalysisModel.getCategoryBasedSegmentation(businessId, startDate, endDate);
    res.json(data);
  } catch (err) {
    console.error('getCategoryBasedSegmentation error:', err);
    res.status(500).json({ error: 'Failed to fetch category-based segmentation' });
  }
};

// ==================== MARKET BASKET ANALYSIS CONTROLLERS ====================

/**
 * GET /api/analysis/basket/affinity
 */
export const getProductAffinityAnalysis = async (req, res) => {
  try {
    const { businessId, minSupport } = req.query;
    if (!businessId) return res.status(400).json({ error: 'businessId is required' });

    const data = await AnalysisModel.getProductAffinityAnalysis(businessId, parseInt(minSupport) || 2);
    res.json(data);
  } catch (err) {
    console.error('getProductAffinityAnalysis error:', err);
    res.status(500).json({ error: 'Failed to fetch product affinity analysis' });
  }
};

/**
 * GET /api/analysis/basket/frequently-bought-together
 */
export const getFrequentlyBoughtTogether = async (req, res) => {
  try {
    const { businessId, productId } = req.query;
    if (!businessId || !productId) return res.status(400).json({ error: 'businessId and productId are required' });

    const data = await AnalysisModel.getFrequentlyBoughtTogether(businessId, productId);
    res.json(data);
  } catch (err) {
    console.error('getFrequentlyBoughtTogether error:', err);
    res.status(500).json({ error: 'Failed to fetch frequently bought together data' });
  }
};

// ==================== FORECASTING CONTROLLERS ====================

/**
 * GET /api/analysis/forecast/sales
 */
export const getSalesForecast = async (req, res) => {
  try {
    const { businessId, daysHistory } = req.query;
    if (!businessId) return res.status(400).json({ error: 'businessId is required' });

    const data = await AnalysisModel.getSalesForecast(businessId, parseInt(daysHistory) || 30);
    res.json(data);
  } catch (err) {
    console.error('getSalesForecast error:', err);
    res.status(500).json({ error: 'Failed to fetch sales forecast' });
  }
};

/**
 * GET /api/analysis/forecast/category-demand
 */
export const getCategoryDemandForecast = async (req, res) => {
  try {
    const { businessId } = req.query;
    if (!businessId) return res.status(400).json({ error: 'businessId is required' });

    const data = await AnalysisModel.getCategoryDemandForecast(businessId);
    res.json(data);
  } catch (err) {
    console.error('getCategoryDemandForecast error:', err);
    res.status(500).json({ error: 'Failed to fetch category demand forecast' });
  }
};

/**
 * GET /api/analysis/forecast/stockout-prediction
 */
export const getStockoutPrediction = async (req, res) => {
  try {
    const { businessId } = req.query;
    if (!businessId) return res.status(400).json({ error: 'businessId is required' });

    const data = await AnalysisModel.getStockoutPrediction(businessId);
    res.json(data);
  } catch (err) {
    console.error('getStockoutPrediction error:', err);
    res.status(500).json({ error: 'Failed to fetch stockout predictions' });
  }
};

/**
 * GET /api/analysis/forecast/reorder-alerts
 */
export const getReorderAlerts = async (req, res) => {
  try {
    const { businessId, leadTime } = req.query;
    if (!businessId) return res.status(400).json({ error: 'businessId is required' });

    const data = await AnalysisModel.getReorderAlerts(businessId, parseInt(leadTime) || 3);
    res.json(data);
  } catch (err) {
    console.error('getReorderAlerts error:', err);
    res.status(500).json({ error: 'Failed to fetch reorder alerts' });
  }
};

// ==================== RECOMMENDATIONS CONTROLLERS ====================

/**
 * POST /api/analysis/recommendations
 */
export const getProductRecommendations = async (req, res) => {
  try {
    const { businessId } = req.query;
    const { cartProductIds } = req.body || {};
    if (!businessId) return res.status(400).json({ error: 'businessId is required' });

    const data = await AnalysisModel.getProductRecommendations(businessId, cartProductIds || []);
    res.json(data);
  } catch (err) {
    console.error('getProductRecommendations error:', err);
    res.status(500).json({ error: 'Failed to fetch product recommendations' });
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
  getSlowestMovingProducts,
  getSalesKPISummary,
  getSalesByCategory,
  getSalesByProduct,
  getDashboardData,
  getTransactionDuration,
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
