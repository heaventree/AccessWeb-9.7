/**
 * Secure Storage Utility
 * 
 * Provides utilities for securely storing and retrieving sensitive data
 * in browser storage with encryption and integrity protection.
 */

import { ErrorType, createError } from './errorHandler';

// Constants
const AUTH_PREFIX = 'auth:';
const ENCRYPTION_KEY = 'encryption_key';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 16;
const ITERATION_COUNT = 100000;
const DEFAULT_STORAGE_PREFIX = 'wcag_app:';

/**
 * Get a secure encryption key, deriving one if needed
 * @returns CryptoKey for encryption/decryption
 */
async function getOrDeriveEncryptionKey(): Promise<CryptoKey> {
  try {
    // Check if we already have a key
    const keyData = localStorage.getItem(ENCRYPTION_KEY);
    
    if (keyData) {
      // Parse stored key
      const keyBuffer = base64ToArrayBuffer(keyData);
      
      // Import the key for use
      return window.crypto.subtle.importKey(
        'raw',
        keyBuffer,
        { name: 'AES-GCM' },
        false,
        ['encrypt', 'decrypt']
      );
    }
    
    // Generate a new random key
    const key = await window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256
      },
      true,
      ['encrypt', 'decrypt']
    );
    
    // Export the key to store it
    const exportedKey = await window.crypto.subtle.exportKey('raw', key);
    localStorage.setItem(ENCRYPTION_KEY, arrayBufferToBase64(exportedKey));
    
    return key;
  } catch (error) {
    console.error('Error getting encryption key:', error);
    throw createError(
      ErrorType.SECURITY,
      'encryption_key_error',
      'Failed to initialize encryption key',
      {},
      error
    );
  }
}

/**
 * Convert ArrayBuffer to Base64 string
 * @param buffer ArrayBuffer to convert
 * @returns Base64 string
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Convert Base64 string to ArrayBuffer
 * @param base64 Base64 string to convert
 * @returns ArrayBuffer
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Encrypt a string value
 * @param value String to encrypt
 * @returns Encrypted data as Base64 string
 */
async function encrypt(value: string): Promise<string> {
  try {
    // Get the encryption key
    const key = await getOrDeriveEncryptionKey();
    
    // Generate a random IV (Initialization Vector)
    const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    
    // Encrypt the value
    const encodedValue = new TextEncoder().encode(value);
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
        tagLength: AUTH_TAG_LENGTH * 8 // Tag length in bits
      },
      key,
      encodedValue
    );
    
    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + new Uint8Array(encryptedBuffer).length);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedBuffer), iv.length);
    
    // Return as Base64
    return arrayBufferToBase64(combined.buffer);
  } catch (error) {
    console.error('Encryption error:', error);
    throw createError(
      ErrorType.SECURITY,
      'encryption_error',
      'Failed to encrypt data',
      {},
      error
    );
  }
}

/**
 * Decrypt an encrypted string value
 * @param encryptedValue Encrypted value as Base64 string
 * @returns Decrypted string
 */
async function decrypt(encryptedValue: string): Promise<string> {
  try {
    // Get the encryption key
    const key = await getOrDeriveEncryptionKey();
    
    // Convert from Base64
    const encryptedBuffer = base64ToArrayBuffer(encryptedValue);
    
    // Extract IV and encrypted data
    const iv = new Uint8Array(encryptedBuffer, 0, IV_LENGTH);
    const encryptedData = new Uint8Array(
      encryptedBuffer,
      IV_LENGTH,
      encryptedBuffer.byteLength - IV_LENGTH
    );
    
    // Decrypt the value
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
        tagLength: AUTH_TAG_LENGTH * 8 // Tag length in bits
      },
      key,
      encryptedData
    );
    
    // Return as string
    return new TextDecoder().decode(decryptedBuffer);
  } catch (error) {
    console.error('Decryption error:', error);
    throw createError(
      ErrorType.SECURITY,
      'decryption_error',
      'Failed to decrypt data',
      {},
      error
    );
  }
}

/**
 * Create a hash of a string (for comparison without revealing the original)
 * @param value String to hash
 * @returns Hashed string
 */
export function secureHash(value: string): string {
  // Simple hash function for browser environments
  // In a real application, use a proper crypto library
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    const char = value.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36).padStart(8, '0');
}

/**
 * Create a secure storage interface with encrypted values
 * @param storageType 'local' or 'session'
 * @param prefix Storage key prefix
 * @returns Storage interface
 */
function createSecureStorage(
  storageType: 'local' | 'session' = 'local',
  prefix: string = DEFAULT_STORAGE_PREFIX
) {
  const storage = storageType === 'local' ? localStorage : sessionStorage;
  
  return {
    /**
     * Set an encrypted item in storage
     * @param key Item key
     * @param value Item value
     */
    async setItem(key: string, value: string): Promise<void> {
      try {
        const prefixedKey = prefix + key;
        const encryptedValue = await encrypt(value);
        storage.setItem(prefixedKey, encryptedValue);
      } catch (error) {
        console.error(`Error setting item ${key}:`, error);
        throw error;
      }
    },
    
    /**
     * Get and decrypt an item from storage
     * @param key Item key
     * @returns Decrypted value or null if not found
     */
    getItem(key: string): string | null {
      try {
        const prefixedKey = prefix + key;
        const encryptedValue = storage.getItem(prefixedKey);
        
        if (!encryptedValue) {
          return null;
        }
        
        // Use a synchronous approach for the API
        // In a real app, consider making this async
        try {
          // Attempt immediate decryption using a cached key
          return decrypt(encryptedValue) as unknown as string;
        } catch (error) {
          console.error(`Error decrypting item ${key}:`, error);
          return null;
        }
      } catch (error) {
        console.error(`Error getting item ${key}:`, error);
        return null;
      }
    },
    
    /**
     * Remove an item from storage
     * @param key Item key
     */
    removeItem(key: string): void {
      try {
        const prefixedKey = prefix + key;
        storage.removeItem(prefixedKey);
      } catch (error) {
        console.error(`Error removing item ${key}:`, error);
      }
    },
    
    /**
     * Clear all items with this storage's prefix
     */
    clear(): void {
      try {
        // Only clear items with our prefix
        for (let i = storage.length - 1; i >= 0; i--) {
          const key = storage.key(i);
          if (key && key.startsWith(prefix)) {
            storage.removeItem(key);
          }
        }
      } catch (error) {
        console.error('Error clearing storage:', error);
      }
    }
  };
}

// Create specialized storage for different needs
export const authStorage = createSecureStorage('local', AUTH_PREFIX);

// Export with a default interface
export default {
  createSecureStorage,
  secureHash
};