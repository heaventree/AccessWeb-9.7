// Common Types
export interface ScanResult {
  url: string;
  timestamp: string;
  issues: Issue[];
  score: number;
}

export interface Issue {
  id: string;
  type: 'error' | 'warning' | 'notice';
  message: string;
  code: string;
  selector?: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  wcagCriteria: string[];
  autoFixable: boolean;
  fixSuggestion?: string;
}

// WordPress Plugin Types
export interface WordPressSettings {
  apiKey: string;
  scanFrequency: 'daily' | 'weekly' | 'manual';
  autoFix: boolean;
  notifyAdmin: boolean;
  excludedPaths: string[];
  customCSS?: string;
}

export interface WordPressPluginResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Shopify App Types
export interface ShopifySettings {
  apiKey: string;
  shop: string;
  accessToken: string;
  scanFrequency: 'daily' | 'weekly' | 'manual';
  autoFix: boolean;
  notifyAdmin: boolean;
  excludedPaths: string[];
  theme: {
    id: string;
    name: string;
  };
}

export interface ShopifyAppResponse {
  success: boolean;
  message: string;
  data?: any;
}