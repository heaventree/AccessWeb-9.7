import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  Shield, 
  ExternalLink, 
  CheckCircle, 
  Download, 
  Clock, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  Target,
  Camera,
  ArrowLeft,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
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
  principle: 'perceivable' | 'operable' | 'understandable' | 'robust';
  element: string;
  selector: string;
  description: string;
  recommendation: string;
  helpUrl?: string;
}

interface PassedCheck {
  wcagRule: string;
  ruleName: string;
  description: string;
}

export function ScanResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  // New state for the redesigned UI
  const [activeFilter, setActiveFilter] = useState('issues');
  const [expandedIssues, setExpandedIssues] = useState<Record<string, boolean>>({});
  const [allExpanded, setAllExpanded] = useState(false);

  // Filter categories with counts and PRO status
  const getFilterCategories = (result: ScanResult) => [
    {
      id: 'issues',
      label: 'Issues',
      count: result.summary.severityBreakdown.critical + result.summary.severityBreakdown.serious,
      icon: AlertTriangle,
      isPro: false
    },
    {
      id: 'warnings',
      label: 'Warnings',
      count: result.summary.severityBreakdown.moderate + result.summary.severityBreakdown.minor,
      icon: AlertCircle,
      isPro: false
    },
    {
      id: 'passes',
      label: 'Passes',
      count: result.summary.passedChecks,
      icon: CheckCircle,
      isPro: false
    },
    {
      id: 'color-contrast',
      label: 'Color Contrast',
      count: result.issues.filter(issue => issue.wcagRule.includes('1.4.3') || issue.wcagRule.includes('1.4.6')).length,
      icon: Eye,
      isPro: true
    },
    {
      id: 'structure',
      label: 'Structure',
      count: result.issues.filter(issue => issue.principle === 'perceivable').length,
      icon: Target,
      isPro: true
    },
    {
      id: 'responsive',
      label: 'Responsive',
      count: 0,
      icon: TrendingUp,
      isPro: true
    },
    {
      id: 'media',
      label: 'Media',
      count: result.issues.filter(issue => issue.element.includes('img') || issue.element.includes('video')).length,
      icon: Camera,
      isPro: true
    }
  ];

  const toggleAllIssues = () => {
    if (allExpanded) {
      setExpandedIssues({});
    } else {
      const expanded: Record<string, boolean> = {};
      scanResult?.issues.forEach((_, index) => {
        expanded[index.toString()] = true;
      });
      setExpandedIssues(expanded);
    }
    setAllExpanded(!allExpanded);
  };

  const toggleIssue = (index: string) => {
    setExpandedIssues(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-700 dark:text-red-300';
      case 'serious': return 'bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-900/20 dark:border-orange-700 dark:text-orange-300';
      case 'moderate': return 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-700 dark:text-yellow-300';
      case 'minor': return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-300';
      default: return 'bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-900/20 dark:border-gray-700 dark:text-gray-300';
    }
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'serious': return 'bg-orange-600 text-white';
      case 'moderate': return 'bg-yellow-600 text-white';
      case 'minor': return 'bg-blue-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  useEffect(() => {
    console.log('ScanResults: useEffect triggered');
    console.log('ScanResults: Current URL search params:', window.location.search);
    
    const urlParam = searchParams.get('url');
    console.log('ScanResults: Retrieved URL param:', urlParam);
    
    if (urlParam) {
      // Fetch scan results from API
      const fetchScanResults = async () => {
        try {
          setIsLoading(true);
          console.log('ScanResults: Fetching scan data for URL:', urlParam);
          
          const response = await fetch(API_ENDPOINTS.WCAG_SCAN, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: urlParam }),
            credentials: 'include'
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
          }

          const scanData = await response.json();
          console.log('ScanResults: Fetched scan data successfully:', scanData);
          
          if (scanData.success) {
            setScanResult(scanData);
          } else {
            throw new Error(scanData.message || 'Scan failed');
          }
        } catch (error) {
          console.error('ScanResults: Error fetching scan results:', error);
          navigate('/checker');
        } finally {
          setIsLoading(false);
        }
      };

      fetchScanResults();
    } else {
      console.log('ScanResults: No URL parameter found, redirecting to checker');
      navigate('/checker');
      setIsLoading(false);
    }
  }, [searchParams, navigate]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 50) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getConformanceLevelColor = (level: string) => {
    switch (level) {
      case 'AAA': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'AA': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'A': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    }
  };

  const downloadReport = (result: ScanResult, format: 'txt' | 'json') => {
    let content = '';
    let fileName = '';
    let mimeType = '';

    if (format === 'json') {
      content = JSON.stringify(result, null, 2);
      fileName = `wcag-report-${result.scanId}.json`;
      mimeType = 'application/json';
    } else {
      content = `WCAG Accessibility Report
URL: ${result.scanMetadata.url}
Scan Date: ${new Date(result.scanMetadata.timestamp).toLocaleString()}
Overall Score: ${result.summary.overallScore}/100
Conformance Level: WCAG ${result.summary.conformanceLevel}

SUMMARY
=======
Total Issues: ${result.summary.totalIssues}
Critical: ${result.summary.severityBreakdown.critical}
Serious: ${result.summary.severityBreakdown.serious}
Moderate: ${result.summary.severityBreakdown.moderate}
Minor: ${result.summary.severityBreakdown.minor}
Passed Checks: ${result.summary.passedChecks}

ISSUES FOUND
============
${result.issues.map(issue => `
WCAG Rule: ${issue.wcagRule}
Severity: ${issue.severity.toUpperCase()}
Element: ${issue.element}
Description: ${issue.description}
Recommendation: ${issue.recommendation}
---`).join('\n')}`;
      fileName = `wcag-report-${result.scanId}.txt`;
      mimeType = 'text/plain';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="pt-20 flex items-center justify-center h-screen">
          <div className="text-center space-y-4">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
            <h2 className="text-xl font-medium text-gray-900 dark:text-white">Loading Scan Results...</h2>
            <p className="text-gray-600 dark:text-gray-400">Fetching accessibility analysis data</p>
          </div>
        </div>
      </div>
    );
  }

  if (!scanResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="pt-20 container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Scan Results Found</h1>
            <Button onClick={() => navigate('/checker')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Scanner
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="outline" 
              onClick={() => navigate('/checker')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Scanner
            </Button>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              WCAG Accessibility Report
            </h1>
            <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              <span className="break-all">{scanResult.scanMetadata.url}</span>
            </p>
          </div>

          {/* Summary Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {/* Critical */}
            <Card className="bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <span className="text-sm font-medium text-red-700 dark:text-red-300">Critical</span>
                </div>
                <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {scanResult.summary.severityBreakdown.critical}
                </div>
              </CardContent>
            </Card>

            {/* Serious */}
            <Card className="bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-700">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Serious</span>
                </div>
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {scanResult.summary.severityBreakdown.serious}
                </div>
              </CardContent>
            </Card>

            {/* Moderate */}
            <Card className="bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-700">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Moderate</span>
                </div>
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  {scanResult.summary.severityBreakdown.moderate}
                </div>
              </CardContent>
            </Card>

            {/* Minor */}
            <Card className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Minor</span>
                </div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {scanResult.summary.severityBreakdown.minor}
                </div>
              </CardContent>
            </Card>

            {/* Passed */}
            <Card className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">Passed</span>
                </div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {scanResult.summary.passedChecks}
                </div>
              </CardContent>
            </Card>

            {/* Warnings */}
            <Card className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-700">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Warnings</span>
                </div>
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {scanResult.summary.severityBreakdown.moderate + scanResult.summary.severityBreakdown.minor}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 000 placeholder */}
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">000</div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {getFilterCategories(scanResult).map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={activeFilter === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(category.id)}
                  className={`relative ${activeFilter === category.id ? 'bg-blue-600 text-white' : ''}`}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {category.label}
                  <Badge 
                    variant="secondary" 
                    className={`ml-2 ${category.isPro ? 'bg-orange-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                  >
                    {category.isPro ? 'PRO' : category.count}
                  </Badge>
                </Button>
              );
            })}
          </div>

          {/* Open/Close All Controls */}
          <div className="flex justify-end gap-2 mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAllIssues}
            >
              {allExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-2" />
                  Close All
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Open All
                </>
              )}
            </Button>
          </div>

          {/* Issues List */}
          <div className="space-y-4">
            {scanResult.issues.map((issue, index) => (
              <Card key={index} className={`border ${getSeverityColor(issue.severity)}`}>
                <CardContent className="p-0">
                  <div 
                    className="p-4 cursor-pointer"
                    onClick={() => toggleIssue(index.toString())}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {expandedIssues[index.toString()] ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                          <span className="font-medium text-gray-900 dark:text-white">
                            Affected Elements:
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-2 rounded font-mono ml-8">
                          {issue.selector}
                        </div>
                      </div>
                      <Badge className={`${getSeverityBadgeColor(issue.severity)} uppercase text-xs`}>
                        {issue.severity}
                      </Badge>
                    </div>

                    <AnimatePresence>
                      {expandedIssues[index.toString()] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 ml-8 space-y-4"
                        >
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                              WCAG Criteria:
                            </h4>
                            <Badge variant="outline" className="bg-gray-100 dark:bg-gray-700">
                              {issue.wcagRule}
                            </Badge>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                              Description:
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {issue.description}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                              Recommendation:
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {issue.recommendation}
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-2 pt-4">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              View Fix
                            </Button>
                            <Button variant="outline" size="sm">
                              Learn More
                            </Button>
                            <Button variant="outline" size="sm" className="relative">
                              Apply Fix
                              <Badge className="ml-2 bg-orange-600 text-white text-xs">PRO</Badge>
                            </Button>
                            <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700 relative">
                              Get AI Suggestions
                              <Badge className="ml-2 bg-orange-600 text-white text-xs">PRO</Badge>
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Download Actions */}
          <div className="mt-8 flex justify-center gap-4">
            <Button onClick={() => downloadReport(scanResult, 'txt')} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download TXT Report
            </Button>
            <Button onClick={() => downloadReport(scanResult, 'json')} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download JSON Report
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ScanResults;