"""
Business-Specific Forecast Examples
====================================

This file demonstrates the new business-specific endpoints:
1. Ingredient Usage Forecasting
2. Category Demand Forecasting
3. Revenue Forecasting
4. Reorder Alerts
"""

import requests
from datetime import datetime, timedelta
import random

BASE_URL = "http://localhost:8000"

# ============================================
# EXAMPLE 1: INGREDIENT USAGE FORECASTING
# ============================================

def example_ingredient_usage():
    """
    Forecast ingredient usage to optimize inventory management.
    Useful for predicting how much flour, sugar, etc. you'll need.
    """
    print("\n" + "=" * 70)
    print("EXAMPLE 1: INGREDIENT USAGE FORECASTING")
    print("=" * 70)
    
    # Simulate 30 days of flour usage (in kg)
    usage_data = []
    base_date = datetime(2024, 1, 1)
    
    for i in range(30):
        date = (base_date + timedelta(days=i)).strftime("%Y-%m-%d")
        # Simulate weekly pattern (higher on weekends)
        day_of_week = i % 7
        base_usage = 50  # 50kg base
        weekend_boost = 20 if day_of_week in [5, 6] else 0
        noise = random.uniform(-5, 5)
        usage = base_usage + weekend_boost + noise
        
        usage_data.append({"date": date, "value": usage})
    
    # Call ingredient usage endpoint
    payload = {
        "ingredient_id": "ING-001",
        "usage_history": usage_data,
        "steps": 7,  # Forecast next 7 days
        "seasonal": True,
        "seasonal_period": 7  # Weekly pattern
    }
    
    response = requests.post(f"{BASE_URL}/business/ingredient-usage", json=payload)
    
    if response.status_code == 200:
        result = response.json()
        print(f"\n✓ Ingredient: {result['ingredient_id']}")
        print(f"Model Used: {result['model']}")
        print(f"\nNext 7 Days Usage Forecast (kg):")
        for i, value in enumerate(result['daily_usage_forecast'], 1):
            lower = result['confidence_interval']['lower'][i-1]
            upper = result['confidence_interval']['upper'][i-1]
            print(f"  Day {i}: {value:.2f} kg (Range: {lower:.2f} - {upper:.2f})")
        
        print(f"\n📊 Summary:")
        print(f"  Total Forecasted Usage: {result['total_forecasted_usage']:.2f} kg")
        print(f"  Average Daily Usage: {result['average_daily_usage']:.2f} kg")
        print(f"  Peak Usage Day: Day {result['peak_usage_day']}")
        
        return result
    else:
        print(f"❌ Error: {response.text}")
        return None

# ============================================
# EXAMPLE 2: CATEGORY DEMAND FORECASTING
# ============================================

def example_category_demand():
    """
    Forecast demand for a product category (e.g., Beverages, Pastries).
    Helps with inventory allocation and promotional planning.
    """
    print("\n" + "=" * 70)
    print("EXAMPLE 2: CATEGORY DEMAND FORECASTING")
    print("=" * 70)
    
    # Simulate 60 days of beverage sales
    sales_data = []
    base_date = datetime(2024, 1, 1)
    
    for i in range(60):
        date = (base_date + timedelta(days=i)).strftime("%Y-%m-%d")
        # Simulate trend + weekly seasonality
        trend = i * 0.5  # Growing trend
        day_of_week = i % 7
        weekend_boost = 30 if day_of_week in [5, 6] else 0
        base_sales = 100
        noise = random.uniform(-10, 10)
        sales = base_sales + trend + weekend_boost + noise
        
        sales_data.append({"date": date, "value": sales})
    
    payload = {
        "category_id": "CAT-BEVERAGES",
        "sales_history": sales_data,
        "steps": 14,  # Forecast next 2 weeks
        "seasonal": True
    }
    
    response = requests.post(f"{BASE_URL}/business/category-demand", json=payload)
    
    if response.status_code == 200:
        result = response.json()
        print(f"\n✓ Category: {result['category_id']}")
        print(f"Model Used: {result['model']}")
        print(f"\nNext 14 Days Demand Forecast:")
        for i, value in enumerate(result['demand_forecast'], 1):
            print(f"  Day {i}: {value:.0f} units")
        
        print(f"\n📊 Summary:")
        print(f"  Total Forecasted Demand: {result['total_forecasted_demand']:.0f} units")
        print(f"  Trend: {result['trend']['direction']} ({result['trend']['percentage']:.1f}%)")
        
        return result
    else:
        print(f"❌ Error: {response.text}")
        return None

# ============================================
# EXAMPLE 3: REVENUE FORECASTING
# ============================================

