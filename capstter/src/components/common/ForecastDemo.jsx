import React, { useEffect, useState } from 'react';
import useForecast from '../../hooks/useForecast';
import './ForecastDemo.css';

/**
 * Demo component showing all 4 forecast features
 * Use this as a reference for integrating forecasts into your actual components
 */
const ForecastDemo = () => {
  const { loading, error, forecastIngredientUsage, forecastCategoryDemand, forecastRevenue, checkReorderAlert, checkHealth } = useForecast();
  
  const [serviceStatus, setServiceStatus] = useState(null);
  const [ingredientForecast, setIngredientForecast] = useState(null);
  const [categoryForecast, setCategoryForecast] = useState(null);
  const [revenueForecast, setRevenueForecast] = useState(null);
  const [reorderAlert, setReorderAlert] = useState(null);

  // Check service health on mount
  useEffect(() => {
    checkHealth()
      .then(data => setServiceStatus(data))
      .catch(() => setServiceStatus({ status: 'error' }));
  }, []);

  // Example: Forecast ingredient usage
  const testIngredientUsage = async () => {
    try {
      const result = await forecastIngredientUsage(
        'FLOUR-001',
        [
          { date: '2024-01-01', value: 50 },
          { date: '2024-01-02', value: 55 },
          { date: '2024-01-03', value: 52 },
          { date: '2024-01-04', value: 60 },
          { date: '2024-01-05', value: 58 },
          { date: '2024-01-06', value: 62 },
          { date: '2024-01-07', value: 65 },
          { date: '2024-01-08', value: 63 },
          { date: '2024-01-09', value: 68 },
          { date: '2024-01-10', value: 70 }
        ],
        7,
        false
      );
      setIngredientForecast(result);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // Example: Forecast category demand
  const testCategoryDemand = async () => {
    try {
      const result = await forecastCategoryDemand(
        'BEVERAGES',
        [
          { date: '2024-01-01', value: 120 },
          { date: '2024-01-02', value: 125 },
          { date: '2024-01-03', value: 130 },
          { date: '2024-01-04', value: 128 },
          { date: '2024-01-05', value: 135 },
          { date: '2024-01-06', value: 140 },
          { date: '2024-01-07', value: 145 }
        ],
        7,
        false
      );
      setCategoryForecast(result);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // Example: Forecast revenue
  const testRevenue = async () => {
    try {
      const result = await forecastRevenue(
        'BUS-001',
        [
          { date: '2024-01', value: 50000 },
          { date: '2024-02', value: 52000 },
          { date: '2024-03', value: 55000 },
          { date: '2024-04', value: 58000 },
          { date: '2024-05', value: 60000 },
          { date: '2024-06', value: 63000 }
        ],
        6,
        false
      );
      setRevenueForecast(result);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // Example: Check reorder alert
  const testReorderAlert = async () => {
    try {
      const result = await checkReorderAlert(
        'SUGAR-001',
        80,
        [
          { date: '2024-01-01', value: 25 },
          { date: '2024-01-02', value: 30 },
          { date: '2024-01-03', value: 28 },
          { date: '2024-01-04', value: 32 },
          { date: '2024-01-05', value: 29 },
          { date: '2024-01-06', value: 35 },
          { date: '2024-01-07', value: 33 }
        ],
        100,
        3,
        20
      );
      setReorderAlert(result);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div className="forecast-demo">
      <h1>Forecast Service Demo</h1>
      
      {/* Service Status */}
      <div className="status-card">
        <h2>Service Status</h2>
        {serviceStatus ? (
          <div className={`status ${serviceStatus.status}`}>
            Status: {serviceStatus.status}
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>

      {/* Test Buttons */}
      <div className="test-controls">
        <button onClick={testIngredientUsage} disabled={loading}>
          Test Ingredient Usage Forecast
        </button>
        <button onClick={testCategoryDemand} disabled={loading}>
          Test Category Demand Forecast
        </button>
        <button onClick={testRevenue} disabled={loading}>
          Test Revenue Forecast
        </button>
        <button onClick={testReorderAlert} disabled={loading}>
          Test Reorder Alert
        </button>
      </div>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}

      {/* Results Display */}
      <div className="results-grid">
        {/* Ingredient Usage */}
        {ingredientForecast && (
          <div className="result-card">
            <h3>Ingredient Usage Forecast</h3>
            <p><strong>Ingredient:</strong> {ingredientForecast.ingredient_id}</p>
            <p><strong>Total 7-day usage:</strong> {ingredientForecast.total_forecasted_usage.toFixed(2)}</p>
            <p><strong>Average daily:</strong> {ingredientForecast.average_daily_usage.toFixed(2)}</p>
            <p><strong>Peak day:</strong> {ingredientForecast.peak_usage_day.date} ({ingredientForecast.peak_usage_day.value.toFixed(2)})</p>
            <div className="forecast-list">
              {ingredientForecast.forecast.map((f, i) => (
                <div key={i} className="forecast-item">
                  {f.date}: {f.value.toFixed(2)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Demand */}
        {categoryForecast && (
          <div className="result-card">
            <h3>Category Demand Forecast</h3>
            <p><strong>Category:</strong> {categoryForecast.category_id}</p>
            <p><strong>Total demand:</strong> {categoryForecast.total_forecasted_demand.toFixed(2)}</p>
            <p><strong>Average daily:</strong> {categoryForecast.average_daily_demand.toFixed(2)}</p>
            <p><strong>Trend:</strong> {categoryForecast.trend_analysis.trend} ({categoryForecast.trend_analysis.percentage_change.toFixed(2)}%)</p>
            <div className="forecast-list">
              {categoryForecast.forecast.map((f, i) => (
                <div key={i} className="forecast-item">
                  {f.date}: {f.value.toFixed(2)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Revenue */}
        {revenueForecast && (
          <div className="result-card">
            <h3>Revenue Forecast</h3>
            <p><strong>Business:</strong> {revenueForecast.business_id}</p>
            <p><strong>Total revenue:</strong> ${revenueForecast.total_forecasted_revenue.toFixed(2)}</p>
            <p><strong>Average monthly:</strong> ${revenueForecast.average_monthly_revenue.toFixed(2)}</p>
            <p><strong>Growth rate:</strong> {revenueForecast.growth_rate.toFixed(2)}%</p>
            <div className="forecast-list">
              {revenueForecast.forecast.map((f, i) => (
                <div key={i} className="forecast-item">
                  {f.date}: ${f.value.toFixed(2)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reorder Alert */}
        {reorderAlert && (
          <div className={`result-card alert-${reorderAlert.alert_status.toLowerCase()}`}>
            <h3>Reorder Alert</h3>
            <p><strong>Ingredient:</strong> {reorderAlert.ingredient_id}</p>
            <p className={`alert-status ${reorderAlert.alert_status.toLowerCase()}`}>
              <strong>Status:</strong> {reorderAlert.alert_status}
            </p>
            <p><strong>Should reorder:</strong> {reorderAlert.should_reorder ? 'YES' : 'NO'}</p>
            {reorderAlert.should_reorder && (
              <>
                <p><strong>Days until reorder:</strong> {reorderAlert.days_until_reorder}</p>
                <p><strong>Recommended order:</strong> {reorderAlert.recommended_order_quantity.toFixed(2)}</p>
              </>
            )}
            <p><strong>Current stock:</strong> {reorderAlert.current_stock}</p>
            <p><strong>Reorder point:</strong> {reorderAlert.reorder_point}</p>
            <p><strong>Projected stock after {reorderAlert.lead_time_days} days:</strong> {reorderAlert.projected_stock.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForecastDemo;
