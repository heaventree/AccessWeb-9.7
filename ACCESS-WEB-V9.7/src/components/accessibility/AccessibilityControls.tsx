import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, AlignLeft, AlignCenter, AlignRight, MousePointer2, Link, Eye, PanelTop, Keyboard, Volume2, RotateCcw, Pause, Play, Sun, Moon, Type, Navigation, Underline, Square, MinusCircle, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AccessibilityControls() {
  const [isOpen, setIsOpen] = useState(false);
  const [textSize, setTextSize] = useState(100);
  const [lineHeight, setLineHeight] = useState(100);
  const [letterSpacing, setLetterSpacing] = useState(100);
  const [wordSpacing, setWordSpacing] = useState(100);
  const [isReading, setIsReading] = useState(false);
  const [features, setFeatures] = useState({
    largeCursor: false,
    highlightLinks: false,
    highlightFocus: false,
    highContrast: false,
    darkMode: false,
    lightMode: false,
    virtualKeyboard: false,
    textToSpeech: false,
    readingMask: false,
    bigBlackCursor: false,
    bigWhiteCursor: false,
    keyboardNavigation: false,
    underlineLinks: false,
    blockAnimations: false,
    hideImages: false,
    readableFont: false,
    textAlignLeft: false,
    textAlignCenter: false,
    textAlignRight: false,
    invertColors: false,
    monochrome: false,
    yellowFilter: false,
    blueFilter: false,
    greenFilter: false
  });

  // Apply CSS changes whenever settings change
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    // Remove existing style first to avoid conflicts
    const existingStyle = document.getElementById('accessibility-text-scaling');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    // Create comprehensive text scaling that actually works
    const style = document.createElement('style');
    style.id = 'accessibility-text-scaling';
    
    // Calculate scaling factors
    const textScale = textSize / 100;
    const lineScale = lineHeight / 100;
    const letterScale = (letterSpacing - 100) * 0.01;
    const wordScale = (wordSpacing - 100) * 0.01;
    
    style.textContent = `
      /* Base font size scaling */
      html {
        font-size: ${textSize}% !important;
      }
      
      /* Apply to all text elements with proper specificity */
      body, body *, 
      p, div, span, h1, h2, h3, h4, h5, h6, 
      li, td, th, label, input, textarea, button, a,
      .text-xs, .text-sm, .text-base, .text-lg, .text-xl, .text-2xl, .text-3xl, .text-4xl, .text-5xl, .text-6xl {
        font-size: ${textScale}em !important;
        line-height: ${lineScale * 1.5} !important;
        letter-spacing: ${letterScale}em !important;
        word-spacing: ${wordScale}em !important;
      }
      
      /* Specific overrides for different text sizes */
      h1, .text-4xl, .text-5xl, .text-6xl {
        font-size: ${textScale * 2}em !important;
      }
      
      h2, .text-3xl {
        font-size: ${textScale * 1.75}em !important;
      }
      
      h3, .text-2xl {
        font-size: ${textScale * 1.5}em !important;
      }
      
      h4, .text-xl {
        font-size: ${textScale * 1.25}em !important;
      }
      
      h5, .text-lg {
        font-size: ${textScale * 1.125}em !important;
      }
      
      h6, .text-base {
        font-size: ${textScale}em !important;
      }
      
      .text-sm {
        font-size: ${textScale * 0.875}em !important;
      }
      
      .text-xs {
        font-size: ${textScale * 0.75}em !important;
      }
      
      /* Ensure buttons and inputs scale properly */
      button, input, textarea, select {
        font-size: ${textScale}em !important;
        line-height: ${lineScale * 1.5} !important;
        padding: ${textScale * 0.5}em ${textScale * 0.75}em !important;
      }
      
      /* Scale icons and other elements */
      svg {
        width: ${textScale}em !important;
        height: ${textScale}em !important;
      }
    `;
    
    document.head.appendChild(style);
    
    // Store settings in localStorage for persistence
    localStorage.setItem('accessibility-settings', JSON.stringify({
      textSize,
      lineHeight,
      letterSpacing,
      wordSpacing,
      features
    }));
    
  }, [textSize, lineHeight, letterSpacing, wordSpacing, features]);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setTextSize(parsed.textSize || 100);
        setLineHeight(parsed.lineHeight || 100);
        setLetterSpacing(parsed.letterSpacing || 100);
        setWordSpacing(parsed.wordSpacing || 100);
        setFeatures(parsed.features || features);
      } catch (e) {
        console.log('Failed to load accessibility settings');
      }
    }
  }, []);

  const toggleFeature = (feature: keyof typeof features) => {
    const currentValue = features[feature];
    const newValue = !currentValue;

    // Update feature state
    setFeatures(prev => {
      const newFeatures = { ...prev };
      
      // Handle mutually exclusive features
      if (feature === 'textAlignLeft' || feature === 'textAlignCenter' || feature === 'textAlignRight') {
        newFeatures.textAlignLeft = false;
        newFeatures.textAlignCenter = false;
        newFeatures.textAlignRight = false;
        if (newValue) {
          newFeatures[feature] = true;
        }
      } else if (feature === 'bigBlackCursor' || feature === 'bigWhiteCursor' || feature === 'largeCursor') {
        newFeatures.bigBlackCursor = false;
        newFeatures.bigWhiteCursor = false;
        newFeatures.largeCursor = false;
        if (newValue) {
          newFeatures[feature] = true;
        }
      } else if (feature === 'darkMode' || feature === 'lightMode' || feature === 'invertColors' || 
                 feature === 'monochrome' || feature === 'yellowFilter' || feature === 'blueFilter' || feature === 'greenFilter') {
        newFeatures.darkMode = false;
        newFeatures.lightMode = false;
        newFeatures.invertColors = false;
        newFeatures.monochrome = false;
        newFeatures.yellowFilter = false;
        newFeatures.blueFilter = false;
        newFeatures.greenFilter = false;
        if (newValue) {
          newFeatures[feature] = true;
        }
      } else {
        newFeatures[feature] = newValue;
      }
      
      return newFeatures;
    });

    // Apply DOM changes immediately
    setTimeout(() => {
      applyAccessibilityFeatures(feature, newValue);
    }, 0);
  };

  const applyAccessibilityFeatures = (feature: keyof typeof features, isEnabled: boolean) => {
    const body = document.body;
    
    // Remove all conflicting classes first
    if (feature === 'textAlignLeft' || feature === 'textAlignCenter' || feature === 'textAlignRight') {
      body.style.textAlign = '';
      if (isEnabled) {
        const alignment = feature === 'textAlignLeft' ? 'left' : 
                         feature === 'textAlignCenter' ? 'center' : 'right';
        body.style.textAlign = alignment;
        
        // Also apply to all elements
        const style = document.createElement('style');
        style.id = 'accessibility-text-align';
        const existingStyle = document.getElementById('accessibility-text-align');
        if (existingStyle) {
          existingStyle.remove();
        }
        
        style.textContent = `
          body *, p, div, span, h1, h2, h3, h4, h5, h6, li, td, th, label {
            text-align: ${alignment} !important;
          }
        `;
        document.head.appendChild(style);
      } else {
        const existingStyle = document.getElementById('accessibility-text-align');
        if (existingStyle) {
          existingStyle.remove();
        }
      }
    }

    // Handle cursor changes
    if (feature === 'bigBlackCursor' || feature === 'bigWhiteCursor' || feature === 'largeCursor') {
      body.classList.remove('big-black-cursor', 'big-white-cursor', 'large-cursor');
      if (isEnabled) {
        const cursorClass = feature === 'bigBlackCursor' ? 'big-black-cursor' :
                           feature === 'bigWhiteCursor' ? 'big-white-cursor' : 'large-cursor';
        body.classList.add(cursorClass);
      }
    }

    // Handle color filters
    if (feature === 'darkMode' || feature === 'lightMode' || feature === 'invertColors' || 
        feature === 'monochrome' || feature === 'yellowFilter' || feature === 'blueFilter' || feature === 'greenFilter') {
      body.classList.remove('dark-mode', 'light-mode', 'invert-colors', 'monochrome', 'yellow-filter', 'blue-filter', 'green-filter');
      if (isEnabled) {
        const filterClass = feature === 'darkMode' ? 'dark-mode' :
                           feature === 'lightMode' ? 'light-mode' :
                           feature === 'invertColors' ? 'invert-colors' :
                           feature === 'monochrome' ? 'monochrome' :
                           feature === 'yellowFilter' ? 'yellow-filter' :
                           feature === 'blueFilter' ? 'blue-filter' : 'green-filter';
        body.classList.add(filterClass);
      }
    }

    // Handle other features
    const featureMap = {
      highlightLinks: 'highlight-links',
      highlightFocus: 'highlight-focus',
      highContrast: 'high-contrast',
      readingMask: 'reading-mask',
      keyboardNavigation: 'keyboard-navigation',
      underlineLinks: 'underline-links',
      blockAnimations: 'block-animations',
      hideImages: 'hide-images',
      readableFont: 'readable-font'
    };

    if (featureMap[feature]) {
      body.classList.toggle(featureMap[feature], isEnabled);
    }

    // Special handling for text-to-speech
    if (feature === 'textToSpeech') {
      if (isEnabled) {
        startTextToSpeech();
      } else {
        stopTextToSpeech();
      }
    }

    // Virtual keyboard simulation
    if (feature === 'virtualKeyboard') {
      body.classList.toggle('virtual-keyboard-active', isEnabled);
    }
  };

  const startTextToSpeech = () => {
    setIsReading(true);
    // Get visible text content only
    const textContent = document.body.innerText.substring(0, 1000); // Limit to prevent long reading
    const utterance = new SpeechSynthesisUtterance(textContent);
    
    // Configure speech settings
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Add reading indicator
    document.body.classList.add('text-to-speech-active');
    
    utterance.onend = () => {
      setIsReading(false);
      document.body.classList.remove('text-to-speech-active');
      setFeatures(prev => ({ ...prev, textToSpeech: false }));
    };
    
    utterance.onerror = () => {
      setIsReading(false);
      document.body.classList.remove('text-to-speech-active');
      setFeatures(prev => ({ ...prev, textToSpeech: false }));
    };
    
    speechSynthesis.speak(utterance);
  };

  const stopTextToSpeech = () => {
    speechSynthesis.cancel();
    document.body.classList.remove('text-to-speech-active');
    setIsReading(false);
  };

  // Apply all loaded settings when features change
  useEffect(() => {
    Object.entries(features).forEach(([feature, isEnabled]) => {
      if (isEnabled) {
        applyAccessibilityFeatures(feature as keyof typeof features, true);
      }
    });
  }, [features]);

  const increaseTextSize = () => {
    if (textSize < 200) {
      setTextSize(textSize + 10);
    }
  };

  const decreaseTextSize = () => {
    if (textSize > 70) {
      setTextSize(textSize - 10);
    }
  };

  const increaseLineHeight = () => {
    if (lineHeight < 200) {
      setLineHeight(lineHeight + 10);
    }
  };

  const decreaseLineHeight = () => {
    if (lineHeight > 70) {
      setLineHeight(lineHeight - 10);
    }
  };

  const increaseLetterSpacing = () => {
    if (letterSpacing < 200) {
      setLetterSpacing(letterSpacing + 10);
    }
  };

  const decreaseLetterSpacing = () => {
    if (letterSpacing > 50) {
      setLetterSpacing(letterSpacing - 10);
    }
  };

  const increaseWordSpacing = () => {
    if (wordSpacing < 200) {
      setWordSpacing(wordSpacing + 10);
    }
  };

  const decreaseWordSpacing = () => {
    if (wordSpacing > 50) {
      setWordSpacing(wordSpacing - 10);
    }
  };

  const resetAllSettings = () => {
    // Reset all state
    setTextSize(100);
    setLineHeight(100);
    setLetterSpacing(100);
    setWordSpacing(100);
    setIsReading(false);
    
    const defaultFeatures = {
      largeCursor: false,
      highlightLinks: false,
      highlightFocus: false,
      highContrast: false,
      darkMode: false,
      lightMode: false,
      virtualKeyboard: false,
      textToSpeech: false,
      readingMask: false,
      bigBlackCursor: false,
      bigWhiteCursor: false,
      keyboardNavigation: false,
      underlineLinks: false,
      blockAnimations: false,
      hideImages: false,
      readableFont: false,
      textAlignLeft: false,
      textAlignCenter: false,
      textAlignRight: false,
      invertColors: false,
      monochrome: false,
      yellowFilter: false,
      blueFilter: false,
      greenFilter: false
    };
    
    setFeatures(defaultFeatures);
    
    // Reset DOM immediately
    const body = document.body;
    const html = document.documentElement;
    
    // Remove all accessibility classes
    body.classList.remove(
      'large-cursor', 'big-black-cursor', 'big-white-cursor',
      'highlight-links', 'highlight-focus', 'high-contrast',
      'dark-mode', 'light-mode', 'invert-colors', 'monochrome',
      'yellow-filter', 'blue-filter', 'green-filter',
      'reading-mask', 'keyboard-navigation', 'underline-links',
      'block-animations', 'hide-images', 'readable-font',
      'virtual-keyboard-active'
    );
    
    // Reset text alignment
    body.style.textAlign = '';
    
    // Reset HTML font size
    html.style.fontSize = '';
    
    // Remove all accessibility styles
    const stylesToRemove = [
      'accessibility-text-scaling',
      'accessibility-text-align'
    ];
    
    stylesToRemove.forEach(id => {
      const existingStyle = document.getElementById(id);
      if (existingStyle) {
        existingStyle.remove();
      }
    });
    
    // Stop any text-to-speech
    speechSynthesis.cancel();
    
    // Clear localStorage
    localStorage.removeItem('accessibility-settings');
    
    // Force a small delay to ensure DOM is updated
    setTimeout(() => {
      // Apply default styling
      const style = document.createElement('style');
      style.id = 'accessibility-text-scaling';
      style.textContent = `
        html {
          font-size: 100% !important;
        }
      `;
      document.head.appendChild(style);
    }, 100);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Accessibility toggle button - fixed to the right side of the screen */}
      <button
        onClick={toggleMenu}
        className="fixed bottom-[132px] right-5 z-50 bg-cyan-500 text-white p-0 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 h-12 w-12 flex items-center justify-center"
        aria-label={isOpen ? "Close accessibility menu" : "Open accessibility menu"}
      >
        <Eye size={24} />
      </button>

      {/* Accessibility tools panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/2 right-4 transform -translate-y-1/2 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 w-80 max-h-[90vh] overflow-y-auto p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Accessibility Tools</h2>
              <button 
                onClick={toggleMenu}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                aria-label="Close accessibility menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Text Controls Section */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 uppercase tracking-wide">Text Controls</h3>
              
              {/* Text Size */}
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Text Size</p>
                <div className="flex items-center">
                  <button 
                    onClick={decreaseTextSize}
                    className="bg-gray-100 dark:bg-gray-700 p-2 rounded-l-md hover:bg-gray-200 dark:hover:bg-gray-600"
                    aria-label="Decrease text size"
                  >
                    <MinusCircle size={16} />
                  </button>
                  <div className="flex-1 text-center bg-gray-50 dark:bg-gray-800 py-2 text-sm">
                    {textSize}%
                  </div>
                  <button 
                    onClick={increaseTextSize}
                    className="bg-gray-100 dark:bg-gray-700 p-2 rounded-r-md hover:bg-gray-200 dark:hover:bg-gray-600"
                    aria-label="Increase text size"
                  >
                    <PlusCircle size={16} />
                  </button>
                </div>
              </div>

              {/* Line Height */}
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Line Height</p>
                <div className="flex items-center">
                  <button 
                    onClick={decreaseLineHeight}
                    className="bg-gray-100 dark:bg-gray-700 p-2 rounded-l-md hover:bg-gray-200 dark:hover:bg-gray-600"
                    aria-label="Decrease line height"
                  >
                    <MinusCircle size={16} />
                  </button>
                  <div className="flex-1 text-center bg-gray-50 dark:bg-gray-800 py-2 text-sm">
                    {lineHeight}%
                  </div>
                  <button 
                    onClick={increaseLineHeight}
                    className="bg-gray-100 dark:bg-gray-700 p-2 rounded-r-md hover:bg-gray-200 dark:hover:bg-gray-600"
                    aria-label="Increase line height"
                  >
                    <PlusCircle size={16} />
                  </button>
                </div>
              </div>

              {/* Letter Spacing */}
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Letter Spacing</p>
                <div className="flex items-center">
                  <button 
                    onClick={decreaseLetterSpacing}
                    className="bg-gray-100 dark:bg-gray-700 p-2 rounded-l-md hover:bg-gray-200 dark:hover:bg-gray-600"
                    aria-label="Decrease letter spacing"
                  >
                    <MinusCircle size={16} />
                  </button>
                  <div className="flex-1 text-center bg-gray-50 dark:bg-gray-800 py-2 text-sm">
                    {letterSpacing}%
                  </div>
                  <button 
                    onClick={increaseLetterSpacing}
                    className="bg-gray-100 dark:bg-gray-700 p-2 rounded-r-md hover:bg-gray-200 dark:hover:bg-gray-600"
                    aria-label="Increase letter spacing"
                  >
                    <PlusCircle size={16} />
                  </button>
                </div>
              </div>

              {/* Word Spacing */}
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Word Spacing</p>
                <div className="flex items-center">
                  <button 
                    onClick={decreaseWordSpacing}
                    className="bg-gray-100 dark:bg-gray-700 p-2 rounded-l-md hover:bg-gray-200 dark:hover:bg-gray-600"
                    aria-label="Decrease word spacing"
                  >
                    <MinusCircle size={16} />
                  </button>
                  <div className="flex-1 text-center bg-gray-50 dark:bg-gray-800 py-2 text-sm">
                    {wordSpacing}%
                  </div>
                  <button 
                    onClick={increaseWordSpacing}
                    className="bg-gray-100 dark:bg-gray-700 p-2 rounded-r-md hover:bg-gray-200 dark:hover:bg-gray-600"
                    aria-label="Increase word spacing"
                  >
                    <PlusCircle size={16} />
                  </button>
                </div>
              </div>

              {/* Text Alignment */}
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Text Alignment</p>
                <div className="flex gap-1">
                  <button
                    className={`flex-1 p-2 rounded-md ${features.textAlignLeft ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'}`}
                    onClick={() => toggleFeature('textAlignLeft')}
                    aria-label="Align text left"
                  >
                    <AlignLeft size={16} className="mx-auto" />
                  </button>
                  <button
                    className={`flex-1 p-2 rounded-md ${features.textAlignCenter ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'}`}
                    onClick={() => toggleFeature('textAlignCenter')}
                    aria-label="Align text center"
                  >
                    <AlignCenter size={16} className="mx-auto" />
                  </button>
                  <button
                    className={`flex-1 p-2 rounded-md ${features.textAlignRight ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'}`}
                    onClick={() => toggleFeature('textAlignRight')}
                    aria-label="Align text right"
                  >
                    <AlignRight size={16} className="mx-auto" />
                  </button>
                </div>
              </div>
            </div>

            {/* Color & Display Section */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 uppercase tracking-wide">Color & Display</h3>
              <div className="grid grid-cols-2 gap-1 mb-3">
                <button 
                  className={`p-2 rounded-md flex flex-col items-center text-xs ${features.darkMode ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'}`}
                  onClick={() => toggleFeature('darkMode')}
                >
                  <Moon size={16} className="mb-1" />
                  Dark Mode
                </button>
                <button 
                  className={`p-2 rounded-md flex flex-col items-center text-xs ${features.lightMode ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'}`}
                  onClick={() => toggleFeature('lightMode')}
                >
                  <Sun size={16} className="mb-1" />
                  Light Mode
                </button>
                <button 
                  className={`p-2 rounded-md flex flex-col items-center text-xs ${features.highContrast ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'}`}
                  onClick={() => toggleFeature('highContrast')}
                >
                  <PanelTop size={16} className="mb-1" />
                  High Contrast
                </button>
                <button 
                  className={`p-2 rounded-md flex flex-col items-center text-xs ${features.invertColors ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'}`}
                  onClick={() => toggleFeature('invertColors')}
                >
                  <Square size={16} className="mb-1" />
                  Invert Colors
                </button>
              </div>
              
              {/* Color Filters */}
              <div className="grid grid-cols-3 gap-1">
                <button className={`p-2 rounded-md text-xs ${features.monochrome ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'}`} onClick={() => toggleFeature('monochrome')}>Mono</button>
                <button className={`p-2 rounded-md text-xs ${features.yellowFilter ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'}`} onClick={() => toggleFeature('yellowFilter')}>Yellow</button>
                <button className={`p-2 rounded-md text-xs ${features.blueFilter ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'}`} onClick={() => toggleFeature('blueFilter')}>Blue</button>
              </div>
            </div>

            {/* Navigation & Interaction */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 uppercase tracking-wide">Navigation & Interaction</h3>
              <div className="grid grid-cols-2 gap-1 mb-3">
                <button 
                  className={`p-2 rounded-md flex flex-col items-center text-xs ${features.largeCursor ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'}`}
                  onClick={() => toggleFeature('largeCursor')}
                >
                  <MousePointer2 size={16} className="mb-1" />
                  Large Cursor
                </button>
                <button 
                  className={`p-2 rounded-md flex flex-col items-center text-xs ${features.bigBlackCursor ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'}`}
                  onClick={() => toggleFeature('bigBlackCursor')}
                >
                  <MousePointer2 size={16} className="mb-1" />
                  Black Cursor
                </button>
                <button 
                  className={`p-2 rounded-md flex flex-col items-center text-xs ${features.bigWhiteCursor ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'}`}
                  onClick={() => toggleFeature('bigWhiteCursor')}
                >
                  <MousePointer2 size={16} className="mb-1" />
                  White Cursor
                </button>
                <button 
                  className={`p-2 rounded-md flex flex-col items-center text-xs ${features.keyboardNavigation ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'}`}
                  onClick={() => toggleFeature('keyboardNavigation')}
                >
                  <Navigation size={16} className="mb-1" />
                  Keyboard Nav
                </button>
              </div>
            </div>

            {/* Content Features */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 uppercase tracking-wide">Content Features</h3>
              <div className="space-y-1">
                <button 
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center text-sm ${features.highlightLinks ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'}`}
                  onClick={() => toggleFeature('highlightLinks')}
                >
                  <Link size={16} className="mr-2" />
                  <span>Highlight Links</span>
                </button>
                
                <button 
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center text-sm ${features.underlineLinks ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'}`}
                  onClick={() => toggleFeature('underlineLinks')}
                >
                  <Underline size={16} className="mr-2" />
                  <span>Underline Links</span>
                </button>
                
                <button 
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center text-sm ${features.highlightFocus ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'}`}
                  onClick={() => toggleFeature('highlightFocus')}
                >
                  <Eye size={16} className="mr-2" />
                  <span>Highlight Focus</span>
                </button>
                
                <button 
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center text-sm ${features.readableFont ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'}`}
                  onClick={() => toggleFeature('readableFont')}
                >
                  <Type size={16} className="mr-2" />
                  <span>Readable Font</span>
                </button>
                
                <button 
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center text-sm ${features.blockAnimations ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'}`}
                  onClick={() => toggleFeature('blockAnimations')}
                >
                  <Pause size={16} className="mr-2" />
                  <span>Block Animations</span>
                </button>
                
                <button 
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center text-sm ${features.hideImages ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'}`}
                  onClick={() => toggleFeature('hideImages')}
                >
                  <Eye size={16} className="mr-2" />
                  <span>Hide Images</span>
                </button>
              </div>
            </div>

            {/* Audio Features */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 uppercase tracking-wide">Audio Features</h3>
              <button 
                className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between text-sm ${features.textToSpeech ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'}`}
                onClick={() => toggleFeature('textToSpeech')}
              >
                <div className="flex items-center">
                  <Volume2 size={16} className="mr-2" />
                  <span>Text to Speech</span>
                </div>
                {isReading && <span className="text-xs">(Reading...)</span>}
              </button>
            </div>

            {/* Advanced Tools */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 uppercase tracking-wide">Advanced Tools</h3>
              <div className="grid grid-cols-1 gap-1">
                <button 
                  className={`p-2 rounded-md flex items-center text-sm ${features.readingMask ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'}`}
                  onClick={() => toggleFeature('readingMask')}
                >
                  <Square size={16} className="mr-2" />
                  Reading Mask
                </button>
                <button 
                  className={`p-2 rounded-md flex items-center text-sm ${features.virtualKeyboard ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'}`}
                  onClick={() => toggleFeature('virtualKeyboard')}
                >
                  <Keyboard size={16} className="mr-2" />
                  Virtual Keyboard
                </button>
              </div>
            </div>
            
            {/* Reset Button */}
            <button 
              onClick={resetAllSettings}
              className="w-full mt-4 flex items-center justify-center text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md py-2"
            >
              <RotateCcw size={16} className="mr-2" />
              <span>Reset All Settings</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}