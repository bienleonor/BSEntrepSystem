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

export const deleteProductCategory = async (categoryId, businessId, token) => {
  try {
    const res = await axiosInstance.delete(
      `/inventory/product-categories/${categoryId}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        data: { businessId },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Failed to delete product category:", err);
    throw new Error(err?.response?.data?.message || "Failed to delete product category");
  }
};