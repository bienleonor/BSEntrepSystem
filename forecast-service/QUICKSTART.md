# Quick Start Guide - Forecast Service

## What's Included

This forecast service provides:

### Core Features:
- ✅ **Automatic SARIMA/ARIMA** model selection
- ✅ **Manual parameter** forecasting
- ✅ **Model evaluation** with accuracy metrics

### Business-Specific Features:
- ✅ **Ingredient Usage Forecasting** - Predict daily ingredient consumption
- ✅ **Category Demand Forecasting** - Forecast product category sales
- ✅ **Revenue Forecasting** - Predict monthly business revenue
- ✅ **Reorder Alerts** - Intelligent inventory alerts with lead time

---

## Step 1: Install Dependencies

Open a terminal in the `forecast-service` directory and run:

```powershell
# Install all required packages
pip install -r requirements.txt
```

Or install individually:
```powershell
pip install fastapi uvicorn[standard] pandas numpy statsmodels pmdarima scikit-learn pydantic
```

## Step 2: Start the Service

```powershell
# Development mode with auto-reload
uvicorn app:app --reload --port 8000

# Or specify host and port
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

## Step 3: Test the Service

### Option 1: Browser
Open your browser and go to:
- API Docs: http://localhost:8000/docs
- Alternative Docs: http://localhost:8000/redoc
- Health Check: http://localhost:8000/

### Option 2: Run Test Script
```powershell
python test_forecast.py
```

### Option 3: Run Business Examples
```powershell
# Test all business-specific features
python business_examples.py
```

### Option 4: Manual API Test
```powershell
# Using curl
curl -X POST "http://localhost:8000/forecast/auto" `
  -H "Content-Type: application/json" `
  -d '{
    "series": [
      {"date": "2023-01-01", "value": 100},
      {"date": "2023-02-01", "value": 105},
      {"date": "2023-03-01", "value": 110}
    ],
    "steps": 3,
    "seasonal": false
  }'
```

## Step 4: Integration with Backend

### From Node.js Backend
```javascript
const axios = require('axios');

async function getForecast(salesData, steps = 6) {
  try {
    const response = await axios.post('http://localhost:8000/forecast/auto', {
      series: salesData.map(item => ({
        date: item.date,
        value: item.sales_amount
      })),
      steps: steps,
      seasonal: true,
      seasonal_period: 12
    });
    
    return response.data;
  } catch (error) {
    console.error('Forecast error:', error);
    throw error;
  }
}
```

### From React Frontend
```javascript
const getForecast = async (salesData) => {
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
  
  const result = await response.json();
  return result.forecast;
};
```

## Troubleshooting

### Port Already in Use
```powershell
# Use a different port
uvicorn app:app --reload --port 8001
```

### Module Not Found
```powershell
# Make sure you're in the forecast-service directory
cd forecast-service

# Reinstall dependencies
pip install -r requirements.txt
```

### Import Errors
```powershell
# Check Python version (requires 3.8+)
python --version

# Upgrade pip
python -m pip install --upgrade pip
```

## Production Deployment

For production, use multiple workers:
```powershell
uvicorn app:app --host 0.0.0.0 --port 8000 --workers 4
```

Or use Gunicorn (Linux/Mac):
```bash
gunicorn app:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## Next Steps

1. Configure CORS origins in [app.py](app.py) for your frontend domain
2. Add authentication if needed
3. Set up logging and monitoring
4. Create a systemd service or Docker container for deployment
5. Add caching for frequently requested forecasts

## Need Help?

Check the [README.md](README.md) for detailed API documentation and examples.
