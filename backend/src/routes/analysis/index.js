// routes/analysis/index.js
import express from 'express';
import * as AnalysisController from '../../controllers/analysis-controller.js';

const router = express.Router();

// Dashboard - combined endpoint
router.get('/dashboard', AnalysisController.getDashboardData);

// Sales endpoints
router.get('/sales/trend-by-category', AnalysisController.getSalesTrend);
router.get('/sales/by-date-range', AnalysisController.getSalesByDateRange);
router.get('/sales/hourly-distribution', AnalysisController.getHourlySalesDistribution);
router.get('/sales/kpi-summary', AnalysisController.getSalesKPISummary);
router.get('/sales/by-category', AnalysisController.getSalesByCategory);
router.get('/sales/by-product', AnalysisController.getSalesByProduct);

// Transaction endpoints
router.get('/transactions/duration', AnalysisController.getTransactionDuration);
router.get('/transactions/cancelled', AnalysisController.getCancelledTransactions);

// Profit endpoints
router.get('/profit/by-category', AnalysisController.getProfitByCategory);

// Inventory/Ingredient endpoints
router.get('/inventory/ingredient-consumption', AnalysisController.getIngredientConsumption);
router.get('/inventory/stock-metrics', AnalysisController.getStockMetrics);
router.get('/inventory/stock-alerts', AnalysisController.getStockAlerts);
router.get('/inventory/turnover', AnalysisController.getInventoryTurnover);
router.get('/inventory/stock-aging', AnalysisController.getStockAging);

// Trends endpoints
router.get('/trends/category-performance', AnalysisController.getCategoryPerformanceTrends);
router.get('/trends/product-lifecycle', AnalysisController.getProductLifecycle);
router.get('/trends/replenishment-performance', AnalysisController.getReplenishmentPerformance);

// Products endpoints
router.get('/products/top-selling', AnalysisController.getTopSellingProducts);
router.get('/products/slowest-moving', AnalysisController.getSlowestMovingProducts);

// ==================== SEGMENTATION ROUTES ====================
router.get('/segmentation/basket-size', AnalysisController.getBasketSizeSegmentation);
router.get('/segmentation/basket-value', AnalysisController.getBasketValueSegmentation);
router.get('/segmentation/time-based', AnalysisController.getTimeBasedSegmentation);
router.get('/segmentation/category-based', AnalysisController.getCategoryBasedSegmentation);

// ==================== MARKET BASKET ANALYSIS ROUTES ====================
router.get('/basket/affinity', AnalysisController.getProductAffinityAnalysis);
router.get('/basket/frequently-bought-together', AnalysisController.getFrequentlyBoughtTogether);

// ==================== FORECASTING ROUTES ====================
router.get('/forecast/sales', AnalysisController.getSalesForecast);
router.get('/forecast/category-demand', AnalysisController.getCategoryDemandForecast);
router.get('/forecast/stockout-prediction', AnalysisController.getStockoutPrediction);
router.get('/forecast/reorder-alerts', AnalysisController.getReorderAlerts);

// ==================== RECOMMENDATIONS ROUTES ====================
router.post('/recommendations', AnalysisController.getProductRecommendations);

// Summary endpoint
router.get('/summary', AnalysisController.getBusinessSummary);

export default router;
