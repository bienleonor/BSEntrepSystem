// src/pages/OrderList.jsx
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import OverviewSection from "../../components/dashboard/OverviewSection";
import { OrderPopup } from "../../components/common/OrderPopup";

const SERVER = "http://localhost:5000";
const FALLBACK = "/fallback.png";

function normalizeImagePath(raw) {
  if (!raw) return FALLBACK;
  const s = String(raw);
  return s.startsWith("http") ? s : `${SERVER}/${s.replace(/^\/+/, "")}`;
}

export default function Orderlist() {
  const [orders, setOrders] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const businessId = localStorage.getItem("selectedBusinessId") || "";
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrdersAndInventory = async () => {
      if (!token) {
        setError("Missing auth token");
        return;
      }
      setLoading(true);
      setError(null);

      try {
        // fetch grouped orders (your controller returns groups by purchase_id)
        const ordersRes = await fetch(`${SERVER}/api/sales/businesses/${businessId}/orders`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!ordersRes.ok) {
          const body = await ordersRes.json().catch(() => ({}));
          throw new Error(body.error || `Orders fetch failed (${ordersRes.status})`);
        }
        const ordersData = await ordersRes.json();

        // If your backend already returns items with picture field, we only need to normalize paths.
        const normalizedOrders = (Array.isArray(ordersData) ? ordersData : []).map((order) => {
          // backend model uses purchaseId, items[].picture, items[].price, items[].quantity
          const purchaseId = order.purchaseId ?? order.purchase_id ?? order.id ?? "UNKNOWN";

          const itemsArray = Array.isArray(order.items) ? order.items : [];

          const enrichedItems = itemsArray.map((it) => ({
            product_purchase_item_id: it.id,
            name: it.name ?? it.product_name ?? "Unknown Item",
            quantity: Number(it.quantity ?? 0),
            price: Number(it.price ?? it.item_price ?? 0),
            image: normalizeImagePath(it.picture ?? it.localpath ?? it.picture_url ?? it.image ?? null),
            product_id: it.product_id ?? null,
          }));

          const totalFromServer = order.total ?? order.purchase_total ?? order.total_amount ?? null;
          const computedTotal =
            totalFromServer != null
              ? Number(totalFromServer)
              : enrichedItems.reduce((s, it) => s + it.quantity * it.price, 0);

          return {
            id: purchaseId,
            items: enrichedItems,
            total: computedTotal,
            image: enrichedItems[0]?.image || FALLBACK,
            raw: order,
          };
        });

        setOrders(normalizedOrders);
      } catch (err) {
        console.error("OrderList fetch error:", err);
        setError(err.message || "Failed to load orders");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersAndInventory();
  }, [token, businessId]);

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
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">🧾 Order List</h1>

      {loading && (
        <div className="mb-4 rounded border border-blue-100 bg-blue-50 px-4 py-3 text-blue-700">
          Loading orders...
        </div>
      )}

      {error && (
        <div className="mb-4 rounded border border-red-100 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <div className="max-h-[700px] overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-6 rounded p-2 hidden-scrollbar">
        {orders.length === 0 && !loading && !error && (
          <div className="col-span-1 md:col-span-3 text-center text-gray-500">No orders found</div>
        )}

        {orders.map((order) => (
          <div key={String(order.id)} className="w-full max-w-3xl bg-bronze shadow-lg rounded-lg p-6 space-y-6">
            <div className="border-b pb-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-gray-700">Order ID:</h2>
                <span className="text-gray-600">{order.id}</span>
              </div>

              <div className="flex-col items-center mb-2">
                <div className="flex-1 mb-1 flex items-center ">
                  <h2 className="text-lg font-semibold text-gray-700 text-center">Items</h2>
                </div>
                <div >
                <div className="flex gap-2 flex-wrap">
                  {order.items.map((item, idx) => (
                    <img
                      key={`${order.id}-img-${idx}`}
                      src={item.image || FALLBACK}
                      alt={item.name}
                      className="w-16 h-16 rounded object-cover"
                    />
                  ))}
                </div>


                <span className="text-gray-600">
                  {order.items.map((i) => i.name).join(", ")}
                </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-700">Total Amount:</h2>
                <span className="text-green-600 font-bold text-xl">
                  ₱{Number(order.total || 0).toLocaleString()}
                </span>
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

      <OrderPopup isOpen={isPopupOpen} onClose={handleClosePopup} title={`Order Details: ${selectedOrder?.id}`}>
        {selectedOrder && (
          <div className="space-y-4">
            {selectedOrder.items.map((item, idx) => (
              <div key={`${selectedOrder.id}-${item.product_id}-${idx}`} className="flex items-center gap-4">
                <img src={item.image || FALLBACK} alt={item.name} className="w-24 h-24 rounded object-cover" />
                <div>
                  <p className="text-base font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  <p className="text-sm text-gray-600">₱{Number(item.price).toLocaleString()}</p>
                  <p className="text-sm font-medium text-gray-800">
                    Line total: ₱{Number(item.quantity * item.price).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}

            <div className="mt-4 border-t pt-4">
              <p className="text-lg font-semibold">Total: ₱{Number(selectedOrder.total).toLocaleString()}</p>
            </div>
          </div>
        )}
      </OrderPopup>

      <div className="mt-12">
        <OverviewSection />
      </div>
    </DashboardLayout>
  );
}
