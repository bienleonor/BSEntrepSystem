import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register scales and elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const API_BASE = 'http://localhost:5000/api/analysis';

function SalesAnalysis() {
  const [salesData, setSalesData] = useState([]);
  const [profitData, setProfitData] = useState([]);
  const [ingredientData, setIngredientData] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const config = { headers: { Authorization: `Bearer ${token}` } };

    axios.get(`${API_BASE}/sales/trend-by-category`, config)
      .then(res => setSalesData(res.data))
      .catch(err => console.error('Sales API error:', err.response?.data));

    axios.get(`${API_BASE}/profit/by-category`, config)
      .then(res => setProfitData(res.data))
      .catch(err => console.error('Profit API error:', err.response?.data));

    axios.get(`${API_BASE}/inventory/ingredient-consumption`, config)
      .then(res => setIngredientData(res.data))
      .catch(err => console.error('Ingredient API error:', err.response?.data));
  }, [token]);

  // Memoize sales chart data
  const salesChart = useMemo(() => {
    const categories = [...new Set(salesData.map(d => d.category_name))];
    const dates = [...new Set(salesData.map(d => d.order_day))].sort();

    const datasets = categories.map((cat, index) => ({
      label: cat,
      data: dates.map(date => {
        const record = salesData.find(d => d.category_name === cat && d.order_day === date);
        return record ? parseFloat(record.daily_sales) : 0;
      }),
      borderColor: `hsl(${index * 60}, 70%, 50%)`,
      fill: false,
      tension: 0.3,
    }));

    return { labels: dates, datasets };
  }, [salesData]);

  // Memoize profit chart data
  const profitChart = useMemo(() => ({
    labels: profitData.map(d => d.category_name),
    datasets: [
      {
        label: 'Profit',
        data: profitData.map(d => parseFloat(d.total_profit)),
        backgroundColor: '#4caf50',
      }
    ]
  }), [profitData]);

  // Memoize ingredient chart data
  const ingredientChart = useMemo(() => ({
    labels: ingredientData.map(d => d.ingredient_name),
    datasets: [
      {
        label: 'Consumed Quantity',
        data: ingredientData.map(d => parseFloat(d.total_consumed)),
        backgroundColor: '#ff9800',
      }
    ]
  }), [ingredientData]);

  return (
    <DashboardLayout>
      <h1 className="text-white text-3xl font-extrabold">Business KPI Dashboard</h1> 

      <div style={{ marginTop: '40px' }}>
        <h2 className="text-white text-3xl font-extrabold">Sales Trend by Category</h2>
        <Line
          key="salesChart"
          data={salesChart}
          options={{ responsive: true, plugins: { legend: { position: 'top' } } }}
        />
      </div>

      <div style={{ marginTop: '40px' }}>
        <h2 className="text-white text-3xl font-extrabold">Profit by Category</h2>
        <Bar
          key="profitChart"
          data={profitChart}
          options={{ responsive: true, plugins: { legend: { display: false } } }}
        />
      </div>

      <div style={{ marginTop: '40px' }}>
        <h2 className="text-white text-3xl font-extrabold">Ingredient Consumption</h2>
        <Bar
          key="ingredientChart"
          data={ingredientChart}
          options={{
            indexAxis: 'y',
            responsive: true,
            plugins: { legend: { display: false } }
          }}
        />
      </div>
    </DashboardLayout>
  );
}

export default SalesAnalysis;
