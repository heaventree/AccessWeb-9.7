import React, { useState } from 'react';

/**
 * WCAG Checker Page component
 * This page provides tools to check web content against WCAG standards
 */
const WCAGCheckerPage: React.FC = () => {
  const [url, setUrl] = useState('');
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-[130px] pb-[80px]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-6 mb-8">
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
                  className="px-6 py-3 rounded-full bg-[#0fae96] hover:bg-[#0c9a85] text-white font-medium transition-colors"
                  disabled={!url}
                >
                  Start Scan
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Enter a complete URL including http:// or https://
              </p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              WCAG Standards
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Perceivable
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Information and user interface components must be presentable to users in ways they can perceive.
                </p>
                <ul className="mt-3 space-y-1">
                  <li className="text-[#0fae96] dark:text-[#5eead4]">✓ Text alternatives</li>
                  <li className="text-[#0fae96] dark:text-[#5eead4]">✓ Time-based media</li>
                  <li className="text-[#0fae96] dark:text-[#5eead4]">✓ Adaptable content</li>
                  <li className="text-[#0fae96] dark:text-[#5eead4]">✓ Distinguishable content</li>
                </ul>
              </div>
              
              <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Operable
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  User interface components and navigation must be operable.
                </p>
                <ul className="mt-3 space-y-1">
                  <li className="text-[#0fae96] dark:text-[#5eead4]">✓ Keyboard accessibility</li>
                  <li className="text-[#0fae96] dark:text-[#5eead4]">✓ Enough time</li>
                  <li className="text-[#0fae96] dark:text-[#5eead4]">✓ Seizures and physical reactions</li>
                  <li className="text-[#0fae96] dark:text-[#5eead4]">✓ Navigable</li>
                </ul>
              </div>
              
              <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Understandable
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Information and the operation of user interface must be understandable.
                </p>
                <ul className="mt-3 space-y-1">
                  <li className="text-[#0fae96] dark:text-[#5eead4]">✓ Readable content</li>
                  <li className="text-[#0fae96] dark:text-[#5eead4]">✓ Predictable operation</li>
                  <li className="text-[#0fae96] dark:text-[#5eead4]">✓ Input assistance</li>
                </ul>
              </div>
              
              <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Robust
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Content must be robust enough to be interpreted by a wide variety of user agents.
                </p>
                <ul className="mt-3 space-y-1">
                  <li className="text-[#0fae96] dark:text-[#5eead4]">✓ Compatible with current and future tools</li>
                  <li className="text-[#0fae96] dark:text-[#5eead4]">✓ Parsing and validation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WCAGCheckerPage;