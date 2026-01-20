import React from "react";

export default function InventoryCard({ item, onAddToCart }) {
  return (
    <div className="border border-gray-800 rounded-2xl shadow-lg shadow-cyan-700/30 p-3 sm:p-4 flex flex-col items-center bg-slate-300">
      <div className="w-full h-32 sm:h-40 bg-gray-100 flex items-center justify-center mb-4 rounded-xl overflow-hidden">
        {item.picture ? (
          <img
            src={item.picture.startsWith("http") ? item.picture : `http://localhost:5000/${item.picture}`}
            alt={item.name}
            className="object-cover w-full h-full"
            loading="lazy"
          />
        ) : (
          <span className="text-gray-400">No Image</span>
        )}
      </div>
      <div className="text-center mb-2">
        <strong className="block text-lg sm:text-xl md:text-2xl">{item.name}</strong>
        <div className="text-xs sm:text-sm text-gray-700">
          Stock: {item.quantity ?? Math.floor((item.total_quantity ?? 0) / (item.unit_multiplier ?? 1))} {item.unit_multiplier ? 'packs' : ''} ({item.total_quantity ?? 0} units)
        </div>
      </div>
      <div className="text-lg sm:text-xl font-semibold mb-3">₱{Number(item.price).toFixed(2)}</div>
      <button
  className="w-full sm:w-auto px-4 py-2 bg-slate-700 text-white rounded-xl hover:bg-blue-800 hover:font-bold transition-all duration-150 disabled:opacity-50"
  onClick={() => onAddToCart(item, 1)}
  disabled={(item.total_quantity ?? 0) <= 0}
>
  {(item.total_quantity ?? 0) > 0 ? "Add to Cart" : "Out of Stock"}
</button>

    </div>
  );
}
