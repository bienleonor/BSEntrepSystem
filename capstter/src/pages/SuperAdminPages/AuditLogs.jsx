import React, { useEffect, useState, useCallback } from 'react';
import SuperAdminLayout from '../../components/layout/SuperAdminLayout';
import axiosInstance from '../../utils/axiosInstance';

// Reusing module & action labels similar to BussinesLogs.jsx
const MODULE_NAMES = {
  1: 'business management',
  2: 'inventory',
  3: 'menu/products',
  4: 'sales',
  5: 'system module'
};
const ACTION_NAMES = {
  1: 'create',
  2: 'read',
  3: 'update',
  4: 'delete',
  5: 'cancel',
  6: 'archive',
  7: 'export'
};

// Sorting options aligned to BussinesLogs style plus business_id
const SORT_OPTIONS = [
  { value: 'created_desc', label: 'Date (Latest)' },
  { value: 'created_asc', label: 'Date (Oldest)' },
  { value: 'user', label: 'User' },
  { value: 'module', label: 'Module' },
  { value: 'action', label: 'Action' },
  { value: 'table', label: 'Table' },
  { value: 'record', label: 'Record ID' },
  { value: 'business_id', label: 'Business ID' }
];

const ACTION_COLORS = {
  1: 'bg-green-100 text-green-700 border-green-300',    // create
  2: 'bg-blue-100 text-blue-700 border-blue-300',       // read
  3: 'bg-yellow-100 text-yellow-700 border-yellow-300', // update
  4: 'bg-red-100 text-red-700 border-red-300',          // delete
  5: 'bg-purple-100 text-purple-700 border-purple-300', // cancel
  6: 'bg-gray-200 text-gray-700 border-gray-300',       // archive
  7: 'bg-indigo-100 text-indigo-700 border-indigo-300', // export
};

