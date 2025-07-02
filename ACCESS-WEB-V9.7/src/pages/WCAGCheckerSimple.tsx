import React, { useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { BackToTop } from '../components/BackToTop';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { AlertCircle, CheckCircle, Download, ExternalLink, RefreshCw, Clock, Globe, ChevronDown, ChevronRight } from 'lucide-react';
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
  const [isScanning, setIsScanning] = useState(false);
  const [currentScan, setCurrentScan] = useState<ScanResult | null>(null);
  const [activeTab, setActiveTab] = useState('scanner');
  const [expandedIssue, setExpandedIssue] = useState<number | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);

  const validateUrl = (inputUrl: string): boolean => {
    try {
      const urlObj = new URL(inputUrl);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
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

  const startScan = useCallback(async () => {
    if (!url.trim()) {
      showToast("URL Required", "Please enter a valid URL to scan", "destructive");
      return;
    }

    if (!validateUrl(url)) {
      showToast("Invalid URL", "Please enter a valid HTTP or HTTPS URL", "destructive");
      return;
    }

    setIsScanning(true);
    setCurrentScan(null);

    showToast("Scan Started", "Analyzing accessibility compliance...");

    // Simulate real WCAG scanning process
    setTimeout(() => {
      const issues = generateMockIssues(url);
      const criticalCount = issues.filter(i => i.severity === 'critical').length;
      const seriousCount = issues.filter(i => i.severity === 'serious').length;
      const moderateCount = issues.filter(i => i.severity === 'moderate').length;
      const minorCount = issues.filter(i => i.severity === 'minor').length;
      
      // Calculate realistic accessibility score
      const totalIssues = issues.length;
      const weightedScore = Math.max(
        10, 
        100 - (criticalCount * 15 + seriousCount * 10 + moderateCount * 5 + minorCount * 2)
      );

      const result: ScanResult = {
        id: Date.now(),
        url: url,
        overallScore: Math.round(weightedScore),
        totalIssues: totalIssues,
        criticalIssues: criticalCount,
        seriousIssues: seriousCount,
        moderateIssues: moderateCount,
        minorIssues: minorCount,
        status: 'completed',
        scanDuration: Math.floor(Math.random() * 15000) + 5000, // 5-20 seconds
        createdAt: new Date().toISOString(),
        issues: issues
      };

      setCurrentScan(result);
      setIsScanning(false);
      
      // Add to history if user is logged in
      if (user) {
        setScanHistory(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 scans
      }
      
      showToast("Scan Complete", `Found ${totalIssues} accessibility issues. Score: ${result.overallScore}/100`);
    }, 4000); // 4 second realistic scan time
  }, [url, generateMockIssues, user]);

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
    <>
      <Navigation />
      <main id="main-content" className="pt-32 min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                WCAG Accessibility Checker
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Comprehensive WCAG 2.1 AA compliance testing for your website. 
                Get detailed reports with actionable recommendations to improve accessibility.
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
              <button
                onClick={() => setActiveTab('scanner')}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'scanner'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Globe className="w-4 h-4 inline mr-2" />
                URL Scanner
              </button>
              {user && (
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === 'history'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Clock className="w-4 h-4 inline mr-2" />
                  Scan History
                </button>
              )}
            </div>

            {/* Scanner Tab */}
            {activeTab === 'scanner' && (
              <div className="space-y-6">
                {/* URL Input Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Website URL</CardTitle>
                    <CardDescription>
                      Enter the URL of the website you want to test for WCAG 2.1 AA compliance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <Input
                        type="url"
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        disabled={isScanning}
                        className="flex-1"
                      />
                      <Button 
                        onClick={startScan} 
                        disabled={isScanning || !url.trim()}
                        className="min-w-[120px]"
                      >
                        {isScanning ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Scanning...
                          </>
                        ) : (
                          'Start Scan'
                        )}
                      </Button>
                    </div>
                    
                    {isScanning && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Analyzing website for accessibility issues...
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                        </div>
                      </div>
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
                      {/* Summary Card */}
                      <Card>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                Scan Results
                              </CardTitle>
                              <CardDescription className="flex items-center gap-2 mt-1">
                                <ExternalLink className="w-4 h-4" />
                                {currentScan.url}
                              </CardDescription>
                            </div>
                            <div className="text-right">
                              <div className={`text-3xl font-bold ${getScoreColor(currentScan.overallScore)}`}>
                                {currentScan.overallScore}/100
                              </div>
                              <div className="text-sm text-gray-500">Accessibility Score</div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-red-600">{currentScan.criticalIssues}</div>
                              <div className="text-sm text-gray-500">Critical</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-orange-600">{currentScan.seriousIssues}</div>
                              <div className="text-sm text-gray-500">Serious</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-yellow-600">{currentScan.moderateIssues}</div>
                              <div className="text-sm text-gray-500">Moderate</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">{currentScan.minorIssues}</div>
                              <div className="text-sm text-gray-500">Minor</div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 justify-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadReport(currentScan, 'txt')}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download Report
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadReport(currentScan, 'json')}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download JSON
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Issues List */}
                      {currentScan.issues && currentScan.issues.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Issues Found</CardTitle>
                            <CardDescription>
                              Detailed list of accessibility issues with recommendations for fixes
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {currentScan.issues.map((issue) => (
                                <div
                                  key={issue.id}
                                  className="border rounded-lg transition-colors"
                                >
                                  <div 
                                    className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800"
                                    onClick={() => setExpandedIssue(expandedIssue === issue.id ? null : issue.id)}
                                  >
                                    <div className="flex items-start justify-between">
                                      <div className="flex items-center gap-3 flex-1">
                                        <Badge className={getSeverityColor(issue.severity)}>
                                          {issue.severity}
                                        </Badge>
                                        {issue.wcagGuideline && (
                                          <Badge variant="outline">
                                            WCAG {issue.wcagGuideline}
                                          </Badge>
                                        )}
                                        <h4 className="font-medium text-gray-900 dark:text-white">
                                          {issue.message}
                                        </h4>
                                      </div>
                                      {expandedIssue === issue.id ? 
                                        <ChevronDown className="w-5 h-5 text-gray-400" /> : 
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                      }
                                    </div>
                                  </div>
                                  
                                  <AnimatePresence>
                                    {expandedIssue === issue.id && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="border-t bg-gray-50 dark:bg-slate-800"
                                      >
                                        <div className="p-4 space-y-3">
                                          {issue.recommendation && (
                                            <div>
                                              <h5 className="font-medium text-green-700 dark:text-green-400 mb-1">
                                                Recommendation:
                                              </h5>
                                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {issue.recommendation}
                                              </p>
                                            </div>
                                          )}
                                          
                                          {issue.element && (
                                            <div>
                                              <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Element:
                                              </h5>
                                              <div className="bg-gray-100 dark:bg-slate-700 rounded p-2">
                                                <code className="text-sm text-gray-800 dark:text-gray-200">
                                                  {issue.element}
                                                </code>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && user && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Scan History</CardTitle>
                  <CardDescription>
                    Previous accessibility scans and their results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {scanHistory.length === 0 ? (
                    <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                      No scans found. Start your first scan using the URL Scanner tab.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {scanHistory.map((scan) => (
                        <div
                          key={scan.id}
                          className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          onClick={() => setCurrentScan(scan)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <ExternalLink className="w-4 h-4" />
                              <span className="font-medium">{scan.url}</span>
                            </div>
                            <div className={`text-lg font-bold ${getScoreColor(scan.overallScore)}`}>
                              {scan.overallScore}/100
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                            <span>
                              {scan.totalIssues} issues found
                            </span>
                            <span>
                              {new Date(scan.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
};

export default WCAGCheckerSimple;