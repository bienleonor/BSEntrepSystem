# Business Integration Guide

## Quick Setup for BSEntrepSystem

### 1. Backend Route Integration (Express)

Create a new service file: `backend/src/services/forecast-integration.js`

```javascript
const axios = require('axios');
const pool = require('../config/pool');

const FORECAST_SERVICE = process.env.FORECAST_SERVICE_URL || 'http://localhost:8000';

// ============================================
// INGREDIENT USAGE FORECASTING
// ============================================

exports.forecastIngredientUsage = async (ingredientId, days = 7) => {
  try {
    // Get usage history from database
    const [usage] = await pool.execute(
      `SELECT DATE(usage_date) as date, SUM(quantity_used) as value
       FROM ingredient_usage
       WHERE ingredient_id = ?
       AND usage_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
       GROUP BY DATE(usage_date)
       ORDER BY date`,
      [ingredientId]
    );

    if (usage.length < 7) {
      throw new Error('Need at least 7 days of usage data');
    }

    const response = await axios.post(`${FORECAST_SERVICE}/business/ingredient-usage`, {
      ingredient_id: ingredientId,
      usage_history: usage,
      steps: days,
      seasonal: true,
      seasonal_period: 7
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Ingredient forecast error:', error);
    throw error;
  }
};

// ============================================
// CATEGORY DEMAND FORECASTING
// ============================================

exports.forecastCategoryDemand = async (businessId, categoryId, days = 14) => {
  try {
    const [sales] = await pool.execute(
      `SELECT DATE(sale_date) as date, SUM(quantity) as value
       FROM sales s
       JOIN products p ON s.product_id = p.product_id
       WHERE p.category_id = ? AND p.business_id = ?
       AND sale_date >= DATE_SUB(CURDATE(), INTERVAL 60 DAY)
       GROUP BY DATE(sale_date)
       ORDER BY date`,
      [categoryId, businessId]
    );

    if (sales.length < 14) {
      throw new Error('Need at least 14 days of sales data');
    }

    const response = await axios.post(`${FORECAST_SERVICE}/business/category-demand`, {
      category_id: categoryId,
      sales_history: sales,
      steps: days,
      seasonal: true
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Category demand forecast error:', error);
    throw error;
  }
};

// ============================================
// REVENUE FORECASTING
// ============================================

exports.forecastRevenue = async (businessId, months = 6) => {
  try {
    const [revenue] = await pool.execute(
      `SELECT DATE_FORMAT(sale_date, '%Y-%m-01') as date, 
              SUM(total_amount) as value
       FROM sales
       WHERE business_id = ?
       AND sale_date >= DATE_SUB(CURDATE(), INTERVAL 18 MONTH)
       GROUP BY DATE_FORMAT(sale_date, '%Y-%m')
       ORDER BY date`,
      [businessId]
    );

    if (revenue.length < 12) {
      throw new Error('Need at least 12 months of revenue data');
    }

    const response = await axios.post(`${FORECAST_SERVICE}/business/revenue`, {
      business_id: businessId,
      revenue_history: revenue,
      steps: months,
      seasonal: true
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Revenue forecast error:', error);
    throw error;
  }
};

// ============================================
// REORDER ALERTS
// ============================================

exports.getReorderAlerts = async (businessId) => {
  try {
    // Get all ingredients with low stock or approaching reorder point
    const [ingredients] = await pool.execute(
      `SELECT 
        i.ingredient_id,
        i.name as ingredient_name,
        inv.current_stock,
        inv.reorder_point,
        inv.lead_time_days,
        inv.safety_stock
       FROM ingredients i
       JOIN inventory inv ON i.ingredient_id = inv.ingredient_id
       WHERE i.business_id = ?
       AND inv.current_stock <= (inv.reorder_point * 1.5)`,
      [businessId]
    );

    const alerts = [];

    for (const ingredient of ingredients) {
      // Get usage history
      const [usage] = await pool.execute(
        `SELECT DATE(usage_date) as date, SUM(quantity_used) as value
         FROM ingredient_usage
         WHERE ingredient_id = ?
         AND usage_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
         GROUP BY DATE(usage_date)
         ORDER BY date`,
        [ingredient.ingredient_id]
      );

      if (usage.length >= 7) {
        const response = await axios.post(`${FORECAST_SERVICE}/business/reorder-alert`, {
          ingredient_id: ingredient.ingredient_id,
          current_stock: ingredient.current_stock,
          usage_history: usage,
          reorder_point: ingredient.reorder_point,
          lead_time_days: ingredient.lead_time_days || 3,
          safety_stock: ingredient.safety_stock || 0
        });

        alerts.push({
          ingredient_name: ingredient.ingredient_name,
          ...response.data
        });
      }
    }

    // Sort by priority
    const priorityOrder = { 'HIGH': 0, 'MEDIUM': 1, 'LOW': 2, 'NONE': 3 };
    alerts.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return {
      success: true,
      alerts: alerts,
      total_alerts: alerts.filter(a => a.should_reorder).length
    };
  } catch (error) {
    console.error('Reorder alerts error:', error);
    throw error;
  }
};

exports.checkSingleReorderAlert = async (ingredientId) => {
  try {
    // Get ingredient details
    const [ingredients] = await pool.execute(
      `SELECT 
        i.ingredient_id,
        inv.current_stock,
        inv.reorder_point,
        inv.lead_time_days,
        inv.safety_stock
       FROM ingredients i
       JOIN inventory inv ON i.ingredient_id = inv.ingredient_id
       WHERE i.ingredient_id = ?`,
      [ingredientId]
    );

    if (ingredients.length === 0) {
      throw new Error('Ingredient not found');
    }

    const ingredient = ingredients[0];

    // Get usage history
    const [usage] = await pool.execute(
      `SELECT DATE(usage_date) as date, SUM(quantity_used) as value
       FROM ingredient_usage
       WHERE ingredient_id = ?
       AND usage_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
       GROUP BY DATE(usage_date)
       ORDER BY date`,
      [ingredientId]
    );

    if (usage.length < 7) {
      throw new Error('Insufficient usage history');
    }

    const response = await axios.post(`${FORECAST_SERVICE}/business/reorder-alert`, {
      ingredient_id: ingredientId,
      current_stock: ingredient.current_stock,
      usage_history: usage,
      reorder_point: ingredient.reorder_point,
      lead_time_days: ingredient.lead_time_days || 3,
      safety_stock: ingredient.safety_stock || 0
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Single reorder alert error:', error);
    throw error;
  }
};
```

