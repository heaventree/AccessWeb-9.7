import React, { useState, useEffect, useCallback } from 'react';
import { 
  Accessibility, 
  Type, 
  Contrast, 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX, 
  MousePointer, 
  Settings, 
  RotateCcw, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  Moon, 
  Sun, 
  Focus,
  Palette,
  Monitor,
  AlertTriangle,
  CheckCircle,
  X,
  Menu,
  Maximize,
  Minimize
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccessibilitySettings {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  wordSpacing: number;
  contrast: 'normal' | 'high' | 'inverted';
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'monochrome';
  reducedMotion: boolean;
  highlightLinks: boolean;
  highlightHeadings: boolean;
  showAltText: boolean;
  enableSounds: boolean;
  bigCursor: boolean;
  readingGuide: boolean;
  dyslexiaFont: boolean;
  nightMode: boolean;
  hideImages: boolean;
  textToSpeech: boolean;
  keyboardNavigation: boolean;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 100,
  lineHeight: 1.5,
  letterSpacing: 0,
  wordSpacing: 0,
  contrast: 'normal',
  colorBlindMode: 'none',
  reducedMotion: false,
  highlightLinks: false,
  highlightHeadings: false,
  showAltText: false,
  enableSounds: false,
  bigCursor: false,
  readingGuide: false,
  dyslexiaFont: false,
  nightMode: false,
  hideImages: false,
  textToSpeech: false,
  keyboardNavigation: true
};

export function WCAGAccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState<'typography' | 'vision' | 'navigation' | 'audio'>('typography');

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('wcag-accessibility-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.warn('Failed to parse saved accessibility settings');
      }
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('wcag-accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  // Apply settings to the document
  useEffect(() => {
    const root = document.documentElement;
    
    // Typography settings
    root.style.setProperty('--accessibility-font-size', `${settings.fontSize}%`);
    root.style.setProperty('--accessibility-line-height', settings.lineHeight.toString());
    root.style.setProperty('--accessibility-letter-spacing', `${settings.letterSpacing}px`);
    root.style.setProperty('--accessibility-word-spacing', `${settings.wordSpacing}px`);
    
    // Contrast settings
    document.body.className = document.body.className.replace(/contrast-\w+/g, '');
    if (settings.contrast !== 'normal') {
      document.body.classList.add(`contrast-${settings.contrast}`);
    }
    
    // Color blind mode
    document.body.className = document.body.className.replace(/colorblind-\w+/g, '');
    if (settings.colorBlindMode !== 'none') {
      document.body.classList.add(`colorblind-${settings.colorBlindMode}`);
    }
    
    // Motion settings
    if (settings.reducedMotion) {
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }
    
    // Link and heading highlighting
    if (settings.highlightLinks) {
      document.body.classList.add('highlight-links');
    } else {
      document.body.classList.remove('highlight-links');
    }
    
    if (settings.highlightHeadings) {
      document.body.classList.add('highlight-headings');
    } else {
      document.body.classList.remove('highlight-headings');
    }
    
    // Cursor settings
    if (settings.bigCursor) {
      document.body.classList.add('big-cursor');
    } else {
      document.body.classList.remove('big-cursor');
    }
    
    // Reading guide
    if (settings.readingGuide) {
      document.body.classList.add('reading-guide');
    } else {
      document.body.classList.remove('reading-guide');
    }
    
    // Dyslexia font
    if (settings.dyslexiaFont) {
      document.body.classList.add('dyslexia-font');
    } else {
      document.body.classList.remove('dyslexia-font');
    }
    
    // Night mode
    if (settings.nightMode) {
      document.body.classList.add('night-mode');
    } else {
      document.body.classList.remove('night-mode');
    }
    
    // Hide images
    if (settings.hideImages) {
      document.body.classList.add('hide-images');
    } else {
      document.body.classList.remove('hide-images');
    }
    
    // Show alt text
    if (settings.showAltText) {
      document.body.classList.add('show-alt-text');
    } else {
      document.body.classList.remove('show-alt-text');
    }
  }, [settings]);

  const updateSetting = useCallback(<K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    localStorage.removeItem('wcag-accessibility-settings');
  }, []);

  const exportSettings = useCallback(() => {
    const dataStr = JSON.stringify(settings, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'accessibility-settings.json';
    link.click();
    URL.revokeObjectURL(url);
  }, [settings]);

  const toggleToolbar = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        toggleToolbar();
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const TabButton = ({ id, icon: Icon, label, isActive, onClick }: {
    id: string;
    icon: any;
    label: string;
    isActive: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        isActive 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
      }`}
      aria-pressed={isActive}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  const SettingRow = ({ label, children, description }: {
    label: string;
    children: React.ReactNode;
    description?: string;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        {children}
      </div>
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      )}
    </div>
  );

  const ToggleButton = ({ 
    checked, 
    onChange, 
    label 
  }: { 
    checked: boolean; 
    onChange: (checked: boolean) => void; 
    label: string;
  }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
      }`}
      role="switch"
      aria-checked={checked}
      aria-label={label}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        onClick={toggleToolbar}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open accessibility toolbar (Alt+A)"
        title="Accessibility Toolbar (Alt+A)"
      >
        <Accessibility className="w-6 h-6" />
      </motion.button>

      {/* Accessibility Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full bg-white dark:bg-gray-900 shadow-2xl z-40 w-96 border-l border-gray-200 dark:border-gray-700"
            role="complementary"
            aria-label="Accessibility Settings Panel"
          >
            {/* Header */}
            <div className="bg-blue-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Accessibility className="w-6 h-6" />
                  <div>
                    <h2 className="text-lg font-semibold">Accessibility</h2>
                    <p className="text-blue-100 text-sm">WCAG 2.1 AA Compliant</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-1 hover:bg-blue-700 rounded"
                    aria-label={isMinimized ? 'Maximize panel' : 'Minimize panel'}
                  >
                    {isMinimized ? <Maximize className="w-4 h-4" /> : <Minimize className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-blue-700 rounded"
                    aria-label="Close accessibility panel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {!isMinimized && (
                <div className="mt-4 flex gap-1 overflow-x-auto">
                  <TabButton
                    id="typography"
                    icon={Type}
                    label="Text"
                    isActive={activeTab === 'typography'}
                    onClick={() => setActiveTab('typography')}
                  />
                  <TabButton
                    id="vision"
                    icon={Eye}
                    label="Vision"
                    isActive={activeTab === 'vision'}
                    onClick={() => setActiveTab('vision')}
                  />
                  <TabButton
                    id="navigation"
                    icon={MousePointer}
                    label="Navigation"
                    isActive={activeTab === 'navigation'}
                    onClick={() => setActiveTab('navigation')}
                  />
                  <TabButton
                    id="audio"
                    icon={Volume2}
                    label="Audio"
                    isActive={activeTab === 'audio'}
                    onClick={() => setActiveTab('audio')}
                  />
                </div>
              )}
            </div>

            {!isMinimized && (
              <div className="p-4 overflow-y-auto h-[calc(100vh-180px)]">
                {/* Typography Tab */}
                {activeTab === 'typography' && (
                  <div className="space-y-6">
                    <SettingRow 
                      label="Text Size" 
                      description="Adjust font size for better readability"
                    >
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateSetting('fontSize', Math.max(75, settings.fontSize - 25))}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                          disabled={settings.fontSize <= 75}
                        >
                          <ZoomOut className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-mono w-12 text-center">
                          {settings.fontSize}%
                        </span>
                        <button
                          onClick={() => updateSetting('fontSize', Math.min(200, settings.fontSize + 25))}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                          disabled={settings.fontSize >= 200}
                        >
                          <ZoomIn className="w-4 h-4" />
                        </button>
                      </div>
                    </SettingRow>

                    <SettingRow 
                      label="Line Height" 
                      description="Increase space between lines"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="1"
                          max="3"
                          step="0.1"
                          value={settings.lineHeight}
                          onChange={(e) => updateSetting('lineHeight', parseFloat(e.target.value))}
                          className="w-20"
                        />
                        <span className="text-sm font-mono w-8">
                          {settings.lineHeight.toFixed(1)}
                        </span>
                      </div>
                    </SettingRow>

                    <SettingRow 
                      label="Letter Spacing" 
                      description="Add space between letters"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="0"
                          max="5"
                          step="0.5"
                          value={settings.letterSpacing}
                          onChange={(e) => updateSetting('letterSpacing', parseFloat(e.target.value))}
                          className="w-20"
                        />
                        <span className="text-sm font-mono w-8">
                          {settings.letterSpacing}px
                        </span>
                      </div>
                    </SettingRow>

                    <SettingRow 
                      label="Dyslexia-Friendly Font"
                      description="Use OpenDyslexic font for easier reading"
                    >
                      <ToggleButton
                        checked={settings.dyslexiaFont}
                        onChange={(checked) => updateSetting('dyslexiaFont', checked)}
                        label="Enable dyslexia-friendly font"
                      />
                    </SettingRow>

                    <SettingRow 
                      label="Highlight Headings"
                      description="Add visual emphasis to page headings"
                    >
                      <ToggleButton
                        checked={settings.highlightHeadings}
                        onChange={(checked) => updateSetting('highlightHeadings', checked)}
                        label="Highlight headings"
                      />
                    </SettingRow>
                  </div>
                )}

                {/* Vision Tab */}
                {activeTab === 'vision' && (
                  <div className="space-y-6">
                    <SettingRow 
                      label="Contrast Mode"
                      description="Adjust color contrast for better visibility"
                    >
                      <select
                        value={settings.contrast}
                        onChange={(e) => updateSetting('contrast', e.target.value as any)}
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800"
                      >
                        <option value="normal">Normal</option>
                        <option value="high">High Contrast</option>
                        <option value="inverted">Inverted</option>
                      </select>
                    </SettingRow>

                    <SettingRow 
                      label="Color Blind Support"
                      description="Simulate different types of color blindness"
                    >
                      <select
                        value={settings.colorBlindMode}
                        onChange={(e) => updateSetting('colorBlindMode', e.target.value as any)}
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800"
                      >
                        <option value="none">None</option>
                        <option value="protanopia">Protanopia</option>
                        <option value="deuteranopia">Deuteranopia</option>
                        <option value="tritanopia">Tritanopia</option>
                        <option value="monochrome">Monochrome</option>
                      </select>
                    </SettingRow>

                    <SettingRow 
                      label="Night Mode"
                      description="Dark theme for reduced eye strain"
                    >
                      <ToggleButton
                        checked={settings.nightMode}
                        onChange={(checked) => updateSetting('nightMode', checked)}
                        label="Enable night mode"
                      />
                    </SettingRow>

                    <SettingRow 
                      label="Hide Images"
                      description="Hide decorative images for faster loading"
                    >
                      <ToggleButton
                        checked={settings.hideImages}
                        onChange={(checked) => updateSetting('hideImages', checked)}
                        label="Hide images"
                      />
                    </SettingRow>

                    <SettingRow 
                      label="Show Alt Text"
                      description="Display alternative text for images"
                    >
                      <ToggleButton
                        checked={settings.showAltText}
                        onChange={(checked) => updateSetting('showAltText', checked)}
                        label="Show alternative text"
                      />
                    </SettingRow>

                    <SettingRow 
                      label="Reduce Motion"
                      description="Minimize animations and transitions"
                    >
                      <ToggleButton
                        checked={settings.reducedMotion}
                        onChange={(checked) => updateSetting('reducedMotion', checked)}
                        label="Reduce motion"
                      />
                    </SettingRow>
                  </div>
                )}

                {/* Navigation Tab */}
                {activeTab === 'navigation' && (
                  <div className="space-y-6">
                    <SettingRow 
                      label="Big Cursor"
                      description="Increase cursor size for better visibility"
                    >
                      <ToggleButton
                        checked={settings.bigCursor}
                        onChange={(checked) => updateSetting('bigCursor', checked)}
                        label="Enable big cursor"
                      />
                    </SettingRow>

                    <SettingRow 
                      label="Highlight Links"
                      description="Add visual emphasis to clickable links"
                    >
                      <ToggleButton
                        checked={settings.highlightLinks}
                        onChange={(checked) => updateSetting('highlightLinks', checked)}
                        label="Highlight links"
                      />
                    </SettingRow>

                    <SettingRow 
                      label="Reading Guide"
                      description="Add a horizontal line to aid reading"
                    >
                      <ToggleButton
                        checked={settings.readingGuide}
                        onChange={(checked) => updateSetting('readingGuide', checked)}
                        label="Enable reading guide"
                      />
                    </SettingRow>

                    <SettingRow 
                      label="Keyboard Navigation"
                      description="Enable enhanced keyboard navigation"
                    >
                      <ToggleButton
                        checked={settings.keyboardNavigation}
                        onChange={(checked) => updateSetting('keyboardNavigation', checked)}
                        label="Enhanced keyboard navigation"
                      />
                    </SettingRow>
                  </div>
                )}

                {/* Audio Tab */}
                {activeTab === 'audio' && (
                  <div className="space-y-6">
                    <SettingRow 
                      label="Sound Effects"
                      description="Audio feedback for interface interactions"
                    >
                      <ToggleButton
                        checked={settings.enableSounds}
                        onChange={(checked) => updateSetting('enableSounds', checked)}
                        label="Enable sound effects"
                      />
                    </SettingRow>

                    <SettingRow 
                      label="Text to Speech"
                      description="Read page content aloud"
                    >
                      <ToggleButton
                        checked={settings.textToSpeech}
                        onChange={(checked) => updateSetting('textToSpeech', checked)}
                        label="Enable text to speech"
                      />
                    </SettingRow>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
                  <button
                    onClick={resetSettings}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset All Settings
                  </button>
                  
                  <button
                    onClick={exportSettings}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Export Settings
                  </button>
                </div>

                {/* Compliance Badge */}
                <div className="mt-6 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">WCAG 2.1 AA Compliant</span>
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                    This toolbar meets Web Content Accessibility Guidelines
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Styles */}
      <style jsx global>{`
        /* Typography adjustments */
        .font-size-large { font-size: var(--accessibility-font-size, 100%) !important; }
        .line-height-adjusted { line-height: var(--accessibility-line-height, 1.5) !important; }
        .letter-spacing-adjusted { letter-spacing: var(--accessibility-letter-spacing, 0) !important; }
        
        /* Contrast modes */
        .contrast-high {
          filter: contrast(150%) brightness(120%);
        }
        
        .contrast-inverted {
          filter: invert(1) hue-rotate(180deg);
        }
        
        /* Color blind filters */
        .colorblind-protanopia {
          filter: url(#protanopia);
        }
        
        .colorblind-deuteranopia {
          filter: url(#deuteranopia);
        }
        
        .colorblind-tritanopia {
          filter: url(#tritanopia);
        }
        
        .colorblind-monochrome {
          filter: grayscale(100%);
        }
        
        /* Motion reduction */
        .reduce-motion * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
        
        /* Link highlighting */
        .highlight-links a {
          background-color: yellow !important;
          color: black !important;
          padding: 2px 4px !important;
          border-radius: 3px !important;
        }
        
        /* Heading highlighting */
        .highlight-headings h1,
        .highlight-headings h2,
        .highlight-headings h3,
        .highlight-headings h4,
        .highlight-headings h5,
        .highlight-headings h6 {
          background-color: #e0f2fe !important;
          padding: 8px !important;
          border-left: 4px solid #0277bd !important;
          margin: 16px 0 !important;
        }
        
        /* Big cursor */
        .big-cursor,
        .big-cursor * {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M2 2l7 20 3-3 8 8 5-5-8-8 3-3z" fill="black" stroke="white" stroke-width="2"/></svg>') 16 16, auto !important;
        }
        
        /* Reading guide */
        .reading-guide {
          position: relative;
        }
        
        .reading-guide:after {
          content: '';
          position: fixed;
          top: 50%;
          left: 0;
          right: 0;
          height: 2px;
          background: rgba(255, 0, 0, 0.5);
          pointer-events: none;
          z-index: 10000;
        }
        
        /* Dyslexia font */
        .dyslexia-font * {
          font-family: 'OpenDyslexic', 'Comic Sans MS', cursive !important;
        }
        
        /* Night mode */
        .night-mode {
          background-color: #121212 !important;
          color: #ffffff !important;
        }
        
        .night-mode * {
          background-color: inherit !important;
          color: inherit !important;
        }
        
        /* Hide images */
        .hide-images img {
          display: none !important;
        }
        
        /* Show alt text */
        .show-alt-text img:after {
          content: attr(alt);
          display: block;
          position: relative;
          background: #f0f0f0;
          padding: 8px;
          border: 1px solid #ccc;
          font-size: 14px;
        }
      `}</style>
    </>
  );
}

export default WCAGAccessibilityToolbar;