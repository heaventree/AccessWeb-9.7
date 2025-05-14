import React from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export interface WebsiteConnectionErrorProps {
  url: string;
  details: {
    type: string;
    message: string;
    technicalDetails?: string;
    userFriendlyMessage: string;
    possibleSolutions: string[];
  };
  onDismiss: () => void;
}

export function WebsiteConnectionError({ url, details, onDismiss }: WebsiteConnectionErrorProps) {
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
              <p className="text-sm text-red-700 dark:text-red-300">
                We couldn't connect to <strong>{url}</strong>
              </p>
              <p className="mt-2 text-sm text-red-700 dark:text-red-300">
                {details.userFriendlyMessage}
              </p>
              
              {details.technicalDetails && (
                <div className="mt-3 p-2 bg-red-100 dark:bg-red-900/30 rounded text-xs font-mono text-red-800 dark:text-red-300">
                  {details.technicalDetails}
                </div>
              )}
              
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-2">
                  Possible Solutions:
                </h4>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1 list-disc list-inside">
                  {details.possibleSolutions.map((solution, index) => (
                    <li key={index}>{solution}</li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-4 flex items-center space-x-4">
                <button
                  onClick={onDismiss}
                  className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                >
                  Dismiss
                </button>
                <a 
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                >
                  Open website <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}