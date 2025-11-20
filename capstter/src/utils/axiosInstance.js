import axios from "axios";
import { getToken } from "./token";

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

export default axiosInstance;
