import axios from 'axios';

// Create an axios instance with default configuration
export const axiosInstance = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include authentication token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to the Authorization header
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login page
      if (window.location.pathname !== '/login') {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      }
    }
    
    // Handle 403 Forbidden errors (insufficient permissions)
    if (error.response && error.response.status === 403) {
      console.error('Access forbidden:', error.response.data.error || 'You do not have permission to access this resource');
    }
    
    // Handle 500 and other server errors
    if (error.response && error.response.status >= 500) {
      console.error('Server error:', error.response.data.error || 'An unexpected server error occurred');
    }
    
    // Handle network errors
    if (error.request && !error.response) {
      console.error('Network error:', 'Unable to reach the server. Please check your internet connection.');
    }
    
    return Promise.reject(error);
  }
);