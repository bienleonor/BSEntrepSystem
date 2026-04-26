import pandas as pd
import numpy as np
from pmdarima import auto_arima
from statsmodels.tsa.statespace.sarimax import SARIMAX
from sklearn.metrics import mean_absolute_error, mean_squared_error
import warnings
warnings.filterwarnings('ignore')

def calculate_mape(actual, predicted):
    """Calculate Mean Absolute Percentage Error"""
    actual, predicted = np.array(actual), np.array(predicted)
    return np.mean(np.abs((actual - predicted) / actual)) * 100

def get_model_metrics(model_fit):
    """Extract model performance metrics"""
    try:
        return {
            "aic": float(model_fit.aic()),
            "bic": float(model_fit.bic()),
            "aicc": float(model_fit.aicc()) if hasattr(model_fit, 'aicc') else None
        }
    except:
        return {"aic": None, "bic": None, "aicc": None}

def run_sarima(series, seasonal=True, m=12, steps=6):
    """Legacy function - Fits SARIMA/ARIMA"""
    model = auto_arima(
        series,
        seasonal=seasonal,
        m=m,
        suppress_warnings=True,
        error_action="ignore"
    )
    forecast, conf_int = model.predict(n_periods=steps, return_conf_int=True)
    return {
        "order": model.order,
        "seasonal_order": model.seasonal_order,
        "forecast": forecast.tolist(),
        "lower": conf_int[:, 0].tolist(),
        "upper": conf_int[:, 1].tolist()
    }

def run_auto_forecast(series, seasonal=True, seasonal_period=None, steps=6, confidence_level=0.95):
    """Automatic SARIMA/ARIMA model selection and forecasting"""
    if seasonal and seasonal_period is None:
        seasonal_period = 12 if len(series) >= 24 else None
        if seasonal_period is None:
            seasonal = False
    
    m_value = int(seasonal_period) if seasonal and seasonal_period else 1
    
    model = auto_arima(
        series,
        seasonal=seasonal,
        m=m_value,
        start_p=0, start_q=0,
        max_p=5, max_q=5,
        start_P=0, start_Q=0,
        max_P=2, max_Q=2,
        d=None, D=None,
        trace=False,
        error_action='ignore',
        suppress_warnings=True,
        stepwise=True,
        random_state=42
    )
    
    alpha = 1 - confidence_level
    forecast, conf_int = model.predict(n_periods=steps, return_conf_int=True, alpha=alpha)
    metrics = get_model_metrics(model)
    
    return {
        "order": model.order,
        "seasonal_order": model.seasonal_order if seasonal else (0, 0, 0, 0),
        "forecast": forecast.tolist(),
        "lower": conf_int[:, 0].tolist(),
        "upper": conf_int[:, 1].tolist(),
        "metrics": metrics
    }

def run_manual_forecast(series, order, seasonal_order=None, steps=6, confidence_level=0.95):
    """Manual SARIMA/ARIMA forecasting with specified parameters"""
    model = SARIMAX(
        series,
        order=order,
        seasonal_order=seasonal_order if seasonal_order else (0, 0, 0, 0),
        enforce_stationarity=False,
        enforce_invertibility=False
    )
    
    model_fit = model.fit(disp=False)
    alpha = 1 - confidence_level
    forecast_result = model_fit.get_forecast(steps=steps, alpha=alpha)
    forecast = forecast_result.predicted_mean
    conf_int = forecast_result.conf_int()
    metrics = get_model_metrics(model_fit)
    
    return {
        "forecast": forecast.tolist(),
        "lower": conf_int.iloc[:, 0].tolist(),
        "upper": conf_int.iloc[:, 1].tolist(),
        "metrics": metrics
    }

def evaluate_forecast(series, test_size=6, seasonal=True, seasonal_period=None):
    """Evaluate forecast model accuracy using train-test split"""
    if len(series) < test_size + 10:
        raise ValueError(f"Series too short for test_size={test_size}")
    
    train = series[:-test_size]
    test = series[-test_size:]
    
    if seasonal and seasonal_period is None:
        seasonal_period = 12 if len(train) >= 24 else None
        if seasonal_period is None:
            seasonal = False
    
    m_value = int(seasonal_period) if seasonal and seasonal_period else 1
    
    model = auto_arima(
        train,
        seasonal=seasonal,
        m=m_value,
        suppress_warnings=True,
        error_action='ignore',
        stepwise=True
    )
    
    predictions, _ = model.predict(n_periods=test_size, return_conf_int=True)
    mae = mean_absolute_error(test, predictions)
    rmse = np.sqrt(mean_squared_error(test, predictions))
    mape = calculate_mape(test, predictions)
    
    model_name = f"SARIMA{model.order}x{model.seasonal_order}" if seasonal else f"ARIMA{model.order}"
    
    return {
        "model_name": model_name,
        "predictions": predictions.tolist(),
        "actual": test.tolist(),
        "metrics": {
            "mae": float(mae),
            "rmse": float(rmse),
            "mape": float(mape),
            "aic": float(model.aic()),
            "bic": float(model.bic())
        },
        "train_size": len(train)
    }

