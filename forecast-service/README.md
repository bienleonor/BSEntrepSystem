# Forecast Service - ARIMA & SARIMA Microservice

A FastAPI microservice for time series forecasting using ARIMA and SARIMA models.

## Features

- **Automatic Forecasting**: Auto-selects optimal ARIMA/SARIMA parameters using `auto_arima`
- **Manual Forecasting**: Specify custom model parameters
- **Model Evaluation**: Train-test split with error metrics (MAE, RMSE, MAPE)
- **Confidence Intervals**: Configurable confidence levels
- **CORS Support**: Ready for frontend integration

## Installation

```bash
# Install dependencies
pip install -r requirements.txt

# Or install manually
pip install fastapi uvicorn pandas numpy statsmodels pmdarima scikit-learn pydantic
```

## Running the Service

```bash
# Development mode with auto-reload
uvicorn app:app --reload --host 0.0.0.0 --port 8000

# Production mode
uvicorn app:app --host 0.0.0.0 --port 8000 --workers 4
```

The service will be available at `http://localhost:8000`

## API Endpoints

### 1. Health Check
```http
GET /
```

### Core Forecasting Endpoints

### 2. Automatic Forecast
```http
POST /forecast/auto
```

**Request Body:**
```json
{
  "series": [
    {"date": "2023-01-01", "value": 120},
    {"date": "2023-02-01", "value": 135},
    {"date": "2023-03-01", "value": 150}
  ],
  "steps": 6,
  "seasonal": true,
  "seasonal_period": 12,
  "confidence_level": 0.95
}
```

**Response:**
```json
{
  "success": true,
  "model": "SARIMA(1,1,1)x(1,1,1,12)",
  "order": [1, 1, 1],
  "seasonal_order": [1, 1, 1, 12],
  "forecast": [155.2, 160.5, 165.8, 171.1, 176.4, 181.7],
  "confidence_interval": {
    "lower": [145.1, 148.3, 151.6, 154.9, 158.2, 161.5],
    "upper": [165.3, 172.7, 180.0, 187.3, 194.6, 201.9],
    "level": 0.95
  },
  "metrics": {
    "aic": 245.6,
    "bic": 253.2,
    "aicc": 247.1
  },
  "steps": 6
}
```

### 3. Manual Forecast
```http
POST /forecast/manual
```

**Request Body:**
```json
{
  "series": [
    {"date": "2023-01-01", "value": 120},
    {"date": "2023-02-01", "value": 135}
  ],
  "steps": 6,
  "order": [1, 1, 1],
  "seasonal_order": [1, 1, 1, 12],
  "confidence_level": 0.95
}
```

### 4. Model Evaluation
```http
POST /evaluate
```

**Request Body:**
```json
{
  "series": [
    {"date": "2023-01-01", "value": 120},
    {"date": "2023-02-01", "value": 135}
  ],
  "test_size": 6,
  "seasonal": true,
  "seasonal_period": 12
}
```

**Response:**
```json
{
  "success": true,
  "model": "SARIMA(1,1,1)x(1,1,1,12)",
  "metrics": {
    "mae": 5.2,
    "rmse": 6.8,
    "mape": 3.5,
    "aic": 245.6,
    "bic": 253.2
  },
  "predictions": [155.2, 160.5, 165.8, 171.1, 176.4, 181.7],
  "actual": [157.0, 162.0, 168.0, 173.0, 178.0, 183.0],
  "train_size": 18,
  "test_size": 6
}
```

### 5. Legacy Endpoint
```http
POST /forecast
```

Maintained for backward compatibility.

---

## Business-Specific Endpoints

### 6. Ingredient Usage Forecast
```http
POST /business/ingredient-usage
```

Forecast ingredient usage for inventory management.

**Request Body:**
```json
{
  "ingredient_id": "ING-001",
  "usage_history": [
    {"date": "2024-01-01", "value": 50.5},
    {"date": "2024-01-02", "value": 52.0}
  ],
  "steps": 7,
  "seasonal": true,
  "seasonal_period": 7
}
```

**Response:**
```json
{
  "success": true,
  "ingredient_id": "ING-001",
  "forecast_days": 7,
  "daily_usage_forecast": [48.5, 49.2, 50.1, 51.0, 65.2, 67.5, 52.3],
  "confidence_interval": {
    "lower": [45.2, 46.0, 47.1, 48.0, 62.0, 64.0, 49.0],
    "upper": [51.8, 52.4, 53.1, 54.0, 68.4, 71.0, 55.6]
  },
  "total_forecasted_usage": 383.8,
  "average_daily_usage": 54.8,
  "peak_usage_day": 6,
  "model": "SARIMA(1,1,1)x(1,1,1,7)",
  "metrics": {"aic": 245.6, "bic": 253.2}
}
```

### 7. Category Demand Forecast
```http
POST /business/category-demand
```

Forecast demand for product categories.

**Request Body:**
```json
{
  "category_id": "CAT-BEVERAGES",
  "sales_history": [
    {"date": "2024-01-01", "value": 120},
### General Forecasting
1. **Minimum Data**: Provide at least 20+ observations for reliable forecasts
2. **Seasonal Period**: Set appropriately (12 for monthly, 7 for daily/weekly)
3. **Test Size**: Use 10-20% of data for evaluation
4. **Confidence Level**: Common values are 0.90, 0.95, 0.99

### Business-Specific
1. **Ingredient Usage**: 
   - Collect at least 2 weeks of daily usage data
   - Account for weekly patterns (weekends vs weekdays)
   - Update forecasts weekly or when usage patterns change

2. **Category Demand**:
   - Track daily or weekly sales by category
   - Consider promotional events that skew data
   - Seasonal businesses: collect data across full year

3. **Revenue Forecasting**:
   - Use monthly data for best results
   - Need minimum 12-18 months of history
   - Account for business growth and market changes

4. **Reorder Alerts**:
   - Set reorder point at: (avg daily usage × lead time) + safety stock
   - Lead time = days from order to delivery
   - Safety stock = buffer for uncertainty (typically 3-7 days usage)
   - Check alerts daily for critical ingredients
}
```

