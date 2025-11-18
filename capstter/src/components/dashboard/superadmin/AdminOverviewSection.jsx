// src/components/dashboard/superadmin/AdminOverviewSection.jsx

import OverviewCard from "../OverviewCard"; // Reusing the card component

// Super Admin focused data
const adminData = [
  {
    title: "Total Users",
    value: "1,542", // Example: Total accounts in the system
    icon: "users", // Placeholder for icon component/prop
    trend: "+5% last month",
    color: "blue"
  },
  {
    title: "Active Sessions",
    value: "89", // Example: Currently logged-in users
    icon: "activity", 
    trend: "-2% last 24h",
    color: "green"
  },
  {
    title: "Pending Approvals",
    value: "4", // Example: New user/role requests needing approval
    icon: "check-circle", 
    trend: "2 new this week",
    color: "amber"
  },
  {
    title: "API Status",
    value: "Stable", // Example: Backend API status
    icon: "code", 
    trend: "99.9% Uptime",
    color: "purple"
  },
  {
    title: "Total Roles",
    value: "6", // Example: Number of defined roles
    icon: "key", 
    trend: "Admin, Manager, User, etc.",
    color: "red"
  },
  {
    title: "Storage Usage",
    value: "45.2 GB", // Example: Database/file storage usage
    icon: "database", 
    trend: "70% capacity",
    color: "cyan"
  },
];

export default function AdminOverviewSection() {
  return (
    <section className="mt-6">
      <h2 className="text-xl font-bold mb-4 text-white">System Metrics & Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-black">
        {adminData.map((item) => (
          <OverviewCard 
            key={item.title} 
            title={item.title}
            amount={item.value}     // Mapped 'value' to 'amount'
            percent={item.trend}    // Mapped 'trend' to 'percent'
            color={item.color}
          /> 
        ))}
      </div>
    </section>
  );
}