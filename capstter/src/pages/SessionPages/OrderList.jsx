// src/pages/orders/OrderList.jsx
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import OverviewSection from "../../components/dashboard/OverviewSection";
import { OrderPopup } from "../../components/common/OrderPopup";
import { useOrders } from "../../hooks/useOrders";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FALLBACK = "/fallback.png";

export default function OrderList() {
  const {
    orders,
    meta,
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
  const [popupMode, setPopupMode] = useState(null); // 'view' | 'finish'
  const [currentPage, setCurrentPage] = useState(1);

  const list = Array.isArray(orders) ? orders : [];
  const totalPages = meta?.totalRows ? Math.ceil(meta.totalRows / meta.pageSize) : 1;

  // Load orders when page changes
  useEffect(() => {
    fetchOrders(currentPage);
  }, [fetchOrders, currentPage]);

  // Toast error when fetch fails
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const openPopup = (order, mode = "view") => {
    setSelectedOrder(order);
    setPopupMode(mode);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedOrder(null);
    setPopupMode(null);
  };

  return (
    <DashboardLayout>
            {/* Toast container */}
      <ToastContainer position="top-center" autoClose={3000} />
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
        {list.length === 0 && !loading && !error && (
          <div className="col-span-3 text-center text-gray-500">
            No orders found
          </div>
        )}

        {list.map((order) => (
          <div
            key={order.receiptNo ?? order.id}
            className="w-full bg-slate-300 rounded-lg shadow-lg p-6 space-y-6"
          >
            <div className="border-b pb-4">
              <div className="flex justify-between">
                <h2 className="font-semibold text-black text-2xl">Receipt No:</h2>
                <span className="text-red-600">
                  {order.receiptNo ?? order.id}
                </span>
              </div>

              <div className="mt-3">
                <h2 className="font-semibold text-black text-lg">Items</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(Array.isArray(order.items) ? order.items : []).map((item) => (
                    <img
                      key={item.id ?? item.productId ?? `${order.receiptNo}-${Math.random()}`}
                      src={item.picture || item.image || FALLBACK}
                      alt={item.productName || item.name || "product"}
                      className="w-32 h-32 object-cover rounded"
                    />
                  ))}
                </div>

                <span className="text-black">
                  {(Array.isArray(order.items) ? order.items : [])
                    .map((i) => i.productName ?? i.name ?? "")
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>

              <div className="flex justify-between mt-4">
                <h2 className="font-semibold text-black text-2xl">Total:</h2>
                <span className="text-gray font-bold text-2xl">
                  ₱{Number(order.total ?? order.total_amount ?? 0).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-700 text-white px-5 py-2 rounded hover:bg-gray-800"
                onClick={() => openPopup(order, "view")}
              >
                📋 View
              </button>

              <button
                className={`bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 ${
                  finishingId === order.id ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => openPopup(order, "finish")}
                disabled={finishingId === order.id}
              >
                Finish
              </button>

              <button
                className={`bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 ${
                  cancelingId === order.id ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={async () => {
                  try {
                    await cancelOrder(order.id);
                    toast.success(`Order ${order.receiptNo ?? order.id} canceled ❌`);
                  } catch (err) {
                    toast.error(`Failed to cancel order: ${err.message}`);
                  }
                }}
                disabled={cancelingId === order.id}
              >
                {cancelingId === order.id ? "⏳ Canceling..." : "Cancel"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-6">
          <button
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </button>

          <span className="px-2 py-2">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      )}

      {/* Popup */}
      <OrderPopup
        isOpen={isPopupOpen}
        onClose={closePopup}
        title={
          popupMode === "finish"
            ? `Review & Finish Order: ${selectedOrder?.receiptNo ?? selectedOrder?.id ?? ""}`
            : `Order Details: ${selectedOrder?.receiptNo ?? selectedOrder?.id ?? ""}`
        }
        closeOnOutside={popupMode !== "finish"}
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-700">Receipt:</div>
              <div className="font-semibold">{selectedOrder?.receiptNo ?? selectedOrder?.id}</div>
            </div>

            {(Array.isArray(selectedOrder.items) ? selectedOrder.items : []).map((item) => (
              <div key={item.id ?? item.productId} className="flex items-center gap-4">
                <img
                  src={item.picture || item.image || FALLBACK}
                  className="w-24 h-24 object-cover rounded"
                  alt={item.productName || item.name || "product"}
                />
                <div>
                  <p className="font-semibold">{item.productName ?? item.name}</p>
                  <p>Qty: {Number(item.quantity ?? 0)}</p>
                  <p>₱{Number(item.price ?? 0).toLocaleString()}</p>
                  <p className="font-medium">
                    Total: ₱{Number((item.quantity ?? 0) * (item.price ?? 0)).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}

            <div className="flex justify-between pt-2 border-t mt-2">
              <span className="font-semibold">Order Total</span>
              <span className="font-bold">
                ₱{Number(selectedOrder.total ?? selectedOrder.total_amount ?? 0).toLocaleString()}
              </span>
            </div>

            {popupMode === "finish" && (
              <div className="mt-4 space-y-3">
                <p className="text-sm text-gray-700">
                  Please review the items before finishing the order.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={closePopup}
                  >
                    Cancel
                  </button>
                  <button
                    className={`px-4 py-2 rounded text-white ${
                      finishingId === selectedOrder.id ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                    disabled={finishingId === selectedOrder.id}
                    onClick={async () => {
                      try {
                        await finishOrder(selectedOrder.id);
                        toast.success(`Order ${selectedOrder.receiptNo ?? selectedOrder.id} finished successfully ✅`);
                        closePopup();
                      } catch (err) {
                        toast.error(`Failed to finish order: ${err.message}`);
                      }
                    }}
                  >
                    {finishingId === selectedOrder.id ? "⏳ Finishing..." : "Confirm Finish"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </OrderPopup>

      <div className="mt-12">
        <OverviewSection />
      </div>


    </DashboardLayout>
  );
}
