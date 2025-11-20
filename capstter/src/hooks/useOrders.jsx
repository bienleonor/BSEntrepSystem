// src/hooks/useOrders.jsx
import { useState, useCallback } from "react";
import AxiosInstance from "../utils/axiosInstance";
import { getBusinessId } from "../utils/token";

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pageSize: 25, totalRows: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cancelingId, setCancelingId] = useState(null);
  const [finishingId, setFinishingId] = useState(null);

  const businessId = getBusinessId();

  const fetchOrders = useCallback(async (page = 1, pageSize = 25) => {
    setLoading(true);
    setError(null);

    try {
      const res = await AxiosInstance.get(
        `/sales/businesses/${businessId}/orders?page=${page}&pageSize=${pageSize}`
      );

      setOrders(res.data.orders ?? []);
      setMeta(res.data.meta ?? { page, pageSize, totalRows: 0 });
    } catch (err) {
      console.error("fetchOrders error:", err);
      setError(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  const cancelOrder = async (orderId) => {
    setCancelingId(orderId);
    try {
      await AxiosInstance.delete(`/sales/businesses/${businessId}/orders/${orderId}`);
      await fetchOrders(meta.page);
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setCancelingId(null);
    }
  };

  const finishOrder = async (orderId) => {
    setFinishingId(orderId);
    try {
      await AxiosInstance.post(`/sales/businesses/${businessId}/orders/${orderId}/finish`);
      // Optimistic UI: remove locally instead of refetch
      setOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setFinishingId(null);
    }
  };

  return {
    orders,
    meta,
    loading,
    error,
    cancelingId,
    finishingId,
    fetchOrders,
    cancelOrder,
    finishOrder,
  };
}
