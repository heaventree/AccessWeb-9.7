import React, { useState } from 'react';
import { WCAGToolbar } from '@/components/WCAGToolbar/WCAGToolbar';
import { motion } from 'framer-motion';
import { FiInfo } from 'react-icons/fi';

/**
 * WCAG Checker Page component
 * This page provides tools to check web content against WCAG standards
 * with geographical filters and advanced configuration options
 */
const WCAGCheckerPage: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('eu');
  const [selectedStandards, setSelectedStandards] = useState(['wcag21', 'wcag22']);
  const [selectedOptions, setSelectedOptions] = useState(['autofix', 'screenshots']);
  
  // Toggle a standard selection
  const toggleStandard = (id: string) => {
    if (selectedStandards.includes(id)) {
      // Don't allow deselecting if it's the last one selected
      if (selectedStandards.length > 1) {
        setSelectedStandards(selectedStandards.filter(item => item !== id));
      }
    } else {
      setSelectedStandards([...selectedStandards, id]);
    }
  };

  // Toggle a testing option
  const toggleOption = (id: string) => {
    if (selectedOptions.includes(id)) {
      setSelectedOptions(selectedOptions.filter(item => item !== id));
    } else {
      setSelectedOptions([...selectedOptions, id]);
    }
  };
  
  // Start the accessibility scan
  const handleScan = () => {
    if (!url) return;
    setIsScanning(true);
    
    // Simulate scan for demo purposes
    setTimeout(() => {
      setIsScanning(false);
    }, 2000);
  };
  
  return (
    <div className="container mx-auto p-6">
      {/* Accessibility Toolbar */}
      <WCAGToolbar position="bottom-right" />
      
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-8">
        <h1 className="text-3xl font-semibold text-center mb-2 text-gray-900 dark:text-white">
          WCAG Accessibility Checker
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          Test your website against WCAG 2.1 and 2.2 standards
        </p>
        
        {/* Region tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {[
            { id: 'eu', label: 'EU' },
            { id: 'uk', label: 'UK' },
            { id: 'usa', label: 'USA' },
            { id: 'canada', label: 'Canada' },
            { id: 'australia', label: 'Australia' },
            { id: 'japan', label: 'Japan' },
            { id: 'global', label: 'Global' }
          ].map(country => (
            <button
              key={country.id}
              className={`px-4 py-2 rounded-full transition ${
                selectedCountry === country.id
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-transparent'
              }`}
              onClick={() => setSelectedCountry(country.id)}
            >
              {country.label}
            </button>
          ))}
        </div>
        
        {/* Standards */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {[
            { id: 'en301549', label: 'EN 301 549', color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400' },
            { id: 'eaa', label: 'EAA', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
            { id: 'wcag21', label: 'WCAG 2.1', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
            { id: 'wcag22', label: 'WCAG 2.2', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
            { id: 'section508', label: 'Section 508', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
            { id: 'aoda', label: 'AODA', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400' }
          ].map(standard => (
            <button
              key={standard.id}
              className={`px-4 py-2 rounded-full transition ${
                selectedStandards.includes(standard.id)
                  ? standard.color + ' border border-current'
                  : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              onClick={() => toggleStandard(standard.id)}
            >
              {standard.label}
            </button>
          ))}
        </div>
        
        {/* Testing Options */}
        <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Testing Options</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'autofix', label: 'Auto-fix suggestions' },
              { id: 'screenshots', label: 'Capture screenshots' },
              { id: 'js', label: 'JavaScript analysis' },
              { id: 'pdf', label: 'PDF documents' }
            ].map(option => (
              <div key={option.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={option.id}
                  checked={selectedOptions.includes(option.id)}
                  onChange={() => toggleOption(option.id)}
                  className="h-4 w-4 text-[#0fae96] border-gray-300 rounded focus:ring-[#0fae96] dark:border-gray-600 dark:focus:ring-offset-slate-800"
                />
                <label htmlFor={option.id} className="ml-2 text-gray-700 dark:text-gray-300">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* URL Input and Check Button */}
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              className="flex-grow px-4 py-3 rounded-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0fae96] dark:focus:ring-[#5eead4]"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              aria-label="Website URL to check"
            />
            <button
              className="px-6 py-3 rounded-full bg-[#0fae96] hover:bg-[#0c9a85] text-white font-medium transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!url || isScanning}
              onClick={handleScan}
            >
              {isScanning ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Checking...
                </>
              ) : (
                'Check Accessibility'
              )}
            </button>
          </div>
        </div>
        
        {/* Scan Duration Info */}
        <div className="text-center">
          <div className="inline-flex items-center text-[#0fae96] dark:text-[#5eead4] text-sm font-medium">
            <FiInfo className="mr-1" />
            <span>Scanning takes approximately 45-60 seconds to complete</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WCAGCheckerPage;