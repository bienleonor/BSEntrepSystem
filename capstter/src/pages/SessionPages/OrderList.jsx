import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import OverviewSection from "../../components/dashboard/OverviewSection";
import { OrderPopup } from "../../components/common/OrderPopup";

const dummyOrders = [
  {
    id: "001",
    items: ["Item A", "Item B", "Item C"],
    image: "https://3.bp.blogspot.com/-DXRsJa2pAwE/WGN4MplQwBI/AAAAAAAAAs4/JG0M9fpWINQrV_Cj923A2XviJ-GBGe_EQCLcB/s1600/screen-shot-2013-06-02-at-14-30-01.png",
    total: 1500,
  },
  {
    id: "002",
    items: ["Item D", "Item E"],
    image: "https://aphrodite.gmanetwork.com/entertainment/articles/900_675_1_-20230720134140.jpg",
    total: 980,
  },
  {
    id: "003",
    items: ["Item F", "Item G", "Item H", "Item I"],
    image: "https://images.unsplash.com/photo-1606813902914-1c3b6c2b1f3f",
    total: 2450,
  },
];

export default function Orderlist() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleOpenPopup = (order) => {
    setSelectedOrder(order);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedOrder(null);
  };

  return (
    <DashboardLayout>
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
        🧾 Order List
      </h1>

      <div className="mb-10 flex gap-8 flex-row justify-center">
        {dummyOrders.map((order) => (
          <div key={order.id} className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 space-y-6">
            <div className="border-b pb-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-gray-700">Order ID:</h2>
                <span className="text-gray-600">{order.id}</span>
              </div>
              <div className="flex items-center mb-2">
                <h2 className="text-lg font-semibold text-gray-700 mr-2">Items:</h2>
                <img src={order.image} alt="Item preview" className="w-24 h-24 rounded mr-2" />
                <span className="text-gray-600">{order.items.join(", ")}</span>
              </div>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-700">Total Amount:</h2>
                <span className="text-green-600 font-bold text-xl">₱{order.total.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-700 hover:bg-gray-800 text-white font-medium px-5 py-2 rounded transition"
                onClick={() => handleOpenPopup(order)}
              >
                📋 View Details
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded transition">
                ✅ Finish Order
              </button>
              <button className="bg-red-500 hover:bg-red-600 text-white font-medium px-5 py-2 rounded transition">
                ❌ Cancel Order
              </button>
            </div>
          </div>
        ))}
      </div>

      <OrderPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        title={`Order Details: ${selectedOrder?.id}`}
      >
        {selectedOrder && (
          <div className="space-y-2">
            <p><strong>Items:</strong> {selectedOrder.items.join(", ")}</p>
            <p><strong>Total:</strong> ₱{selectedOrder.total.toLocaleString()}</p>
            <img src={selectedOrder.image} alt="Order item" className="w-full rounded mt-2" />
          </div>
        )}
      </OrderPopup>

      <div className="mt-12">
        <OverviewSection />
      </div>
    </DashboardLayout>
  );
}
