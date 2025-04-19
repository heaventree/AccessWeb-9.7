/**
 * Custom API Client for AccessWeb API
 */

import { apiClient as baseApiClient } from '../../utils/api/apiClient';
import { CustomAPISettings, CustomAPIResponse, ScanResult } from '../../types/integrations';
import { ValidationError } from '../../utils/api/apiErrors';

/**
 * Create a custom API client with specific settings
 * @param settings Custom API settings
 * @returns API client methods
 */
export function createCustomApiClient(settings: CustomAPISettings) {
  // Validate required settings
  if (!settings.baseUrl) {
    throw new ValidationError('API base URL is required');
  }

  if (!settings.apiKey) {
    throw new ValidationError('API key is required');
  }

  // Use base API client with our settings
  const customFetch = async (endpoint: string, options: RequestInit = {}) => {
    // Add custom headers
    const headers = new Headers(options.headers || {});
    headers.set('X-API-KEY', settings.apiKey);
    headers.set('Content-Type', 'application/json');
    
    // Construct full URL
    const url = new URL(endpoint, settings.baseUrl).toString();
    
    // Make request with updated options
    return fetch(url, {
      ...options,
      headers
    });
  };

  return {
    /**
     * Verifies the API connection with the provided key
     */
    async verifyConnection(): Promise<{ success: boolean; message: string }> {
      try {
        const response = await customFetch('verify');
        const data = await response.json() as CustomAPIResponse;
        
        return {
          success: data.success,
          message: data.message || 'API connection verified successfully',
        };
      } catch (error) {
        console.error('API connection error:', error);
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Failed to verify API connection',
        };
      }
    },

    /**
     * Get API usage information
     */
    async getUsage(): Promise<{ 
      totalRequests: number; 
      remainingRequests: number;
      resetAt: string;
    }> {
      try {
        const response = await customFetch('usage');
        const data = await response.json() as CustomAPIResponse;
        
        if (!data.success || !data.data) {
          throw new Error(data.message || 'Failed to get API usage information');
        }

        return {
          totalRequests: data.data.total_requests || 0,
          remainingRequests: data.data.remaining_requests || 0,
          resetAt: data.data.reset_at || new Date().toISOString(),
        };
      } catch (error) {
        console.error('Error getting API usage:', error);
        throw error;
      }
    },

    /**
     * Start a scan on a specific URL
     */
    async scanUrl(url: string, options?: {
      level?: 'A' | 'AA' | 'AAA';
      includeHidden?: boolean;
      maxDepth?: number;
      ignoreRobots?: boolean;
    }): Promise<ScanResult> {
      try {
        // Validate URL
        if (!url) {
          throw new ValidationError('URL to scan is required');
        }

        // Start the scan
        const payload = {
          url,
          level: options?.level || 'AA',
          include_hidden: options?.includeHidden || false,
          max_depth: options?.maxDepth || 1,
          ignore_robots: options?.ignoreRobots || false,
        };

        const response = await customFetch('scan', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        
        const scanResponse = await response.json() as CustomAPIResponse;

        if (!scanResponse.success) {
          throw new Error(scanResponse.message || 'Failed to start scan');
        }

        const scanId = scanResponse.data?.scan_id;
        if (!scanId) {
          throw new Error('No scan ID returned from API');
        }

        // For demo purposes, we'll return a pending scan result
        // In a real implementation, we'd poll for the scan status
        return {
          id: scanId,
          url,
          startTime: new Date().toISOString(),
          endTime: '',
          status: 'pending',
          progress: 0,
        };
      } catch (error) {
        console.error('Error starting scan:', error);
        throw error;
      }
    },

    /**
     * Get scan result by ID
     */
    async getScanResult(scanId: string): Promise<ScanResult> {
      try {
        const response = await customFetch(`scans/${scanId}`);
        const data = await response.json() as CustomAPIResponse;
        
        if (!data.success) {
          throw new Error(data.message || 'Failed to get scan result');
        }

        const scanData = data.data?.scan;
        if (!scanData) {
          throw new Error('No scan data returned from API');
        }

        // Map the API response to our standard ScanResult format
        return {
          id: scanId,
          url: scanData.url || '',
          startTime: scanData.start_time || new Date().toISOString(),
          endTime: scanData.end_time || '',
          status: scanData.status as 'pending' | 'running' | 'completed' | 'failed',
          progress: scanData.progress || 0,
          summary: scanData.summary,
          items: scanData.items,
        };
      } catch (error) {
        console.error('Error getting scan result:', error);
        throw error;
      }
    },

    /**
     * Get all completed scans
     */
    async getScans(options?: { 
      limit?: number; 
      offset?: number;
      status?: 'pending' | 'running' | 'completed' | 'failed';
    }): Promise<{
      scans: ScanResult[];
      total: number;
      hasMore: boolean;
    }> {
      try {
        // Build URL with query parameters
        const params = new URLSearchParams();
        if (options?.limit) params.append('limit', options.limit.toString());
        if (options?.offset) params.append('offset', options.offset.toString());
        if (options?.status) params.append('status', options.status);
        
        const url = `scans${params.toString() ? '?' + params.toString() : ''}`;
        
        const response = await customFetch(url);
        const data = await response.json() as CustomAPIResponse;
        
        if (!data.success || !data.data) {
          throw new Error(data.message || 'Failed to get scans');
        }

        return {
          scans: data.data.scans || [],
          total: data.data.total || 0,
          hasMore: data.data.has_more || false,
        };
      } catch (error) {
        console.error('Error getting scans:', error);
        throw error;
      }
    },

    /**
     * Register a webhook
     */
    async registerWebhook(url: string, events: string[]): Promise<{ 
      id: string; 
      secret: string;
    }> {
      try {
        // Validate parameters
        if (!url) {
          throw new ValidationError('Webhook URL is required');
        }

        if (!events || events.length === 0) {
          throw new ValidationError('At least one event must be specified');
        }

        // Register the webhook
        const response = await customFetch('webhooks', {
          method: 'POST',
          body: JSON.stringify({ url, events })
        });
        
        const data = await response.json() as CustomAPIResponse;
        
        if (!data.success || !data.data) {
          throw new Error(data.message || 'Failed to register webhook');
        }

        return {
          id: data.data.webhook_id || '',
          secret: data.data.secret || '',
        };
      } catch (error) {
        console.error('Error registering webhook:', error);
        throw error;
      }
    },

    /**
     * Delete a webhook
     */
    async deleteWebhook(webhookId: string): Promise<boolean> {
      try {
        const response = await customFetch(`webhooks/${webhookId}`, {
          method: 'DELETE'
        });
        
        const data = await response.json() as CustomAPIResponse;
        return data.success;
      } catch (error) {
        console.error('Error deleting webhook:', error);
        return false;
      }
    },

    /**
     * List all webhooks
     */
    async getWebhooks(): Promise<{ 
      id: string; 
      url: string; 
      events: string[];
      active: boolean;
      created: string;
    }[]> {
      try {
        const response = await customFetch('webhooks');
        const data = await response.json() as CustomAPIResponse;
        
        if (!data.success || !data.data) {
          throw new Error(data.message || 'Failed to get webhooks');
        }

        return data.data.webhooks || [];
      } catch (error) {
        console.error('Error getting webhooks:', error);
        return [];
      }
    }
  };
}

// Export a default function to create the client
export default createCustomApiClient;