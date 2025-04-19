/**
 * Utilities Module
 * 
 * This is the main entry point for all utilities in the application.
 * It re-exports all utility categories to provide a consistent import experience.
 */

// Re-export all utility categories
export * from './accessibility';
export * from './api';
export * from './auth';
export * from './common';
export * from './formats';
export * from './monitoring';
export * from './payment';
export * from './security';
export * from './storage';

// Export namespaced modules for granular imports
import * as accessibilityUtils from './accessibility';
import * as apiUtils from './api';
import * as authUtils from './auth';
import * as commonUtils from './common';
import * as formatUtils from './formats';
import * as monitoringUtils from './monitoring';
import * as paymentUtils from './payment';
import * as securityUtils from './security';
import * as storageUtils from './storage';

export {
  accessibilityUtils,
  apiUtils,
  authUtils,
  commonUtils,
  formatUtils,
  monitoringUtils,
  paymentUtils,
  securityUtils,
  storageUtils
};