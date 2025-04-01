import React, { useState, useEffect } from 'react';
import { 
  ZoomIn, 
  ZoomOut,
  Glasses,
  AlignLeft,
  AlignCenter,
  Eye,
  Keyboard,
  Volume2,
  RotateCcw,
  MousePointer2,
  Underline,
  Palette
} from 'lucide-react';

interface AccessibilitySettings {
  fontSize: number;
  textAlign: 'left' | 'center' | 'right';
  cursor: 'normal' | 'large';
  highlightLinks: boolean;
  highlightFocus: boolean;
  virtualKeyboard: boolean;
  highContrast: boolean;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 100,
  textAlign: 'left',
  cursor: 'normal',
  highlightLinks: false,
  highlightFocus: false,
  virtualKeyboard: false,
  highContrast: false
};

export function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem('accessibility-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    applySettings(settings);
  }, [settings]);

  const applySettings = (newSettings: AccessibilitySettings) => {
    const root = document.documentElement;
    
    // Font size
    root.style.fontSize = `${newSettings.fontSize}%`;

    // Text alignment
    root.style.textAlign = newSettings.textAlign;

    // Cursor
    root.classList.toggle('large-cursor', newSettings.cursor === 'large');

    // Links
    root.classList.toggle('highlight-links', newSettings.highlightLinks);

    // Focus
    root.classList.toggle('highlight-focus', newSettings.highlightFocus);

    // High Contrast
    root.classList.toggle('high-contrast', newSettings.highContrast);
  };

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  const toggleVirtualKeyboard = () => {
    const keyboard = document.getElementById('virtual-keyboard');
    if (!settings.virtualKeyboard) {
      if (!keyboard) {
        const newKeyboard = document.createElement('div');
        newKeyboard.id = 'virtual-keyboard';
        newKeyboard.className = 'fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg p-4 z-50';
        document.body.appendChild(newKeyboard);
      }
    } else if (keyboard) {
      keyboard.remove();
    }
    updateSetting('virtualKeyboard', !settings.virtualKeyboard);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="fixed bottom-4 left-4 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Toggle Accessibility Tools"
      >
        <Glasses className="w-6 h-6" />
      </button>

      <div
        className={`fixed left-4 bottom-20 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Accessibility Tools
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            {/* Text Size */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">Text Size</label>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => updateSetting('fontSize', Math.max(80, settings.fontSize - 10))}
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  aria-label="Decrease Font Size"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-sm">{settings.fontSize}%</span>
                <button
                  onClick={() => updateSetting('fontSize', Math.min(200, settings.fontSize + 10))}
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  aria-label="Increase Font Size"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Text Alignment */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">Text Alignment</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => updateSetting('textAlign', 'left')}
                  className={`p-2 rounded-lg ${
                    settings.textAlign === 'left'
                      ? 'bg-blue-100 dark:bg-blue-900'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                  aria-label="Align Left"
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => updateSetting('textAlign', 'center')}
                  className={`p-2 rounded-lg ${
                    settings.textAlign === 'center'
                      ? 'bg-blue-100 dark:bg-blue-900'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                  aria-label="Align Center"
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Toggle Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => updateSetting('cursor', settings.cursor === 'normal' ? 'large' : 'normal')}
                className={`w-full flex items-center justify-between p-2 rounded-lg ${
                  settings.cursor === 'large'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="flex items-center">
                  <MousePointer2 className="w-4 h-4 mr-2" />
                  <span className="text-sm">Large Cursor</span>
                </span>
              </button>

              <button
                onClick={() => updateSetting('highlightLinks', !settings.highlightLinks)}
                className={`w-full flex items-center justify-between p-2 rounded-lg ${
                  settings.highlightLinks
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="flex items-center">
                  <Underline className="w-4 h-4 mr-2" />
                  <span className="text-sm">Highlight Links</span>
                </span>
              </button>

              <button
                onClick={() => updateSetting('highlightFocus', !settings.highlightFocus)}
                className={`w-full flex items-center justify-between p-2 rounded-lg ${
                  settings.highlightFocus
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  <span className="text-sm">Highlight Focus</span>
                </span>
              </button>

              <button
                onClick={() => updateSetting('highContrast', !settings.highContrast)}
                className={`w-full flex items-center justify-between p-2 rounded-lg ${
                  settings.highContrast
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="flex items-center">
                  <Palette className="w-4 h-4 mr-2" />
                  <span className="text-sm">High Contrast</span>
                </span>
              </button>

              <button
                onClick={toggleVirtualKeyboard}
                className={`w-full flex items-center justify-between p-2 rounded-lg ${
                  settings.virtualKeyboard
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="flex items-center">
                  <Keyboard className="w-4 h-4 mr-2" />
                  <span className="text-sm">Virtual Keyboard</span>
                </span>
              </button>

              <button
                onClick={() => alert('Text-to-speech feature coming soon!')}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                <span className="flex items-center">
                  <Volume2 className="w-4 h-4 mr-2" />
                  <span className="text-sm">Text to Speech</span>
                </span>
              </button>
            </div>

            {/* Reset Button */}
            <button
              onClick={resetSettings}
              className="w-full flex items-center justify-center p-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset All Settings
            </button>
          </div>
        </div>
      </div>
    </>
  );
}