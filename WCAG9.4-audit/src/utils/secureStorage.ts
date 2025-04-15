/**
 * Secure Storage Utility
 * 
 * Provides a secure interface for storing sensitive data in the browser.
 * Implements encryption for localStorage to mitigate XSS vulnerabilities.
 */

/**
 * Simple encryption for client-side storage
 * Note: This is a basic implementation for demonstration purposes.
 * In a production environment, consider using the Web Crypto API for more robust encryption.
 */
export const encrypt = (value: string, encryptionKey: string): string => {
  try {
    // In a real implementation, you would use the Web Crypto API
    // For demonstration, we'll use a simple XOR encryption
    const valueChars = value.split('');
    const keyChars = encryptionKey.split('');
    const encrypted = valueChars.map((char, i) => {
      const keyChar = keyChars[i % keyChars.length];
      return String.fromCharCode(char.charCodeAt(0) ^ keyChar.charCodeAt(0));
    }).join('');
    
    return btoa(encrypted);
  } catch (error) {
    console.error('Encryption error:', error);
    return '';
  }
};

/**
 * Simple decryption for client-side storage
 */
export const decrypt = (encrypted: string, encryptionKey: string): string => {
  try {
    const decoded = atob(encrypted);
    const encryptedChars = decoded.split('');
    const keyChars = encryptionKey.split('');
    
    const decrypted = encryptedChars.map((char, i) => {
      const keyChar = keyChars[i % keyChars.length];
      return String.fromCharCode(char.charCodeAt(0) ^ keyChar.charCodeAt(0));
    }).join('');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
};

/**
 * Generate a browser fingerprint for additional security
 * This adds an extra layer of security by binding tokens to the user's browser
 */
export const generateBrowserFingerprint = (): string => {
  // Collect various browser properties
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth.toString(),
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset().toString(),
    navigator.platform
  ];
  
  // Combine properties into a fingerprint
  return components.join('|');
};

/**
 * Interface for secure storage operations
 */
export interface SecureStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
}

/**
 * Create a secure storage instance with encryption
 * @param namespace Namespace for storage keys to prevent collisions
 * @returns SecureStorage interface
 */
export const createSecureStorage = (namespace: string): SecureStorage => {
  // Create a unique encryption key based on the namespace and browser fingerprint
  const getEncryptionKey = (): string => {
    const browserFingerprint = generateBrowserFingerprint();
    return `${namespace}:${browserFingerprint}`;
  };
  
  return {
    getItem: (key: string): string | null => {
      const encrypted = localStorage.getItem(`${namespace}:${key}`);
      if (!encrypted) return null;
      
      try {
        return decrypt(encrypted, getEncryptionKey());
      } catch (error) {
        console.error(`Error decrypting ${key}:`, error);
        return null;
      }
    },
    
    setItem: (key: string, value: string): void => {
      try {
        const encrypted = encrypt(value, getEncryptionKey());
        localStorage.setItem(`${namespace}:${key}`, encrypted);
      } catch (error) {
        console.error(`Error encrypting ${key}:`, error);
      }
    },
    
    removeItem: (key: string): void => {
      localStorage.removeItem(`${namespace}:${key}`);
    },
    
    clear: (): void => {
      // Only clear items in this namespace
      Object.keys(localStorage)
        .filter(key => key.startsWith(`${namespace}:`))
        .forEach(key => localStorage.removeItem(key));
    }
  };
};

/**
 * Create the default auth storage instance
 */
export const authStorage = createSecureStorage('auth');

/**
 * Create the default settings storage instance
 */
export const settingsStorage = createSecureStorage('settings');

/**
 * Create the default preferences storage instance
 */
export const preferencesStorage = createSecureStorage('prefs');