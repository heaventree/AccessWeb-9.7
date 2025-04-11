import { useState } from 'react';
import { useUIEnhancement } from '../contexts/UIEnhancementContext';
import { XCircle, Settings } from 'lucide-react';

export function UIEnhancementToggle() {
  const { featureFlags, toggleFeatureFlag } = useUIEnhancement();
  const [isOpen, setIsOpen] = useState(false);
  
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <div className="fixed bottom-20 right-8 z-50">
      {isOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-2 border border-gray-200 dark:border-gray-700 w-72">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">UI Enhancement Options</h3>
            <button
              onClick={handleToggle}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              aria-label="Close enhancement options"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="toggle-navigation" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Enhanced Navigation
              </label>
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  id="toggle-navigation"
                  className="sr-only"
                  checked={featureFlags.enhancedNavigation}
                  onChange={() => toggleFeatureFlag('enhancedNavigation')}
                />
                <div className={`block w-12 h-6 rounded-full ${featureFlags.enhancedNavigation ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${featureFlags.enhancedNavigation ? 'transform translate-x-6' : ''}`}></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label htmlFor="toggle-footer" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Enhanced Footer
              </label>
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  id="toggle-footer"
                  className="sr-only"
                  checked={featureFlags.enhancedFooter}
                  onChange={() => toggleFeatureFlag('enhancedFooter')}
                />
                <div className={`block w-12 h-6 rounded-full ${featureFlags.enhancedFooter ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${featureFlags.enhancedFooter ? 'transform translate-x-6' : ''}`}></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label htmlFor="toggle-cards" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Enhanced Cards
              </label>
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  id="toggle-cards"
                  className="sr-only"
                  checked={featureFlags.enhancedCards}
                  onChange={() => toggleFeatureFlag('enhancedCards')}
                />
                <div className={`block w-12 h-6 rounded-full ${featureFlags.enhancedCards ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${featureFlags.enhancedCards ? 'transform translate-x-6' : ''}`}></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label htmlFor="toggle-tables" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Enhanced Tables
              </label>
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  id="toggle-tables"
                  className="sr-only"
                  checked={featureFlags.enhancedTables}
                  onChange={() => toggleFeatureFlag('enhancedTables')}
                />
                <div className={`block w-12 h-6 rounded-full ${featureFlags.enhancedTables ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${featureFlags.enhancedTables ? 'transform translate-x-6' : ''}`}></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label htmlFor="toggle-forms" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Enhanced Forms
              </label>
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  id="toggle-forms"
                  className="sr-only"
                  checked={featureFlags.enhancedForms}
                  onChange={() => toggleFeatureFlag('enhancedForms')}
                />
                <div className={`block w-12 h-6 rounded-full ${featureFlags.enhancedForms ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${featureFlags.enhancedForms ? 'transform translate-x-6' : ''}`}></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label htmlFor="toggle-buttons" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Enhanced Buttons
              </label>
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  id="toggle-buttons"
                  className="sr-only"
                  checked={featureFlags.enhancedButtons}
                  onChange={() => toggleFeatureFlag('enhancedButtons')}
                />
                <div className={`block w-12 h-6 rounded-full ${featureFlags.enhancedButtons ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${featureFlags.enhancedButtons ? 'transform translate-x-6' : ''}`}></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label htmlFor="toggle-analytics" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Enhanced Analytics
              </label>
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  id="toggle-analytics"
                  className="sr-only"
                  checked={featureFlags.enhancedAnalytics}
                  onChange={() => toggleFeatureFlag('enhancedAnalytics')}
                />
                <div className={`block w-12 h-6 rounded-full ${featureFlags.enhancedAnalytics ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${featureFlags.enhancedAnalytics ? 'transform translate-x-6' : ''}`}></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label htmlFor="toggle-dashboards" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Enhanced Dashboards
              </label>
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  id="toggle-dashboards"
                  className="sr-only"
                  checked={featureFlags.enhancedDashboards}
                  onChange={() => toggleFeatureFlag('enhancedDashboards')}
                />
                <div className={`block w-12 h-6 rounded-full ${featureFlags.enhancedDashboards ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${featureFlags.enhancedDashboards ? 'transform translate-x-6' : ''}`}></div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <button
        onClick={handleToggle}
        className={`p-3 rounded-full shadow-lg ${
          isOpen ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
        }`}
        aria-label={isOpen ? 'Close enhancement options' : 'Open enhancement options'}
        title={isOpen ? 'Close enhancement options' : 'Open enhancement options'}
      >
        <Settings className="w-6 h-6" />
      </button>
    </div>
  );
}