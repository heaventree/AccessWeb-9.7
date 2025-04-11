import { useState } from 'react';
import { PanelRight, X } from 'lucide-react';
import { useUIEnhancement } from '../contexts/UIEnhancementContext';

export function UIEnhancementToggle() {
  const { uiMode, setUIMode, featureFlags, toggleFeatureFlag } = useUIEnhancement();
  const [panelOpen, setPanelOpen] = useState(false);
  
  const togglePanel = () => {
    setPanelOpen(!panelOpen);
  };
  
  const toggleMode = () => {
    setUIMode(uiMode === 'current' ? 'enhanced' : 'current');
  };
  
  const featureOptions = [
    { key: 'enhancedNavigation', label: 'Enhanced Navigation' },
    { key: 'enhancedFooter', label: 'Enhanced Footer' },
    { key: 'enhancedCards', label: 'Enhanced Cards' },
    { key: 'enhancedTables', label: 'Enhanced Tables' },
    { key: 'enhancedForms', label: 'Enhanced Forms' },
    { key: 'enhancedButtons', label: 'Enhanced Buttons' },
    { key: 'enhancedAnalytics', label: 'Enhanced Analytics' },
    { key: 'enhancedDashboards', label: 'Enhanced Dashboards' },
  ];
  
  return (
    <>
      {/* Floating toggle button */}
      <button
        className="fixed right-4 bottom-4 z-50 p-3 rounded-full bg-green-600 text-white shadow-lg hover:bg-green-700 transition-colors animate-pulse"
        onClick={togglePanel}
        aria-label="Toggle UI Enhancement Panel"
        aria-expanded={panelOpen}
        aria-controls="enhancement-panel"
      >
        <PanelRight className="w-5 h-5" />
      </button>
      
      {/* Panel */}
      {panelOpen && (
        <div 
          id="enhancement-panel"
          className="fixed right-4 bottom-16 z-50 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {/* Panel header */}
          <div className="flex items-center justify-between bg-blue-600 dark:bg-blue-700 text-white p-3">
            <h2 className="text-sm font-medium">UI Enhancement Options</h2>
            <button 
              onClick={togglePanel}
              className="text-white/80 hover:text-white"
              aria-label="Close panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Main toggle switch */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Enhanced UI Mode</span>
              <button
                onClick={toggleMode}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
                  uiMode === 'enhanced' ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                role="switch"
                aria-checked={uiMode === 'enhanced'}
              >
                <span 
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    uiMode === 'enhanced' ? 'translate-x-6' : 'translate-x-1'
                  }`} 
                />
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {uiMode === 'enhanced' 
                ? 'Using enhanced UI with modern design patterns' 
                : 'Using current UI with standard design'}
            </p>
          </div>
          
          {/* Feature toggles */}
          {uiMode === 'enhanced' && (
            <div className="p-4">
              <h3 className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 mb-3">Feature Toggles</h3>
              <div className="space-y-3">
                {featureOptions.map((feature) => {
                  const isDisabled = (
                    (feature.key === 'enhancedNavigation' || feature.key === 'enhancedFooter') && 
                    uiMode === 'enhanced'
                  );
                  
                  return (
                    <div key={feature.key} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{feature.label}</span>
                        {isDisabled && (
                          <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">(required)</span>
                        )}
                      </div>
                      <button
                        onClick={() => toggleFeatureFlag(feature.key as keyof typeof featureFlags)}
                        disabled={isDisabled}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
                          featureFlags[feature.key as keyof typeof featureFlags] 
                            ? 'bg-blue-600' 
                            : 'bg-gray-300 dark:bg-gray-600'
                        } ${isDisabled ? 'opacity-70 cursor-not-allowed' : ''}`}
                        role="switch"
                        aria-checked={featureFlags[feature.key as keyof typeof featureFlags]}
                      >
                        <span 
                          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                            featureFlags[feature.key as keyof typeof featureFlags] 
                              ? 'translate-x-5' 
                              : 'translate-x-1'
                          }`} 
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-900 p-3 text-xs text-center text-gray-500 dark:text-gray-400">
            WCAG 9.4 - Non-destructive UI Enhancement
          </div>
        </div>
      )}
    </>
  );
}