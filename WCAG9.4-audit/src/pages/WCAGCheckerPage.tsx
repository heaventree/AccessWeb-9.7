import { useState } from 'react';
import { motion } from 'framer-motion';
import { URLInput } from '../components/URLInput';
import { ResultsSummary } from '../components/ResultsSummary';
import { IssuesList } from '../components/IssuesList';
import { RegionSelector } from '../components/RegionSelector';
import { EmbedBadge } from '../components/EmbedBadge';
import { testAccessibility } from '../utils/accessibilityTester';
import type { TestResult } from '../types';
import { exportToPDF } from '../utils/pdfExport';
import { 
  Download, 
  AlertTriangle,
  AlertCircle, 
  CheckCircle, 
  FileSearch,
  Zap,
  Globe,
  Palette,
  HelpCircle,
  Video,
  Headphones,
  ChevronUp,
  ChevronDown,
  FileText,
  Gauge
} from 'lucide-react';

type TabType = 'issues' | 'warnings' | 'passes' | 'contrast';

export function WCAGCheckerPage() {
  const [selectedRegion, setSelectedRegion] = useState('eu');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<TestResult | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('issues');
  const [enableDocumentTesting, setEnableDocumentTesting] = useState(false);
  const [enablePDFAccessibility, setEnablePDFAccessibility] = useState(false);
  const [enableMediaTesting, setEnableMediaTesting] = useState(false);

  const handleSubmit = async (url: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Configure testing options
      const options = {
        ...(enableDocumentTesting ? {
          documentTesting: {
            enabled: true,
            pdfAccessibility: enablePDFAccessibility
          }
        } : {}),
        ...(enableMediaTesting ? {
          mediaTesting: {
            enabled: true
          }
        } : {})
      };

      const testResults = await testAccessibility(url, selectedRegion, options);
      setResults(testResults);
      
      // Check for PDF-specific issues
      const hasPDFIssues = testResults.issues.some(issue => 
        issue.documentType === 'pdf'
      );
      
      // Check for media-specific issues
      const hasMediaIssues = testResults.issues.some(issue => 
        issue.mediaType === 'audio' || issue.mediaType === 'video' || issue.mediaType === 'embedded'
      );
      
      // Check if there are color contrast issues
      const hasContrastIssues = testResults.issues.some(issue => 
        issue.id === 'color-contrast' || issue.wcagCriteria.includes('1.4.3')
      );
      
      if (hasPDFIssues) {
        // PDF issues are prioritized in the display
        setActiveTab('issues');
      } else if (hasMediaIssues) {
        // Media issues are prioritized after PDF issues
        setActiveTab('issues');
      } else if (hasContrastIssues) {
        setActiveTab('contrast');
      } else if (testResults.issues.length > 0) {
        setActiveTab('issues');
      } else if (testResults.warnings.length > 0) {
        setActiveTab('warnings');
      } else {
        setActiveTab('passes');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while testing the URL');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (results) {
      exportToPDF(results);
    }
  };

  const getContrastIssues = () => {
    if (!results) return [];
    return results.issues.filter(issue => 
      issue.id === 'color-contrast' || issue.wcagCriteria.includes('1.4.3')
    );
  };

  const getNonContrastIssues = () => {
    if (!results) return [];
    return results.issues.filter(issue => 
      issue.id !== 'color-contrast' && !issue.wcagCriteria.includes('1.4.3')
    );
  };

  const getTabStyle = (tab: TabType) => {
    const baseStyle = "px-5 py-2.5 text-sm font-medium rounded-full transition-all flex items-center";
    if (activeTab === tab) {
      switch (tab) {
        case 'contrast':
          return `${baseStyle} bg-purple-100 text-purple-800 shadow-sm border border-purple-200`;
        case 'issues':
          return `${baseStyle} bg-red-100 text-red-800 shadow-sm border border-red-200`;
        case 'warnings':
          return `${baseStyle} bg-amber-100 text-amber-800 shadow-sm border border-amber-200`;
        case 'passes':
          return `${baseStyle} bg-emerald-100 text-emerald-800 shadow-sm border border-emerald-200`;
      }
    }
    // Inactive tabs
    switch (tab) {
      case 'contrast':
        return `${baseStyle} text-purple-700 bg-white hover:bg-purple-50 border border-gray-200`;
      case 'issues':
        return `${baseStyle} text-red-700 bg-white hover:bg-red-50 border border-gray-200`;
      case 'warnings':
        return `${baseStyle} text-amber-700 bg-white hover:bg-amber-50 border border-gray-200`;
      case 'passes':
        return `${baseStyle} text-emerald-700 bg-white hover:bg-emerald-50 border border-gray-200`;
      default:
        return `${baseStyle} text-gray-700 bg-white hover:bg-gray-50 border border-gray-200`;
    }
  };

  const contrastIssues = getContrastIssues();
  const nonContrastIssues = getNonContrastIssues();

  return (
    <div className="page-container">
      <div className="content-container">
        {/* URL Input Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              WCAG Accessibility Checker
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Test your website against WCAG 2.1 and 2.2 standards
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex justify-center">
              <RegionSelector
                selectedRegion={selectedRegion}
                onRegionChange={setSelectedRegion}
              />
            </div>
            
            {/* Testing options */}
            <div className="mt-6 p-4 border border-gray-200 rounded-lg">
              <div className="text-center mb-4">
                <h3 className="text-base font-medium text-gray-600">Advanced Tests</h3>
              </div>
              
              <div className="flex flex-col gap-3">
                {/* Document testing */}
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="documentTesting"
                        checked={enableDocumentTesting}
                        onChange={(e) => setEnableDocumentTesting(e.target.checked)}
                        className="sr-only"
                      />
                      <div className="w-10 h-5 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                    <span className="ml-3 text-sm font-medium text-gray-600">Enable Document Testing</span>
                    <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-600 text-white rounded-full">PRO</span>
                  </div>
                  
                  <div className="group relative">
                    <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                    <div className="absolute hidden group-hover:block z-10 w-64 p-3 bg-white rounded-lg shadow-lg border border-gray-200 text-xs text-gray-600 bottom-full mb-2 right-0">
                      <p className="font-semibold mb-1">Document Accessibility Testing:</p>
                      <p>Tests PDFs, documents, and other file formats for accessibility. Available in PRO plans only.</p>
                    </div>
                  </div>
                </div>
                
                {enableDocumentTesting && (
                  <div className="flex items-center justify-between ml-6">
                    <div className="flex items-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          id="pdfAccessibility"
                          checked={enablePDFAccessibility}
                          onChange={(e) => setEnablePDFAccessibility(e.target.checked)}
                          className="sr-only"
                        />
                        <div className="w-9 h-4 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                      <span className="ml-3 text-sm font-medium text-gray-600">Test PDF Accessibility</span>
                    </div>
                    
                    <div className="group relative">
                      <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                      <div className="absolute hidden group-hover:block z-10 w-64 p-3 bg-white rounded-lg shadow-lg border border-gray-200 text-xs text-gray-600 bottom-full mb-2 right-0">
                        <p className="font-semibold mb-1">PDF Accessibility Testing:</p>
                        <p>Analyzes PDF documents for accessibility issues including tags, reading order, and alt text.</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Media testing */}
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="mediaTesting"
                        checked={enableMediaTesting}
                        onChange={(e) => setEnableMediaTesting(e.target.checked)}
                        className="sr-only"
                      />
                      <div className="w-10 h-5 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                    <span className="ml-3 text-sm font-medium text-gray-600">Test Media Accessibility</span>
                    <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-600 text-white rounded-full">PRO</span>
                  </div>
                  
                  <div className="group relative">
                    <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                    <div className="absolute hidden group-hover:block z-10 w-64 p-3 bg-white rounded-lg shadow-lg border border-gray-200 text-xs text-gray-600 bottom-full mb-2 right-0">
                      <p className="font-semibold mb-1">Media Accessibility Testing:</p>
                      <p>Checks audio, video, and embedded media elements for captions, transcripts, and accessible controls.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex flex-col items-center">
              <URLInput onSubmit={handleSubmit} isLoading={isLoading} />
              <p className="text-sm text-gray-500 mt-2 text-center">
                The scan typically takes 30-60 seconds depending on the size of your website
              </p>
            </div>
          </motion.div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-start bg-red-50 border border-red-200 rounded-lg p-4">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error Testing URL</h3>
                <p className="mt-1 text-sm text-red-700 whitespace-pre-line">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {results && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Test Results</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    <a href={results.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {results.url}
                    </a>
                  </p>
                </div>
                <button
                  onClick={handleExport}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </button>
              </div>

              <ResultsSummary results={results} />

              {results.issues.length === 0 && results.warnings.length === 0 ? (
                <div className="text-center py-8 bg-green-50 rounded-xl mt-6">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-6">
                    Congratulations! No accessibility issues found
                  </h3>
                  <EmbedBadge url={results.url} timestamp={results.timestamp} />
                </div>
              ) : (
                <div className="mt-8 space-y-6">
                  <div className="flex flex-wrap justify-center gap-4 mb-6 px-4 py-3 bg-gray-50 rounded-xl">
                    {contrastIssues.length > 0 && (
                      <button
                        onClick={() => setActiveTab('contrast')}
                        className={getTabStyle('contrast')}
                      >
                        <Palette className="w-4 h-4 inline-block mr-2" />
                        Color Contrast ({contrastIssues.length})
                      </button>
                    )}
                    {nonContrastIssues.length > 0 && (
                      <button
                        onClick={() => setActiveTab('issues')}
                        className={getTabStyle('issues')}
                      >
                        <AlertTriangle className="w-4 h-4 inline-block mr-2" />
                        Issues ({nonContrastIssues.length})
                      </button>
                    )}
                    {results.warnings.length > 0 && (
                      <button
                        onClick={() => setActiveTab('warnings')}
                        className={getTabStyle('warnings')}
                      >
                        <AlertCircle className="w-4 h-4 inline-block mr-2" />
                        Warnings ({results.warnings.length})
                      </button>
                    )}
                    {results.passes.length > 0 && (
                      <button
                        onClick={() => setActiveTab('passes')}
                        className={getTabStyle('passes')}
                      >
                        <CheckCircle className="w-4 h-4 inline-block mr-2" />
                        Passed ({results.passes.length})
                      </button>
                    )}
                  </div>

                  <div>
                    {activeTab === 'contrast' && contrastIssues.length > 0 && (
                      <div className="space-y-4">
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h3 className="text-lg font-semibold text-purple-900 mb-2">
                            Color Contrast Issues
                          </h3>
                          <p className="text-purple-700">
                            WCAG 2.1 and 2.2 require a contrast ratio of at least:
                          </p>
                          <ul className="mt-2 space-y-1 text-purple-700">
                            <li>• 4.5:1 for normal text</li>
                            <li>• 3:1 for large text (18pt or 14pt bold)</li>
                            <li>• 3:1 for graphical objects and user interface components</li>
                            <li>• 3:1 for focus indicators (WCAG 2.2)</li>
                          </ul>
                        </div>
                        <IssuesList issues={contrastIssues} type="issues" />
                      </div>
                    )}
                    {activeTab === 'issues' && nonContrastIssues.length > 0 && (
                      <IssuesList issues={nonContrastIssues} type="issues" />
                    )}
                    {activeTab === 'warnings' && results.warnings.length > 0 && (
                      <IssuesList issues={results.warnings} type="warnings" />
                    )}
                    {activeTab === 'passes' && results.passes.length > 0 && (
                      <IssuesList issues={results.passes} type="passes" />
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Features Section - Only show when no results */}
        {!results && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <FileSearch className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Deep Analysis
              </h3>
              <p className="text-gray-600">
                Thorough scanning of HTML, ARIA, and dynamic content
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <Zap className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                AI-Powered Fixes
              </h3>
              <p className="text-gray-600">
                Get instant suggestions with code examples
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <Globe className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Global Standards
              </h3>
              <p className="text-gray-600">
                Support for WCAG 2.1 & 2.2, ADA, and Section 508
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <Download className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                PDF Accessibility
              </h3>
              <p className="text-gray-600">
                Test PDFs for tags, reading order, and document structure
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <Video className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Video Accessibility
              </h3>
              <p className="text-gray-600">
                Check for captions, audio descriptions, and accessible controls
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <Headphones className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Audio Accessibility
              </h3>
              <p className="text-gray-600">
                Verify transcripts and keyboard-accessible audio controls
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}