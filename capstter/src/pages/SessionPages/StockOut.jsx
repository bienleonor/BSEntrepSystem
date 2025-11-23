import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import axiosInstance from "../../utils/axiosInstance";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StockOut = () => {
  const [formData, setFormData] = useState({
    name: 'No item',
    quantityAvailable: 200,
    productId: null,
    quantity: '',
    reason: '',
  });
  const [products, setProducts] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // ensure productId exists (selected from the product dropdown)
    const productId = formData.productId;
    if (!productId) {
      toast.error('No product selected. Select a product first.');
      return;
    }

    if (!formData.quantity || !formData.reason) {
      toast.error('Please fill out all fields.');
      return;
    }

    const fd = new FormData();
    fd.append('productId', productId);
    fd.append('quantity', formData.quantity);
    fd.append('reason', formData.reason);

    // POST to inventory/stock-out (router is mounted under /api/inventory)
    axiosInstance.post('/inventory/stock-out', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((res) => {
        toast.success('Stock out recorded.');
        // optional: reset quantity and proof
        setFormData((prev) => ({ ...prev, quantity: '', reason: '', proof: null }));
      })
      .catch((err) => {
        console.error('Stock out error:', err.response || err.message || err);
        const msg = err?.response?.data?.error || 'Failed to record stock out.';
        toast.error(msg);
      });
  };

  // Fetch products for the current business and set initial product selection
  useEffect(() => {
    const businessId = localStorage.getItem('selectedBusinessId');
    if (!businessId) {
      toast.error('No business selected. Please select a business first.');
      return;
    }

      // fetch products with inventory details (includes `quantity`)
      axiosInstance.get(`/inventory/products/active/inventory-details/${businessId}`)
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        setProducts(list);

        // pick stored product or first product as initial selection
        const stored = localStorage.getItem('selectedProductId');
        const initial = stored || (list[0] && (list[0].product_id || list[0].productId));
        if (initial) {
          const sel = list.find(p => String(p.product_id || p.productId || p.id) === String(initial));
          if (sel) {
            setFormData((prev) => ({
              ...prev,
              productId: initial,
              name: sel.name || prev.name,
                quantityAvailable: (sel.quantity != null ? sel.quantity : prev.quantityAvailable),
            }));
          }
        }
      })
      .catch((err) => {
        console.error('Failed to fetch products for business:', err.response || err.message || err);
        toast.error('Failed to load products.');
      });
  }, []);

  const handleProductChange = (e) => {
    const val = e.target.value;
    const sel = products.find(p => String(p.product_id || p.productId || p.id) === String(val));
    if (sel) {
      setFormData((prev) => ({
        ...prev,
        productId: val,
        name: sel.name || prev.name,
          quantityAvailable: (sel.quantity != null ? sel.quantity : prev.quantityAvailable),
      }));
    } else {
      setFormData((prev) => ({ ...prev, productId: val }));
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          📦 Stock Adjusment
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product
            </label>
            <select
              name="productId"
              value={formData.productId || ''}
              onChange={handleProductChange}
              required
              className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 bg-white mb-3"
            >
              <option value="" disabled>Select a product</option>
              {products.map(p => (
                <option key={p.product_id || p.productId || p.id} value={p.product_id || p.productId || p.id}>
                  {p.name}
                </option>
              ))}
            </select>

          
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
              min="1"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2"
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