### 2. Backend Routes (Express)

Create: `backend/src/routes/forecast-route.js`

```javascript
const express = require('express');
const router = express.Router();
const forecastService = require('../services/forecast-integration');
const { authenticateToken } = require('../middlewares/auth-middleware');

// Get ingredient usage forecast
router.get('/ingredient/:ingredientId/forecast', authenticateToken, async (req, res) => {
  try {
    const { ingredientId } = req.params;
    const days = parseInt(req.query.days) || 7;

    const forecast = await forecastService.forecastIngredientUsage(ingredientId, days);
    res.json(forecast);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get category demand forecast
router.get('/business/:businessId/category/:categoryId/forecast', 
  authenticateToken, 
  async (req, res) => {
    try {
      const { businessId, categoryId } = req.params;
      const days = parseInt(req.query.days) || 14;

      const forecast = await forecastService.forecastCategoryDemand(
        businessId, 
        categoryId, 
        days
      );
      res.json(forecast);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  }
);

// Get revenue forecast
router.get('/business/:businessId/revenue/forecast', 
  authenticateToken, 
  async (req, res) => {
    try {
      const { businessId } = req.params;
      const months = parseInt(req.query.months) || 6;

      const forecast = await forecastService.forecastRevenue(businessId, months);
      res.json(forecast);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  }
);

// Get all reorder alerts for a business
router.get('/business/:businessId/reorder-alerts', 
  authenticateToken, 
  async (req, res) => {
    try {
      const { businessId } = req.params;
      const alerts = await forecastService.getReorderAlerts(businessId);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  }
);

// Check single ingredient reorder alert
router.get('/ingredient/:ingredientId/reorder-alert', 
  authenticateToken, 
  async (req, res) => {
    try {
      const { ingredientId } = req.params;
      const alert = await forecastService.checkSingleReorderAlert(ingredientId);
      res.json(alert);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  }
);

module.exports = router;
```

### 3. Register Route in app.js

```javascript
// In backend/src/app.js

const forecastRoutes = require('./routes/forecast-route');

// Add with other routes
app.use('/api/forecast', forecastRoutes);
```

### 4. React Component Example

