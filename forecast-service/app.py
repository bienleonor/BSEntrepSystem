from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import pandas as pd
import model

app = FastAPI(
    title="Forecast Service",
    description="Microservice for time series forecasting using ARIMA and SARIMA models",
    version="1.0.0"
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response Models
class DataPoint(BaseModel):
    date: str
    value: float

class ForecastRequest(BaseModel):
    series: List[DataPoint]
    steps: int = Field(default=6, gt=0, le=365, description="Number of periods to forecast")
    seasonal: bool = Field(default=True, description="Use SARIMA (True) or ARIMA (False)")
    seasonal_period: Optional[int] = Field(default=None, description="Seasonal period (e.g., 12 for monthly, 4 for quarterly)")
    confidence_level: float = Field(default=0.95, ge=0.5, le=0.99, description="Confidence interval level")

class ManualForecastRequest(BaseModel):
    series: List[DataPoint]
    steps: int = Field(default=6, gt=0, le=365)
    order: tuple = Field(default=(1, 1, 1), description="ARIMA order (p, d, q)")
    seasonal_order: Optional[tuple] = Field(default=None, description="Seasonal order (P, D, Q, m)")
    confidence_level: float = Field(default=0.95, ge=0.5, le=0.99)

class ModelEvaluationRequest(BaseModel):
    series: List[DataPoint]
    test_size: int = Field(default=6, gt=0, description="Number of periods for testing")
    seasonal: bool = Field(default=True)
    seasonal_period: Optional[int] = Field(default=None)

class IngredientUsageRequest(BaseModel):
    ingredient_id: str
    usage_history: List[DataPoint]
    steps: int = Field(default=7, gt=0, le=90, description="Days to forecast")
    seasonal: bool = Field(default=True)
    seasonal_period: int = Field(default=7, description="Default: weekly pattern")

class CategoryDemandRequest(BaseModel):
    category_id: str
    sales_history: List[DataPoint]
    steps: int = Field(default=30, gt=0, le=365, description="Days to forecast")
    seasonal: bool = Field(default=True)

class RevenueRequest(BaseModel):
    business_id: str
    revenue_history: List[DataPoint]
    steps: int = Field(default=6, gt=0, le=12, description="Months to forecast")
    seasonal: bool = Field(default=True)

class ReorderAlertRequest(BaseModel):
    ingredient_id: str
    current_stock: float
    usage_history: List[DataPoint]
    reorder_point: float = Field(description="Stock level to trigger alert")
    lead_time_days: int = Field(default=3, description="Days to receive new stock")
    safety_stock: float = Field(default=0, description="Additional buffer stock")

@app.get("/")
def root():
    """Health check endpoint"""
    return {
        "service": "Forecast Service",
        "status": "running",
        "models": ["ARIMA", "SARIMA"],
        "version": "1.0.0"
    }

@app.post("/forecast/auto")
def auto_forecast(request: ForecastRequest):
    """
    Automatic SARIMA/ARIMA forecasting using auto_arima for parameter selection.
    
    Returns:
    - Forecast values
    - Confidence intervals
    - Best model parameters
    - Model metrics
    """
    try:
        df = pd.DataFrame([{"date": dp.date, "value": dp.value} for dp in request.series])
        df["date"] = pd.to_datetime(df["date"])
        df.set_index("date", inplace=True)
        df = df.sort_index()

        result = model.run_auto_forecast(
            series=df["value"],
            seasonal=request.seasonal,
            seasonal_period=request.seasonal_period,
            steps=request.steps,
            confidence_level=request.confidence_level
        )

        model_name = f"SARIMA{result['order']}x{result['seasonal_order']}" if request.seasonal else f"ARIMA{result['order']}"

        return {
            "success": True,
            "model": model_name,
            "order": result["order"],
            "seasonal_order": result["seasonal_order"],
            "forecast": result["forecast"],
            "confidence_interval": {
                "lower": result["lower"],
                "upper": result["upper"],
                "level": request.confidence_level
            },
            "metrics": result["metrics"],
            "steps": request.steps
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Forecast error: {str(e)}")

@app.post("/forecast/manual")
def manual_forecast(request: ManualForecastRequest):
    """
    Manual SARIMA/ARIMA forecasting with user-specified parameters.
    
    Use this when you know the optimal model parameters.
    """
    try:
        df = pd.DataFrame([{"date": dp.date, "value": dp.value} for dp in request.series])
        df["date"] = pd.to_datetime(df["date"])
        df.set_index("date", inplace=True)
        df = df.sort_index()

        result = model.run_manual_forecast(
            series=df["value"],
            order=request.order,
            seasonal_order=request.seasonal_order,
            steps=request.steps,
            confidence_level=request.confidence_level
        )

        model_name = f"SARIMA{request.order}x{request.seasonal_order}" if request.seasonal_order else f"ARIMA{request.order}"

        return {
            "success": True,
            "model": model_name,
            "order": request.order,
            "seasonal_order": request.seasonal_order,
            "forecast": result["forecast"],
            "confidence_interval": {
                "lower": result["lower"],
                "upper": result["upper"],
                "level": request.confidence_level
            },
            "metrics": result["metrics"],
            "steps": request.steps
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Forecast error: {str(e)}")

@app.post("/evaluate")
def evaluate_model(request: ModelEvaluationRequest):
    """
    Evaluate forecast model accuracy using train-test split.
    
    Returns:
    - Actual vs predicted values
    - Error metrics (MAE, RMSE, MAPE)
    - Model parameters
    """
    try:
        df = pd.DataFrame([{"date": dp.date, "value": dp.value} for dp in request.series])
        df["date"] = pd.to_datetime(df["date"])
        df.set_index("date", inplace=True)
        df = df.sort_index()

        result = model.evaluate_forecast(
            series=df["value"],
            test_size=request.test_size,
            seasonal=request.seasonal,
            seasonal_period=request.seasonal_period
        )

        return {
            "success": True,
            "model": result["model_name"],
            "metrics": result["metrics"],
            "predictions": result["predictions"],
            "actual": result["actual"],
            "train_size": result["train_size"],
            "test_size": request.test_size
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Evaluation error: {str(e)}")

# ============================================
# BUSINESS-SPECIFIC ENDPOINTS
# ============================================

@app.post("/business/ingredient-usage")
def forecast_ingredient_usage(request: IngredientUsageRequest):
    """
    Forecast ingredient usage for inventory planning.
    
    Use this to predict how much of an ingredient will be used in the coming days/weeks.
    Helps with inventory management and purchasing decisions.
    
    Returns:
    - Daily usage forecast
    - Recommended order quantity
    - Stock depletion date estimate
    """
    try:
        df = pd.DataFrame([{"date": dp.date, "value": dp.value} for dp in request.usage_history])
        df["date"] = pd.to_datetime(df["date"])
        df.set_index("date", inplace=True)
        df = df.sort_index()

        result = model.forecast_ingredient_usage(
            series=df["value"],
            steps=request.steps,
            seasonal=request.seasonal,
            seasonal_period=request.seasonal_period
        )

        return {
            "success": True,
            "ingredient_id": request.ingredient_id,
            "forecast_days": request.steps,
            "daily_usage_forecast": result["forecast"],
            "confidence_interval": {
                "lower": result["lower"],
                "upper": result["upper"]
            },
            "total_forecasted_usage": result["total_usage"],
            "average_daily_usage": result["avg_daily_usage"],
            "peak_usage_day": result["peak_day"],
            "model": result["model_name"],
            "metrics": result["metrics"]
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ingredient usage forecast error: {str(e)}")

@app.post("/business/category-demand")
def forecast_category_demand(request: CategoryDemandRequest):
    """
    Forecast demand for a product category.
    
    Helps businesses understand which categories will be in demand,
    enabling better stock allocation and promotional planning.
    
    Returns:
    - Daily/weekly demand forecast
    - Trend analysis
    - Seasonality patterns
    """
    try:
        df = pd.DataFrame([{"date": dp.date, "value": dp.value} for dp in request.sales_history])
        df["date"] = pd.to_datetime(df["date"])
        df.set_index("date", inplace=True)
        df = df.sort_index()

        result = model.forecast_category_demand(
            series=df["value"],
            steps=request.steps,
            seasonal=request.seasonal
        )

        return {
            "success": True,
            "category_id": request.category_id,
            "forecast_periods": request.steps,
            "demand_forecast": result["forecast"],
            "confidence_interval": {
                "lower": result["lower"],
                "upper": result["upper"]
            },
            "total_forecasted_demand": result["total_demand"],
            "trend": result["trend"],
            "model": result["model_name"],
            "metrics": result["metrics"]
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Category demand forecast error: {str(e)}")

@app.post("/business/revenue")
def forecast_revenue(request: RevenueRequest):
    """
    Forecast total sales revenue for a business.
    
    Essential for financial planning, budgeting, and business growth analysis.
    
    Returns:
    - Monthly revenue forecast
    - Growth rate
    - Revenue targets
    - Financial metrics
    """
    try:
        df = pd.DataFrame([{"date": dp.date, "value": dp.value} for dp in request.revenue_history])
        df["date"] = pd.to_datetime(df["date"])
        df.set_index("date", inplace=True)
        df = df.sort_index()

        result = model.forecast_revenue(
            series=df["value"],
            steps=request.steps,
            seasonal=request.seasonal
        )

        return {
            "success": True,
            "business_id": request.business_id,
            "forecast_months": request.steps,
            "revenue_forecast": result["forecast"],
            "confidence_interval": {
                "lower": result["lower"],
                "upper": result["upper"]
            },
            "total_forecasted_revenue": result["total_revenue"],
            "average_monthly_revenue": result["avg_monthly_revenue"],
            "growth_rate": result["growth_rate"],
            "trend": result["trend"],
            "model": result["model_name"],
            "metrics": result["metrics"]
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Revenue forecast error: {str(e)}")

@app.post("/business/reorder-alert")
def check_reorder_alert(request: ReorderAlertRequest):
    """
    Intelligent reorder point system using forecast data.
    
    Predicts when ingredient stock will hit reorder point and generates alerts.
    Accounts for lead time and safety stock.
    
    Returns:
    - Alert status (CRITICAL, WARNING, OK)
    - Days until reorder needed
    - Recommended order quantity
    - Stock depletion timeline
    """
    try:
        df = pd.DataFrame([{"date": dp.date, "value": dp.value} for dp in request.usage_history])
        df["date"] = pd.to_datetime(df["date"])
        df.set_index("date", inplace=True)
        df = df.sort_index()

        result = model.calculate_reorder_alert(
            series=df["value"],
            current_stock=request.current_stock,
            reorder_point=request.reorder_point,
            lead_time_days=request.lead_time_days,
            safety_stock=request.safety_stock
        )

        return {
            "success": True,
            "ingredient_id": request.ingredient_id,
            "alert_status": result["alert_status"],
            "should_reorder": result["should_reorder"],
            "current_stock": request.current_stock,
            "reorder_point": request.reorder_point,
            "days_until_reorder": result["days_until_reorder"],
            "days_until_stockout": result["days_until_stockout"],
            "recommended_order_quantity": result["recommended_order_qty"],
            "forecasted_usage": {
                "next_7_days": result["usage_next_7_days"],
                "next_14_days": result["usage_next_14_days"],
                "next_30_days": result["usage_next_30_days"]
            },
            "alert_message": result["message"],
            "priority": result["priority"]
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Reorder alert error: {str(e)}")

@app.post("/forecast")
def legacy_forecast(payload: dict):
    """
    Legacy endpoint - maintains backward compatibility
    
    Expects JSON payload like:
    {
        "series": [{"date": "2023-01-01", "value": 120}, ...],
        "steps": 6,
        "seasonal": true
    }
    """
    try:
        df = pd.DataFrame(payload["series"])
        df["date"] = pd.to_datetime(df["date"])
        df.set_index("date", inplace=True)
        df = df.sort_index()

        result = model.run_sarima(
            series=df["value"],
            seasonal=payload.get("seasonal", True),
            m=payload.get("seasonal_period", 12),
            steps=payload.get("steps", 6)
        )

        return {
            "model": f"SARIMA{result['order']}{result['seasonal_order']}",
            "forecast": result["forecast"],
            "confidence": {
                "lower": result["lower"],
                "upper": result["upper"]
            }
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/forecast")
def forecast(payload: dict):
    """
    Expects JSON payload like:
    {
        "series": [{"date": "2023-01-01", "value": 120}, ...],
        "steps": 6,
        "seasonal": true
    }
    """
    try:
        df = pd.DataFrame(payload["series"])
        df["date"] = pd.to_datetime(df["date"])
        df.set_index("date", inplace=True)

        result = model.run_sarima(
            series=df["value"],
            seasonal=payload.get("seasonal", True),
            steps=payload.get("steps", 6)
        )

        return {
            "model": f"SARIMA{result['order']}{result['seasonal_order']}",
            "forecast": result["forecast"],
            "confidence": {
                "lower": result["lower"],
                "upper": result["upper"]
            }
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
