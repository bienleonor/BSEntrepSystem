import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import axiosInstance from "../../utils/axiosInstance";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function MultiAdjustment() {
  const adjustmentTypes = [
    { value: 'add', label: 'Add Stocks' },
    { value: 'spoilage', label: 'Spoilage' },
    { value: 'waste', label: 'Wastage' },
    { value: 'correction', label: 'Stock Adjustment' },
    { value: 'production', label: 'Production' },
  ];
  
  const [type, setType] = useState('add');
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  // For correction mode: allow user to choose add or subtract
  const [correctionMode, setCorrectionMode] = useState('subtract'); // 'add' | 'subtract'
  
  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.user_id;
    } catch {
      return null;
    }
  };
  // 🔥 Dynamic API Mapping
  const apiMap = {
    add: "/inventory/adjust/stockin",
    spoilage: "/inventory/adjust/stockout",
    waste: "/inventory/adjust/stockout",
    correction: "/inventory/adjust/correction",
    production: "/inventory/adjust/production",
  };

  const modeLabel = adjustmentTypes.find(t => t.value === type)?.label || "Stock Adjustment";

  // Fetch products helper
  const fetchProducts = async () => {
    const biz = localStorage.getItem("selectedBusinessId");
    if (!biz) {
      toast.error("Select a business first.");
      return [];
    }
    try {
      const res = await axiosInstance.get(`/inventory/businesses/${biz}/products`);
      const all = Array.isArray(res.data) ? res.data : [];
      // Filter by adjustment type
      const filtered = all.filter(p => {
        const t = String(type);
        const pt = String(p.product_type || '').toLowerCase();
        if (t === 'add') {
          return pt === 'simple';
        }
        if (t === 'production') {
          return pt === 'recipe' || pt === 'composite';
        }
        // For spoilage/waste/correction, allow all types by default
        return true;
      });
      setProducts(filtered);
      return filtered;
    } catch (e) {
      toast.error("Failed to load products.");
      return [];
    }
  };

  // Initial/Type-change product load
  useEffect(() => {
    (async () => {
      const data = await fetchProducts();
      if (data[0]) {
        setItems([{
          productId: data[0].product_id,
          name: data[0].name,
          quantityAvailable: data[0].quantity || 0,
          quantity: "",
          unit_price: type === 'add' ? (Number(data[0].unit_cost) || 0) : undefined,
        }]);
      } else {
        setItems([]);
      }
    })();
  }, [type]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (field === 'productId') {
      const sel = products.find(p => String(p.product_id) === String(value));
      if (sel) {
        newItems[index].name = sel.name;
        newItems[index].quantityAvailable = sel.quantity || 0;
        if (type === 'add') {
          newItems[index].unit_price = Number(sel.unit_cost) || 0;
        }
        // Do not auto-map unit_price from product price; keep user input
      }
    }

    setItems(newItems);
  };

  const addItem = () => {
    if (products.length === 0) return;
    const first = products[0];
    setItems([...items, {
      productId: first.product_id,
      name: first.name,
      quantityAvailable: first.quantity || 0,
      quantity: "",
      unit_price: type === 'add' ? (Number(first.unit_cost) || 0) : undefined,
    }]);
  };

  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return toast.error("No items to submit.");

    const businessId = Number(localStorage.getItem("selectedBusinessId"));
    if (!businessId) return toast.error("Missing businessId");

    const userId = getUserIdFromToken();
    if (!userId) return toast.error("Missing user info");

    // Determine sign: correction can be add or subtract; others fixed
    const isStockOut = type === 'spoilage' || type === 'waste' || (type === 'correction' && correctionMode === 'subtract');
    const isCorrectionAdd = type === 'correction' && correctionMode === 'add';

    const payload = {
      businessId,
      userId,
      items: items.map(i => {
        if (!i.quantity || Number(i.quantity) <= 0)
          throw new Error(`Quantity for ${i.name} must be greater than 0`);

        const payloadItem = {
          productId: Number(i.productId),
          // Send negative quantity for stock-out/correction to reduce stock
          quantity: isStockOut ? -Math.abs(Number(i.quantity)) : Math.abs(Number(i.quantity)),
          ...(type === 'add' ? { unit_price: Number(i.unit_price) || 0 } : {})
        };
        // For correction-add, quantity should be positive (already handled by isStockOut calc)
        return payloadItem;
      })
    };

    try {
      setLoading(true);
      await axiosInstance.post(apiMap[type], payload);
      // Re-fetch products to reflect updated quantities immediately
      const updatedProducts = await fetchProducts();
      // Sync current items' quantityAvailable from latest product data
      setItems(prev => prev.map(i => {
        const p = updatedProducts.find(p => Number(p.product_id) === Number(i.productId));
        return {
          ...i,
          quantityAvailable: p ? (p.quantity || 0) : i.quantityAvailable,
          quantity: "",
        };
      }));
      toast.success(`${modeLabel} successful`);
    } catch (err) {
      console.error(err);
      const apiError = err.response?.data?.error || err.message || "Action failed.";
      // Special-case insufficient stock errors
      if (apiError.includes('INSUFFICIENT_STOCK')) {
        const details = err.response?.data?.details;
        const msg = details?.productId
          ? `Insufficient stock for product ${details.productId}. Available: ${details.available}, requested change: ${details.requestedChange}.`
          : 'Insufficient stock to complete the operation.';
        toast.warn(msg);
      } else {
        toast.error(apiError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (e) => setType(e.target.value);
  const handleCorrectionModeChange = (e) => setCorrectionMode(e.target.value);

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto mt-10 bg-slate-300 shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">{modeLabel}</h2>

        {/* Type Switcher */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Adjustment Type</label>
          <select value={type} onChange={handleTypeChange} className="w-full p-2 rounded-lg">
            {adjustmentTypes.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {type === 'correction' && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Correction Mode</label>
            <select value={correctionMode} onChange={handleCorrectionModeChange} className="w-full p-2 rounded-lg">
              <option value="add">Add to stock</option>
              <option value="subtract">Subtract from stock</option>
            </select>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {items.map((item, idx) => (
            <div key={idx} className="border p-3 rounded-lg space-y-3">
              <div>
                <label className="block text-sm mb-1">Product</label>
                <select
                  value={item.productId}
                  onChange={e => handleItemChange(idx, 'productId', e.target.value)}
                  required
                  className="w-full p-2 rounded-lg"
                >
                  {products.map(p => (
                    <option key={p.product_id} value={p.product_id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm">Current Quantity</label>
                <input disabled value={item.quantityAvailable} className="w-full p-2 rounded-lg bg-gray-100" />
              </div>

              <div>
                <label className="block text-sm">Quantity</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.quantity}
                  onChange={e => handleItemChange(idx, 'quantity', parseFloat(e.target.value))}
                  required
                  className="w-full p-2 rounded-lg"
                />
              </div>

              {type === 'add' && (
                <div>
                  <label className="block text-sm">Unit Price</label>
                  <input
                    type="number"
                    min="0"
                    value={item.unit_price}
                    onChange={e => handleItemChange(idx, 'unit_price', e.target.value)}
                    required
                    className="w-full p-2 rounded-lg"
                  />
                </div>
              )}

              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Remove Item
                </button>
              )}
            </div>
          ))}

          <button type="button" onClick={addItem} className="w-full bg-gray-500 text-white p-2 rounded-lg">
            + Add Another Product
          </button>
          <button type="submit" className="w-full bg-blue-600 p-2 text-white rounded-lg">
            {loading ? 'Processing...' : 'Confirm'}
          </button>
        </form>

        <ToastContainer />
      </div>
    </DashboardLayout>
  );
}