# Business-specific functions
def forecast_ingredient_usage(series, steps=7, seasonal=True, seasonal_period=7):
    """Forecast ingredient usage for inventory management"""
    if seasonal and len(series) < seasonal_period * 2:
        seasonal = False
    
    m_value = int(seasonal_period) if seasonal else 1
    
    model = auto_arima(
        series,
        seasonal=seasonal,
        m=m_value,
        start_p=0, start_q=0,
        max_p=3, max_q=3,
        start_P=0, start_Q=0,
        max_P=2, max_Q=2,
        suppress_warnings=True,
        error_action='ignore',
        stepwise=True
    )
    
    forecast, conf_int = model.predict(n_periods=steps, return_conf_int=True)
    total_usage = float(np.sum(forecast))
    avg_daily = float(np.mean(forecast))
    peak_day = int(np.argmax(forecast)) + 1
    model_name = f"SARIMA{model.order}x{model.seasonal_order}" if seasonal else f"ARIMA{model.order}"
    
    return {
        "forecast": forecast.tolist(),
        "lower": conf_int[:, 0].tolist(),
        "upper": conf_int[:, 1].tolist(),
        "total_usage": total_usage,
        "avg_daily_usage": avg_daily,
        "peak_day": peak_day,
        "model_name": model_name,
        "metrics": get_model_metrics(model)
    }

def forecast_category_demand(series, steps=30, seasonal=True):
    """Forecast demand for a product category"""
    # Validate input data
    if len(series) < 7:
        raise ValueError(f"Insufficient data: need at least 7 observations, got {len(series)}")
    
    # Check for data quality issues
    if series.isnull().any():
        raise ValueError("Data contains NaN values")
    
    if (series < 0).any():
        raise ValueError("Data contains negative values")
    
    # Check for variance (ARIMA needs variation in data)
    if series.std() == 0:
        raise ValueError("Data has no variance (all values are the same)")
    
    if series.std() < 0.01:
        raise ValueError(f"Data has very low variance (std={series.std():.4f}). ARIMA requires more variation in sales patterns.")
    
    seasonal_period = 7 if len(series) >= 14 else None
    if not seasonal_period:
        seasonal = False
    
    m_value = int(seasonal_period) if seasonal and seasonal_period else 1
    
    try:
        model = auto_arima(
            series,
            seasonal=seasonal,
            m=m_value,
            suppress_warnings=True,
            error_action='ignore',
            stepwise=True,
            maxiter=50
        )
    except Exception as e:
        raise ValueError(f"ARIMA model fitting failed: {str(e)}")
    
    forecast, conf_int = model.predict(n_periods=steps, return_conf_int=True)
    trend_direction = "growing" if forecast[-1] > forecast[0] else "declining"
    trend_percentage = ((forecast[-1] - forecast[0]) / forecast[0]) * 100 if forecast[0] != 0 else 0
    total_demand = float(np.sum(forecast))
    model_name = f"SARIMA{model.order}x{model.seasonal_order}" if seasonal else f"ARIMA{model.order}"
    
    return {
        "forecast": forecast.tolist(),
        "lower": conf_int[:, 0].tolist(),
        "upper": conf_int[:, 1].tolist(),
        "total_demand": total_demand,
        "trend": {
            "direction": trend_direction,
            "percentage": float(trend_percentage)
        },
        "model_name": model_name,
        "metrics": get_model_metrics(model)
    }

