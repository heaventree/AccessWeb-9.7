import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Check } from 'lucide-react';
import { accessibilityCompliancePercentage } from '../utils/accessibility-compliance';

export function AccessibilityBadge() {
  const [showDetails, setShowDetails] = useState(false);
  const compliancePercentage = accessibilityCompliancePercentage();
  
  return (
    <>
      {/* Badge button */}
      <motion.button
        className="fixed right-5 bottom-5 bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 p-2 rounded-full shadow-lg z-40 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center"
        onClick={() => setShowDetails(!showDetails)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Show accessibility compliance details"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="relative h-10 w-10 flex items-center justify-center">
          <Shield className="h-8 w-8" />
          <span className="absolute text-xs font-bold">{compliancePercentage}%</span>
        </div>
      </motion.button>
      
      {/* Details tooltip */}
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.9 }}
        animate={showDetails ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className={`fixed right-5 bottom-20 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-40 p-4 max-w-xs w-full ${!showDetails && 'pointer-events-none'}`}
      >
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Accessibility Status</h3>
          
          <div className="flex items-center justify-center w-20 h-20 mb-2 relative">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
              <circle 
                className="text-gray-200 dark:text-gray-700" 
                strokeWidth="10" 
                stroke="currentColor" 
                fill="transparent" 
                r="40" 
                cx="50" 
                cy="50" 
              />
              <circle 
                className="text-green-500" 
                strokeWidth="10" 
                strokeDasharray={250.8} 
                strokeDashoffset={250.8 - (compliancePercentage / 100) * 250.8} 
                strokeLinecap="round" 
                stroke="currentColor" 
                fill="transparent" 
                r="40" 
                cx="50" 
                cy="50" 
              />
            </svg>
            <span className="absolute text-xl font-semibold">{compliancePercentage}%</span>
          </div>
          
          <div className="text-center mb-4">
            <div className="inline-flex items-center text-green-600 dark:text-green-400 font-medium">
              <Check className="w-4 h-4 mr-1" />
              WCAG 2.2 AA Compliant
            </div>
          </div>
          
          <a 
            href="/accessibility-demo" 
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-1"
            onClick={(e) => {
              // Allow the link to work
              e.stopPropagation();
            }}
          >
            View accessibility features
          </a>
          
          <button 
            className="text-xs text-gray-500 mt-2 hover:text-gray-700 dark:hover:text-gray-300"
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails(false);
            }}
          >
            Close
          </button>
        </div>
      </motion.div>
    </>
  );
}