import express from 'express';
import forecastDataModel from '../models/forecast-data-model.js';

const router = express.Router();

// Forecast service base URL
const FORECAST_SERVICE_URL = process.env.FORECAST_SERVICE_URL || 'http://localhost:8000';

/**
 * Get revenue forecast for a business using real data
 * GET /api/forecast/revenue/:businessId
 */
router.get('/revenue/:businessId', async (req, res) => {
  try {
    const { businessId } = req.params;
    const days = parseInt(req.query.days) || 30;
    const forecastSteps = parseInt(req.query.steps) || 7;
    
    // Fetch real revenue history from database
    const revenueHistory = await forecastDataModel.getDailyRevenueHistory(businessId, days);
    
    if (revenueHistory.length < 10) {
      return res.status(400).json({
        error: 'Insufficient data',
        message: 'Need at least 10 days of sales data for forecasting'
      });
    }
    
    // Call forecast microservice
    const response = await fetch(`${FORECAST_SERVICE_URL}/business/revenue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        business_id: businessId,
        revenue_history: revenueHistory,
        steps: forecastSteps,
        seasonal: false
      }),
      signal: AbortSignal.timeout(15000)
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Revenue forecast error:', error.message);
    res.status(500).json({
      error: 'Failed to get revenue forecast',
      message: error.message
    });
  }
});

/**
 * Get category demand forecast using real data
 * GET /api/forecast/category/:businessId/:categoryId
 */
router.get('/category/:businessId/:categoryId', async (req, res) => {
  try {
    const { businessId, categoryId } = req.params;
    const days = parseInt(req.query.days) || 30;
    const forecastSteps = parseInt(req.query.steps) || 14;
    
    // Fetch real category sales history
    const salesHistory = await forecastDataModel.getCategorySalesHistory(businessId, categoryId, days);
    
    if (salesHistory.length < 7) {
      return res.status(400).json({
        error: 'Insufficient data',
        message: 'Need at least 7 days of sales data for category forecasting'
      });
    }
    
    // Call forecast microservice
    const response = await fetch(`${FORECAST_SERVICE_URL}/business/category-demand`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category_id: categoryId,
        sales_history: salesHistory,
        steps: forecastSteps,
        seasonal: false
      }),
      signal: AbortSignal.timeout(15000)
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Category forecast error:', error.message);
    res.status(500).json({
      error: 'Failed to get category demand forecast',
      message: error.message
    });
  }
});

/**
 * Get product/ingredient usage forecast using real data
 * GET /api/forecast/product/:businessId/:productId
 */
router.get('/product/:businessId/:productId', async (req, res) => {
  try {
    const { businessId, productId } = req.params;
    const days = parseInt(req.query.days) || 30;
    const forecastSteps = parseInt(req.query.steps) || 7;
    
    // Fetch real product usage history
    const usageHistory = await forecastDataModel.getProductUsageHistory(businessId, productId, days);
    
    if (usageHistory.length < 7) {
      return res.status(400).json({
        error: 'Insufficient data',
        message: 'Need at least 7 days of usage data for product forecasting'
      });
    }
    
    // Call forecast microservice
    const response = await fetch(`${FORECAST_SERVICE_URL}/business/ingredient-usage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ingredient_id: productId,
        usage_history: usageHistory,
        steps: forecastSteps,
        seasonal: false
      }),
      signal: AbortSignal.timeout(15000)
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Product forecast error:', error.message);
    res.status(500).json({
      error: 'Failed to get product usage forecast',
      message: error.message
    });
  }
});

/**
 * Get reorder alerts for all products using real inventory data
 * GET /api/forecast/reorder-alerts/:businessId
 */