Create: `capstter/src/components/dashboard/ReorderAlerts.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReorderAlerts = ({ businessId }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, [businessId]);

  const fetchAlerts = async () => {
    try {
      const response = await axios.get(
        `/api/forecast/business/${businessId}/reorder-alerts`
      );
      setAlerts(response.data.alerts);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CRITICAL': return 'bg-red-500';
      case 'WARNING': return 'bg-yellow-500';
      case 'ATTENTION': return 'bg-orange-500';
      case 'OK': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) return <div>Loading alerts...</div>;

  const criticalAlerts = alerts.filter(a => a.should_reorder);

  return (
    <div className="reorder-alerts">
      <h3>Reorder Alerts ({criticalAlerts.length})</h3>
      
      {criticalAlerts.length === 0 ? (
        <p>✓ All ingredients are well-stocked</p>
      ) : (
        <div className="alerts-list">
          {alerts.map((alert) => (
            <div 
              key={alert.ingredient_id} 
              className={`alert-card ${alert.should_reorder ? 'urgent' : ''}`}
            >
              <div className={`status-badge ${getStatusColor(alert.alert_status)}`}>
                {alert.alert_status}
              </div>
              
              <h4>{alert.ingredient_name}</h4>
              
              <div className="alert-details">
                <p>Current Stock: {alert.current_stock} units</p>
                <p>Days Until Reorder: {alert.days_until_reorder}</p>
                
                {alert.should_reorder && (
                  <div className="recommendation">
                    <strong>Order: {alert.recommended_order_quantity.toFixed(2)} units</strong>
                  </div>
                )}
                
                <p className="alert-message">{alert.alert_message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReorderAlerts;
```

### 5. Environment Variables

Add to `.env`:

```bash
# Forecast Service
FORECAST_SERVICE_URL=http://localhost:8000
```

### 6. Database Schema Requirements

Ensure these tables exist:

```sql
-- Ingredient usage tracking
CREATE TABLE IF NOT EXISTS ingredient_usage (
  usage_id INT PRIMARY KEY AUTO_INCREMENT,
  ingredient_id VARCHAR(50),
  usage_date DATE,
  quantity_used DECIMAL(10,2),
  business_id VARCHAR(50),
  INDEX idx_ingredient_date (ingredient_id, usage_date)
);

-- Inventory management
CREATE TABLE IF NOT EXISTS inventory (
  inventory_id INT PRIMARY KEY AUTO_INCREMENT,
  ingredient_id VARCHAR(50),
  current_stock DECIMAL(10,2),
  reorder_point DECIMAL(10,2),
  lead_time_days INT DEFAULT 3,
  safety_stock DECIMAL(10,2) DEFAULT 0,
  UNIQUE KEY uk_ingredient (ingredient_id)
);
```

### 7. Scheduled Tasks (Optional)

Create a cron job to check alerts daily:

```javascript
// backend/src/jobs/daily-alerts.js
const cron = require('node-cron');
const forecastService = require('../services/forecast-integration');
const pool = require('../config/pool');

// Run daily at 8 AM
cron.schedule('0 8 * * *', async () => {
  try {
    console.log('Running daily reorder alerts check...');
    
    const [businesses] = await pool.execute('SELECT business_id FROM business_table');
    
    for (const business of businesses) {
      const alerts = await forecastService.getReorderAlerts(business.business_id);
      
      if (alerts.total_alerts > 0) {
        // Send notification (email, SMS, push notification)
        console.log(`Business ${business.business_id} has ${alerts.total_alerts} reorder alerts`);
        
        // TODO: Send notification to business owner
      }
    }
  } catch (error) {
    console.error('Daily alerts job error:', error);
  }
});
```

## Usage Examples

### From Frontend

```javascript
// Get ingredient forecast
const forecast = await axios.get('/api/forecast/ingredient/ING-001/forecast?days=7');

// Get revenue forecast
const revenue = await axios.get('/api/forecast/business/BUS-123/revenue/forecast?months=6');

// Get reorder alerts
const alerts = await axios.get('/api/forecast/business/BUS-123/reorder-alerts');

// Check single ingredient
const alert = await axios.get('/api/forecast/ingredient/ING-001/reorder-alert');
```

## Testing

1. Start forecast service: `uvicorn app:app --reload`
2. Start backend: `npm run dev`
3. Start frontend: `npm run dev`
4. Access dashboard and navigate to forecast features
