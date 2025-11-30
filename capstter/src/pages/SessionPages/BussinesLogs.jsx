import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance';

const BussinesLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortFilter, setSortFilter] = useState('latest'); // latest | oldest | user | module | action | table | record

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
                    params: { limit: 200, offset: 0 }, // fetch larger batch for local paging
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

        const filtered = logs.filter(l => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            String(l.business_logs_id).includes(q) ||
            (l.username || '').toLowerCase().includes(q) ||
            (MODULE_NAMES[l.module_id] || '').toLowerCase().includes(q) ||
            (ACTION_NAMES[l.action_id] || '').toLowerCase().includes(q) ||
            (l.table_name || '').toLowerCase().includes(q) ||
            String(l.record_id || '').includes(q)
        );
    });
    
        // Sorting logic
        const sortKeyDir = (() => {
            switch (sortFilter) {
                case 'latest': return { key: 'created_at', dir: 'desc' };
                case 'oldest': return { key: 'created_at', dir: 'asc' };
                case 'user': return { key: 'username', dir: 'asc' };
                case 'module': return { key: 'module_id', dir: 'asc' };
                case 'action': return { key: 'action_id', dir: 'asc' };
                case 'table': return { key: 'table_name', dir: 'asc' };
                case 'record': return { key: 'record_id', dir: 'asc' };
                default: return { key: 'created_at', dir: 'desc' };
            }
        })();

        const sorted = [...filtered].sort((a,b) => {
            const { key, dir } = sortKeyDir;
            let va = a[key];
            let vb = b[key];
            if (key === 'created_at') {
                va = va ? new Date(va).getTime() : 0;
                vb = vb ? new Date(vb).getTime() : 0;
            } else if (key === 'username' || key === 'table_name') {
                va = (va || '').toLowerCase();
                vb = (vb || '').toLowerCase();
            } else {
                va = typeof va === 'number' ? va : Number(va) || 0;
                vb = typeof vb === 'number' ? vb : Number(vb) || 0;
            }
            if (va < vb) return dir === 'asc' ? -1 : 1;
            if (va > vb) return dir === 'asc' ? 1 : -1;
            return 0;
        });

        const totalItems = sorted.length;
        const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
        const pageSlice = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const resetToFirst = () => setCurrentPage(1);

    return (
        <DashboardLayout>
            <div className="p-4 sm:p-6">
                <h1 className="text-3xl sm:text-6xl font-bold mb-4 text-white">Business Logs</h1>

                <div className="mb-4 flex flex-col sm:flex-row gap-4">
                    <div className="flex flex-col w-full sm:w-auto">
                        <label className="text-white mb-1">Search:</label>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); resetToFirst(); }}
                            placeholder="Search logs (user, module, table, id)"
                            className="px-3 py-2 rounded-md w-full sm:w-72"
                        />
                    </div>
                    <div className="flex flex-col w-full sm:w-auto">
                        <label className="text-white mb-1">Sort by:</label>
                        <select
                            value={sortFilter}
                            onChange={(e) => { setSortFilter(e.target.value); resetToFirst(); }}
                            className="px-3 py-2 rounded-md w-full sm:w-60"
                        >
                            <option value="latest">Date (Latest)</option>
                            <option value="oldest">Date (Oldest)</option>
                            <option value="user">User</option>
                            <option value="module">Module</option>
                            <option value="action">Action</option>
                            <option value="table">Table</option>
                            <option value="record">Record ID</option>
                        </select>
                    </div>
                </div>

                {loading && <p className="text-sm text-white">Loading logs…</p>}
                {error && <p className="text-red-500">{error}</p>}

                {!loading && !error && totalItems === 0 && (
                    <div className="text-sm text-white">No logs found.</div>
                )}

                {!loading && !error && totalItems > 0 && (
                    <>
                        {/* Mobile card view */}
                        <div className="sm:hidden space-y-3">
                            {pageSlice.map(log => (
                                <div key={log.business_logs_id} className="rounded-lg bg-white shadow-sm p-3 text-gray-700">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="text-xs text-gray-600">#{log.business_logs_id}</div>
                                        <div className="text-xs capitalize font-medium">{ACTION_NAMES[log.action_id] || log.action_id}</div>
                                    </div>
                                    <div className="text-sm font-semibold mb-1">{MODULE_NAMES[log.module_id] || log.module_id}</div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <span className="text-gray-500">User</span>
                                            <div>{log.username || '-'}</div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-gray-500">Created</span>
                                            <div className="font-semibold">{log.created_at ? new Date(log.created_at).toLocaleString() : '-'}</div>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-gray-500">Table</span>
                                            <div>{log.table_name} • Rec: {log.record_id}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop table */}
                        <div className="hidden sm:block bg-bronze rounded-lg shadow-md overflow-x-auto">
                            <table className="min-w-full table-auto text-sm">
                                <thead className="bg-bronze-100">
                                    <tr className="text-left text-sm text-white">
                                        <th className="px-4 py-2">Log ID</th>
                                        <th className="px-4 py-2">User</th>
                                        <th className="px-4 py-2">Module</th>
                                        <th className="px-4 py-2">Action</th>
                                        <th className="px-4 py-2">Table</th>
                                        <th className="px-4 py-2">Record</th>
                                        <th className="px-4 py-2">IP</th>
                                        <th className="px-4 py-2">Agent</th>
                                        <th className="px-4 py-2">Created At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pageSlice.map(log => (
                                        <tr key={log.business_logs_id} className="border-t text-sm bg-white text-gray-700 hover:bg-gray-50">
                                            <td className="px-4 py-2">{log.business_logs_id}</td>
                                            <td className="px-4 py-2">{log.username || '-'}</td>
                                            <td className="px-4 py-2 capitalize">{MODULE_NAMES[log.module_id] || log.module_id}</td>
                                            <td className="px-4 py-2 capitalize">{ACTION_NAMES[log.action_id] || log.action_id}</td>
                                            <td className="px-4 py-2">{log.table_name}</td>
                                            <td className="px-4 py-2">{log.record_id}</td>
                                            <td className="px-4 py-2">{log.ip_address || '-'}</td>
                                            <td className="px-4 py-2">{log.user_agent?.slice(0, 32) || '-'}</td>
                                            <td className="px-4 py-2">{log.created_at ? new Date(log.created_at).toLocaleString() : '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination (bottom) */}
                        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-gray-200">
                                Showing <span className="font-semibold">{totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1}</span>
                                -<span className="font-semibold">{Math.min(currentPage * pageSize, totalItems)}</span> of <span className="font-semibold">{totalItems}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                                <button
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-2 rounded-md text-sm ${currentPage === 1 ? 'bg-gray-400 text-gray-200' : 'bg-bronze text-white hover:bg-bronze-600'}`}
                                >First</button>
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-2 rounded-md text-sm ${currentPage === 1 ? 'bg-gray-400 text-gray-200' : 'bg-bronze text-white hover:bg-bronze-600'}`}
                                >Prev</button>
                                <div className="px-3 py-2 rounded-md bg-slate-800 text-white text-sm text-center">
                                    Page {currentPage} of {totalPages}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className={`px-3 py-2 rounded-md text-sm ${currentPage === totalPages ? 'bg-gray-400 text-gray-200' : 'bg-bronze text-white hover:bg-bronze-600'}`}
                                >Next</button>
                                <button
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                    className={`px-3 py-2 rounded-md text-sm ${currentPage === totalPages ? 'bg-gray-400 text-gray-200' : 'bg-bronze text-white hover:bg-bronze-600'}`}
                                >Last</button>
                                <select
                                  value={pageSize}
                                  onChange={(e) => { setPageSize(Number(e.target.value)); resetToFirst(); }}
                                  className="px-2 py-2 rounded-md bg-slate-700 text-white text-sm w-full sm:w-auto"
                                >
                                  <option value={5}>5 / page</option>
                                  <option value={10}>10 / page</option>
                                  <option value={25}>25 / page</option>
                                  <option value={50}>50 / page</option>
                                </select>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};

export default BussinesLogs;