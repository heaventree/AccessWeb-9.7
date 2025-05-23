import React, { useState } from 'react';
import { Gauge } from 'lucide-react';

interface URLInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
  compact?: boolean;
}

export function URLInput({ onSubmit, isLoading, compact = false }: URLInputProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let processedUrl = url.trim();
    
    try {
      // Validate URL format
      if (!/^https?:\/\//i.test(processedUrl)) {
        processedUrl = 'https://' + processedUrl;
      }

      // Test if URL is valid
      new URL(processedUrl);
      
      onSubmit(processedUrl);
    } catch (err) {
      setError('Please enter a valid URL (e.g., example.com)');
    }
  };

  if (compact) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex items-stretch w-full bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL (e.g., example.com)"
              className="flex-1 px-4 py-2 text-base text-gray-700 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0fae96]/50 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-300"
              disabled={isLoading}
              required
              aria-invalid={!!error}
              aria-describedby={error ? "url-error" : undefined}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="ml-2 px-6 py-2 bg-[#0fae96] hover:bg-teal-600 text-white font-medium rounded-full flex items-center transition-colors disabled:opacity-50 disabled:hover:bg-[#0fae96]"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Checking...</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <Gauge className="w-5 h-5 mr-2" />
                  <span>Check</span>
                </div>
              )}
            </button>
          </div>
          {error && (
            <p id="url-error" className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          )}
        </form>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-stretch w-full bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg border border-gray-100 dark:border-gray-700">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL (e.g., example.com)"
              className="flex-1 px-6 py-4 text-lg text-gray-700 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0fae96]/50 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-300"
              disabled={isLoading}
              required
              aria-invalid={!!error}
              aria-describedby={error ? "url-error" : undefined}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="ml-3 px-8 py-4 bg-[#0fae96] hover:bg-teal-600 text-white font-medium rounded-full flex items-center transition-colors disabled:opacity-50 disabled:hover:bg-[#0fae96]"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Checking...</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <Gauge className="w-5 h-5 mr-2" />
                  <span>Check Site</span>
                </div>
              )}
            </button>
          </div>
          {error && (
            <p id="url-error" className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          )}
          <p className="text-sm text-[#0fae96] dark:text-[#5eead4]">
            The scan typically takes 30-60 seconds depending on the size of your website
          </p>
        </div>
      </form>
    </div>
  );
}