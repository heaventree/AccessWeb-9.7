
import { AlertTriangle, AlertOctagon, AlertCircle, Info, CheckCircle, AlertCircle as Warning, FileText, Headphones, Video, MonitorSmartphone, Download } from 'lucide-react';
import type { TestResult } from '../types';

export interface ResultsSummaryProps {
  results: TestResult;
  onExport?: () => void;
}

export function ResultsSummary({ results, onExport }: ResultsSummaryProps) {
  // Add null check for results and summary
  if (!results || !results.summary) {
    return <div>No results data available</div>;
  }
  
  const { summary } = results;
  const hasPDFIssues = summary.pdfIssues && summary.pdfIssues > 0;
  const hasDocumentIssues = summary.documentIssues && summary.documentIssues > 0;
  const hasMediaIssues = summary.mediaIssues && summary.mediaIssues > 0;
  const hasAudioIssues = summary.audioIssues && summary.audioIssues > 0;
  const hasVideoIssues = summary.videoIssues && summary.videoIssues > 0;
  
  // Calculate total issues for screen reader announcement
  const totalIssues = (summary.critical || 0) + (summary.serious || 0) + 
                     (summary.moderate || 0) + (summary.minor || 0);
  
  // Calculate score to determine badge color
  const score = results.score || 0;
  const scoreColorClass = 
    score >= 90 ? 'text-emerald-600' :
    score >= 80 ? 'text-green-600' :
    score >= 70 ? 'text-yellow-600' :
    score >= 60 ? 'text-amber-600' :
    'text-red-600';

  return (
    <section 
      aria-labelledby="results-summary-heading"
      className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 id="results-summary-heading" className="text-xl font-bold text-gray-900 dark:text-white">
          Results Summary
        </h2>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">Score</div>
            <div className={`text-3xl font-bold ${scoreColorClass}`}>
              {score}
            </div>
          </div>
          
          {onExport && (
            <button
              onClick={onExport}
              className="inline-flex items-center px-4 py-2 bg-[#0fae96] hover:bg-[#0c9a85] text-white rounded-full transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </button>
          )}
        </div>
      </div>
      
      {/* This visually hidden paragraph provides a complete summary for screen readers */}
      <div className="sr-only" aria-live="polite">
        Results summary: 
        {(summary.critical || 0) > 0 && ` ${summary.critical} critical issues,`}
        {(summary.serious || 0) > 0 && ` ${summary.serious} serious issues,`}
        {(summary.moderate || 0) > 0 && ` ${summary.moderate} moderate issues,`}
        {(summary.minor || 0) > 0 && ` ${summary.minor} minor issues,`}
        {(summary.warnings || 0) > 0 && ` ${summary.warnings} warnings,`}
        {(summary.passes || 0) > 0 && ` ${summary.passes} passed checks.`}
        {(summary.pdfIssues || 0) > 0 && ` ${summary.pdfIssues} PDF document issues.`}
        {(summary.documentIssues || 0) > 0 && ` ${summary.documentIssues} document issues.`}
        {(summary.mediaIssues || 0) > 0 && ` ${summary.mediaIssues} media issues.`}
        {(summary.audioIssues || 0) > 0 && ` ${summary.audioIssues} audio issues.`}
        {(summary.videoIssues || 0) > 0 && ` ${summary.videoIssues} video issues.`}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div 
          className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800"
          role="region"
          aria-labelledby="critical-issues-heading"
        >
          <div className="flex items-center">
            <AlertOctagon className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" aria-hidden="true" />
            <h3 id="critical-issues-heading" className="text-red-800 dark:text-red-300 text-sm font-semibold">Critical</h3>
          </div>
          <p className="text-xl font-bold text-red-600 dark:text-red-400 mt-1" aria-label={`${summary.critical} critical issues`}>{summary.critical}</p>
        </div>
        
        <div 
          className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-200 dark:border-orange-800"
          role="region"
          aria-labelledby="serious-issues-heading"
        >
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-2" aria-hidden="true" />
            <h3 id="serious-issues-heading" className="text-orange-800 dark:text-orange-300 text-sm font-semibold">Serious</h3>
          </div>
          <p className="text-xl font-bold text-orange-600 dark:text-orange-400 mt-1" aria-label={`${summary.serious} serious issues`}>{summary.serious}</p>
        </div>
        
        <div 
          className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800"
          role="region"
          aria-labelledby="moderate-issues-heading"
        >
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" aria-hidden="true" />
            <h3 id="moderate-issues-heading" className="text-yellow-800 dark:text-yellow-300 text-sm font-semibold">Moderate</h3>
          </div>
          <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400 mt-1" aria-label={`${summary.moderate} moderate issues`}>{summary.moderate}</p>
        </div>
        
        <div 
          className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800"
          role="region"
          aria-labelledby="minor-issues-heading"
        >
          <div className="flex items-center">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" aria-hidden="true" />
            <h3 id="minor-issues-heading" className="text-blue-800 dark:text-blue-300 text-sm font-semibold">Minor</h3>
          </div>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1" aria-label={`${summary.minor} minor issues`}>{summary.minor}</p>
        </div>

        <div 
          className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800"
          role="region"
          aria-labelledby="passed-checks-heading"
        >
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-2" aria-hidden="true" />
            <h3 id="passed-checks-heading" className="text-emerald-800 dark:text-emerald-300 text-sm font-semibold">Passed</h3>
          </div>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1" aria-label={`${summary.passes} passed checks`}>{summary.passes}</p>
        </div>

        <div 
          className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800"
          role="region"
          aria-labelledby="warnings-heading"
        >
          <div className="flex items-center">
            <Warning className="w-5 h-5 text-amber-600 dark:text-amber-400 mr-2" aria-hidden="true" />
            <h3 id="warnings-heading" className="text-amber-800 dark:text-amber-300 text-sm font-semibold">Warnings</h3>
          </div>
          <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1" aria-label={`${summary.warnings} warnings`}>{summary.warnings}</p>
        </div>
        
        {hasPDFIssues && (
          <div 
            className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800 sm:col-span-3 lg:col-span-2"
            role="region"
            aria-labelledby="pdf-issues-heading"
          >
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" aria-hidden="true" />
              <h3 id="pdf-issues-heading" className="text-purple-800 dark:text-purple-300 text-sm font-semibold">PDF Issues</h3>
            </div>
            <p className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-1" aria-label={`${summary.pdfIssues} PDF issues`}>{summary.pdfIssues}</p>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              Issues with document structure, tags, or reading order
            </p>
          </div>
        )}
        
        {hasDocumentIssues && !hasPDFIssues && (
          <div 
            className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800 sm:col-span-3 lg:col-span-2"
            role="region"
            aria-labelledby="document-issues-heading"
          >
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" aria-hidden="true" />
              <h3 id="document-issues-heading" className="text-purple-800 dark:text-purple-300 text-sm font-semibold">Document Issues</h3>
            </div>
            <p className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-1" aria-label={`${summary.documentIssues} document issues`}>{summary.documentIssues}</p>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              Issues with documents across all formats
            </p>
          </div>
        )}
        
        {hasMediaIssues && (
          <div 
            className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg border border-indigo-200 dark:border-indigo-800 sm:col-span-3 lg:col-span-2"
            role="region"
            aria-labelledby="media-issues-heading"
          >
            <div className="flex items-center">
              <MonitorSmartphone className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" aria-hidden="true" />
              <h3 id="media-issues-heading" className="text-indigo-800 dark:text-indigo-300 text-sm font-semibold">Media Issues</h3>
            </div>
            <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1" aria-label={`${summary.mediaIssues} media issues`}>{summary.mediaIssues}</p>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
              Issues with audio, video, and embedded media
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {hasAudioIssues && (
                <div 
                  className="bg-indigo-100 dark:bg-indigo-800/50 p-2 rounded-md"
                  role="region" 
                  aria-labelledby="audio-issues-heading"
                >
                  <div className="flex items-center">
                    <Headphones className="w-4 h-4 text-indigo-700 dark:text-indigo-300 mr-1" aria-hidden="true" />
                    <span id="audio-issues-heading" className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                      Audio: <span aria-label={`${summary.audioIssues} audio issues`}>{summary.audioIssues}</span>
                    </span>
                  </div>
                </div>
              )}
              {hasVideoIssues && (
                <div 
                  className="bg-indigo-100 dark:bg-indigo-800/50 p-2 rounded-md"
                  role="region" 
                  aria-labelledby="video-issues-heading"
                >
                  <div className="flex items-center">
                    <Video className="w-4 h-4 text-indigo-700 dark:text-indigo-300 mr-1" aria-hidden="true" />
                    <span id="video-issues-heading" className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                      Video: <span aria-label={`${summary.videoIssues} video issues`}>{summary.videoIssues}</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}