import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { RefreshCw, Search, History, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface ScanResult {
  success: boolean;
  scanId: number;
  summary: {
    totalIssues: number;
    severityBreakdown: {
      critical: number;
      serious: number;
      moderate: number;
      minor: number;
    };
    passedChecks: number;
    overallScore: number;
    conformanceLevel: string;
  };
  issues: Issue[];
  issuesByPrinciple: {
    perceivable: { count: number; issues: Issue[] };
    operable: { count: number; issues: Issue[] };
    understandable: { count: number; issues: Issue[] };
    robust: { count: number; issues: Issue[] };
  };
  passedChecks: PassedCheck[];
  scanMetadata: {
    url: string;
    timestamp: string;
    scanDuration: number;
    wcagVersion: string;
    toolVersion: string;
    conformanceLevel: string;
    accessibilityScore: number;
    screenshot?: string;
  };
  wcagGuidelines: {
    version: string;
    principles: {
      perceivable: string;
      operable: string;
      understandable: string;
      robust: string;
    };
  };
}

interface Issue {
  wcagRule: string;
  ruleName: string;
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
  principle: string;
  element: string;
  selector: string;
  description: string;
  recommendation: string;
  location: string;
  htmlSnippet?: string;
}

interface PassedCheck {
  wcagRule: string;
  description: string;
  help: string;
}

const WCAGCheckerSimple: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState('scanner');
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  
  // New state for the redesigned UI
  const [selectedRegion, setSelectedRegion] = useState('EU');
  const [selectedStandards, setSelectedStandards] = useState(['WCAG 2.1', 'WCAG 2.2']);
  const [advancedOptions, setAdvancedOptions] = useState<string[]>([]);

  // Region options
  const regions = ['EU', 'UK', 'USA', 'Canada', 'Australia', 'Japan', 'Global'];
  
  // Standards options with colors
  const standards = [
    { id: 'EN 301 549', label: 'EN 301 549', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' },
    { id: 'EAA', label: 'EAA', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' },
    { id: 'WCAG 2.1', label: 'WCAG 2.1', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' },
    { id: 'WCAG 2.2', label: 'WCAG 2.2', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' }
  ];

  // Advanced testing options
  const advancedTestingOptions = [
    { id: 'document-testing', label: 'Document Testing', isPro: true },
    { id: 'office-documents', label: 'Office Documents', isPro: true },
    { id: 'pdf-accessibility', label: 'PDF Accessibility', isPro: true },
    { id: 'media-testing', label: 'Media Testing', isPro: true }
  ];

  // Helper functions for new UI
  const toggleStandard = (standardId: string) => {
    setSelectedStandards(prev => 
      prev.includes(standardId) 
        ? prev.filter(id => id !== standardId)
        : [...prev, standardId]
    );
  };

  const toggleAdvancedOption = (optionId: string) => {
    setAdvancedOptions(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  // Load scan history from localStorage when user is available
  useEffect(() => {
    if (user) {
      const storedHistory = localStorage.getItem(`wcag-scan-history-${user.id}`);
      if (storedHistory) {
        try {
          const history = JSON.parse(storedHistory);
          setScanHistory(history);
        } catch (error) {
          console.error('Error loading scan history from localStorage:', error);
        }
      }
    }
  }, [user]);

  const validateUrl = (inputUrl: string): { isValid: boolean; error?: string } => {
    if (!inputUrl || !inputUrl.trim()) {
      return { isValid: false, error: "Please enter a URL to scan" };
    }

    const trimmedUrl = inputUrl.trim();

    // Check if URL starts with protocol
    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      return { isValid: false, error: "URL must start with http:// or https://" };
    }

    try {
      const urlObj = new URL(trimmedUrl);
      
      // Check protocol
      if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
        return { isValid: false, error: "Only HTTP and HTTPS protocols are supported" };
      }

      // Check hostname exists and is valid
      if (!urlObj.hostname || urlObj.hostname.length < 1) {
        return { isValid: false, error: "Please enter a valid domain name" };
      }

      // Check for valid domain format
      const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if (!domainRegex.test(urlObj.hostname)) {
        return { isValid: false, error: "Please enter a valid domain name (e.g., example.com)" };
      }

      // Check minimum domain length
      if (urlObj.hostname.length < 4) {
        return { isValid: false, error: "Domain name too short. Please enter a complete domain (e.g., example.com)" };
      }

      // Check for localhost or invalid domains in production
      const invalidDomains = ['localhost', '127.0.0.1', '0.0.0.0'];
      if (invalidDomains.includes(urlObj.hostname.toLowerCase())) {
        return { isValid: false, error: "Local URLs cannot be scanned. Please enter a public website URL" };
      }

      // Check for private IP ranges
      const privateIPRegex = /^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|169\.254\.)/;
      if (privateIPRegex.test(urlObj.hostname)) {
        return { isValid: false, error: "Private network URLs cannot be scanned. Please enter a public website URL" };
      }

      return { isValid: true };
    } catch (error) {
      return { isValid: false, error: "Invalid URL format. Please enter a complete URL (e.g., https://example.com)" };
    }
  };

  const showToast = (title: string, description: string, variant: 'default' | 'destructive' = 'default') => {
    // Simple toast notification implementation
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
      variant === 'destructive' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
    }`;
    toast.innerHTML = `
      <div class="font-medium">${title}</div>
      <div class="text-sm opacity-90">${description}</div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  };

  // Handle URL input change with real-time validation
  const handleUrlChange = (value: string) => {
    setUrl(value);
    
    // Clear error when user starts typing
    if (urlError) {
      setUrlError('');
    }
    
    // Only validate if user has entered something meaningful
    if (value.trim().length > 3) {
      const validation = validateUrl(value);
      if (!validation.isValid) {
        setUrlError(validation.error || '');
      }
    }
  };

  const startScan = useCallback(async () => {
    const validation = validateUrl(url);
    
    if (!validation.isValid) {
      setUrlError(validation.error || "Please enter a valid URL");
      showToast("Invalid URL", validation.error || "Please enter a valid URL", "destructive");
      return;
    }

    // Clear any previous errors
    setUrlError('');
    setIsScanning(true);

    showToast("Scan Started", "Analyzing accessibility compliance...");

    try {
      // Just navigate to results page - API call will happen there
      setIsScanning(false);
      
      showToast("Scan Started", "Redirecting to results page...");
      
      // Navigate to results page with just the URL - fetch data on the results page
      console.log('Navigating to scan results for URL:', url);
      const resultsUrl = `/checker/result?url=${encodeURIComponent(url)}`;
      console.log('Navigating to:', resultsUrl);
      
      try {
        // Try React Router navigation first
        navigate(resultsUrl);
      } catch (navError) {
        console.error('React Router navigation failed, using window.location:', navError);
        // Fallback to direct navigation
        setTimeout(() => {
          window.location.href = resultsUrl;
        }, 500);
      }
      
    } catch (error) {
      console.error('Error starting WCAG scan:', error);
      setIsScanning(false);
      setUrlError((error as Error).message || 'An error occurred while scanning');
      showToast("Scan Failed", (error as Error).message || 'An error occurred while scanning', "destructive");
    }
  }, [url, navigate, user, scanHistory]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isScanning && url.trim()) {
      startScan();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Main Content */}
      <main id="main-content" className="max-w-4xl mx-auto px-4 pt-20 pb-8">
        {/* Main Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 space-y-8"
        >
          {/* URL Input Section */}
          <div className="text-center space-y-6">
            <div className="relative max-w-2xl mx-auto">
              <Input
                type="url"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="www.google.com"
                className={`text-lg h-14 pr-40 text-center border-2 rounded-full ${
                  urlError 
                    ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-200' 
                    : 'border-gray-200 dark:border-gray-600 focus:border-[#0fae96] focus:ring-[#0fae96]/20'
                }`}
                disabled={isScanning}
                aria-describedby={urlError ? 'url-error' : undefined}
                required
              />
              <Button
                onClick={startScan}
                disabled={isScanning || !url.trim() || !!urlError}
                className="absolute right-2 top-2 h-10 px-6 bg-[#0fae96] hover:bg-[#0fae96]/90 text-white rounded-full disabled:opacity-50"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Check Site
                  </>
                )}
              </Button>
            </div>
            
            {urlError && (
              <div id="url-error" className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800 max-w-md mx-auto">
                {urlError}
              </div>
            )}

            <p className="text-sm text-[#0fae96] dark:text-[#5eead4]">
              The scan typically takes 30-60 seconds depending on the size of your website
            </p>
          </div>

          {/* Region Selection */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="flex flex-wrap gap-2 bg-gray-100 dark:bg-slate-700 p-2 rounded-full">
                {regions.map((region) => (
                  <button
                    key={region}
                    onClick={() => setSelectedRegion(region)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedRegion === region
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            {/* Standards Selection */}
            <div className="flex justify-center">
              <div className="flex flex-wrap gap-2">
                {standards.map((standard) => (
                  <button
                    key={standard.id}
                    onClick={() => toggleStandard(standard.id)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-all border ${
                      selectedStandards.includes(standard.id)
                        ? `${standard.color} border-current`
                        : 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-300 border-gray-200 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {standard.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Advanced Testing Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Advanced Testing Options
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {advancedTestingOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id={option.id}
                    checked={advancedOptions.includes(option.id)}
                    onChange={() => toggleAdvancedOption(option.id)}
                    className="w-4 h-4 text-[#0fae96] bg-gray-100 border-gray-300 rounded focus:ring-[#0fae96] dark:focus:ring-[#0fae96] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label 
                    htmlFor={option.id}
                    className="text-sm font-medium text-gray-900 dark:text-gray-300 flex items-center"
                  >
                    {option.label}
                    {option.isPro && (
                      <span className="ml-2 px-2 py-1 text-xs font-medium bg-[#0fae96] text-white rounded-full">
                        PRO
                      </span>
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Section */}
          {isScanning && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4 p-6 bg-[#0fae96]/5 dark:bg-[#0fae96]/10 rounded-xl"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#0fae96] dark:text-[#5eead4]">
                  Analyzing website for accessibility issues...
                </span>
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#0fae96] dark:text-[#5eead4]" />
                </div>
              </div>
              <div className="text-xs text-[#0fae96]/80 dark:text-[#5eead4]/80">
                Fetching HTML content and running WCAG compliance checks...
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Recent Scans History */}
        {scanHistory.length > 0 && activeTab === 'history' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Recent Scans
            </h2>
            <div className="space-y-4">
              {scanHistory.slice(0, 5).map((scan, index) => (
                <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {scan.scanMetadata.url}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(scan.scanMetadata.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        Score: {scan.summary.overallScore}%
                      </span>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default WCAGCheckerSimple;