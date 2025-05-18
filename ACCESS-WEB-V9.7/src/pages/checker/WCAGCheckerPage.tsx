import React, { useState } from 'react';

/**
 * WCAG Checker Page component
 * This page provides tools to check web content against WCAG standards
 */
const WCAGCheckerPage: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  
  const handleScan = () => {
    if (!url) return;
    setIsScanning(true);
    
    // Simulate scan for demo purposes
    setTimeout(() => {
      setIsScanning(false);
    }, 2000);
  };
  
  return (
    <div className="content-container py-12">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            WCAG Accessibility Checker
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Test your website against WCAG 2.1 and 2.2 standards to ensure your content 
            is accessible to everyone, including people with disabilities.
          </p>
          
          <div className="mt-4 p-4 bg-[#0fae96]/5 dark:bg-[#0fae96]/10 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Website URL
            </h2>
            <div className="flex flex-col md:flex-row gap-4">
              <input 
                type="url" 
                className="flex-grow px-4 py-3 rounded-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0fae96]"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                aria-label="Website URL to check"
              />
              <button 
                className="px-6 py-3 rounded-full bg-[#0fae96] hover:bg-[#0c9a85] text-white font-medium transition-colors flex items-center justify-center"
                disabled={!url || isScanning}
                onClick={handleScan}
              >
                {isScanning ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Scanning...
                  </>
                ) : (
                  'Start Scan'
                )}
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Enter a complete URL including http:// or https://
            </p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            WCAG Standards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-5 hover:border-[#0fae96] dark:hover:border-[#5eead4] transition-colors">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Perceivable
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Information and user interface components must be presentable to users in ways they can perceive.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 mr-2 text-[#0fae96] dark:text-[#5eead4]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Text alternatives
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 mr-2 text-[#0fae96] dark:text-[#5eead4]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Time-based media
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 mr-2 text-[#0fae96] dark:text-[#5eead4]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Adaptable content
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 mr-2 text-[#0fae96] dark:text-[#5eead4]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Distinguishable content
                </li>
              </ul>
            </div>
            
            <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-5 hover:border-[#0fae96] dark:hover:border-[#5eead4] transition-colors">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Operable
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                User interface components and navigation must be operable.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 mr-2 text-[#0fae96] dark:text-[#5eead4]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Keyboard accessibility
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 mr-2 text-[#0fae96] dark:text-[#5eead4]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Enough time
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 mr-2 text-[#0fae96] dark:text-[#5eead4]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Seizures and physical reactions
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 mr-2 text-[#0fae96] dark:text-[#5eead4]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Navigable
                </li>
              </ul>
            </div>
            
            <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-5 hover:border-[#0fae96] dark:hover:border-[#5eead4] transition-colors">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Understandable
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Information and the operation of user interface must be understandable.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 mr-2 text-[#0fae96] dark:text-[#5eead4]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Readable content
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 mr-2 text-[#0fae96] dark:text-[#5eead4]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Predictable operation
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 mr-2 text-[#0fae96] dark:text-[#5eead4]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Input assistance
                </li>
              </ul>
            </div>
            
            <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-5 hover:border-[#0fae96] dark:hover:border-[#5eead4] transition-colors">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Robust
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Content must be robust enough to be interpreted by a wide variety of user agents.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 mr-2 text-[#0fae96] dark:text-[#5eead4]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Compatible with current and future tools
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 mr-2 text-[#0fae96] dark:text-[#5eead4]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Parsing and validation
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WCAGCheckerPage;