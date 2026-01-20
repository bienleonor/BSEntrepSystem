import React from "react";
import { useCart } from "./CartContext";

export default function Cart({ inventory, saleDate, setSaleDate, submitSale, submitting }) {
  const { cart, updateCartQty, clearCart } = useCart();
  const cartItems = Object.values(cart);
  const totalAmount = cartItems.reduce((s, it) => s + it.quantity * Number(it.price), 0);

  return (
    <div className="border border-gray-700 rounded-2xl shadow-lg shadow-cyan-700/30 p-4 sm:p-5 bg-slate-300 my-cart-item lg:sticky lg:top-4">
      {cartItems.length === 0 && <div className="text-gray-500">Cart is empty</div>}

      {cartItems.map((it) => {
        const invItem = inventory.find((i) => i.product_id === it.product_id);
        return (
          <div key={it.product_id} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 border border-gray-800/30 rounded-2xl shadow shadow-gray-800/40 px-3 py-2 justify-between mb-4 my-cart-item">
            <div className="flex-1 w-full">
              <div className="font-medium">{it.name}</div>
              <div className="text-xs text-gray-500">₱{Number(it.price).toFixed(2)}</div>
            </div>
            <div className="inline-block flex-none">
              <input
                type="number"
                min="0"
                step="0.001"
                value={it.quantity}
                className="w-20 sm:w-16 border rounded-2xl pl-1 text-center transition-all duration-200 "
                onChange={(e) => {
                  const val = parseFloat(e.target.value || "0");
                  const maxQty = invItem ? Number(invItem.total_quantity ?? invItem.quantity ?? 0) : 0;
                  const clamped = invItem ? Math.min(maxQty, Math.max(0, val)) : Math.max(0, val);
                  updateCartQty(it.product_id, clamped);
                }}
              />
            </div>
            <div className="sm:ml-2">₱{(it.quantity * Number(it.price)).toFixed(2)}</div>
          </div>
        );
      })}

      <hr className="my-4" />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-800">Sale date</label>
        <input
          type="date" disabled
          value={saleDate}
          onChange={(e) => setSaleDate(e.target.value)}
          className="mt-1 border rounded px-2 py-2 w-full"
        />
      </div>

      <div className="font-bold mb-2 text-lg sm:text-xl">Total: ₱{totalAmount.toFixed(2)}</div>
      
      <button
        onClick={submitSale}
        disabled={submitting || cartItems.length === 0}
        className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50 hover:bg-blue-600"
      >
        {submitting ? "Submitting..." : "Create Order"}
      </button>
      <button
        onClick={clearCart}
        disabled={submitting}
        className="w-full sm:w-auto mt-2 sm:mt-0 sm:ml-2 px-4 py-2 bg-gray-400 text-white rounded disabled:opacity-50 hover:bg-blue-600"
      >
        Clear
      </button>
      
    </div>
  );
}
