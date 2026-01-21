import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import * as AnalysisApi from '../../services/analysisApi';
import useForecast from '../../hooks/useForecast';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

import { getBusinessId } from '../../utils/token';
// Tab configurations
const TABS = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'time', label: 'Sales by Time', icon: '⏰' },
  { id: 'products', label: 'Products', icon: '📦' },
  { id: 'categories', label: 'Categories', icon: '🏷️' },
  { id: 'ingredients', label: 'Ingredients', icon: '🥗' },
  { id: 'operations', label: 'Operations', icon: '⚙️' },
  { id: 'trends', label: 'Trends', icon: '📈' },
  { id: 'insights', label: 'Insights', icon: '💡' },
  { id: 'forecast', label: 'Forecast', icon: '🔮' },
];

function SalesAnalysis() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data states
  const [kpiSummary, setKpiSummary] = useState(null);
  const [salesByDateRange, setSalesByDateRange] = useState([]);
  const [hourlySales, setHourlySales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [slowestProducts, setSlowestProducts] = useState([]);
  const [salesByCategory, setSalesByCategory] = useState([]);
  const [salesByProduct, setSalesByProduct] = useState([]);
  const [ingredientData, setIngredientData] = useState([]);
  
  // Operations tab data states
  const [transactionDuration, setTransactionDuration] = useState(null);
  const [cancelledTransactions, setCancelledTransactions] = useState(null);
  const [inventoryTurnover, setInventoryTurnover] = useState([]);
  const [stockAging, setStockAging] = useState([]);

  // Trends tab data states
  const [categoryTrends, setCategoryTrends] = useState([]);
  const [productLifecycle, setProductLifecycle] = useState([]);
  const [replenishmentPerformance, setReplenishmentPerformance] = useState([]);

  // Insights tab data states (Segmentation & Basket Analysis)
  const [basketSizeSegmentation, setBasketSizeSegmentation] = useState([]);
  const [basketValueSegmentation, setBasketValueSegmentation] = useState([]);
  const [timeBasedSegmentation, setTimeBasedSegmentation] = useState(null);
  const [categorySegmentation, setCategorySegmentation] = useState([]);
  const [productAffinity, setProductAffinity] = useState([]);

  // Forecast tab data states
  const [salesForecast, setSalesForecast] = useState(null);
  const [categoryDemand, setCategoryDemand] = useState([]);
  const [stockoutPrediction, setStockoutPrediction] = useState([]);
  const [reorderAlerts, setReorderAlerts] = useState([]);
  
  // Forecast microservice hook
  const { forecastRevenue, forecastCategoryDemand, forecastIngredientUsage, checkReorderAlert } = useForecast();
  const [revenueForecastData, setRevenueForecastData] = useState(null);
  const [ingredientForecasts, setIngredientForecasts] = useState([]);
  const [categoryForecastData, setCategoryForecastData] = useState(null);
  const [microserviceReorderAlerts, setMicroserviceReorderAlerts] = useState([]);
  const [selectedCategoryForForecast, setSelectedCategoryForForecast] = useState('');

  // Helper to format duration in seconds to readable format
  const formatDuration = (seconds) => {
    if (!seconds || seconds === 0) return '0s';
    const secs = Math.round(seconds);
    if (secs < 60) return `${secs}s`;
    const mins = Math.floor(secs / 60);
    const remainSecs = secs % 60;
    if (mins < 60) return remainSecs > 0 ? `${mins}m ${remainSecs}s` : `${mins}m`;
    const hours = Math.floor(mins / 60);
    const remainMins = mins % 60;
    return remainMins > 0 ? `${hours}h ${remainMins}m` : `${hours}h`;
  };

  // Filter states
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [groupBy, setGroupBy] = useState('day');
  const [sortOrder, setSortOrder] = useState('desc');
  const [productLimit, setProductLimit] = useState(10);
  const [ingredientLimit, setIngredientLimit] = useState(10);
  const [timePeriod, setTimePeriod] = useState('all'); // 'today', '7days', '30days', 'all'

  // Compute date range from time period preset
  const getDateRangeFromPeriod = useCallback((period) => {
    const today = new Date();
    const formatDate = (d) => d.toISOString().split('T')[0];
    
    switch (period) {
      case 'today':
        return { start: formatDate(today), end: formatDate(today) };
      case '7days': {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return { start: formatDate(weekAgo), end: formatDate(today) };
      }
      case '30days': {
        const monthAgo = new Date(today);
        monthAgo.setDate(monthAgo.getDate() - 30);
        return { start: formatDate(monthAgo), end: formatDate(today) };
      }
      default:
        return { start: '', end: '' };
    }
  }, []);

  // Effective date range (from preset or manual)
  const effectiveDateRange = useMemo(() => {
    if (timePeriod !== 'custom') {
      return getDateRangeFromPeriod(timePeriod);
    }
    return dateRange;
  }, [timePeriod, dateRange, getDateRangeFromPeriod]);

  // Use getBusinessId helper to safely get businessId (like inventory-controller expects)
  const businessId = getBusinessId();

  // Prevent API calls if businessId is missing or invalid
  useEffect(() => {
    if (!businessId) {
      setError('No business selected. Please select a business to view sales analysis.');
      setLoading(false);
      return;
    }
    // ...existing code for fetching data
  }, [businessId, activeTab, effectiveDateRange.start, effectiveDateRange.end, groupBy, productLimit, ingredientLimit]);

  // Fetch data based on active tab
  useEffect(() => {
    if (!businessId) {
      setError('No business selected');
      setLoading(false);
      return;
    }

    const fetchTabData = async () => {
      try {
        setLoading(true);
        setError(null);

        switch (activeTab) {
          case 'overview': {
            const [kpi, hourly] = await Promise.all([
              AnalysisApi.getSalesKPISummary(businessId),
              AnalysisApi.getHourlySalesDistribution(businessId),
            ]);
            setKpiSummary(kpi);
            setHourlySales(hourly);
            break;
          }
          case 'time': {
            const [dateData, hourlyData] = await Promise.all([
              AnalysisApi.getSalesByDateRange(businessId, effectiveDateRange.start, effectiveDateRange.end, groupBy),
              AnalysisApi.getHourlySalesDistribution(businessId),
            ]);
            setSalesByDateRange(dateData);
            setHourlySales(hourlyData);
            break;
          }
          case 'products': {
            const [top, slowest, byProduct] = await Promise.all([
              AnalysisApi.getTopSellingProducts(businessId, productLimit),
              AnalysisApi.getSlowestMovingProducts(businessId, productLimit),
              AnalysisApi.getSalesByProduct(businessId),
            ]);
            setTopProducts(top);
            setSlowestProducts(slowest);
            setSalesByProduct(byProduct);
            break;
          }
          case 'categories': {
            const catData = await AnalysisApi.getSalesByCategory(businessId);
            setSalesByCategory(catData);
            break;
          }
          case 'ingredients': {
            const ingredientRes = await AnalysisApi.getIngredientConsumption(businessId);
            const sorted = [...ingredientRes].sort((a, b) => 
              parseFloat(b.total_consumed || 0) - parseFloat(a.total_consumed || 0)
            );
            setIngredientData(sorted.slice(0, ingredientLimit));
            break;
          }
          case 'operations': {
            const [duration, cancelled, turnover, aging] = await Promise.all([
              AnalysisApi.getTransactionDurationStats(businessId),
              AnalysisApi.getCancelledTransactions(businessId, effectiveDateRange.start, effectiveDateRange.end),
              AnalysisApi.getInventoryTurnover(businessId, effectiveDateRange.start, effectiveDateRange.end),
              AnalysisApi.getStockAging(businessId),
            ]);
            setTransactionDuration(duration);
            setCancelledTransactions(cancelled);
            setInventoryTurnover(turnover);
            setStockAging(aging);
            break;
          }
          case 'trends': {
            const [catTrends, lifecycle, replenishment] = await Promise.all([
              AnalysisApi.getCategoryPerformanceTrends(businessId),
              AnalysisApi.getProductLifecycle(businessId),
              AnalysisApi.getReplenishmentPerformance(businessId),
            ]);
            setCategoryTrends(catTrends);
            setProductLifecycle(lifecycle);
            setReplenishmentPerformance(replenishment);
            break;
          }
          case 'insights': {
            const [basketSize, basketValue, timeBased, categorySeg, affinity] = await Promise.all([
              AnalysisApi.getBasketSizeSegmentation(businessId, effectiveDateRange.start, effectiveDateRange.end),
              AnalysisApi.getBasketValueSegmentation(businessId, effectiveDateRange.start, effectiveDateRange.end),
              AnalysisApi.getTimeBasedSegmentation(businessId, effectiveDateRange.start, effectiveDateRange.end),
              AnalysisApi.getCategoryBasedSegmentation(businessId, effectiveDateRange.start, effectiveDateRange.end),
              AnalysisApi.getProductAffinityAnalysis(businessId),
            ]);
            setBasketSizeSegmentation(basketSize);
            setBasketValueSegmentation(basketValue);
            setTimeBasedSegmentation(timeBased);
            setCategorySegmentation(categorySeg);
            setProductAffinity(affinity);
            break;
          }
          case 'forecast': {
            // Load categories if not already loaded
            if (!salesByCategory || salesByCategory.length === 0) {
              const catData = await AnalysisApi.getSalesByCategory(businessId);
              setSalesByCategory(catData);
            }
            
            const [forecast, demand, stockout, alerts] = await Promise.all([
              AnalysisApi.getSalesForecast(businessId),
              AnalysisApi.getCategoryDemandForecast(businessId),
              AnalysisApi.getStockoutPrediction(businessId),
              AnalysisApi.getReorderAlerts(businessId),
            ]);
            setSalesForecast(forecast);
            setCategoryDemand(demand);
            setStockoutPrediction(stockout);
            setReorderAlerts(alerts);
            break;
          }
        }
      } catch (err) {
        console.error('Analysis API error:', err);
        setError(err.response?.data?.error || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchTabData();
  }, [businessId, activeTab, effectiveDateRange.start, effectiveDateRange.end, groupBy, productLimit, ingredientLimit]);

  // Sort helper
  const sortData = useCallback((data, key) => {
    return [...data].sort((a, b) => {
      const valA = parseFloat(a[key] || 0);
      const valB = parseFloat(b[key] || 0);
      return sortOrder === 'desc' ? valB - valA : valA - valB;
    });
  }, [sortOrder]);

  // Chart configurations
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#6b7280', usePointStyle: true, padding: 15 } },
    },
    scales: {
      x: { grid: { color: 'rgba(0,0,0,0.1)' }, ticks: { color: '#6b7280' } },
      y: { grid: { color: 'rgba(0,0,0,0.1)' }, ticks: { color: '#6b7280' } },
    },
  };

  // Hourly chart data
  const hourlyChartData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const data = hours.map(h => {
      const record = hourlySales.find(d => d.hour === h);
      return record ? parseFloat(record.total_revenue) : 0;
    });
    return {
      labels: hours.map(h => `${h}:00`),
      datasets: [{
        label: 'Revenue',
        data,
        backgroundColor: '#8b5cf6',
        borderRadius: 4,
      }]
    };
  }, [hourlySales]);

  // Peak hour calculation
  const peakHour = useMemo(() => {
    if (!hourlySales.length) return null;
    const peak = hourlySales.reduce((max, curr) => 
      parseFloat(curr.total_revenue) > parseFloat(max.total_revenue) ? curr : max
    , hourlySales[0]);
    return peak;
  }, [hourlySales]);

  // Sales by date chart
  const salesByDateChart = useMemo(() => ({
    labels: salesByDateRange.map(d => d.period),
    datasets: [{
      label: 'Revenue',
      data: salesByDateRange.map(d => parseFloat(d.total_revenue || 0)),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
    }]
  }), [salesByDateRange]);

  // Category pie chart
  const categoryPieChart = useMemo(() => {
    const colors = ['#3b82f6', '#22c55e', '#f97316', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#eab308'];
    return {
      labels: salesByCategory.map(d => d.category_name || 'Uncategorized'),
      datasets: [{
        data: salesByCategory.map(d => parseFloat(d.total_revenue || 0)),
        backgroundColor: colors.slice(0, salesByCategory.length),
        borderWidth: 0,
      }]
    };
  }, [salesByCategory]);

  // Top products chart
  const topProductsChart = useMemo(() => {
    const sorted = sortData(topProducts, 'total_sold');
    return {
      labels: sorted.map(d => d.product_name),
      datasets: [{
        label: 'Units Sold',
        data: sorted.map(d => parseFloat(d.total_sold || 0)),
        backgroundColor: '#22c55e',
        borderRadius: 6,
      }]
    };
  }, [topProducts, sortData]);

  // Slowest products chart
  const slowestProductsChart = useMemo(() => ({
    labels: slowestProducts.map(d => d.product_name),
    datasets: [{
      label: 'Units Sold',
      data: slowestProducts.map(d => parseFloat(d.total_sold || 0)),
      backgroundColor: '#ef4444',
      borderRadius: 6,
    }]
  }), [slowestProducts]);

  // Ingredient chart
  const ingredientChart = useMemo(() => {
    const sorted = sortData(ingredientData, 'total_consumed');
    return {
      labels: sorted.map(d => d.ingredient_name),
      datasets: [{
        label: 'Consumed',
        data: sorted.map(d => parseFloat(d.total_consumed || 0)),
        backgroundColor: '#f97316',
        borderRadius: 6,
      }]
    };
  }, [ingredientData, sortData]);

  // KPI Card Component
  // KPI Card Component with proper Tailwind color mapping
  const KPICard = ({ title, value, subtitle, color = 'blue', icon }) => {
    const colorClasses = {
      blue: 'from-blue-100 border-blue-300 text-blue-600',
      green: 'from-green-100 border-green-300 text-green-600',
      red: 'from-red-100 border-red-300 text-red-600',
      orange: 'from-orange-100 border-orange-300 text-orange-600',
      purple: 'from-purple-100 border-purple-300 text-purple-600',
      yellow: 'from-yellow-100 border-yellow-300 text-yellow-600',
    };
    const classes = colorClasses[color] || colorClasses.blue;
    const [bgClass, borderClass, textClass] = classes.split(' ');
    
    return (
      <div className={`bg-gradient-to-br ${bgClass} to-white rounded-xl p-5 shadow-lg border ${borderClass}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-gray-600 text-xs uppercase tracking-wide">{title}</div>
            <div className={`${textClass} text-2xl font-bold mt-1`}>{value}</div>
            {subtitle && <div className="text-gray-700 text-xs mt-1">{subtitle}</div>}
          </div>
          {icon && <div className="text-3xl opacity-50">{icon}</div>}
        </div>
      </div>
    );
  };

  // Data Table Component
  const DataTable = ({ data, columns, maxHeight = '400px' }) => (
    <div className="mt-6 overflow-x-auto" style={{ maxHeight, overflowY: 'auto' }}>
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-gray-100">
          <tr className="border-b border-gray-300">
            {columns.map(col => (
              <th key={col.key} className="text-left text-gray-600 font-medium py-3 px-4">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data && Array.isArray(data) && data.length > 0 ? (
            data.map((row, idx) => (
              <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                {columns.map(col => (
                  <td key={col.key} className="py-3 px-4 text-black">
                    {col.format ? col.format(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="py-4 px-4 text-gray-500 text-center">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  // Filter Controls
  const FilterControls = ({ showTimePeriod, showDateFilter, showGroupBy, showLimit, showIngredientLimit, showSort = true }) => (
    <div className="flex flex-wrap gap-3 mb-4">
      {showTimePeriod && (
        <div className="flex items-center gap-2">
          <label className="text-gray-600 text-sm">Period:</label>
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-1.5 text-black text-sm"
          >
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="all">All Time</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
      )}
      {showDateFilter && timePeriod === 'custom' && (
        <>
          <div className="flex items-center gap-2">
            <label className="text-gray-600 text-sm">From:</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-1.5 text-black text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-gray-600 text-sm">To:</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-1.5 text-black text-sm"
            />
          </div>
        </>
      )}
      {showGroupBy && (
        <div className="flex items-center gap-2">
          <label className="text-gray-600 text-sm">Group:</label>
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
            className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-1.5 text-black text-sm"
          >
            <option value="day">Daily</option>
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
          </select>
        </div>
      )}
      {showLimit && (
        <div className="flex items-center gap-2">
          <label className="text-gray-600 text-sm">Show:</label>
          <select
            value={productLimit}
            onChange={(e) => setProductLimit(Number(e.target.value))}
            className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-1.5 text-black text-sm"
          >
            <option value={5}>Top 5</option>
            <option value={10}>Top 10</option>
            <option value={20}>Top 20</option>
          </select>
        </div>
      )}
      {showIngredientLimit && (
        <div className="flex items-center gap-2">
          <label className="text-gray-600 text-sm">Show:</label>
          <select
            value={ingredientLimit}
            onChange={(e) => setIngredientLimit(Number(e.target.value))}
            className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-1.5 text-black text-sm"
          >
            <option value={5}>Top 5</option>
            <option value={10}>Top 10</option>
            <option value={20}>Top 20</option>
            <option value={50}>Top 50</option>
          </select>
        </div>
      )}
      {showSort && (
        <div className="flex items-center gap-2 ml-auto">
          <label className="text-gray-600 text-sm">Sort:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-1.5 text-black text-sm"
          >
            <option value="desc">Highest First</option>
            <option value="asc">Lowest First</option>
          </select>
        </div>
      )}
    </div>
  );

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-600 text-xl">{error}</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <h1 className="text-black text-3xl font-extrabold mb-6">Key Performance Indicators</h1>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-black'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-300 min-h-[500px]">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-black text-lg">Loading...</div>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && kpiSummary && (
              <>
                <h2 className="text-black text-xl font-bold mb-4">Sales Overview</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <KPICard
                    title="Total Sales"
                    value={`₱${Number(kpiSummary.total_sales || 0).toLocaleString()}`}
                    icon="💰"
                    color="green"
                  />
                  <KPICard
                    title="Total Transactions"
                    value={Number(kpiSummary.total_transactions || 0).toLocaleString()}
                    icon="🧾"
                    color="blue"
                  />
                  <KPICard
                    title="Avg Order Value"
                    value={`₱${Number(kpiSummary.average_order_value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
                    icon="📊"
                    color="purple"
                  />
                  <KPICard
                    title="Qty Sold"
                    value={Number(kpiSummary.total_quantity_sold || 0).toLocaleString()}
                    subtitle="Total items"
                    icon="📦"
                    color="orange"
                  />
                </div>

                {/* Peak Hour */}
                {peakHour && (
                  <div className="bg-gradient-to-r from-purple-100 to-white rounded-xl p-4 mb-6 border border-purple-300">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🕐</span>
                      <div>
                        <div className="text-gray-600 text-sm">Peak Sales Hour</div>
                        <div className="text-purple-600 text-xl font-bold">
                          {peakHour.hour}:00 - {peakHour.hour + 1}:00
                        </div>
                        <div className="text-gray-700 text-xs">
                          {peakHour.transaction_count} transactions • ₱{Number(peakHour.total_revenue).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Hourly Distribution Chart */}
                <h3 className="text-black text-lg font-bold mb-3">Hourly Sales Distribution</h3>
                <div className="h-[250px]">
                  <Bar data={hourlyChartData} options={{ ...chartOptions, plugins: { legend: { display: false } } }} />
                </div>
              </>
            )}

            {/* Time-based Sales Tab */}
            {activeTab === 'time' && (
              <>
                <h2 className="text-black text-xl font-bold mb-4">Sales by Time Period</h2>
                <FilterControls showTimePeriod showDateFilter showGroupBy showSort={false} />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Sales Trend */}
                  <div>
                    <h3 className="text-black text-lg font-bold mb-3">Sales Trend ({groupBy})</h3>
                    <div className="h-[300px]">
                      <Line data={salesByDateChart} options={chartOptions} />
                    </div>
                  </div>

                  {/* Hourly */}
                  <div>
                    <h3 className="text-black text-lg font-bold mb-3">Hourly Distribution</h3>
                    <div className="h-[300px]">
                      <Bar data={hourlyChartData} options={{ ...chartOptions, plugins: { legend: { display: false } } }} />
                    </div>
                  </div>
                </div>

                {salesByDateRange.length > 0 && (
                  <DataTable
                    data={salesByDateRange}
                    columns={[
                      { key: 'period', label: 'Period' },
                      { key: 'transaction_count', label: 'Transactions' },
                      { key: 'total_items_sold', label: 'Items Sold' },
                      { key: 'total_revenue', label: 'Revenue', format: v => `₱${Number(v || 0).toLocaleString()}` },
                    ]}
                  />
                )}
              </>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <>
                <h2 className="text-black text-xl font-bold mb-4">Product Performance</h2>
                <FilterControls showTimePeriod showDateFilter showLimit showSort />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Fastest Moving */}
                  <div className="bg-gray-100 rounded-xl p-4">
                    <h3 className="text-green-600 text-lg font-bold mb-3 flex items-center gap-2">
                      🚀 Fastest-Moving Products
                    </h3>
                    <div className="h-[250px]">
                      <Bar data={topProductsChart} options={{ ...chartOptions, plugins: { legend: { display: false } } }} />
                    </div>
                  </div>

                  {/* Slowest Moving */}
                  <div className="bg-gray-100 rounded-xl p-4">
                    <h3 className="text-red-600 text-lg font-bold mb-3 flex items-center gap-2">
                      🐢 Slowest-Moving Products
                    </h3>
                    <div className="h-[250px]">
                      <Bar data={slowestProductsChart} options={{ ...chartOptions, plugins: { legend: { display: false } } }} />
                    </div>
                  </div>
                </div>

                {/* Full Product Table */}
                <h3 className="text-black text-lg font-bold mb-3">All Products Sales</h3>
                {salesByProduct.length > 0 && (
                  <DataTable
                    data={sortData(salesByProduct, 'total_revenue')}
                    columns={[
                      { key: 'product_name', label: 'Product' },
                      { key: 'category_name', label: 'Category' },
                      { key: 'total_quantity', label: 'Qty Sold', format: v => Number(v || 0).toLocaleString() },
                      { key: 'transaction_count', label: 'Orders' },
                      { key: 'total_revenue', label: 'Revenue', format: v => `₱${Number(v || 0).toLocaleString()}` },
                    ]}
                  />
                )}
              </>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
              <>
                <h2 className="text-black text-xl font-bold mb-4">Sales by Category</h2>
                <FilterControls showTimePeriod showDateFilter showSort />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Pie Chart */}
                  <div className="flex items-center justify-center">
                    <div className="w-[300px] h-[300px]">
                      <Doughnut
                        data={categoryPieChart}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { position: 'right', labels: { color: '#6b7280', padding: 15 } },
                          },
                        }}
                      />
                    </div>
                  </div>

                  {/* Category Bar Chart */}
                  <div className="h-[300px]">
                    <Bar
                      data={{
                        labels: sortData(salesByCategory, 'total_revenue').map(d => d.category_name || 'Uncategorized'),
                        datasets: [{
                          label: 'Revenue',
                          data: sortData(salesByCategory, 'total_revenue').map(d => parseFloat(d.total_revenue || 0)),
                          backgroundColor: '#3b82f6',
                          borderRadius: 6,
                        }]
                      }}
                      options={{ ...chartOptions, plugins: { legend: { display: false } } }}
                    />
                  </div>
                </div>

                {salesByCategory.length > 0 && (
                  <DataTable
                    data={sortData(salesByCategory, 'total_revenue')}
                    columns={[
                      { key: 'category_name', label: 'Category', format: v => v || 'Uncategorized' },
                      { key: 'total_quantity', label: 'Qty Sold', format: v => Number(v || 0).toLocaleString() },
                      { key: 'transaction_count', label: 'Orders' },
                      { key: 'total_revenue', label: 'Revenue', format: v => `₱${Number(v || 0).toLocaleString()}` },
                    ]}
                  />
                )}
              </>
            )}

            {/* Ingredients Tab */}
            {activeTab === 'ingredients' && (
              <>
                <h2 className="text-black text-xl font-bold mb-4">Ingredient Consumption</h2>
                <FilterControls showTimePeriod showDateFilter showIngredientLimit showSort />

                {ingredientData.length > 0 ? (
                  <>
                    <div style={{ height: Math.max(300, ingredientData.length * 35) + 'px', maxHeight: '400px', overflowY: 'auto' }}>
                      <Bar
                        data={ingredientChart}
                        options={{
                          ...chartOptions,
                          indexAxis: 'y',
                          maintainAspectRatio: false,
                          plugins: { legend: { display: false } },
                        }}
                      />
                    </div>
                    <DataTable
                      data={sortData(ingredientData, 'total_consumed')}
                      columns={[
                        { key: 'ingredient_name', label: 'Ingredient' },
                        { key: 'total_consumed', label: 'Total Consumed', format: v => Number(v || 0).toLocaleString() },
                      ]}
                    />
                  </>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-400">
                    No ingredient consumption data available.
                  </div>
                )}
              </>
            )}

            {/* Operations Tab */}
            {activeTab === 'operations' && (
              <>
                <h2 className="text-black text-xl font-bold mb-4">Operations & Inventory Metrics</h2>
                <FilterControls showTimePeriod showDateFilter showSort={false} />

                {/* Transaction Duration KPIs */}
                <div className="mb-6">
                  <h3 className="text-black text-lg font-bold mb-3 flex items-center gap-2">
                    ⏱️ Checkout/Transaction Duration
                  </h3>
                  {transactionDuration && transactionDuration.total_transactions > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <KPICard
                        title="Average Duration"
                        value={formatDuration(transactionDuration.avg_duration_seconds)}
                        subtitle={`${transactionDuration.total_transactions} transactions`}
                        icon="⏱️"
                        color="blue"
                      />
                      <KPICard
                        title="Fastest Checkout"
                        value={formatDuration(transactionDuration.min_duration_seconds)}
                        subtitle="Shortest transaction"
                        icon="🚀"
                        color="green"
                      />
                      <KPICard
                        title="Longest Checkout"
                        value={formatDuration(transactionDuration.max_duration_seconds)}
                        subtitle="Longest transaction"
                        icon="🐢"
                        color="orange"
                      />
                    </div>
                  ) : (
                    <div className="text-gray-600 bg-gray-100 rounded-lg p-4">No transaction duration data available. Duration is tracked when transactions have both start and finish timestamps.</div>
                  )}
                </div>

                {/* Cancelled/Returned Transactions */}
                <div className="mb-6">
                  <h3 className="text-black text-lg font-bold mb-3 flex items-center gap-2">
                    ❌ Cancelled/Voided Transactions
                  </h3>
                  {cancelledTransactions ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <KPICard
                        title="Cancelled Count"
                        value={Number(cancelledTransactions.cancelled_count || 0).toLocaleString()}
                        subtitle={`${cancelledTransactions.cancellation_rate || 0}% cancellation rate`}
                        icon="🚫"
                        color="red"
                      />
                      <KPICard
                        title="Lost Revenue"
                        value={`₱${Number(cancelledTransactions.total_lost_revenue || 0).toLocaleString()}`}
                        subtitle="From cancelled orders"
                        icon="💸"
                        color="red"
                      />
                      <KPICard
                        title="Completed"
                        value={Number(cancelledTransactions.completed_count || 0).toLocaleString()}
                        subtitle={`of ${cancelledTransactions.total_count || 0} total`}
                        icon="✅"
                        color="green"
                      />
                    </div>
                  ) : (
                    <div className="text-gray-600 bg-gray-100 rounded-lg p-4">No transaction data available</div>
                  )}
                </div>

                {/* Inventory Turnover */}
                <div className="mb-6">
                  <h3 className="text-black text-lg font-bold mb-3 flex items-center gap-2">
                    🔄 Inventory Turnover
                  </h3>
                  {inventoryTurnover.length > 0 ? (
                    <DataTable
                      data={sortData(inventoryTurnover, 'turnover_rate')}
                      columns={[
                        { key: 'ingredient_name', label: 'Product' },
                        { key: 'total_sold', label: 'Total Sold', format: v => Number(v || 0).toLocaleString() },
                        { key: 'current_stock', label: 'Current Stock', format: v => Number(v || 0).toLocaleString() },
                        { key: 'avg_stock', label: 'Avg Stock', format: v => Number(v || 0).toFixed(1) },
                        { key: 'turnover_rate', label: 'Turnover', format: v => {
                          const rate = Number(v || 0);
                          const color = rate > 2 ? 'text-green-400' : rate > 1 ? 'text-yellow-400' : 'text-red-400';
                          return <span className={color}>{rate.toFixed(2)}x</span>;
                        }},
                      ]}
                      maxHeight="250px"
                    />
                  ) : (
                    <div className="text-gray-400 bg-slate-700/50 rounded-lg p-4">No inventory turnover data available</div>
                  )}
                </div>

                {/* Stock Aging */}
                <div className="mb-6">
                  <h3 className="text-white text-lg font-bold mb-3 flex items-center gap-2">
                    📅 Stock Aging (Days Since Last Restock)
                  </h3>
                  {stockAging.length > 0 ? (
                    <DataTable
                      data={sortData(stockAging, 'days_since_last_restock')}
                      columns={[
                        { key: 'ingredient_name', label: 'Product' },
                        { key: 'current_stock', label: 'Current Stock', format: v => Number(v || 0).toLocaleString() },
                        { key: 'days_since_last_restock', label: 'Days Since Restock', format: (v) => {
                          if (v === null || v === undefined) return <span className="text-gray-500">Never restocked</span>;
                          const days = Number(v);
                          const color = days > 30 ? 'text-red-400' : days > 14 ? 'text-yellow-400' : 'text-green-400';
                          return <span className={color}>{days} days</span>;
                        }},
                        { key: 'last_restock_date', label: 'Last Restock', format: v => v ? new Date(v).toLocaleDateString() : 'Never' },
                        { key: 'age_category', label: 'Status', format: v => {
                          const badges = {
                            fresh: 'bg-green-500/20 text-green-400',
                            normal: 'bg-blue-500/20 text-blue-400',
                            aging: 'bg-yellow-500/20 text-yellow-400',
                            old: 'bg-red-500/20 text-red-400',
                            unknown: 'bg-gray-500/20 text-gray-400',
                          };
                          return <span className={`px-2 py-1 rounded text-xs ${badges[v] || badges.unknown}`}>{v || 'unknown'}</span>;
                        }},
                      ]}
                      maxHeight="250px"
                    />
                  ) : (
                    <div className="text-gray-400 bg-slate-700/50 rounded-lg p-4">No stock aging data available. This shows products with stock that have been restocked.</div>
                  )}
                </div>
              </>
            )}

            {/* =============== TRENDS TAB =============== */}
            {activeTab === 'trends' && (
              <>
                <h2 className="text-white text-xl font-bold mb-4">Trends & Lifecycle Analysis</h2>
                <FilterControls showSort />

                {/* Category Performance Trends */}
                <div className="mb-6">
                  <h3 className="text-white text-lg font-bold mb-3 flex items-center gap-2">
                    📊 Category Performance Trends
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">Comparing last 30 days vs previous 30 days</p>
                  {categoryTrends.length > 0 ? (
                    <DataTable
                      data={sortData(categoryTrends, 'growth_rate')}
                      columns={[
                        { key: 'category_name', label: 'Category' },
                        { key: 'this_month_revenue', label: 'Last 30 Days', format: v => `₱${Number(v || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}` },
                        { key: 'last_month_revenue', label: 'Previous 30 Days', format: v => `₱${Number(v || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}` },
                        { key: 'this_month_orders', label: 'Qty (Recent)', format: v => Number(v || 0).toLocaleString() },
                        { key: 'last_month_orders', label: 'Qty (Prev)', format: v => Number(v || 0).toLocaleString() },
                        { key: 'growth_rate', label: 'Growth', format: v => {
                          const rate = Number(v || 0);
                          const color = rate > 0 ? 'text-green-400' : rate < 0 ? 'text-red-400' : 'text-gray-400';
                          const arrow = rate > 0 ? '↑' : rate < 0 ? '↓' : '→';
                          return <span className={`${color} font-medium`}>{arrow} {Math.abs(rate).toFixed(1)}%</span>;
                        }},
                        { key: 'trend', label: 'Trend', format: v => {
                          const badges = {
                            up: { emoji: '📈', bg: 'bg-green-500/20 text-green-400', label: 'Growing' },
                            down: { emoji: '📉', bg: 'bg-red-500/20 text-red-400', label: 'Declining' },
                            stable: { emoji: '➡️', bg: 'bg-blue-500/20 text-blue-400', label: 'Stable' },
                          };
                          const badge = badges[v] || badges.stable;
                          return <span className={`px-2 py-1 rounded text-xs ${badge.bg}`}>{badge.emoji} {badge.label}</span>;
                        }},
                      ]}
                      maxHeight="300px"
                    />
                  ) : (
                    <div className="text-gray-400 bg-slate-700/50 rounded-lg p-4">No category trend data available. Need at least 2 months of sales data.</div>
                  )}
                </div>

                {/* Product Lifecycle Tracking */}
                <div className="mb-6">
                  <h3 className="text-white text-lg font-bold mb-3 flex items-center gap-2">
                    🔄 Product Lifecycle Tracking
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">Product stage classification based on sales velocity and time in market</p>
                  
                  {/* Lifecycle Stage Summary */}
                  {productLifecycle.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                      {['new', 'growing', 'peak', 'declining', 'stagnant'].map(stage => {
                        const count = productLifecycle.filter(p => p.lifecycle_stage === stage).length;
                        const stageConfig = {
                          new: { emoji: '🆕', bg: 'from-blue-900/50', border: 'border-blue-700/30', label: 'New' },
                          growing: { emoji: '📈', bg: 'from-green-900/50', border: 'border-green-700/30', label: 'Growing' },
                          peak: { emoji: '⭐', bg: 'from-yellow-900/50', border: 'border-yellow-700/30', label: 'Peak' },
                          declining: { emoji: '📉', bg: 'from-orange-900/50', border: 'border-orange-700/30', label: 'Declining' },
                          stagnant: { emoji: '💤', bg: 'from-gray-900/50', border: 'border-gray-700/30', label: 'Stagnant' },
                        };
                        const config = stageConfig[stage];
                        return (
                          <div key={stage} className={`bg-gradient-to-br ${config.bg} to-slate-800/50 rounded-lg p-3 border ${config.border} text-center`}>
                            <div className="text-2xl mb-1">{config.emoji}</div>
                            <div className="text-xl font-bold text-white">{count}</div>
                            <div className="text-xs text-gray-400">{config.label}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {productLifecycle.length > 0 ? (
                    <DataTable
                      data={sortData(productLifecycle, 'avg_daily_sales')}
                      columns={[
                        { key: 'product_name', label: 'Product' },
                        { key: 'days_since_created', label: 'Days Active', format: v => `${Number(v || 0)} days` },
                        { key: 'total_sold', label: 'Total Sold', format: v => Number(v || 0).toLocaleString() },
                        { key: 'avg_daily_sales', label: 'Avg Daily', format: v => Number(v || 0).toFixed(2) },
                        { key: 'recent_trend', label: 'Recent', format: v => {
                          const trend = Number(v || 0);
                          const color = trend > 0 ? 'text-green-400' : trend < 0 ? 'text-red-400' : 'text-gray-400';
                          const arrow = trend > 0 ? '↑' : trend < 0 ? '↓' : '→';
                          return <span className={color}>{arrow} {Math.abs(trend).toFixed(2)}/day</span>;
                        }},
                        { key: 'lifecycle_stage', label: 'Stage', format: v => {
                          const stages = {
                            new: { emoji: '🆕', bg: 'bg-blue-500/20 text-blue-400' },
                            growing: { emoji: '📈', bg: 'bg-green-500/20 text-green-400' },
                            peak: { emoji: '⭐', bg: 'bg-yellow-500/20 text-yellow-400' },
                            declining: { emoji: '📉', bg: 'bg-orange-500/20 text-orange-400' },
                            stagnant: { emoji: '💤', bg: 'bg-gray-500/20 text-gray-400' },
                          };
                          const stage = stages[v] || stages.stagnant;
                          return <span className={`px-2 py-1 rounded text-xs ${stage.bg}`}>{stage.emoji} {v}</span>;
                        }},
                      ]}
                      maxHeight="300px"
                    />
                  ) : (
                    <div className="text-gray-400 bg-slate-700/50 rounded-lg p-4">No product lifecycle data available.</div>
                  )}
                </div>

                {/* Stock Replenishment Performance */}
                <div className="mb-6">
                  <h3 className="text-white text-lg font-bold mb-3 flex items-center gap-2">
                    📦 Stock Replenishment Performance
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">How efficiently inventory is being restocked</p>
                  
                  {/* Replenishment Summary KPIs */}
                  {replenishmentPerformance.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <KPICard
                        title="Avg Restock Cycle"
                        value={`${(replenishmentPerformance.reduce((sum, p) => sum + Number(p.avg_days_between_restocks || 0), 0) / replenishmentPerformance.filter(p => p.avg_days_between_restocks).length || 0).toFixed(1)} days`}
                        subtitle="Average days between restocks"
                        color="blue"
                      />
                      <KPICard
                        title="Products with Stockouts"
                        value={replenishmentPerformance.filter(p => Number(p.total_stockouts) > 0).length}
                        subtitle={`Out of ${replenishmentPerformance.length} products`}
                        color="red"
                      />
                      <KPICard
                        title="Need Restock Soon"
                        value={replenishmentPerformance.filter(p => Number(p.days_since_last_restock) > 14).length}
                        subtitle="Not restocked in 14+ days"
                        color="yellow"
                      />
                    </div>
                  )}

                  {replenishmentPerformance.length > 0 ? (
                    <DataTable
                      data={sortData(replenishmentPerformance, 'days_since_last_restock')}
                      columns={[
                        { key: 'ingredient_name', label: 'Product' },
                        { key: 'total_restocks', label: 'Total Restocks', format: v => Number(v || 0).toLocaleString() },
                        { key: 'avg_days_between_restocks', label: 'Avg Days Between', format: v => {
                          if (!v) return <span className="text-gray-500">N/A</span>;
                          const days = Number(v);
                          const color = days < 7 ? 'text-green-400' : days < 14 ? 'text-blue-400' : days < 30 ? 'text-yellow-400' : 'text-red-400';
                          return <span className={color}>{days.toFixed(1)} days</span>;
                        }},
                        { key: 'total_stockouts', label: 'Stockouts', format: v => {
                          const count = Number(v || 0);
                          const color = count === 0 ? 'text-green-400' : count < 3 ? 'text-yellow-400' : 'text-red-400';
                          return <span className={color}>{count}</span>;
                        }},
                        { key: 'days_since_last_restock', label: 'Since Last Restock', format: v => {
                          if (v === null || v === undefined) return <span className="text-gray-500">Never</span>;
                          const days = Number(v);
                          const color = days < 7 ? 'text-green-400' : days < 14 ? 'text-blue-400' : days < 30 ? 'text-yellow-400' : 'text-red-400';
                          return <span className={color}>{days} days ago</span>;
                        }},
                        { key: 'last_restock_date', label: 'Last Restock', format: v => v ? new Date(v).toLocaleDateString() : 'Never' },
                      ]}
                      maxHeight="300px"
                    />
                  ) : (
                    <div className="text-gray-400 bg-slate-700/50 rounded-lg p-4">No replenishment data available.</div>
                  )}
                </div>
              </>
            )}

            {/* =============== INSIGHTS TAB =============== */}
            {activeTab === 'insights' && (
              <>
                <h2 className="text-white text-xl font-bold mb-4">Customer & Basket Insights</h2>
                <FilterControls showTimePeriod showDateFilter showSort />

                {/* Segmentation Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {/* Basket Size Distribution */}
                  <div className="bg-bronze rounded-xl p-4">
                    <h3 className="text-purple-400 text-sm font-bold mb-3">🛒 Basket Size</h3>
                    {basketSizeSegmentation.map((seg, idx) => (
                      <div key={idx} className="flex justify-between items-center mb-2">
                        <span className="text-gray-300 capitalize">{seg.basket_size}</span>
                        <span className="text-white font-medium">{seg.percentage}%</span>
                      </div>
                    ))}
                  </div>

                  {/* Basket Value Distribution */}
                  <div className="bg-bronze rounded-xl p-4">
                    <h3 className="text-green-400 text-sm font-bold mb-3">💰 Spend Level</h3>
                    {basketValueSegmentation.map((seg, idx) => (
                      <div key={idx} className="flex justify-between items-center mb-2">
                        <span className="text-gray-300 capitalize">{seg.spend_segment}</span>
                        <span className="text-white font-medium">{seg.percentage}%</span>
                      </div>
                    ))}
                  </div>

                  {/* Time-based Distribution */}
                  <div className="bg-bronze rounded-xl p-4">
                    <h3 className="text-orange-400 text-sm font-bold mb-3">⏰ Peak Hours</h3>
                    {timeBasedSegmentation?.segments?.map((seg, idx) => (
                      <div key={idx} className="flex justify-between items-center mb-2">
                        <span className={`text-gray-300 capitalize ${seg.is_peak ? 'text-orange-400 font-bold' : ''}`}>
                          {seg.time_segment} {seg.is_peak && '⭐'}
                        </span>
                        <span className="text-white font-medium">{seg.percentage}%</span>
                      </div>
                    ))}
                  </div>

                  {/* Category Distribution */}
                  <div className="bg-bronze rounded-xl p-4">
                    <h3 className="text-blue-400 text-sm font-bold mb-3">🏷️ Top Categories</h3>
                    {categorySegmentation.slice(0, 4).map((seg, idx) => (
                      <div key={idx} className="flex justify-between items-center mb-2">
                        <span className="text-gray-300 truncate mr-2">{seg.category_name}</span>
                        <span className="text-white font-medium">{seg.revenue_share}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Basket Size Details */}
                <div className="mb-6">
                  <h3 className="text-white text-lg font-bold mb-3 flex items-center gap-2">
                    🛒 Basket Size Segmentation
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">Small: 1-2 items | Medium: 3-5 items | Large: 6+ items</p>
                  {basketSizeSegmentation.length > 0 ? (
                    <DataTable
                      data={basketSizeSegmentation}
                      columns={[
                        { key: 'basket_size', label: 'Size', format: v => <span className="capitalize font-medium">{v}</span> },
                        { key: 'transaction_count', label: 'Transactions', format: v => Number(v).toLocaleString() },
                        { key: 'total_revenue', label: 'Revenue', format: v => `₱${Number(v || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}` },
                        { key: 'avg_transaction_value', label: 'Avg Value', format: v => `₱${Number(v || 0).toFixed(2)}` },
                        { key: 'avg_items_per_basket', label: 'Avg Items', format: v => Number(v || 0).toFixed(1) },
                        { key: 'percentage', label: 'Share', format: v => `${v}%` },
                      ]}
                      maxHeight="200px"
                    />
                  ) : (
                    <div className="text-gray-400 bg-slate-700/50 rounded-lg p-4">No basket size data available.</div>
                  )}
                </div>

                {/* Basket Value Details */}
                <div className="mb-6">
                  <h3 className="text-white text-lg font-bold mb-3 flex items-center gap-2">
                    💰 Basket Value Segmentation
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">Low: ≤₱100 | Medium: ₱101-500 | High: &gt;₱500</p>
                  {basketValueSegmentation.length > 0 ? (
                    <DataTable
                      data={basketValueSegmentation}
                      columns={[
                        { key: 'spend_segment', label: 'Segment', format: v => <span className="capitalize font-medium">{v}</span> },
                        { key: 'transaction_count', label: 'Transactions', format: v => Number(v).toLocaleString() },
                        { key: 'total_revenue', label: 'Revenue', format: v => `₱${Number(v || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}` },
                        { key: 'min_spend', label: 'Min', format: v => `₱${Number(v || 0).toFixed(2)}` },
                        { key: 'max_spend', label: 'Max', format: v => `₱${Number(v || 0).toFixed(2)}` },
                        { key: 'percentage', label: 'Share', format: v => `${v}%` },
                      ]}
                      maxHeight="200px"
                    />
                  ) : (
                    <div className="text-gray-400 bg-slate-700/50 rounded-lg p-4">No basket value data available.</div>
                  )}
                </div>

                {/* Product Affinity / Market Basket Analysis */}
                <div className="mb-6">
                  <h3 className="text-white text-lg font-bold mb-3 flex items-center gap-2">
                    🔗 Product Affinity (Frequently Bought Together)
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">Products that are commonly purchased together</p>
                  {productAffinity.length > 0 ? (
                    <DataTable
                      data={productAffinity}
                      columns={[
                        { key: 'product_a', label: 'Product A' },
                        { key: 'product_b', label: 'Product B' },
                        { key: 'co_occurrence_count', label: 'Times Together', format: v => Number(v).toLocaleString() },
                        { key: 'support_percent', label: 'Support', format: v => `${Number(v || 0).toFixed(1)}%` },
                        { key: 'confidence_a_to_b', label: 'Confidence', format: v => {
                          const pct = Number(v || 0);
                          const color = pct > 50 ? 'text-green-400' : pct > 25 ? 'text-yellow-400' : 'text-gray-400';
                          return <span className={color}>{pct.toFixed(1)}%</span>;
                        }},
                      ]}
                      maxHeight="300px"
                    />
                  ) : (
                    <div className="text-gray-400 bg-slate-700/50 rounded-lg p-4">No product affinity data available. Need more transaction history.</div>
                  )}
                </div>
              </>
            )}

            {/* =============== FORECAST TAB =============== */}
            {activeTab === 'forecast' && (
              <>
                <h2 className="text-black text-xl font-bold mb-4">🔮 Forecasting & Predictions (AI-Powered)</h2>
                
                <div className="mb-4 bg-blue-500/20 border border-blue-700/30 rounded-lg p-3">
                  <p className="text-black-300 text-sm">
                    ℹ️ Using SARIMA/ARIMA models to predict future trends. Click the buttons below to generate forecasts.
                  </p>
                </div>

                {/* Forecast Actions - Using Real Data */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  <button
                    onClick={async () => {
                      try {
                        setLoading(true);
                        const businessId = getBusinessId();
                        if (!businessId) {
                          alert('No business selected. Please select a business to generate a forecast.');
                          setLoading(false);
                          return;
                        }
                        // Fetch real revenue forecast from backend
                        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/forecast/revenue/${businessId}?days=30&steps=7`);
                        if (!response.ok) {
                          const error = await response.json();
                          alert(error.message || 'Failed to generate forecast');
                          return;
                        }
                        const result = await response.json();
                        setRevenueForecastData(result);
                      } catch (err) {
                        console.error('Forecast error:', err);
                        alert('Failed to generate revenue forecast: ' + err.message);
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={loading}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-3 rounded-lg font-medium transition"
                  >
                    📊 Forecast Revenue (Next 7 Days)
                  </button>
                  
                  <button
                    onClick={async () => {
                      try {
                        setLoading(true);
                        const businessId = localStorage.getItem('selectedBusinessId');
                        
                        // Fetch reorder alerts from backend
                        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/forecast/reorder-alerts/${businessId}?leadTime=3&safetyStock=20`);
                        
                        if (!response.ok) {
                          const error = await response.json();
                          alert(error.message || 'Failed to get alerts');
                          return;
                        }
                        
                        const alerts = await response.json();
                        setMicroserviceReorderAlerts(alerts);
                      } catch (err) {
                        console.error('Reorder alert error:', err);
                        alert('Failed to get reorder alerts: ' + err.message);
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-4 py-3 rounded-lg font-medium transition"
                  >
                    🔔 Check Reorder Alerts
                  </button>
                  
                  <div className="flex gap-2 items-center">
                    <select
                      value={selectedCategoryForForecast}
                      onChange={(e) => setSelectedCategoryForForecast(e.target.value)}
                      className="bg-gray-700 text-white px-3 py-3 rounded-lg border border-gray-600 flex-1"
                    >
                      <option value="">Select a category...</option>
                      {salesByCategory?.map((cat) => (
                        <option key={cat.category_id} value={cat.category_id}>
                          {cat.category_name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={async () => {
                        if (!selectedCategoryForForecast) {
                          alert('Please select a category first');
                          return;
                        }
                        try {
                          setLoading(true);
                          const businessId = localStorage.getItem('selectedBusinessId');
                          
                          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/forecast/category/${businessId}/${selectedCategoryForForecast}?days=30&steps=14`);
                          
                          if (!response.ok) {
                            const error = await response.json();
                            alert(error.message || 'Failed to forecast category demand');
                            return;
                          }
                          
                          const result = await response.json();
                          setCategoryForecastData(result);
                        } catch (err) {
                          console.error('Category forecast error:', err);
                          alert('Failed to forecast category demand: ' + err.message);
                        } finally {
                          setLoading(false);
                        }
                      }}
                      disabled={loading || !selectedCategoryForForecast}
                      className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white px-4 py-3 rounded-lg font-medium transition whitespace-nowrap"
                    >
                      📈 Forecast Category
                    </button>
                  </div>
                </div>

                {/* Category Demand Forecast Results */}
                {categoryForecastData && (
                  <div className="mb-6">
                    <h3 className="text-white text-lg font-bold mb-3 flex items-center gap-2">
                      📈 Category Demand Forecast (Next 14 Days)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <KPICard
                        title="Total Forecasted Demand"
                        value={categoryForecastData.total_forecasted_demand?.toFixed(0) ?? 'N/A'}
                        subtitle="Next 14 days"
                        color="orange"
                      />
                      <KPICard
                        title="Average Daily Demand"
                        value={(categoryForecastData.total_forecasted_demand / 14)?.toFixed(1) ?? 'N/A'}
                        subtitle="Predicted average"
                        color="yellow"
                      />
                      <KPICard
                        title="Trend"
                        value={categoryForecastData.trend_analysis?.trend ?? 'N/A'}
                        subtitle={`${categoryForecastData.trend_analysis?.percentage_change > 0 ? '+' : ''}${categoryForecastData.trend_analysis?.percentage_change?.toFixed(1) ?? 'N/A'}%`}
                        color={categoryForecastData.trend_analysis?.trend === 'growing' ? 'green' : 'red'}
                      />
                    </div>
                    {categoryForecastData.forecast && categoryForecastData.forecast.length > 0 && (
                      <DataTable
                        data={categoryForecastData.forecast}
                        columns={[
                          { key: 'date', label: 'Date' },
                          { key: 'value', label: 'Forecasted Demand', format: v => Number(v).toFixed(1) },
                        ]}
                        maxHeight="300px"
                      />
                    )}
                  </div>
                )}

                {/* Revenue Forecast Results */}
                {revenueForecastData && (
                  <div className="mb-6">
                    <h3 className="text-black text-lg font-bold mb-3 flex items-center gap-2">
                      💰 Revenue Forecast (Next 7 Days)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <KPICard
                        title="Total Forecasted Revenue"
                        value={`₱${revenueForecastData.total_forecasted_revenue?.toLocaleString() ?? 'N/A'}`}
                        subtitle="Next 7 days"
                        color="purple"
                      />
                      <KPICard
                        title="Average Daily Revenue"
                        value={`₱${revenueForecastData.average_monthly_revenue?.toLocaleString() ?? 'N/A'}`}
                        subtitle="Predicted average"
                        color="blue"
                      />
                      <KPICard
                        title="Growth Rate"
                        value={`${revenueForecastData.growth_rate > 0 ? '+' : ''}${revenueForecastData.growth_rate?.toFixed(2) ?? 'N/A'}%`}
                        subtitle={revenueForecastData.growth_rate > 0 ? '📈 Growing' : '📉 Declining'}
                        color={revenueForecastData.growth_rate > 0 ? 'green' : 'red'}
                      />
                    </div>
                    <DataTable
                      data={revenueForecastData.forecast}
                      columns={[
                        { key: 'date', label: 'Date' },
                        { key: 'value', label: 'Forecasted Revenue', format: v => `₱${Number(v).toLocaleString(undefined, {minimumFractionDigits: 2})}` },
                      ]}
                      maxHeight="300px"
                    />
                  </div>
                )}

                {/* Ingredient Usage Forecasts */}
                {ingredientForecasts.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-white text-lg font-bold mb-3 flex items-center gap-2">
                      🥗 Ingredient Usage Forecasts
                    </h3>
                    {ingredientForecasts.map((forecast, idx) => (
                      <div key={idx} className="mb-4 bg-slate-700/50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <div>
                            <div className="text-gray-400 text-sm">Ingredient ID</div>
                            <div className="text-white font-bold">{forecast.ingredient_id ?? 'N/A'}</div>
                          </div>
                          <div>
                            <div className="text-gray-400 text-sm">Total 7-Day Usage</div>
                            <div className="text-white font-bold">{forecast.total_forecasted_usage?.toFixed(2) ?? 'N/A'}</div>
                          </div>
                          <div>
                            <div className="text-gray-400 text-sm">Average Daily</div>
                            <div className="text-white font-bold">{forecast.average_daily_usage?.toFixed(2) ?? 'N/A'}</div>
                          </div>
                        </div>
                        <div className="mb-2">
                          <div className="text-gray-400 text-sm">Peak Usage Day</div>
                          <div className="text-orange-400 font-medium">
                            {forecast.peak_usage_day?.date ?? 'N/A'} - {forecast.peak_usage_day?.value?.toFixed(2) ?? 'N/A'} units
                          </div>
                        </div>
                        <DataTable
                          data={forecast.forecast}
                          columns={[
                            { key: 'date', label: 'Date' },
                            { key: 'value', label: 'Forecasted Usage', format: v => Number(v).toFixed(2) },
                          ]}
                          maxHeight="200px"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Microservice Reorder Alerts */}
                {microserviceReorderAlerts.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-white text-lg font-bold mb-3 flex items-center gap-2">
                      🔔 AI Reorder Alerts ({microserviceReorderAlerts.length} products)
                    </h3>
                    {microserviceReorderAlerts.map((alert, idx) => (
                      <div 
                        key={idx} 
                        className={`p-4 rounded-lg border mb-3 ${
                          alert.alert_status === 'CRITICAL' ? 'bg-red-900/30 border-red-700/50' :
                          alert.alert_status === 'WARNING' ? 'bg-yellow-900/30 border-yellow-700/50' :
                          alert.alert_status === 'ATTENTION' ? 'bg-blue-900/30 border-blue-700/50' :
                          alert.alert_status === 'ERROR' || alert.alert_status === 'INSUFFICIENT_DATA' ? 'bg-gray-900/30 border-gray-700/50' :
                          'bg-green-900/30 border-green-700/50'
                        }`}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className={`font-bold text-lg mb-2 ${
                              alert.alert_status === 'CRITICAL' ? 'text-red-400' :
                              alert.alert_status === 'WARNING' ? 'text-yellow-400' :
                              alert.alert_status === 'ATTENTION' ? 'text-blue-400' :
                              alert.alert_status === 'ERROR' || alert.alert_status === 'INSUFFICIENT_DATA' ? 'text-gray-400' :
                              'text-green-400'
                            }`}>
                              {alert.alert_status} - {alert.product_name || alert.ingredient_id}
                            </div>
                            {alert.message && (
                              <div className="text-gray-400 text-sm mb-2 italic">
                                {alert.message}
                              </div>
                            )}
                            <div className="text-gray-300 text-sm space-y-1">
                              <div>Current Stock: {alert.current_stock ?? 'N/A'}</div>
                              {alert.reorder_point && <div>Reorder Point: {alert.reorder_point?.toFixed(0) ?? 'N/A'}</div>}
                              {alert.projected_stock && <div>Projected Stock (in {alert.lead_time_days ?? 0} days): {alert.projected_stock?.toFixed(2) ?? 'N/A'}</div>}
                            </div>
                          </div>
                          <div className="text-right">
                            {alert.should_reorder ? (
                              <>
                                <div className="text-white font-bold text-2xl">{alert.recommended_order_quantity?.toFixed(0) ?? 'N/A'}</div>
                                <div className="text-gray-400 text-sm">Recommended Order Qty</div>
                                <div className="text-orange-400 mt-2">
                                  ⚠️ Reorder in {alert.days_until_reorder ?? 'N/A'} days
                                </div>
                              </>
                            ) : alert.alert_status === 'ERROR' || alert.alert_status === 'INSUFFICIENT_DATA' ? (
                              <div className="text-gray-400 font-medium">ℹ️ Cannot Predict</div>
                            ) : (
                              <div className="text-green-400 font-medium">✅ Stock Sufficient</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Legacy Forecast Data (if available from old API) */}
                {salesForecast && salesForecast.metrics && (
                  <div className="mb-6 ">
                    <h3 className="text-black text-lg font-bold mb-3 flex items-center gap-2">
                      📊 Legacy Sales Forecast
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <KPICard
                        title="Avg Daily Revenue"
                        value={`₱${Number(salesForecast.metrics.avg_daily_revenue).toLocaleString()}`}
                        subtitle="Last 30 days average"
                        color="blue"
                      />
                      <KPICard
                        title="7-Day Moving Avg"
                        value={`₱${Number(salesForecast.metrics.moving_avg_7day).toLocaleString()}`}
                        subtitle="Recent trend"
                        color="purple"
                      />
                      <KPICard
                        title="Trend"
                        value={`${salesForecast.metrics.trend_percent > 0 ? '+' : ''}${salesForecast.metrics.trend_percent}%`}
                        subtitle={salesForecast.metrics.trend_direction === 'up' ? '📈 Growing' : salesForecast.metrics.trend_direction === 'down' ? '📉 Declining' : '➡️ Stable'}
                        color={salesForecast.metrics.trend_direction === 'up' ? 'green' : salesForecast.metrics.trend_direction === 'down' ? 'red' : 'blue'}
                      />
                      <KPICard
                        title="Next 7 Days Forecast"
                        value={`₱${salesForecast.next_7_days?.reduce((sum, d) => sum + d.forecasted_revenue, 0).toLocaleString(undefined, {minimumFractionDigits: 0})}`}
                        subtitle="Expected revenue"
                        color="orange"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export default SalesAnalysis;
