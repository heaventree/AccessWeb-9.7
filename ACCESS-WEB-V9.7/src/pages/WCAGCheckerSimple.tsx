import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { API_ENDPOINTS } from '../config/api';
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
  
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [currentScan, setCurrentScan] = useState<ScanResult | null>(null);
  const [activeTab, setActiveTab] = useState('scanner');
  const [expandedIssue, setExpandedIssue] = useState<number | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [activeSection, setActiveSection] = useState<string>('summary');
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

  // Get severity badge color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'serious': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'minor': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get conformance level color
  const getConformanceLevelColor = (level: string) => {
    switch (level) {
      case 'AA': return 'bg-green-100 text-green-800 border-green-200';
      case 'A': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'AAA': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-red-100 text-red-800 border-red-200';
    }
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
    setCurrentScan(null);

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
        setCurrentScan(scanData);
        setIsScanning(false);
        
        showToast("Scan Complete", 
          `Found ${scanData.summary.totalIssues} accessibility issues. Score: ${scanData.summary.overallScore}/100`);
        
        // Add to local history and save to localStorage  
        if (user) {
          const newHistory = [scanData, ...scanHistory.slice(0, 9)];
          setScanHistory(newHistory);
          localStorage.setItem(`wcag-scan-history-${user.id}`, JSON.stringify(newHistory));
        }
      } else {
        throw new Error(scanData.message || 'Scan failed');
      }
      
    } catch (error) {
      console.error('Error starting scan:', error);
      setIsScanning(false);
      showToast("Scan Failed", error instanceof Error ? error.message : "Failed to start accessibility scan", "destructive");
    }
  }, [url, user, scanHistory]);

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
      filename = `wcag-scan-${scanResult.scanId}.json`;
      mimeType = 'application/json';
    } else {
      content = `WCAG Accessibility Scan Report
========================================

URL: ${scanResult.scanMetadata.url}
Scan Date: ${new Date(scanResult.scanMetadata.timestamp).toLocaleDateString()}
Overall Score: ${scanResult.summary.overallScore}/100
Total Issues: ${scanResult.summary.totalIssues}
Conformance Level: ${scanResult.summary.conformanceLevel}
Scan Duration: ${scanResult.scanMetadata.scanDuration}ms

Summary:
- Critical Issues: ${scanResult.summary.severityBreakdown.critical}
- Serious Issues: ${scanResult.summary.severityBreakdown.serious}
- Moderate Issues: ${scanResult.summary.severityBreakdown.moderate}
- Minor Issues: ${scanResult.summary.severityBreakdown.minor}
- Passed Checks: ${scanResult.summary.passedChecks}

Issues by WCAG Principle:
- Perceivable: ${scanResult.issuesByPrinciple.perceivable.count} issues
- Operable: ${scanResult.issuesByPrinciple.operable.count} issues
- Understandable: ${scanResult.issuesByPrinciple.understandable.count} issues
- Robust: ${scanResult.issuesByPrinciple.robust.count} issues

Detailed Issues:
${scanResult.issues.map((issue, index) => `
${index + 1}. ${issue.description}
   WCAG Rule: ${issue.wcagRule} (${issue.ruleName})
   Severity: ${issue.severity}
   Principle: ${issue.principle}
   Recommendation: ${issue.recommendation}
   Element: ${issue.element}
   Location: ${issue.location}
`).join('\n')}

Passed Checks:
${scanResult.passedChecks.map((check, index) => `
${index + 1}. ${check.description}
   WCAG Rule: ${check.wcagRule}
`).join('\n')}
`;
      filename = `wcag-scan-${scanResult.scanId}.txt`;
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
                                <span className="break-all">{currentScan.scanMetadata.url}</span>
                              </CardDescription>
                            </div>
                            <div className="text-center lg:text-right space-y-2">
                              <div className={`text-4xl lg:text-5xl font-bold ${getScoreColor(currentScan.summary.overallScore)} mb-1`}>
                                {currentScan.summary.overallScore}<span className="text-2xl lg:text-3xl">/100</span>
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">Accessibility Score</div>
                              <Badge className={`${getConformanceLevelColor(currentScan.summary.conformanceLevel)} text-xs px-2 py-1`}>
                                WCAG {currentScan.summary.conformanceLevel} Level
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Issues Grid - Enhanced Responsive */}
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                              { label: 'Critical', count: currentScan.summary.severityBreakdown.critical, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
                              { label: 'Serious', count: currentScan.summary.severityBreakdown.serious, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20' },
                              { label: 'Moderate', count: currentScan.summary.severityBreakdown.moderate, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
                              { label: 'Minor', count: currentScan.summary.severityBreakdown.minor, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' }
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

                      {/* WCAG Principles Breakdown */}
                      <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="text-xl lg:text-2xl flex items-center gap-3">
                            <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            WCAG Principles Analysis
                          </CardTitle>
                          <CardDescription className="text-base">
                            Issues categorized by the four WCAG principles
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                              { 
                                key: 'perceivable', 
                                title: 'Perceivable', 
                                count: currentScan.issuesByPrinciple.perceivable.count,
                                description: currentScan.wcagGuidelines.principles.perceivable,
                                color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200',
                                textColor: 'text-blue-600 dark:text-blue-400'
                              },
                              { 
                                key: 'operable', 
                                title: 'Operable', 
                                count: currentScan.issuesByPrinciple.operable.count,
                                description: currentScan.wcagGuidelines.principles.operable,
                                color: 'bg-green-50 dark:bg-green-900/20 border-green-200',
                                textColor: 'text-green-600 dark:text-green-400'
                              },
                              { 
                                key: 'understandable', 
                                title: 'Understandable', 
                                count: currentScan.issuesByPrinciple.understandable.count,
                                description: currentScan.wcagGuidelines.principles.understandable,
                                color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200',
                                textColor: 'text-purple-600 dark:text-purple-400'
                              },
                              { 
                                key: 'robust', 
                                title: 'Robust', 
                                count: currentScan.issuesByPrinciple.robust.count,
                                description: currentScan.wcagGuidelines.principles.robust,
                                color: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200',
                                textColor: 'text-orange-600 dark:text-orange-400'
                              }
                            ].map((principle) => (
                              <div key={principle.key} className={`p-4 rounded-lg border-2 ${principle.color} transition-all`}>
                                <div className={`text-2xl font-bold ${principle.textColor} mb-2`}>
                                  {principle.count}
                                </div>
                                <div className="font-medium text-gray-900 dark:text-white mb-2">
                                  {principle.title}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                  {principle.description}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Passed Checks Section */}
                      {currentScan.passedChecks && currentScan.passedChecks.length > 0 && (
                        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                          <CardHeader>
                            <CardTitle className="text-xl lg:text-2xl flex items-center gap-3">
                              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                              Passed Checks ({currentScan.passedChecks.length})
                            </CardTitle>
                            <CardDescription className="text-base">
                              WCAG requirements that your website successfully meets
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {currentScan.passedChecks.map((check, index) => (
                                <div 
                                  key={`${check.wcagRule}-${index}`}
                                  className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                                >
                                  <div className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                    <div className="min-w-0">
                                      <div className="font-medium text-green-800 dark:text-green-300 text-sm">
                                        {check.wcagRule}
                                      </div>
                                      <div className="text-xs text-green-700 dark:text-green-400 mt-1">
                                        {check.description}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Scan Metadata */}
                      <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="text-xl lg:text-2xl flex items-center gap-3">
                            <Clock className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                            Scan Details
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="text-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                              <div className="text-lg font-bold text-gray-900 dark:text-white">
                                {currentScan.scanMetadata.scanDuration}ms
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">Scan Duration</div>
                            </div>
                            <div className="text-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                              <div className="text-lg font-bold text-gray-900 dark:text-white">
                                {currentScan.wcagGuidelines.version}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">WCAG Version</div>
                            </div>
                            <div className="text-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                              <div className="text-lg font-bold text-gray-900 dark:text-white">
                                {new Date(currentScan.scanMetadata.timestamp).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">Scan Date</div>
                            </div>
                            <div className="text-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                              <div className="text-lg font-bold text-gray-900 dark:text-white">
                                #{currentScan.scanId}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">Scan ID</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Issues List - Enhanced Responsive Design */}
                      {currentScan.issues && currentScan.issues.length > 0 && (
                        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                          <CardHeader>
                            <CardTitle className="text-xl lg:text-2xl flex items-center gap-3">
                              <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                              Detailed Issues ({currentScan.issues.length})
                            </CardTitle>
                            <CardDescription className="text-base">
                              Detailed list of accessibility issues with recommendations for fixes
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {currentScan.issues.map((issue, index) => (
                                <motion.div
                                  key={`${issue.wcagRule}-${index}`}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md"
                                >
                                  <div 
                                    className="p-4 sm:p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                                    onClick={() => setExpandedIssue(expandedIssue === index ? null : index)}
                                  >
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                      <div className="flex-1 space-y-3 sm:space-y-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                          <Badge 
                                            className={`${getSeverityColor(issue.severity)} text-white font-medium`}
                                          >
                                            {issue.severity.toUpperCase()}
                                          </Badge>
                                          <Badge variant="outline" className="border-gray-300 dark:border-gray-600">
                                            {issue.wcagRule}
                                          </Badge>
                                          <Badge variant="outline" className="border-gray-300 dark:border-gray-600">
                                            {issue.principle}
                                          </Badge>
                                        </div>
                                        <h4 className="font-medium text-gray-900 dark:text-white text-base sm:text-lg leading-relaxed">
                                          {issue.ruleName}
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                          {issue.description}
                                        </p>
                                      </div>
                                      <div className="flex items-center justify-end">
                                        {expandedIssue === index ? 
                                          <ChevronDown className="w-5 h-5 text-gray-400 transition-transform" /> : 
                                          <ChevronRight className="w-5 h-5 text-gray-400 transition-transform" />
                                        }
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <AnimatePresence>
                                    {expandedIssue === index && (
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
                                          
                                          {issue.selector && (
                                            <div className="space-y-2">
                                              <h5 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                <ExternalLink className="w-4 h-4" />
                                                CSS Selector:
                                              </h5>
                                              <div className="bg-gray-800 dark:bg-slate-800 rounded-lg p-3 overflow-x-auto">
                                                <code className="text-sm text-blue-400 font-mono whitespace-pre">
                                                  {issue.selector}
                                                </code>
                                              </div>
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
                            key={scan.scanId}
                            whileHover={{ scale: 1.02 }}
                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                            onClick={() => setCurrentScan(scan)}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-start sm:items-center gap-3 flex-1">
                                <ExternalLink className="w-5 h-5 text-gray-400 mt-0.5 sm:mt-0 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <h3 className="font-medium text-gray-900 dark:text-white truncate">
                                    {scan.scanMetadata?.url || scan.url || 'Unknown URL'}
                                  </h3>
                                  <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    <span>{scan.summary?.totalIssues || scan.totalIssues || 0} issues found</span>
                                    <span>•</span>
                                    <span>{new Date(scan.scanMetadata?.timestamp || scan.createdAt || Date.now()).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <div className={`text-2xl sm:text-3xl font-bold ${getScoreColor(scan.summary?.overallScore || scan.overallScore || 0)}`}>
                                    {scan.summary?.overallScore || scan.overallScore || 0}/100
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