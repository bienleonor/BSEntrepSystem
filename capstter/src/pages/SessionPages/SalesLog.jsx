import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import AxiosInstance from "../../utils/axiosInstance";
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { OrderPopup } from '../../components/common/OrderPopup';

function SalesLog() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortFilter, setSortFilter] = useState("latest");
  const [dateFilter, setDateFilter] = useState("all");
  const [searchReceipt, setSearchReceipt] = useState("");
  const [receiptPopupOpen, setReceiptPopupOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [exportDate, setExportDate] = useState(formatLocalDateInput(new Date()));

  useEffect(() => {
    const fetchSalesLog = async () => {
      try {
        const res = await AxiosInstance.get('/sales/saleslog');

        const { orders = [] } = res.data || {};

        const txs = orders.map(order => {
          let status;
          switch (order.statusId) {
            case 1:
              status = 'Complete';
              break;
            case 3:
              status = 'Canceled';
              break;
            default:
              status = 'Pending';
          }

          return {
            id: order.id,
            name: order.receiptNo ? order.receiptNo : `Purchase #${order.id}`,
            item: (order.items || []).map(item => item.productName).join(', '),
            items: order.items || [],
            date: order.purchaseDate ? new Date(order.purchaseDate).toLocaleDateString() : '',
            time: order.purchaseDate ? new Date(order.purchaseDate).toLocaleTimeString() : '',
            rawDate: order.purchaseDate ? new Date(order.purchaseDate) : null,
            status,
            total: order.total !== null ? Number(order.total).toFixed(2) : '0.00',
            rawTotal: order.total !== null ? Number(order.total) : 0,
            username: order.username ?? 'Unknown'
          };
        });

        setTransactions(txs);
      } catch (err) {
        console.error('Failed to fetch sales log:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesLog();
  }, []);

  const renderStatusIcon = (status) => {
    switch (status) {
      case 'Complete':
        return <CheckCircle className="text-green-500 w-5 h-5" />;
      case 'Canceled':
        return <XCircle className="text-red-500 w-5 h-5" />;
      case 'Pending':
        return <Clock className="text-yellow-500 w-5 h-5" />;
      default:
        return null;
    }
  };

  const handleViewReceipt = (transaction) => {
    setSelectedReceipt(transaction);
    setReceiptPopupOpen(true);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchReceipt, dateFilter, sortFilter, pageSize, transactions]);

  // Export helpers (CSV)
  const formatCell = (v) => {
    if (v === null || v === undefined) return '';
    return String(v).replace(/"/g, '""');
  };

  const buildExportRows = (txs) => {
    const header = ['Receipt No','Employee','Date','Time','Status','Products (name x qty)','Purchase Total'];
    const rows = [header];

    const map = new Map();
    for (const tx of txs) {
      const key = tx.name || 'Unknown';
      if (!map.has(key)) {
        map.set(key, {
          receipt: key,
          username: tx.username || '',
          date: tx.date || '',
          time: tx.time || '',
          status: tx.status || '',
          items: [],
          total: tx.total || '0.00'
        });
      }

      const entry = map.get(key);
      if (tx.items && tx.items.length > 0) {
        for (const it of tx.items) {
          entry.items.push({
            name: it.productName || '',
            qty: it.quantity || 0,
            price: Number(it.price) || 0
          });
        }
        entry.total = tx.total || entry.total;
      }
    }

    for (const [, v] of map) {
      const products = v.items.map(it => `${it.name} x${it.qty} (₱${it.price.toFixed(2)})`).join(' ; ');
      rows.push([v.receipt, v.username, v.date, v.time, v.status, products, v.total]);
    }

    return rows;
  };

  const arrayToCSV = (rows) => {
    return rows.map(r => r.map(c => `"${formatCell(c)}"`).join(',')).join('\n');
  };

  const downloadCSV = (csv, filename) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const filterByDate = (dateStr, txs) => {
    if (!txs || !txs.length || !dateStr) return [];
    const selectedDate = new Date(dateStr + 'T00:00:00');
    return txs.filter(tx => {
      if (!tx.rawDate) return false;
      return tx.rawDate.toDateString() === selectedDate.toDateString();
    });
  };

  const exportByDate = () => {
    const target = filterByDate(exportDate, filteredTransactions);
    const rows = buildExportRows(target);
    const csv = arrayToCSV(rows);
    const dateLabel = exportDate.replace(/-/g, '');
    downloadCSV(csv, `sales_export_${dateLabel}.csv`);
  };

  const applyDateFilter = (txs) => {
    if (dateFilter === "all") return txs;

    const now = new Date();
    return txs.filter(tx => {
      if (!tx.rawDate) return false;
      const d = tx.rawDate;

      switch (dateFilter) {
        case "today":
          return d.toDateString() === now.toDateString();
        case "week": {
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
          startOfWeek.setHours(0, 0, 0, 0);
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 7);
          return d >= startOfWeek && d < endOfWeek;
        }
        case "month": {
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
          return d >= startOfMonth && d < endOfMonth;
        }
        default:
          return true;
      }
    });
  };

  const applySearchFilter = (txs) => {
    if (!searchReceipt.trim()) return txs;
    const query = searchReceipt.toLowerCase();
    return txs.filter(tx => tx.name.toLowerCase().includes(query));
  };

  const applySortFilter = (txs) => {
    const sorted = [...txs];
    switch (sortFilter) {
      case "dateAsc":
        return sorted.sort((a, b) => (a.rawDate || 0) - (b.rawDate || 0));
      case "dateDesc":
        return sorted.sort((a, b) => (b.rawDate || 0) - (a.rawDate || 0));
      case "totalHigh":
        return sorted.sort((a, b) => b.rawTotal - a.rawTotal);
      case "totalLow":
        return sorted.sort((a, b) => a.rawTotal - b.rawTotal);
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "user":
        return sorted.sort((a, b) => a.username.localeCompare(b.username));
      default:
        return sorted.sort((a, b) => (b.id || 0) - (a.id || 0));
    }
  };

  const filteredTransactions = applySortFilter(applySearchFilter(applyDateFilter(transactions)));

  const totalItems = filteredTransactions.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  if (currentPage > totalPages) setCurrentPage(totalPages);

  const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getAvailableDateRange = () => {
    if (!transactions || !transactions.length) {
      return { minDate: '', maxDate: '' };
    }
    const dates = transactions
      .map(t => t.rawDate)
      .filter(d => d !== null && d !== undefined)
      .sort((a, b) => a.getTime() - b.getTime());

    if (dates.length === 0) return { minDate: '', maxDate: '' };

    const minDate = formatLocalDateInput(dates[0]);
    const maxDate = formatLocalDateInput(dates[dates.length - 1]);
    return { minDate, maxDate };
  };

  const { minDate, maxDate } = getAvailableDateRange();

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6">
        <h1 className="text-3xl sm:text-6xl font-bold mb-4 text-white">Latest Transactions</h1>

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
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded-md text-sm w-1/2 ${currentPage === totalPages ? 'bg-gray-400 text-gray-200' : 'bg-bronze text-white hover:bg-bronze-600'}`}
          >
            Next
          </button>
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col w-full sm:w-auto">
            <label className="text-white mb-1">Search Receipt:</label>
            <input
              type="text"
              value={searchReceipt}
              onChange={(e) => setSearchReceipt(e.target.value)}
              placeholder="Enter receipt number..."
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
              <option value="totalHigh">Total (Highest)</option>
              <option value="totalLow">Total (Lowest)</option>
              <option value="name">Name</option>
              <option value="user">User</option>
            </select>
          </div>

          <div className="flex flex-col w-full sm:w-auto">
            <label className="text-white mb-1">Show:</label>
            <div className="flex flex-wrap gap-2">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 rounded-md w-full sm:w-auto"
              >
                <option value="all">All</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>

              <input
                type="date"
                value={exportDate}
                onChange={(e) => setExportDate(e.target.value)}
                min={minDate}
                max={maxDate}
                className="px-2 py-2 rounded-md bg-slate-700 text-white text-sm cursor-pointer w-full sm:w-auto"
              />

              <button
                onClick={exportByDate}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm w-full sm:w-auto"
                disabled={!filteredTransactions.some(tx => tx.rawDate && tx.rawDate.toDateString() === new Date(exportDate + 'T00:00:00').toDateString())}
              >
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Mobile card view (visible on small screens) */}
        <div className="sm:hidden space-y-3">
          {loading ? (
            <p className="p-4 text-white">Loading...</p>
          ) : paginatedTransactions.length === 0 ? (
            <p className="p-4 text-gray-300">No transactions found.</p>
          ) : (
            paginatedTransactions.map((tx) => (
              <div key={tx.id} className="rounded-lg bg-white shadow-sm p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {renderStatusIcon(tx.status)}
                    <span className="text-xs text-gray-600">{tx.status}</span>
                  </div>
                  <button
                    onClick={() => handleViewReceipt(tx)}
                    className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md text-xs"
                  >
                    <Eye className="w-3 h-3" />
                    View
                  </button>
                </div>

                <div className="mt-2">
                  <p className="text-sm font-semibold">{tx.name}</p>
                  <p className="text-xs text-gray-600">{tx.item || 'No items'}</p>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-700">
                  <div>
                    <span className="text-gray-500">Date</span>
                    <div>{tx.date}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Time</span>
                    <div>{tx.time}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">User</span>
                    <div>{tx.username}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-500">Total</span>
                    <div className="font-semibold text-green-600">₱{tx.total}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop table (hidden on small screens) */}
        <div className="hidden sm:block bg-bronze rounded-lg shadow-md overflow-x-auto">
          {loading ? (
            <p className="p-4 text-white">Loading...</p>
          ) : (
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-bronze-100">
                <tr className="text-left text-sm text-white">
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Item</th>
                  <th className="px-4 py-2">Total</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Time</th>
                  <th className="px-4 py-2">User</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((tx, index) => (
                  <tr key={tx.id ?? index} className="border-t text-sm bg-white text-gray-700 hover:bg-gray-50">
                    <td className="px-4 py-2">{renderStatusIcon(tx.status)}</td>
                    <td className="px-4 py-2">{tx.name}</td>
                    <td className="px-4 py-2">{tx.item}</td>
                    <td className="px-4 py-2">₱{tx.total}</td>
                    <td className="px-4 py-2">{tx.date}</td>
                    <td className="px-4 py-2">{tx.time}</td>
                    <td className="px-4 py-2">{tx.username}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleViewReceipt(tx)}
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Bottom Pagination */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
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
        </div>
      </div>

      {/* Receipt Popup */}
      <OrderPopup
        isOpen={receiptPopupOpen}
        onClose={() => setReceiptPopupOpen(false)}
        title="Receipt"
      >
        {selectedReceipt && (
          <div className="space-y-4">
            <div className="text-sm">
              <p className="font-semibold">Receipt No: {selectedReceipt.name}</p>
              <p className="text-gray-600">Employee: {selectedReceipt.username}</p>
              <p className="text-gray-600">Date: {selectedReceipt.date} {selectedReceipt.time}</p>
              <p className="text-gray-600">Status: {selectedReceipt.status}</p>
            </div>

            <hr className="border-gray-400" />

            {/* Items */}
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Items:</h3>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {selectedReceipt.items && selectedReceipt.items.length > 0 ? (
                  selectedReceipt.items.map((item, idx) => (
                    <div key={idx} className="text-sm text-gray-700 border-b pb-1">
                      <div className="flex justify-between">
                        <span className="font-medium">{item.productName}</span>
                        <span>x{item.quantity}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>₱{Number(item.price).toFixed(2)} each</span>
                        <span>₱{(Number(item.price) * Number(item.quantity)).toFixed(2)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No items</p>
                )}
              </div>
            </div>

            <hr className="border-gray-400" />

            {/* Total */}
            <div className="flex justify-between items-center font-bold text-lg">
              <span>Total:</span>
              <span className="text-green-600">₱{selectedReceipt.total}</span>
            </div>
          </div>
        )}
      </OrderPopup>
    </DashboardLayout>
  );
}

function formatLocalDateInput(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default SalesLog;
