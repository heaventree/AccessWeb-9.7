import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Eye, EyeOff, Palette, Copy, Download, RotateCcw, Info, AlertTriangle, CheckCircle, Settings, Zap, Target } from 'lucide-react';
import Color from 'color';

// Define types for better type safety
type ColorBlindnessType = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'protanomaly' | 'deuteranomaly' | 'tritanomaly' | 'achromatopsia' | 'achromatomaly';
type ElementType = 'text' | 'background' | 'border' | 'link' | 'focus' | 'error' | 'success' | 'warning';

interface ColorPalette {
  text: string;
  background: string;
  primary: string;
  secondary: string;
  accent: string;
  border: string;
  link: string;
  focus: string;
  error: string;
  success: string;
  warning: string;
}

interface ContrastResults {
  ratio: number;
  aa: boolean;
  aaa: boolean;
  aaLarge: boolean;
  aaaLarge: boolean;
  grade: string;
}

// Advanced color utility functions
const colorUtils = {
  // Convert hex to RGB
  hexToRgb: (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },

  // Calculate relative luminance according to WCAG formula
  getLuminance: (hex: string): number => {
    try {
      const color = Color(hex);
      const rgb = color.rgb().array();
      const [r, g, b] = rgb.map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    } catch {
      return 0;
    }
  },

  // Calculate contrast ratio between two colors
  getContrastRatio: (color1: string, color2: string): number => {
    const lum1 = colorUtils.getLuminance(color1);
    const lum2 = colorUtils.getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  },

  // Get comprehensive contrast analysis
  getContrastResults: (textColor: string, backgroundColor: string): ContrastResults => {
    const ratio = colorUtils.getContrastRatio(textColor, backgroundColor);
    return {
      ratio,
      aa: ratio >= 4.5,
      aaa: ratio >= 7,
      aaLarge: ratio >= 3,
      aaaLarge: ratio >= 4.5,
      grade: ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA Large' : 'Fail'
    };
  },

  // Generate accessible color suggestions
  generateAccessibleColor: (baseColor: string, targetRatio: number = 4.5, isBackground: boolean = true): string => {
    try {
      const color = Color(baseColor);
      let adjusted = color;
      
      // Try darkening/lightening to meet contrast ratio
      for (let i = 0; i < 100; i++) {
        const currentRatio = colorUtils.getContrastRatio(
          isBackground ? '#000000' : adjusted.hex(),
          isBackground ? adjusted.hex() : '#ffffff'
        );
        
        if (currentRatio >= targetRatio) {
          return adjusted.hex();
        }
        
        adjusted = currentRatio < targetRatio 
          ? (isBackground ? adjusted.darken(0.05) : adjusted.lighten(0.05))
          : (isBackground ? adjusted.lighten(0.05) : adjusted.darken(0.05));
      }
      
      return adjusted.hex();
    } catch {
      return baseColor;
    }
  }
};

// Predefined color palettes for quick testing
const predefinedPalettes = {
  'High Contrast': {
    text: '#000000',
    background: '#ffffff',
    border: '#000000',
    link: '#0000ff',
    focus: '#005fcc',
    error: '#d00000',
    success: '#008000',
    warning: '#ff8c00'
  },
  'Dark Theme': {
    text: '#ffffff',
    background: '#1a1a1a',
    border: '#444444',
    link: '#66b3ff',
    focus: '#80ccff',
    error: '#ff6b6b',
    success: '#51cf66',
    warning: '#ffd43b'
  },
  'Blue Corporate': {
    text: '#1e3a8a',
    background: '#f8fafc',
    border: '#3b82f6',
    link: '#2563eb',
    focus: '#1d4ed8',
    error: '#dc2626',
    success: '#059669',
    warning: '#d97706'
  },
  'Accessible Web': {
    text: '#2d3748',
    background: '#ffffff',
    border: '#cbd5e0',
    link: '#3182ce',
    focus: '#2c5aa0',
    error: '#e53e3e',
    success: '#38a169',
    warning: '#dd6b20'
  }
};

