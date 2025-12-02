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

// Profit endpoints
router.get('/profit/by-category', AnalysisController.getProfitByCategory);

// Inventory/Ingredient endpoints
router.get('/inventory/ingredient-consumption', AnalysisController.getIngredientConsumption);

// Products endpoints
router.get('/products/top-selling', AnalysisController.getTopSellingProducts);

// Summary endpoint
router.get('/summary', AnalysisController.getBusinessSummary);

export default router;
