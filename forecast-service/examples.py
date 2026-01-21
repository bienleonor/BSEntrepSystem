"""
Example Integration: Sales Forecasting for BSEntrepSystem
===========================================================

This file demonstrates how to integrate the forecast service
with your business system for sales prediction.
"""

import requests
from datetime import datetime, timedelta
from typing import List, Dict

class ForecastClient:
    """Client for interacting with the forecast service"""
    
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
    
    def predict_sales(self, sales_data: List[Dict], months_ahead: int = 6) -> Dict:
        """
        Predict future sales based on historical data
        
        Args:
            sales_data: List of dicts with 'date' and 'sales_amount' keys
            months_ahead: Number of months to forecast
            
        Returns:
            Dict with forecast, confidence intervals, and metrics
        """
        # Transform data to expected format
        series = [
            {"date": item["date"], "value": item["sales_amount"]}
            for item in sales_data
        ]
        
        payload = {
            "series": series,
            "steps": months_ahead,
            "seasonal": True,
            "seasonal_period": 12,  # Monthly seasonality
            "confidence_level": 0.95
        }
        
        response = requests.post(f"{self.base_url}/forecast/auto", json=payload)
        response.raise_for_status()
        
        return response.json()
    
    def evaluate_forecast_accuracy(self, sales_data: List[Dict], test_months: int = 6) -> Dict:
        """
        Evaluate how accurate the forecast would have been
        
        Args:
            sales_data: Historical sales data
            test_months: Number of recent months to use for testing
            
        Returns:
            Dict with error metrics and predictions vs actual
        """
        series = [
            {"date": item["date"], "value": item["sales_amount"]}
            for item in sales_data
        ]
        
        payload = {
            "series": series,
            "test_size": test_months,
            "seasonal": True,
            "seasonal_period": 12
        }
        
        response = requests.post(f"{self.base_url}/evaluate", json=payload)
        response.raise_for_status()
        
        return response.json()


# Example 1: Simple Sales Forecast
def example_simple_forecast():
    """Basic example: Forecast next 6 months of sales"""
    print("\n=== Example 1: Simple Sales Forecast ===\n")
    
    # Sample sales data from your database
    sales_data = [
        {"date": "2023-01-01", "sales_amount": 50000},
        {"date": "2023-02-01", "sales_amount": 52000},
        {"date": "2023-03-01", "sales_amount": 55000},
        {"date": "2023-04-01", "sales_amount": 53000},
        {"date": "2023-05-01", "sales_amount": 58000},
        {"date": "2023-06-01", "sales_amount": 60000},
        {"date": "2023-07-01", "sales_amount": 62000},
        {"date": "2023-08-01", "sales_amount": 61000},
        {"date": "2023-09-01", "sales_amount": 65000},
        {"date": "2023-10-01", "sales_amount": 67000},
        {"date": "2023-11-01", "sales_amount": 70000},
        {"date": "2023-12-01", "sales_amount": 75000},
    ]
    
    client = ForecastClient()
    result = client.predict_sales(sales_data, months_ahead=6)
    
    print(f"Model Used: {result['model']}")
    print(f"\nForecast for next 6 months:")
    for i, value in enumerate(result['forecast'], 1):
        lower = result['confidence_interval']['lower'][i-1]
        upper = result['confidence_interval']['upper'][i-1]
        print(f"  Month {i}: ${value:,.2f} (Range: ${lower:,.2f} - ${upper:,.2f})")
    
    print(f"\nModel Quality Metrics:")
    print(f"  AIC: {result['metrics']['aic']:.2f}")
    print(f"  BIC: {result['metrics']['bic']:.2f}")


# Example 2: Business-Specific Forecast
def example_business_forecast():
    """Forecast for a specific business in your system"""
    print("\n=== Example 2: Business-Specific Forecast ===\n")
    
    # This would come from your database query
    # SELECT date, SUM(sales_amount) as total_sales 
    # FROM sales WHERE business_id = ? 
    # GROUP BY date ORDER BY date
    
    business_sales = [
        {"date": "2024-01-01", "sales_amount": 15000},
        {"date": "2024-02-01", "sales_amount": 16500},
        {"date": "2024-03-01", "sales_amount": 17200},
        {"date": "2024-04-01", "sales_amount": 16800},
        {"date": "2024-05-01", "sales_amount": 18500},
        {"date": "2024-06-01", "sales_amount": 19200},
        {"date": "2024-07-01", "sales_amount": 20000},
        {"date": "2024-08-01", "sales_amount": 19500},
        {"date": "2024-09-01", "sales_amount": 21000},
        {"date": "2024-10-01", "sales_amount": 22000},
        {"date": "2024-11-01", "sales_amount": 23500},
        {"date": "2024-12-01", "sales_amount": 25000},
    ]
    
    client = ForecastClient()
    
    # Get forecast
    forecast = client.predict_sales(business_sales, months_ahead=3)
    
    print("3-Month Sales Forecast:")
    for i, value in enumerate(forecast['forecast'], 1):
        print(f"  Month {i}: ${value:,.2f}")
    
    # Evaluate accuracy
    if len(business_sales) >= 18:  # Need enough data
        evaluation = client.evaluate_forecast_accuracy(business_sales, test_months=3)
        print(f"\nForecast Accuracy Metrics:")
        print(f"  MAE: ${evaluation['metrics']['mae']:,.2f}")
        print(f"  RMSE: ${evaluation['metrics']['rmse']:,.2f}")
        print(f"  MAPE: {evaluation['metrics']['mape']:.2f}%")


