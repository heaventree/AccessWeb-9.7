import axios from 'axios';

// Create an Axios instance with common configuration
export const api = axios.create({
  // In a real production environment, you would set this to your API URL
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://api.accessibilitychecker.app/api/v1'
    : 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add a request interceptor to include auth token in every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common error scenarios
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      // Clear invalid tokens
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      
      // Redirect to login page if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      }
    }
    
    return Promise.reject(error);
  }
);

// Typed helper functions for API endpoints
export const authApi = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  register: async (userData: { email: string; password: string; name: string }) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  verifyEmail: async (token: string) => {
    try {
      const response = await api.post('/auth/verify-email', { token });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  forgotPassword: async (email: string) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  resetPassword: async (token: string, newPassword: string) => {
    try {
      const response = await api.post('/auth/reset-password', { token, newPassword });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  refreshToken: async () => {
    try {
      const response = await api.post('/auth/refresh-token');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  me: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export const userApi = {
  updateProfile: async (userData: { name?: string; email?: string; }) => {
    try {
      const response = await api.put('/users/profile', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    try {
      const response = await api.put('/users/password', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getSubscription: async () => {
    try {
      const response = await api.get('/users/subscription');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export const oauthApi = {
  google: async (code: string) => {
    try {
      const response = await api.post('/auth/oauth/google', { code });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  github: async (code: string) => {
    try {
      const response = await api.post('/auth/oauth/github', { code });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  microsoft: async (code: string) => {
    try {
      const response = await api.post('/auth/oauth/microsoft', { code });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export const paymentApi = {
  getPlans: async () => {
    try {
      const response = await api.get('/payments/plans');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  subscribe: async (planId: string) => {
    try {
      const response = await api.post('/payments/subscribe', { planId });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  createCheckoutSession: async (planId: string) => {
    try {
      const response = await api.post('/payments/create-checkout-session', { planId });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  createPortalSession: async () => {
    try {
      const response = await api.post('/payments/create-portal-session');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getInvoices: async () => {
    try {
      const response = await api.get('/payments/invoices');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default api;