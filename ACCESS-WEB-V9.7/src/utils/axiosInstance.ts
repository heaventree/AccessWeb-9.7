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
    
    // Enhanced network error handling
    if (error.request && !error.response) {
      // Check if CORS error
      if (error.message && error.message.includes('Network Error')) {
        console.error('CORS Error:', 'The request was blocked due to CORS policy. The website may not allow external testing.');
      }
      // Check if timeout error
      else if (error.code === 'ECONNABORTED' || (error.message && error.message.includes('timeout'))) {
        console.error('Timeout Error:', 'The connection to the server timed out. The website may be slow or unresponsive.');
      }
      // Check for SSL/TLS errors
      else if (error.message && (
        error.message.includes('SSL') || 
        error.message.includes('certificate') || 
        error.message.includes('CERT_') || 
        error.message.includes('SSL handshake')
      )) {
        console.error('SSL/TLS Error:', 'There was an issue with the website\'s SSL certificate or HTTPS configuration.');
      }
      // Generic network error
      else {
        console.error('Network Error:', 'Unable to reach the server. Please check your internet connection.');
      }
    }
    
    return Promise.reject(error);
  }
);