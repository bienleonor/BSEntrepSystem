# Forecast Analysis - Computation Explained

This document explains the mathematical computations and logic behind each forecasting feature.

---

## 1. Revenue Forecast (Next 7 Days)

### What it does:
Predicts your total revenue for the next 7 days based on historical sales patterns.

### Model Used:
**ARIMA** (AutoRegressive Integrated Moving Average) - A statistical model that analyzes time series data to predict future values.

### How ARIMA Works:
ARIMA has three components (p, d, q):
- **AR (p)**: Uses past revenue values to predict future ones (e.g., if yesterday was high, today might be too)
- **I (d)**: Removes trends by looking at differences between consecutive days
- **MA (q)**: Uses past prediction errors to improve accuracy

### Step-by-Step Computation:

**Step 1: Get Historical Data**
```
Collect last 30 days of daily revenue:
Day 1: ₱15,000
Day 2: ₱18,000
Day 3: ₱16,500
...
Day 30: ₱20,000
```

**Step 2: Auto-Select Best Parameters**
The model automatically tests different combinations of (p, d, q) to find what works best for your data.

**Step 3: Train the Model**
```python
model = SARIMAX(revenue_data, order=(p, d, q))
fitted_model = model.fit()
```
This "learns" your revenue patterns (weekday vs weekend, trends, etc.)

**Step 4: Generate Forecast**
```python
forecast = fitted_model.forecast(steps=7)
# Returns: [Day 1: 17500, Day 2: 18200, ... Day 7: 19800]
```

**Step 5: Calculate Metrics**
```python
total_forecasted_revenue = sum(forecast)  # Total for 7 days
average_daily = total_forecasted_revenue / 7

# Compare to last week
last_week_avg = sum(last_7_days) / 7
growth_rate = ((average_daily - last_week_avg) / last_week_avg) × 100
```

### Formulas:
```
Total Forecasted Revenue = Σ(forecasted daily revenue for 7 days)
Average Daily Revenue = Total Forecasted Revenue ÷ 7
Growth Rate (%) = ((Forecast Avg - Historical Avg) ÷ Historical Avg) × 100
```

### Example:
```
Input: Last 30 days averaging ₱16,000/day
Forecast: Next 7 days will average ₱18,000/day
Total = ₱18,000 × 7 = ₱126,000
Growth Rate = ((18000 - 16000) ÷ 16000) × 100 = +12.5%
```
**Meaning:** Expect ₱126K revenue in next 7 days, 12.5% higher than recent average.

---

## 2. Category Demand Forecast (Next 14 Days)

### What it does:
Predicts how many units of a specific product category will be sold in the next 14 days.

### Model Used:
Same ARIMA model, but applied to product quantities instead of revenue.

### Step-by-Step Computation:

**Step 1: Get Category Sales**
```
Collect last 30 days of daily units sold:
Day 1: 45 units
Day 2: 52 units
Day 3: 48 units
...
Day 30: 60 units
```

**Step 2: Forecast Future Demand**
```python
model = auto_arima(category_sales)
forecast = model.predict(n_periods=14)
# Returns: [Day 1: 55, Day 2: 58, ... Day 14: 62]
```

**Step 3: Calculate Total Demand**
```python
total_demand = sum(forecast)  # Sum all 14 days
```

**Step 4: Analyze Trend**
```python
# Compare recent sales to earlier sales
recent_avg = mean(last_7_days)     # Average of days 24-30
earlier_avg = mean(first_7_days)   # Average of days 1-7

percentage_change = ((recent_avg - earlier_avg) / earlier_avg) × 100

if percentage_change > 5:
    trend = "growing"
elif percentage_change < -5:
    trend = "declining"
else:
    trend = "stable"
```

### Formulas:
```
Total Forecasted Demand = Σ(forecasted daily units for 14 days)
Trend % = ((Recent 7-day Avg - Earlier 7-day Avg) ÷ Earlier Avg) × 100

Trend Classification:
- Growing: Trend % > +5%
- Declining: Trend % < -5%
- Stable: -5% ≤ Trend % ≤ +5%
```

### Example:
```
Input: 
- Days 1-7: Average 50 units/day
- Days 24-30: Average 60 units/day

Trend % = ((60 - 50) ÷ 50) × 100 = +20%
Result: "growing" trend

Forecast: Next 14 days = 850 units total
```
**Meaning:** Category is growing by 20%, expect to sell 850 units in next 2 weeks.

---

## 3. Reorder Alerts (AI Inventory Alerts)

### What it does:
Predicts when you'll run out of stock for each product and tells you when to reorder.

### Computation Process:

**Step 1: Calculate Average Daily Usage**
```python
product_sales = [12, 15, 13, 14, 16, ...]  # Last 30 days

avg_daily_usage = sum(product_sales) / len(product_sales)
# Example: 420 units ÷ 30 days = 14 units/day
```

**Step 2: Forecast Next 7 Days Usage**
```python
model = auto_arima(product_sales)
forecasted_usage = model.predict(n_periods=7)
# Returns: [Day 1: 14, Day 2: 15, Day 3: 14, ...]
```

