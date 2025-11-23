import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StockOut = () => {
  const [formData, setFormData] = useState({
    name: 'Sibuyas',
    quantityAvailable: 200,
    quantity: '',
    reason: '',
    proof: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.quantity || !formData.reason || !formData.proof) {
      toast.error('Please fill out all fields and attach proof.');
      return;
    }
    toast.success('Stock Out Submitted!');
    console.log('Stock Out Submitted:', formData);
  };

  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto mt-10 bg-slate-300 shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          📦 Stock Adjusment
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              disabled
              className="w-full rounded-lg border-gray-300 bg-gray-100 text-gray-600 p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity Available
            </label>
            <input
              type="number"
              name="quantityAvailable"
              value={formData.quantityAvailable}
              disabled
              className="w-full rounded-lg border-gray-300 bg-gray-100 text-gray-600 p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              className="w-full hover:bg-gray-400 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2"
            />
          </div>

         <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason
            </label>
            <select
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 bg-white"
            >
                <option value="" disabled>Select a reason</option>
                <option value="spoilage">Spoilage</option>
                <option value="wastage">Wastage</option>
                <option value="correction">Correction</option>
            </select>
        </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attach Proof
            </label>
            <input
              type="file"
              name="proof"
              accept="image/*"
              onChange={handleChange}
              required
              className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                         file:rounded-lg file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700
                         hover:file:bg-blue-100"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Confirm Stock Out
          </button>
        </form>
        <ToastContainer />
      </div>
    </DashboardLayout>
  );
};

export default StockOut;
