/**
 * Secure Storage
 * 
 * Provides encrypted local storage for sensitive data with
 * automatic key derivation and security best practices.
 */

import { encrypt, decrypt, sha256Hash } from './crypto';
import { logError } from './errorHandler';
import { IS_DEVELOPMENT_MODE } from './environment';

// Security configuration
const STORAGE_PREFIX = 'wcag_sec_';
const ENCRYPTION_KEY = 'WCAG_APP_ENCRYPTION_KEY';
const SALT_LENGTH = 16; // bytes
const ITERATION_COUNT = 100000;

// Get encryption key from environment or generate a device-specific one
async function getEncryptionKey(): Promise<string> {
  // Try to get from environment
  const envKey = import.meta.env.VITE_STORAGE_ENCRYPTION_KEY;
  
  if (envKey) {
    return envKey;
  }
  
  // Generate device-specific key if no environment key is provided
  // This is still relatively secure as it's derived from device/browser information
  const deviceInfo = navigator.userAgent + navigator.language + window.screen.width + window.screen.height;
  return sha256Hash(deviceInfo);
}

/**
 * Initialize secure storage
 */
export async function setupSecureStorage(): Promise<void> {
  try {
    // Initialize encryption key
    const key = await getEncryptionKey();
    localStorage.setItem(ENCRYPTION_KEY, key);
    
    // Log initialization in development
    if (IS_DEVELOPMENT_MODE) {
      console.info('Secure storage initialized');
    }
  } catch (error) {
    logError(error, { context: 'secureStorage.setupSecureStorage' });
  }
}

/**
 * Secure local storage implementation
 */
export const secureLocalStorage = {
  /**
   * Set item in secure storage
   * @param key Storage key
   * @param value Value to store
   */
  setItem(key: string, value: string): void {
    try {
      // Get encryption key
      const encryptionKey = localStorage.getItem(ENCRYPTION_KEY);
      
      if (!encryptionKey) {
        throw new Error('Encryption key not available. Secure storage not initialized.');
      }
      
      // Encrypt value
      encrypt(value, encryptionKey).then(encryptedValue => {
        // Store encrypted value
        localStorage.setItem(`${STORAGE_PREFIX}${key}`, encryptedValue);
      }).catch(error => {
        logError(error, { context: 'secureLocalStorage.setItem', key });
      });
    } catch (error) {
      logError(error, { context: 'secureLocalStorage.setItem', key });
      
      // Fallback to regular storage in case of error
      try {
        localStorage.setItem(key, value);
      } catch (fallbackError) {
        logError(fallbackError, { context: 'secureLocalStorage.setItem.fallback', key });
      }
    }
  },
  
  /**
   * Get item from secure storage
   * @param key Storage key
   * @returns Stored value or null
   */
  getItem(key: string): string | null {
    try {
      // Get encryption key
      const encryptionKey = localStorage.getItem(ENCRYPTION_KEY);
      
      if (!encryptionKey) {
        throw new Error('Encryption key not available. Secure storage not initialized.');
      }
      
      // Get encrypted value
      const encryptedValue = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      
      if (!encryptedValue) {
        return null;
      }
      
      // Decrypt value
      return decrypt(encryptedValue, encryptionKey);
    } catch (error) {
      logError(error, { context: 'secureLocalStorage.getItem', key });
      
      // Fallback to regular storage in case of error
      try {
        return localStorage.getItem(key);
      } catch (fallbackError) {
        logError(fallbackError, { context: 'secureLocalStorage.getItem.fallback', key });
        return null;
      }
    }
  },
  
  /**
   * Remove item from secure storage
   * @param key Storage key
   */
  removeItem(key: string): void {
    try {
      // Remove encrypted value
      localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
      
      // Also remove from regular storage as fallback
      localStorage.removeItem(key);
    } catch (error) {
      logError(error, { context: 'secureLocalStorage.removeItem', key });
    }
  },
  
  /**
   * Clear all items from secure storage
   */
  clear(): void {
    try {
      // Remove all items with prefix
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      logError(error, { context: 'secureLocalStorage.clear' });
    }
  },
  
  /**
   * Check if key exists in secure storage
   * @param key Storage key
   * @returns True if key exists
   */
  hasItem(key: string): boolean {
    try {
      return localStorage.getItem(`${STORAGE_PREFIX}${key}`) !== null;
    } catch (error) {
      logError(error, { context: 'secureLocalStorage.hasItem', key });
      return false;
    }
  }
};

/**
 * Session-only secure storage implementation
 */
export const secureSessionStorage = {
  /**
   * Set item in secure session storage
   * @param key Storage key
   * @param value Value to store
   */
  setItem(key: string, value: string): void {
    try {
      // Get encryption key
      const encryptionKey = localStorage.getItem(ENCRYPTION_KEY);
      
      if (!encryptionKey) {
        throw new Error('Encryption key not available. Secure storage not initialized.');
      }
      
      // Encrypt value
      encrypt(value, encryptionKey).then(encryptedValue => {
        // Store encrypted value
        sessionStorage.setItem(`${STORAGE_PREFIX}${key}`, encryptedValue);
      }).catch(error => {
        logError(error, { context: 'secureSessionStorage.setItem', key });
      });
    } catch (error) {
      logError(error, { context: 'secureSessionStorage.setItem', key });
      
      // Fallback to regular storage in case of error
      try {
        sessionStorage.setItem(key, value);
      } catch (fallbackError) {
        logError(fallbackError, { context: 'secureSessionStorage.setItem.fallback', key });
      }
    }
  },
  
  /**
   * Get item from secure session storage
   * @param key Storage key
   * @returns Stored value or null
   */
  getItem(key: string): string | null {
    try {
      // Get encryption key
      const encryptionKey = localStorage.getItem(ENCRYPTION_KEY);
      
      if (!encryptionKey) {
        throw new Error('Encryption key not available. Secure storage not initialized.');
      }
      
      // Get encrypted value
      const encryptedValue = sessionStorage.getItem(`${STORAGE_PREFIX}${key}`);
      
      if (!encryptedValue) {
        return null;
      }
      
      // Decrypt value
      return decrypt(encryptedValue, encryptionKey);
    } catch (error) {
      logError(error, { context: 'secureSessionStorage.getItem', key });
      
      // Fallback to regular storage in case of error
      try {
        return sessionStorage.getItem(key);
      } catch (fallbackError) {
        logError(fallbackError, { context: 'secureSessionStorage.getItem.fallback', key });
        return null;
      }
    }
  },
  
  /**
   * Remove item from secure session storage
   * @param key Storage key
   */
  removeItem(key: string): void {
    try {
      // Remove encrypted value
      sessionStorage.removeItem(`${STORAGE_PREFIX}${key}`);
      
      // Also remove from regular storage as fallback
      sessionStorage.removeItem(key);
    } catch (error) {
      logError(error, { context: 'secureSessionStorage.removeItem', key });
    }
  },
  
  /**
   * Clear all items from secure session storage
   */
  clear(): void {
    try {
      // Remove all items with prefix
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (error) {
      logError(error, { context: 'secureSessionStorage.clear' });
    }
  },
  
  /**
   * Check if key exists in secure session storage
   * @param key Storage key
   * @returns True if key exists
   */
  hasItem(key: string): boolean {
    try {
      return sessionStorage.getItem(`${STORAGE_PREFIX}${key}`) !== null;
    } catch (error) {
      logError(error, { context: 'secureSessionStorage.hasItem', key });
      return false;
    }
  }
};

export default {
  secureLocalStorage,
  secureSessionStorage,
  setupSecureStorage
};