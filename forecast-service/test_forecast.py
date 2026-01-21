"""
Test script for the forecast service
Run this to verify the service is working correctly
"""

import requests
import json
from datetime import datetime, timedelta

# Base URL of the service
BASE_URL = "http://localhost:8000"

def generate_sample_data(start_date="2023-01-01", periods=24):
    """Generate sample time series data"""
    import random
    data = []
    current_date = datetime.strptime(start_date, "%Y-%m-%d")
    base_value = 100
    
    for i in range(periods):
        # Simulate trend + seasonality + noise
        trend = i * 2
        seasonality = 20 * (i % 12) / 12
        noise = random.uniform(-5, 5)
        value = base_value + trend + seasonality + noise
        
        data.append({
            "date": current_date.strftime("%Y-%m-%d"),
            "value": round(value, 2)
        })
        current_date += timedelta(days=30)
    
    return data

def test_health_check():
    """Test the health check endpoint"""
    print("\n=== Testing Health Check ===")
    response = requests.get(f"{BASE_URL}/")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200

def test_auto_forecast():
    """Test automatic forecast endpoint"""
    print("\n=== Testing Auto Forecast ===")
    
    data = generate_sample_data(periods=24)
    
    payload = {
        "series": data,
        "steps": 6,
        "seasonal": True,
        "seasonal_period": 12,
        "confidence_level": 0.95
    }
    
    response = requests.post(f"{BASE_URL}/forecast/auto", json=payload)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"Model: {result['model']}")
        print(f"Order: {result['order']}")
        print(f"Seasonal Order: {result['seasonal_order']}")
        print(f"Forecast: {result['forecast']}")
        print(f"Metrics: {json.dumps(result['metrics'], indent=2)}")
        return True
    else:
        print(f"Error: {response.text}")
        return False

def test_manual_forecast():
    """Test manual forecast endpoint"""
    print("\n=== Testing Manual Forecast ===")
    
    data = generate_sample_data(periods=24)
    
    payload = {
        "series": data,
        "steps": 6,
        "order": [1, 1, 1],
        "seasonal_order": [1, 1, 1, 12],
        "confidence_level": 0.95
    }
    
    response = requests.post(f"{BASE_URL}/forecast/manual", json=payload)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"Model: {result['model']}")
        print(f"Forecast: {result['forecast']}")
        print(f"Confidence Interval Lower: {result['confidence_interval']['lower']}")
        print(f"Confidence Interval Upper: {result['confidence_interval']['upper']}")
        return True
    else:
        print(f"Error: {response.text}")
        return False

def test_evaluation():
    """Test model evaluation endpoint"""
    print("\n=== Testing Model Evaluation ===")
    
    data = generate_sample_data(periods=30)
    
    payload = {
        "series": data,
        "test_size": 6,
        "seasonal": True,
        "seasonal_period": 12
    }
    
    response = requests.post(f"{BASE_URL}/evaluate", json=payload)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"Model: {result['model']}")
        print(f"Metrics:")
        print(f"  MAE: {result['metrics']['mae']:.2f}")
        print(f"  RMSE: {result['metrics']['rmse']:.2f}")
        print(f"  MAPE: {result['metrics']['mape']:.2f}%")
        print(f"  AIC: {result['metrics']['aic']:.2f}")
        print(f"  BIC: {result['metrics']['bic']:.2f}")
        print(f"Train Size: {result['train_size']}")
        print(f"Test Size: {result['test_size']}")
        return True
    else:
        print(f"Error: {response.text}")
        return False

def test_legacy_endpoint():
    """Test legacy forecast endpoint"""
    print("\n=== Testing Legacy Endpoint ===")
    
    data = generate_sample_data(periods=24)
    
    payload = {
        "series": data,
        "steps": 6,
        "seasonal": True,
        "seasonal_period": 12
    }
    
    response = requests.post(f"{BASE_URL}/forecast", json=payload)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"Model: {result['model']}")
        print(f"Forecast: {result['forecast']}")
        return True
    else:
        print(f"Error: {response.text}")
        return False

def run_all_tests():
    """Run all tests"""
    print("=" * 60)
    print("FORECAST SERVICE TEST SUITE")
    print("=" * 60)
    print("\nMake sure the service is running:")
    print("uvicorn app:app --reload")
    print("=" * 60)
    
    results = {
        "Health Check": test_health_check(),
        "Auto Forecast": test_auto_forecast(),
        "Manual Forecast": test_manual_forecast(),
        "Model Evaluation": test_evaluation(),
        "Legacy Endpoint": test_legacy_endpoint()
    }
    
    print("\n" + "=" * 60)
    print("TEST RESULTS")
    print("=" * 60)
    for test_name, passed in results.items():
        status = "✓ PASSED" if passed else "✗ FAILED"
        print(f"{test_name}: {status}")
    
    total = len(results)
    passed = sum(results.values())
    print(f"\nTotal: {passed}/{total} tests passed")
    print("=" * 60)

if __name__ == "__main__":
    try:
        run_all_tests()
    except requests.exceptions.ConnectionError:
        print("\n❌ ERROR: Cannot connect to the service!")
        print("Please make sure the service is running:")
        print("  uvicorn app:app --reload")
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