// Component for simulating color blindness with advanced features
export function ColorAccessibilitySimulator() {
  // Enhanced state management
  const [activeElement, setActiveElement] = useState<ElementType>('background');
  const [simulationMode, setSimulationMode] = useState<ColorBlindnessType>('normal');
  const [colors, setColors] = useState<Record<ElementType, string>>({
    text: '#2d3748',
    background: '#ffffff',
    border: '#cbd5e0',
    link: '#3182ce',
    focus: '#2c5aa0',
    error: '#e53e3e',
    success: '#38a169',
    warning: '#dd6b20'
  });
  const [fontSize, setFontSize] = useState(16);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [autoFix, setAutoFix] = useState(false);
  const [realTimeAnalysis, setRealTimeAnalysis] = useState(true);
  const [exportFormat, setExportFormat] = useState<'css' | 'json' | 'scss'>('css');

  // Refs
  const previewRef = useRef<HTMLDivElement>(null);

  // Calculate comprehensive contrast results
  const contrastResults = colorUtils.getContrastResults(colors.text, colors.background);
  const linkContrastResults = colorUtils.getContrastResults(colors.link, colors.background);

  // Auto-fix functionality
  const handleAutoFix = useCallback(() => {
    const newColors = { ...colors };
    
    // Fix text contrast
    if (contrastResults.ratio < 4.5) {
      newColors.text = colorUtils.generateAccessibleColor(colors.background, 4.5, false);
    }
    
    // Fix link contrast
    if (linkContrastResults.ratio < 4.5) {
      newColors.link = colorUtils.generateAccessibleColor(colors.background, 4.5, false);
    }
    
    setColors(newColors);
  }, [colors, contrastResults.ratio, linkContrastResults.ratio]);

  // Handle color changes with real-time analysis
  const handleColorChange = (element: ElementType, newColor: string) => {
    const newColors = { ...colors, [element]: newColor };
    setColors(newColors);
    
    if (autoFix && realTimeAnalysis) {
      // Auto-suggest fixes for poor contrast
      setTimeout(() => {
        const contrast = colorUtils.getContrastRatio(
          element === 'text' ? newColor : newColors.text,
          element === 'background' ? newColor : newColors.background
        );
        
        if (contrast < 4.5) {
          console.log(`Warning: Contrast ratio ${contrast.toFixed(2)} is below AA standards`);
        }
      }, 100);
    }
  };

  // Export functions
  const exportPalette = () => {
    const data = {
      css: `/* Accessible Color Palette */
:root {
  --text-color: ${colors.text};
  --background-color: ${colors.background};
  --border-color: ${colors.border};
  --link-color: ${colors.link};
  --focus-color: ${colors.focus};
  --error-color: ${colors.error};
  --success-color: ${colors.success};
  --warning-color: ${colors.warning};
}`,
      json: JSON.stringify(colors, null, 2),
      scss: `// Accessible Color Palette
$text-color: ${colors.text};
$background-color: ${colors.background};
$border-color: ${colors.border};
$link-color: ${colors.link};
$focus-color: ${colors.focus};
$error-color: ${colors.error};
$success-color: ${colors.success};
$warning-color: ${colors.warning};`
    };

    const blob = new Blob([data[exportFormat]], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `accessible-colors.${exportFormat}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Copy color to clipboard
  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 mb-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Color Accessibility Simulator
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Professional-grade color accessibility testing with WCAG 2.1 compliance analysis
          </p>
        </div>
        <div className="flex gap-2 mt-4 lg:mt-0">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Settings className="w-4 h-4" />
            {showAdvanced ? 'Simple' : 'Advanced'}
          </button>
          <button
            onClick={exportPalette}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* SVG Filters for enhanced color blindness simulation */}
      <svg className="absolute" style={{ width: 0, height: 0, position: 'absolute' }} aria-hidden="true">
        <defs>
          {/* Complete set of color vision filters */}
          <filter id="protanopia">
            <feColorMatrix values="0.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0"/>
          </filter>
          <filter id="protanomaly">
            <feColorMatrix values="0.817,0.183,0,0,0 0.333,0.667,0,0,0 0,0.125,0.875,0,0 0,0,0,1,0"/>
          </filter>
          <filter id="deuteranopia">
            <feColorMatrix values="0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0"/>
          </filter>
          <filter id="deuteranomaly">
            <feColorMatrix values="0.8,0.2,0,0,0 0.258,0.742,0,0,0 0,0.142,0.858,0,0 0,0,0,1,0"/>
          </filter>
          <filter id="tritanopia">
            <feColorMatrix values="0.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0"/>
          </filter>
          <filter id="tritanomaly">
            <feColorMatrix values="0.967,0.033,0,0,0 0,0.733,0.267,0,0 0,0.183,0.817,0,0 0,0,0,1,0"/>
          </filter>
          <filter id="achromatopsia">
            <feColorMatrix values="0.299,0.587,0.114,0,0 0.299,0.587,0.114,0,0 0.299,0.587,0.114,0,0 0,0,0,1,0"/>
          </filter>
          <filter id="achromatomaly">
            <feColorMatrix values="0.618,0.320,0.062,0,0 0.163,0.775,0.062,0,0 0.163,0.320,0.516,0,0 0,0,0,1,0"/>
          </filter>
        </defs>
      </svg>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Panel - Controls */}
        <div className="xl:col-span-1 space-y-6">
          {/* Color Vision Simulation */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Vision Simulation
            </h3>
            <div className="space-y-2">
              {[
                { value: 'normal', label: 'Normal Vision', percentage: '', severity: '' },
                { value: 'protanopia', label: 'Protanopia', percentage: '1.01% ♂', severity: 'Severe Red-blind' },
                { value: 'protanomaly', label: 'Protanomaly', percentage: '1.08% ♂', severity: 'Mild Red-weak' },
                { value: 'deuteranopia', label: 'Deuteranopia', percentage: '1.27% ♂', severity: 'Severe Green-blind' },
                { value: 'deuteranomaly', label: 'Deuteranomaly', percentage: '4.63% ♂', severity: 'Mild Green-weak' },
                { value: 'tritanopia', label: 'Tritanopia', percentage: '0.02%', severity: 'Severe Blue-blind' },
                { value: 'tritanomaly', label: 'Tritanomaly', percentage: '0.01%', severity: 'Mild Blue-weak' },
                { value: 'achromatopsia', label: 'Achromatopsia', percentage: '0.003%', severity: 'No Color Vision' },
                { value: 'achromatomaly', label: 'Achromatomaly', percentage: '0.001%', severity: 'Minimal Color' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSimulationMode(option.value as ColorBlindnessType)}
                  className={`w-full p-3 text-left border rounded-lg transition-all ${
                    simulationMode === option.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 bg-white dark:bg-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{option.label}</div>
                      {option.severity && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">{option.severity}</div>
                      )}
                    </div>
                    {option.percentage && (
                      <div className="text-xs font-mono bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                        {option.percentage}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Palette Presets */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Quick Presets
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(predefinedPalettes).map(([name, palette]) => (
                <button
                  key={name}
                  onClick={() => setColors({ ...colors, ...palette })}
                  className="p-3 text-left border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{name}</span>
                    <div className="flex gap-1">
                      <div className="w-4 h-4 rounded border" style={{ backgroundColor: palette.background }}></div>
                      <div className="w-4 h-4 rounded border" style={{ backgroundColor: palette.text }}></div>
                      <div className="w-4 h-4 rounded border" style={{ backgroundColor: palette.link }}></div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Controls */}
          {showAdvanced && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Advanced Settings
              </h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={autoFix}
                    onChange={(e) => setAutoFix(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Auto-fix contrast issues</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={realTimeAnalysis}
                    onChange={(e) => setRealTimeAnalysis(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Real-time analysis</span>
                </label>
                <div>
                  <label className="block text-sm font-medium mb-2">Export Format</label>
                  <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value as 'css' | 'json' | 'scss')}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded"
                  >
                    <option value="css">CSS Custom Properties</option>
                    <option value="scss">SCSS Variables</option>
                    <option value="json">JSON</option>
                  </select>
                </div>
                <button
                  onClick={handleAutoFix}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  Auto-Fix Contrast
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Center Panel - Color Controls */}
        <div className="xl:col-span-1 space-y-6">
          {/* Element Selection & Color Picker */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Color Controls
            </h3>
            <div className="space-y-4">
              {Object.entries(colors).map(([element, color]) => (
                <div key={element} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {element} Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => handleColorChange(element as ElementType, e.target.value)}
                      className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => handleColorChange(element as ElementType, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded font-mono text-sm bg-white dark:bg-gray-700"
                    />
                    <button
                      onClick={() => copyToClipboard(color)}
                      className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contrast Analysis */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Info className="w-5 h-5" />
              Contrast Analysis
            </h3>
            <div className="space-y-4">
              {/* Text vs Background */}
              <div className="p-3 bg-white dark:bg-gray-700 rounded border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Text vs Background</span>
                  <span className="font-mono text-lg">{contrastResults.ratio.toFixed(2)}:1</span>
                </div>
                <div className="flex items-center gap-2">
                  {contrastResults.aaa ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : contrastResults.aa ? (
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    contrastResults.aaa ? 'bg-green-100 text-green-800' :
                    contrastResults.aa ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {contrastResults.grade}
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                  <div>AA Normal: {contrastResults.aa ? '✓' : '✗'} (≥4.5:1)</div>
                  <div>AA Large: {contrastResults.aaLarge ? '✓' : '✗'} (≥3:1)</div>
                  <div>AAA Normal: {contrastResults.aaa ? '✓' : '✗'} (≥7:1)</div>
                  <div>AAA Large: {contrastResults.aaaLarge ? '✓' : '✗'} (≥4.5:1)</div>
                </div>
              </div>

              {/* Link vs Background */}
              <div className="p-3 bg-white dark:bg-gray-700 rounded border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Link vs Background</span>
                  <span className="font-mono text-lg">{linkContrastResults.ratio.toFixed(2)}:1</span>
                </div>
                <div className="flex items-center gap-2">
                  {linkContrastResults.aaa ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : linkContrastResults.aa ? (
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    linkContrastResults.aaa ? 'bg-green-100 text-green-800' :
                    linkContrastResults.aa ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {linkContrastResults.grade}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Live Preview */}
        <div className="xl:col-span-1">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Live Preview - {simulationMode.charAt(0).toUpperCase() + simulationMode.slice(1)}
            </h3>
            
            <div
              ref={previewRef}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 space-y-6"
              style={{
                filter: simulationMode !== 'normal' ? `url(#${simulationMode})` : 'none',
                backgroundColor: colors.background
              }}
            >
              {/* Website Header Simulation */}
              <div className="space-y-4">
                <h1 
                  className="text-2xl font-bold"
                  style={{ color: colors.text, fontSize: `${fontSize + 8}px` }}
                >
                  Website Header
                </h1>
                
                <nav className="flex gap-4">
                  <a href="#" style={{ color: colors.link }}>Home</a>
                  <a href="#" style={{ color: colors.link }}>About</a>
                  <a href="#" style={{ color: colors.link }}>Services</a>
                  <a href="#" style={{ color: colors.link }}>Contact</a>
                </nav>
              </div>

              {/* Content Section */}
              <div 
                className="p-4 rounded border-2"
                style={{ 
                  borderColor: colors.border,
                  backgroundColor: Color(colors.background).lighten(0.02).hex()
                }}
              >
                <h2 
                  className="text-xl font-semibold mb-3"
                  style={{ color: colors.text, fontSize: `${fontSize + 4}px` }}
                >
                  Content Section
                </h2>
                <p 
                  className="mb-4 leading-relaxed"
                  style={{ 
                    color: colors.text, 
                    fontSize: `${fontSize}px`,
                    lineHeight: '1.6'
                  }}
                >
                  This is sample paragraph text demonstrating how your color choices affect readability 
                  for users with different types of color vision. The text should maintain proper contrast 
                  and remain easily readable across all simulation modes.
                </p>
                
                <div className="flex gap-3 flex-wrap">
                  <button 
                    className="px-4 py-2 rounded font-medium border-2"
                    style={{ 
                      backgroundColor: colors.link,
                      color: colors.background,
                      borderColor: colors.border
                    }}
                  >
                    Primary Button
                  </button>
                  <button 
                    className="px-4 py-2 rounded font-medium border-2"
                    style={{ 
                      backgroundColor: colors.background,
                      color: colors.link,
                      borderColor: colors.link
                    }}
                  >
                    Secondary Button
                  </button>
                </div>
              </div>

              {/* Form Elements */}
              <div 
                className="p-4 rounded border-2"
                style={{ borderColor: colors.border }}
              >
                <h3 
                  className="text-lg font-semibold mb-3"
                  style={{ color: colors.text }}
                >
                  Form Elements
                </h3>
                <div className="space-y-3">
                  <input 
                    type="text" 
                    placeholder="Text input field"
                    className="w-full p-2 rounded border-2"
                    style={{ 
                      borderColor: colors.border,
                      backgroundColor: colors.background,
                      color: colors.text
                    }}
                  />
                  <div className="flex items-center gap-2">
                    <input type="checkbox" />
                    <label style={{ color: colors.text }}>Checkbox option</label>
                  </div>
                </div>
              </div>

              {/* Status Messages */}
              <div className="space-y-3">
                <div 
                  className="p-3 rounded border-l-4"
                  style={{ 
                    backgroundColor: Color(colors.success).lighten(0.4).hex(),
                    borderColor: colors.success,
                    color: Color(colors.success).darken(0.3).hex()
                  }}
                >
                  <strong>Success:</strong> Operation completed successfully!
                </div>
                <div 
                  className="p-3 rounded border-l-4"
                  style={{ 
                    backgroundColor: Color(colors.warning).lighten(0.4).hex(),
                    borderColor: colors.warning,
                    color: Color(colors.warning).darken(0.3).hex()
                  }}
                >
                  <strong>Warning:</strong> Please review your input.
                </div>
                <div 
                  className="p-3 rounded border-l-4"
                  style={{ 
                    backgroundColor: Color(colors.error).lighten(0.4).hex(),
                    borderColor: colors.error,
                    color: Color(colors.error).darken(0.3).hex()
                  }}
                >
                  <strong>Error:</strong> Something went wrong.
                </div>
              </div>
            </div>

            {/* Font Size Control */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Font Size: {fontSize}px {fontSize >= 24 ? '(Large Text)' : '(Normal Text)'}
              </label>
              <input
                type="range"
                min="12"
                max="48"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ColorAccessibilitySimulator;