# Example 3: Product-Level Forecast
def example_product_forecast():
    """Forecast sales for a specific product"""
    print("\n=== Example 3: Product-Level Forecast ===\n")
    
    # Daily sales data for a product
    product_sales = []
    base_date = datetime(2024, 1, 1)
    
    for i in range(60):  # 60 days of data
        date = (base_date + timedelta(days=i)).strftime("%Y-%m-%d")
        # Simulate weekly seasonality
        weekly_pattern = 100 + (i % 7) * 10
        trend = i * 2
        sales = weekly_pattern + trend + (i * 0.5)
        
        product_sales.append({
            "date": date,
            "sales_amount": sales
        })
    
    client = ForecastClient()
    
    # Forecast next 14 days
    series = [{"date": item["date"], "value": item["sales_amount"]} for item in product_sales]
    
    payload = {
        "series": series,
        "steps": 14,
        "seasonal": True,
        "seasonal_period": 7,  # Weekly seasonality
        "confidence_level": 0.90
    }
    
    response = requests.post("http://localhost:8000/forecast/auto", json=payload)
    result = response.json()
    
    print("14-Day Product Sales Forecast:")
    for i, value in enumerate(result['forecast'], 1):
        print(f"  Day {i}: {value:.2f} units")


# Example 4: Integration with Express Backend
def example_express_integration():
    """
    Example of how to call this from your Express/Node.js backend
    """
    print("\n=== Example 4: Express Backend Integration ===\n")
    
    express_code = '''
// In your Express backend (backend/src/services/forecast-service.js)

const axios = require('axios');

const FORECAST_SERVICE_URL = process.env.FORECAST_SERVICE_URL || 'http://localhost:8000';

async function getForecastForBusiness(businessId, monthsAhead = 6) {
  try {
    // 1. Get sales data from database
    const salesData = await pool.execute(
      `SELECT DATE_FORMAT(sale_date, '%Y-%m-%d') as date, 
              SUM(total_amount) as sales_amount
       FROM sales 
       WHERE business_id = ?
       GROUP BY DATE_FORMAT(sale_date, '%Y-%m-01')
       ORDER BY date`,
      [businessId]
    );
    
    const [rows] = salesData;
    
    if (rows.length < 12) {
      throw new Error('Insufficient data for forecasting (need at least 12 months)');
    }
    
    // 2. Call forecast service
    const response = await axios.post(`${FORECAST_SERVICE_URL}/forecast/auto`, {
      series: rows.map(row => ({
        date: row.date,
        value: parseFloat(row.sales_amount)
      })),
      steps: monthsAhead,
      seasonal: true,
      seasonal_period: 12,
      confidence_level: 0.95
    });
    
    // 3. Return forecast data
    return {
      success: true,
      business_id: businessId,
      forecast: response.data.forecast,
      confidence_interval: response.data.confidence_interval,
      model: response.data.model,
      metrics: response.data.metrics
    };
    
  } catch (error) {
    console.error('Forecast error:', error);
    throw new Error('Failed to generate forecast: ' + error.message);
  }
}

// Express route
router.get('/api/business/:businessId/forecast', async (req, res) => {
  try {
    const { businessId } = req.params;
    const monthsAhead = parseInt(req.query.months) || 6;
    
    const forecast = await getForecastForBusiness(businessId, monthsAhead);
    res.json(forecast);
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = { getForecastForBusiness };
'''
    
    print(express_code)


# Example 5: React Component Integration
def example_react_integration():
    """
    Example React component for displaying forecasts
    """
    print("\n=== Example 5: React Component Integration ===\n")
    
    react_code = '''
// React component (capstter/src/components/dashboard/SalesForecast.jsx)

import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

const SalesForecast = ({ businessId }) => {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const response = await axios.get(
          `/api/business/${businessId}/forecast?months=6`
        );
        setForecast(response.data);
      } catch (error) {
        console.error('Failed to fetch forecast:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [businessId]);

  if (loading) return <div>Loading forecast...</div>;
  if (!forecast) return <div>Unable to generate forecast</div>;

  const chartData = {
    labels: forecast.forecast.map((_, i) => `Month ${i + 1}`),
    datasets: [
      {
        label: 'Forecast',
        data: forecast.forecast,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
      {
        label: 'Lower Bound (95% CI)',
        data: forecast.confidence_interval.lower,
        borderColor: 'rgba(75, 192, 192, 0.5)',
        borderDash: [5, 5],
        fill: false,
      },
      {
        label: 'Upper Bound (95% CI)',
        data: forecast.confidence_interval.upper,
        borderColor: 'rgba(75, 192, 192, 0.5)',
        borderDash: [5, 5],
        fill: false,
      },
    ],
  };

  return (
    <div className="sales-forecast">
      <h3>6-Month Sales Forecast</h3>
      <p>Model: {forecast.model}</p>
      <Line data={chartData} />
      <div className="forecast-metrics">
        <p>AIC: {forecast.metrics.aic.toFixed(2)}</p>
        <p>BIC: {forecast.metrics.bic.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default SalesForecast;
'''
    
    print(react_code)


if __name__ == "__main__":
    print("=" * 70)
    print("BSEntrepSystem - Forecast Service Integration Examples")
    print("=" * 70)
    
    # Run examples (comment out as needed)
    try:
        example_simple_forecast()
        example_business_forecast()
        # example_product_forecast()  # Uncomment to run
        example_express_integration()
        example_react_integration()
        
    except requests.exceptions.ConnectionError:
        print("\n⚠️  Forecast service is not running!")
        print("Start it with: uvicorn app:app --reload")
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