def example_revenue_forecast():
    """
    Forecast total sales revenue for financial planning.
    Essential for budgeting and growth analysis.
    """
    print("\n" + "=" * 70)
    print("EXAMPLE 3: TOTAL REVENUE FORECASTING")
    print("=" * 70)
    
    # Simulate 18 months of revenue data
    revenue_data = []
    base_date = datetime(2023, 1, 1)
    
    for i in range(18):
        date = (base_date + timedelta(days=i*30)).strftime("%Y-%m-%d")
        # Simulate seasonal business with growth
        month = i % 12
        seasonal_factor = 1.2 if month in [10, 11, 0] else 1.0  # Holiday boost
        base_revenue = 500000
        growth = i * 5000  # Growing business
        noise = random.uniform(-10000, 10000)
        revenue = (base_revenue + growth) * seasonal_factor + noise
        
        revenue_data.append({"date": date, "value": revenue})
    
    payload = {
        "business_id": "BUS-12345",
        "revenue_history": revenue_data,
        "steps": 6,  # Forecast next 6 months
        "seasonal": True
    }
    
    response = requests.post(f"{BASE_URL}/business/revenue", json=payload)
    
    if response.status_code == 200:
        result = response.json()
        print(f"\n✓ Business ID: {result['business_id']}")
        print(f"Model Used: {result['model']}")
        print(f"\nNext 6 Months Revenue Forecast:")
        for i, value in enumerate(result['revenue_forecast'], 1):
            lower = result['confidence_interval']['lower'][i-1]
            upper = result['confidence_interval']['upper'][i-1]
            print(f"  Month {i}: ${value:,.2f} (Range: ${lower:,.2f} - ${upper:,.2f})")
        
        print(f"\n📊 Financial Summary:")
        print(f"  Total Forecasted Revenue: ${result['total_forecasted_revenue']:,.2f}")
        print(f"  Average Monthly Revenue: ${result['average_monthly_revenue']:,.2f}")
        print(f"  Growth Rate: {result['growth_rate']:.2f}%")
        print(f"  Trend: {result['trend']}")
        
        return result
    else:
        print(f"❌ Error: {response.text}")
        return None

# ============================================
# EXAMPLE 4: REORDER ALERTS
# ============================================

def example_reorder_alert():
    """
    Intelligent reorder point system using forecast data.
    Predicts when to reorder based on forecasted usage.
    """
    print("\n" + "=" * 70)
    print("EXAMPLE 4: REORDER ALERTS")
    print("=" * 70)
    
    # Simulate ingredient usage history
    usage_data = []
    base_date = datetime(2024, 1, 1)
    
    for i in range(30):
        date = (base_date + timedelta(days=i)).strftime("%Y-%m-%d")
        # Simulate daily usage with variation
        day_of_week = i % 7
        base_usage = 25  # 25 units per day
        weekend_usage = 35 if day_of_week in [5, 6] else base_usage
        noise = random.uniform(-3, 3)
        usage = weekend_usage + noise
        
        usage_data.append({"date": date, "value": usage})
    
    # Test different stock scenarios
    scenarios = [
        {
            "name": "Critical Stock Level",
            "current_stock": 50,
            "reorder_point": 100,
            "lead_time_days": 3,
            "safety_stock": 20
        },
        {
            "name": "Warning Level",
            "current_stock": 150,
            "reorder_point": 100,
            "lead_time_days": 3,
            "safety_stock": 20
        },
        {
            "name": "Healthy Stock Level",
            "current_stock": 500,
            "reorder_point": 100,
            "lead_time_days": 3,
            "safety_stock": 20
        }
    ]
    
    for scenario in scenarios:
        print(f"\n--- Scenario: {scenario['name']} ---")
        
        payload = {
            "ingredient_id": "ING-FLOUR",
            "current_stock": scenario["current_stock"],
            "usage_history": usage_data,
            "reorder_point": scenario["reorder_point"],
            "lead_time_days": scenario["lead_time_days"],
            "safety_stock": scenario["safety_stock"]
        }
        
        response = requests.post(f"{BASE_URL}/business/reorder-alert", json=payload)
        
        if response.status_code == 200:
            result = response.json()
            
            # Color code based on alert status
            status_emoji = {
                "CRITICAL": "🔴",
                "WARNING": "🟡",
                "ATTENTION": "🟠",
                "OK": "🟢"
            }
            
            print(f"\n{status_emoji.get(result['alert_status'], '⚪')} Status: {result['alert_status']} (Priority: {result['priority']})")
            print(f"Should Reorder: {'YES' if result['should_reorder'] else 'NO'}")
            print(f"Current Stock: {result['current_stock']} units")
            print(f"Reorder Point: {result['reorder_point']} units")
            print(f"\n⏱️ Timeline:")
            print(f"  Days Until Reorder Needed: {result['days_until_reorder']}")
            if result['days_until_stockout']:
                print(f"  Days Until Stockout: {result['days_until_stockout']}")
            
            print(f"\n📦 Recommendation:")
            print(f"  Recommended Order Quantity: {result['recommended_order_quantity']:.2f} units")
            
            print(f"\n📊 Forecasted Usage:")
            print(f"  Next 7 days: {result['forecasted_usage']['next_7_days']:.2f} units")
            print(f"  Next 14 days: {result['forecasted_usage']['next_14_days']:.2f} units")
            print(f"  Next 30 days: {result['forecasted_usage']['next_30_days']:.2f} units")
            
            print(f"\n💬 Alert Message:")
            print(f"  {result['alert_message']}")
        else:
            print(f"❌ Error: {response.text}")

