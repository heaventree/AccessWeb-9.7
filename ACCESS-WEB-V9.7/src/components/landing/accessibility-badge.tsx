import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function AccessibilityBadge() {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 p-4 flex items-start max-w-xs">
        <CheckCircle className="w-5 h-5 text-[#0fae96] dark:text-[#5eead4] flex-shrink-0 mt-0.5 mr-3" />
        <div>
          <div className="flex justify-between items-center mb-1">
            <p className="font-semibold text-sm text-foreground">WCAG 2.1 AA Compliant</p>
            <button 
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 ml-2"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            This website meets WCAG 2.1 AA accessibility standards
          </p>
        </div>
      </div>
    </motion.div>
  );
}