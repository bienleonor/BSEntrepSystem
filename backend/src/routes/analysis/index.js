// routes/analysis/index.js
import express from 'express';
import * as AnalysisController from '../../controllers/analysis-controller.js';
import { authenticateToken } from '../../middlewares/auth-middleware.js';
import { requireBusinessAccess } from '../../middlewares/business-access.js';
import { requirePermission } from '../../middlewares/permission-middleware.js';

const router = express.Router();

// ============================================
// All analysis routes require auth + business access
// Uses: dashboard:read for dashboard, report:read for reports/analytics
// ============================================

// Dashboard - combined endpoint
router.get('/dashboard', 
  authenticateToken, 
  requireBusinessAccess, 
  requirePermission('dashboard:read'), 
  AnalysisController.getDashboardData
);

// Sales endpoints - report:read
router.get('/sales/trend-by-category', 
  authenticateToken, requireBusinessAccess, requirePermission('report:read'), 
  AnalysisController.getSalesTrend
);
router.get('/sales/by-date-range', 
  authenticateToken, requireBusinessAccess, requirePermission('report:read'), 
  AnalysisController.getSalesByDateRange
);
router.get('/sales/hourly-distribution', 
  authenticateToken, requireBusinessAccess, requirePermission('report:read'), 
  AnalysisController.getHourlySalesDistribution
);
router.get('/sales/kpi-summary', 
  authenticateToken, requireBusinessAccess, requirePermission('report:read'), 
  AnalysisController.getSalesKPISummary
);
router.get('/sales/by-category', 
  authenticateToken, requireBusinessAccess, requirePermission('report:read'), 
  AnalysisController.getSalesByCategory
);
router.get('/sales/by-product', 
  authenticateToken, requireBusinessAccess, requirePermission('report:read'), 
  AnalysisController.getSalesByProduct
);

// Transaction endpoints
router.get('/transactions/duration', 
  authenticateToken, requireBusinessAccess, requirePermission('report:read'), 
  AnalysisController.getTransactionDuration
);
router.get('/transactions/cancelled', 
  authenticateToken, requireBusinessAccess, requirePermission('report:read'), 
  AnalysisController.getCancelledTransactions
);

// Profit endpoints
router.get('/profit/by-category', 
  authenticateToken, requireBusinessAccess, requirePermission('report:read'), 
  AnalysisController.getProfitByCategory
);

// Inventory/Ingredient endpoints
router.get('/inventory/ingredient-consumption', 
  authenticateToken, requireBusinessAccess, requirePermission('report:read'), 
  AnalysisController.getIngredientConsumption
);
router.get('/inventory/stock-metrics', 
  authenticateToken, requireBusinessAccess, requirePermission('report:read'), 
  AnalysisController.getStockMetrics
);
router.get('/inventory/stock-alerts', 
  authenticateToken, requireBusinessAccess, requirePermission('report:read'), 
  AnalysisController.getStockAlerts
);
router.get('/inventory/turnover', 
  authenticateToken, requireBusinessAccess, requirePermission('report:read'), 
  AnalysisController.getInventoryTurnover
);
router.get('/inventory/stock-aging', 
  authenticateToken, requireBusinessAccess, requirePermission('report:read'), 
  AnalysisController.getStockAging
);

// Trends endpoints
router.get('/trends/category-performance', 
  authenticateToken, requireBusinessAccess, requirePermission('report:read'), 
  AnalysisController.getCategoryPerformanceTrends
);
router.get('/trends/product-lifecycle', 
  authenticateToken, requireBusinessAccess, requirePermission('report:read'), 
  AnalysisController.getProductLifecycle
);
router.get('/trends/replenishment-performance', 
  authenticateToken, requireBusinessAccess, requirePermission('report:read'), 
  AnalysisController.getReplenishmentPerformance
);

// Products endpoints
router.get('/products/top-selling', 
  authenticateToken, requireBusinessAccess, requirePermission('report:read'), 
  AnalysisController.getTopSellingProducts
);
router.get('/products/slowest-moving', 
  authenticateToken, requireBusinessAccess, requirePermission('report:read'), 
  AnalysisController.getSlowestMovingProducts
);

// ==================== SEGMENTATION ROUTES ====================
router.get('/segmentation/basket-size', 
  authenticateToken, requireBusinessAccess, requirePermission('report:read'), 
  AnalysisController.getBasketSizeSegmentation
);
router.get('/segmentation/basket-value', 
  authenticateToken, requireBusinessAccess, requirePermission('report:read'), 
  AnalysisController.getBasketValueSegmentation
);
router.get('/segmentation/time-based', 
  authenticateToken, requireBusinessAccess, requirePermission('report:read'), 
  AnalysisController.getTimeBasedSegmentation
);
router.get('/segmentation/category-based', 
  authenticateToken, requireBusinessAccess, requirePermission('report:read'), 
  AnalysisController.getCategoryBasedSegmentation
);

// ==================== MARKET BASKET ANALYSIS ROUTES ====================
router.get('/basket/affinity', 
  authenticateToken, requireBusinessAccess, requirePermission('report:read'), 
  AnalysisController.getProductAffinityAnalysis
);
router.get('/basket/frequently-bought-together', 
  authenticateToken, requireBusinessAccess, requirePermission('report:read'), 
  AnalysisController.getFrequentlyBoughtTogether
);

// ==================== FORECASTING ROUTES ====================
router.get('/forecast/sales', 
  authenticateToken, requireBusinessAccess, requirePermission('report:read'), 
  AnalysisController.getSalesForecast
);
router.get('/forecast/category-demand', 
  authenticateToken, requireBusinessAccess, requirePermission('report:read'), 
  AnalysisController.getCategoryDemandForecast
);
router.get('/forecast/stockout-prediction', 
  authenticateToken, requireBusinessAccess, requirePermission('report:read'), 
  AnalysisController.getStockoutPrediction
);
router.get('/forecast/reorder-alerts', 
  authenticateToken, requireBusinessAccess, requirePermission('report:read'), 
  AnalysisController.getReorderAlerts
);

// ==================== RECOMMENDATIONS ROUTES ====================
router.post('/recommendations', 
  authenticateToken, requireBusinessAccess, requirePermission('report:read'), 
  AnalysisController.getProductRecommendations
);

// Summary endpoint
router.get('/summary', 
  authenticateToken, requireBusinessAccess, requirePermission('report:read'), 
  AnalysisController.getBusinessSummary
);

export default router;
