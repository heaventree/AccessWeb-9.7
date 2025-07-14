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
      // Start the WCAG scan using centralized API configuration
      const response = await fetch(API_ENDPOINTS.WCAG_SCAN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      // Get the comprehensive WCAG results
      const scanData = await response.json();
      
      if (scanData.success) {
        setIsScanning(false);
        
        showToast("Scan Complete", 
          `Found ${scanData.summary.totalIssues} accessibility issues. Score: ${scanData.summary.overallScore}/100`);
        
        // Add to local history and save to localStorage  
        if (user) {
          const newHistory = [scanData, ...scanHistory.slice(0, 9)];
          setScanHistory(newHistory);
          localStorage.setItem(`wcag-scan-history-${user.id}`, JSON.stringify(newHistory));
        }
        
        // Navigate to results page with scan data
        const encodedData = encodeURIComponent(JSON.stringify(scanData));
        navigate(`/scan-results?data=${encodedData}`);
      } else {
        throw new Error(scanData.message || 'Scan failed');
      }
      
    } catch (error) {
      console.error('Error starting WCAG scan:', error);
      setIsScanning(false);
      setUrlError((error as Error).message || 'An error occurred while scanning');
      showToast("Scan Failed", (error as Error).message || 'An error occurred while scanning', "destructive");
    }
  }, [url, showToast, navigate, user, scanHistory]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isScanning && url.trim()) {
      startScan();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Main Content */}
      <main id="main-content" className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
            WCAG Accessibility Scanner
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Analyze your website for accessibility compliance with WCAG 2.2 standards and get detailed reports
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex justify-center">
          <div className="flex bg-white dark:bg-slate-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('scanner')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                activeTab === 'scanner'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Search className="w-4 h-4 inline mr-2" />
              URL Scanner
            </button>
            {user && (
              <button
                onClick={() => setActiveTab('history')}
                className={`px-6 py-2 rounded-md font-medium transition-all ${
                  activeTab === 'history'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <History className="w-4 h-4 inline mr-2" />
                Scan History
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Scanner Tab */}
          {activeTab === 'scanner' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* URL Input Card */}
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl lg:text-2xl flex items-center gap-3">
                    <Search className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    Website URL Scanner
                  </CardTitle>
                  <CardDescription className="text-base">
                    Enter any public website URL to perform a comprehensive WCAG accessibility analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* URL Input Section */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="url-input" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Website URL *
                      </label>
                      <div className="relative">
                        <Input
                          id="url-input"
                          type="url"
                          value={url}
                          onChange={(e) => handleUrlChange(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="https://example.com"
                          className={`text-lg h-12 pr-32 ${
                            urlError 
                              ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-200' 
                              : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-200'
                          }`}
                          disabled={isScanning}
                          aria-describedby={urlError ? 'url-error' : undefined}
                          required
                        />
                        <Button
                          onClick={startScan}
                          disabled={isScanning || !url.trim() || !!urlError}
                          className="absolute right-1 top-1 h-10 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50"
                        >
                          {isScanning ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Scanning...
                            </>
                          ) : (
                            <>
                              <Search className="w-4 h-4 mr-2" />
                              Scan Now
                            </>
                          )}
                        </Button>
                      </div>
                      {urlError && (
                        <div id="url-error" className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-200 dark:border-red-800">
                          {urlError}
                        </div>
                      )}
                    </div>
                    
                    {/* Progress Section */}
                    {isScanning && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                            Analyzing website for accessibility issues...
                          </span>
                          <div className="flex items-center space-x-2">
                            <RefreshCw className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
                          </div>
                        </div>
                        <div className="text-xs text-blue-600 dark:text-blue-400">
                          Fetching HTML content and running WCAG compliance checks...
                        </div>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Scans History */}
              {scanHistory.length > 0 && (
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl lg:text-2xl flex items-center gap-3">
                      <History className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                      Recent Scans
                    </CardTitle>
                    <CardDescription className="text-base">
                      View your recent accessibility scan results
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {scanHistory.slice(0, 5).map((scan, index) => (
                        <div 
                          key={scan.scanId} 
                          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors cursor-pointer"
                          onClick={() => {
                            const encodedData = encodeURIComponent(JSON.stringify(scan));
                            navigate(`/scan-results?data=${encodedData}`);
                          }}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 dark:text-white truncate">
                              {scan.scanMetadata.url}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(scan.scanMetadata.timestamp).toLocaleDateString()} • 
                              Score: {scan.summary.overallScore}/100 • 
                              {scan.summary.totalIssues} issues
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl lg:text-2xl flex items-center gap-3">
                    <History className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    Your Scan History
                  </CardTitle>
                  <CardDescription className="text-base">
                    Previous accessibility scans and their results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {scanHistory.length === 0 ? (
                    <div className="text-center py-12">
                      <History className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                      <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                        No scans found yet
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
                        Start your first scan using the URL Scanner tab to see results here.
                      </p>
                      <Button
                        onClick={() => setActiveTab('scanner')}
                        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                      >
                        <Search className="w-4 h-4 mr-2" />
                        Start Your First Scan
                      </Button>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:gap-6">
                      {scanHistory.map((scan) => (
                        <motion.div
                          key={scan.scanId}
                          whileHover={{ scale: 1.02 }}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                          onClick={() => {
                            const encodedData = encodeURIComponent(JSON.stringify(scan));
                            navigate(`/scan-results?data=${encodedData}`);
                          }}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-start sm:items-center gap-3 flex-1">
                              <ExternalLink className="w-5 h-5 text-gray-400 mt-0.5 sm:mt-0 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <h3 className="font-medium text-gray-900 dark:text-white truncate">
                                  {scan.scanMetadata?.url || 'Unknown URL'}
                                </h3>
                                <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                  <span>{scan.summary?.totalIssues || 0} issues found</span>
                                  <span>•</span>
                                  <span>{new Date(scan.scanMetadata?.timestamp || Date.now()).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className={`text-2xl sm:text-3xl font-bold ${
                                  (scan.summary?.overallScore || 0) >= 80 ? 'text-green-600 dark:text-green-400' :
                                  (scan.summary?.overallScore || 0) >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                                  'text-red-600 dark:text-red-400'
                                }`}>
                                  {scan.summary?.overallScore || 0}/100
                                </div>
                                <div className="text-xs text-gray-500">Score</div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default WCAGCheckerSimple;