import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getInventoryTransactions } from '../../services/inventoryApi';


// Define your component
const StockAdjustmentReport = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("created_at");
  const [sortDir, setSortDir] = useState("desc"); // 'asc' | 'desc'
  const [sortFilter, setSortFilter] = useState("latest");
  const [datePreset, setDatePreset] = useState("all"); // 'all' | 'today' | 'week' | 'month' | 'custom'
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [exportDate, setExportDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getInventoryTransactions();
        if (res?.success) {
          setTransactions(res.data || []);
        } else {
          toast.error(res?.error || "Failed to load transactions");
        }
      } catch (err) {
        toast.error(err.message || "Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6">
        <h1 className="text-3xl sm:text-6xl font-bold mb-4 text-white">Stock Adjustment Report</h1>

        {/* Mobile top pagination controls */}
        <div className="sm:hidden mb-3 flex items-center justify-between gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded-md text-sm w-1/2 ${currentPage === 1 ? 'bg-gray-400 text-gray-200' : 'bg-bronze text-white hover:bg-bronze-600'}`}
          >
            Previous
          </button>
          <button
            onClick={() => {
              const totalItems = getSorted(applyFilters(transactions, { search, datePreset, startDate, endDate }), sortKeyFromFilter(sortFilter), sortDirFromFilter(sortFilter)).length;
              const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
              setCurrentPage(p => Math.min(totalPages, p + 1));
            }}
            disabled={(() => {
              const totalItems = getSorted(applyFilters(transactions, { search, datePreset, startDate, endDate }), sortKeyFromFilter(sortFilter), sortDirFromFilter(sortFilter)).length;
              const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
              return currentPage === totalPages;
            })()}
            className={`px-3 py-2 rounded-md text-sm w-1/2 ${(() => {
              const totalItems = getSorted(applyFilters(transactions, { search, datePreset, startDate, endDate }), sortKeyFromFilter(sortFilter), sortDirFromFilter(sortFilter)).length;
              const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
              return currentPage === totalPages;
            })() ? 'bg-gray-400 text-gray-200' : 'bg-bronze text-white hover:bg-bronze-600'}`}
          >
            Next
          </button>
        </div>

        {/* Controls (aligned with SalesLog UX) */}
        <div className="mb-4 flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col w-full sm:w-auto">
            <label className="text-white mb-1">Search:</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Product, reason, reference..."
              className="px-3 py-2 rounded-md w-full sm:w-64"
            />
          </div>

          <div className="flex flex-col w-full sm:w-auto">
            <label className="text-white mb-1">Sort by:</label>
            <select
              value={sortFilter}
              onChange={(e) => setSortFilter(e.target.value)}
              className="px-3 py-2 rounded-md w-full sm:w-auto"
            >
              <option value="latest">Latest</option>
              <option value="dateAsc">Date (Oldest First)</option>
              <option value="dateDesc">Date (Newest First)</option>
              <option value="qtyHigh">Change Qty (Highest)</option>
              <option value="qtyLow">Change Qty (Lowest)</option>
              <option value="product">Product</option>
              <option value="reason">Reason</option>
              <option value="reference">Reference</option>
              <option value="user">User</option>
            </select>
          </div>

          <div className="flex flex-col w-full sm:w-auto">
            <label className="text-white mb-1">Show:</label>
            <div className="flex flex-wrap gap-2">
              <select
                value={datePreset}
                onChange={(e) => setDatePreset(e.target.value)}
                className="px-3 py-2 rounded-md w-full sm:w-auto"
              >
                <option value="all">All</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="custom">Custom Range</option>
              </select>

              {datePreset === "custom" ? (
                <>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-3 py-2 rounded-md"
                  />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-3 py-2 rounded-md"
                  />
                </>
              ) : (
                <input
                  type="date"
                  value={exportDate}
                  onChange={(e) => setExportDate(e.target.value)}
                  min={getDateRange(transactions).minDate}
                  max={getDateRange(transactions).maxDate}
                  className="px-3 py-2 rounded-md bg-slate-700 text-white text-sm cursor-pointer w-full sm:w-auto"
                />
              )}

              <button
                onClick={() => {
                  try {
                    // Export the currently visible (filtered + sorted) rows
                    const visible = getSorted(
                      applyFilters(transactions, { search, datePreset, startDate, endDate }),
                      sortKeyFromFilter(sortFilter),
                      sortDirFromFilter(sortFilter)
                    );
                    if (!visible || visible.length === 0) {
                      toast.warn('No rows to export');
                      return;
                    }
                    const csv = toCSV(visible);
                    const bom = "\ufeff"; // Excel-friendly BOM
                    const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    const label = datePreset === 'custom' && startDate && endDate
                      ? `${startDate}_to_${endDate}`
                      : (exportDate || datePreset);
                    a.download = `stock_adjustments_${label}.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                  } catch (err) {
                    toast.error('Failed to export CSV');
                  }
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded"
                disabled={datePreset !== 'custom' && exportDate && !hasTransactionsOnDate(transactions, exportDate)}
              >
                Export
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-sm text-white">Loading transactions…</div>
        ) : (
          <>
            {/* Mobile card view (visible on small screens) */}
            <div className="sm:hidden space-y-3">
              {getSorted(applyFilters(transactions, { search, datePreset, startDate, endDate }), sortKeyFromFilter(sortFilter), sortDirFromFilter(sortFilter))
                .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                .map((t) => (
                <div key={t.transaction_id} className="rounded-lg bg-white shadow-sm p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-600 capitalize">{t.reason}</div>
                    <div className="text-xs text-gray-500">#{t.transaction_id}</div>
                  </div>

                  <div className="mt-2">
                    <p className="text-sm font-semibold">{t.product_name || t.product_id}</p>
                    <p className="text-xs text-gray-600">Change: {t.change_qty} | Ref: {t.reference || '-'}</p>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-700">
                    <div>
                      <span className="text-gray-500">User</span>
                      <div>{t.username || t.user_id}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-500">Created</span>
                      <div className="font-semibold">{new Date(t.created_at).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table (hidden on small screens) */}
            <div className="hidden sm:block bg-bronze rounded-lg shadow-md overflow-x-auto">
              <table className="min-w-full table-auto text-sm">
                <thead className="bg-bronze-100">
                  <tr className="text-left text-sm text-white">
                    <th className="px-4 py-2">Transaction ID</th>
                    <th className="px-4 py-2">Product</th>
                    <th className="px-4 py-2">Change Qty</th>
                    <th className="px-4 py-2">Reason</th>
                    <th className="px-4 py-2">Reference</th>
                    <th className="px-4 py-2">User</th>
                    <th className="px-4 py-2">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {getSorted(applyFilters(transactions, { search, datePreset, startDate, endDate }), sortKeyFromFilter(sortFilter), sortDirFromFilter(sortFilter))
                    .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                    .map((t) => (
                    <tr key={t.transaction_id} className="border-t text-sm bg-white text-gray-700 hover:bg-gray-50">
                      <td className="px-4 py-2">{t.transaction_id}</td>
                      <td className="px-4 py-2">{t.product_name || t.product_id}</td>
                      <td className="px-4 py-2">{t.change_qty}</td>
                      <td className="px-4 py-2 capitalize">{t.reason}</td>
                      <td className="px-4 py-2">{t.reference || '-'}</td>
                      <td className="px-4 py-2">{t.username || t.user_id}</td>
                      <td className="px-4 py-2">{new Date(t.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Bottom Pagination */}
        {getSorted(applyFilters(transactions, { search, datePreset, startDate, endDate }), sortKeyFromFilter(sortFilter), sortDirFromFilter(sortFilter)).length > 0 && (
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            {(() => {
              const filtered = getSorted(applyFilters(transactions, { search, datePreset, startDate, endDate }), sortKeyFromFilter(sortFilter), sortDirFromFilter(sortFilter));
              const totalItems = filtered.length;
              const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
              if (currentPage > totalPages) setCurrentPage(totalPages);
              return (
                <>
                  <div className="text-sm text-gray-200">
                    Showing <span className="font-semibold">{totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1}</span>
                    -<span className="font-semibold">{Math.min(currentPage * pageSize, totalItems)}</span> of <span className="font-semibold">{totalItems}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-2 rounded-md text-sm w-full sm:w-auto ${currentPage === 1 ? 'bg-gray-400 text-gray-200' : 'bg-bronze text-white hover:bg-bronze-600'}`}>
                      First
                    </button>

                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-2 rounded-md text-sm w-full sm:w-auto ${currentPage === 1 ? 'bg-gray-400 text-gray-200' : 'bg-bronze text-white hover:bg-bronze-600'}`}>
                      Prev
                    </button>

                    <div className="px-3 py-2 rounded-md bg-slate-800 text-white text-sm w-full sm:w-auto text-center">
                      Page {currentPage} of {totalPages}
                    </div>

                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-2 rounded-md text-sm w-full sm:w-auto ${currentPage === totalPages ? 'bg-gray-400 text-gray-200' : 'bg-bronze text-white hover:bg-bronze-600'}`}>
                      Next
                    </button>

                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-2 rounded-md text-sm w-full sm:w-auto ${currentPage === totalPages ? 'bg-gray-400 text-gray-200' : 'bg-bronze text-white hover:bg-bronze-600'}`}>
                      Last
                    </button>

                    <select
                      value={pageSize}
                      onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                      className="px-2 py-2 rounded-md bg-slate-700 text-white text-sm w-full sm:w-auto"
                    >
                      <option value={5}>5 / page</option>
                      <option value={10}>10 / page</option>
                      <option value={25}>25 / page</option>
                      <option value={50}>50 / page</option>
                    </select>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </DashboardLayout>
  );
};

// Helpers
function applyFilters(items, { search, datePreset, startDate, endDate }) {
  let out = items;
  if (search) {
    const q = search.toLowerCase();
    out = out.filter((t) =>
      (t.product_name || String(t.product_id)).toLowerCase().includes(q) ||
      (t.reason || '').toLowerCase().includes(q) ||
      (t.reference || '').toLowerCase().includes(q)
    );
  }

  // Date presets
  const now = new Date();
  let from = null;
  let to = null;
  if (datePreset === 'today') {
    from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    to = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  } else if (datePreset === 'week') {
    const day = now.getDay(); // 0-6 (Sun-Sat)
    const diffToMonday = (day + 6) % 7; // convert to Monday=0
    from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diffToMonday);
    to = new Date(from.getFullYear(), from.getMonth(), from.getDate() + 7);
  } else if (datePreset === 'month') {
    from = new Date(now.getFullYear(), now.getMonth(), 1);
    to = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  } else if (datePreset === 'custom' && startDate && endDate) {
    from = new Date(startDate);
    to = new Date(new Date(endDate).getTime() + 24*60*60*1000); // inclusive end
  }

  if (from && to) {
    out = out.filter((t) => {
      const d = new Date(t.created_at);
      return d >= from && d < to;
    });
  }

  return out;
}

function getSorted(items, key, dir) {
  const copy = [...items];
  copy.sort((a, b) => {
    const va = a[key] ?? '';
    const vb = b[key] ?? '';
    let cmp = 0;
    if (key === 'created_at') {
      cmp = new Date(va) - new Date(vb);
    } else if (key === 'change_qty') {
      cmp = Number(va) - Number(vb);
    } else {
      cmp = String(va).localeCompare(String(vb));
    }
    return dir === 'asc' ? cmp : -cmp;
  });
  return copy;
}

function toCSV(items) {
  const header = [
    'Transaction ID',
    'Product',
    'Change Qty',
    'Reason',
    'Reference',
    'User',
    'Created At'
  ];
  const rows = [header];
  for (const t of items) {
    rows.push([
      t.transaction_id ?? '',
      t.product_name ?? t.product_id ?? '',
      t.change_qty ?? '',
      t.reason ?? '',
      t.reference ?? '',
      t.user_id ?? '',
      t.created_at ? new Date(t.created_at).toLocaleString() : ''
    ]);
  }
  return rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
}

// SalesLog-like sort mappings
function sortKeyFromFilter(filter) {
  switch (filter) {
    case 'dateAsc':
    case 'dateDesc':
    case 'latest':
      return 'created_at';
    case 'qtyHigh':
    case 'qtyLow':
      return 'change_qty';
    case 'product':
      return 'product_name';
    case 'reason':
      return 'reason';
    case 'reference':
      return 'reference';
    case 'user':
      return 'user_id';
    default:
      return 'created_at';
  }
}

function sortDirFromFilter(filter) {
  switch (filter) {
    case 'dateAsc':
    case 'qtyLow':
      return 'asc';
    case 'latest':
    case 'dateDesc':
    case 'qtyHigh':
    default:
      return 'desc';
  }
}

// Date helpers: get available range and per-date availability
function getDateRange(items) {
  const dates = (items || [])
    .map(t => t.created_at ? new Date(t.created_at) : null)
    .filter(Boolean)
    .sort((a, b) => a - b);
  if (dates.length === 0) return { minDate: '', maxDate: '' };
  return {
    // Use local date to avoid timezone shift collapsing to one day
    minDate: formatLocalDateInput(dates[0]),
    maxDate: formatLocalDateInput(dates[dates.length - 1]),
  };
}

function hasTransactionsOnDate(items, dateStr) {
  if (!dateStr) return false;
  const target = new Date(dateStr + 'T00:00:00').toDateString();
  return (items || []).some(t => {
    if (!t.created_at) return false;
    const d = new Date(t.created_at);
    return d.toDateString() === target;
  });
}

function formatLocalDateInput(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default StockAdjustmentReport;
