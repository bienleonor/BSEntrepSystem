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

  // Fetch products
  useEffect(() => {
    const biz = localStorage.getItem("selectedBusinessId");
    if (!biz) return toast.error("Select a business first.");

    axiosInstance
      .get(`/inventory/businesses/${biz}/products/`)
      .then((res) => {
        setProducts(res.data);
        if (res.data[0]) {
          setItems([{
            productId: res.data[0].product_id,
            name: res.data[0].name,
            quantityAvailable: res.data[0].quantity,
            quantity: "",
            unit_price: type === 'add' ? 0 : undefined,
          }]);
        }
      })
      .catch(() => toast.error("Failed to load products."));
  }, [type]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (field === 'productId') {
      const sel = products.find(p => String(p.product_id) === String(value));
      if (sel) {
        newItems[index].name = sel.name;
        newItems[index].quantityAvailable = sel.quantity;
        if (type === 'add') newItems[index].unit_price = sel.unit_price || 0;
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
      quantityAvailable: first.quantity,
      quantity: "",
      unit_price: type === 'add' ? first.unit_price || 0 : undefined,
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

    const payload = {
      businessId,
      userId,
      items: items.map(i => {
        if (!i.quantity || Number(i.quantity) <= 0)
          throw new Error(`Quantity for ${i.name} must be greater than 0`);

        return {
          productId: Number(i.productId),
          quantity: Number(i.quantity),
          ...(type === 'add' ? { unit_price: Number(i.unit_price) || 0 } : {})
        };
      })
    };

    try {
      await axiosInstance.post(apiMap[type], payload);
      toast.success(`${modeLabel} successful`);
      setItems(items.map(i => ({ ...i, quantity: "" })));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Action failed.");
    }
  };

  const handleTypeChange = (e) => setType(e.target.value);

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
                  min="1"
                  value={item.quantity}
                  onChange={e => handleItemChange(idx, 'quantity', e.target.value)}
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
            Confirm
          </button>
        </form>

        <ToastContainer />
      </div>
    </DashboardLayout>
  );
}