router.get('/reorder-alerts/:businessId', async (req, res) => {
  try {
    const { businessId } = req.params;
    const leadTimeDays = parseInt(req.query.leadTime) || 3;
    const safetyStock = parseInt(req.query.safetyStock) || 20;
    
    console.log(`Fetching reorder alerts for business ${businessId}`);
    
    // Fetch inventory data with usage rates
    const inventoryItems = await forecastDataModel.getInventoryForReorderAlerts(businessId);
    
    console.log(`Found ${inventoryItems.length} inventory items`);
    
    if (inventoryItems.length === 0) {
      return res.json([]);
    }
    
    // Call forecast microservice for each item
    const alerts = await Promise.all(
      inventoryItems.slice(0, 10).map(async (item) => {
        try {
          console.log(`Processing product ${item.product_id}: ${item.product_name}`);
          
          // Get usage history for better prediction
          const usageHistory = await forecastDataModel.getProductUsageHistory(businessId, item.product_id, 20);
          
          console.log(`Product ${item.product_id} has ${usageHistory.length} days of history`);
          
          if (usageHistory.length < 5) {
            console.log(`Skipping ${item.product_name} - insufficient history`);
            // Return a simple alert without forecast
            return {
              ingredient_id: item.product_id,
              product_name: item.product_name,
              current_stock: parseFloat(item.current_stock),
              alert_status: 'INSUFFICIENT_DATA',
              should_reorder: false,
              message: 'Not enough sales history for prediction'
            };
          }
          
          const reorderPoint = item.avg_daily_usage * (leadTimeDays + 2);
          
          const response = await fetch(`${FORECAST_SERVICE_URL}/business/reorder-alert`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ingredient_id: item.product_id.toString(),
              current_stock: parseFloat(item.current_stock),
              usage_history: usageHistory,
              reorder_point: reorderPoint,
              lead_time_days: leadTimeDays,
              safety_stock: safetyStock
            }),
            signal: AbortSignal.timeout(10000)
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error(`Forecast service error for ${item.product_name}:`, errorText);
            return {
              ingredient_id: item.product_id,
              product_name: item.product_name,
              current_stock: parseFloat(item.current_stock),
              alert_status: 'ERROR',
              should_reorder: false,
              message: 'Forecast service error'
            };
          }
          
          const alert = await response.json();
          console.log(`Alert generated for ${item.product_name}:`, alert.alert_status);
          
          return {
            ...alert,
            product_name: item.product_name
          };
        } catch (err) {
          console.error(`Alert error for product ${item.product_id}:`, err.message);
          return {
            ingredient_id: item.product_id,
            product_name: item.product_name,
            current_stock: parseFloat(item.current_stock),
            alert_status: 'ERROR',
            should_reorder: false,
            message: err.message
          };
        }
      })
    );
    
    console.log(`Returning ${alerts.length} alerts`);
    res.json(alerts);
  } catch (error) {
    console.error('Reorder alerts error:', error.message);
    res.status(500).json({
      error: 'Failed to get reorder alerts',
      message: error.message
    });
  }
});

/**
 * Get active categories for dropdown
 * GET /api/forecast/categories/:businessId
 */
router.get('/categories/:businessId', async (req, res) => {
  try {
    const { businessId } = req.params;
    const categories = await forecastDataModel.getActiveCategories(businessId);
    res.json(categories);
  } catch (error) {
    console.error('Categories error:', error.message);
    res.status(500).json({
      error: 'Failed to get categories',
      message: error.message
    });
  }
});

/**
 * Get active products for dropdown
 * GET /api/forecast/products/:businessId
 */
router.get('/products/:businessId', async (req, res) => {
  try {
    const { businessId } = req.params;
    const limit = parseInt(req.query.limit) || 20;
    const products = await forecastDataModel.getActiveProducts(businessId, limit);
    res.json(products);
  } catch (error) {
    console.error('Products error:', error.message);
    res.status(500).json({
      error: 'Failed to get products',
      message: error.message
    });
  }
});

/**
 * Health check for forecast service
 * GET /api/forecast/health
 */
router.get('/health', async (req, res) => {
  try {
    const response = await fetch(`${FORECAST_SERVICE_URL}/`, {
      signal: AbortSignal.timeout(3000)
    });
    const data = await response.json();
    res.json({
      status: 'connected',
      forecast_service: data
    });
  } catch (error) {
    res.status(503).json({
      status: 'disconnected',
      error: 'Cannot connect to forecast service',
      message: error.message
    });
  }
});

export default router;
