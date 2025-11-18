// src/components/dashboard/superadmin/UserManagementCard.jsx

import Card from "../../common/Card";
import { Users, Lock, Settings } from "lucide-react";

export default function UserManagementCard() {
  return (
    <Card className="flex flex-col justify-between w-full h-full bg-slate-900 border border-slate-700">
      <h2 className="font-semibold text-gray-700 flex items-center">
        <Users className="w-5 h-5 mr-2" />
        User & Role Management
      </h2>
      <div className="grid grid-cols-3 gap-3 my-2">
        {/* Quick action buttons */}
        <button className="flex flex-col items-center p-3 rounded-lg hover:bg-slate-700 hover:text-white transition duration-150 text-gray-500">
          <Users className="w-6 h-6 mb-1 text-blue-400" />
          <span className="text-xs font-medium">Manage Users</span>
        </button>
        <button className="flex flex-col items-center p-3 rounded-lg hover:bg-slate-700 hover:text-white transition duration-150 text-gray-500">
          <Lock className="w-6 h-6 mb-1 text-purple-400" />
          <span className="text-xs font-medium">Define Roles</span>
        </button>
        <button className="flex flex-col items-center p-3 rounded-lg hover:bg-slate-700 hover:text-white transition duration-150 text-gray-500">
          <Settings className="w-6 h-6 mb-1 text-amber-400" />
          <span className="text-xs font-medium">System Config</span>
        </button>
      </div>
      <p className="text-sm text-gray-400 mt-2">
        Control accounts, permissions, and system settings.
      </p>
    </Card>
  );
}