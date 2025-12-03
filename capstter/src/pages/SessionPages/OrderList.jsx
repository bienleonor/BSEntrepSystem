// src/pages/orders/OrderList.jsx
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import OverviewSection from "../../components/dashboard/OverviewSection";
import { OrderPopup } from "../../components/common/OrderPopup";
import { useOrders } from "../../hooks/useOrders";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FALLBACK = "/fallback.png";

// Mini Carousel Component - Full Background Version
const MiniCarousel = ({ items = [], children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images = items.map(item => ({
    src: item.picture || item.image || FALLBACK,
    name: item.productName || item.name || "product"
  }));

  // Auto-slide when not hovered
  useEffect(() => {
    if (images.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length, isHovered]);

  const goTo = (index) => setCurrentIndex(index);
  const goPrev = () => setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
  const goNext = () => setCurrentIndex(prev => (prev + 1) % images.length);

  return (
    <div 
      className="relative h-full w-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Images */}
      {images.length > 0 ? (
        <div 
          className="absolute inset-0 flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((img, idx) => (
            <div key={idx} className="relative w-full h-full flex-shrink-0">
              <img
                src={img.src}
                alt={img.name}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="absolute inset-0 bg-slate-800" />
      )}

      {/* Dark gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

      {/* Navigation Arrows (show on hover) */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); goPrev(); }}
            className={`absolute left-2 top-1/3 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm text-white/80 flex items-center justify-center transition-all ${isHovered ? 'opacity-100' : 'opacity-0'} hover:bg-white/20`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); goNext(); }}
            className={`absolute right-2 top-1/3 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm text-white/80 flex items-center justify-center transition-all ${isHovered ? 'opacity-100' : 'opacity-0'} hover:bg-white/20`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); goTo(idx); }}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentIndex 
                  ? 'bg-white w-5' 
                  : 'bg-white/40 w-1.5 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none [&>*]:pointer-events-auto">
        {children}
      </div>
    </div>
  );
};

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
  const [popupMode, setPopupMode] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const list = Array.isArray(orders) ? orders : [];
  const totalPages = meta?.totalRows ? Math.ceil(meta.totalRows / meta.pageSize) : 1;

  useEffect(() => {
    fetchOrders(currentPage);
  }, [fetchOrders, currentPage]);

  useEffect(() => {
    if (error) toast.error(error);
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

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-400", label: "Pending" },
      completed: { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-400", label: "Completed" },
      cancelled: { bg: "bg-rose-50", text: "text-rose-600", dot: "bg-rose-400", label: "Cancelled" },
      processing: { bg: "bg-sky-50", text: "text-sky-600", dot: "bg-sky-400", label: "Processing" },
    };
    const s = statusMap[status?.toLowerCase()] || statusMap.pending;
    return (
      <span className={`${s.bg} ${s.text} inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full`}>
        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></span>
        {s.label}
      </span>
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <DashboardLayout>
      <ToastContainer position="top-center" autoClose={3000} />
      
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white/90 tracking-tight">
            Order List
          </h1>
          <p className="mt-2 text-white/60 text-sm sm:text-base">
            Manage and track all your orders
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-white/30 border-t-white"></div>
            <span className="ml-4 text-white font-medium">Loading orders...</span>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-rose-500/20 border border-rose-400/30 text-rose-100 px-5 py-4 rounded-xl backdrop-blur-sm">
            {error}
          </div>
        )}

        {/* Orders Grid - Box Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {list.map((order) => (
            <div 
              key={order.receiptNo ?? order.id} 
              className="group rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-72 sm:h-80"
            >
              <MiniCarousel items={order.items || []}>
                {/* Top Section - Status & Item Count */}
                <div className="flex items-start justify-between">
                  {getStatusBadge(order.status)}
                  {(order.items?.length || 0) > 1 && (
                    <span className="bg-black/30 backdrop-blur-sm text-white/90 text-[10px] font-medium px-2 py-1 rounded-full">
                      {order.items.length} items
                    </span>
                  )}
                </div>

                {/* Bottom Section - Details & Actions */}
                <div className="space-y-3">
                  {/* Receipt & Total */}
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-white/50 font-medium">Receipt</p>
                      <p className="text-xl font-bold text-white tracking-tight">
                        #{order.receiptNo ?? order.id}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wider text-white/50 font-medium">Total</p>
                      <p className="text-2xl font-bold text-white">
                        ₱{Number(order.total ?? order.total_amount ?? 0).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Date & Items */}
                  <div className="flex items-center justify-between text-white/60 text-xs">
                    <span>{formatDate(order.createdAt ?? order.created_at)}</span>
                    <span className="truncate max-w-[60%] text-right">
                      {(Array.isArray(order.items) ? order.items : [])
                        .map((i) => i.productName ?? i.name ?? "")
                        .filter(Boolean)
                        .slice(0, 2)
                        .join(", ") || "No items"}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      className="px-3 py-2.5 rounded-lg text-xs font-medium bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors border border-white/10"
                      onClick={() => openPopup(order, "view")}
                    >
                      View
                    </button>
                    <button
                      className={`px-3 py-2.5 rounded-lg text-xs font-medium bg-indigo-500/20 backdrop-blur-sm text-indigo-200 hover:bg-indigo-500/30 transition-colors border border-indigo-400/20 ${
                        finishingId === order.id ? "opacity-60 cursor-wait" : ""
                      }`}
                      onClick={() => openPopup(order, "finish")}
                      disabled={finishingId === order.id}
                    >
                      Finish
                    </button>
                    <button
                      className={`px-3 py-2.5 rounded-lg text-xs font-medium bg-rose-500/20 backdrop-blur-sm text-rose-200 hover:bg-rose-500/30 transition-colors border border-rose-400/20 ${
                        cancelingId === order.id ? "opacity-60 cursor-wait" : ""
                      }`}
                      onClick={async () => {
                        try {
                          await cancelOrder(order.id);
                          toast.success("Order cancelled");
                        } catch (err) {
                          toast.error(`Failed: ${err.message}`);
                        }
                      }}
                      disabled={cancelingId === order.id}
                    >
                      {cancelingId === order.id ? "..." : "Cancel"}
                    </button>
                  </div>
                </div>
              </MiniCarousel>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {list.length === 0 && !loading && (
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-12 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-slate-700 flex items-center justify-center">
              <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-base font-medium text-slate-200 mb-1">No orders found</h3>
            <p className="text-slate-400 text-sm">Orders will appear here once created</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              className="px-5 py-2.5 bg-slate-800/80 backdrop-blur-sm rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700/50"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              ← Previous
            </button>
            <div className="px-5 py-2.5 bg-slate-700/50 backdrop-blur-sm rounded-xl text-sm font-medium text-slate-200">
              {currentPage} / {totalPages}
            </div>
            <button
              className="px-5 py-2.5 bg-slate-800/80 backdrop-blur-sm rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700/50"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Popup */}
      <OrderPopup
        isOpen={isPopupOpen}
        onClose={closePopup}
        title={popupMode === "finish" ? "Finish Order" : "Order Details"}
        closeOnOutside={popupMode !== "finish"}
      >
        {selectedOrder && (
          <div className="space-y-5">
            {/* Header Info */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">Receipt No</p>
                <p className="text-xl font-bold text-slate-100 tracking-tight">
                  #{selectedOrder?.receiptNo ?? selectedOrder?.id}
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  {formatDate(selectedOrder?.createdAt ?? selectedOrder?.created_at)}
                </p>
              </div>
              {getStatusBadge(selectedOrder?.status)}
            </div>

            {/* Items */}
            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">Items</p>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {(Array.isArray(selectedOrder.items) ? selectedOrder.items : []).map((item, idx) => (
                  <div 
                    key={item.id ?? item.productId ?? idx} 
                    className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg border border-slate-600/30"
                  >
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.picture || item.image || FALLBACK}
                        className="w-full h-full object-cover"
                        alt={item.productName || item.name || "product"}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-200 truncate">{item.productName ?? item.name}</p>
                      <p className="text-sm text-slate-400">
                        {Number(item.quantity ?? 0)} × ₱{Number(item.price ?? 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-slate-200">
                        ₱{Number((item.quantity ?? 0) * (item.price ?? 0)).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center py-4 border-t border-dashed border-slate-600/50">
              <span className="text-sm uppercase tracking-wider text-slate-400 font-medium">Order Total</span>
              <span className="text-2xl font-bold text-slate-100">
                ₱{Number(selectedOrder.total ?? selectedOrder.total_amount ?? 0).toLocaleString()}
              </span>
            </div>

            {/* Finish Actions */}
            {popupMode === "finish" && (
              <div className="flex justify-end gap-3 pt-2">
                <button
                  className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-lg transition-colors"
                  onClick={closePopup}
                >
                  Cancel
                </button>
                <button
                  className={`px-5 py-2.5 rounded-lg text-white font-medium transition-all ${
                    finishingId === selectedOrder.id 
                      ? "bg-indigo-400 cursor-not-allowed" 
                      : "bg-indigo-500 hover:bg-indigo-600"
                  }`}
                  disabled={finishingId === selectedOrder.id}
                  onClick={async () => {
                    try {
                      await finishOrder(selectedOrder.id);
                      toast.success("Order finished successfully");
                      closePopup();
                    } catch (err) {
                      toast.error(`Failed: ${err.message}`);
                    }
                  }}
                >
                  {finishingId === selectedOrder.id ? "Processing..." : "Confirm Finish"}
                </button>
              </div>
            )}
          </div>
        )}
      </OrderPopup>

      <div className="mt-10 px-4 sm:px-6 lg:px-8">
        <OverviewSection />
      </div>
    </DashboardLayout>
  );
}
