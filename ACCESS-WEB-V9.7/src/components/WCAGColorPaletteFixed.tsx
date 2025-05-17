import React, { useState, useRef, useEffect } from 'react';
import { 
  RefreshCw, 
  Copy, 
  Info, 
  Check, 
  FileText, 
  FileDown, 
  Sun, 
  Moon, 
  Shuffle, 
  Palette, 
  Lock, 
  Unlock
} from 'lucide-react';
import { useTheme } from '../providers/ThemeProvider';
import type { ChangeEvent } from 'react';

// Define our harmony type
type ColorHarmony = 'all' | 'complementary' | 'analogous' | 'triadic' | 'split-complementary' | 'monochromatic' | 'tetradic' | 'square';

interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

interface ColorHSL {
  h: number;
  s: number;
  l: number;
}

interface ContrastResult {
  ratio: number;
  wcagLevel: string;
  isLargeText: boolean;
}

interface ColorCombination {
  name: string;
  background: string;
  text: string;
  ratio: number;
  wcagLevel: string;
  wcagLarge: string;
  isBaseColor?: boolean;
  harmonyType?: string;
  isLocked?: boolean;
}

// This is a simplified version that implements the new UI design
export function WCAGColorPaletteFixed() {
  const { theme } = useTheme();
  const [baseColor, setBaseColor] = useState('#1a365d');
  const [colorHarmony, setColorHarmony] = useState<ColorHarmony>('all');
  const [showColorNames, setShowColorNames] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [generatedPalette, setGeneratedPalette] = useState<ColorCombination[]>([]);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  
  // Get dark mode from theme provider
  const isDarkMode = theme === 'dark';
  
  // Color utility functions would be defined here...
  // This is a simplified implementation

  const toggleDarkMode = () => {
    // We access document directly as a workaround
    document.documentElement.classList.toggle('dark');
  };
  
  const changeColorHarmony = (harmony: ColorHarmony) => {
    setColorHarmony(harmony);
    generateNewPalette();
  };
  
  const handleBaseColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBaseColor(e.target.value);
  };
  
  const clearGenerator = () => {
    setBaseColor('#1a365d');
    setGeneratedPalette([]);
  };
  
  const generateNewPalette = () => {
    setIsGenerating(true);
    
    // Simulate generation
    setTimeout(() => {
      const mockPalette = [
        {
          name: "Base Color",
          background: baseColor,
          text: "#FFFFFF",
          ratio: 7.2,
          wcagLevel: "AAA",
          wcagLarge: "AAA",
          isBaseColor: true,
          harmonyType: "Base"
        },
        {
          name: "Complementary",
          background: "#d53f8c",
          text: "#FFFFFF",
          ratio: 5.1,
          wcagLevel: "AA",
          wcagLarge: "AAA",
          isBaseColor: false,
          harmonyType: "Complementary"
        },
        {
          name: "Analogous",
          background: "#38a169",
          text: "#FFFFFF",
          ratio: 4.8,
          wcagLevel: "AA",
          wcagLarge: "AAA",
          isBaseColor: false,
          harmonyType: "Analogous"
        }
      ];
      
      setGeneratedPalette(mockPalette);
      setIsGenerating(false);
    }, 800);
  };
  
  const shufflePalette = () => {
    // Shuffle logic would be implemented here
    generateNewPalette();
  };
  
  const toggleColorNames = () => {
    setShowColorNames(!showColorNames);
  };
  
  const exportPaletteAsPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
    }, 500);
  };

  const copyColorToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const toggleLock = (index: number) => {
    setGeneratedPalette(prev => 
      prev.map((combo, i) => 
        i === index ? { ...combo, isLocked: !combo.isLocked } : combo
      )
    );
  };

  // Generate initial palette on component mount
  useEffect(() => {
    generateNewPalette();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="p-4">
        {/* Generator Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 border-2 border-primary-100 dark:border-gray-700 relative">
          <div className="absolute -top-3 left-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#0fae96] dark:bg-[#0fae96] text-white uppercase tracking-wider shadow-sm">Palette Generator</span>
          </div>
          
          {/* Grid layout for Colour Harmony and Base Colour sections */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-4">
            {/* Left side - Colour Harmony section */}
            <div className="md:col-span-8">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
                <span>Colour Harmony</span>
              </h3>
              
              {/* First row of harmony buttons */}
              <div className="grid grid-cols-4 gap-2 mb-2">
                <button
                  onClick={() => changeColorHarmony('all')}
                  className={`p-2 text-sm rounded-full transition-colors ${
                    colorHarmony === 'all' 
                      ? 'bg-teal-100 dark:bg-[#0fae96]/20 text-teal-800 dark:text-[#5eead4] border border-teal-300 dark:border-[#0fae96]/50'
                      : 'bg-gray-50 dark:bg-[#1D3640] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-[#24404a]'
                  }`}
                >
                  All Harmonies
                </button>
                <button 
                  onClick={() => changeColorHarmony('complementary')}
                  className={`p-2 text-sm rounded-full transition-colors ${
                    colorHarmony === 'complementary' ? 'bg-teal-100 dark:bg-[#0fae96]/20 text-teal-800 dark:text-[#5eead4] border border-teal-300 dark:border-[#0fae96]/50' : 'bg-gray-50 dark:bg-[#1D3640] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-[#24404a]'
                  }`}
                >
                  Complementary
                </button>
                <button
                  onClick={() => changeColorHarmony('analogous')}
                  className={`p-2 text-sm rounded-full transition-colors ${
                    colorHarmony === 'analogous' ? 'bg-teal-100 dark:bg-[#0fae96]/20 text-teal-800 dark:text-[#5eead4] border border-teal-300 dark:border-[#0fae96]/50' : 'bg-gray-50 dark:bg-[#1D3640] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-[#24404a]'
                  }`}
                >
                  Analogous
                </button>
                <button
                  onClick={() => changeColorHarmony('triadic')}
                  className={`p-2 text-sm rounded-full transition-colors ${
                    colorHarmony === 'triadic' ? 'bg-teal-100 dark:bg-[#0fae96]/20 text-teal-800 dark:text-[#5eead4] border border-teal-300 dark:border-[#0fae96]/50' : 'bg-gray-50 dark:bg-[#1D3640] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-[#24404a]'
                  }`}
                >
                  Triadic
                </button>
              </div>
              
              {/* Second row of harmony buttons */}
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => changeColorHarmony('split-complementary')}
                  className={`p-2 text-sm rounded-full transition-colors ${
                    colorHarmony === 'split-complementary' ? 'bg-teal-100 dark:bg-[#0fae96]/20 text-teal-800 dark:text-[#5eead4] border border-teal-300 dark:border-[#0fae96]/50' : 'bg-gray-50 dark:bg-[#1D3640] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-[#24404a]'
                  }`}
                >
                  Split Comp
                </button>
                <button
                  onClick={() => changeColorHarmony('monochromatic')}
                  className={`p-2 text-sm rounded-full transition-colors ${
                    colorHarmony === 'monochromatic' ? 'bg-teal-100 dark:bg-[#0fae96]/20 text-teal-800 dark:text-[#5eead4] border border-teal-300 dark:border-[#0fae96]/50' : 'bg-gray-50 dark:bg-[#1D3640] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-[#24404a]'
                  }`}
                >
                  Monochromatic
                </button>
                <button
                  onClick={() => changeColorHarmony('tetradic')}
                  className={`p-2 text-sm rounded-full transition-colors ${
                    colorHarmony === 'tetradic' ? 'bg-teal-100 dark:bg-[#0fae96]/20 text-teal-800 dark:text-[#5eead4] border border-teal-300 dark:border-[#0fae96]/50' : 'bg-gray-50 dark:bg-[#1D3640] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-[#24404a]'
                  }`}
                >
                  Tetradic
                </button>
                <button
                  onClick={() => changeColorHarmony('square')}
                  className={`p-2 text-sm rounded-full transition-colors ${
                    colorHarmony === 'square' ? 'bg-teal-100 dark:bg-[#0fae96]/20 text-teal-800 dark:text-[#5eead4] border border-teal-300 dark:border-[#0fae96]/50' : 'bg-gray-50 dark:bg-[#1D3640] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-[#24404a]'
                  }`}
                >
                  Square
                </button>
              </div>
            </div>
            
            {/* Right side - Base Colour section */}
            <div className="md:col-span-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  <span>Base Colour</span>
                </h3>
                
                {/* Generate button */}
                <button
                  onClick={generateNewPalette}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-1 px-3 py-1 border-none rounded-full shadow-sm text-xs font-medium text-white bg-[#0fae96] hover:bg-[#0d9a85] dark:bg-[#0fae96] dark:hover:bg-[#0d9a85] disabled:opacity-50 transition-colors"
                >
                  <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                  Generate
                </button>
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative h-10 w-10 rounded-full overflow-hidden shadow-md border-2 border-gray-300 dark:border-white hover:border-primary-500 dark:hover:border-[#5eead4] transition-all">
                  <input
                    type="color"
                    id="baseColor"
                    value={baseColor}
                    onChange={handleBaseColorChange}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                  <div 
                    className="absolute inset-0"
                    style={{ backgroundColor: baseColor }}
                  ></div>
                </div>
                <input
                  type="text"
                  value={baseColor}
                  className="w-24 px-3 py-1 text-sm rounded-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-primary-500 dark:focus:border-[#5eead4] focus:ring-1 focus:ring-primary-500 dark:focus:ring-[#5eead4] outline-none"
                  onChange={handleBaseColorChange}
                  placeholder="#000000"
                />
                <button
                  onClick={clearGenerator}
                  className="ml-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  aria-label="Clear color palette"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Generated Palette Section */}
        <div className="border-2 border-primary-100 dark:border-gray-700 rounded-lg p-6 mb-12 bg-white dark:bg-gray-800 shadow-md relative">
          <div className="absolute -top-3 left-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#0fae96] dark:bg-[#0fae96] text-white uppercase tracking-wider shadow-sm">Generated Palette</span>
          </div>
          
          <div className="flex justify-between items-center gap-2 mb-6 mt-2">
            <div className="flex-grow"></div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={shufflePalette}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-[#0fae96] dark:focus:ring-[#5eead4]"
              >
                <Shuffle className="w-4 h-4 mr-1.5" />
                Shuffle
              </button>
              
              <button
                onClick={toggleColorNames}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-[#0fae96] dark:focus:ring-[#5eead4]"
              >
                <FileText className="w-4 h-4 mr-1.5" />
                {showColorNames ? 'Hide Names' : 'Show Names'}
              </button>
              
              <button
                onClick={exportPaletteAsPDF}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-[#0fae96] dark:focus:ring-[#5eead4]"
                disabled={isExporting}
              >
                <FileDown className="w-4 h-4 mr-1.5" />
                {isExporting ? 'Exporting...' : 'Export PDF'}
              </button>
              
              <button
                onClick={toggleDarkMode}
                className="inline-flex items-center justify-center p-1.5 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-[#0fae96] dark:focus:ring-[#5eead4]"
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          {isGenerating ? (
            <div className="flex justify-center items-center p-12">
              <RefreshCw className="w-8 h-8 animate-spin text-[#0fae96]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {generatedPalette.map((combo, index) => (
                <div 
                  key={index}
                  style={{ backgroundColor: combo.background }}
                  className="h-32 rounded-lg flex flex-col justify-between p-4 relative"
                >
                  {/* Upper controls */}
                  <div className="flex justify-between">
                    {/* Color name badge */}
                    {showColorNames && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200">
                        {combo.harmonyType}
                      </span>
                    )}
                    
                    {/* Lock button */}
                    <button
                      onClick={() => toggleLock(index)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700"
                    >
                      {combo.isLocked ? (
                        <Lock className="w-4 h-4 text-[#0fae96]" />
                      ) : (
                        <Unlock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  {/* Lower info */}
                  <div className="flex justify-between items-end">
                    <span className="font-semibold" style={{ color: combo.text }}>
                      {combo.background.toUpperCase()}
                    </span>
                    
                    {/* Copy button */}
                    <button
                      onClick={() => copyColorToClipboard(combo.background)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700"
                    >
                      {copiedColor === combo.background ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  {/* WCAG rating */}
                  <div className="absolute bottom-2 right-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      combo.wcagLevel === 'AAA' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' 
                        : combo.wcagLevel === 'AA' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                    }`}>
                      {combo.wcagLevel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}