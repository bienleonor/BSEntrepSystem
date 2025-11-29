import axiosInstance from "../utils/axiosInstance";

export const getInventory = async (businessId, token) => {
  try {
    const res = await axiosInstance.get(
      `/inventory/products/active/inventory-details/${businessId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (err) {
    console.error("Failed to fetch inventory:", err);
    throw new Error("Failed to fetch inventory");
  }
};

export const getInventoryTransactions = async () => {
  try {
    const res = await axiosInstance.get(`/inventory/adjust/transactions`);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch inventory transactions:", err);
    throw new Error("Failed to fetch inventory transactions");
  }
};