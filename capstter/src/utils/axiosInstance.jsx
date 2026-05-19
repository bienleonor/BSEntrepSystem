import axios from "axios";
import { toast } from "react-toastify";

// Base API URL from environment variable or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// ===== REQUEST INTERCEPTOR =====
// Attach Authorization token and Business ID to every request
axiosInstance.interceptors.request.use(
  (config) => {
    // Add Authorization token if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Add Business ID header if available
    const businessId = localStorage.getItem("selectedBusinessId");
    if (businessId) {
      config.headers["X-Business-ID"] = businessId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ===== RESPONSE INTERCEPTOR =====
// Handle errors and token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    // 401 – Token expired or invalid
    if (status === 401) {
      console.warn("Token expired or invalid, redirecting to login...");
      
      // Clear user data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("businesses");
      localStorage.removeItem("selectedBusinessId");
      
      // Redirect to login
      window.location.href = "/login";
      toast.error("Session expired. Please log in again.");
    } 
    // 403 – Permission denied (RBAC) - user stays logged in
    else if (status === 403) {
      console.warn("Permission denied:", errorMessage);
      toast.error(`Access denied: ${errorMessage}`);
    } 
    // Other errors
    else {
      console.error("API Error:", { status, message: errorMessage });
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
