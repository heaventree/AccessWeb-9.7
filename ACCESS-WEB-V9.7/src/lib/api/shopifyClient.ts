/**
 * Shopify API Client
 */

import { apiClient as baseApiClient } from '../../utils/api/apiClient';
import { ShopifySettings, ShopifyAppResponse, ScanResult } from '../../types/integrations';
import { ValidationError } from '../../utils/api/apiErrors';

/**
 * Create a Shopify API client with specific settings
 * @param settings Shopify API settings
 * @returns API client methods
 */
export function createShopifyApiClient(settings: ShopifySettings) {
  // Validate required settings
  if (!settings.shopDomain) {
    throw new ValidationError('Shopify shop domain is required');
  }

  if (!settings.accessToken) {
    throw new ValidationError('Shopify access token is required');
  }

  // Format shop domain for API requests
  let domain = settings.shopDomain.trim().toLowerCase();
  // Remove protocol if present
  domain = domain.replace(/^https?:\/\//, '');
  // Remove trailing slash if present
  domain = domain.replace(/\/$/, '');

  // Base URL for Shopify API
  const baseUrl = `https://${domain}/admin/api/2023-10`;

  // Local state to avoid unnecessary API calls
  let localSettings = { ...settings };

  // Custom fetch function for Shopify API
  const shopifyFetch = async (endpoint: string, options: RequestInit = {}) => {
    // Add Shopify authorization headers
    const headers = new Headers(options.headers || {});
    headers.set('X-Shopify-Access-Token', settings.accessToken);
    headers.set('Content-Type', 'application/json');
    
    // Construct full URL
    const url = new URL(endpoint, baseUrl).toString();
    
    // Make request with updated options
    return fetch(url, {
      ...options,
      headers
    });
  };

  return {
    /**
     * Verifies the Shopify API connection and app installation
     */
    async verifyConnection(): Promise<{ success: boolean; message: string }> {
      try {
        // Test by getting shop information
        const response = await shopifyFetch('shop.json');
        const data = await response.json();
        
        return {
          success: true,
          message: 'Connected to Shopify store successfully',
        };
      } catch (error) {
        console.error('Shopify connection error:', error);
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Failed to connect to Shopify store',
        };
      }
    },

    /**
     * Get the current theme ID if not already specified in settings
     */
    async getCurrentThemeId(): Promise<string> {
      // If we already have a theme ID in settings, use that
      if (localSettings.currentThemeId) {
        return localSettings.currentThemeId;
      }

      try {
        // Get all themes
        const response = await shopifyFetch('themes.json');
        const data = await response.json();
        
        // Find the main theme (published/active)
        const mainTheme = data.themes.find((theme: any) => theme.role === 'main');
        
        if (!mainTheme) {
          throw new Error('No main theme found in Shopify store');
        }
        
        // Update settings with the theme ID
        const themeId = String(mainTheme.id);
        localSettings.currentThemeId = themeId;
        return themeId;
      } catch (error) {
        console.error('Error getting current theme ID:', error);
        throw error;
      }
    },

    /**
     * Scans a Shopify theme for accessibility issues
     */
    async scanTheme(options?: {
      themeId?: string;
      level?: 'A' | 'AA' | 'AAA';
    }): Promise<ScanResult> {
      try {
        // Get the theme ID to scan
        const themeId = options?.themeId || await this.getCurrentThemeId();
        
        // Request a scan from Shopify app
        const payload = {
          theme_id: themeId,
          level: options?.level || 'AA',
        };
        
        const response = await shopifyFetch('accessibility/scan', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        
        const scanResponse = await response.json() as ShopifyAppResponse;

        if (!scanResponse.success) {
          throw new Error(scanResponse.message || 'Failed to start scan');
        }

        const scanId = scanResponse.data?.scan_id;
        if (!scanId) {
          throw new Error('No scan ID returned from Shopify app');
        }

        // For demo purposes, we'll return a pending scan result
        // In a real implementation, we'd poll for the scan status
        return {
          id: scanId,
          url: `https://${localSettings.shopDomain}/`,
          startTime: new Date().toISOString(),
          endTime: '',
          status: 'pending',
          progress: 0,
        };
      } catch (error) {
        console.error('Shopify scan error:', error);
        throw error;
      }
    },

    /**
     * Gets a specific scan result
     */
    async getScanResult(scanId: string): Promise<ScanResult> {
      try {
        const response = await shopifyFetch(`accessibility/scan/${scanId}`);
        const data = await response.json() as ShopifyAppResponse;
        
        if (!data.success) {
          throw new Error(data.message || 'Failed to get scan result');
        }

        const scanData = data.data?.scan;
        if (!scanData) {
          throw new Error('No scan data returned from Shopify app');
        }

        // Map the Shopify response to our standard ScanResult format
        return {
          id: scanId,
          url: `https://${localSettings.shopDomain}/`,
          startTime: scanData.start_time || new Date().toISOString(),
          endTime: scanData.end_time || '',
          status: scanData.status as 'pending' | 'running' | 'completed' | 'failed',
          progress: scanData.progress || 0,
          summary: scanData.summary,
          items: scanData.items,
        };
      } catch (error) {
        console.error('Shopify get scan result error:', error);
        throw error;
      }
    },

    /**
     * Fix an accessibility issue in a Shopify theme
     */
    async fixIssue(scanId: string, issueId: string): Promise<{ 
      success: boolean; 
      message: string; 
      fixed: boolean; 
      backup?: string;
    }> {
      try {
        const payload = {
          create_backup: localSettings.createBackups || true,
        };
        
        const response = await shopifyFetch(`accessibility/fix/${scanId}/${issueId}`, {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        
        const data = await response.json() as ShopifyAppResponse;
        
        return {
          success: data.success,
          message: data.message || 'Issue fix attempted',
          fixed: data.data?.fixed || false,
          backup: data.data?.backup_theme_id,
        };
      } catch (error) {
        console.error('Shopify fix issue error:', error);
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Failed to fix issue',
          fixed: false,
        };
      }
    },
    
    /**
     * Get a list of available theme backups
     */
    async getBackups(): Promise<{ id: string; name: string; created: string }[]> {
      try {
        const response = await shopifyFetch('accessibility/backups');
        const data = await response.json() as ShopifyAppResponse;
        
        if (!data.success || !data.data?.backups) {
          return [];
        }
        
        return data.data.backups;
      } catch (error) {
        console.error('Error getting backups:', error);
        return [];
      }
    },
    
    /**
     * Restore a theme from a backup
     */
    async restoreBackup(backupId: string): Promise<{ 
      success: boolean; 
      message: string;
    }> {
      try {
        const payload = {
          backup_id: backupId,
        };
        
        const response = await shopifyFetch('accessibility/restore', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        
        const data = await response.json() as ShopifyAppResponse;
        
        return {
          success: data.success,
          message: data.message || 'Backup restored successfully',
        };
      } catch (error) {
        console.error('Error restoring backup:', error);
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Failed to restore backup',
        };
      }
    },

    /**
     * Update Shopify app settings
     */
    async updateSettings(newSettings: Partial<ShopifySettings>): Promise<{
      success: boolean;
      message: string;
    }> {
      try {
        // Filter out sensitive settings that can't be updated this way
        const { accessToken, shopDomain, ...updatableSettings } = newSettings;
        
        const response = await shopifyFetch('accessibility/settings', {
          method: 'POST',
          body: JSON.stringify(updatableSettings)
        });
        
        const data = await response.json() as ShopifyAppResponse;
        
        // Update local settings if successful
        if (data.success) {
          localSettings = {
            ...localSettings,
            ...updatableSettings,
          };
        }
        
        return {
          success: data.success,
          message: data.message || 'Settings updated successfully',
        };
      } catch (error) {
        console.error('Shopify update settings error:', error);
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Failed to update settings',
        };
      }
    }
  };
}

// Export a default function to create the client
export default createShopifyApiClient;