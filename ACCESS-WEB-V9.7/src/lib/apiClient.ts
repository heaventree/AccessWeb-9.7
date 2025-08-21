import axios from 'axios';

// Create an axios instance with defaults
const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include access token in headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
  login: async (email: string, password: string, options?: any) => {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
      ...options
    });
    
    // Store tokens in localStorage after successful login
    if (response.data && response.data.success && response.data.token) {
      localStorage.setItem('accessToken', response.data.token);
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
    }
    
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    
    // Clear tokens from localStorage after logout
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
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

// User API calls
export const userApi = {
  // Update user profile
  updateProfile: async (userId: number, profileData: any) => {
    const response = await apiClient.put(`/v1/users/${userId}`, profileData);
    return response.data;
  },

  // Get user by ID
  getUser: async (userId: number) => {
    const response = await apiClient.get(`/v1/users/${userId}`);
    return response.data;
  },

  // Change user password
  changePassword: async (userId: number, passwordData: { currentPassword: string; newPassword: string }) => {
    const response = await apiClient.put(`/v1/users/${userId}/change-password`, passwordData);
    return response.data;
  }
};

export default apiClient;