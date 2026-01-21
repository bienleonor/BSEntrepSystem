# FORECAST MICROSERVICE - INTEGRATION COMPLETE ✓

## ✅ What's Working

### 1. Forecast Service (Port 8000)
- ✓ Running at: http://localhost:8000
- ✓ API Docs: http://localhost:8000/docs
- ✓ 14 endpoints active (4 business-specific)
- ✓ All packages installed
- ✓ CORS configured for frontend

### 2. Backend Integration (Port 5000)
- ✓ New route file: `backend/src/routes/forecast-route.js`
- ✓ Registered in: `backend/src/app.js`
- ✓ Base path: `/api/forecast/*`

### 3. Frontend Components
- ✓ Custom hook: `capstter/src/hooks/useForecast.jsx`
- ✓ Demo component: `capstter/src/components/common/ForecastDemo.jsx`
- ✓ Styling: `capstter/src/components/common/ForecastDemo.css`

---

## 🚀 How to Use

### Start the Services

#### 1. Start Forecast Microservice (Terminal 1)
```powershell
cd D:\Projects\Coding\BSEntrepSystem\TRY\BSEntrepSystem\forecast-service
.\start.ps1
```

Or manually:
```powershell
cd D:\Projects\Coding\BSEntrepSystem\TRY\BSEntrepSystem\forecast-service
.\venv\Scripts\uvicorn.exe app:app --reload --port 8000
```

#### 2. Start Backend (Terminal 2)
```powershell
cd D:\Projects\Coding\BSEntrepSystem\TRY\BSEntrepSystem\backend
npm run dev
```

#### 3. Start Frontend (Terminal 3)
```powershell
cd D:\Projects\Coding\BSEntrepSystem\TRY\BSEntrepSystem\capstter
npm run dev
```

---

## 📡 Available Endpoints

### Backend Routes (Your Express API)

All routes are available at: `http://localhost:5000/api/forecast/*`

#### 1. Ingredient Usage Forecast
```http
POST http://localhost:5000/api/forecast/ingredient/usage
Content-Type: application/json

{
  "ingredient_id": "FLOUR-001",
  "usage_history": [
    {"date": "2024-01-01", "value": 50},
    {"date": "2024-01-02", "value": 55}
  ],
  "steps": 7,
  "seasonal": false
}
```

**Response:**
```json
{
  "ingredient_id": "FLOUR-001",
  "forecast": [
    {"date": "2024-01-08", "value": 72.5},
    ...
  ],
  "total_forecasted_usage": 425.8,
  "average_daily_usage": 60.83,
  "peak_usage_day": {"date": "2024-01-14", "value": 75.2}
}
```

#### 2. Category Demand Forecast
```http
POST http://localhost:5000/api/forecast/category/demand
Content-Type: application/json

{
  "category_id": "BEVERAGES",
  "sales_history": [
    {"date": "2024-01-01", "value": 120},
    {"date": "2024-01-02", "value": 125}
  ],
  "steps": 14,
  "seasonal": false
}
```

#### 3. Revenue Forecast
```http
POST http://localhost:5000/api/forecast/revenue
Content-Type: application/json

{
  "business_id": "BUS-001",
  "revenue_history": [
    {"date": "2024-01", "value": 50000},
    {"date": "2024-02", "value": 52000}
  ],
  "steps": 12,
  "seasonal": true,
  "seasonal_period": 12
}
```

#### 4. Reorder Alert
```http
POST http://localhost:5000/api/forecast/reorder-alert
Content-Type: application/json

{
  "ingredient_id": "SUGAR-001",
  "current_stock": 150,
  "usage_history": [
    {"date": "2024-01-01", "value": 25},
    {"date": "2024-01-02", "value": 30}
  ],
  "reorder_point": 100,
  "lead_time_days": 3,
  "safety_stock": 20
}
```

**Response:**
```json
{
  "ingredient_id": "SUGAR-001",
  "alert_status": "WARNING",
  "should_reorder": true,
  "days_until_reorder": 3,
  "recommended_order_quantity": 120.5,
  "current_stock": 150,
  "reorder_point": 100,
  "projected_stock": 75.2,
  "lead_time_days": 3
}
```

#### 5. Health Check
```http
GET http://localhost:5000/api/forecast/health
```

---

## 🎯 Frontend Usage

### Using the Custom Hook

```javascript
import useForecast from '../../hooks/useForecast';

function MyComponent() {
  const { loading, error, forecastIngredientUsage } = useForecast();

  const handleForecast = async () => {
    try {
      const result = await forecastIngredientUsage(
        'FLOUR-001',
        [
          { date: '2024-01-01', value: 50 },
          { date: '2024-01-02', value: 55 }
        ],
        7,
        false
      );
      
      console.log('Total usage:', result.total_forecasted_usage);
      console.log('Peak day:', result.peak_usage_day);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div>
      <button onClick={handleForecast} disabled={loading}>
        Get Forecast
      </button>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
```

