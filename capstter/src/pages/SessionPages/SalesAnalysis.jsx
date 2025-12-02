import React, { useEffect, useState, useMemo, useCallback } from 'react';
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
import * as AnalysisApi from '../../services/analysisApi';

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

// Tab configurations
const TABS = [
  { id: 'sales', label: 'Sales Trend', icon: '📈' },
  { id: 'profit', label: 'Profit Analysis', icon: '💰' },
  { id: 'products', label: 'Top Products', icon: '🏆' },
  { id: 'ingredients', label: 'Ingredients', icon: '🥗' },
];

function SalesAnalysis() {
  const [activeTab, setActiveTab] = useState('sales');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data states
  const [salesData, setSalesData] = useState([]);
  const [profitData, setProfitData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [ingredientData, setIngredientData] = useState([]);

  // Filter states
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  const [productLimit, setProductLimit] = useState(10);
  const [ingredientLimit, setIngredientLimit] = useState(10);

  const businessId = localStorage.getItem('selectedBusinessId') || '';

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
          case 'sales': {
            const salesRes = await AnalysisApi.getSalesTrendByCategory(businessId, {
              startDate: dateRange.start || undefined,
              endDate: dateRange.end || undefined,
            });
            setSalesData(salesRes);
            break;
          }
          case 'profit': {
            const profitRes = await AnalysisApi.getProfitByCategory(businessId);
            setProfitData(profitRes);
            break;
          }
          case 'products': {
            const productsRes = await AnalysisApi.getTopSellingProducts(businessId, productLimit);
            setTopProducts(productsRes);
            break;
          }
          case 'ingredients': {
            const ingredientRes = await AnalysisApi.getIngredientConsumption(businessId);
            // Sort by consumption and limit
            const sorted = [...ingredientRes].sort((a, b) => 
              parseFloat(b.total_consumed || 0) - parseFloat(a.total_consumed || 0)
            );
            setIngredientData(sorted.slice(0, ingredientLimit));
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
  }, [businessId, activeTab, dateRange.start, dateRange.end, productLimit, ingredientLimit]);

  // Sort helper - wrapped in useCallback to avoid re-creation
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
      legend: {
        position: 'top',
        labels: { color: '#9ca3af', usePointStyle: true, padding: 15 },
      },
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#9ca3af' } },
      y: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#9ca3af' } },
    },
  };

  // Sales Chart
  const salesChart = useMemo(() => {
    const categories = [...new Set(salesData.map(d => d.category_name))];
    const months = [...new Set(salesData.map(d => d.month))].sort();

    const datasets = categories.map((cat, index) => ({
      label: cat,
      data: months.map(month => {
        const record = salesData.find(d => d.category_name === cat && d.month === month);
        return record ? parseFloat(record.total_revenue) : 0;
      }),
      borderColor: `hsl(${index * 60}, 70%, 50%)`,
      backgroundColor: `hsla(${index * 60}, 70%, 50%, 0.1)`,
      fill: true,
      tension: 0.4,
    }));

    return { labels: months, datasets };
  }, [salesData]);

  // Profit Chart
  const profitChart = useMemo(() => {
    const sorted = sortData(profitData, 'total_profit');
    return {
      labels: sorted.map(d => d.category_name),
      datasets: [{
        label: 'Profit',
        data: sorted.map(d => parseFloat(d.total_profit || 0)),
        backgroundColor: sorted.map(d => parseFloat(d.total_profit || 0) >= 0 ? '#22c55e' : '#ef4444'),
        borderRadius: 6,
      }]
    };
  }, [profitData, sortData]);

  // Top Products Chart
  const topProductsChart = useMemo(() => {
    const sorted = sortData(topProducts, 'total_sold');
    return {
      labels: sorted.map(d => d.product_name),
      datasets: [{
        label: 'Units Sold',
        data: sorted.map(d => parseFloat(d.total_sold || 0)),
        backgroundColor: '#3b82f6',
        borderRadius: 6,
      }]
    };
  }, [topProducts, sortData]);

  // Ingredient Chart
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

  // Filter Controls Component
  const FilterControls = ({ showDateFilter = false, showLimitFilter = false, showIngredientLimit = false }) => (
    <div className="flex flex-wrap gap-3 mb-4">
      {showDateFilter && (
        <>
          <div className="flex items-center gap-2">
            <label className="text-gray-400 text-sm">From:</label>
            <input
              type="month"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-gray-400 text-sm">To:</label>
            <input
              type="month"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {(dateRange.start || dateRange.end) && (
            <button
              onClick={() => setDateRange({ start: '', end: '' })}
              className="px-3 py-1.5 bg-slate-600 hover:bg-slate-500 text-white text-sm rounded-lg transition"
            >
              Clear
            </button>
          )}
        </>
      )}

      {showLimitFilter && (
        <div className="flex items-center gap-2">
          <label className="text-gray-400 text-sm">Show:</label>
          <select
            value={productLimit}
            onChange={(e) => setProductLimit(Number(e.target.value))}
            className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-white text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value={5}>Top 5</option>
            <option value={10}>Top 10</option>
            <option value={20}>Top 20</option>
            <option value={50}>Top 50</option>
          </select>
        </div>
      )}

      {showIngredientLimit && (
        <div className="flex items-center gap-2">
          <label className="text-gray-400 text-sm">Show:</label>
          <select
            value={ingredientLimit}
            onChange={(e) => setIngredientLimit(Number(e.target.value))}
            className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-white text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value={5}>Top 5</option>
            <option value={10}>Top 10</option>
            <option value={20}>Top 20</option>
            <option value={50}>Top 50</option>
            <option value={100}>Top 100</option>
          </select>
        </div>
      )}

      <div className="flex items-center gap-2 ml-auto">
        <label className="text-gray-400 text-sm">Sort:</label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-white text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="desc">Highest First</option>
          <option value="asc">Lowest First</option>
        </select>
      </div>
    </div>
  );

  // Data Table Component
  const DataTable = ({ data, columns }) => (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-600">
            {columns.map(col => (
              <th key={col.key} className="text-left text-gray-400 font-medium py-3 px-4">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-b border-slate-700 hover:bg-slate-700/50">
              {columns.map(col => (
                <td key={col.key} className="py-3 px-4 text-white">
                  {col.format ? col.format(row[col.key]) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-400 text-xl">{error}</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <h1 className="text-white text-3xl font-extrabold mb-6">Sales Analysis</h1>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600 hover:text-white'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 min-h-[500px]">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-white text-lg">Loading...</div>
          </div>
        ) : (
          <>
            {/* Sales Trend Tab */}
            {activeTab === 'sales' && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white text-xl font-bold flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    Sales Trend by Category
                  </h2>
                </div>
                <FilterControls showDateFilter={true} />
                <div className="h-[350px]">
                  <Line data={salesChart} options={chartOptions} />
                </div>
                {salesData.length > 0 && (
                  <DataTable
                    data={salesData}
                    columns={[
                      { key: 'month', label: 'Month' },
                      { key: 'category_name', label: 'Category' },
                      { key: 'total_revenue', label: 'Revenue', format: v => `₱${Number(v || 0).toLocaleString()}` },
                    ]}
                  />
                )}
              </>
            )}

            {/* Profit Analysis Tab */}
            {activeTab === 'profit' && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white text-xl font-bold flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Profit by Category
                  </h2>
                </div>
                <FilterControls />
                <div className="h-[350px]">
                  <Bar data={profitChart} options={{ ...chartOptions, plugins: { legend: { display: false } } }} />
                </div>
                {profitData.length > 0 && (
                  <DataTable
                    data={sortData(profitData, 'total_profit')}
                    columns={[
                      { key: 'category_name', label: 'Category' },
                      { key: 'total_revenue', label: 'Revenue', format: v => `₱${Number(v || 0).toLocaleString()}` },
                      { key: 'total_cost', label: 'Cost', format: v => `₱${Number(v || 0).toLocaleString()}` },
                      { key: 'total_profit', label: 'Profit', format: v => `₱${Number(v || 0).toLocaleString()}` },
                    ]}
                  />
                )}
              </>
            )}

            {/* Top Products Tab */}
            {activeTab === 'products' && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white text-xl font-bold flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Top Selling Products
                  </h2>
                </div>
                <FilterControls showLimitFilter={true} />
                <div className="h-[350px]">
                  <Bar data={topProductsChart} options={{ ...chartOptions, plugins: { legend: { display: false } } }} />
                </div>
                {topProducts.length > 0 && (
                  <DataTable
                    data={sortData(topProducts, 'total_sold')}
                    columns={[
                      { key: 'product_name', label: 'Product' },
                      { key: 'category_name', label: 'Category' },
                      { key: 'total_sold', label: 'Units Sold', format: v => Number(v || 0).toLocaleString() },
                      { key: 'total_revenue', label: 'Revenue', format: v => `₱${Number(v || 0).toLocaleString()}` },
                    ]}
                  />
                )}
              </>
            )}

            {/* Ingredients Tab */}
            {activeTab === 'ingredients' && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white text-xl font-bold flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    Ingredient Consumption
                  </h2>
                </div>
                <FilterControls showIngredientLimit={true} />
                {ingredientData.length > 0 ? (
                  <>
                    <div style={{ height: Math.max(300, ingredientData.length * 35) + 'px', maxHeight: '500px', overflowY: 'auto' }}>
                      <Bar
                        data={ingredientChart}
                        options={{
                          ...chartOptions,
                          indexAxis: 'y',
                          maintainAspectRatio: false,
                          plugins: { legend: { display: false } },
                          scales: {
                            ...chartOptions.scales,
                            y: {
                              ...chartOptions.scales.y,
                              ticks: {
                                ...chartOptions.scales.y.ticks,
                                font: { size: 11 },
                                autoSkip: false,
                              }
                            }
                          }
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
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export default SalesAnalysis;
