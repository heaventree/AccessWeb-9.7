import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Scan, AlertTriangle, RefreshCw } from 'lucide-react';
import type { ScanResult, ImageIssue, ScanOptions } from '../../services/imageAltScanService';

// Mock data for development and testing
const mockIssues: ImageIssue[] = [
  {
    id: uuidv4(),
    url: 'https://example.com/images/product1.jpg',
    element: '<img src="/images/product1.jpg">',
    selector: 'main > div:nth-child(2) > img',
    issueType: 'missing',
    impact: 'critical',
    description: 'Image is missing an alt attribute',
    wcagCriteria: 'WCAG 1.1.1 (A)',
    suggestedFix: 'Add an alt attribute that describes the image content',
    suggestedAlt: 'Blue denim jacket with metal buttons',
    fixed: false
  },
  {
    id: uuidv4(),
    url: 'https://example.com/images/banner.jpg',
    element: '<img src="/images/banner.jpg" alt="">',
    selector: 'header > div.banner > img',
    issueType: 'empty',
    impact: 'serious',
    description: 'Image has an empty alt attribute',
    wcagCriteria: 'WCAG 1.1.1 (A)',
    suggestedFix: 'Add descriptive alt text or confirm image is decorative',
    suggestedAlt: 'Spring sale promotional banner',
    fixed: false
  },
  {
    id: uuidv4(),
    url: 'https://example.com/images/icon-settings.svg',
    element: '<img src="/images/icon-settings.svg" alt="settings icon settings">',
    selector: 'nav > ul > li:nth-child(3) > img',
    issueType: 'redundant',
    impact: 'moderate',
    description: 'Alt text contains redundant words ("icon", "settings" repeated)',
    wcagCriteria: 'WCAG 1.1.1 (A)',
    suggestedFix: 'Remove redundant words from alt text',
    suggestedAlt: 'Settings',
    fixed: false
  }
];

// Component props definition
type ImageAltScannerProps = {
  /** URL to scan, defaults to current page if not provided */
  url?: string;
  /** Initial options for scanning */
  initialOptions?: Partial<ScanOptions>;
  /** Callback when scan is complete */
  onScanComplete?: (result: ScanResult) => void;
  /** Callback when issues are fixed */
  onIssuesFixed?: (fixedIssues: ImageIssue[]) => void;
  /** Integration type - changes scanning approach */
  integrationType?: 'browser' | 'wordpress' | 'shopify';
  /** Integration settings (API keys, etc.) */
  integrationSettings?: Record<string, string>;
}

const ImageAltScanner = ({
  url,
  initialOptions,
  onScanComplete,
  onIssuesFixed,
  integrationType = 'browser',
  integrationSettings = {}
}: ImageAltScannerProps) => {
  // State management
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  // Initialize with props
  useEffect(() => {
    if (initialOptions) {
      // Implementation would be here
    }
  }, [initialOptions]);

  const startScan = async () => {
    setIsScanning(true);
    // In a real implementation, this would call an API or run a DOM scan
    // For demo purposes, we'll use mock data after a delay
    setTimeout(() => {
      const mockResult: ScanResult = {
        id: uuidv4(),
        url: url || window.location.href,
        timestamp: Date.now(),
        totalImages: 17,
        issuesFound: mockIssues.length,
        issues: mockIssues
      };
      
      setScanResult(mockResult);
      setIsScanning(false);
      
      if (onScanComplete) {
        onScanComplete(mockResult);
      }
    }, 2500);
  };

  return (
    <div className="space-y-8 pb-6">
      <div className="bg-white dark:bg-slate-800 shadow-sm rounded-xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-md transition-shadow">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Scan for Image Accessibility Issues
        </h2>
        
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            This tool scans for WCAG 1.1.1 compliance issues with images, detecting missing or improper alt text.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <button
              onClick={startScan}
              disabled={isScanning}
              className="w-full md:w-auto flex items-center justify-center px-6 py-3 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-[#0fae96] hover:bg-[#0d9a85] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0fae96] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label={isScanning ? "Currently scanning for image issues" : "Start scanning for image accessibility issues"}
            >
              {isScanning ? (
                <>
                  <RefreshCw className="animate-spin -ml-1 mr-3 h-5 w-5" aria-hidden="true" />
                  Scanning...
                </>
              ) : (
                <>
                  <Scan className="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />
                  Start Scan
                </>
              )}
            </button>
          </div>
        </div>
        
        {scanResult && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Scan Results
            </h3>
            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
              <p className="text-gray-700 dark:text-gray-300">Found {scanResult.issuesFound} issues with {scanResult.totalImages} images.</p>
              
              {scanResult.issues.length > 0 ? (
                <div className="mt-4 space-y-4">
                  <p className="font-medium text-gray-900 dark:text-white">Issues:</p>
                  <ul className="mt-2 divide-y divide-gray-200 dark:divide-slate-600">
                    {scanResult.issues.map((issue) => (
                      <li key={issue.id} className="py-4">
                        <div className="flex items-start">
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{issue.description}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Impact: {issue.impact}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Suggested Fix: {issue.suggestedFix}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="mt-4 text-green-600 dark:text-green-400">No issues found!</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageAltScanner;