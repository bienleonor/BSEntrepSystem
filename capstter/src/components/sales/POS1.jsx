import React, { useEffect, useState, useCallback } from "react";
import { getToken } from "../../utils/token";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import api from "../../utils/api";

const REFRESH_INTERVAL = 10000; // 30 seconds

export default function POS1() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [businessId, setBusinessId] = useState(
    localStorage.getItem("selectedBusinessId") || ""
  );
  const [inventory, setInventory] = useState([]);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saleDate, setSaleDate] = useState(new Date().toISOString().slice(0, 10));

  const token = getToken();

  const fetchInventory = useCallback(async () => {
    if (!businessId) return;
    try {
      setLoading(true);
      const resp = await api.get(
        `http://localhost:5000/api/inventory/products/active/inventory-details/${businessId}`,
        token
      );
      if (!resp.ok) throw new Error(`Fetch failed: ${resp.status}`);
      const list = await resp.json();
      setInventory(list);

      setCart((prev) => {
        const next = { ...prev };
        for (const item of list) {
          if (next[item.product_id] && next[item.product_id].quantity > item.quantity) {
            next[item.product_id].quantity = item.quantity;
            toast.info(`Adjusted ${item.name} quantity to available stock`);
          }
        }
        return next;
      });
    } catch (err) {
      toast.error("Unable to load inventory");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [businessId, token]);

  

  useEffect(() => {
    if (!businessId) {
      toast.error("No business selected. Redirecting...");
      setTimeout(() => navigate("/busmanage"), 1500);
      return;
    }
    fetchInventory();
    const id = setInterval(fetchInventory, REFRESH_INTERVAL);
    return () => clearInterval(id);
  }, [businessId, fetchInventory, navigate]);

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const current = prev[product.product_id]?.quantity || 0;
      const nextQty = Math.min(product.quantity, current + qty);
      return {
        ...prev,
        [product.product_id]: {
          product_id: product.product_id,
          name: product.name,
          price: Number(product.price),
          quantity: nextQty,
        },
      };
    });
  };

  const updateCartQty = (productId, qty) => {
    setCart((prev) => {
      const next = { ...prev };
      if (qty <= 0) {
        delete next[productId];
      } else {
        next[productId] = { ...next[productId], quantity: qty };
      }
      return next;
    });
  };

  const clearCart = () => setCart({});

  const cartItems = Object.values(cart);
  const totalAmount = cartItems.reduce(
    (s, it) => s + it.quantity * Number(it.price),
    0
  );

  const submitSale = async () => {
    if (!cartItems.length) {
      toast.warn("Cart is empty");
      return;
    }
    if (!token) {
      toast.error("Missing auth token. Please login.");
      return;
    }
    const saleData = {
      business_id: businessId,
      total_amount: totalAmount,
      sale_date: saleDate,
      items: cartItems.map((it) => ({
        product_id: it.product_id,
        quantity: it.quantity,
        price: it.price,
      })),
    };

   try {
  setSubmitting(true);

  const resp = await fetch("http://localhost:5000/api/sales/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(saleData),
  });

  if (!resp.ok) {
    const errBody = await resp.json().catch(() => ({}));
    throw new Error(errBody.error || `Status ${resp.status}`);
  }

  const data = await resp.json(); // <-- parse response JSON
  toast.success(`Sale created (#${data.sale_id}).`);

  clearCart();
  fetchInventory();
} catch (err) {
  console.error(err);
  toast.error(`Sale failed: ${err.message}`);
} finally {
  setSubmitting(false);
}
  };

  return (
    <div className="p-4">
      <h3 className="text-xl font-bold mb-4">POS Terminal</h3>
            <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />

      <div className="flex gap-4">
        {/* Inventory */}
        <div className="flex-2 w-2/3">
          <h4 className="text-lg font-semibold mb-2">
            Inventory {loading ? "(loading...)" : ""}
          </h4>
      <div className="max-h-[700px] overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-6 rounded p-2 hidden-scrollbar">
        {inventory.length === 0 && !loading && (
          <div className="text-gray-500">No inventory found</div>
        )}
        {inventory.map((item) => (
          <div
            key={item.product_id}
            className="border border-gray-200 rounded-lg shadow p-4 flex flex-col items-center"
          >
            {/* Product image placeholder */}
           <div className="w-full h-40 bg-gray-100 flex items-center justify-center mb-4 rounded overflow-hidden">
            {item.picture ? (
              <img
                src={item.picture.startsWith("http") ? item.picture : `http://localhost:5000/${item.picture}`}
                alt={item.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-gray-400">No Image</span>
            )}
          </div>


            {/* Product info */}
            <div className="text-center mb-2">
              <strong className="block text-lg">{item.name}</strong>
              <div className="text-sm text-black-500">Stock: {item.quantity}</div>
            </div>

            <div className="text-lg font-semibold mb-3">
              ₱{Number(item.price).toFixed(2)}
            </div>

            {/* Add to cart button */}
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              onClick={() => addToCart(item, 1)}
              disabled={item.quantity <= 0}
            >
              {item.quantity > 0 ? "Add to Cart" : "Out of Stock"}
            </button>

          </div>
        ))}
      </div>

        </div>

        {/* Cart */}
        <div className="flex-1 w-1/3">
          <h4 className="text-lg font-semibold mb-2">Cart</h4>
          <div className="border border-gray-200 rounded p-2">
            {cartItems.length === 0 && (
              <div className="text-gray-500">Cart is empty</div>
            )}
            {cartItems.map((it) => (
              <div
                key={it.product_id}
                className="flex items-center justify-between mb-2"
              >
                <div className="flex-1">
                  <div className="font-medium">{it.name}</div>
                  <div className="text-xs text-gray-500">
                    ₱{Number(it.price).toFixed(2)}
                  </div>
                </div>
                <input
                  type="number"
                  min="1"
                  value={it.quantity}
                  className="w-16 border rounded px-1"
                  onChange={(e) => {
                    const val = parseInt(e.target.value || "0", 10);
                    const invItem = inventory.find(
                      (i) => i.product_id === it.product_id
                    );
                    const clamped = invItem
                      ? Math.min(invItem.quantity, Math.max(0, val))
                      : Math.max(0, val);
                    updateCartQty(it.product_id, clamped);
                  }}
                />
                <div className="ml-2">
                  ₱{(it.quantity * Number(it.price)).toFixed(2)}
                </div>
              </div>
            ))}

            <hr className="my-2" />

            <div className="mb-2">
              <label className="block text-sm font-medium">Sale date</label>
              <input
                type="date"
                value={saleDate}
                onChange={(e) => setSaleDate(e.target.value)}
                className="mt-1 border rounded px-2 py-1 w-full"
              />
            </div>

            <div className="font-bold mb-2">
              Total: ₱{totalAmount.toFixed(2)}
            </div>

            <button
              onClick={submitSale}
              disabled={submitting || cartItems.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Complete Sale"}
            </button>
            <button
              onClick={clearCart}
              disabled={submitting}
              className="ml-2 px-4 py-2 bg-gray-400 text-white rounded disabled:opacity-50"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