# ============================================
# INTEGRATION EXAMPLES
# ============================================

def example_express_integration():
    """
    Show how to integrate these endpoints with your Express backend
    """
    print("\n" + "=" * 70)
    print("EXPRESS BACKEND INTEGRATION EXAMPLE")
    print("=" * 70)
    
    code = '''
// backend/src/services/business-forecast-service.js

const axios = require('axios');
const pool = require('../config/pool');

const FORECAST_URL = process.env.FORECAST_SERVICE_URL || 'http://localhost:8000';

/**
 * Get ingredient usage forecast
 */
async function getIngredientUsageForecast(ingredientId, days = 7) {
  try {
    // Get usage history from database
    const [rows] = await pool.execute(
      `SELECT DATE(usage_date) as date, SUM(quantity_used) as value
       FROM ingredient_usage
       WHERE ingredient_id = ?
       AND usage_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
       GROUP BY DATE(usage_date)
       ORDER BY date`,
      [ingredientId]
    );

    if (rows.length < 7) {
      throw new Error('Insufficient usage history (need at least 7 days)');
    }

    const response = await axios.post(`${FORECAST_URL}/business/ingredient-usage`, {
      ingredient_id: ingredientId,
      usage_history: rows,
      steps: days,
      seasonal: true,
      seasonal_period: 7
    });

    return response.data;
  } catch (error) {
    console.error('Ingredient forecast error:', error);
    throw error;
  }
}

/**
 * Check reorder alerts for all ingredients
 */
async function checkAllReorderAlerts(businessId) {
  try {
    // Get current stock levels
    const [ingredients] = await pool.execute(
      `SELECT i.ingredient_id, i.name, inv.current_stock, 
              inv.reorder_point, inv.lead_time_days, inv.safety_stock
       FROM ingredients i
       JOIN inventory inv ON i.ingredient_id = inv.ingredient_id
       WHERE i.business_id = ?`,
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
        const response = await axios.post(`${FORECAST_URL}/business/reorder-alert`, {
          ingredient_id: ingredient.ingredient_id,
          current_stock: ingredient.current_stock,
          usage_history: usage,
          reorder_point: ingredient.reorder_point,
          lead_time_days: ingredient.lead_time_days || 3,
          safety_stock: ingredient.safety_stock || 0
        });

        if (response.data.should_reorder) {
          alerts.push({
            ingredient_name: ingredient.name,
            ...response.data
          });
        }
      }
    }

    return alerts;
  } catch (error) {
    console.error('Reorder alerts error:', error);
    throw error;
  }
}

/**
 * Get revenue forecast
 */
async function getRevenueForecast(businessId, months = 6) {
  try {
    const [rows] = await pool.execute(
      `SELECT DATE_FORMAT(sale_date, '%Y-%m-01') as date, 
              SUM(total_amount) as value
       FROM sales
       WHERE business_id = ?
       AND sale_date >= DATE_SUB(CURDATE(), INTERVAL 18 MONTH)
       GROUP BY DATE_FORMAT(sale_date, '%Y-%m')
       ORDER BY date`,
      [businessId]
    );

    const response = await axios.post(`${FORECAST_URL}/business/revenue`, {
      business_id: businessId,
      revenue_history: rows,
      steps: months,
      seasonal: true
    });

    return response.data;
  } catch (error) {
    console.error('Revenue forecast error:', error);
    throw error;
  }
}

module.exports = {
  getIngredientUsageForecast,
  checkAllReorderAlerts,
  getRevenueForecast
};
'''
    
    print(code)

# ============================================
# RUN ALL EXAMPLES
# ============================================

if __name__ == "__main__":
    print("\n" + "=" * 70)
    print("BUSINESS-SPECIFIC FORECAST SERVICE EXAMPLES")
    print("=" * 70)
    print("\nMake sure the forecast service is running:")
    print("  uvicorn app:app --reload")
    print("=" * 70)
    
    try:
        example_ingredient_usage()
        example_category_demand()
        example_revenue_forecast()
        example_reorder_alert()
        example_express_integration()
        
        print("\n" + "=" * 70)
        print("✓ All examples completed successfully!")
        print("=" * 70)
        
    except requests.exceptions.ConnectionError:
        print("\n❌ Cannot connect to forecast service!")
        print("Start it with: uvicorn app:app --reload")
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
