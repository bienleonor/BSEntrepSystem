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
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token is invalid or expired
      console.log('Token expired or invalid, redirecting to login...');
      removeToken();
      localStorage.removeItem("user");
      localStorage.removeItem("businesses");
      localStorage.removeItem("selectedBusinessId");
      
      // Redirect to login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
