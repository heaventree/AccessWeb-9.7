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
    
    // Apply text scaling that actually works
    root.style.fontSize = `${textSize}%`;
    root.style.setProperty('--accessibility-text-zoom', `${textSize}%`);
    
    // Apply line height
    root.style.setProperty('--accessibility-line-height', `${lineHeight}%`);
    
    // Apply letter spacing
    root.style.setProperty('--accessibility-letter-spacing', `${letterSpacing * 0.01}em`);
    
    // Apply word spacing
    root.style.setProperty('--accessibility-word-spacing', `${wordSpacing * 0.01}em`);
    
    // Apply text scaling to all text elements
    const style = document.createElement('style');
    style.id = 'accessibility-text-scaling';
    const existingStyle = document.getElementById('accessibility-text-scaling');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    style.textContent = `
      body, p, div, span, h1, h2, h3, h4, h5, h6, li, td, th, label, input, textarea, button, a {
        font-size: calc(1em * ${textSize / 100}) !important;
        line-height: calc(1.5 * ${lineHeight / 100}) !important;
        letter-spacing: ${letterSpacing * 0.01}em !important;
        word-spacing: ${wordSpacing * 0.01}em !important;
      }
    `;
    document.head.appendChild(style);
    
  }, [textSize, lineHeight, letterSpacing, wordSpacing]);

  const toggleFeature = (feature: keyof typeof features) => {
    // Special handling for mutually exclusive features
    if (feature === 'textAlignLeft' || feature === 'textAlignCenter' || feature === 'textAlignRight') {
      const isCurrentlyActive = features[feature];
      
      if (!isCurrentlyActive) {
        setFeatures(prev => ({
          ...prev,
          textAlignLeft: feature === 'textAlignLeft',
          textAlignCenter: feature === 'textAlignCenter',
          textAlignRight: feature === 'textAlignRight'
        }));
        
        const alignment = feature === 'textAlignLeft' ? 'left' : 
                         feature === 'textAlignCenter' ? 'center' : 'right';
        document.body.style.textAlign = alignment;
      } else {
        setFeatures(prev => ({
          ...prev,
          [feature]: false
        }));
        document.body.style.textAlign = '';
      }
      return;
    }

    // Special handling for cursor types (mutually exclusive)
    if (feature === 'bigBlackCursor' || feature === 'bigWhiteCursor' || feature === 'largeCursor') {
      const isCurrentlyActive = features[feature];
      
      if (!isCurrentlyActive) {
        setFeatures(prev => ({
          ...prev,
          bigBlackCursor: feature === 'bigBlackCursor',
          bigWhiteCursor: feature === 'bigWhiteCursor',
          largeCursor: feature === 'largeCursor'
        }));
        
        // Remove existing cursor classes
        document.body.classList.remove('big-black-cursor', 'big-white-cursor', 'large-cursor');
        
        // Add new cursor class
        const cursorClass = feature === 'bigBlackCursor' ? 'big-black-cursor' :
                           feature === 'bigWhiteCursor' ? 'big-white-cursor' : 'large-cursor';
        document.body.classList.add(cursorClass);
      } else {
        setFeatures(prev => ({
          ...prev,
          [feature]: false
        }));
        document.body.classList.remove('big-black-cursor', 'big-white-cursor', 'large-cursor');
      }
      return;
    }

    // Special handling for color filters (mutually exclusive)
    if (feature === 'darkMode' || feature === 'lightMode' || feature === 'invertColors' || 
        feature === 'monochrome' || feature === 'yellowFilter' || feature === 'blueFilter' || feature === 'greenFilter') {
      const isCurrentlyActive = features[feature];
      
      if (!isCurrentlyActive) {
        setFeatures(prev => ({
          ...prev,
          darkMode: feature === 'darkMode',
          lightMode: feature === 'lightMode',
          invertColors: feature === 'invertColors',
          monochrome: feature === 'monochrome',
          yellowFilter: feature === 'yellowFilter',
          blueFilter: feature === 'blueFilter',
          greenFilter: feature === 'greenFilter'
        }));
        
        // Remove existing filter classes
        document.body.classList.remove('dark-mode', 'light-mode', 'invert-colors', 'monochrome', 'yellow-filter', 'blue-filter', 'green-filter');
        
        // Add new filter class
        const filterClass = feature === 'darkMode' ? 'dark-mode' :
                           feature === 'lightMode' ? 'light-mode' :
                           feature === 'invertColors' ? 'invert-colors' :
                           feature === 'monochrome' ? 'monochrome' :
                           feature === 'yellowFilter' ? 'yellow-filter' :
                           feature === 'blueFilter' ? 'blue-filter' : 'green-filter';
        document.body.classList.add(filterClass);
      } else {
        setFeatures(prev => ({
          ...prev,
          [feature]: false
        }));
        document.body.classList.remove('dark-mode', 'light-mode', 'invert-colors', 'monochrome', 'yellow-filter', 'blue-filter', 'green-filter');
      }
      return;
    }
    
    // Regular toggle for other features
    setFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
    
    // Apply feature effects
    const newValue = !features[feature];
    switch (feature) {
      case 'highlightLinks':
        document.body.classList.toggle('highlight-links', newValue);
        break;
      case 'highlightFocus':
        document.body.classList.toggle('highlight-focus', newValue);
        break;
      case 'highContrast':
        document.body.classList.toggle('high-contrast', newValue);
        break;
      case 'readingMask':
        document.body.classList.toggle('reading-mask', newValue);
        break;
      case 'keyboardNavigation':
        document.body.classList.toggle('keyboard-navigation', newValue);
        break;
      case 'underlineLinks':
        document.body.classList.toggle('underline-links', newValue);
        break;
      case 'blockAnimations':
        document.body.classList.toggle('block-animations', newValue);
        break;
      case 'hideImages':
        document.body.classList.toggle('hide-images', newValue);
        break;
      case 'readableFont':
        document.body.classList.toggle('readable-font', newValue);
        break;
      case 'textToSpeech':
        if (newValue) {
          startTextToSpeech();
        } else {
          stopTextToSpeech();
        }
        break;
    }
  };

  const startTextToSpeech = () => {
    setIsReading(true);
    // Simple text-to-speech implementation
    const textContent = document.body.innerText;
    const utterance = new SpeechSynthesisUtterance(textContent);
    utterance.onend = () => setIsReading(false);
    speechSynthesis.speak(utterance);
  };

  const stopTextToSpeech = () => {
    speechSynthesis.cancel();
    setIsReading(false);
  };

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
    setTextSize(100);
    setLineHeight(100);
    setLetterSpacing(100);
    setWordSpacing(100);
    setIsReading(false);
    
    setFeatures({
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
    
    // Reset all applied classes and styles
    document.documentElement.style.fontSize = '100%';
    document.documentElement.style.setProperty('--accessibility-text-zoom', '100%');
    document.documentElement.style.setProperty('--accessibility-line-height', '100%');
    document.documentElement.style.setProperty('--accessibility-letter-spacing', '0em');
    document.documentElement.style.setProperty('--accessibility-word-spacing', '0em');
    
    // Remove all accessibility classes
    document.body.classList.remove(
      'large-cursor', 'big-black-cursor', 'big-white-cursor',
      'highlight-links', 'highlight-focus', 'high-contrast',
      'dark-mode', 'light-mode', 'invert-colors', 'monochrome',
      'yellow-filter', 'blue-filter', 'green-filter',
      'reading-mask', 'keyboard-navigation', 'underline-links',
      'block-animations', 'hide-images', 'readable-font'
    );
    
    // Reset text alignment
    document.body.style.textAlign = '';
    
    // Remove accessibility CSS
    const existingStyle = document.getElementById('accessibility-text-scaling');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    // Stop any text-to-speech
    speechSynthesis.cancel();
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