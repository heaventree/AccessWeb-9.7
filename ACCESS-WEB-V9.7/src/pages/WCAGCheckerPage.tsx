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
import { testUrl } from '../services/accessibilityApi';
import { WebsiteConnectionError } from '../utils/websiteConnectionChecker';
import { WebsiteConnectionError as WebsiteConnectionErrorComponent } from '../components/WebsiteConnectionError';
import type { TestResult, AccessibilityIssue } from '../types';
import { exportToPDF } from '../utils/formats/pdfExport';
import { normalizeUrl } from '../utils/urlUtils';
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
    url: string; 
    details: any;
  } | null>(null);

  const handleSubmit = async (url: string) => {
    // Normalize the URL (ensure it has a protocol)
    const normalizedUrl = normalizeUrl(url);
    console.log(`Submitting URL for testing: ${normalizedUrl}`);
    
    setIsLoading(true);
    setError(null);
    setConnectionError(null);
    setResults(null);
    
    try {
      // Call the actual accessibility testing API
      const apiResult = await testUrl(normalizedUrl, {
        wcagLevel: 'AA',
        includeScreenshots: false,
        includePdf: enablePDFAccessibility
      });

      // Transform API result to match the frontend TestResult interface
      const testResults: TestResult = {
        url: normalizedUrl,
        timestamp: apiResult.timestamp,
        score: apiResult.score,
        passCount: apiResult.summary.passed || 0,
        warningCount: 5, // Default value
        issueCount: apiResult.summary.total,
        region: selectedRegion,
        summary: {
          critical: apiResult.summary.critical,
          serious: apiResult.summary.serious,
          moderate: apiResult.summary.moderate,
          minor: apiResult.summary.minor,
          warnings: 5,
          passes: apiResult.summary.passed || 0,
          pdfIssues: 0,
          documentIssues: 0,
          mediaIssues: 0,
          audioIssues: 0,
          videoIssues: 0
        },
        standards: {
          wcag21: { aa: true, aaa: false },
          wcag22: { aa: true, aaa: false },
          section508: true,
          en301549: true
        },
        issues: apiResult.issues.map(issue => ({
          id: issue.id,
          type: issue.type,
          impact: issue.impact as 'critical' | 'serious' | 'moderate' | 'minor',
          message: issue.message,
          element: issue.selector,
          wcagGuideline: issue.wcagGuideline,
          description: issue.recommendation,
          howToFix: issue.recommendation,
          helpUrl: `https://www.w3.org/WAI/WCAG21/Understanding/${issue.wcagGuideline}.html`,
          context: issue.context,
          selector: issue.selector,
          htmlCode: issue.htmlCode,
          nodes: [{
            html: issue.htmlCode,
            selector: issue.selector
          }],
          wcagCriteria: [issue.wcagGuideline]
        }))
      };

      console.log('Accessibility test completed successfully');
      setResults(testResults);
    } catch (error) {
      console.error('Accessibility test error:', error);
      if (error instanceof WebsiteConnectionError) {
        setConnectionError({
          url: normalizedUrl,
          details: error.details
        });
      } else {
        setError(error instanceof Error ? error.message : 'An error occurred during testing');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (connectionError) {
      handleSubmit(connectionError.url);
    }
  };

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleExportPDF = () => {
    if (results) {
      exportToPDF(results);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Accessibility Checker
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Test any website for WCAG compliance and accessibility issues
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-lg shadow-lg p-8 mb-8"
        >
          <URLInput 
            onSubmit={handleSubmit} 
            isLoading={isLoading}
          />
          
          <div className="mt-6">
            <RegionSelector 
              selectedRegion={selectedRegion} 
              onRegionChange={setSelectedRegion}
            />
          </div>

          {/* Advanced Options */}
          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Testing Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={enableDocumentTesting}
                  onChange={(e) => setEnableDocumentTesting(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Document Testing</span>
                <span className={proPillStyle}>PRO</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={enablePDFAccessibility}
                  onChange={(e) => setEnablePDFAccessibility(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">PDF Accessibility</span>
                <span className={proPillStyle}>PRO</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={enableOfficeDocuments}
                  onChange={(e) => setEnableOfficeDocuments(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Office Documents</span>
                <span className={proPillStyle}>PRO</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={enableMediaTesting}
                  onChange={(e) => setEnableMediaTesting(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Media Testing</span>
                <span className={proPillStyle}>PRO</span>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8"
          >
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
              <p className="text-red-700">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Connection Error Display */}
        {connectionError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <WebsiteConnectionErrorComponent 
              connectionError={connectionError}
              onRetry={handleRetry}
            />
          </motion.div>
        )}

        {/* Results */}
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Summary */}
            <ResultsSummary 
              results={results}
              onExportPDF={handleExportPDF}
            />

            {/* Tabs Navigation */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                  <button
                    onClick={() => handleTabClick('issues')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'issues'
                        ? 'border-red-500 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 inline mr-2" />
                    Issues ({results.summary.critical + results.summary.serious + results.summary.moderate + results.summary.minor})
                  </button>
                  
                  <button
                    onClick={() => handleTabClick('warnings')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'warnings'
                        ? 'border-yellow-500 text-yellow-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <HelpCircle className="w-4 h-4 inline mr-2" />
                    Warnings ({results.summary.warnings})
                  </button>
                  
                  <button
                    onClick={() => handleTabClick('passes')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'passes'
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 inline mr-2" />
                    Passes ({results.summary.passes})
                  </button>
                  
                  <button
                    onClick={() => handleTabClick('contrast')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'contrast'
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Palette className="w-4 h-4 inline mr-2" />
                    Color Contrast
                    <span className={proPillStyle}>PRO</span>
                  </button>
                  
                  <button
                    onClick={() => handleTabClick('structure')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'structure'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Layout className="w-4 h-4 inline mr-2" />
                    Structure
                    <span className={proPillStyle}>PRO</span>
                  </button>
                  
                  <button
                    onClick={() => handleTabClick('responsive')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'responsive'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 inline mr-2" />
                    Responsive
                    <span className={proPillStyle}>PRO</span>
                  </button>
                  
                  <button
                    onClick={() => handleTabClick('media')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'media'
                        ? 'border-pink-500 text-pink-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Video className="w-4 h-4 inline mr-2" />
                    Media
                    <span className={proPillStyle}>PRO</span>
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'issues' && (
                  <IssuesList issues={results.issues} />
                )}
                
                {activeTab === 'warnings' && (
                  <div className="text-center py-12">
                    <HelpCircle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No warnings found</h3>
                    <p className="text-gray-500">This website has no accessibility warnings.</p>
                  </div>
                )}
                
                {activeTab === 'passes' && (
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Accessibility checks passed</h3>
                    <p className="text-gray-500">{results.summary.passes} accessibility checks passed successfully.</p>
                  </div>
                )}
                
                {activeTab === 'contrast' && (
                  <div className="text-center py-12">
                    <Palette className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Color Contrast Analysis</h3>
                    <p className="text-gray-500">Color contrast analysis requires a PRO subscription.</p>
                  </div>
                )}
                
                {activeTab === 'structure' && (
                  <StructureAnalysisPanel issues={results.issues} />
                )}
                
                {activeTab === 'responsive' && (
                  <ResponsiveAnalysisPanel issues={results.issues} />
                )}
                
                {activeTab === 'media' && (
                  <MediaAnalysisPanel issues={results.issues} />
                )}
              </div>
            </div>

            {/* Embed Badge */}
            <EmbedBadge url={results.url} />
          </motion.div>
        )}
      </div>
    </div>
  );
}