import React, { useState } from 'react';
import { RefreshCw, Shuffle, FileText, FileDown, Sun, Moon } from 'lucide-react';

// This is an extremely simplified component, focusing only on UI styling
export function BasicColorPalette() {
  const [baseColor, setBaseColor] = useState('#1a365d');
  const [colorHarmony, setColorHarmony] = useState('all');
  const [showColorNames, setShowColorNames] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };
  
  const harmonies = [
    { id: 'all', name: 'All Harmonies' },
    { id: 'complementary', name: 'Complementary' },
    { id: 'analogous', name: 'Analogous' },
    { id: 'triadic', name: 'Triadic' },
    { id: 'split-complementary', name: 'Split Comp' },
    { id: 'monochromatic', name: 'Monochromatic' },
    { id: 'tetradic', name: 'Tetradic' },
    { id: 'square', name: 'Square' }
  ];
  
  const mockPalette = [
    { background: '#1a365d', text: '#FFFFFF', name: 'Navy Blue', wcagLevel: 'AAA' },
    { background: '#d53f8c', text: '#FFFFFF', name: 'Pink', wcagLevel: 'AA' },
    { background: '#38a169', text: '#FFFFFF', name: 'Green', wcagLevel: 'AA' }
  ];

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
              
              <div className="grid grid-cols-4 gap-2 mb-2">
                {harmonies.slice(0, 4).map(harmony => (
                  <button
                    key={harmony.id}
                    onClick={() => setColorHarmony(harmony.id)}
                    className={`p-2 text-sm rounded-full transition-colors ${
                      colorHarmony === harmony.id 
                        ? 'bg-teal-100 dark:bg-[#0fae96]/20 text-teal-800 dark:text-[#5eead4] border border-teal-300 dark:border-[#0fae96]/50'
                        : 'bg-gray-50 dark:bg-[#1D3640] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-[#24404a]'
                    }`}
                  >
                    {harmony.name}
                  </button>
                ))}
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {harmonies.slice(4).map(harmony => (
                  <button
                    key={harmony.id}
                    onClick={() => setColorHarmony(harmony.id)}
                    className={`p-2 text-sm rounded-full transition-colors ${
                      colorHarmony === harmony.id 
                        ? 'bg-teal-100 dark:bg-[#0fae96]/20 text-teal-800 dark:text-[#5eead4] border border-teal-300 dark:border-[#0fae96]/50'
                        : 'bg-gray-50 dark:bg-[#1D3640] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-[#24404a]'
                    }`}
                  >
                    {harmony.name}
                  </button>
                ))}
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
                  className="inline-flex items-center gap-1 px-3 py-1 border-none rounded-full shadow-sm text-xs font-medium text-white bg-[#0fae96] hover:bg-[#0d9a85] dark:bg-[#0fae96] dark:hover:bg-[#0d9a85] transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  Generate
                </button>
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative h-10 w-10 rounded-full overflow-hidden shadow-md border-2 border-gray-300 dark:border-white hover:border-primary-500 dark:hover:border-[#5eead4] transition-all">
                  <input
                    type="color"
                    id="baseColor"
                    value={baseColor}
                    onChange={(e) => setBaseColor(e.target.value)}
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
                  onChange={(e) => setBaseColor(e.target.value)}
                  placeholder="#000000"
                />
                <button
                  className="ml-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
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
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-[#0fae96] dark:focus:ring-[#5eead4]"
              >
                <Shuffle className="w-4 h-4 mr-1.5" />
                Shuffle
              </button>
              
              <button
                onClick={() => setShowColorNames(!showColorNames)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-[#0fae96] dark:focus:ring-[#5eead4]"
              >
                <FileText className="w-4 h-4 mr-1.5" />
                {showColorNames ? 'Hide Names' : 'Show Names'}
              </button>
              
              <button
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-[#0fae96] dark:focus:ring-[#5eead4]"
              >
                <FileDown className="w-4 h-4 mr-1.5" />
                Export PDF
              </button>
              
              <button
                onClick={toggleDarkMode}
                className="inline-flex items-center justify-center p-1.5 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-[#0fae96] dark:focus:ring-[#5eead4]"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {mockPalette.map((color, index) => (
              <div 
                key={index}
                className="h-24 rounded-lg flex items-end p-3"
                style={{ backgroundColor: color.background }}
              >
                <div className="flex justify-between w-full">
                  <span className="font-semibold" style={{ color: color.text }}>
                    {color.background}
                  </span>
                  {showColorNames && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      color.wcagLevel === 'AAA' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' 
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                    }`}>
                      {color.wcagLevel}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BasicColorPalette;