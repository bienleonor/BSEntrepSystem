// src/services/ordersApi.js
import axiosInstance from "../utils/axiosInstance";

export const ordersApi = {
  async getOrders() {
    const res = await axiosInstance.get(`/sales/orders`);
    return res.data;
  },

  async cancelOrder(purchaseId) {
    const res = await axiosInstance.delete(`/sales/orders/${purchaseId}`);
    return res.data;
  },

  async finishOrder(purchaseId) {
    const res = await axiosInstance.post(`/sales/orders/${purchaseId}/finish`);
    return res.data;
  },
};
