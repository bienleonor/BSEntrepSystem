import { useEffect, useState, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import DashboardLayout from "../../components/layout/DashboardLayout";
import * as AnalysisApi from "../../services/analysisApi";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function UserDashboard() {
  const [summary, setSummary] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [profitData, setProfitData] = useState([]);
  const [loading, setLoading] = useState(true);

  const businessId = localStorage.getItem("selectedBusinessId") || "";

  useEffect(() => {
    if (!businessId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [summaryRes, topProductsRes, profitRes] = await Promise.all([
          AnalysisApi.getBusinessSummary(businessId),
          AnalysisApi.getTopSellingProducts(businessId, 5),
          AnalysisApi.getProfitByCategory(businessId),
        ]);
        setSummary(summaryRes);
        setTopProducts(topProductsRes);
        setProfitData(profitRes);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, [businessId]);

  const topProductsChart = useMemo(() => ({
    labels: topProducts.map(d => d.product_name),
    datasets: [{
      label: "Units Sold",
      data: topProducts.map(d => parseFloat(d.total_sold || 0)),
      backgroundColor: "#3b82f6",
      borderRadius: 6,
    }]
  }), [topProducts]);

  const profitChart = useMemo(() => ({
    labels: profitData.map(d => d.category_name),
    datasets: [{
      label: "Profit",
      data: profitData.map(d => parseFloat(d.total_profit || 0)),
      backgroundColor: "#22c55e",
      borderRadius: 6,
    }]
  }), [profitData]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: "rgba(255,255,255,0.1)" }, ticks: { color: "#9ca3af" } },
      y: { grid: { color: "rgba(255,255,255,0.1)" }, ticks: { color: "#9ca3af" } },
    },
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white text-xl">Loading dashboard...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <h1 className="text-4xl font-bold text-white mb-6">DASHBOARD</h1>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-5 shadow-lg border border-slate-600">
            <div className="text-gray-400 text-xs uppercase tracking-wide">Transactions</div>
            <div className="text-white text-3xl font-bold mt-2">{summary.total_transactions || 0}</div>
          </div>
          <div className="bg-gradient-to-br from-green-900/50 to-slate-800 rounded-xl p-5 shadow-lg border border-green-700/30">
            <div className="text-gray-400 text-xs uppercase tracking-wide">Revenue</div>
            <div className="text-green-400 text-3xl font-bold mt-2">₱{Number(summary.total_revenue || 0).toLocaleString()}</div>
          </div>
          <div className="bg-gradient-to-br from-red-900/50 to-slate-800 rounded-xl p-5 shadow-lg border border-red-700/30">
            <div className="text-gray-400 text-xs uppercase tracking-wide">Cost</div>
            <div className="text-red-400 text-3xl font-bold mt-2">₱{Number(summary.total_cost || 0).toLocaleString()}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-900/50 to-slate-800 rounded-xl p-5 shadow-lg border border-blue-700/30">
            <div className="text-gray-400 text-xs uppercase tracking-wide">Profit</div>
            <div className="text-blue-400 text-3xl font-bold mt-2">₱{Number(summary.total_profit || 0).toLocaleString()}</div>
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        {topProducts.length > 0 && (
          <div className="bg-slate-800 rounded-xl p-5 shadow-lg border border-slate-700">
            <h2 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Top Selling Products
            </h2>
            <Bar data={topProductsChart} options={chartOptions} />
          </div>
        )}

        {/* Profit by Category */}
        {profitData.length > 0 && (
          <div className="bg-slate-800 rounded-xl p-5 shadow-lg border border-slate-700">
            <h2 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Profit by Category
            </h2>
            <Bar data={profitChart} options={chartOptions} />
          </div>
        )}
      </div>

      {/* Quick Stats or Empty State */}
      {!summary && !loading && (
        <div className="bg-slate-800 rounded-xl p-8 text-center">
          <p className="text-gray-400 text-lg">No sales data available yet.</p>
          <p className="text-gray-500 text-sm mt-2">Start making sales to see your dashboard analytics!</p>
        </div>
      )}
    </DashboardLayout>
  );
}
