import axios from 'axios';

// Create an axios instance with defaults
const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication API calls
export const authApi = {
  // Register a new user
  register: async (email: string, password: string, name?: string) => {
    const response = await apiClient.post('/auth/register', {
      email,
      password,
      name
    });
    return response.data;
  },

  // Login user
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', {
      email,
      password
    });
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      // Return null if user is not authenticated
      return { user: null };
    }
  }
};

export default apiClient;