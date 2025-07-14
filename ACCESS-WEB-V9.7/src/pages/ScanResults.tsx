import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { BackToTop } from '../components/BackToTop';
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

  useEffect(() => {
    const resultData = searchParams.get('data');
    if (resultData) {
      try {
        const decodedData = decodeURIComponent(resultData);
        const parsedData = JSON.parse(decodedData);
        setScanResult(parsedData);
      } catch (error) {
        console.error('Error parsing scan result data:', error);
        navigate('/checker');
      }
    } else {
      navigate('/checker');
    }
    setIsLoading(false);
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
        <Navigation />
        <div className="pt-20 flex items-center justify-center h-screen">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!scanResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Navigation />
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navigation />
      
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
              Accessibility Scan Results
            </h1>
            <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              <span className="break-all">{scanResult.scanMetadata.url}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar - Score & Summary */}
            <div className="lg:col-span-1 space-y-6">
              {/* Score Card */}
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className={`text-6xl font-bold ${getScoreColor(scanResult.summary.overallScore)} mb-2`}>
                    {scanResult.summary.overallScore}
                    <span className="text-3xl">/100</span>
                  </div>
                  <CardTitle className="text-xl">Accessibility Score</CardTitle>
                  <Badge className={`${getConformanceLevelColor(scanResult.summary.conformanceLevel)} text-sm px-3 py-1`}>
                    WCAG {scanResult.summary.conformanceLevel} Level
                  </Badge>
                </CardHeader>
              </Card>

              {/* Issues Breakdown */}
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    Issues Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: 'Critical', count: scanResult.summary.severityBreakdown.critical, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
                    { label: 'Serious', count: scanResult.summary.severityBreakdown.serious, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20' },
                    { label: 'Moderate', count: scanResult.summary.severityBreakdown.moderate, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
                    { label: 'Minor', count: scanResult.summary.severityBreakdown.minor, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' }
                  ].map((item) => (
                    <div key={item.label} className={`flex justify-between items-center p-3 rounded-lg ${item.bg}`}>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                      <span className={`text-xl font-bold ${item.color}`}>{item.count}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Passed Checks */}
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    Passed Checks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {scanResult.summary.passedChecks}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Successful Tests
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Screenshot */}
              {scanResult.scanMetadata?.screenshot && (
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      Page Screenshot
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img 
                      src={scanResult.scanMetadata.screenshot} 
                      alt={`Screenshot of ${scanResult.scanMetadata.url}`}
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-600"
                    />
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  onClick={() => downloadReport(scanResult, 'txt')}
                  className="w-full"
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
                <Button
                  onClick={() => downloadReport(scanResult, 'json')}
                  className="w-full"
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download JSON
                </Button>
              </div>
            </div>

            {/* Right Content - Detailed Results */}
            <div className="lg:col-span-2 space-y-6">
              {/* WCAG Principles Breakdown */}
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-3">
                    <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    WCAG Principles Analysis
                  </CardTitle>
                  <CardDescription>
                    Issues categorized by the four WCAG principles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { 
                        key: 'perceivable', 
                        title: 'Perceivable', 
                        count: scanResult.issuesByPrinciple.perceivable.count,
                        description: scanResult.wcagGuidelines.principles.perceivable,
                        color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200',
                        textColor: 'text-blue-600 dark:text-blue-400'
                      },
                      { 
                        key: 'operable', 
                        title: 'Operable', 
                        count: scanResult.issuesByPrinciple.operable.count,
                        description: scanResult.wcagGuidelines.principles.operable,
                        color: 'bg-green-50 dark:bg-green-900/20 border-green-200',
                        textColor: 'text-green-600 dark:text-green-400'
                      },
                      { 
                        key: 'understandable', 
                        title: 'Understandable', 
                        count: scanResult.issuesByPrinciple.understandable.count,
                        description: scanResult.wcagGuidelines.principles.understandable,
                        color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200',
                        textColor: 'text-purple-600 dark:text-purple-400'
                      },
                      { 
                        key: 'robust', 
                        title: 'Robust', 
                        count: scanResult.issuesByPrinciple.robust.count,
                        description: scanResult.wcagGuidelines.principles.robust,
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

              {/* Issues Details */}
              {scanResult.issues.length > 0 && (
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-3">
                      <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                      Accessibility Issues ({scanResult.issues.length})
                    </CardTitle>
                    <CardDescription>
                      Detailed list of accessibility violations found on the page
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {scanResult.issues.map((issue, index) => (
                        <div 
                          key={`${issue.wcagRule}-${index}`}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <Badge 
                                className={`mr-2 ${
                                  issue.severity === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                                  issue.severity === 'serious' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' :
                                  issue.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                                  'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                                }`}
                              >
                                {issue.severity.toUpperCase()}
                              </Badge>
                              <span className="font-medium text-gray-900 dark:text-white">
                                WCAG {issue.wcagRule}: {issue.ruleName}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2 text-sm">
                            <p className="text-gray-700 dark:text-gray-300">
                              <strong>Description:</strong> {issue.description}
                            </p>
                            <p className="text-gray-700 dark:text-gray-300">
                              <strong>Recommendation:</strong> {issue.recommendation}
                            </p>
                            <div className="bg-gray-50 dark:bg-slate-700 p-2 rounded text-xs font-mono text-gray-600 dark:text-gray-400">
                              <strong>Element:</strong> {issue.element}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Passed Checks Details */}
              {scanResult.passedChecks && scanResult.passedChecks.length > 0 && (
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                      Passed Checks ({scanResult.passedChecks.length})
                    </CardTitle>
                    <CardDescription>
                      WCAG requirements that your website successfully meets
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {scanResult.passedChecks.map((check, index) => (
                        <div 
                          key={`${check.wcagRule}-${index}`}
                          className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                        >
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <div className="min-w-0">
                              <div className="font-medium text-green-800 dark:text-green-300 text-sm">
                                WCAG {check.wcagRule}: {check.ruleName}
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
                  <CardTitle className="text-xl flex items-center gap-3">
                    <Clock className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    Scan Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {scanResult.scanMetadata.scanDuration}ms
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Scan Duration</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {scanResult.wcagGuidelines.version}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">WCAG Version</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {new Date(scanResult.scanMetadata.timestamp).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Scan Date</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        #{scanResult.scanId}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Scan ID</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}