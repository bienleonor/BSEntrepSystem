import React from "react";
import InventoryCard from "./InventoryCard";

export default function InventoryGrid({ inventory, onAddToCart, loading }) {
  if (!inventory.length && !loading)
    return <div className="text-gray-500">No inventory found</div>;

  return (
    <div className="max-h-[700px] overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-6 rounded p-2 hidden-scrollbar">
      {inventory.map((item) => (
        <InventoryCard key={item.product_id} item={item} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}
