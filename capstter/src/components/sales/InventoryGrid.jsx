import React from "react";
import InventoryCard from "./InventoryCard";

export default function InventoryGrid({ inventory, onAddToCart, loading }) {
  if (!inventory.length && !loading)
    return <div className="text-gray-500">No inventory found</div>;

  return (
    <div className="max-h-[60vh] md:max-h-[70vh] lg:max-h-[700px] overflow-y-auto grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 rounded p-1 sm:p-2 hidden-scrollbar">
      {inventory.map((item) => (
        <InventoryCard key={item.product_id} item={item} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}
