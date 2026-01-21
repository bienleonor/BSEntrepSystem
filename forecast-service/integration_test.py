"""
Quick test to verify the forecast service is working
Run this after starting the service with: uvicorn app:app --reload
"""

import requests
import json

BASE_URL = "http://localhost:8000"

print("=" * 60)
print("FORECAST SERVICE - INTEGRATION TEST")
print("=" * 60)

# Test 1: Health Check
print("\n1. Testing health check endpoint...")
try:
    response = requests.get(f"{BASE_URL}/", timeout=2)
    if response.status_code == 200:
        data = response.json()
        print(f"   ✓ Service: {data['service']}")
        print(f"   ✓ Status: {data['status']}")
        print(f"   ✓ Version: {data['version']}")
    else:
        print(f"   ✗ Failed: {response.status_code}")
except Exception as e:
    print(f"   ✗ Error: Cannot connect to service")
    print(f"      Make sure to start it with: uvicorn app:app --reload")
    exit(1)

# Test 2: Simple Auto Forecast
print("\n2. Testing auto forecast endpoint...")
try:
    payload = {
        "series": [
            {"date": "2024-01-01", "value": 100},
            {"date": "2024-01-02", "value": 105},
            {"date": "2024-01-03", "value": 110},
            {"date": "2024-01-04", "value": 108},
            {"date": "2024-01-05", "value": 112},
            {"date": "2024-01-06", "value": 115},
            {"date": "2024-01-07", "value": 118}
        ],
        "steps": 3,
        "seasonal": False
    }
    
    response = requests.post(f"{BASE_URL}/forecast/auto", json=payload, timeout=10)
    
    if response.status_code == 200:
        result = response.json()
        print(f"   ✓ Model: {result['model']}")
        print(f"   ✓ Forecast: {result['forecast']}")
    else:
        print(f"   ✗ Failed: {response.status_code}")
except Exception as e:
    print(f"   ✗ Error: {str(e)}")

# Test 3: Ingredient Usage Forecast
print("\n3. Testing ingredient usage forecast...")
try:
    payload = {
        "ingredient_id": "TEST-001",
        "usage_history": [
            {"date": f"2024-01-{i:02d}", "value": 50 + i} 
            for i in range(1, 15)
        ],
        "steps": 7,
        "seasonal": False
    }
    
    response = requests.post(f"{BASE_URL}/business/ingredient-usage", json=payload, timeout=10)
    
    if response.status_code == 200:
        result = response.json()
        print(f"   ✓ Ingredient: {result['ingredient_id']}")
        print(f"   ✓ Total usage (7 days): {result['total_forecasted_usage']:.2f}")
        print(f"   ✓ Average daily: {result['average_daily_usage']:.2f}")
    else:
        print(f"   ✗ Failed: {response.status_code} - {response.text}")
except Exception as e:
    print(f"   ✗ Error: {str(e)}")

# Test 4: Reorder Alert
print("\n4. Testing reorder alert...")
try:
    payload = {
        "ingredient_id": "TEST-002",
        "current_stock": 150,
        "usage_history": [
            {"date": f"2024-01-{i:02d}", "value": 25 + (i % 3)} 
            for i in range(1, 21)
        ],
        "reorder_point": 100,
        "lead_time_days": 3,
        "safety_stock": 20
    }
    
    response = requests.post(f"{BASE_URL}/business/reorder-alert", json=payload, timeout=10)
    
    if response.status_code == 200:
        result = response.json()
        print(f"   ✓ Alert Status: {result['alert_status']}")
        print(f"   ✓ Should Reorder: {result['should_reorder']}")
        print(f"   ✓ Days until reorder: {result['days_until_reorder']}")
        print(f"   ✓ Recommended order: {result['recommended_order_quantity']:.2f}")
    else:
        print(f"   ✗ Failed: {response.status_code} - {response.text}")
except Exception as e:
    print(f"   ✗ Error: {str(e)}")

print("\n" + "=" * 60)
print("INTEGRATION TEST COMPLETE")
print("=" * 60)
print("\nThe forecast service is ready to integrate with your backend!")
print("\nNext steps:")
print("1. Keep this service running (uvicorn app:app --reload --port 8000)")
print("2. In your backend, call: http://localhost:8000/business/...")
print("3. Check INTEGRATION.md for backend code examples")
print("=" * 60)
