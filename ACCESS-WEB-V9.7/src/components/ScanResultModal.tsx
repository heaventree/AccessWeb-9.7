import React from 'react';
import { X, AlertTriangle, AlertCircle, Info, CheckCircle, Clock, Globe, Zap } from 'lucide-react';

interface ScanResult {
  id: number;
  url: string;
  siteName: string;
  score: number;
  errorCount: number;
  warningCount: number;
  noticeCount: number;
  scanStatus: string;
  scanDuration: number;
  createdAt: string;
  platform: string;
  rawResults?: {
    issues: Array<{
      type: string;
      code: string;
      message: string;
      element: string;
      selector: string;
      guideline: string;
    }>;
    summary: {
      total: number;
      errors: number;
      warnings: number;
      notices: number;
      url: string;
    };
    pageInfo: {
      title: string;
      lang: string;
      headingCount: number;
      imageCount: number;
      formControlCount: number;
    };
  };
}

interface ScanResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  scanResult: ScanResult | null;
}

const ScanResultModal: React.FC<ScanResultModalProps> = ({ isOpen, onClose, scanResult }) => {
  if (!isOpen || !scanResult) return null;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'notice':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
        
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className={`rounded-full p-2 ${getScoreBgColor(scanResult.score || 0)}`}>
                <Globe className={`h-6 w-6 ${getScoreColor(scanResult.score || 0)}`} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  WCAG Scan Results
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {scanResult.siteName} - {scanResult.url}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className={`rounded-lg p-4 ${getScoreBgColor(scanResult.score || 0)}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Accessibility Score
                    </p>
                    <p className={`text-2xl font-bold ${getScoreColor(scanResult.score || 0)}`}>
                      {scanResult.score || 'N/A'}%
                    </p>
                  </div>
                  <CheckCircle className={`h-8 w-8 ${getScoreColor(scanResult.score || 0)}`} />
                </div>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Errors</p>
                    <p className="text-2xl font-bold text-red-600">{scanResult.errorCount}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Warnings</p>
                    <p className="text-2xl font-bold text-yellow-600">{scanResult.warningCount}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-yellow-500" />
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Notices</p>
                    <p className="text-2xl font-bold text-blue-600">{scanResult.noticeCount}</p>
                  </div>
                  <Info className="h-8 w-8 text-blue-500" />
                </div>
              </div>
            </div>

            {/* Scan Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
                  Scan Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                    <span className={`text-sm font-medium ${
                      scanResult.scanStatus === 'completed' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {scanResult.scanStatus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Duration:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {scanResult.scanDuration}ms
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Platform:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                      {scanResult.platform}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Scanned:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatDate(scanResult.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {scanResult.rawResults?.pageInfo && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
                    Page Analysis
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Page Title:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100 max-w-32 truncate">
                        {scanResult.rawResults.pageInfo.title || 'No title'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Language:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {scanResult.rawResults.pageInfo.lang || 'Not specified'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Headings:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {scanResult.rawResults.pageInfo.headingCount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Images:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {scanResult.rawResults.pageInfo.imageCount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Form Controls:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {scanResult.rawResults.pageInfo.formControlCount}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Issues List */}
            {scanResult.rawResults?.issues && scanResult.rawResults.issues.length > 0 && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Accessibility Issues ({scanResult.rawResults.issues.length})
                  </h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {scanResult.rawResults.issues.map((issue, index) => (
                    <div
                      key={index}
                      className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                    >
                      <div className="flex items-start space-x-3">
                        {getIssueIcon(issue.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              issue.type === 'error'
                                ? 'bg-red-100 text-red-800'
                                : issue.type === 'warning'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {issue.type.toUpperCase()}
                            </span>
                            <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              {issue.code}
                            </code>
                          </div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                            {issue.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            WCAG Guideline: {issue.guideline}
                          </p>
                          {issue.element && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Element: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">{issue.element}</code>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Issues */}
            {(!scanResult.rawResults?.issues || scanResult.rawResults.issues.length === 0) && (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  No accessibility issues found!
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This page appears to meet WCAG accessibility standards.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <Zap className="h-4 w-4" />
              <span>Powered by AccessWeb WCAG Scanner</span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanResultModal;