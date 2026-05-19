# Forecast Service Deployment Guide - Railway

## Prerequisites

- Railway account (https://railway.app)
- GitHub account with the repository pushed
- Python 3.9+ (Railway provides this)

## Overview

The Forecast Service is a FastAPI microservice that provides time series forecasting using ARIMA/SARIMA models. It's designed to integrate with your main backend and serve forecasting requests.

## Deployment Steps

### Step 1: Push Code to GitHub

Make sure your forecast-service is pushed to GitHub:

```bash
cd forecast-service
git add .
git commit -m "Prepare forecast-service for Railway deployment"
git push
```

### Step 2: Deploy to Railway

#### Option A: Using Railway CLI (Recommended for first deployment)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
cd forecast-service
railway init
railway up
```

#### Option B: Using Railway Dashboard

1. Go to https://railway.app
2. Create a new project
3. Click "Deploy from GitHub"
4. Select your repository
5. Select the `forecast-service` folder as Root Directory

### Step 3: Configure Environment Variables

In Railway Dashboard → Select Service → Variables, set:

```
ENVIRONMENT=production
ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-railway-backend.up.railway.app
LOG_LEVEL=info
```

**IMPORTANT**: Update the `ALLOWED_ORIGINS` to match your actual frontend and backend URLs.

### Step 4: Verify Deployment

Once deployed, test the health endpoint:

```bash
curl https://your-forecast-service-url/
```

You should get:
```json
{
  "service": "Forecast Service",
  "status": "running",
  "models": ["ARIMA", "SARIMA"],
  "version": "1.0.0"
}
```

API Documentation will be available at:
```
https://your-forecast-service-url/docs
```

## Integration with Backend

The backend needs to know the Forecast Service URL. Add this to your backend environment:

```
FORECAST_SERVICE_URL=https://your-forecast-service-url
```

Then make requests like:

```javascript
// From backend
const forecastResponse = await fetch(
  `${process.env.FORECAST_SERVICE_URL}/forecast/auto`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      series: salesData,
      steps: 6,
      seasonal: true
    })
  }
);
```

## Available Endpoints

### Core Forecasting
- `POST /forecast/auto` - Automatic ARIMA/SARIMA
- `POST /forecast/manual` - Custom parameter forecast
- `POST /evaluate` - Model evaluation with train-test split

### Business Features
- `POST /business/ingredient-usage` - Inventory forecasting
- `POST /business/category-demand` - Category demand prediction
- `POST /business/revenue` - Revenue forecasting
- `POST /business/reorder-alert` - Smart inventory alerts

### Legacy
- `POST /forecast` - Legacy endpoint (backward compatible)

See full documentation at `https://your-service-url/docs`

## Troubleshooting

### Service Won't Start
**Error**: `ModuleNotFoundError` or import errors

**Solution**:
1. Verify `requirements.txt` includes all dependencies
2. Check that Python version is compatible (3.9+)
3. Review logs: Railway Dashboard → Logs tab

### CORS Errors

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
1. Update `ALLOWED_ORIGINS` in Railway variables
2. Include your backend URL and frontend URL
3. Format: `https://url1,https://url2` (comma-separated, no spaces)

### Timeout Issues

**Error**: Request timeouts on large datasets

**Solution**:
- ARIMA models can be slow on large datasets
- Limit `steps` parameter to ≤ 365
- Consider reducing data points before forecasting
- Monitor performance in Railway dashboard

## Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env and set ENVIRONMENT=development

# Run locally
python app.py
# Or: uvicorn app:app --reload --host 0.0.0.0 --port 8000

# Visit http://localhost:8000/docs for API docs
```

## Deployment Checklist

- ✅ Code pushed to GitHub
- ✅ `requirements.txt` up to date with uvicorn
- ✅ `Procfile` present for Railway
- ✅ `.env.example` documents all env vars
- ✅ `.gitignore` excludes venv and __pycache__
- ✅ CORS configured for production URLs
- ✅ Health check endpoint working
- ✅ Backend knows Forecast Service URL

## Environment Variables Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `HOST` | 0.0.0.0 | Bind address (keep as is for Railway) |
| `PORT` | 8000 | Port (Railway overrides this) |
| `ENVIRONMENT` | development | Set to `production` on Railway |
| `ALLOWED_ORIGINS` | localhost | Comma-separated CORS origins |
| `LOG_LEVEL` | info | Log verbosity |

## Monitoring & Logs

In Railway Dashboard:
- Click your Forecast Service
- Select "Logs" tab to view real-time logs
- Select "Metrics" tab to monitor CPU/Memory
- Select "Settings" to view and edit environment variables

## API Rate & Limits

- No built-in rate limiting (add if needed for production)
- Large forecasts (>365 steps) may be slow
- Recommend keeping time series ≤ 1000 data points

## Next Steps

1. ✅ Deploy to Railway
2. ✅ Update backend with `FORECAST_SERVICE_URL`
3. ✅ Update frontend `VITE_API_URL` to point to backend
4. ✅ Test forecast endpoints via API docs
5. ✅ Monitor logs and performance

## Support

For issues:
- Check Railway logs
- Verify CORS configuration
- Test endpoints with curl: `curl -X GET https://your-url/`
- Review FastAPI docs at `/docs` endpoint
