// src/components/dashboard/superadmin/SecurityAuditLog.jsx

import Card from "../../common/Card";
import { ListChecks, AlertTriangle } from "lucide-react"; 

// Mock data for the audit log
const auditLogs = [
  {
    time: "2025-11-18 23:45:01",
    user: "System/CronJob",
    action: "Database backup completed",
    status: "Success",
    type: "System",
    color: "text-green-400",
  },
  {
    time: "2025-11-18 23:40:15",
    user: "john.doe@biz.com",
    action: "Failed login attempt (4x)",
    status: "Warning",
    type: "Security",
    color: "text-amber-400",
  },
  {
    time: "2025-11-18 23:30:55",
    user: "superadmin",
    action: "Role 'Manager' permissions updated",
    status: "Success",
    type: "Configuration",
    color: "text-blue-400",
  },
  {
    time: "2025-11-18 23:25:00",
    user: "API Gateway",
    action: "High traffic alert (300 req/s)",
    status: "Alert",
    type: "Performance",
    color: "text-red-500",
  },
];

export default function SecurityAuditLog() {
  return (
    <section className="mt-8">
      {/* Reusing the dark Card component */}
      <Card className="flex flex-col w-full bg-gray-800 border-t-4 border-red-500 shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-200 flex items-center">
            <ListChecks className="w-6 h-6 mr-2 text-red-400" />
            Recent Security & Audit Log
          </h2>
          <button className="text-sm font-medium text-red-400 hover:text-red-300">
            View All Logs →
          </button>
        </div>

        {/* Mobile: Card list */}
        <div className="space-y-3 md:hidden">
          {auditLogs.map((log, i) => (
            <div key={i} className="rounded-lg bg-gray-700/60 border border-gray-700 p-3 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-gray-400 font-mono">{log.time.split(' ')[1]}</span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-900 ${log.color}`}>{log.status}</span>
              </div>
              <div className="text-sm font-medium text-cyan-300 truncate">{log.user}</div>
              <div className="text-xs text-gray-300 leading-relaxed">{log.action}</div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-[10px] tracking-wide uppercase px-2 py-0.5 rounded bg-gray-800 text-gray-400">{log.type}</span>
                {(log.status === 'Warning' || log.status === 'Alert') && (
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Desktop/Table: Table */}
        <div className="overflow-x-auto hidden md:block">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Timestamp</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User/Source</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action Description</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {auditLogs.map((log, index) => (
                <tr key={index} className="hover:bg-gray-700 transition duration-150">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">{log.time.split(' ')[1]}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-cyan-300">{log.user}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{log.action}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-900 text-gray-400">
                      {log.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <span className={`text-sm font-bold ${log.color} flex items-center justify-center`}>
                      {log.status === 'Warning' || log.status === 'Alert' ? (
                        <AlertTriangle className="w-4 h-4 mr-1" />
                      ) : null}
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
}