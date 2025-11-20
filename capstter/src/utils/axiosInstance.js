import axios from "axios";
import { getToken } from "./token";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Automatically attach token + business ID
axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  const businessId = localStorage.getItem("selectedBusinessId");

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  if (businessId) {
    config.headers["X-Business-ID"] = businessId;
  }

  return config;
});

export default axiosInstance;
