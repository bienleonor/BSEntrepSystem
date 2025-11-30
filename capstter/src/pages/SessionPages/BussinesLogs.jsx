import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance';

const BussinesLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Local lookup maps for readability
    const MODULE_NAMES = {
        1: 'business management',
        2: 'inventory',
        3: 'menu/products',
        4: 'sales',
        5: 'system module',
    };
    const ACTION_NAMES = {
        1: 'create',
        2: 'read',
        3: 'update',
        4: 'delete',
        5: 'cancel',
        6: 'archive',
        7: 'export',
    };

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            setError(null);
            try {
                const businessId = localStorage.getItem('selectedBusinessId');
                if (!businessId) {
                    setError('No business selected');
                    setLoading(false);
                    return;
                }

                const { data } = await axiosInstance.get(`/business/${businessId}/logs`, {
                    params: { limit: 50, offset: 0 },
                });

                setLogs(data?.data || []);
            } catch (err) {
                setError('Failed to load logs');
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    return (
        <DashboardLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Business Logs</h1>

                {loading && <p>Loading logs...</p>}
                {error && <p className="text-red-600">{error}</p>}

                {!loading && !error && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b text-left">Log ID</th>
                                    <th className="py-2 px-4 border-b text-left">User</th>
                                    <th className="py-2 px-4 border-b text-left">Module</th>
                                    <th className="py-2 px-4 border-b text-left">Action</th>
                                    <th className="py-2 px-4 border-b text-left">Table</th>
                                    <th className="py-2 px-4 border-b text-left">Record</th>
                                    <th className="py-2 px-4 border-b text-left">IP</th>
                                    <th className="py-2 px-4 border-b text-left">Agent</th>
                                    <th className="py-2 px-4 border-b text-left">Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log) => (
                                    <tr key={log.business_logs_id}>
                                        <td className="py-2 px-4 border-b">{log.business_logs_id}</td>
                                        <td className="py-2 px-4 border-b">{log.username ?? log.user_id ?? '-'}</td>
                                        <td className="py-2 px-4 border-b">{MODULE_NAMES[log.module_id] ?? log.module_id ?? '-'}</td>
                                        <td className="py-2 px-4 border-b">{ACTION_NAMES[log.action_id] ?? log.action_id ?? '-'}</td>
                                        <td className="py-2 px-4 border-b">{log.table_name ?? '-'}</td>
                                        <td className="py-2 px-4 border-b">{log.record_id ?? '-'}</td>
                                        <td className="py-2 px-4 border-b">{log.ip_address ?? '-'}</td>
                                        <td className="py-2 px-4 border-b">{log.user_agent?.slice(0, 40) ?? '-'}</td>
                                        <td className="py-2 px-4 border-b">{log.created_at ? new Date(log.created_at).toLocaleString() : '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default BussinesLogs;