// src/pages/SuperAdminDashboard.jsx
import SuperAdminLayout from "../../components/layout/SuperAdminLayout";
import SystemHealthCard from "../../components/dashboard/superadmin/SystemHealthCard";
import UserManagementCard from "../../components/dashboard/superadmin/UserManagementCard";
import AdminOverviewSection from "../../components/dashboard/superadmin/AdminOverviewSection"; 
import SecurityAuditLog from "../../components/dashboard/superadmin/SecurityAuditLog"; // New component for admin focus

const SuperAdminDashboard = () => {
  return (
    <SuperAdminLayout>
      <h1 className="text-4xl font-extrabold mb-8 text-cyan-400">System Management Console</h1>
      
      {/* Top row: System Status and Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <SystemHealthCard />
        <UserManagementCard />
      </div>

      {/* Main Metrics Section */}
      <AdminOverviewSection />

      {/* Audit Log/Security Section */}
      <SecurityAuditLog />
    </SuperAdminLayout>
  );
};
export default SuperAdminDashboard;