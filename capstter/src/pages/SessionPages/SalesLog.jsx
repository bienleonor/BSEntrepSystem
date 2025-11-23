import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import AxiosInstance from "../../utils/axiosInstance";
import { CheckCircle, XCircle, Clock } from 'lucide-react';

function SalesLog() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchSalesLog = async () => {
    try {
      const res = await AxiosInstance.get('/sales/saleslog'); 
      console.log('SalesLog API response:', res.data);

      const { orders = [] } = res.data || {};
      
      const txs = orders.map(order => ({
        name: `Purchase #${order.id}`,
        item: (order.items || []).map(item => item.productName).join(', '),
        date: order.purchaseDate ? new Date(order.purchaseDate).toLocaleDateString() : '',
        time: order.purchaseDate ? new Date(order.purchaseDate).toLocaleTimeString() : '',
        status: order.finishedAt ? 'Complete' : 'Pending'
      }));

      setTransactions(txs);
    } catch (err) {
      console.error('Failed to fetch sales log:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchSalesLog();
}, []);


  // 👇 Add this function back
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

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-6xl font-bold mb-4 text-white">Latest Transactions</h1>
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
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, index) => (
                  <tr key={index} className="border-t text-sm bg-white text-gray-700 hover:bg-gray-50">
                    <td className="px-4 py-2">{renderStatusIcon(tx.status)}</td>
                    <td className="px-4 py-2">{tx.name}</td>
                    <td className="px-4 py-2">{tx.item}</td>
                    <td className="px-4 py-2">{tx.date}</td>
                    <td className="px-4 py-2">{tx.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}


export default SalesLog;