**Step 3: Simulate Inventory Depletion**
```python
current_stock = 100  # What you have now
projected_stock = current_stock

for each day in next 7 days:
    projected_stock = projected_stock - forecasted_usage[day]
    
    if projected_stock <= 0:
        stockout_day = current_day
        break

# Example:
# Day 0: 100 units
# Day 1: 100 - 14 = 86 units
# Day 2: 86 - 15 = 71 units
# ...
# Day 7: 2 units (projected stock after 7 days)
```

**Step 4: Calculate Reorder Point**
```
Reorder Point = (Avg Daily Usage × Lead Time) + Safety Stock
```

**Explanation:**
- **Lead Time**: Days it takes supplier to deliver (default: 3 days)
- **Safety Stock**: Extra buffer for unexpected demand (default: 20 units)

**Example:**
```
Avg Daily Usage = 14 units/day
Lead Time = 3 days
Safety Stock = 20 units

Reorder Point = (14 × 3) + 20 = 42 + 20 = 62 units
```

**Meaning:** When stock drops to 62 units, you should reorder because:
- You'll use 42 units during the 3-day delivery wait
- You want to keep 20 units as safety buffer

**Step 5: Determine Alert Priority**
```python
if current_stock <= 0:
    priority = "CRITICAL" (OUT OF STOCK)
    
elif current_stock <= reorder_point:
    priority = "CRITICAL" (REORDER NOW)
    
elif projected_stock <= reorder_point:
    # Calculate when stock will hit reorder point
    days_until_reorder = calculate_days_until_reorder_point()
    
    if days_until_reorder <= 3:
        priority = "WARNING" (REORDER SOON)
    else:
        priority = "ATTENTION" (MONITOR)
        
else:
    priority = "OK" (SUFFICIENT STOCK)
```

### Complete Example:

**Scenario:**
- Product: Coffee Beans
- Current Stock: 85 kg
- Average Daily Usage: 14 kg/day
- Forecasted 7-day usage: 98 kg
- Lead Time: 3 days
- Safety Stock: 20 kg

**Calculations:**
```
1. Reorder Point = (14 × 3) + 20 = 62 kg

2. Projected Stock (after 7 days) = 85 - 98 = -13 kg (will run out!)

3. Days until stockout:
   Day 1: 85 - 14 = 71 kg
   Day 2: 71 - 14 = 57 kg
   Day 3: 57 - 14 = 43 kg
   Day 4: 43 - 14 = 29 kg
   Day 5: 29 - 14 = 15 kg
   Day 6: 15 - 14 = 1 kg
   Day 7: 1 - 14 = -13 kg ❌ STOCKOUT
   
4. When hits reorder point (62 kg)?
   Between Day 1 and Day 2
   Days until reorder = 2 days

5. Alert Status:
   - Current stock (85) > Reorder point (62) ✓
   - Projected stock (-13) < Reorder point (62) ✗
   - Days until reorder = 2 (≤ 3)
   - Priority: WARNING
   - Message: "Reorder in 2 days"
```

### Alert Priority Table:

| Current Stock | Projected Stock | Days Until Reorder | Priority | Action |
|---------------|-----------------|-------------------|----------|--------|
| 0 | Any | - | CRITICAL | Out of stock! |
| ≤ Reorder Point | Any | 0 | CRITICAL | Order now! |
| > Reorder Point | ≤ Reorder Point | 1-3 days | WARNING | Order soon |
| > Reorder Point | ≤ Reorder Point | 4-7 days | ATTENTION | Monitor |
| > Reorder Point | > Reorder Point | >7 days | OK | Sufficient |

---

## Key Formulas Summary

### 1. Revenue Growth Rate
```
Growth Rate (%) = ((Forecast Avg - Historical Avg) / Historical Avg) × 100
```

### 2. Category Trend
```
Trend % = ((Recent Average - Earlier Average) / Earlier Average) × 100

Classification:
- Growing: > +5%
- Declining: < -5%
- Stable: between -5% and +5%
```

### 3. Reorder Point
```
Reorder Point = (Average Daily Usage × Lead Time Days) + Safety Stock Buffer

Where:
- Average Daily Usage = Total sold in 30 days ÷ 30
- Lead Time = Days for supplier delivery (default: 3)
- Safety Stock = Extra buffer units (default: 20)
```

### 4. Projected Stock
```
Projected Stock = Current Stock - Σ(Forecasted daily usage for next 7 days)
```

### 5. Days Until Reorder
```
For each day:
    Remaining Stock = Current Stock - Cumulative Usage
    If Remaining Stock ≤ Reorder Point:
        Return day number
```

---

## Why These Computations Work

### ARIMA Model Strength:
- Captures patterns: weekday vs weekend sales
- Adapts to trends: growing or declining business
- Handles seasonality: monthly or weekly cycles
- Self-corrects: learns from prediction errors

### Reorder Point Logic:
- **Lead Time Buffer**: Ensures you don't run out while waiting for delivery
- **Safety Stock**: Protects against unexpected demand spikes
- **Dynamic Forecasting**: Uses AI predictions instead of simple averages

### Data Requirements:
- **Minimum**: 7-10 days (basic patterns)
- **Recommended**: 30+ days (reliable patterns, trends, weekly cycles)
- **Ideal**: 90+ days (seasonality, holidays, special events)

---

*Last Updated: January 20, 2026*
