import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiEye, FiX, FiMessageCircle, FiAlertCircle, FiHelpCircle, FiSettings } from 'react-icons/fi';
import { useAccessibilityTips } from '../contexts/AccessibilityTipsContext';
import { AccessibilityTipTooltip } from './accessibility/AccessibilityTipTooltip';

export function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isEnabled, setIsEnabled, tips } = useAccessibilityTips();
  const [hidePosition, setHidePosition] = useState(false);

  // Handle toolbar position to be completly offscreen when hidden
  useEffect(() => {
    if (!isOpen) {
      // Delay hiding position until after animation completes
      const timer = setTimeout(() => {
        setHidePosition(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setHidePosition(false);
    }
  }, [isOpen]);

  // Toggle tips and store in preferences
  const handleToggleTips = () => {
    setIsEnabled(!isEnabled);
  };

  // Keyboard shortcut to toggle toolbar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+A to toggle toolbar
      if (e.altKey && e.key === 'a') {
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`fixed right-0 top-24 bg-white rounded-l-lg shadow-lg z-50 overflow-hidden ${hidePosition && !isOpen ? 'right-[-280px]' : ''}`}
        style={{ width: 280 }}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Accessibility Tools</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close toolbar"
            >
              <span aria-hidden="true"><FiX size={20} /></span>
            </button>
          </div>

          <div className="space-y-4">
            {/* Quick Tips Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span aria-hidden="true"><FiEye className="mr-2 text-primary-600" size={18} /></span>
                <span className="text-sm font-medium text-gray-700">Accessibility Tips</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isEnabled}
                  onChange={handleToggleTips}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            {/* Tip stats */}
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Active tips:</span>
                <span className="font-semibold">{tips.length}</span>
              </div>
            </div>

            {/* Tools */}
            <div className="space-y-2">
              <button
                className="w-full flex items-center p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => {}}
              >
                <span aria-hidden="true"><FiAlertCircle className="mr-2 text-yellow-500" size={16} /></span>
                <span>Run accessibility audit</span>
              </button>
              
              <button
                className="w-full flex items-center p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => {}}
              >
                <span aria-hidden="true"><FiMessageCircle className="mr-2 text-blue-500" size={16} /></span>
                <span>Open live chat support</span>
              </button>
              
              <button
                className="w-full flex items-center p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => {}}
              >
                <span aria-hidden="true"><FiHelpCircle className="mr-2 text-purple-500" size={16} /></span>
                <span>View accessibility guide</span>
              </button>
            </div>

            <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
              Press <kbd className="px-2 py-0.5 bg-gray-100 rounded text-xs">Alt + A</kbd> to toggle toolbar
            </div>
          </div>
        </div>
      </motion.div>

      {/* Toggle button */}
      <motion.button
        className="fixed right-0 top-24 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-l-md shadow-lg z-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        onClick={() => setIsOpen(!isOpen)}
        initial={{ x: isOpen ? '100%' : 0 }}
        animate={{ x: isOpen ? '100%' : 0 }}
        transition={{ duration: 0.3 }}
        aria-label="Toggle accessibility toolbar"
      >
        <span aria-hidden="true"><FiSettings size={20} /></span>
      </motion.button>

      {/* Accessibility Tip Tooltip */}
      <AccessibilityTipTooltip />
    </>
  );
}