**Response:**
```json
{
  "success": true,
  "category_id": "CAT-BEVERAGES",
  "forecast_periods": 14,
  "demand_forecast": [140, 142, 145, 148, 165, 168, 150, ...],
  "confidence_interval": {
    "lower": [130, 132, 135, ...],
    "upper": [150, 152, 155, ...]
  },
  "total_forecasted_demand": 2050,
  "trend": {
    "direction": "growing",
    "percentage": 8.5
  },
  "model": "SARIMA(1,1,1)x(1,1,1,7)"
}
```

### 8. Total Revenue Forecast
```http
POST /business/revenue
```

Forecast total sales revenue for financial planning.

**Request Body:**
```json
{
  "business_id": "BUS-12345",
  "revenue_history": [
    {"date": "2023-01-01", "value": 50000},
    {"date": "2023-02-01", "value": 52000}
  ],
  "steps": 6,
  "seasonal": true
}
```

**Response:**
```json
{
  "success": true,
  "business_id": "BUS-12345",
  "forecast_months": 6,
  "revenue_forecast": [55000, 57000, 59000, 61000, 63000, 65000],
  "confidence_interval": {
    "lower": [52000, 54000, 56000, 58000, 60000, 62000],
    "upper": [58000, 60000, 62000, 64000, 66000, 68000]
  },
  "total_forecasted_revenue": 360000,
  "average_monthly_revenue": 60000,
  "growth_rate": 8.5,
  "trend": "increasing",
  "model": "SARIMA(1,1,1)x(1,1,1,12)"
}
```

### 9. Reorder Alerts
```http
POST /business/reorder-alert
```

Intelligent reorder point system using forecast data.

**Request Body:**
```json
{
  "ingredient_id": "ING-FLOUR",
  "current_stock": 150,
  "usage_history": [
    {"date": "2024-01-01", "value": 25},
    {"date": "2024-01-02", "value": 28}
  ],
  "reorder_point": 100,
  "lead_time_days": 3,
  "safety_stock": 20
}
```

**Response:**
```json
{
  "success": true,
  "ingredient_id": "ING-FLOUR",
  "alert_status": "WARNING",
  "should_reorder": true,
  "current_stock": 150,
  "reorder_point": 100,
  "days_until_reorder": 2,
  "days_until_stockout": 5,
  "recommended_order_quantity": 250.5,
  "forecasted_usage": {
    "next_7_days": 180.5,
    "next_14_days": 361.0,
    "next_30_days": 775.2
  },
  "alert_message": "Stock will hit reorder point in 2 days. Order now to avoid stockout.",
  "priority": "MEDIUM"
}
```

**Alert Status Levels:**
- `CRITICAL` - Stock at/below reorder point, order immediately
- `WARNING` - Will hit reorder point within lead time
- `ATTENTION` - Will hit reorder point soon, monitor closely
- `OK` - Stock levels healthy

---

## Legacy Endpoint

### 10. Basic Forecast (Legacy)
```http
POST /forecast
```

Maintained for backward compatibility.

## Model Parameters

### ARIMA
- **p**: Autoregressive order
- **d**: Differencing order  
- **q**: Moving average order

### SARIMA
- **P**: Seasonal autoregressive order
- **D**: Seasonal differencing order
- **Q**: Seasonal moving average order
- **m**: Seasonal period (12=monthly, 4=quarterly, 7=weekly)

## Integration Example

### JavaScript/Fetch
```javascript
const response = await fetch('http://localhost:8000/forecast/auto', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    series: salesData,
    steps: 6,
    seasonal: true,
    seasonal_period: 12
  })
});

const forecast = await response.json();
console.log(forecast.forecast);
```

### Python/Requests
```python
import requests

response = requests.post('http://localhost:8000/forecast/auto', json={
    'series': [{'date': '2023-01-01', 'value': 120}, ...],
    'steps': 6,
    'seasonal': True,
    'seasonal_period': 12
})

forecast = response.json()
print(forecast['forecast'])
```

## Error Metrics

- **MAE** (Mean Absolute Error): Average absolute difference
- **RMSE** (Root Mean Squared Error): Square root of average squared differences
- **MAPE** (Mean Absolute Percentage Error): Average percentage error
- **AIC** (Akaike Information Criterion): Model quality metric
- **BIC** (Bayesian Information Criterion): Model quality metric

## Best Practices

1. **Minimum Data**: Provide at least 20+ observations for reliable forecasts
2. **Seasonal Period**: Set appropriately (12 for monthly, 4 for quarterly)
3. **Test Size**: Use 10-20% of data for evaluation
4. **Confidence Level**: Common values are 0.90, 0.95, 0.99

## Troubleshooting

- **"Series too short"**: Provide more historical data points
- **Poor forecast accuracy**: Try adjusting seasonal_period or use manual parameters
- **Long processing time**: Reduce max_p, max_q parameters in model.py

## License

Part of BSEntrepSystem project
