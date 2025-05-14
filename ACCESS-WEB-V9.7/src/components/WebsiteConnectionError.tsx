import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Shield, 
  Clock, 
  Globe, 
  ServerCrash, 
  Wifi, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import type { ConnectionErrorDetails } from '../utils/websiteConnectionErrorHandler';

interface WebsiteConnectionErrorProps {
  url: string;
  errorDetails: ConnectionErrorDetails;
}

export const WebsiteConnectionError: React.FC<WebsiteConnectionErrorProps> = ({ 
  url, 
  errorDetails 
}) => {
  const [showDetails, setShowDetails] = useState(false);

  // Select icon based on error type
  const getIcon = () => {
    switch (errorDetails.type) {
      case 'ssl':
        return <Shield className="h-6 w-6 text-orange-500" />;
      case 'timeout':
        return <Clock className="h-6 w-6 text-orange-500" />;
      case 'cors':
        return <Shield className="h-6 w-6 text-orange-500" />;
      case 'dns':
        return <Globe className="h-6 w-6 text-orange-500" />;
      case 'http':
        return <ServerCrash className="h-6 w-6 text-orange-500" />;
      case 'network':
        return <Wifi className="h-6 w-6 text-orange-500" />;
      default:
        return <AlertTriangle className="h-6 w-6 text-orange-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6 mb-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 bg-orange-100 dark:bg-orange-900/20 p-3 rounded-full">
          {getIcon()}
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {errorDetails.message}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We couldn't connect to <span className="font-semibold break-all">{url}</span>. 
            {errorDetails.userFriendlyMessage}
          </p>
          
          {/* Toggle button for technical details */}
          <button 
            className="inline-flex items-center text-sm font-medium text-[#0fae96] hover:text-[#0fae96]/80 dark:text-teal-400 dark:hover:text-teal-300"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? (
              <>
                <ChevronUp className="mr-1 h-4 w-4" />
                Hide details
              </>
            ) : (
              <>
                <ChevronDown className="mr-1 h-4 w-4" />
                Show details
              </>
            )}
          </button>
          
          {/* Collapsible details section */}
          {showDetails && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Possible Solutions:
              </h4>
              
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 mb-4">
                {errorDetails.possibleSolutions.map((solution, index) => (
                  <li key={index} className="text-sm">
                    {solution}
                  </li>
                ))}
              </ul>
              
              {errorDetails.technicalDetails && (
                <>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Technical Details:
                  </h4>
                  <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded-md text-xs font-mono text-gray-700 dark:text-gray-300 overflow-x-auto">
                    {errorDetails.technicalDetails}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};