import { useState } from 'react';
import { motion } from 'framer-motion';
import { URLInput } from '../components/URLInput';
import { ResultsSummary } from '../components/ResultsSummary';
import { IssuesList } from '../components/IssuesList';
import { RegionSelector } from '../components/RegionSelector';
import { EmbedBadge } from '../components/EmbedBadge';
import { StructureAnalysisPanel } from '../components/StructureAnalysisPanel';
import { ResponsiveAnalysisPanel } from '../components/ResponsiveAnalysisPanel';
import { MediaAnalysisPanel } from '../components/MediaAnalysisPanel';
import { testAccessibilityWithWave } from '../utils/accessibility/waveApiService';
import { WebsiteConnectionError } from '../utils/websiteConnectionChecker';
import { WebsiteConnectionError as WebsiteConnectionErrorComponent } from '../components/WebsiteConnectionError';
import type { TestResult, AccessibilityIssue } from '../types';
import { exportToPDF } from '../utils/formats/pdfExport';
import { normalizeUrl, httpsToHttp } from '../utils/urlUtils';
import { 
  Download, 
  AlertTriangle, 
  CheckCircle, 
  FileSearch,
  FileText,
  Zap,
  Globe,
  Palette,
  HelpCircle,
  Video,
  Headphones,
  Layout,
  Smartphone
} from 'lucide-react';

type TabType = 'issues' | 'warnings' | 'passes' | 'contrast' | 'structure' | 'responsive' | 'media';

// Pro pill styling
const proPillStyle = "ml-1 text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-[#0fae96] to-teal-500 text-white font-semibold inline-flex items-center scale-[0.85] origin-left";

