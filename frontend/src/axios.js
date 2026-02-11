import axios from "axios";

// Get API URL from environment or use default based on environment
const getBaseURL = () => {
  // Check for VITE_API_URL environment variable (set in .env.local or Vercel)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // In development, use localhost
  if (import.meta.env.DEV) {
    return "http://localhost:5000";
  }
  
  // In production, use current origin
  return window.location.origin;
};

const instant = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,  // Ensure cookies are sent with requests
});

// Add response interceptor for better error handling
instant.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth on 401
      localStorage.removeItem('email');
      localStorage.removeItem('name');
    }
    return Promise.reject(error);
  }
);

export default instant;