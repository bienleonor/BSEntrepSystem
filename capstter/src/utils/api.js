import axiosInstance from "./axiosInstance.jsx";

/**
 * Legacy fetch API wrapper - DEPRECATED
 * Use axiosInstance directly instead
 * 
 * axiosInstance automatically handles:
 * - Authorization tokens
 * - Business ID headers
 * - Environment-based API URLs
 * - Error handling and toast notifications
 */

// ===== INVENTORY =====
export const getInventory = async (businessId) => {
  try {
    const res = await axiosInstance.get(
      `/inventory/products/active/inventory-details/${businessId}`
    );
    return res.data;
  } catch (error) {
    console.error("Failed to fetch inventory:", error);
    throw error;
  }
};

// ===== SALES =====
export const createSale = async (saleData) => {
  try {
    const res = await axiosInstance.post("/sales/create", saleData);
    return res.data;
  } catch (error) {
    console.error("Failed to create sale:", error);
    throw error;
  }
};

// Export axiosInstance for direct usage
export default axiosInstance;
