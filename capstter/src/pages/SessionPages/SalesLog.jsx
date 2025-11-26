import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import AxiosInstance from "../../utils/axiosInstance";
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { OrderPopup } from '../../components/common/OrderPopup';

function SalesLog() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortFilter, setSortFilter] = useState("latest"); // 👈 sorting filter
  const [dateFilter, setDateFilter] = useState("all");    // 👈 date range filter
  const [searchReceipt, setSearchReceipt] = useState("");  // 👈 search filter for receiptNo
  const [receiptPopupOpen, setReceiptPopupOpen] = useState(false); // 👈 receipt popup state
  const [selectedReceipt, setSelectedReceipt] = useState(null);    // 👈 selected receipt data

  useEffect(() => {
    const fetchSalesLog = async () => {
      try {
        const res = await AxiosInstance.get('/sales/saleslog');
          
        console.log('SalesLog API response:', res.data);

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
            items: order.items || [], // 👈 store full items array with quantities and prices
            date: order.purchaseDate ? new Date(order.purchaseDate).toLocaleDateString() : '',
            time: order.purchaseDate ? new Date(order.purchaseDate).toLocaleTimeString() : '',
            rawDate: order.purchaseDate ? new Date(order.purchaseDate) : null, // 👈 keep raw date for filtering/sorting
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

  // 👇 Status icons
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

  // 👇 Handle view receipt button
  const handleViewReceipt = (transaction) => {
    setSelectedReceipt(transaction);
    setReceiptPopupOpen(true);
  };

  // 👇 Apply date filter
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

  // 👇 Apply search filter
  const applySearchFilter = (txs) => {
    if (!searchReceipt.trim()) return txs;
    const query = searchReceipt.toLowerCase();
    return txs.filter(tx => tx.name.toLowerCase().includes(query));
  };

  // 👇 Apply sorting filter
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
        return sorted.sort((a, b) => (b.id || 0) - (a.id || 0)); // latest by ID
    }
  };

  const filteredTransactions = applySortFilter(applySearchFilter(applyDateFilter(transactions)));

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-6xl font-bold mb-4 text-white">Latest Transactions</h1>

        {/* 👇 Filter controls */}
        <div className="mb-4 flex gap-4 flex-wrap">
          <div>
            <label className="text-white mr-2">Search Receipt:</label>
            <input
              type="text"
              value={searchReceipt}
              onChange={(e) => setSearchReceipt(e.target.value)}
              placeholder="Enter receipt number..."
              className="px-3 py-2 rounded-md w-64"
            />
          </div>

          <div>
            <label className="text-white mr-2">Sort by:</label>
            <select
              value={sortFilter}
              onChange={(e) => setSortFilter(e.target.value)}
              className="px-3 py-2 rounded-md"
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

          <div>
            <label className="text-white mr-2">Show:</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 rounded-md"
            >
              <option value="all">All</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        <div className="bg-bronze rounded-lg shadow-md overflow-x-auto">
          {loading ? (
            <p className="p-4 text-white">Loading...</p>
          ) : (
            <table className="min-w-full table-auto">
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
                {filteredTransactions.map((tx, index) => (
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
      </div>

      {/* 👇 Receipt Popup */}
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

export default SalesLog;
