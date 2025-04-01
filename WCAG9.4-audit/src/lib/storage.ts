import localforage from 'localforage';

// Initialize storage
const storage = localforage.createInstance({
  name: 'app-storage',
  version: 1.0,
  storeName: 'app-store'
});

// Export storage service
export const storageService = {
  // Settings
  getSettings: async () => {
    return storage.getItem('settings') || {};
  },
  
  saveSettings: async (settings: any) => {
    return storage.setItem('settings', settings);
  },

  // User data
  getUser: async () => {
    return storage.getItem('user');
  },

  saveUser: async (user: any) => {
    return storage.setItem('user', user);
  },

  // Auth
  getAuthToken: async () => {
    return storage.getItem('auth_token');
  },

  saveAuthToken: async (token: string) => {
    return storage.setItem('auth_token', token);
  },

  // Clear all data
  clearAll: async () => {
    return storage.clear();
  },

  // Storage methods
  getItem: async <T>(key: string): Promise<T | null> => {
    return storage.getItem<T>(key);
  },

  setItem: async <T>(key: string, value: T): Promise<T> => {
    await storage.setItem(key, value);
    return value;
  },

  removeItem: async (key: string): Promise<void> => {
    return storage.removeItem(key);
  }
};