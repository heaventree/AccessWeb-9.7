import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { BackToTop } from '../components/BackToTop';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { AlertCircle, CheckCircle, Download, ExternalLink, RefreshCw, Clock, Globe, ChevronDown, ChevronRight, Shield, TrendingUp, Search, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScanResult {
  id: number;
  url: string;
  overallScore: number;
  totalIssues: number;
  criticalIssues: number;
  seriousIssues: number;
  moderateIssues: number;
  minorIssues: number;
  status: 'pending' | 'completed' | 'failed';
  errorMessage?: string;
  scanDuration?: number;
  createdAt: string;
  issues?: Issue[];
}

interface Issue {
  id: number;
  issueType: string;
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
  wcagGuideline?: string;
  element?: string;
  message: string;
  recommendation?: string;
}

const WCAGCheckerSimple: React.FC = () => {
  const { user } = useAuth();
  
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [currentScan, setCurrentScan] = useState<ScanResult | null>(null);
  const [activeTab, setActiveTab] = useState('scanner');
  const [expandedIssue, setExpandedIssue] = useState<number | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

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

  const generateMockIssues = useCallback((url: string): Issue[] => {
    // Generate realistic WCAG issues based on common accessibility problems
    const possibleIssues: Omit<Issue, 'id'>[] = [
      {
        issueType: 'missing-alt',
        severity: 'serious',
        wcagGuideline: '1.1.1',
        element: '<img src="hero-image.jpg" class="banner-img">',
        message: 'Image missing alt attribute - Screen readers cannot describe this image to users',
        recommendation: 'Add descriptive alt text: <img src="hero-image.jpg" alt="Company team working together in modern office">'
      },
      {
        issueType: 'color-contrast',
        severity: 'serious',
        wcagGuideline: '1.4.3',
        element: '<button class="btn-secondary" style="color: #999; background: #ccc;">',
        message: 'Insufficient color contrast ratio (2.1:1) - Text is difficult to read',
        recommendation: 'Increase contrast to at least 4.5:1 for normal text or 3:1 for large text'
      },
      {
        issueType: 'missing-form-label',
        severity: 'critical',
        wcagGuideline: '3.3.2',
        element: '<input type="email" placeholder="Enter email" class="form-input">',
        message: 'Form control missing proper label - Users cannot understand the input purpose',
        recommendation: 'Add a label: <label for="email">Email Address</label><input type="email" id="email">'
      },
      {
        issueType: 'missing-doc-language',
        severity: 'serious',
        wcagGuideline: '3.1.1',
        element: '<html>',
        message: 'Document missing language attribute - Screen readers cannot determine language',
        recommendation: 'Add language declaration: <html lang="en"> for English content'
      },
      {
        issueType: 'heading-hierarchy',
        severity: 'moderate',
        wcagGuideline: '1.3.1',
        element: '<h4>Section Title</h4>',
        message: 'Heading structure skips levels (h2 to h4) - Confuses navigation flow',
        recommendation: 'Use proper heading hierarchy: h1 → h2 → h3 → h4 in order'
      },
      {
        issueType: 'empty-link-text',
        severity: 'serious',
        wcagGuideline: '2.4.4',
        element: '<a href="/read-more"><img src="arrow.png"></a>',
        message: 'Link has no accessible text - Screen readers announce "link" with no context',
        recommendation: 'Add descriptive text or aria-label: <a href="/read-more" aria-label="Read more about our services">'
      },
      {
        issueType: 'duplicate-id',
        severity: 'serious',
        wcagGuideline: '4.1.1',
        element: '[id="content"]',
        message: 'Duplicate ID "content" found on multiple elements - Breaks assistive technology',
        recommendation: 'Ensure all IDs are unique across the page'
      },
      {
        issueType: 'keyboard-focus',
        severity: 'moderate',
        wcagGuideline: '2.4.7',
        element: '<button class="custom-btn" style="outline: none;">',
        message: 'Interactive element has no visible focus indicator - Keyboard users cannot see focus',
        recommendation: 'Add visible focus styling: .custom-btn:focus { outline: 2px solid #0066cc; }'
      },
      {
        issueType: 'aria-invalid',
        severity: 'minor',
        wcagGuideline: '4.1.2',
        element: '<div role="button" onclick="submit()">',
        message: 'Element with button role missing keyboard support - Not accessible via keyboard',
        recommendation: 'Add tabindex="0" and keydown handler for Enter/Space keys'
      }
    ];

    // Select random issues based on URL characteristics
    const numIssues = Math.floor(Math.random() * 6) + 3; // 3-8 issues
    const selectedIssues = possibleIssues
      .sort(() => Math.random() - 0.5)
      .slice(0, numIssues)
      .map((issue, index) => ({ ...issue, id: index + 1 }));

    return selectedIssues;
  }, []);

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
    setCurrentScan(null);

    showToast("Scan Started", "Analyzing accessibility compliance...");

    try {
      // Start the scan on the backend
      const response = await fetch('/api/wcag-simple/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      // Get the direct results from the synchronous API
      const scanData = await response.json();
      
      const result: ScanResult = {
        id: scanData.id,
        url: scanData.url,
        overallScore: scanData.overallScore,
        totalIssues: scanData.totalIssues,
        criticalIssues: scanData.criticalIssues,
        seriousIssues: scanData.seriousIssues,
        moderateIssues: scanData.moderateIssues,
        minorIssues: scanData.minorIssues,
        status: scanData.status as 'pending' | 'completed' | 'failed',
        errorMessage: scanData.errorMessage,
        scanDuration: scanData.scanDuration,
        createdAt: scanData.createdAt,
        issues: scanData.issues?.map((issue: any) => ({
          id: issue.id,
          issueType: issue.issueType,
          severity: issue.severity as 'critical' | 'serious' | 'moderate' | 'minor',
          wcagGuideline: issue.wcagGuideline,
          element: issue.element,
          message: issue.message,
          recommendation: issue.recommendation
        })) || []
      };

      setCurrentScan(result);
      setIsScanning(false);
      
      if (result.status === 'completed') {
        showToast("Scan Complete", `Found ${result.totalIssues} accessibility issues. Score: ${result.overallScore}/100`);
        
        // Add to local history and save to localStorage
        if (user) {
          const newHistory = [result, ...scanHistory.slice(0, 9)];
          setScanHistory(newHistory);
          localStorage.setItem(`wcag-scan-history-${user.id}`, JSON.stringify(newHistory));
        }
      } else if (result.status === 'failed') {
        showToast("Scan Failed", result.errorMessage || "The accessibility scan failed to complete", "destructive");
      }
      
    } catch (error) {
      console.error('Error starting scan:', error);
      setIsScanning(false);
      showToast("Scan Failed", error instanceof Error ? error.message : "Failed to start accessibility scan", "destructive");
    }
  }, [url, user]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'serious': return 'bg-orange-500 text-white';
      case 'moderate': return 'bg-yellow-500 text-white';
      case 'minor': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const downloadReport = (scanResult: ScanResult, format: 'json' | 'txt') => {
    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === 'json') {
      content = JSON.stringify(scanResult, null, 2);
      filename = `wcag-scan-${scanResult.id}.json`;
      mimeType = 'application/json';
    } else {
      content = `WCAG Accessibility Scan Report
========================================

URL: ${scanResult.url}
Scan Date: ${new Date(scanResult.createdAt).toLocaleDateString()}
Overall Score: ${scanResult.overallScore}/100
Total Issues: ${scanResult.totalIssues}

Summary:
- Critical Issues: ${scanResult.criticalIssues}
- Serious Issues: ${scanResult.seriousIssues}
- Moderate Issues: ${scanResult.moderateIssues}
- Minor Issues: ${scanResult.minorIssues}

Issues Found:
${scanResult.issues?.map((issue, index) => `
${index + 1}. ${issue.message}
   Severity: ${issue.severity}
   WCAG Guideline: ${issue.wcagGuideline || 'N/A'}
   Recommendation: ${issue.recommendation || 'N/A'}
   Element: ${issue.element || 'N/A'}
`).join('\n') || 'No issues found'}
`;
      filename = `wcag-scan-${scanResult.id}.txt`;
      mimeType = 'text/plain';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    showToast("Download Complete", `${format.toUpperCase()} report downloaded successfully`);
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <Navigation />
      <main id="main-content" className="pt-20 min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-8 lg:mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-blue-600 dark:text-blue-400 mr-3" />
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                    WCAG Checker
                  </h1>
                </div>
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                  Professional accessibility testing with real WCAG 2.1 AA compliance analysis. 
                  Get detailed insights and actionable recommendations to make your website accessible to everyone.
                </p>
              </motion.div>
            </div>

            {/* Tab Navigation - Mobile Responsive */}
            <div className="flex flex-col sm:flex-row border-b border-gray-200 dark:border-gray-700 mb-6 lg:mb-8">
              <div className="flex overflow-x-auto sm:overflow-visible">
                <button
                  onClick={() => setActiveTab('scanner')}
                  className={`flex items-center px-4 sm:px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-all duration-200 ${
                    activeTab === 'scanner'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Search className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">URL </span>Scanner
                </button>
                {user && (
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`flex items-center px-4 sm:px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-all duration-200 ${
                      activeTab === 'history'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <History className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Scan </span>History
                  </button>
                )}
              </div>
            </div>

            {/* Scanner Tab */}
            {activeTab === 'scanner' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6 lg:space-y-8"
              >
                {/* URL Input Section - Enhanced Responsive Design */}
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl lg:text-2xl flex items-center gap-3">
                      <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      Website URL
                    </CardTitle>
                    <CardDescription className="text-base">
                      Enter the URL of the website you want to test for WCAG 2.1 AA compliance
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <Input
                          type="url"
                          placeholder="https://example.com"
                          value={url}
                          onChange={(e) => handleUrlChange(e.target.value)}
                          disabled={isScanning}
                          className={`h-12 text-base ${urlError ? 'border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-slate-700`}
                          aria-describedby={urlError ? "url-error" : undefined}
                        />
                        {urlError && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            id="url-error" 
                            className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-start gap-2"
                            role="alert"
                          >
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{urlError}</span>
                          </motion.div>
                        )}
                      </div>
                      <Button 
                        onClick={startScan} 
                        disabled={isScanning || !url.trim() || !!urlError}
                        className="h-12 px-6 min-w-[140px] bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                        size="lg"
                      >
                        {isScanning ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Scanning...
                          </>
                        ) : (
                          <>
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Start Scan
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {/* URL Examples - Mobile Responsive */}
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Try these examples:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {[
                          'https://example.com',
                          'https://www.google.com', 
                          'https://github.com'
                        ].map((exampleUrl) => (
                          <button
                            key={exampleUrl}
                            className="text-left px-3 py-2 text-sm bg-gray-100 dark:bg-slate-700 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-200 font-mono"
                            onClick={() => handleUrlChange(exampleUrl)}
                          >
                            {exampleUrl}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Progress Section - Enhanced */}
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
                        <Progress value={70} className="h-2" />
                        <div className="text-xs text-blue-600 dark:text-blue-400">
                          Fetching HTML content and running WCAG compliance checks...
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>

                {/* Results Section */}
                <AnimatePresence>
                  {currentScan && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      {/* Summary Card - Enhanced Responsive Design */}
                      <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                        <CardHeader className="pb-4">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex-1">
                              <CardTitle className="text-xl lg:text-2xl flex items-center gap-3 mb-2">
                                <CheckCircle className="w-6 h-6 text-green-500" />
                                Scan Complete
                              </CardTitle>
                              <CardDescription className="flex items-center gap-2 text-base">
                                <ExternalLink className="w-4 h-4" />
                                <span className="break-all">{currentScan.url}</span>
                              </CardDescription>
                            </div>
                            <div className="text-center lg:text-right">
                              <div className={`text-4xl lg:text-5xl font-bold ${getScoreColor(currentScan.overallScore)} mb-1`}>
                                {currentScan.overallScore}<span className="text-2xl lg:text-3xl">/100</span>
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">Accessibility Score</div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Issues Grid - Enhanced Responsive */}
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                              { label: 'Critical', count: currentScan.criticalIssues, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
                              { label: 'Serious', count: currentScan.seriousIssues, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20' },
                              { label: 'Moderate', count: currentScan.moderateIssues, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
                              { label: 'Minor', count: currentScan.minorIssues, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' }
                            ].map((item) => (
                              <div key={item.label} className={`text-center p-4 rounded-lg ${item.bg} transition-colors`}>
                                <div className={`text-2xl lg:text-3xl font-bold ${item.color}`}>
                                  {item.count}
                                </div>
                                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">
                                  {item.label}
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Action Buttons - Enhanced */}
                          <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button
                              variant="outline"
                              size="lg"
                              onClick={() => downloadReport(currentScan, 'txt')}
                              className="bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-600"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download Report
                            </Button>
                            <Button
                              variant="outline"
                              size="lg"
                              onClick={() => downloadReport(currentScan, 'json')}
                              className="bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-600"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download JSON
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Issues List - Enhanced Responsive Design */}
                      {currentScan.issues && currentScan.issues.length > 0 && (
                        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                          <CardHeader>
                            <CardTitle className="text-xl lg:text-2xl flex items-center gap-3">
                              <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                              Issues Found
                            </CardTitle>
                            <CardDescription className="text-base">
                              Detailed list of accessibility issues with recommendations for fixes
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {currentScan.issues.map((issue) => (
                                <motion.div
                                  key={issue.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md"
                                >
                                  <div 
                                    className="p-4 sm:p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                                    onClick={() => setExpandedIssue(expandedIssue === issue.id ? null : issue.id)}
                                  >
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                      <div className="flex-1 space-y-3 sm:space-y-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                          <Badge 
                                            className={`${getSeverityColor(issue.severity)} text-white font-medium`}
                                          >
                                            {issue.severity.toUpperCase()}
                                          </Badge>
                                          {issue.wcagGuideline && (
                                            <Badge variant="outline" className="border-gray-300 dark:border-gray-600">
                                              WCAG {issue.wcagGuideline}
                                            </Badge>
                                          )}
                                        </div>
                                        <h4 className="font-medium text-gray-900 dark:text-white text-base sm:text-lg leading-relaxed">
                                          {issue.message}
                                        </h4>
                                      </div>
                                      <div className="flex items-center justify-end">
                                        {expandedIssue === issue.id ? 
                                          <ChevronDown className="w-5 h-5 text-gray-400 transition-transform" /> : 
                                          <ChevronRight className="w-5 h-5 text-gray-400 transition-transform" />
                                        }
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <AnimatePresence>
                                    {expandedIssue === issue.id && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-700"
                                      >
                                        <div className="p-4 sm:p-6 space-y-4">
                                          {issue.recommendation && (
                                            <div className="space-y-2">
                                              <h5 className="font-semibold text-green-700 dark:text-green-400 flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4" />
                                                Recommended Fix:
                                              </h5>
                                              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed pl-6">
                                                {issue.recommendation}
                                              </p>
                                            </div>
                                          )}
                                          
                                          {issue.element && (
                                            <div className="space-y-2">
                                              <h5 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                <ExternalLink className="w-4 h-4" />
                                                HTML Element:
                                              </h5>
                                              <div className="bg-gray-800 dark:bg-slate-800 rounded-lg p-3 overflow-x-auto">
                                                <code className="text-sm text-green-400 font-mono whitespace-pre">
                                                  {issue.element}
                                                </code>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </motion.div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* History Tab - Enhanced Responsive Design */}
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
                            key={scan.id}
                            whileHover={{ scale: 1.02 }}
                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                            onClick={() => setCurrentScan(scan)}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-start sm:items-center gap-3 flex-1">
                                <ExternalLink className="w-5 h-5 text-gray-400 mt-0.5 sm:mt-0 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <h3 className="font-medium text-gray-900 dark:text-white truncate">
                                    {scan.url}
                                  </h3>
                                  <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    <span>{scan.totalIssues} issues found</span>
                                    <span>•</span>
                                    <span>{new Date(scan.createdAt).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <div className={`text-2xl sm:text-3xl font-bold ${getScoreColor(scan.overallScore)}`}>
                                    {scan.overallScore}/100
                                  </div>
                                  <div className="text-xs text-gray-500">Score</div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
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
        </div>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default WCAGCheckerSimple;