import { useState, useCallback } from "react";
import AxiosInstance from "../utils/axiosInstance";
import { getBusinessId } from "../utils/token";

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cancelingId, setCancelingId] = useState(null);
  const [finishingId, setFinishingId] = useState(null);

  const businessId = getBusinessId(); // IMPORTANT

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await AxiosInstance.get(`/orders/${businessId}`);
      setOrders(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  const cancelOrder = async (orderId) => {
    setCancelingId(orderId);
    try {
      await AxiosInstance.put(`/orders/cancel/${orderId}/${businessId}`);
      fetchOrders();
    } finally {
      setCancelingId(null);
    }
  };

  const finishOrder = async (orderId) => {
    setFinishingId(orderId);
    try {
      await AxiosInstance.put(`/orders/finish/${orderId}/${businessId}`);
      fetchOrders();
    } finally {
      setFinishingId(null);
    }
  };

  return {
    orders,
    loading,
    error,
    cancelingId,
    finishingId,
    fetchOrders,
    cancelOrder,
    finishOrder,
  };
}
