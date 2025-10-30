import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';

function Inventory() {
  const inventoryItems = [
    { name: 'Chicken Joy', category: 'Fast Food', price: 120, stock: 25, status: 'Available' },
    { name: 'Butterpe', category: 'Dessert', price: 85, stock: 0, status: 'Out of Stock' },
    { name: 'Burger and Fries', category: 'Combo Meal', price: 150, stock: 12, status: 'Available' },
    { name: 'Beef Tapa', category: 'Breakfast', price: 110, stock: 5, status: 'Low Stock' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'text-green-600';
      case 'Out of Stock':
        return 'text-red-500';
      case 'Low Stock':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Inventory List</h1>
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr className="text-left text-sm text-gray-600">
                <th className="px-4 py-2">Product Name</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Stock</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {inventoryItems.map((item, index) => (
                <tr key={index} className="border-t text-sm text-gray-700 hover:bg-gray-50">
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.category}</td>
                  <td className="px-4 py-2">₱{item.price}</td>
                  <td className="px-4 py-2">{item.stock}</td>
                  <td className={`px-4 py-2 font-semibold ${getStatusColor(item.status)}`}>
                    {item.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Inventory;
