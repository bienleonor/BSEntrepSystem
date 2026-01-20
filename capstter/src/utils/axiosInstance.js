import axios from "axios";
import { getToken, removeToken } from "./token";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Automatically attach token + business ID
axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  const businessId = localStorage.getItem("selectedBusinessId");

  console.log('sending request, businessId=', localStorage.getItem('selectedBusinessId'), 'token=', getToken());

  if (token) {  
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  if (businessId) {
    config.headers["X-Business-ID"] = businessId;
  }

 console.log('sending request, businessId=', localStorage.getItem('selectedBusinessId'), 'token=', getToken());

  return config;
});

// Handle expired tokens - redirect to login
// NOTE: Only 401 (Unauthorized) triggers logout
// 403 (Forbidden) means RBAC permission denied - user stays logged in
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired - logout and redirect
      console.log('Token expired or invalid, redirecting to login...');
      removeToken();
      localStorage.removeItem("user");
      localStorage.removeItem("businesses");
      localStorage.removeItem("selectedBusinessId");
      
      // Redirect to login page
      window.location.href = "/login";
    }
    
    // 403 = Permission denied (RBAC) - don't logout, just reject
    // The calling component should handle displaying the error
    if (error.response?.status === 403) {
      console.warn('Permission denied:', error.response?.data?.error || 'Forbidden');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;

