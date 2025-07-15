/**
 * API Configuration
 * 
 * Centralized configuration for all API endpoints using environment variables
 */

// API Base URLs from environment variables
export const API_CONFIG = {
  // Main API server
  BASE_URL: import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' && window.location.origin.includes('replit.dev') ? `${window.location.protocol}//${window.location.hostname}:3001` : 'http://localhost:3001'),
  
  // WCAG Testing API
  WCAG_URL: import.meta.env.VITE_WCAG_API_URL || (typeof window !== 'undefined' && window.location.origin.includes('replit.dev') ? `${window.location.protocol}//${window.location.hostname}:3001` : 'http://localhost:3001'),
  
  // External APIs
  EXTERNAL_API: import.meta.env.VITE_EXTERNAL_API_URL || 'https://api.accessibility-checker.org',
  
  // Environment info
  NODE_ENV: import.meta.env.VITE_NODE_ENV || 'development',
  
  // Development mode check
  get isDevelopment() {
    return this.NODE_ENV === 'development';
  },
  
  // Production mode check
  get isProduction() {
    return this.NODE_ENV === 'production';
  }
};

// API Endpoints
export const API_ENDPOINTS = {
  // WCAG endpoints
  WCAG_SCAN: `${API_CONFIG.WCAG_URL}/api/wcag-test/scan`,
  WCAG_REPORT: `${API_CONFIG.WCAG_URL}/api/wcag-test/report`,
  WCAG_TEST: `${API_CONFIG.WCAG_URL}/api/wcag-test`,
  
  // Main API endpoints
  AUTH: `${API_CONFIG.BASE_URL}/api/auth`,
  USERS: `${API_CONFIG.BASE_URL}/api/users`,
  SUBSCRIPTIONS: `${API_CONFIG.BASE_URL}/api/subscriptions`,
  
  // External endpoints
  EXTERNAL_SCAN: `${API_CONFIG.EXTERNAL_API}/scan`,
};

export default API_CONFIG;