// src/components/dashboard/superadmin/AdminOverviewSection.jsx

import { useEffect, useState } from "react";
import OverviewCard from "../OverviewCard"; // Reusing the card component
import axiosInstance from "../../../utils/axiosInstance";

export default function AdminOverviewSection() {
  const [metrics, setMetrics] = useState({
    total_users: 0,
    total_roles: 0,
    active_sessions: 0,
    pending_approvals: 0,
    storage_usage_gb: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get('/admin/metrics');
        setMetrics(res.data || {});
      } catch (e) {
        setError(e.message || 'Failed to load metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const cards = [
    { title: 'Total Users', value: String(metrics.total_users ?? 0), icon: 'users', trend: '', color: 'blue' },
    { title: 'Active Sessions', value: String(metrics.active_sessions ?? 0), icon: 'activity', trend: '', color: 'green' },
    { title: 'Pending Approvals', value: String(metrics.pending_approvals ?? 0), icon: 'check-circle', trend: '', color: 'amber' },
    { title: 'Total Roles', value: String(metrics.total_roles ?? 0), icon: 'key', trend: '', color: 'red' },
    { title: 'Storage Usage', value: metrics.storage_usage_gb != null ? `${metrics.storage_usage_gb} GB` : 'N/A', icon: 'database', trend: '', color: 'cyan' },
  ];

  return (
    <section className="mt-6">
      <h2 className="text-lg sm:text-xl font-bold mb-4 text-white">System Metrics & Overview</h2>
      {loading && <p className="text-gray-300 text-sm">Loading metrics...</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-black">
          {cards.map((item) => (
            <OverviewCard
              key={item.title}
              title={item.title}
              amount={item.value}
              percent={item.trend}
              color={item.color}
            />
          ))}
        </div>
      )}
    </section>
  );
}