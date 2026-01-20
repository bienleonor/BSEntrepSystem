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

  const getTypeIcon = (t) => {
    switch (t) {
      case 'add': return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      );
      case 'spoilage': return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      );
      case 'waste': return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      );
      case 'correction': return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      );
      case 'production': return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      );
      default: return null;
    }
  };

  const getTypeColor = (t) => {
    switch (t) {
      case 'add': return 'text-green-600 bg-green-100 border-green-200';
      case 'spoilage': return 'text-red-600 bg-red-100 border-red-200';
      case 'waste': return 'text-amber-600 bg-amber-100 border-amber-200';
      case 'correction': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'production': return 'text-cyan-600 bg-cyan-100 border-cyan-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Stock Adjustment
          </h1>
          <p className="mt-2 text-gray-600 text-sm sm:text-base">
            Manage your inventory with various adjustment types
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Type Selector Header */}
          <div className="p-4 border-b border-gray-200">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
              Adjustment Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {adjustmentTypes.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                    type === t.value 
                      ? getTypeColor(t.value)
                      : 'text-gray-600 bg-gray-100 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {getTypeIcon(t.value)}
                  <span className="text-xs font-medium">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Correction Mode Toggle */}
          {type === 'correction' && (
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Correction Mode
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCorrectionMode('add')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    correctionMode === 'add'
                      ? 'bg-green-100 text-green-600 border border-green-200'
                      : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  + Add to Stock
                </button>
                <button
                  type="button"
                  onClick={() => setCorrectionMode('subtract')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    correctionMode === 'subtract'
                      ? 'bg-red-100 text-red-600 border border-red-200'
                      : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  − Subtract from Stock
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* Items List */}
            {items.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-4"
              >
                {/* Item Header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Item #{idx + 1}
                  </span>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-all"
                      title="Remove Item"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Product Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Product</label>
                  <select
                    value={item.productId}
                    onChange={e => handleItemChange(idx, 'productId', e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {products.map(p => (
                      <option key={p.product_id} value={p.product_id} className="bg-white">
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Current Quantity & Input Quantity Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Stock</label>
                    <div className="px-4 py-2.5 rounded-lg bg-gray-100 border border-gray-300 text-gray-700 font-medium">
                      {item.quantityAvailable}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {type === 'add' ? 'Add Quantity' : type === 'production' ? 'Produce Quantity' : 'Adjust Quantity'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.quantity}
                      onChange={e => handleItemChange(idx, 'quantity', parseFloat(e.target.value))}
                      required
                      placeholder="0"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Unit Price (only for add) */}
                {type === 'add' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Unit Price (₱)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unit_price}
                      onChange={e => handleItemChange(idx, 'unit_price', e.target.value)}
                      required
                      placeholder="0.00"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            ))}

            {/* Add Item Button */}
            <button
              type="button"
              onClick={addItem}
              className="w-full py-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Another Product
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || items.length === 0}
              className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                loading || items.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : `${getTypeColor(type)} hover:opacity-90`
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent"></div>
                  Processing...
                </>
              ) : (
                <>
                  {getTypeIcon(type)}
                  Confirm {modeLabel}
                </>
              )}
            </button>
          </form>
        </div>

        <ToastContainer 
          position="bottom-right"
          theme="light"
          toastClassName="bg-white text-gray-900 border border-gray-200"
        />
      </div>
    </DashboardLayout>
  );
}
