import DashboardLayout from "../components/layout/DashboardLayout";
import TotalSalesCard from "../components/dashboard/TotalSalesCard";
import GoalsCard from "../components/dashboard/GoalsCard";
import OverviewSection from "../components/dashboard/OverviewSection";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TotalSalesCard />
        <GoalsCard />
      </div>
      <OverviewSection />
    </DashboardLayout>
  );
}

