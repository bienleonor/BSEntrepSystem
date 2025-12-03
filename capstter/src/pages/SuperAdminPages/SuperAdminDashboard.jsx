// src/pages/SuperAdminDashboard.jsx
import SuperAdminLayout from "../../components/layout/SuperAdminLayout";

import UserManagementCard from "../../components/dashboard/superadmin/UserManagementCard";
import AdminOverviewSection from "../../components/dashboard/superadmin/AdminOverviewSection"; 


const SuperAdminDashboard = () => {
  return (
    <SuperAdminLayout>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-cyan-400 leading-tight">System Management Console</h1>
        <p className="mt-2 text-xs sm:text-sm text-cyan-200/70 max-w-prose">Monitor system health, users, roles, and recent security events. Optimized for mobile viewing.</p>
      </div>
      {/* Top row: System Status and Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
      
        <UserManagementCard />
        {/* Placeholder future card slot hidden unless xl */}
       
      </div>

      {/* Main Metrics Section */}
      <AdminOverviewSection />


    </SuperAdminLayout>
  );
};
export default SuperAdminDashboard;