import type { WordPressSettings, WordPressPluginResponse, ScanResult, AccessibilityIssue } from '../../types/integrations';
import { storageService } from '../storage';

/**
 * WordPress API Client
 * 
 * Connects to WordPress sites with the WCAG Accessibility plugin installed
 * Uses the WP REST API with API key authentication
 */
export const wordPressAPI = {
  /**
   * Validate a WordPress API key by checking connection to the site
   */
  async validateAPIKey(apiKey: string, siteUrl?: string): Promise<boolean> {
    if (!apiKey || !siteUrl) {
      return false;
    }

    try {
      // Build the WordPress REST API URL
      const baseUrl = this.getBaseUrl(siteUrl);
      const url = `${baseUrl}/status`;
      
      // Make the request with API key authentication
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-API-KEY': apiKey,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`WordPress API responded with status ${response.status}`);
      }

      const data = await response.json();
      return data?.success === true;
    } catch (error) {
      console.error('API key validation error:', error);
      return false;
    }
  },

  /**
   * Save WordPress plugin settings (cached locally and sent to WordPress)
   */
  async saveSettings(settings: WordPressSettings): Promise<WordPressPluginResponse> {
    try {
      // Save to local storage first
      await storageService.setItem('wordpress_settings', settings);
      
      // Then send to WordPress if we have connection details
      if (settings.siteUrl && settings.apiKey) {
        // Build the WordPress REST API URL
        const baseUrl = this.getBaseUrl(settings.siteUrl);
        const url = `${baseUrl}/settings`;
        
        // Make the request with API key authentication
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'X-API-KEY': settings.apiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            autofix_enabled: settings.autofixEnabled || false,
            monitoring_enabled: settings.monitoringEnabled || false,
            monitoring_interval: settings.monitoringInterval || 1440, // Default 24 hours
            scan_level: settings.scanLevel || 'AA',
            notify_on_issue: settings.notifyOnIssue || false,
            email_notifications: settings.emailNotifications || []
          })
        });
        
        if (!response.ok) {
          throw new Error(`Failed to save settings to WordPress: ${response.statusText}`);
        }
        
        const responseData = await response.json();
        
        return {
          success: true,
          message: 'Settings saved to WordPress successfully',
          data: {
            // Include any data from the API response if available
            ...responseData?.data,
            // But don't include the settings since they don't match the expected type
          }
        };
      }
      
      return {
        success: true,
        message: 'Settings saved locally only (no WordPress connection)',
        data: {
          // The data property expects a different shape than WordPressSettings
          // so we don't include the settings directly
        }
      };
    } catch (error) {
      console.error('Save settings error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to save settings'
      };
    }
  },

  /**
   * Get WordPress plugin settings
   */
  async getSettings(apiKey: string, siteUrl?: string): Promise<WordPressSettings | null> {
    // First try to get local settings
    const localSettings = await storageService.getItem<WordPressSettings>('wordpress_settings');
    
    // If we have API credentials, try to fetch from WordPress
    if (apiKey && siteUrl) {
      try {
        const baseUrl = this.getBaseUrl(siteUrl);
        const url = `${baseUrl}/settings`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'X-API-KEY': apiKey,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to get settings from WordPress: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data?.success && data?.data) {
          // Convert WordPress format to our format
          const wpSettings: WordPressSettings = {
            siteUrl,
            apiKey,
            autofixEnabled: data.data.autofix_enabled,
            monitoringEnabled: data.data.monitoring_enabled,
            monitoringInterval: data.data.monitoring_interval,
            scanLevel: data.data.scan_level,
            notifyOnIssue: data.data.notify_on_issue,
            emailNotifications: data.data.email_notifications
          };
          
          // Update local cache
          await storageService.setItem('wordpress_settings', wpSettings);
          
          return wpSettings;
        }
      } catch (error) {
        console.error('Error getting WordPress settings:', error);
        // Fall back to local settings
      }
    }
    
    return localSettings;
  },

  /**
   * Start a WordPress accessibility scan
   */
  async startScan(apiKey: string, siteUrl: string, options?: { 
    path?: string; 
    level?: 'A' | 'AA' | 'AAA';
  }): Promise<WordPressPluginResponse> {
    try {
      if (!apiKey || !siteUrl) {
        throw new Error('API key and site URL are required');
      }
      
      const baseUrl = this.getBaseUrl(siteUrl);
      const url = `${baseUrl}/scan`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'X-API-KEY': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          path: options?.path || '/',
          level: options?.level || 'AA'
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to start scan: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data?.success || !data?.data?.scan_id) {
        throw new Error(data?.message || 'Failed to start scan: No scan ID returned');
      }
      
      // Save scan ID to local storage for tracking
      const scanId = data.data.scan_id;
      await storageService.setItem('current_scan_id', scanId);
      
      return {
        success: true,
        message: 'Scan started successfully',
        data: { 
          scan_id: scanId 
        }
      };
    } catch (error) {
      console.error('Start scan error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to start scan'
      };
    }
  },

  /**
   * Get scan results by ID
   */
  async getScanResults(scanId: string, siteUrl: string, apiKey: string): Promise<ScanResult | null> {
    try {
      if (!scanId || !siteUrl || !apiKey) {
        throw new Error('Scan ID, site URL, and API key are required');
      }
      
      const baseUrl = this.getBaseUrl(siteUrl);
      const url = `${baseUrl}/scan/${scanId}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-API-KEY': apiKey,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get scan results: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data?.success || !data?.data?.scan) {
        throw new Error(data?.message || 'Failed to get scan results');
      }
      
      const wpScan = data.data.scan;
      
      // Map WordPress scan data to our format
      const scan: ScanResult = {
        id: scanId,
        url: wpScan.url || siteUrl,
        startTime: wpScan.start_time || new Date().toISOString(),
        endTime: wpScan.end_time || '',
        status: wpScan.status as 'pending' | 'running' | 'completed' | 'failed',
        progress: wpScan.progress || 0,
        summary: wpScan.summary ? {
          total: wpScan.summary.total || 0,
          critical: wpScan.summary.critical || 0,
          serious: wpScan.summary.serious || 0,
          moderate: wpScan.summary.moderate || 0,
          minor: wpScan.summary.minor || 0,
          fixed: wpScan.summary.fixed || 0,
          ignored: wpScan.summary.ignored || 0
        } : undefined,
        items: wpScan.items ? this.mapWpIssuesToAccessibilityIssues(wpScan.items) : undefined
      };
      
      // Save to cache
      await storageService.setItem('scan_results', scan);
      
      return scan;
    } catch (error) {
      console.error('Get scan results error:', error);
      
      // Try to get from cache
      return storageService.getItem('scan_results');
    }
  },

  /**
   * Apply automated fixes to a WordPress site based on scan results
   */
  async applyAutoFixes(scanId: string, siteUrl: string, apiKey: string): Promise<WordPressPluginResponse> {
    try {
      if (!scanId || !siteUrl || !apiKey) {
        throw new Error('Scan ID, site URL, and API key are required');
      }
      
      const baseUrl = this.getBaseUrl(siteUrl);
      const url = `${baseUrl}/fix/${scanId}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'X-API-KEY': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          create_backup: true
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to apply fixes: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data?.success) {
        throw new Error(data?.message || 'Failed to apply fixes');
      }
      
      return {
        success: true,
        message: data.message || 'Auto-fixes applied successfully',
        data: { 
          scan_id: scanId,
          fixed: true,
          fixes_applied: data.data?.fixes_applied || 0,
          backup_id: data.data?.backup_id
        }
      };
    } catch (error) {
      console.error('Apply auto-fixes error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to apply fixes'
      };
    }
  },

  /**
   * Fix a specific issue by ID
   */
  async fixIssue(
    scanId: string, 
    issueId: string, 
    siteUrl: string, 
    apiKey: string
  ): Promise<WordPressPluginResponse> {
    try {
      if (!scanId || !issueId || !siteUrl || !apiKey) {
        throw new Error('Scan ID, issue ID, site URL, and API key are required');
      }
      
      const baseUrl = this.getBaseUrl(siteUrl);
      const url = `${baseUrl}/fix/${scanId}/${issueId}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'X-API-KEY': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          create_backup: true
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fix issue: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data?.success) {
        throw new Error(data?.message || 'Failed to fix issue');
      }
      
      return {
        success: true,
        message: data.message || 'Issue fixed successfully',
        data: { 
          scan_id: scanId,
          fixed: true,
          backup_id: data.data?.backup_id
        }
      };
    } catch (error) {
      console.error('Fix issue error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fix issue'
      };
    }
  },

  /**
   * Get available backups for a WordPress site
   */
  async getBackups(siteUrl: string, apiKey: string): Promise<{ 
    id: string; 
    name: string; 
    created: string;
  }[]> {
    try {
      if (!siteUrl || !apiKey) {
        throw new Error('Site URL and API key are required');
      }
      
      const baseUrl = this.getBaseUrl(siteUrl);
      const url = `${baseUrl}/backups`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-API-KEY': apiKey,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get backups: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data?.success || !data?.data?.backups) {
        return [];
      }
      
      return data.data.backups;
    } catch (error) {
      console.error('Get backups error:', error);
      return [];
    }
  },

  /**
   * Restore a WordPress backup
   */
  async restoreBackup(
    backupId: string, 
    siteUrl: string, 
    apiKey: string
  ): Promise<WordPressPluginResponse> {
    try {
      if (!backupId || !siteUrl || !apiKey) {
        throw new Error('Backup ID, site URL, and API key are required');
      }
      
      const baseUrl = this.getBaseUrl(siteUrl);
      const url = `${baseUrl}/backups/restore`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'X-API-KEY': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          backup_id: backupId
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to restore backup: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data?.success) {
        throw new Error(data?.message || 'Failed to restore backup');
      }
      
      return {
        success: true,
        message: data.message || 'Backup restored successfully',
        data: { 
          backup_id: backupId
        }
      };
    } catch (error) {
      console.error('Restore backup error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to restore backup'
      };
    }
  },

  /**
   * Get monitoring widget script
   */
  getMonitoringScript(apiKey: string, siteUrl: string): string {
    // Create an absolute path to our monitoring script
    const scriptUrl = new URL('/monitor.js', window.location.origin).toString();
    
    return `
      <script>
        window.WCAGMonitor = {
          init: function(config) {
            // Initialize monitoring
            const script = document.createElement('script');
            script.src = '${scriptUrl}';
            script.dataset.apiKey = '${apiKey}';
            script.dataset.siteUrl = '${siteUrl}';
            script.async = true;
            document.head.appendChild(script);
          }
        };
      </script>
    `.trim();
  },

  /**
   * Get badge script
   */
  getBadgeScript(apiKey: string, siteUrl: string): string {
    // Create an absolute path to our badge script
    const scriptUrl = new URL('/badge.js', window.location.origin).toString();
    
    return `
      <script>
        window.WCAGBadge = {
          init: function(config) {
            // Initialize badge
            const script = document.createElement('script');
            script.src = '${scriptUrl}';
            script.dataset.apiKey = '${apiKey}';
            script.dataset.siteUrl = '${siteUrl}';
            script.async = true;
            document.head.appendChild(script);
          }
        };
      </script>
    `.trim();
  },

  /**
   * Helper method to properly format the WordPress REST API URL
   */
  getBaseUrl(siteUrl: string): string {
    // Remove trailing slash if present
    const baseUrl = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;
    
    // Check if already has protocol and add if needed
    const hasProtocol = /^https?:\/\//i.test(baseUrl);
    const urlWithProtocol = hasProtocol ? baseUrl : `https://${baseUrl}`;
    
    // Append the REST API namespace for our plugin
    return `${urlWithProtocol}/wp-json/accessweb/v1`;
  },
  
  /**
   * Helper to map WordPress issue format to our AccessibilityIssue format
   */
  mapWpIssuesToAccessibilityIssues(wpIssues: any[]): AccessibilityIssue[] {
    if (!wpIssues || !Array.isArray(wpIssues)) {
      return [];
    }
    
    return wpIssues.map(issue => ({
      id: issue.id || `wp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      wcag: issue.wcag || '',
      level: issue.level || 'AA',
      impact: issue.impact || 'moderate',
      element: issue.element,
      html: issue.html,
      message: issue.message || 'Accessibility issue detected',
      context: issue.context,
      help: issue.help,
      helpUrl: issue.help_url,
      selector: issue.selector,
      status: issue.status || 'new',
      occurrences: issue.occurrences,
      pages: issue.pages
    }));
  }
};