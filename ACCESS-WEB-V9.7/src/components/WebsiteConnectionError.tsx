import React from 'react';
import { AlertTriangle, ExternalLink, Lock, Globe, AlertCircle, Info, HelpCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { httpsToHttp } from '../utils/urlUtils';

export interface WebsiteConnectionErrorProps {
  url: string;
  details: {
    type: string;
    message: string;
    technicalDetails?: string;
    userFriendlyMessage: string;
    possibleSolutions: string[];
    severityLevel?: 'critical' | 'high' | 'medium' | 'low';
    requiresExpertise?: boolean;
    learnMoreUrl?: string;
  };
  onDismiss: () => void;
  onTryAlternative?: (alternativeUrl: string) => void;
}

export function WebsiteConnectionError({ url, details, onDismiss, onTryAlternative }: WebsiteConnectionErrorProps) {
  // Determine if using HTTP or HTTPS
  const isSecure = url.toLowerCase().startsWith('https://');
  const ProtocolIcon = isSecure ? Lock : Globe;
  const protocolLabel = isSecure ? 'HTTPS' : 'HTTP';
  const isSslError = details.type === 'ssl';
  
  // Determine severity indicator
  const getSeverityIcon = () => {
    if (!details.severityLevel) return null;
    
    switch (details.severityLevel) {
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
      case 'medium':
        return <Info className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />;
      case 'low':
        return <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      default:
        return null;
    }
  };
  
  const getSeverityLabel = () => {
    if (!details.severityLevel) return '';
    
    switch (details.severityLevel) {
      case 'critical':
        return 'Critical';
      case 'high':
        return 'High';
      case 'medium':
        return 'Medium';
      case 'low':
        return 'Low';
      default:
        return '';
    }
  };
  
  const getSeverityClass = () => {
    if (!details.severityLevel) return '';
    
    switch (details.severityLevel) {
      case 'critical':
        return 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400';
      case 'high':
        return 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-400';
      case 'low':
        return 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400';
      default:
        return '';
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl"
    >
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-lg font-medium text-red-800 dark:text-red-300">
              Website Connection Issue
            </h3>
            <div className="mt-2">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {/* Protocol indicator */}
                <div className="flex items-center">
                  <ProtocolIcon className="h-4 w-4 mr-1 text-red-600 dark:text-red-400" />
                  <span className="text-xs font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/40 px-2 py-0.5 rounded">{protocolLabel}</span>
                </div>
                
                {/* SSL issue indicator */}
                {isSecure && isSslError && (
                  <span className="text-xs text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/40 px-2 py-0.5 rounded">
                    SSL/TLS Issue Detected
                  </span>
                )}
                
                {/* Severity indicator if available */}
                {details.severityLevel && (
                  <div className="flex items-center">
                    {getSeverityIcon()}
                    <span className={`ml-1 text-xs font-medium px-2 py-0.5 rounded ${getSeverityClass()}`}>
                      {getSeverityLabel()} Severity
                    </span>
                  </div>
                )}
                
                {/* Expertise indicator if available */}
                {details.requiresExpertise && (
                  <span className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                    Requires Technical Expertise
                  </span>
                )}
              </div>
              
              <div className="mt-3">
                <p className="text-sm text-red-700 dark:text-red-300">
                  We couldn't connect to <strong>{url}</strong>
                </p>
                
                {/* Error message */}
                <div className="mt-2 p-3 bg-red-100 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                  <p className="text-sm font-medium text-red-800 dark:text-red-300">
                    {details.message}
                  </p>
                  <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                    {details.userFriendlyMessage}
                  </p>
                </div>
              </div>
              
              {/* Technical details if available */}
              {details.technicalDetails && (
                <div className="mt-3">
                  <div className="flex items-center mb-1">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Technical Details:</span>
                  </div>
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono text-gray-800 dark:text-gray-300 overflow-x-auto">
                    {details.technicalDetails}
                  </div>
                </div>
              )}
              
              {/* Solutions section */}
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-2">
                  Possible Solutions:
                </h4>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-2 list-disc list-inside">
                  {details.possibleSolutions.map((solution, index) => (
                    <li key={index}>{solution}</li>
                  ))}
                </ul>
              </div>
              
              {/* Learn more link if available */}
              {details.learnMoreUrl && (
                <div className="mt-3">
                  <a 
                    href={details.learnMoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <HelpCircle className="h-4 w-4 mr-1" />
                    Learn more about this issue
                  </a>
                </div>
              )}
              
              <div className="mt-4 pt-3 border-t border-red-200 dark:border-red-800 flex flex-wrap items-center gap-4">
                <button
                  onClick={onDismiss}
                  className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-red-300 dark:border-red-700 rounded-md text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Dismiss
                </button>
                
                {/* HTTP Fallback button for HTTPS SSL errors */}
                {isSecure && details.type === 'ssl' && onTryAlternative && (
                  <button
                    onClick={() => onTryAlternative(httpsToHttp(url))}
                    className="inline-flex items-center px-3 py-1.5 bg-white dark:bg-gray-800 border border-amber-300 dark:border-amber-700 rounded-md text-sm font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                  >
                    <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                    Try HTTP instead
                  </button>
                )}
                
                <a 
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Open website <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}