### Demo Component

To test all features, add the demo component to your routes:

```javascript
// In your routes file
import ForecastDemo from '../components/common/ForecastDemo';

// Add route
<Route path="/forecast-demo" element={<ForecastDemo />} />
```

Then visit: `http://localhost:5173/forecast-demo`

---

## 🔧 Integration Examples

### 1. Dashboard Widget - Revenue Forecast
```javascript
import { useEffect, useState } from 'react';
import useForecast from '../hooks/useForecast';

function RevenueDashboard({ businessId, revenueData }) {
  const { forecastRevenue } = useForecast();
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    const getForecast = async () => {
      const result = await forecastRevenue(businessId, revenueData, 6, false);
      setForecast(result);
    };
    getForecast();
  }, [businessId]);

  return (
    <div className="revenue-forecast">
      <h3>Revenue Forecast (Next 6 Months)</h3>
      {forecast && (
        <>
          <p>Total: ${forecast.total_forecasted_revenue.toFixed(2)}</p>
          <p>Growth: {forecast.growth_rate.toFixed(2)}%</p>
        </>
      )}
    </div>
  );
}
```

### 2. Inventory Page - Reorder Alerts
```javascript
import { useEffect, useState } from 'react';
import useForecast from '../hooks/useForecast';

function IngredientRow({ ingredient, usageHistory }) {
  const { checkReorderAlert } = useForecast();
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const checkAlert = async () => {
      const result = await checkReorderAlert(
        ingredient.id,
        ingredient.current_stock,
        usageHistory,
        ingredient.reorder_point,
        3,
        20
      );
      setAlert(result);
    };
    checkAlert();
  }, [ingredient]);

  return (
    <tr className={`alert-${alert?.alert_status.toLowerCase()}`}>
      <td>{ingredient.name}</td>
      <td>{ingredient.current_stock}</td>
      <td className={`status ${alert?.alert_status.toLowerCase()}`}>
        {alert?.alert_status}
      </td>
      {alert?.should_reorder && (
        <td>Order {alert.recommended_order_quantity.toFixed(0)} units</td>
      )}
    </tr>
  );
}
```

### 3. Analytics Page - Category Trends
```javascript
function CategoryAnalytics({ categoryId, salesHistory }) {
  const { forecastCategoryDemand } = useForecast();
  const [demand, setDemand] = useState(null);

  useEffect(() => {
    const analyze = async () => {
      const result = await forecastCategoryDemand(
        categoryId,
        salesHistory,
        14,
        false
      );
      setDemand(result);
    };
    analyze();
  }, [categoryId]);

  return (
    <div className="category-trend">
      <h4>{categoryId}</h4>
      {demand && (
        <>
          <p>Trend: {demand.trend_analysis.trend}</p>
          <p>Change: {demand.trend_analysis.percentage_change.toFixed(1)}%</p>
          <p>Average daily: {demand.average_daily_demand.toFixed(0)}</p>
        </>
      )}
    </div>
  );
}
```

---

## 📊 Alert Status Levels

### Reorder Alert Priority:
- **CRITICAL** 🔴 - Stock will run out before lead time
- **WARNING** 🟡 - Should reorder now
- **ATTENTION** 🔵 - Reorder soon
- **OK** 🟢 - Stock sufficient

---

## 🛠️ Troubleshooting

### Forecast service not connecting:
1. Check if forecast service is running: `http://localhost:8000/`
2. Check backend logs for connection errors
3. Verify CORS settings allow your frontend origin

### Backend can't reach forecast service:
1. Make sure forecast service is on port 8000
2. Check `FORECAST_SERVICE_URL` in backend `.env` (should be `http://localhost:8000`)
3. Try health check: `GET http://localhost:5000/api/forecast/health`

### Frontend errors:
1. Make sure backend is running on port 5000
2. Check `VITE_API_BASE_URL` in frontend `.env`
3. Check browser console for CORS errors

---

## 🎉 Integration Complete!

Your forecast microservice is now fully integrated with your backend and frontend:

✅ **4 Business Features**
- Ingredient Usage Forecasting
- Category Demand Forecasting  
- Revenue Forecasting
- Reorder Alerts

✅ **Full Stack Integration**
- Python FastAPI microservice (Port 8000)
- Express.js backend proxy (Port 5000)
- React frontend components

✅ **Ready for Production**
- CORS configured
- Error handling
- Type validation
- Auto-reload enabled

---

## 📚 Documentation Files

- `INTEGRATION.md` - Detailed integration guide
- `BUSINESS_FEATURES.md` - Feature documentation
- `API_REFERENCE.txt` - Complete API reference
- `QUICKSTART.md` - Quick start guide
- `business_examples.py` - Python usage examples
- `integration_test.py` - Service testing script

---

**Need help?** Check the API docs at http://localhost:8000/docs when the service is running.
