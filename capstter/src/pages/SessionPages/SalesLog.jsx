import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

function SalesLog() {
  const transactions = [
    { name: 'Arwing, Archer', item: 'Chicken Joy', date: '23 March 2015', time: '10:15 AM', status: 'Complete' },
    { name: 'Lannok, Ben', item: 'Butterpe', date: '23 March 2015', time: '10:15 AM', status: 'Canceled' },
    { name: 'Tyson, Chromiumel', item: 'Burger and Fries', date: '23 March 2015', time: '10:15 AM', status: 'Complete' },
    { name: 'Bastian, Lester', item: 'Beef Tapa', date: '23 March 2015', time: '10:15 AM', status: 'Complete' },
    { name: 'Simon, Lester', item: 'Beef Tapa', date: '23 March 2015', time: '10:15 AM', status: 'Pending' },
    { name: 'Pedro, Reynaldos', item: 'Beef Tapa', date: '23 March 2015', time: '10:15 AM', status: 'Complete' },
  ];

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
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Latest Transactions</h1>
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr className="text-left text-sm text-gray-600">
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Item</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={index} className="border-t text-sm text-gray-700 hover:bg-gray-50">
                  <td className="px-4 py-2">{renderStatusIcon(tx.status)}</td>
                  <td className="px-4 py-2">{tx.name}</td>
                  <td className="px-4 py-2">{tx.item}</td>
                  <td className="px-4 py-2">{tx.date}</td>
                  <td className="px-4 py-2">{tx.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default SalesLog;
