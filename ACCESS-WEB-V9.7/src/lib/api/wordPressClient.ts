/**
 * WordPress API Client
 */

import { apiClient as baseApiClient } from '../../utils/api/apiClient';
import { WordPressSettings, WordPressPluginResponse, ScanResult } from '../../types/integrations';
import { ValidationError } from '../../utils/api/apiErrors';

/**
 * Create a WordPress API client with specific settings
 * @param settings WordPress API settings
 * @returns WordPress client methods
 */
export function createWordPressApiClient(settings: WordPressSettings) {
  // Extract site URL with validation
  if (!settings.siteUrl) {
    throw new ValidationError('WordPress site URL is required');
  }

  // Ensure site URL has the right format
  let baseUrl = settings.siteUrl;
  if (!baseUrl.endsWith('/')) {
    baseUrl += '/';
  }
  baseUrl += 'wp-json/accessweb/v1';

  // Local settings state
  let localSettings = { ...settings };

  // Custom fetch function for WordPress API
  const wpFetch = async (endpoint: string, options: RequestInit = {}) => {
    // Add WordPress authorization headers
    const headers = new Headers(options.headers || {});
    if (settings.apiKey) {
      headers.set('X-API-KEY', settings.apiKey);
    }
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
     * Verifies the WordPress API connection and plugin installation
     */
    async verifyConnection(): Promise<{ success: boolean; message: string }> {
      try {
        const response = await wpFetch('status');
        const data = await response.json() as WordPressPluginResponse;
        
        return {
          success: data.success,
          message: data.message || 'Connection successful',
        };
      } catch (error) {
        console.error('WordPress connection error:', error);
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Failed to connect to WordPress site',
        };
      }
    },

    /**
     * Tests the WordPress site for accessibility issues
     */
    async scanSite(options?: { 
      path?: string;
      level?: 'A' | 'AA' | 'AAA';
      includeHidden?: boolean;
    }): Promise<ScanResult> {
      try {
        // Create a new scan
        const payload = {
          path: options?.path || '/',
          level: options?.level || 'AA',
          include_hidden: options?.includeHidden || false,
        };
        
        const response = await wpFetch('scan', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        
        const scanResponse = await response.json() as WordPressPluginResponse;

        if (!scanResponse.success) {
          throw new Error(scanResponse.message || 'Failed to start scan');
        }

        const scanId = scanResponse.data?.scan_id;
        if (!scanId) {
          throw new Error('No scan ID returned from WordPress');
        }

        // For demo purposes, we'll return a pending scan result
        // In a real implementation, we'd poll for the scan status
        return {
          id: scanId,
          url: `${localSettings.siteUrl}${options?.path || '/'}`,
          startTime: new Date().toISOString(),
          endTime: '',
          status: 'pending',
          progress: 0,
        };
      } catch (error) {
        console.error('WordPress scan error:', error);
        throw error;
      }
    },

    /**
     * Gets a specific scan result
     */
    async getScanResult(scanId: string): Promise<ScanResult> {
      try {
        const response = await wpFetch(`scan/${scanId}`);
        const data = await response.json() as WordPressPluginResponse;
        
        if (!data.success) {
          throw new Error(data.message || 'Failed to get scan result');
        }

        const scanData = data.data?.scan;
        if (!scanData) {
          throw new Error('No scan data returned from WordPress');
        }

        // Map the WordPress response to our standard ScanResult format
        return {
          id: scanId,
          url: scanData.url || localSettings.siteUrl || '',
          startTime: scanData.start_time || new Date().toISOString(),
          endTime: scanData.end_time || '',
          status: scanData.status as 'pending' | 'running' | 'completed' | 'failed',
          progress: scanData.progress || 0,
          summary: scanData.summary,
          items: scanData.items,
        };
      } catch (error) {
        console.error('WordPress get scan result error:', error);
        throw error;
      }
    },

    /**
     * Fix an accessibility issue
     */
    async fixIssue(scanId: string, issueId: string): Promise<{ 
      success: boolean; 
      message: string; 
      fixed: boolean;
    }> {
      try {
        const response = await wpFetch(`fix/${scanId}/${issueId}`, {
          method: 'POST',
          body: JSON.stringify({})
        });
        
        const data = await response.json() as WordPressPluginResponse;
        
        return {
          success: data.success,
          message: data.message || 'Issue fix attempted',
          fixed: data.data?.fixed || false,
        };
      } catch (error) {
        console.error('WordPress fix issue error:', error);
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Failed to fix issue',
          fixed: false,
        };
      }
    },

    /**
     * Update WordPress plugin settings
     */
    async updateSettings(newSettings: Partial<WordPressSettings>): Promise<{
      success: boolean;
      message: string;
    }> {
      try {
        // Filter out the API key, which can't be updated this way
        const { apiKey, ...updatableSettings } = newSettings;
        
        const response = await wpFetch('settings', {
          method: 'POST',
          body: JSON.stringify(updatableSettings)
        });
        
        const data = await response.json() as WordPressPluginResponse;
        
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
        console.error('WordPress update settings error:', error);
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Failed to update settings',
        };
      }
    }
  };
}

// Export a default function to create the client
export default createWordPressApiClient;