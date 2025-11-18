// src/components/dashboard/superadmin/SystemHealthCard.jsx

import Card from "../../common/Card";
import { Zap, Server } from "lucide-react"; // Example icons (assuming you use a library like lucide-react)

export default function SystemHealthCard() {
  const systemStatus = "Operational";
  const lastCheck = "Just now";
  
  // Dynamic class for status indicator
  const statusClass = systemStatus === "Operational" 
    ? "bg-green-100 text-green-700" 
    : "bg-red-100 text-red-700";

  return (
    <Card className="flex flex-col justify-between w-full h-full bg-slate-900 border border-slate-700">
      <h2 className="font-semibold text-gray-800 flex items-center">
        <Server className="w-5 h-5 mr-2" />
        System Health Status
      </h2>
      <p className="text-4xl font-extrabold text-gray-600">
        {systemStatus}
      </p>
      <div className="mt-3 flex justify-between items-center">
        <span className={`text-sm font-medium px-3 py-1 rounded-full ${statusClass}`}>
          Running Smoothly
        </span>
        <span className="text-xs text-gray-500">Last check: {lastCheck}</span>
      </div>
    </Card>
  );
}