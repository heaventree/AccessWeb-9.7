import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { RefreshCw, Search, History, ExternalLink, AlertTriangle, ExternalLinkIcon, Eye, Lightbulb, Users } from 'lucide-react';
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
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [expandedIssues, setExpandedIssues] = useState<Record<string, boolean>>({});
  
  // New state for the redesigned UI
  const [selectedRegion, setSelectedRegion] = useState('EU');
  const [selectedStandards, setSelectedStandards] = useState(['WCAG 2.1', 'WCAG 2.2']);
  const [advancedOptions, setAdvancedOptions] = useState<string[]>([]);

  // Region options
  const regions = ['EU', 'UK', 'USA', 'Canada', 'Australia', 'Japan', 'Global'];
  
  // Standards options with colors - matching the screenshot
  const standards = [
    { id: 'EN 301 549', label: 'EN 301 549', color: 'bg-red-100 text-red-700 border border-red-200' },
    { id: 'EAA', label: 'EAA', color: 'bg-orange-100 text-orange-700 border border-orange-200' },
    { id: 'WCAG 2.1', label: 'WCAG 2.1', color: 'bg-blue-100 text-blue-700 border border-blue-200' },
    { id: 'WCAG 2.2', label: 'WCAG 2.2', color: 'bg-purple-100 text-purple-700 border border-purple-200' }
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

    // Clear any previous errors and results
    setUrlError('');
    setScanResult(null);
    setShowResults(false);
    setIsScanning(true);

    showToast("Scan Started", "Analyzing accessibility compliance...");

    try {
      console.log('Starting WCAG scan for URL:', url);
      
      const response = await fetch(`${API_ENDPOINTS.WCAG_SCAN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('WCAG API Response:', data);

      if (!data.success) {
        throw new Error(data.error || 'Scan failed');
      }

      // Update scan result and show results section
      setScanResult(data);
      setShowResults(true);
      showToast("Scan Complete", "Accessibility analysis completed successfully!");

      // Save to scan history
      if (user) {
        const newScanResult = {
          ...data,
          scanMetadata: {
            ...data.scanMetadata,
            url: url,
            timestamp: new Date().toISOString(),
          }
        };
        
        const updatedHistory = [newScanResult, ...scanHistory.slice(0, 9)];
        setScanHistory(updatedHistory);
        
        try {
          localStorage.setItem(`wcag-scan-history-${user.id}`, JSON.stringify(updatedHistory));
        } catch (error) {
          console.error('Error saving scan history to localStorage:', error);
        }
      }
      
    } catch (error) {
      console.error('Error during WCAG scan:', error);
      setUrlError((error as Error).message || 'An error occurred while scanning');
      showToast("Scan Failed", (error as Error).message || 'An error occurred while scanning', "destructive");
    } finally {
      setIsScanning(false);
    }
  }, [url, user, scanHistory]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isScanning && url.trim()) {
      startScan();
    }
  };

  // Helper function to toggle issue expansion
  const toggleIssue = (index: string) => {
    setExpandedIssues(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Helper function to get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 border-red-200 text-red-800';
      case 'serious': return 'bg-orange-100 border-orange-200 text-orange-800';  
      case 'moderate': return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      case 'minor': return 'bg-blue-100 border-blue-200 text-blue-800';
      default: return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  // Helper function to get severity badge
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'serious': return 'bg-orange-600 text-white';
      case 'moderate': return 'bg-yellow-600 text-white';
      case 'minor': return 'bg-blue-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Main Content */}
      <main id="main-content" className="max-w-6xl mx-auto px-4 pt-24 pb-8">
        <div className="text-center space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              WCAG 2.1 Accessibility Checker
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Test your website against WCAG 2.1 standards
            </p>
          </div>

          {/* Main Container with all sections */}
          <div className="w-full">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-600 p-8 space-y-6">
              
              {/* Region Selection */}
              <div className="flex justify-center">
                <div className="flex gap-2 flex-wrap justify-center">
                  {regions.map((region) => (
                    <button
                      key={region}
                      onClick={() => setSelectedRegion(region)}
                      className={`px-4 py-2 text-sm font-medium transition-all rounded-lg border ${
                        selectedRegion === region
                          ? 'bg-blue-100 text-blue-700 border-blue-200'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 dark:bg-slate-700 dark:text-gray-300 dark:border-slate-600 dark:hover:bg-slate-600'
                      }`}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              </div>

              {/* Standards Selection */}
              <div className="flex justify-center">
                <div className="flex gap-3 justify-center flex-wrap">
                  {standards.map((standard) => (
                    <span
                      key={standard.id}
                      className={`px-4 py-2 rounded-full text-sm font-medium ${standard.color}`}
                    >
                      {standard.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* URL Input Section */}
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type="url"
                    value={url}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="https://google.com"
                    className={`text-base h-14 pr-36 pl-4 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full ${
                      urlError 
                        ? 'text-red-600 dark:text-red-400 border-red-300' 
                        : 'text-gray-900 dark:text-white'
                    }`}
                    disabled={isScanning}
                    aria-describedby={urlError ? 'url-error' : undefined}
                    required
                  />
                  <Button
                    onClick={startScan}
                    disabled={isScanning || !url.trim() || !!urlError}
                    className="absolute right-2 top-2 h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 flex items-center gap-2 font-medium text-sm"
                  >
                    {isScanning ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        {showResults ? 'Check Site Again' : 'Check Site'}
                      </>
                    )}
                  </Button>
                </div>
                
                {urlError && (
                  <div id="url-error" className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                    {urlError}
                  </div>
                )}

                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  The scan typically takes 30-60 seconds depending on the size of your website
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Progress Section */}
        {isScanning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 w-full space-y-4 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Analyzing website for accessibility issues...
              </span>
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="text-xs text-blue-600/80 dark:text-blue-400/80">
              Fetching HTML content and running WCAG compliance checks...
            </div>
          </motion.div>
        )}

        {/* Results Section */}
        {showResults && scanResult && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 w-full space-y-6"
          >
            {/* Summary Header */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-600 p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Accessibility Report for {scanResult.scanMetadata?.url || url}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {scanResult.summary?.severityBreakdown?.critical || 0}
                  </div>
                  <div className="text-sm text-red-600 dark:text-red-400">Critical Issues</div>
                </div>
                
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {scanResult.summary?.severityBreakdown?.serious || 0}
                  </div>
                  <div className="text-sm text-orange-600 dark:text-orange-400">Serious Issues</div>
                </div>
                
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {scanResult.summary?.severityBreakdown?.moderate || 0}
                  </div>
                  <div className="text-sm text-yellow-600 dark:text-yellow-400">Moderate Issues</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {scanResult.summary?.passedChecks || 0}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">Passed Checks</div>
                </div>
              </div>
            </div>

            {/* Issues List */}
            {scanResult.issues && scanResult.issues.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Issues Found ({scanResult.issues.length})
                </h3>
                
                {scanResult.issues.map((issue, index) => (
                  <div 
                    key={index}
                    className={`border rounded-lg overflow-hidden ${getSeverityColor(issue.severity)}`}
                  >
                    {/* Issue Header - Matching the provided image */}
                    <div 
                      className="p-4 cursor-pointer flex items-center justify-between hover:bg-opacity-80"
                      onClick={() => toggleIssue(index.toString())}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${getSeverityBadge(issue.severity)}`}>
                            {issue.severity}
                          </span>
                          <h4 className="font-medium text-gray-900">
                            {issue.ruleName || issue.wcagRule}
                          </h4>
                        </div>
                        
                        <div className="text-sm text-gray-700 mb-3">
                          <strong>Affected Elements:</strong>
                        </div>
                        
                        <div className="bg-gray-100 p-3 rounded text-sm font-mono text-gray-800 mb-3">
                          {issue.htmlSnippet || issue.element || issue.selector}
                        </div>
                        
                        <div className="flex gap-3">
                          <button className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:underline">
                            <Eye className="w-4 h-4" />
                            View Fix
                          </button>
                          <button className="flex items-center gap-1 text-purple-600 text-sm font-medium hover:underline">
                            <Lightbulb className="w-4 h-4" />
                            Learn More
                          </button>
                          <button className="flex items-center gap-1 text-purple-600 text-sm font-medium hover:underline bg-purple-100 px-3 py-1 rounded">
                            <Users className="w-4 h-4" />
                            Get AI Suggestions
                          </button>
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        <AlertTriangle className={`w-5 h-5 transform transition-transform ${
                          expandedIssues[index.toString()] ? 'rotate-180' : ''
                        }`} />
                      </div>
                    </div>

                    {/* Expanded Issue Details */}
                    {expandedIssues[index.toString()] && (
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        className="border-t bg-white bg-opacity-50 p-4"
                      >
                        <div className="space-y-3">
                          <div>
                            <h5 className="font-medium text-gray-900 mb-1">Description:</h5>
                            <p className="text-sm text-gray-700">{issue.description}</p>
                          </div>
                          
                          <div>
                            <h5 className="font-medium text-gray-900 mb-1">How to Fix:</h5>
                            <p className="text-sm text-gray-700">{issue.recommendation}</p>
                          </div>
                          
                          <div>
                            <h5 className="font-medium text-gray-900 mb-1">WCAG Rule:</h5>
                            <p className="text-sm text-gray-700">{issue.wcagRule} - {issue.principle}</p>
                          </div>
                          
                          {issue.location && (
                            <div>
                              <h5 className="font-medium text-gray-900 mb-1">Location:</h5>
                              <p className="text-sm text-gray-700">{issue.location}</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Call to Action */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Need Help Fixing These Issues?
              </h3>
              <p className="text-blue-700 dark:text-blue-300 mb-4">
                Our team of accessibility experts can help you implement these fixes and ensure ongoing compliance.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Get Expert Help
              </Button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default WCAGCheckerSimple;