def forecast_revenue(series, steps=6, seasonal=True):
    """Forecast total sales revenue"""
    seasonal_period = 12 if len(series) >= 24 and seasonal else None
    if not seasonal_period:
        seasonal = False
    
    m_value = int(seasonal_period) if seasonal and seasonal_period else 1
    
    model = auto_arima(
        series,
        seasonal=seasonal,
        m=m_value,
        start_p=0, start_q=0,
        max_p=5, max_q=5,
        suppress_warnings=True,
        error_action='ignore',
        stepwise=True
    )
    
    forecast, conf_int = model.predict(n_periods=steps, return_conf_int=True)
    total_revenue = float(np.sum(forecast))
    avg_monthly = float(np.mean(forecast))
    
    if len(series) >= 2:
        recent_avg = float(series.tail(3).mean())
        forecast_avg = float(forecast.mean())
        growth_rate = ((forecast_avg - recent_avg) / recent_avg) * 100 if recent_avg != 0 else 0
    else:
        growth_rate = 0.0
    
    trend_direction = "increasing" if forecast[-1] > forecast[0] else "decreasing"
    model_name = f"SARIMA{model.order}x{model.seasonal_order}" if seasonal else f"ARIMA{model.order}"
    
    return {
        "forecast": forecast.tolist(),
        "lower": conf_int[:, 0].tolist(),
        "upper": conf_int[:, 1].tolist(),
        "total_revenue": total_revenue,
        "avg_monthly_revenue": avg_monthly,
        "growth_rate": float(growth_rate),
        "trend": trend_direction,
        "model_name": model_name,
        "metrics": get_model_metrics(model)
    }

def calculate_reorder_alert(series, current_stock, reorder_point, lead_time_days=3, safety_stock=0.0):
    """Calculate reorder alerts based on forecasted usage"""
    try:
        seasonal = len(series) >= 14
        m_value = 7 if seasonal else 1
        
        model = auto_arima(
            series,
            seasonal=seasonal,
            m=m_value,
            start_p=0, start_q=0,
            max_p=3, max_q=3,
            suppress_warnings=True,
            error_action='ignore',
            stepwise=True
        )
        
        forecast_30, _ = model.predict(n_periods=30, return_conf_int=True)
    except:
        avg_usage = series.mean()
        forecast_30 = np.array([avg_usage] * 30)
    
    cumulative_usage = np.cumsum(forecast_30)
    stock_levels = current_stock - cumulative_usage
    reorder_threshold = reorder_point + safety_stock
    
    days_until_reorder = None
    days_until_stockout = None
    
    for day, stock_level in enumerate(stock_levels, 1):
        if days_until_reorder is None and stock_level <= reorder_threshold:
            days_until_reorder = day
        if days_until_stockout is None and stock_level <= 0:
            days_until_stockout = day
    
    if days_until_reorder is None:
        days_until_reorder = 30
    if days_until_stockout is None:
        days_until_stockout = 30
    
    if current_stock <= reorder_point:
        alert_status = "CRITICAL"
        should_reorder = True
        priority = "HIGH"
        message = f"Stock is at or below reorder point. Order immediately!"
    elif days_until_reorder <= lead_time_days:
        alert_status = "WARNING"
        should_reorder = True
        priority = "MEDIUM"
        message = f"Stock will hit reorder point in {days_until_reorder} days. Order now to avoid stockout."
    elif days_until_reorder <= (lead_time_days * 2):
        alert_status = "ATTENTION"
        should_reorder = False
        priority = "LOW"
        message = f"Stock will hit reorder point in {days_until_reorder} days. Monitor closely."
    else:
        alert_status = "OK"
        should_reorder = False
        priority = "NONE"
        message = f"Stock levels are healthy. Reorder needed in {days_until_reorder} days."
    
    safety_period = 7
    total_forecast_period = lead_time_days + safety_period
    forecasted_usage_during_leadtime = float(np.sum(forecast_30[:total_forecast_period]))
    recommended_order = max(0, forecasted_usage_during_leadtime - (current_stock - reorder_point) + safety_stock)
    
    usage_7 = float(np.sum(forecast_30[:7]))
    usage_14 = float(np.sum(forecast_30[:14]))
    usage_30 = float(np.sum(forecast_30[:30]))
    
    return {
        "alert_status": alert_status,
        "should_reorder": should_reorder,
        "days_until_reorder": int(days_until_reorder),
        "days_until_stockout": int(days_until_stockout) if days_until_stockout < 30 else None,
        "recommended_order_qty": float(recommended_order),
        "usage_next_7_days": usage_7,
        "usage_next_14_days": usage_14,
        "usage_next_30_days": usage_30,
        "message": message,
        "priority": priority
    }