const MODULE_COLORS = {
  1: 'bg-teal-100 text-teal-700 border-teal-300',
  2: 'bg-orange-100 text-orange-700 border-orange-300',
  3: 'bg-pink-100 text-pink-700 border-pink-300',
  4: 'bg-lime-100 text-lime-700 border-lime-300',
  5: 'bg-slate-200 text-slate-700 border-slate-300',
};

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('created_desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [meta, setMeta] = useState({ page: 1, pageSize: 25, total: 0, totalPages: 1 });
  const [exportDate, setExportDate] = useState('');

  // Fetch audit logs (assumed to include fields similar to business logs; fallback to '-')
  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get('/admin/audit-logs', {
        params: { page, pageSize, search: search.trim(), sort }
      });
      setLogs(data?.data || []);
      if (data?.meta) setMeta(data.meta);
    } catch (e) {
      setError('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, sort]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const resetToFirst = () => setPage(1);

  // Client-side sort similar to BussinesLogs.jsx based on chosen sort key
  const sortKeyDir = (() => {
    switch (sort) {
      case 'created_desc': return { key: 'created_at', dir: 'desc' };
      case 'created_asc': return { key: 'created_at', dir: 'asc' };
      case 'user': return { key: 'username', dir: 'asc' };
      case 'module': return { key: 'module_id', dir: 'asc' };
      case 'action': return { key: 'action_id', dir: 'asc' };
      case 'table': return { key: 'table_name', dir: 'asc' };
      case 'record': return { key: 'record_id', dir: 'asc' };
      case 'business_id': return { key: 'business_id', dir: 'asc' };
      default: return { key: 'created_at', dir: 'desc' };
    }
  })();

  const filtered = logs.filter(l => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      String(l.log_id || '').includes(q) ||
      String(l.business_id || '').includes(q) ||
      (l.username || '').toLowerCase().includes(q) ||
      (MODULE_NAMES[l.module_id] || '').toLowerCase().includes(q) ||
      (ACTION_NAMES[l.action_id] || '').toLowerCase().includes(q) ||
      (l.table_name || '').toLowerCase().includes(q) ||
      String(l.record_id || '').includes(q)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
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
  const pageSlice = sorted.slice((page - 1) * pageSize, page * pageSize);

  // Helpers for export like SalesLog
  const formatLocalDateInput = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getAvailableDateRange = () => {
    if (!logs || !logs.length) return { minDate: '', maxDate: '' };
    const dates = logs
      .map(l => l.created_at ? new Date(l.created_at) : null)
      .filter(d => d !== null)
      .sort((a, b) => a.getTime() - b.getTime());
    if (!dates.length) return { minDate: '', maxDate: '' };
    return {
      minDate: formatLocalDateInput(dates[0]),
      maxDate: formatLocalDateInput(dates[dates.length - 1]),
    };
  };

  const { minDate, maxDate } = getAvailableDateRange();

  const hasDataForDate = (dateStr) => {
    if (!dateStr) return false;
    const target = new Date(dateStr + 'T00:00:00');
    return sorted.some(l => l.created_at && new Date(l.created_at).toDateString() === target.toDateString());
  };

  const buildCSVRows = (rows) => {
    const header = ['log_id','business_id','username','module','action','table_name','record_id','ip_address','user_agent','created_at'];
    const toLabel = (obj, map) => map[obj] || obj || '';
    const escape = (v) => {
      if (v === null || v === undefined) return '';
      return String(v).replace(/"/g,'""');
    };
    const out = [header];
    for (const r of rows) {
      out.push([
        r.log_id,
        r.business_id,
        r.username || '',
        toLabel(r.module_id, MODULE_NAMES),
        toLabel(r.action_id, ACTION_NAMES),
        r.table_name || '',
        r.record_id ?? '',
        r.ip_address || '',
        r.user_agent || '',
        r.created_at ? new Date(r.created_at).toISOString() : ''
      ].map(v => `"${escape(v)}"`));
    }
    return out.map(line => line.join(',')).join('\n');
  };

  const exportCSVByDate = () => {
    if (!exportDate) return;
    const target = new Date(exportDate + 'T00:00:00');
    const rows = sorted.filter(l => l.created_at && new Date(l.created_at).toDateString() === target.toDateString());
    const csv = buildCSVRows(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_logs_${exportDate.replace(/-/g,'')}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <SuperAdminLayout>
      <div className="p-4 sm:p-6">
        <h1 className="text-3xl sm:text-6xl font-bold mb-4 text-gray-900">Audit Logs</h1>

        <div className="mb-4 flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col w-full sm:w-auto">
            <label className="text-gray-700 mb-1">Search:</label>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); resetToFirst(); }}
              placeholder="Search logs (user, module, table, id)"
              className="px-3 py-2 rounded-md w-full sm:w-72 border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col w-full sm:w-auto">
            <label className="text-gray-700 mb-1 ">Sort by:</label>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); resetToFirst(); }}
              className="px-3 py-2 rounded-md w-full sm:w-60 bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="flex flex-col w-full sm:w-auto">
            <label className="text-gray-700 mb-1">Export Date:</label>
            <div className="flex items-center gap-2 ">
              <input
                type="date"
                value={exportDate}
                onChange={(e) => setExportDate(e.target.value)}
                min={minDate}
                max={maxDate}
                className={`px-3 py-2 rounded-md w-full sm:w-60 border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${exportDate && !hasDataForDate(exportDate) ? 'border-red-500' : ''}`}
              />
              <button
                onClick={exportCSVByDate}
                disabled={!exportDate || !hasDataForDate(exportDate)}
                className={`px-3 py-2 rounded-md text-sm ${!exportDate || !hasDataForDate(exportDate) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-amber-600 text-white hover:bg-amber-700'}`}
              >Export CSV</button>
            </div>
            
          </div>
        </div>

        {loading && <p className="text-sm text-gray-600">Loading logs…</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && totalItems === 0 && (
          <div className="text-sm text-gray-600">No logs found.</div>
        )}

        {!loading && !error && totalItems > 0 && (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block bg-white rounded-lg shadow-md overflow-x-auto border border-gray-200">
              <table className="min-w-full table-auto text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-sm text-gray-700">
                    <th className="px-4 py-2">Log ID</th>
                    <th className="px-4 py-2">Business ID</th>
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
                    <tr key={log.log_id} className="border-t border-gray-200 text-sm bg-white text-gray-900 hover:bg-gray-50">
                      <td className="px-4 py-2">{log.log_id}</td>
                      <td className="px-4 py-2">{log.business_id || '-'}</td>
                      <td className="px-4 py-2">{log.username || '-'}</td>
                      <td className="px-4 py-2 capitalize">{MODULE_NAMES[log.module_id] || log.module_id || '-'}</td>
                      <td className="px-4 py-2 capitalize">{ACTION_NAMES[log.action_id] || log.action_id || '-'}</td>
                      <td className="px-4 py-2">{log.table_name || '-'}</td>
                      <td className="px-4 py-2">{log.record_id || '-'}</td>
                      <td className="px-4 py-2">{log.ip_address || '-'}</td>
                      <td className="px-4 py-2">{log.user_agent ? String(log.user_agent).slice(0,32) : '-'}</td>
                      <td className="px-4 py-2">{log.created_at ? new Date(log.created_at).toLocaleString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card view */}
            <div className="sm:hidden space-y-3">
              {pageSlice.map(log => (
                <div key={log.log_id} className="rounded-lg bg-white shadow-sm p-3 text-gray-700">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs text-gray-600">#{log.log_id}</div>
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

            {/* Pagination (bottom) */}
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">{totalItems === 0 ? 0 : (page - 1) * pageSize + 1}</span>
                -<span className="font-semibold">{Math.min(page * pageSize, totalItems)}</span> of <span className="font-semibold">{totalItems}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className={`px-3 py-2 rounded-md text-sm ${page === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >First</button>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`px-3 py-2 rounded-md text-sm ${page === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >Prev</button>
                <div className="px-3 py-2 rounded-md bg-gray-100 text-gray-900 text-sm text-center border border-gray-300">
                  Page {page} of {totalPages}
                </div>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className={`px-3 py-2 rounded-md text-sm ${page === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >Next</button>
                <button
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  className={`px-3 py-2 rounded-md text-sm ${page === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >Last</button>
                <select
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); resetToFirst(); }}
                  className="px-2 py-2 rounded-md bg-white border border-gray-300 text-gray-900 text-sm w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
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
    </SuperAdminLayout>
  );
};

export default AuditLogs;
