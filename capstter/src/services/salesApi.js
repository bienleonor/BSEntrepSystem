import axiosInstance from "../utils/axiosInstance";

export const createSale = async (saleData) => {
  const res = await axiosInstance.post("/sales/create", saleData);
  return res.data;
};
