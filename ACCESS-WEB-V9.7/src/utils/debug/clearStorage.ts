/**
 * Debug utility to clear corrupted storage data
 */

import { isDevelopment } from '../common/environment';

export function clearCorruptedStorage() {
  if (!isDevelopment()) {
    return;
  }
  
  try {
    // Clear all localStorage items that might be corrupted
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('rate_limit_') || key.includes('csrf_') || key.includes('wcag_sec_'))) {
        keys.push(key);
      }
    }
    
    keys.forEach(key => {
      try {
        localStorage.removeItem(key);
        console.log(`Cleared corrupted storage key: ${key}`);
      } catch (error) {
        console.error(`Failed to clear key ${key}:`, error);
      }
    });
    
  } catch (error) {
    console.error('Failed to clear corrupted storage:', error);
  }
}

// Auto-clear on import in development
if (isDevelopment()) {
  clearCorruptedStorage();
}