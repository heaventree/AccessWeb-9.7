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
          <div className="flex items-stretch w-full bg-white p-2 rounded-lg shadow-sm border border-gray-200">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL (e.g., example.com)"
              className="flex-1 px-4 py-2 text-base text-gray-700 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
              disabled={isLoading}
              required
              aria-invalid={!!error}
              aria-describedby={error ? "url-error" : undefined}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md flex items-center transition-colors disabled:opacity-50 disabled:hover:bg-blue-600"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Checking...</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <Gauge className="w-4 h-4 mr-2" />
                  <span>Check</span>
                </div>
              )}
            </button>
          </div>
          {error && (
            <p id="url-error" className="mt-2 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
        </form>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col items-center">
          <div className="flex items-stretch w-full bg-white rounded-md border border-gray-200 overflow-hidden">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL (e.g., example.com)"
              className="flex-1 px-4 py-3 text-sm text-gray-600 bg-white focus:outline-none"
              disabled={isLoading}
              required
              aria-invalid={!!error}
              aria-describedby={error ? "url-error" : undefined}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center transition-colors disabled:opacity-50 disabled:hover:bg-blue-600"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Checking...</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <Gauge className="w-4 h-4 mr-2" />
                  <span>Check Site</span>
                </div>
              )}
            </button>
          </div>
          {error && (
            <p id="url-error" className="mt-2 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}