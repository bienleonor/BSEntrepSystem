// src/pages/orders/OrderList.jsx
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import OverviewSection from "../../components/dashboard/OverviewSection";
import { OrderPopup } from "../../components/common/OrderPopup";

import { useOrders } from "../../hooks/useOrders";

const FALLBACK = "/fallback.png";

export default function OrderList() {
  const {
    orders,
    loading,
    error,
    cancelingId,
    finishingId,
    fetchOrders,
    cancelOrder,
    finishOrder
  } = useOrders();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Load orders on mount
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const openPopup = (order) => {
    setSelectedOrder(order);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedOrder(null);
  };
  
  return (
    <DashboardLayout>
      <h1 className="text-4xl text-center text-white font-extrabold mb-10">
        🧾 Order List
      </h1>

      {loading && (
        <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
          Loading orders...
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="max-h-[700px] overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-6 p-2">
        {orders.length === 0 && !loading && !error && (
          <div className="col-span-3 text-center text-gray-500">
            No orders found
          </div>
        )}

        {orders.map((order) => (
          <div
            key={order.id}
            className="w-full bg-bronze rounded-lg shadow-lg p-6 space-y-6"
          >
            <div className="border-b pb-4">
              <div className="flex justify-between">
                <h2 className="font-semibold text-black text-lg">Order ID:</h2>
                <span className="text-red-600">{order.id}</span>
              </div>

              <div className="mt-3">
                <h2 className="font-semibold text-black text-lg">Items</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {order.items.map((item, i) => (
                    <img
                      key={i}
                      src={item.image || FALLBACK}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ))}
                </div>

                <span className="text-black">
                  {order.items.map((i) => i.name).join(", ")}
                </span>
              </div>

              <div className="flex justify-between mt-4">
                <h2 className="font-semibold text-black text-lg">Total:</h2>
                <span className="text-green-500 font-bold text-xl">
                  ₱{order.total.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-700 text-white px-5 py-2 rounded hover:bg-gray-800"
                onClick={() => openPopup(order)}
              >
                📋 View
              </button>

              <button
                className={`bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 ${
                  finishingId === order.id ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => finishOrder(order.id)}
                disabled={finishingId === order.id}
              >
                {finishingId === order.id ? "⏳ Finishing..." : "Finish"}
              </button>

              <button
                className={`bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 ${
                  cancelingId === order.id ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => cancelOrder(order.id)}
                disabled={cancelingId === order.id}
              >
                {cancelingId === order.id ? "⏳ Canceling..." : "Cancel"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Popup */}
      <OrderPopup
        isOpen={isPopupOpen}
        onClose={closePopup}
        title={`Order Details: ${selectedOrder?.id}`}
      >
        {selectedOrder && (
          <div className="space-y-4">
            {selectedOrder.items.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <img
                  src={item.image || FALLBACK}
                  className="w-24 h-24 object-cover rounded"
                />
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p>Qty: {item.quantity}</p>
                  <p>₱{item.price.toLocaleString()}</p>
                  <p className="font-medium">
                    Total: ₱{(item.quantity * item.price).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </OrderPopup>

      <div className="mt-12">
        <OverviewSection />
      </div>
    </DashboardLayout>
  );
}
