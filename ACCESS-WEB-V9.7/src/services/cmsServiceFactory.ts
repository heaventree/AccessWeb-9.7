
import { cmsService } from './cmsService';
import { strapiCmsService } from './strapiCmsService';
import type { CmsConfig } from '../types';

/**
 * Factory function to get the appropriate CMS service based on configuration
 */
export function getCmsService(config: CmsConfig) {
  switch (config.provider) {
    case 'strapi':
      return strapiCmsService;
    case 'in-memory':
    default:
      return cmsService;
  }
}

// Default configuration - can be overridden in app settings
export const defaultCmsConfig: CmsConfig = {
  provider: 'in-memory'
};
