import React, { useState, useEffect } from 'react';
import { Palette, RefreshCw, Upload, Download, Moon, Sun, Copy, Shuffle, Check, Info } from 'lucide-react';
import { saveAs } from 'file-saver';
import { LoadingSpinner } from './LoadingSpinner';

// Interfaces and Types
interface ColorCombination {
  background: string;
  text: string;
  name: string;
  ratio: number;
  wcagLevel: 'AAA' | 'AA' | 'Fail';
  isBaseColor?: boolean;
  isLocked?: boolean;
}

type ColorHarmony = 'complementary' | 'analogous' | 'triadic' | 'split-complementary' | 'monochromatic' | 'tetradic' | 'square' | 'all';

// Utility functions
function findClosestNamedColor(hex: string): string {
  // Common color names and their hex values
  const namedColors = {
    'Red': '#FF0000',
    'Green': '#00FF00',
    'Blue': '#0000FF',
    'Yellow': '#FFFF00',
    'Cyan': '#00FFFF',
    'Magenta': '#FF00FF',
    'Black': '#000000',
    'White': '#FFFFFF',
    'Gray': '#808080',
    'Silver': '#C0C0C0',
    'Maroon': '#800000',
    'Olive': '#808000',
    'Navy': '#000080',
    'Purple': '#800080',
    'Teal': '#008080',
    'Orange': '#FFA500',
    'Pink': '#FFC0CB',
    'Brown': '#A52A2A',
    'Indigo': '#4B0082',
    'Violet': '#EE82EE',
    'Turquoise': '#40E0D0',
    'Gold': '#FFD700',
    'Coral': '#FF7F50',
    'Lime': '#00FF00',
    'Chocolate': '#D2691E',
  };

  let closestColor = 'Custom';
  let minDistance = Number.MAX_VALUE;

  const rgb1 = hexToRgb(hex);

  for (const [name, colorHex] of Object.entries(namedColors)) {
    const rgb2 = hexToRgb(colorHex);
    
    // Calculate color distance using Euclidean distance formula
    const distance = Math.sqrt(
      Math.pow(rgb1.r - rgb2.r, 2) +
      Math.pow(rgb1.g - rgb2.g, 2) +
      Math.pow(rgb1.b - rgb2.b, 2)
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = name;
    }
  }
  
  // If the distance is too large, return 'Custom' instead
  return minDistance < 50 ? closestColor : 'Custom';
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return { h: h * 360, s, l };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

function getLuminance(r: number, g: number, b: number): number {
  // Adjust sRGB components
  const rsrgb = r / 255;
  const gsrgb = g / 255;
  const bsrgb = b / 255;

  // Calculate linear RGB values
  const rLinear = rsrgb <= 0.03928 ? rsrgb / 12.92 : Math.pow((rsrgb + 0.055) / 1.055, 2.4);
  const gLinear = gsrgb <= 0.03928 ? gsrgb / 12.92 : Math.pow((gsrgb + 0.055) / 1.055, 2.4);
  const bLinear = bsrgb <= 0.03928 ? bsrgb / 12.92 : Math.pow((bsrgb + 0.055) / 1.055, 2.4);

  // Calculate luminance according to WCAG 2.0 formula
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

function getContrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function getWCAGLevel(ratio: number, isLargeText: boolean = false, isUI: boolean = false): 'AAA' | 'AA' | 'Fail' {
  if (isUI) {
    return ratio >= 3 ? 'AA' : 'Fail';
  }
  
  if (isLargeText) {
    if (ratio >= 4.5) return 'AAA';
    if (ratio >= 3) return 'AA';
    return 'Fail';
  } else {
    if (ratio >= 7) return 'AAA';
    if (ratio >= 4.5) return 'AA';
    return 'Fail';
  }
}

function generateRandomColor(): string {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return rgbToHex(r, g, b);
}

function generateAccessiblePalette(baseColor: string, harmonyType: ColorHarmony = 'all'): ColorCombination[] {
  try {
    const baseRgb = hexToRgb(baseColor);
    const baseHsl = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b);
    const baseLuminance = getLuminance(baseRgb.r, baseRgb.g, baseRgb.b);
    
    let harmonies: string[] = [];
    
    switch (harmonyType) {
      case 'complementary':
        harmonies = createComplementaryPalette(baseHsl);
        break;
      case 'analogous':
        harmonies = createAnalogousPalette(baseHsl);
        break;
      case 'triadic':
        harmonies = createTriadicPalette(baseHsl);
        break;
      case 'split-complementary':
        harmonies = createSplitComplementaryPalette(baseHsl);
        break;
      case 'monochromatic':
        harmonies = createMonochromaticPalette(baseHsl);
        break;
      case 'tetradic':
        harmonies = createTetradicPalette(baseHsl);
        break;
      case 'square':
        harmonies = createSquarePalette(baseHsl);
        break;
      case 'all':
      default:
        harmonies = createMixedPalette(baseHsl);
        break;
    }
    
    // Make sure we don't have duplicate colors and include the base color
    harmonies = [baseColor, ...harmonies.filter(color => color !== baseColor)];
    
    // Remove any duplicates
    harmonies = [...new Set(harmonies)];
    
    // Create color combinations for each color in our palette
    const combinations: ColorCombination[] = [];
    
    // First, add the base color combination
    const blackLuminance = getLuminance(0, 0, 0);
    const whiteLuminance = getLuminance(255, 255, 255);
    
    const blackContrastRatio = getContrastRatio(baseLuminance, blackLuminance);
    const whiteContrastRatio = getContrastRatio(baseLuminance, whiteLuminance);
    
    // Determine if black or white has better contrast
    const textColor = blackContrastRatio > whiteContrastRatio ? '#000000' : '#FFFFFF';
    const textLuminance = blackContrastRatio > whiteContrastRatio ? blackLuminance : whiteLuminance;
    const contrastRatio = Math.max(blackContrastRatio, whiteContrastRatio);
    const wcagLevel = getWCAGLevel(contrastRatio);
    
    // Add the base color as background with appropriate text color
    combinations.push({
      background: baseColor,
      text: textColor,
      name: findClosestNamedColor(baseColor),
      ratio: contrastRatio,
      wcagLevel: wcagLevel,
      isBaseColor: true,
    });
    
    // Now add combinations for each color in our harmonies
    for (let i = 1; i < harmonies.length; i++) {
      const harmonyColor = harmonies[i];
      const harmonyRgb = hexToRgb(harmonyColor);
      const harmonyLuminance = getLuminance(harmonyRgb.r, harmonyRgb.g, harmonyRgb.b);
      
      const harmonyBlackContrast = getContrastRatio(harmonyLuminance, blackLuminance);
      const harmonyWhiteContrast = getContrastRatio(harmonyLuminance, whiteLuminance);
      
      const bestTextColor = harmonyBlackContrast > harmonyWhiteContrast ? '#000000' : '#FFFFFF';
      const bestContrast = Math.max(harmonyBlackContrast, harmonyWhiteContrast);
      const harmonyWcagLevel = getWCAGLevel(bestContrast);
      
      const harmonyHsl = rgbToHsl(harmonyRgb.r, harmonyRgb.g, harmonyRgb.b);
      const colorName = determineColorName(baseHsl, harmonyHsl, harmonyType);
      
      combinations.push({
        background: harmonyColor,
        text: bestTextColor,
        name: colorName,
        ratio: bestContrast,
        wcagLevel: harmonyWcagLevel,
      });
    }
    
    return combinations;
  } catch (error) {
    console.error("Error generating palette:", error);
    // Return an empty array if we encounter an error
    return [];
  }
}

function createComplementaryPalette(baseHsl: { h: number, s: number, l: number }): string[] {
  const h = baseHsl.h;
  const s = baseHsl.s;
  const l = baseHsl.l;
  
  // Complementary color (opposite on color wheel)
  const complementaryH = (h + 180) % 360;
  
  // Create variations with different saturation and lightness
  const colors = [
    hslToHexString(complementaryH, s, l),
    hslToHexString(complementaryH, Math.max(0, s - 0.2), Math.min(1, l + 0.1)),
    hslToHexString(complementaryH, Math.min(1, s + 0.2), Math.max(0, l - 0.1)),
    hslToHexString(h, Math.max(0, s - 0.3), Math.min(0.9, l + 0.3)), // Lighter version of base
    hslToHexString(h, Math.min(1, s + 0.2), Math.max(0.1, l - 0.3)), // Darker version of base
  ];
  
  return colors;
}

function createAnalogousPalette(baseHsl: { h: number, s: number, l: number }): string[] {
  const h = baseHsl.h;
  const s = baseHsl.s;
  const l = baseHsl.l;
  
  // Analogous colors (adjacent on color wheel)
  const colors = [
    hslToHexString((h + 30) % 360, s, l),
    hslToHexString((h + 60) % 360, s, l),
    hslToHexString((h - 30 + 360) % 360, s, l),
    hslToHexString((h - 60 + 360) % 360, s, l),
    hslToHexString(h, Math.max(0, s - 0.2), Math.min(1, l + 0.2)), // Lighter version of base
    hslToHexString(h, Math.min(1, s + 0.1), Math.max(0, l - 0.2)), // Darker version of base
  ];
  
  return colors;
}

function createTriadicPalette(baseHsl: { h: number, s: number, l: number }): string[] {
  const h = baseHsl.h;
  const s = baseHsl.s;
  const l = baseHsl.l;
  
  // Triadic colors (evenly spaced on color wheel)
  const colors = [
    hslToHexString((h + 120) % 360, s, l),
    hslToHexString((h + 240) % 360, s, l),
    hslToHexString((h + 120) % 360, Math.max(0, s - 0.2), Math.min(1, l + 0.1)),
    hslToHexString((h + 240) % 360, Math.max(0, s - 0.2), Math.min(1, l + 0.1)),
    hslToHexString(h, Math.max(0, s - 0.3), Math.min(1, l + 0.2)), // Lighter version of base
    hslToHexString(h, Math.min(1, s + 0.1), Math.max(0, l - 0.2)), // Darker version of base
  ];
  
  return colors;
}

function createSplitComplementaryPalette(baseHsl: { h: number, s: number, l: number }): string[] {
  const h = baseHsl.h;
  const s = baseHsl.s;
  const l = baseHsl.l;
  
  // Split complementary colors
  const colors = [
    hslToHexString((h + 150) % 360, s, l),
    hslToHexString((h + 210) % 360, s, l),
    hslToHexString((h + 150) % 360, Math.max(0, s - 0.2), Math.min(1, l + 0.1)),
    hslToHexString((h + 210) % 360, Math.max(0, s - 0.2), Math.min(1, l + 0.1)),
    hslToHexString(h, Math.max(0, s - 0.3), Math.min(1, l + 0.2)), // Lighter version of base
    hslToHexString(h, Math.min(1, s + 0.1), Math.max(0, l - 0.2)), // Darker version of base
  ];
  
  return colors;
}

function createMonochromaticPalette(baseHsl: { h: number, s: number, l: number }): string[] {
  const h = baseHsl.h;
  const s = baseHsl.s;
  
  // Monochromatic colors (varying lightness)
  const colors = [
    hslToHexString(h, s, 0.9), // Very light
    hslToHexString(h, s, 0.7), // Light
    hslToHexString(h, s, 0.5), // Medium
    hslToHexString(h, s, 0.3), // Dark
    hslToHexString(h, Math.max(0, s - 0.2), 0.6), // Less saturated
    hslToHexString(h, Math.min(1, s + 0.2), 0.4), // More saturated dark
  ];
  
  return colors;
}

function createTetradicPalette(baseHsl: { h: number, s: number, l: number }): string[] {
  const h = baseHsl.h;
  const s = baseHsl.s;
  const l = baseHsl.l;
  
  // Tetradic colors (rectangle on color wheel)
  const colors = [
    hslToHexString((h + 60) % 360, s, l),
    hslToHexString((h + 180) % 360, s, l),
    hslToHexString((h + 240) % 360, s, l),
    hslToHexString((h + 60) % 360, Math.max(0, s - 0.2), Math.min(1, l + 0.1)),
    hslToHexString((h + 180) % 360, Math.max(0, s - 0.2), Math.min(1, l + 0.1)),
    hslToHexString((h + 240) % 360, Math.max(0, s - 0.2), Math.min(1, l + 0.1)),
  ];
  
  return colors;
}

function createSquarePalette(baseHsl: { h: number, s: number, l: number }): string[] {
  const h = baseHsl.h;
  const s = baseHsl.s;
  const l = baseHsl.l;
  
  // Square colors (evenly spaced on color wheel)
  const colors = [
    hslToHexString((h + 90) % 360, s, l),
    hslToHexString((h + 180) % 360, s, l),
    hslToHexString((h + 270) % 360, s, l),
    hslToHexString((h + 90) % 360, Math.max(0, s - 0.2), Math.min(1, l + 0.1)),
    hslToHexString((h + 180) % 360, Math.max(0, s - 0.2), Math.min(1, l + 0.1)),
    hslToHexString((h + 270) % 360, Math.max(0, s - 0.2), Math.min(1, l + 0.1)),
  ];
  
  return colors;
}

function createMixedPalette(baseHsl: { h: number, s: number, l: number }): string[] {
  const h = baseHsl.h;
  const s = baseHsl.s;
  const l = baseHsl.l;
  
  // Mix of various harmony types for a diverse palette
  const colors = [
    // Complementary
    hslToHexString((h + 180) % 360, s, l),
    
    // Analogous
    hslToHexString((h + 30) % 360, s, l),
    hslToHexString((h - 30 + 360) % 360, s, l),
    
    // Triadic
    hslToHexString((h + 120) % 360, s, l),
    hslToHexString((h + 240) % 360, s, l),
    
    // Monochromatic
    hslToHexString(h, s, Math.max(0, l - 0.3)),
    hslToHexString(h, s, Math.min(1, l + 0.3)),
    
    // Split complementary
    hslToHexString((h + 150) % 360, s, l),
    hslToHexString((h + 210) % 360, s, l),
  ];
  
  return colors;
}

function hslToHexString(h: number, s: number, l: number): string {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

function determineColorName(baseHsl: { h: number, s: number, l: number }, colorHsl: { h: number, s: number, l: number }, harmonyType: ColorHarmony): string {
  // Check if this is very close to the base color
  if (Math.abs(baseHsl.h - colorHsl.h) < 5 && 
      Math.abs(baseHsl.s - colorHsl.s) < 0.1 && 
      Math.abs(baseHsl.l - colorHsl.l) < 0.1) {
    return 'Base';
  }
  
  // For monochromatic colors
  if (harmonyType === 'monochromatic' || 
      (Math.abs(baseHsl.h - colorHsl.h) < 5 && baseHsl.s !== colorHsl.s && baseHsl.l !== colorHsl.l)) {
    if (colorHsl.l > 0.8) return 'Lightest';
    if (colorHsl.l > 0.6) return 'Lighter';
    if (colorHsl.l < 0.2) return 'Darkest';
    if (colorHsl.l < 0.4) return 'Darker';
    return 'Mid-tone';
  }
  
  // For color wheel based harmonies
  if (Math.abs(((baseHsl.h + 180) % 360) - colorHsl.h) < 15) {
    return 'Complementary';
  }
  
  if (Math.abs(((baseHsl.h + 120) % 360) - colorHsl.h) < 15) {
    return 'Triadic 1';
  }
  
  if (Math.abs(((baseHsl.h + 240) % 360) - colorHsl.h) < 15) {
    return 'Triadic 2';
  }
  
  if (Math.abs(((baseHsl.h + 60) % 360) - colorHsl.h) < 15) {
    return 'Tetradic 1';
  }
  
  if (Math.abs(((baseHsl.h + 240) % 360) - colorHsl.h) < 15) {
    return 'Tetradic 2';
  }
  
  if (Math.abs(((baseHsl.h + 30) % 360) - colorHsl.h) < 15) {
    return 'Analogous 1';
  }
  
  if (Math.abs(((baseHsl.h - 30 + 360) % 360) - colorHsl.h) < 15) {
    return 'Analogous 2';
  }
  
  // Fallback to a generic name
  return findClosestNamedColor(hslToHexString(colorHsl.h, colorHsl.s, colorHsl.l));
}

export function WCAGColorPalette() {
  const [baseColor, setBaseColor] = useState<string>('#0fae96');
  const [colorHarmony, setColorHarmony] = useState<ColorHarmony>('all');
  const [generatedPalette, setGeneratedPalette] = useState<ColorCombination[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [copied, setCopied] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    // Initialize the palette on component mount
    if (generatedPalette.length === 0) {
      const initialPalette = generateAccessiblePalette(baseColor, 'all');
      
      // Ensure base color is locked
      const updatedPalette = initialPalette.map((combo, index) => {
        if (index === 0) {
          return { ...combo, isLocked: true };
        }
        return combo;
      });
      
      setGeneratedPalette(updatedPalette);
    }
    
    // Check if user prefers dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    
    // Apply dark mode class
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleBaseColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setBaseColor(newColor);
    
    // Generate new palette with the new base color
    const newPalette = generateAccessiblePalette(newColor, colorHarmony);
    
    // Ensure base color is locked
    const updatedPalette = newPalette.map((combo, index) => {
      if (index === 0) {
        return { ...combo, isLocked: true };
      }
      return combo;
    });
    
    setGeneratedPalette(updatedPalette);
  };

  const generateNewPalette = () => {
    setIsGenerating(true);
    
    // Add a timeout to show the loading state
    setTimeout(() => {
      try {
        // Generate a new palette with the current base color
        const newPalette = generateAccessiblePalette(baseColor, colorHarmony);
        
        // Ensure base color is locked
        const updatedPalette = newPalette.map((combo, index) => {
          if (index === 0) {
            return { ...combo, isLocked: true };
          }
          return combo;
        });
        
        setGeneratedPalette(updatedPalette);
        setIsGenerating(false);
      } catch (error) {
        console.error('Error generating palette:', error);
        setIsGenerating(false);
      }
    }, 1000);
  };

  const shufflePalette = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      try {
        // Create a new palette but with truly randomized colors
        const currentPalette = [...generatedPalette];
        
        // Create a result array for the shuffled palette
        const shuffledPalette: ColorCombination[] = [];
        
        // Keep the base color locked if it is locked
        const baseColorCombination = currentPalette.find(combo => combo.isBaseColor || combo.isLocked);
        
        if (baseColorCombination) {
          shuffledPalette.push(baseColorCombination);
        }
        
        // For each other color, generate a random color but keep the ratio
        for (let i = 0; i < currentPalette.length; i++) {
          const combo = currentPalette[i];
          
          // Skip locked colors
          if (combo.isLocked || combo.isBaseColor) continue;
          
          // Generate a random color
          const randomHex = generateRandomColor();
          
          // Convert the random hex to RGB
          const randomRgb = hexToRgb(randomHex);
          const randomLuminance = getLuminance(randomRgb.r, randomRgb.g, randomRgb.b);
          const blackLuminance = getLuminance(0, 0, 0); // Black is rgb(0,0,0)
          const whiteLuminance = getLuminance(255, 255, 255); // White is rgb(255,255,255)
          
          // Calculate contrast with black and white
          const blackContrastRatio = getContrastRatio(randomLuminance, blackLuminance);
          const whiteContrastRatio = getContrastRatio(randomLuminance, whiteLuminance);
          
          // Choose the better contrast
          const textColor = blackContrastRatio > whiteContrastRatio ? '#000000' : '#FFFFFF';
          const contrastRatio = Math.max(blackContrastRatio, whiteContrastRatio);
          const wcagLevel = getWCAGLevel(contrastRatio);
          
          shuffledPalette.push({
            background: randomHex,
            text: textColor,
            name: findClosestNamedColor(randomHex),
            ratio: contrastRatio,
            wcagLevel: wcagLevel,
          });
        }
        
        setGeneratedPalette(shuffledPalette);
        setIsGenerating(false);
      } catch (error) {
        console.error('Error shuffling palette:', error);
        setIsGenerating(false);
      }
    }, 1000);
  };

  const clearGenerator = () => {
    setBaseColor('#0fae96');
    setColorHarmony('all');
    
    const initialPalette = generateAccessiblePalette('#0fae96', 'all');
    
    // Ensure base color is locked
    const updatedPalette = initialPalette.map((combo, index) => {
      if (index === 0) {
        return { ...combo, isLocked: true };
      }
      return combo;
    });
    
    setGeneratedPalette(updatedPalette);
  };

  const toggleLock = (index: number) => {
    const updatedPalette = [...generatedPalette];
    updatedPalette[index] = {
      ...updatedPalette[index],
      isLocked: !updatedPalette[index].isLocked
    };
    setGeneratedPalette(updatedPalette);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    
    // Set copied state for this key
    setCopied({ ...copied, [key]: true });
    
    // Reset after 2 seconds
    setTimeout(() => {
      setCopied({ ...copied, [key]: false });
    }, 2000);
  };

  const exportPalette = () => {
    let content = "WCAG Color Palette Export\n";
    content += "========================\n\n";
    
    content += `Base Color: ${baseColor}\n\n`;
    
    content += "Color Combinations:\n";
    generatedPalette.forEach((combo, index) => {
      content += `${index + 1}. ${combo.name}\n`;
      content += `   Background: ${combo.background}\n`;
      content += `   Text: ${combo.text}\n`;
      content += `   Contrast Ratio: ${combo.ratio.toFixed(2)}:1\n`;
      content += `   WCAG Level: ${combo.wcagLevel}\n\n`;
    });
    
    content += "SASS Variables:\n";
    generatedPalette.forEach((combo, index) => {
      const safeName = combo.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      content += `$color-${safeName}-bg: ${combo.background};\n`;
      content += `$color-${safeName}-text: ${combo.text};\n`;
    });
    
    content += "\nCSS Variables:\n";
    content += ":root {\n";
    generatedPalette.forEach((combo, index) => {
      const safeName = combo.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      content += `  --color-${safeName}-bg: ${combo.background};\n`;
      content += `  --color-${safeName}-text: ${combo.text};\n`;
    });
    content += "}\n";
    
    // Create a blob and save the file
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'color-palette.txt');
  };

  return (
    <div className="space-y-6">
      {isGenerating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <LoadingSpinner size="large" className="mb-4" />
            <p className="text-gray-900 dark:text-white font-medium">Generating Color Palette...</p>
          </div>
        </div>
      )}

      {/* Generator Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 relative">
        <div className="absolute -top-3 left-4 bg-white dark:bg-gray-800 px-2">
          <span className="text-xs font-medium text-[#0fae96] dark:text-[#0fae96]/90 uppercase tracking-wider">Palette Generator</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 mt-2">
          <div className="flex items-center justify-between">
            <span>Generate Custom Palette</span>
          </div>
        </h3>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Color Harmony
            </label>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
            <button
              onClick={() => {
                setColorHarmony('all');
                const newPalette = generateAccessiblePalette(baseColor, 'all');
                // Ensure main color is locked
                const updatedPalette = newPalette.map((combo, index) => {
                  if (index === 0) {
                    return { ...combo, isLocked: true };
                  }
                  return combo;
                });
                setGeneratedPalette(updatedPalette);
              }}
              className={`p-2 text-sm rounded-lg transition-colors ${
                colorHarmony === 'all' ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              All Harmonies
            </button>
            <button
              onClick={() => {
                setColorHarmony('complementary');
                const newPalette = generateAccessiblePalette(baseColor, 'complementary');
                // Ensure main color is locked
                const updatedPalette = newPalette.map((combo, index) => {
                  if (index === 0) {
                    return { ...combo, isLocked: true };
                  }
                  return combo;
                });
                setGeneratedPalette(updatedPalette);
              }}
              className={`p-2 text-sm rounded-lg transition-colors ${
                colorHarmony === 'complementary' ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              Complementary
            </button>
            <button
              onClick={() => {
                setColorHarmony('analogous');
                const newPalette = generateAccessiblePalette(baseColor, 'analogous');
                // Ensure main color is locked
                const updatedPalette = newPalette.map((combo, index) => {
                  if (index === 0) {
                    return { ...combo, isLocked: true };
                  }
                  return combo;
                });
                setGeneratedPalette(updatedPalette);
              }}
              className={`p-2 text-sm rounded-lg transition-colors ${
                colorHarmony === 'analogous' ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              Analogous
            </button>
            <button
              onClick={() => {
                setColorHarmony('triadic');
                const newPalette = generateAccessiblePalette(baseColor, 'triadic');
                // Ensure main color is locked
                const updatedPalette = newPalette.map((combo, index) => {
                  if (index === 0) {
                    return { ...combo, isLocked: true };
                  }
                  return combo;
                });
                setGeneratedPalette(updatedPalette);
              }}
              className={`p-2 text-sm rounded-lg transition-colors ${
                colorHarmony === 'triadic' ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              Triadic
            </button>
            <button
              onClick={() => {
                setColorHarmony('split-complementary');
                const newPalette = generateAccessiblePalette(baseColor, 'split-complementary');
                // Ensure main color is locked
                const updatedPalette = newPalette.map((combo, index) => {
                  if (index === 0) {
                    return { ...combo, isLocked: true };
                  }
                  return combo;
                });
                setGeneratedPalette(updatedPalette);
              }}
              className={`p-2 text-sm rounded-lg transition-colors ${
                colorHarmony === 'split-complementary' ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              Split Comp
            </button>
            <button
              onClick={() => {
                setColorHarmony('monochromatic');
                const newPalette = generateAccessiblePalette(baseColor, 'monochromatic');
                // Ensure main color is locked
                const updatedPalette = newPalette.map((combo, index) => {
                  if (index === 0) {
                    return { ...combo, isLocked: true };
                  }
                  return combo;
                });
                setGeneratedPalette(updatedPalette);
              }}
              className={`p-2 text-sm rounded-lg transition-colors ${
                colorHarmony === 'monochromatic' ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              Monochromatic
            </button>
            <button
              onClick={() => {
                setColorHarmony('tetradic');
                const newPalette = generateAccessiblePalette(baseColor, 'tetradic');
                // Ensure main color is locked
                const updatedPalette = newPalette.map((combo, index) => {
                  if (index === 0) {
                    return { ...combo, isLocked: true };
                  }
                  return combo;
                });
                setGeneratedPalette(updatedPalette);
              }}
              className={`p-2 text-sm rounded-lg transition-colors ${
                colorHarmony === 'tetradic' ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              Tetradic
            </button>
            <button
              onClick={() => {
                setColorHarmony('square');
                const newPalette = generateAccessiblePalette(baseColor, 'square');
                // Ensure main color is locked
                const updatedPalette = newPalette.map((combo, index) => {
                  if (index === 0) {
                    return { ...combo, isLocked: true };
                  }
                  return combo;
                });
                setGeneratedPalette(updatedPalette);
              }}
              className={`p-2 text-sm rounded-lg transition-colors ${
                colorHarmony === 'square' ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              Square
            </button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <Palette className="w-5 h-5 mr-2 text-primary-600" />
              <label htmlFor="baseColor" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Base Color
              </label>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="color"
                id="baseColor"
                value={baseColor}
                onChange={handleBaseColorChange}
                className="h-12 w-20 rounded border border-gray-300 dark:border-gray-600"
              />
              <div className="flex flex-1">
                <input
                  type="text"
                  value={baseColor}
                  onChange={(e) => {
                    const newColor = e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`;
                    if (/^#[0-9A-Fa-f]{6}$/.test(newColor)) {
                      setBaseColor(newColor);
                      const newPalette = generateAccessiblePalette(newColor, colorHarmony);
                      
                      // Ensure main color is locked
                      const updatedPalette = newPalette.map((combo, index) => {
                        if (index === 0) {
                          return { ...combo, isLocked: true };
                        }
                        return combo;
                      });
                      
                      setGeneratedPalette(updatedPalette);
                    }
                  }}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-l-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent flex-1"
                  placeholder="#000000"
                />
                <button
                  onClick={clearGenerator}
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-600 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-500"
                  aria-label="Clear color palette"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex items-end gap-2">
            <button
              onClick={generateNewPalette}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-4 py-2 border-none rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#0fae96] to-[#19d3b2] hover:from-[#0d9e89] hover:to-[#16c3a4] disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              Generate New
            </button>
          </div>
        </div>
      </div>

      {/* Generated Palette */}
      {generatedPalette.length > 0 && (
        <div className="border border-gray-100 dark:border-gray-700 rounded-xl p-6 mb-6 bg-white dark:bg-gray-800 shadow-sm relative">
          <div className="absolute -top-3 left-4 bg-white dark:bg-gray-800 px-2">
            <span className="text-xs font-medium text-[#0fae96] dark:text-[#0fae96]/90 uppercase tracking-wider">Generated Palette</span>
          </div>
          
          <div className="flex justify-between items-center gap-4 mb-6">
            {/* Left side - Control buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <button
                onClick={shufflePalette}
                className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200"
              >
                <Shuffle className="w-4 h-4" />
                Shuffle
              </button>
            </div>
            
            {/* Right side - Export button */}
            <button
              onClick={exportPalette}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-white bg-gradient-to-r from-[#0fae96] to-[#19d3b2] hover:from-[#0d9e89] hover:to-[#16c3a4]"
            >
              <Download className="w-4 h-4" />
              Export Palette
            </button>
          </div>
          
          {/* Color Palette Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {generatedPalette.map((combo, index) => (
              <div 
                key={`${combo.background}-${index}`}
                className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm"
              >
                {/* Color Preview */}
                <div 
                  style={{ backgroundColor: combo.background }} 
                  className="h-24 flex items-center justify-center p-4 relative"
                >
                  {/* Text Sample */}
                  <p style={{ color: combo.text }} className="text-lg font-semibold z-10">
                    {combo.name} Sample
                  </p>
                  
                  {/* Lock Button */}
                  <button
                    onClick={() => toggleLock(index)}
                    aria-label={combo.isLocked ? "Unlock color" : "Lock color"}
                    className="absolute top-2 right-2 p-1 bg-white dark:bg-gray-800 bg-opacity-80 rounded-full"
                  >
                    {combo.isLocked ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                      </svg>
                    )}
                  </button>
                </div>
                
                {/* Color Info */}
                <div className="p-4 bg-white dark:bg-gray-800">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">{combo.name}</h4>
                    <span className={`text-sm font-semibold rounded-md px-2 py-1 ${
                      combo.wcagLevel === 'AAA' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                      combo.wcagLevel === 'AA' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {combo.wcagLevel}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    {/* Background Color */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Background:</span>
                      <button
                        onClick={() => copyToClipboard(combo.background, `bg-${index}`)}
                        className="inline-flex items-center gap-1 text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        {combo.background}
                        {copied[`bg-${index}`] ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    
                    {/* Text Color */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Text:</span>
                      <button
                        onClick={() => copyToClipboard(combo.text, `text-${index}`)}
                        className="inline-flex items-center gap-1 text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        {combo.text}
                        {copied[`text-${index}`] ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    
                    {/* Contrast Ratio */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Contrast Ratio:</span>
                      <span className="text-gray-900 dark:text-white">{combo.ratio.toFixed(2)}:1</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Usage Guidelines */}
          <div className="mt-8 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">WCAG Color Guidelines</h4>
                <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc pl-5 space-y-1">
                  <li>AA level requires a contrast ratio of at least 4.5:1 for normal text</li>
                  <li>AAA level requires a contrast ratio of at least 7:1 for normal text</li>
                  <li>Text over colored backgrounds should meet minimum contrast</li>
                  <li>Apply your base color to primary interactive elements</li>
                  <li>Save AAA combinations for critical content and navigation</li>
                  <li>Test your design in different lighting conditions</li>
                  <li>Document your color system for consistent implementation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}