import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// Base API configuration
const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.accessibilitychecker.app/api/v1'
  : 'http://localhost:5000/api';

// Create API instance with authentication
const createAuthenticatedApi = (): AxiosInstance => {
  const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add auth token
  api.interceptors.request.use((config: AxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return api;
};

// Authentication API
export const authApi = {
  // Register a new user
  async register(userData: { email: string; password: string; name: string }) {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  },

  // Login a user
  async login(email: string, password: string) {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
  },

  // Get current user information
  async me() {
    const api = createAuthenticatedApi();
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Verify email address
  async verifyEmail(token: string) {
    const response = await axios.post(`${API_URL}/auth/verify-email`, { token });
    return response.data;
  },

  // Request password reset
  async forgotPassword(email: string) {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
    return response.data;
  },

  // Reset password with token
  async resetPassword(token: string, newPassword: string) {
    const response = await axios.post(`${API_URL}/auth/reset-password`, {
      token,
      newPassword
    });
    return response.data;
  },

  // Logout
  async logout() {
    const api = createAuthenticatedApi();
    const response = await api.post('/auth/logout');
    return response.data;
  }
};

// User API
export const userApi = {
  // Update user profile
  async updateProfile(userData: { name?: string; email?: string }) {
    const api = createAuthenticatedApi();
    const response = await api.put('/users/profile', userData);
    return response.data;
  },

  // Change password
  async changePassword(passwords: { currentPassword: string; newPassword: string }) {
    const api = createAuthenticatedApi();
    const response = await api.put('/users/password', passwords);
    return response.data;
  },

  // Delete account
  async deleteAccount() {
    const api = createAuthenticatedApi();
    const response = await api.delete('/users/account');
    return response.data;
  }
};

// Payments API (Stripe)
export const paymentsApi = {
  // Get available subscription plans
  async getPlans() {
    const api = createAuthenticatedApi();
    const response = await api.get('/payments/plans');
    return response.data;
  },

  // Create checkout session
  async createCheckoutSession(planId: string, successUrl: string, cancelUrl: string) {
    const api = createAuthenticatedApi();
    const response = await api.post('/payments/create-checkout-session', {
      planId,
      successUrl,
      cancelUrl
    });
    return response.data;
  },

  // Create billing portal session
  async createBillingPortalSession(returnUrl: string) {
    const api = createAuthenticatedApi();
    const response = await api.post('/payments/create-portal-session', { returnUrl });
    return response.data;
  },

  // Get current subscription
  async getCurrentSubscription() {
    const api = createAuthenticatedApi();
    const response = await api.get('/payments/subscription');
    return response.data;
  },

  // Get invoices
  async getInvoices() {
    const api = createAuthenticatedApi();
    const response = await api.get('/payments/invoices');
    return response.data;
  },

  // Cancel subscription
  async cancelSubscription() {
    const api = createAuthenticatedApi();
    const response = await api.post('/payments/cancel-subscription');
    return response.data;
  },

  // Reactivate subscription
  async reactivateSubscription() {
    const api = createAuthenticatedApi();
    const response = await api.post('/payments/reactivate-subscription');
    return response.data;
  },

  // Check session status
  async checkSessionStatus(sessionId: string) {
    const api = createAuthenticatedApi();
    const response = await api.get(`/payments/session-status/${sessionId}`);
    return response.data;
  }
};

// Feedback API
export const feedbackApi = {
  // Get all feedback items
  async getFeedbackItems() {
    const api = createAuthenticatedApi();
    const response = await api.get('/feedback');
    return response.data;
  },

  // Create feedback item
  async createFeedbackItem(feedback: {
    page: string;
    elementPath: string;
    position: { x: number; y: number };
    comment: string;
    category: string;
  }) {
    const api = createAuthenticatedApi();
    const response = await api.post('/feedback', feedback);
    return response.data;
  },

  // Update feedback item
  async updateFeedbackItem(id: string, updates: {
    comment?: string;
    status?: string;
    category?: string;
  }) {
    const api = createAuthenticatedApi();
    const response = await api.put(`/feedback/${id}`, updates);
    return response.data;
  },

  // Delete feedback item
  async deleteFeedbackItem(id: string) {
    const api = createAuthenticatedApi();
    const response = await api.delete(`/feedback/${id}`);
    return response.data;
  }
};

// Export the API creator for custom endpoints
export { createAuthenticatedApi };