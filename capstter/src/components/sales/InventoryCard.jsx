import React from "react";

export default function InventoryCard({ item, onAddToCart }) {
  return (
    <div className="border border-gray-200 rounded-lg shadow p-4 flex flex-col items-center">
      <div className="w-full h-40 bg-gray-100 flex items-center justify-center mb-4 rounded overflow-hidden">
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
        <strong className="block text-lg">{item.name}</strong>
        <div className="text-sm text-black-500">Stock: {item.quantity}</div>
      </div>
      <div className="text-lg font-semibold mb-3">₱{Number(item.price).toFixed(2)}</div>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        onClick={() => onAddToCart(item, 1)}
        disabled={item.quantity <= 0}
      >
        Add to Cart
      </button>
    </div>
  );
}
