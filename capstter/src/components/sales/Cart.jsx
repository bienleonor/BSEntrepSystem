import React from "react";
import { useCart } from "./CartContext";

export default function Cart({ inventory, saleDate, setSaleDate, submitSale, submitting }) {
  const { cart, updateCartQty, clearCart } = useCart();
  const cartItems = Object.values(cart);
  const totalAmount = cartItems.reduce((s, it) => s + it.quantity * Number(it.price), 0);

  return (
    <div className="border border-gray-200 rounded p-2 bg-slate-300">
      {cartItems.length === 0 && <div className="text-gray-500">Cart is empty</div>}

      {cartItems.map((it) => {
        const invItem = inventory.find((i) => i.product_id === it.product_id);
        return (
          <div key={it.product_id} className="flex items-center justify-between mb-2">
            <div className="flex-1">
              <div className="font-medium">{it.name}</div>
              <div className="text-xs text-gray-500">₱{Number(it.price).toFixed(2)}</div>
            </div>
            <input
              type="number"
              min="1"
              value={it.quantity}
              className="w-16 border rounded px-1"
              onChange={(e) => {
                const val = parseInt(e.target.value || "0", 10);
                const clamped = invItem ? Math.min(invItem.quantity, Math.max(0, val)) : Math.max(0, val);
                updateCartQty(it.product_id, clamped);
              }}
            />
            <div className="ml-2">₱{(it.quantity * Number(it.price)).toFixed(2)}</div>
          </div>
        );
      })}

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

      <div className="font-bold mb-2">Total: ₱{totalAmount.toFixed(2)}</div>

      <button
        onClick={submitSale}
        disabled={submitting || cartItems.length === 0}
        className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50 hover:bg-blue-600"
      >
        {submitting ? "Submitting..." : "Complete Sale"}
      </button>
      <button
        onClick={clearCart}
        disabled={submitting}
        className="ml-2 px-4 py-2 bg-gray-400 text-white rounded disabled:opacity-50 hover:bg-blue-600"
      >
        Clear
      </button>
    </div>
  );
}
