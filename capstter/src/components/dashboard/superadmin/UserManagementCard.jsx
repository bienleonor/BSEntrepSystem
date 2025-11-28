// src/components/dashboard/superadmin/UserManagementCard.jsx

import { useState } from "react";
import Card from "../../common/Card";
import axiosInstance from "../../../utils/axiosInstance"; // reserved for future use
import { Users, Lock, Settings } from "lucide-react";
import Popup from "../../common/Popup.jsx";
import ManageUsersPanel from "./ManageUsersPanel.jsx";
import DefineRolesPanel from "./DefineRolesPanel.jsx";
import SystemConfigPanel from "./SystemConfigPanel.jsx";

export default function UserManagementCard() {
  const [activePanel, setActivePanel] = useState(null); // 'users' | 'roles' | 'config' | null

  const openPanel = (panel) => setActivePanel(panel);
  const closePanel = () => setActivePanel(null);

  const renderPanel = () => {
    switch (activePanel) {
      case 'users':
        return <ManageUsersPanel />;
      case 'roles':
        return <DefineRolesPanel />;
      case 'config':
        return <SystemConfigPanel />;
      default:
        return null;
    }
  };

  return (
    <>
      <Card className="flex flex-col w-full bg-slate-900 border border-slate-700 p-4">
        <h2 className="font-semibold text-gray-200 flex items-center text-sm mb-2">
          <Users className="w-5 h-5 mr-2" />
          User & Role Management
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => openPanel('users')}
            className="flex flex-col items-center p-3 rounded-lg transition duration-150 text-gray-400 hover:bg-slate-700 hover:text-white"
          >
            <Users className="w-6 h-6 mb-1 text-blue-400" />
            <span className="text-xs font-medium">Manage Users</span>
          </button>
          <button
            onClick={() => openPanel('roles')}
            className="flex flex-col items-center p-3 rounded-lg transition duration-150 text-gray-400 hover:bg-slate-700 hover:text-white"
          >
            <Lock className="w-6 h-6 mb-1 text-purple-400" />
            <span className="text-xs font-medium">Define Roles</span>
          </button>
          <button
            onClick={() => openPanel('config')}
            className="flex flex-col items-center p-3 rounded-lg transition duration-150 text-gray-400 hover:bg-slate-700 hover:text-white"
          >
            <Settings className="w-6 h-6 mb-1 text-amber-400" />
            <span className="text-xs font-medium">System Config</span>
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-3">Open a management module.</p>
      </Card>
      <Popup
        isOpen={!!activePanel}
        onClose={closePanel}
        title={
          activePanel === 'users'
            ? 'Manage Users'
            : activePanel === 'roles'
            ? 'Define Roles'
            : activePanel === 'config'
            ? 'System Configuration'
            : ''
        }
      >
        {renderPanel()}
      </Popup>
    </>
  );
}