export function WCAGCheckerPage() {
  const [selectedRegion, setSelectedRegion] = useState('eu');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<TestResult | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('issues');
  const [enableDocumentTesting, setEnableDocumentTesting] = useState(false);
  const [enablePDFAccessibility, setEnablePDFAccessibility] = useState(false);
  const [enableOfficeDocuments, setEnableOfficeDocuments] = useState(false);
  const [enableMediaTesting, setEnableMediaTesting] = useState(false);

  // New state for connection error details
  const [connectionError, setConnectionError] = useState<{ 
    originalUrl: string; 
    httpUrl: string; 
    error: WebsiteConnectionError 
  } | null>(null);

  // Enhanced URL handling with automatic protocol correction
  const handleSubmit = async (url: string) => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);
    setConnectionError(null);

    try {
      // Normalize the URL
      const normalizedUrl = normalizeUrl(url);
      
      // Configure testing options
      const options = {
        ...(enableDocumentTesting ? {
          documentTesting: {
            enabled: true,
            pdfAccessibility: enablePDFAccessibility,
            officeDocuments: enableOfficeDocuments
          }
        } : {}),
        ...(enableMediaTesting ? {
          mediaTesting: {
            enabled: true,
            audioTesting: true,
            videoTesting: true
          }
        } : {})
      };

      // Use WAVE API for real accessibility testing
      const testResults = await testAccessibilityWithWave(normalizedUrl, selectedRegion, options);
      setResults(testResults);
      
      // Set active tab based on results
      if (testResults.issues.some(issue => issue.id === 'color-contrast')) {
        setActiveTab('contrast');
      } else if (testResults.issues.length > 0) {
        setActiveTab('issues');
      } else if (testResults.warnings.length > 0) {
        setActiveTab('warnings');
      } else {
        setActiveTab('passes');
      }
      
    } catch (error) {
      console.error('Accessibility test error:', error);
      
      if (error instanceof WebsiteConnectionError) {
        // Try HTTP fallback if HTTPS fails
        try {
          const httpUrl = httpsToHttp(url);
          if (httpUrl !== url) {
            const httpResults = await testAccessibilityWithWave(httpUrl, selectedRegion);
            setResults(httpResults);
            setConnectionError({
              originalUrl: url,
              httpUrl: httpUrl,
              error: error
            });
          } else {
            setError(error.message);
          }
        } catch (httpError) {
          setError(`Unable to test website: ${error.message}`);
        }
      } else if (error instanceof Error) {
        if (error.message.includes('API key')) {
          setError('WAVE API configuration error. Please check API credentials.');
        } else if (error.message.includes('Invalid URL')) {
          setError('Please enter a valid URL (e.g., https://example.com)');
        } else if (error.message.includes('credits exhausted')) {
          setError('WAVE API credits have been exhausted. Please try again later.');
        } else {
          setError(error.message);
        }
      } else {
        setError('An unexpected error occurred while testing the website.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (results) {
      exportToPDF(results);
    }
  };

  const getTabCount = (tabType: TabType) => {
    if (!results) return 0;
    
    switch (tabType) {
      case 'issues':
        return results.issues.length;
      case 'warnings':
        return results.warnings.length;
      case 'passes':
        return results.passes.length;
      case 'contrast':
        return results.issues.filter(issue => issue.id === 'color-contrast').length;
      case 'structure':
        return results.summary.structureIssues || 0;
      case 'responsive':
        return results.issues.filter(issue => 
          issue.structureType === 'responsive' || 
          issue.wcagCriteria.includes('1.4.10')
        ).length;
      case 'media':
        return results.summary.mediaIssues || 0;
      default:
        return 0;
    }
  };

  const getTabIcon = (tabType: TabType) => {
    switch (tabType) {
      case 'issues':
        return <AlertTriangle className="w-4 h-4" />;
      case 'warnings':
        return <HelpCircle className="w-4 h-4" />;
      case 'passes':
        return <CheckCircle className="w-4 h-4" />;
      case 'contrast':
        return <Palette className="w-4 h-4" />;
      case 'structure':
        return <Layout className="w-4 h-4" />;
      case 'responsive':
        return <Smartphone className="w-4 h-4" />;
      case 'media':
        return <Video className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getTabColor = (tabType: TabType) => {
    switch (tabType) {
      case 'issues':
        return 'text-red-600 border-red-200 bg-red-50';
      case 'warnings':
        return 'text-yellow-600 border-yellow-200 bg-yellow-50';
      case 'passes':
        return 'text-green-600 border-green-200 bg-green-50';
      case 'contrast':
        return 'text-purple-600 border-purple-200 bg-purple-50';
      case 'structure':
        return 'text-blue-600 border-blue-200 bg-blue-50';
      case 'responsive':
        return 'text-teal-600 border-teal-200 bg-teal-50';
      case 'media':
        return 'text-indigo-600 border-indigo-200 bg-indigo-50';
      default:
        return 'text-gray-600 border-gray-200 bg-gray-50';
    }
  };

  const renderTabContent = () => {
    if (!results) return null;

    switch (activeTab) {
      case 'issues':
        return <IssuesList issues={results.issues} />;
      case 'warnings':
        return <IssuesList issues={results.warnings} />;
      case 'passes':
        return <IssuesList issues={results.passes} />;
      case 'contrast':
        const contrastIssues = results.issues.filter(issue => issue.id === 'color-contrast');
        return <IssuesList issues={contrastIssues} />;
      case 'structure':
        return <StructureAnalysisPanel url={results.url} />;
      case 'responsive':
        return <ResponsiveAnalysisPanel url={results.url} />;
      case 'media':
        return <MediaAnalysisPanel url={results.url} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          >
            WCAG Accessibility Checker
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Test your website for WCAG compliance and accessibility issues using industry-standard WAVE analysis.
          </motion.p>
        </div>

        {/* URL Input Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <URLInput 
            onSubmit={handleSubmit} 
            isLoading={isLoading}
          />
          
          {/* Region Selector */}
          <div className="mt-6">
            <RegionSelector 
              selectedRegion={selectedRegion}
              onRegionChange={setSelectedRegion}
            />
          </div>

          {/* Testing Options */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Document Testing */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">Document Testing</span>
                <span className={proPillStyle}>PRO</span>
              </div>
              <label className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  checked={enableDocumentTesting}
                  onChange={(e) => setEnableDocumentTesting(e.target.checked)}
                  className="rounded border-gray-300 text-teal-600"
                />
                <span className="text-sm text-gray-700">Enable document analysis</span>
              </label>
              
              {enableDocumentTesting && (
                <div className="ml-6 space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={enablePDFAccessibility}
                      onChange={(e) => setEnablePDFAccessibility(e.target.checked)}
                      className="rounded border-gray-300 text-teal-600"
                    />
                    <span className="text-sm text-gray-600">PDF accessibility</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={enableOfficeDocuments}
                      onChange={(e) => setEnableOfficeDocuments(e.target.checked)}
                      className="rounded border-gray-300 text-teal-600"
                    />
                    <span className="text-sm text-gray-600">Office documents</span>
                  </label>
                </div>
              )}
            </div>

            {/* Media Testing */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Video className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-900">Media Testing</span>
                <span className={proPillStyle}>PRO</span>
              </div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={enableMediaTesting}
                  onChange={(e) => setEnableMediaTesting(e.target.checked)}
                  className="rounded border-gray-300 text-teal-600"
                />
                <span className="text-sm text-gray-700">Audio/video accessibility</span>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Connection Error Alert */}
        {connectionError && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <WebsiteConnectionErrorComponent 
              originalUrl={connectionError.originalUrl}
              httpUrl={connectionError.httpUrl}
              error={connectionError.error}
              onDismiss={() => setConnectionError(null)}
            />
          </motion.div>
        )}

        {/* Error Display */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8"
          >
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-medium">Error</span>
            </div>
            <p className="text-red-700 mt-2">{error}</p>
          </motion.div>
        )}

        {/* Results Section */}
        {results && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            {/* Results Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Test Results</h2>
                <button
                  onClick={handleExportPDF}
                  className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export PDF</span>
                </button>
              </div>
              
              <ResultsSummary results={results} />
              
              {/* Embed Badge */}
              <div className="mt-6">
                <EmbedBadge url={results.url} />
              </div>
            </div>

            {/* Detailed Results Tabs */}
            <div className="bg-white rounded-xl shadow-lg">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200 px-6">
                <div className="flex flex-wrap gap-2 py-4">
                  {(['issues', 'warnings', 'passes', 'contrast', 'structure', 'responsive', 'media'] as TabType[]).map((tab) => {
                    const count = getTabCount(tab);
                    const isActive = activeTab === tab;
                    const hasProPill = ['structure', 'responsive', 'media'].includes(tab);
                    
                    return (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`
                          flex items-center space-x-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors
                          ${isActive 
                            ? `${getTabColor(tab)} border-current` 
                            : 'text-gray-600 border-gray-200 bg-gray-50 hover:bg-gray-100'
                          }
                        `}
                      >
                        {getTabIcon(tab)}
                        <span className="capitalize">{tab}</span>
                        <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold">
                          {count}
                        </span>
                        {hasProPill && (
                          <span className={proPillStyle}>PRO</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {renderTabContent()}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}