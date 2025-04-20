import React, { useState, useRef, useEffect } from 'react';
import { 
  Palette, RefreshCw, Copy, Check, Lock, Unlock, Shuffle, 
  Sun, Moon, FileText, FileDown
} from 'lucide-react';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Color from 'color';
import { LoadingSpinner } from './LoadingSpinner';

// Basic named colors for identification
const namedColors: Record<string, string> = {
  '#FF0000': 'Red',
  '#00FF00': 'Green',
  '#0000FF': 'Blue',
  '#FFFF00': 'Yellow',
  '#FF00FF': 'Magenta',
  '#00FFFF': 'Cyan',
  '#000000': 'Black',
  '#FFFFFF': 'White',
  '#808080': 'Gray',
  '#800000': 'Maroon',
  '#808000': 'Olive',
  '#008000': 'Dark Green',
  '#800080': 'Purple',
  '#008080': 'Teal',
  '#000080': 'Navy',
  '#FFA500': 'Orange',
  '#A52A2A': 'Brown',
  '#1A365D': 'Blue Slate',
  '#F87171': 'Light Red',
  '#34D399': 'Emerald',
  '#60A5FA': 'Blue',
  '#A78BFA': 'Violet',
  '#F472B6': 'Pink',
};

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

function findClosestNamedColor(hex: string): string {
  // First check for exact match
  if (namedColors[hex.toUpperCase()]) {
    return namedColors[hex.toUpperCase()];
  }
  
  // Convert hex to RGB
  const color = Color(hex);
  const rgb = color.rgb().object();
  
  // Get HSL values
  const hsl = color.hsl().object();
  
  // Create a descriptive name based on HSL values
  let name = '';
  
  // Determine primary color based on hue
  if (hsl.h < 30 || hsl.h >= 330) name = 'Red';
  else if (hsl.h >= 30 && hsl.h < 90) name = 'Yellow';
  else if (hsl.h >= 90 && hsl.h < 150) name = 'Green';
  else if (hsl.h >= 150 && hsl.h < 210) name = 'Cyan';
  else if (hsl.h >= 210 && hsl.h < 270) name = 'Blue';
  else if (hsl.h >= 270 && hsl.h < 330) name = 'Magenta';
  
  // Add lightness descriptor
  if (hsl.l < 20) name = 'Dark ' + name;
  else if (hsl.l > 80) name = 'Light ' + name;
  
  // Add saturation descriptor
  if (hsl.s < 20) {
    // For very low saturation, it's a grayscale
    if (hsl.l < 20) return 'Black';
    if (hsl.l > 90) return 'White';
    if (hsl.l > 80) return 'Light Gray';
    if (hsl.l < 40) return 'Dark Gray';
    return 'Gray';
  } else if (hsl.s < 40) {
    name = 'Muted ' + name;
  } else if (hsl.s > 80) {
    name = 'Vibrant ' + name;
  }
  
  return name;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const sanitizedHex = hex.replace(/^#/, '');
  const r = parseInt(sanitizedHex.substring(0, 2), 16);
  const g = parseInt(sanitizedHex.substring(2, 4), 16);
  const b = parseInt(sanitizedHex.substring(4, 6), 16);
  return { r, g, b };
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
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
  
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;
  
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l;
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
  const RGB = [r, g, b].map(function(v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * RGB[0] + 0.7152 * RGB[1] + 0.0722 * RGB[2];
}

function getContrastRatio(l1: number, l2: number): number {
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function getWCAGLevel(ratio: number, isLargeText: boolean = false, isUI: boolean = false): 'AAA' | 'AA' | 'Fail' {
  if (isUI) {
    return ratio >= 3 ? 'AA' : 'Fail';
  }
  if (isLargeText) {
    if (ratio >= 4.5) return 'AAA';
    if (ratio >= 3) return 'AA';
    return 'Fail';
  }
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  return 'Fail';
}

function generateRandomColor(): string {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return rgbToHex(r, g, b);
}

function generateAccessiblePalette(baseColor: string, harmonyType: ColorHarmony = 'all'): ColorCombination[] {
  const baseRgb = hexToRgb(baseColor);
  const baseHsl = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b);
  const baseLuminance = getLuminance(baseRgb.r, baseRgb.g, baseRgb.b);
  
  // Determine if white or black text has better contrast
  const blackLuminance = getLuminance(0, 0, 0);
  const whiteLuminance = getLuminance(255, 255, 255);
  
  const blackContrast = getContrastRatio(baseLuminance, blackLuminance);
  const whiteContrast = getContrastRatio(baseLuminance, whiteLuminance);
  
  const textColor = blackContrast > whiteContrast ? '#000000' : '#ffffff';
  const contrastRatio = Math.max(blackContrast, whiteContrast);
  const wcagLevel = getWCAGLevel(contrastRatio);
  
  // Create the array of color combinations
  const combinations: ColorCombination[] = [];
  
  // Add the base color first
  combinations.push({
    background: baseColor,
    text: textColor,
    name: 'Base',
    ratio: contrastRatio,
    wcagLevel: wcagLevel,
    isBaseColor: true,
    isLocked: true,
  });
  
  // Generate harmonized colors based on the selected harmony type
  let harmonyColors: string[] = [];
  
  if (harmonyType === 'complementary' || harmonyType === 'all') {
    harmonyColors = [...harmonyColors, ...createComplementaryPalette(baseHsl)];
  }
  
  if (harmonyType === 'analogous' || harmonyType === 'all') {
    harmonyColors = [...harmonyColors, ...createAnalogousPalette(baseHsl)];
  }
  
  if (harmonyType === 'triadic' || harmonyType === 'all') {
    harmonyColors = [...harmonyColors, ...createTriadicPalette(baseHsl)];
  }
  
  if (harmonyType === 'split-complementary' || harmonyType === 'all') {
    harmonyColors = [...harmonyColors, ...createSplitComplementaryPalette(baseHsl)];
  }
  
  if (harmonyType === 'monochromatic' || harmonyType === 'all') {
    harmonyColors = [...harmonyColors, ...createMonochromaticPalette(baseHsl)];
  }
  
  if (harmonyType === 'tetradic' || harmonyType === 'all') {
    harmonyColors = [...harmonyColors, ...createTetradicPalette(baseHsl)];
  }
  
  if (harmonyType === 'square' || harmonyType === 'all') {
    harmonyColors = [...harmonyColors, ...createSquarePalette(baseHsl)];
  }
  
  if (harmonyType === 'all') {
    harmonyColors = [...harmonyColors, ...createMixedPalette(baseHsl)];
  }
  
  // Filter out duplicates
  harmonyColors = [...new Set(harmonyColors)];
  
  // Add each harmony color to the combinations array
  for (const color of harmonyColors) {
    const rgb = hexToRgb(color);
    const luminance = getLuminance(rgb.r, rgb.g, rgb.b);
    
    const blackTextContrast = getContrastRatio(luminance, blackLuminance);
    const whiteTextContrast = getContrastRatio(luminance, whiteLuminance);
    
    const textColorForHarmony = blackTextContrast > whiteTextContrast ? '#000000' : '#ffffff';
    const contrastRatioForHarmony = Math.max(blackTextContrast, whiteTextContrast);
    const wcagLevelForHarmony = getWCAGLevel(contrastRatioForHarmony);
    
    const colorHsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const relationshipName = determineColorName(baseHsl, colorHsl, harmonyType);
    
    combinations.push({
      background: color,
      text: textColorForHarmony,
      name: relationshipName,
      ratio: contrastRatioForHarmony,
      wcagLevel: wcagLevelForHarmony,
      isBaseColor: false,
      isLocked: false,
    });
  }
  
  return combinations;
}

function createComplementaryPalette(baseHsl: { h: number, s: number, l: number }): string[] {
  const colors = [];
  
  // Complementary color (opposite on the color wheel)
  const complementaryH = (baseHsl.h + 180) % 360;
  
  // Create variations with different saturations and lightness
  for (let i = -10; i <= 10; i += 10) {
    for (let j = -10; j <= 10; j += 10) {
      if (i === 0 && j === 0) continue; // Skip the exact complement
      
      const s = Math.max(0, Math.min(100, baseHsl.s + i));
      const l = Math.max(20, Math.min(80, baseHsl.l + j));
      const rgb = hslToRgb(complementaryH, s, l);
      colors.push(rgbToHex(rgb.r, rgb.g, rgb.b));
    }
  }
  
  // Add the exact complement
  const complementaryRgb = hslToRgb(complementaryH, baseHsl.s, baseHsl.l);
  colors.push(rgbToHex(complementaryRgb.r, complementaryRgb.g, complementaryRgb.b));
  
  return colors;
}

function createAnalogousPalette(baseHsl: { h: number, s: number, l: number }): string[] {
  const colors = [];
  
  // Analogous colors (adjacent on the color wheel)
  for (let offset of [-30, -15, 15, 30]) {
    const h = (baseHsl.h + offset + 360) % 360;
    
    // Create variations with different saturations and lightness
    for (let i = -10; i <= 10; i += 10) {
      for (let j = -10; j <= 10; j += 10) {
        if (i === 0 && j === 0) continue; // Skip exact matches
        
        const s = Math.max(0, Math.min(100, baseHsl.s + i));
        const l = Math.max(20, Math.min(80, baseHsl.l + j));
        const rgb = hslToRgb(h, s, l);
        colors.push(rgbToHex(rgb.r, rgb.g, rgb.b));
      }
    }
    
    // Add the exact analogous color
    const rgb = hslToRgb(h, baseHsl.s, baseHsl.l);
    colors.push(rgbToHex(rgb.r, rgb.g, rgb.b));
  }
  
  return colors;
}

function createTriadicPalette(baseHsl: { h: number, s: number, l: number }): string[] {
  const colors = [];
  
  // Triadic colors (3 colors evenly spaced around the color wheel)
  for (let offset of [120, 240]) {
    const h = (baseHsl.h + offset) % 360;
    
    // Create variations with different saturations and lightness
    for (let i = -10; i <= 10; i += 10) {
      for (let j = -10; j <= 10; j += 10) {
        if (i === 0 && j === 0) continue; // Skip exact matches
        
        const s = Math.max(0, Math.min(100, baseHsl.s + i));
        const l = Math.max(20, Math.min(80, baseHsl.l + j));
        const rgb = hslToRgb(h, s, l);
        colors.push(rgbToHex(rgb.r, rgb.g, rgb.b));
      }
    }
    
    // Add the exact triadic color
    const rgb = hslToRgb(h, baseHsl.s, baseHsl.l);
    colors.push(rgbToHex(rgb.r, rgb.g, rgb.b));
  }
  
  return colors;
}

function createSplitComplementaryPalette(baseHsl: { h: number, s: number, l: number }): string[] {
  const colors = [];
  
  // Split complementary (complement plus colors adjacent to it)
  for (let offset of [150, 210]) {
    const h = (baseHsl.h + offset) % 360;
    
    // Create variations with different saturations and lightness
    for (let i = -10; i <= 10; i += 10) {
      for (let j = -10; j <= 10; j += 10) {
        if (i === 0 && j === 0) continue; // Skip exact matches
        
        const s = Math.max(0, Math.min(100, baseHsl.s + i));
        const l = Math.max(20, Math.min(80, baseHsl.l + j));
        const rgb = hslToRgb(h, s, l);
        colors.push(rgbToHex(rgb.r, rgb.g, rgb.b));
      }
    }
    
    // Add the exact split complementary colors
    const rgb = hslToRgb(h, baseHsl.s, baseHsl.l);
    colors.push(rgbToHex(rgb.r, rgb.g, rgb.b));
  }
  
  return colors;
}

function createMonochromaticPalette(baseHsl: { h: number, s: number, l: number }): string[] {
  const colors = [];
  
  // Monochromatic colors (same hue, different saturation/lightness)
  for (let s = 20; s <= 100; s += 20) {
    for (let l = 20; l <= 80; l += 15) {
      if (s === baseHsl.s && l === baseHsl.l) continue; // Skip the base color
      
      const rgb = hslToRgb(baseHsl.h, s, l);
      colors.push(rgbToHex(rgb.r, rgb.g, rgb.b));
    }
  }
  
  return colors;
}

function createTetradicPalette(baseHsl: { h: number, s: number, l: number }): string[] {
  const colors = [];
  
  // Tetradic colors (4 colors evenly spaced around the color wheel)
  for (let offset of [90, 180, 270]) {
    const h = (baseHsl.h + offset) % 360;
    
    // Add the exact tetradic colors
    const rgb = hslToRgb(h, baseHsl.s, baseHsl.l);
    colors.push(rgbToHex(rgb.r, rgb.g, rgb.b));
    
    // Create some variations
    for (let i = -10; i <= 10; i += 20) {
      for (let j = -10; j <= 10; j += 20) {
        if (i === 0 && j === 0) continue;
        
        const s = Math.max(0, Math.min(100, baseHsl.s + i));
        const l = Math.max(20, Math.min(80, baseHsl.l + j));
        const rgbVar = hslToRgb(h, s, l);
        colors.push(rgbToHex(rgbVar.r, rgbVar.g, rgbVar.b));
      }
    }
  }
  
  return colors;
}

function createSquarePalette(baseHsl: { h: number, s: number, l: number }): string[] {
  const colors = [];
  
  // Square colors (4 colors spaced 90° apart on the color wheel)
  for (let offset of [90, 180, 270]) {
    const h = (baseHsl.h + offset) % 360;
    
    // Add the exact square colors
    const rgb = hslToRgb(h, baseHsl.s, baseHsl.l);
    colors.push(rgbToHex(rgb.r, rgb.g, rgb.b));
    
    // Create some variations
    for (let i = -10; i <= 10; i += 20) {
      for (let j = -10; j <= 10; j += 20) {
        if (i === 0 && j === 0) continue;
        
        const s = Math.max(0, Math.min(100, baseHsl.s + i));
        const l = Math.max(20, Math.min(80, baseHsl.l + j));
        const rgbVar = hslToRgb(h, s, l);
        colors.push(rgbToHex(rgbVar.r, rgbVar.g, rgbVar.b));
      }
    }
  }
  
  return colors;
}

function createMixedPalette(baseHsl: { h: number, s: number, l: number }): string[] {
  const colors = [];
  
  // Random selection of high-contrast options
  const hueOffsets = [45, 90, 135, 180, 225, 270, 315];
  
  for (const offset of hueOffsets) {
    const h = (baseHsl.h + offset) % 360;
    
    // Try different saturation/lightness combinations to find good contrast
    for (const l of [25, 50, 75]) {
      if (Math.abs(l - baseHsl.l) < 10) continue; // Skip too similar lightness
      
      for (const s of [50, 75, 90]) {
        const rgb = hslToRgb(h, s, l);
        colors.push(rgbToHex(rgb.r, rgb.g, rgb.b));
      }
    }
  }
  
  return colors;
}

function hslToHexString(h: number, s: number, l: number): string {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

function determineColorName(baseHsl: { h: number, s: number, l: number }, colorHsl: { h: number, s: number, l: number }, harmonyType: ColorHarmony): string {
  const hueDiff = Math.abs(colorHsl.h - baseHsl.h);
  
  // Special case for monochromatic harmony
  if (harmonyType === 'monochromatic') {
    if (colorHsl.l > baseHsl.l + 15) return 'Lighter';
    if (colorHsl.l < baseHsl.l - 15) return 'Darker';
    if (colorHsl.s > baseHsl.s + 15) return 'More Saturated';
    if (colorHsl.s < baseHsl.s - 15) return 'Less Saturated';
    return 'Monochromatic';
  }
  
  // For other harmonies
  if (hueDiff < 30 || hueDiff > 330) return 'Analogous';
  if (hueDiff > 150 && hueDiff < 210) return 'Complementary';
  if ((hueDiff > 90 && hueDiff < 150) || (hueDiff > 210 && hueDiff < 270)) return 'Split Complementary';
  if (Math.abs(hueDiff - 120) < 30 || Math.abs(hueDiff - 240) < 30) return 'Triadic';
  if (Math.abs(hueDiff - 90) < 30 || Math.abs(hueDiff - 270) < 30) return 'Square/Tetradic';
  
  return 'Accent';
}

export function WCAGColorPalette() {
  const [baseColor, setBaseColor] = useState('#1a365d'); // Dark blue default
  const [colorHarmony, setColorHarmony] = useState<ColorHarmony>('all');
  const [generatedPalette, setGeneratedPalette] = useState<ColorCombination[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [copiedColor, setCopiedColor] = useState('');
  const isGeneratingRef = useRef(false);
  const paletteRef = useRef<HTMLDivElement>(null);
  
  // Create a persistent style for PRO feature pills
  const proPillStyle = "ml-1 text-xs px-1.5 py-0.5 bg-gradient-to-r from-amber-500 to-amber-300 text-white rounded-full uppercase tracking-wide font-bold";
  
  // Initialize palette
  useEffect(() => {
    const newPalette = generateAccessiblePalette(baseColor, colorHarmony);
    setGeneratedPalette(newPalette);
  }, []);
  
  // Update ref when state changes
  useEffect(() => {
    isGeneratingRef.current = isGenerating;
  }, [isGenerating]);
  
  const handleBaseColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setBaseColor(newColor);
    
    if (!isGeneratingRef.current) {
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
  };
  
  const generateNewPalette = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      try {
        const newPalette = generateAccessiblePalette(baseColor, colorHarmony);
        // Ensure main color is locked
        const updatedPalette = newPalette.map((combo, index) => {
          if (index === 0) {
            return { ...combo, isLocked: true };
          }
          return combo;
        });
        setGeneratedPalette(updatedPalette);
      } catch (error) {
        console.error("Error generating palette:", error);
      } finally {
        setIsGenerating(false);
      }
    }, 300);
  };
  
  const shufflePalette = () => {
    setIsGenerating(true);
    setTimeout(() => {
      // Create a new palette but with truly randomized colors
      try {
        // Get current palette colors
        const currentPalette = [...generatedPalette];
        
        // Create a result array for the shuffled palette
        const result = [...currentPalette];
        
        // For each position (except main color), if unlocked, create a brand new random color
        for (let i = 1; i < result.length; i++) {
          // Skip locked colors
          if (result[i].isLocked) continue;
          
          // Generate a truly random color for this position
          const randomHue = Math.floor(Math.random() * 360);
          const randomSaturation = 70 + Math.floor(Math.random() * 30); // 70-100%
          const randomLightness = 40 + Math.floor(Math.random() * 40); // 40-80%
          
          // Convert to hex
          const randomHex = hslToHexString(randomHue, randomSaturation, randomLightness);
          
          // Create accessible text color
          // Convert the random hex to RGB
          const randomRgb = hexToRgb(randomHex);
          // Get luminance values for the random color and black/white text
          const randomLuminance = getLuminance(randomRgb.r, randomRgb.g, randomRgb.b);
          const blackLuminance = getLuminance(0, 0, 0); // Black is rgb(0,0,0)
          const whiteLuminance = getLuminance(255, 255, 255); // White is rgb(255,255,255)
          
          // Calculate contrast ratios with black and white text
          const blackContrast = getContrastRatio(randomLuminance, blackLuminance);
          const whiteContrast = getContrastRatio(randomLuminance, whiteLuminance);
          
          // Choose the better contrast
          const textColor = blackContrast > whiteContrast ? '#000000' : '#ffffff';
          
          // Calculate WCAG level based on the better contrast
          const contrastRatio = Math.max(blackContrast, whiteContrast);
          let wcagLevel: 'AAA' | 'AA' | 'Fail' = 'Fail';
          if (contrastRatio >= 7) wcagLevel = 'AAA';
          else if (contrastRatio >= 4.5) wcagLevel = 'AA';
          
          // Create relationship name
          let relationshipName = "Random";
          
          // Convert baseColor to HSL using existing functions
          const baseRgb = hexToRgb(baseColor);
          const baseHsl = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b);
          
          if (Math.abs(randomHue - baseHsl.h) < 30 || 
              Math.abs(randomHue - baseHsl.h) > 330) {
            relationshipName = "Analogous";
          } else if (Math.abs(randomHue - baseHsl.h) > 150 &&
                     Math.abs(randomHue - baseHsl.h) < 210) {
            relationshipName = "Complementary";
          } else if (Math.abs(randomHue - baseHsl.h - 120) < 30 ||
                     Math.abs(randomHue - baseHsl.h - 240) < 30) {
            relationshipName = "Triadic";
          }
          
          // Add to result
          result[i] = {
            background: randomHex,
            text: textColor,
            name: relationshipName,
            ratio: contrastRatio,
            wcagLevel: wcagLevel,
            isBaseColor: false,
            isLocked: false
          };
        }
        
        // Set the final palette
        setGeneratedPalette(result);
      } catch (error) {
        console.error("Error in shuffle:", error);
      } finally {
        setIsGenerating(false);
      }
    }, 500);
  };
  
  const toggleLock = (index: number) => {
    if (index === 0) return; // Don't allow toggling the base color
    
    setGeneratedPalette(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], isLocked: !updated[index].isLocked };
      return updated;
    });
  };
  
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };
  
  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(''), 1500);
  };
  
  const clearGenerator = () => {
    setBaseColor('#1a365d');
    setColorHarmony('all');
    const newPalette = generateAccessiblePalette('#1a365d', 'all');
    setGeneratedPalette(newPalette);
  };
  
  const exportToPDF = () => {
    if (!paletteRef.current) return;
    
    const content = paletteRef.current;
    
    html2canvas(content).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.text('WCAG 2.1 Color Palette', 14, 15);
      pdf.text(`Base Color: ${baseColor}`, 14, 22);
      pdf.text(`Generated on ${new Date().toLocaleDateString()}`, 14, pdfHeight - 10);
      
      pdf.save('wcag-color-palette.pdf');
    });
  };
  
  const exportToText = () => {
    let content = 'WCAG 2.1 Color Palette\n';
    content += `Base Color: ${baseColor}\n`;
    content += `Generated on ${new Date().toLocaleDateString()}\n\n`;
    
    generatedPalette.forEach(combo => {
      content += `${combo.background} (${combo.name})\n`;
      content += `Text: ${combo.text}\n`;
      content += `Contrast Ratio: ${combo.ratio.toFixed(2)}:1\n`;
      content += `WCAG Level: ${combo.wcagLevel}\n\n`;
    });
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'color-palette.txt');
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            WCAG Color Palette Generator
          </h2>
          <p className="text-gray-600">
            Generate accessible color combinations that meet WCAG 2.1 and 2.2 contrast requirements.
            Our algorithm creates diverse palettes using multiple color harmonies including complementary, analogous, triadic, 
            monochromatic, tetradic, square, and split-complementary.
          </p>
        </div>

        {isGenerating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <LoadingSpinner size="large" className="mb-4" />
              <p className="text-gray-900 font-medium">Generating Color Palette...</p>
            </div>
          </div>
        )}

        {/* Generator Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200 relative">
          <div className="absolute -top-3 left-4 bg-white px-2">
            <span className="text-xs font-medium text-primary-600 uppercase tracking-wider">Palette Generator</span>
          </div>

          {/* Top row with color picker, generate button, shuffle and export */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {/* Color picker and input */}
            <div className="flex items-center">
              <input
                type="color"
                value={baseColor}
                onChange={handleBaseColorChange}
                className="h-10 w-10 rounded-md border border-gray-300 cursor-pointer"
                aria-label="Select base color"
              />
              <div className="relative ml-2 flex">
                <input
                  type="text"
                  value={baseColor}
                  onChange={handleBaseColorChange}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="#HEX"
                />
                <button
                  onClick={() => handleBaseColorChange({ target: { value: '#1a365d' } } as React.ChangeEvent<HTMLInputElement>)}
                  className="px-3 py-2 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-700 text-xs hover:bg-gray-100"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={generateNewPalette}
                disabled={isGenerating}
                aria-label="Generate new palette"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                Generate New
              </button>
              
              <button
                onClick={shufflePalette}
                disabled={isGenerating}
                aria-label="Shuffle colors"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Shuffle className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                Shuffle
              </button>

              <button
                onClick={exportToText}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <FileText className="w-5 h-5 mr-2" />
                Export as Text
                <span className={proPillStyle}>PRO</span>
              </button>
              <button
                onClick={exportToPDF}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <FileDown className="w-5 h-5 mr-2" />
                Export as PDF
                <span className={proPillStyle}>PRO</span>
              </button>
            </div>
          </div>
          
          {/* Color harmony buttons */}
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

        {/* Generated Palette */}
        {generatedPalette.length > 0 && (
          <div className="border-2 border-dashed border-secondary-100 rounded-lg p-6 mb-8 bg-white shadow-md relative">
            <div className="absolute -top-3 left-4 bg-white px-2">
              <span className="text-xs font-medium text-secondary-600 uppercase tracking-wider">Generated Palette</span>
            </div>
            
            <div className="flex justify-between items-center gap-4 mb-6">
              {/* Left side - Control buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleDarkMode}
                  aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={shufflePalette}
                  disabled={isGenerating}
                  aria-label="Shuffle colors"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Shuffle className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                  Shuffle
                </button>
              </div>
              
              {/* Right side - Export buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={exportToText}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Export as Text
                  <span className={proPillStyle}>PRO</span>
                </button>
                <button
                  onClick={exportToPDF}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <FileDown className="w-5 h-5 mr-2" />
                  Export as PDF
                  <span className={proPillStyle}>PRO</span>
                </button>
              </div>
            </div>
            
            <div ref={paletteRef}>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {generatedPalette.map((combo, index) => {
                  // If main color, takes column 1 and spans 2 rows
                  // If not main, takes normal position in grid
                  return (
                    <div
                      key={`${combo.background}-${combo.text}-${index}`}
                      className={`rounded-lg overflow-hidden ${
                        combo.isBaseColor 
                          ? 'md:col-start-1 md:row-span-2' 
                          : ''
                      }`}
                    >
                      <div
                        style={{ backgroundColor: combo.background }}
                        className={`h-full rounded-lg overflow-hidden ${
                          combo.isBaseColor ? 'min-h-[380px]' : 'min-h-[180px]'
                        }`}
                      >
                        <div className="p-4 flex flex-col h-full">
                          {/* Top section with MAIN tag and buttons */}
                          <div className="flex justify-between items-center mb-4">
                            {combo.isBaseColor && (
                              <span 
                                className="text-xs font-bold px-2 py-0.5 rounded" 
                                style={{ 
                                  color: combo.text,
                                  backgroundColor: 'rgba(255, 255, 255, 0.3)'
                                }}
                              >
                                MAIN
                              </span>
                            )}
                            {!combo.isBaseColor && <div></div>}
                            
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => copyToClipboard(combo.background)}
                                className="p-2 rounded-full hover:bg-white hover:bg-opacity-10"
                                style={{ color: combo.text }}
                                aria-label="Copy color hex code"
                              >
                                {copiedColor === combo.background ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                              </button>
                              <button
                                onClick={() => toggleLock(index)}
                                className={`p-2 rounded-full ${
                                  combo.isLocked 
                                    ? 'bg-white bg-opacity-20' 
                                    : 'opacity-70 hover:opacity-100'
                                } ${
                                  index === 0 
                                    ? 'cursor-default' // Main color - not clickable
                                    : ''
                                }`}
                                style={{ color: combo.text }}
                                aria-label={
                                  index === 0 
                                    ? "Main color is always locked" 
                                    : (combo.isLocked ? "Unlock this color" : "Lock this color")
                                }
                                disabled={index === 0} // Disable the button for main color
                              >
                                {combo.isLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>
                          
                          {/* Name moved down a couple rows */}
                          <div className="mt-6 mb-6">
                            <h3 className="font-medium text-base" style={{ color: combo.text }}>
                              {findClosestNamedColor(combo.background)}
                            </h3>
                          </div>
                          
                          {/* Empty space in the middle */}
                          <div className="flex-grow"></div>
                          
                          {/* Hex code display moved closer to bottom */}
                          <div className="mb-4">
                            <span className="text-lg font-bold" style={{ color: combo.text }}>
                              {combo.background.toUpperCase()}
                            </span>
                          </div>
                          
                          {/* Bottom section with WCAG tag and ratio */}
                          <div className="flex items-center justify-between">
                            <span
                              className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium"
                              style={{ 
                                backgroundColor: 'rgba(0, 230, 118, 0.2)',
                                color: 'rgba(255, 255, 255, 0.9)',
                                border: '1px solid rgba(0, 230, 118, 0.4)'
                              }}
                            >
                              {combo.wcagLevel}
                            </span>
                            <span className="text-sm font-medium" style={{ color: combo.text }}>
                              {combo.ratio.toFixed(2)}:1
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Usage Guidelines */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            WCAG Color Usage Guidelines
          </h3>
          
          <p className="text-gray-700 mb-6">
            Proper color usage is crucial for accessibility. About 1 in 12 men and 1 in 200 women have some form of color vision deficiency, 
            and many users have low vision or situational limitations like bright sunlight. Following WCAG guidelines ensures your content is 
            accessible to all users regardless of their visual capabilities.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Contrast Requirements (WCAG 2.1 & 2.2)</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>AAA level (Enhanced): 7:1 contrast ratio for normal text</li>
                <li>AA level (Minimum): 4.5:1 contrast ratio for normal text</li>
                <li>Large text (18pt+ or 14pt+ bold): 3:1 for AA, 4.5:1 for AAA</li>
                <li>UI components and graphical objects: minimum 3:1 against adjacent colors</li>
                <li>Focus indicators: minimum 3:1 contrast (WCAG 2.2, SC 2.4.11)</li>
                <li>Target size: minimum 24x24 pixels (WCAG 2.2, SC 2.5.8)</li>
                <li>Dragging movement: alternatives required (WCAG 2.2, SC 2.5.7)</li>
              </ul>
              
              <h4 className="font-medium text-gray-900 mt-6 mb-3">Why Contrast Matters</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Improves readability for all users, especially in poor lighting</li>
                <li>Essential for people with low vision or color blindness</li>
                <li>Helps maintain usability when screens are viewed outdoors</li>
                <li>Can reduce eye strain during prolonged usage</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Beyond Contrast: Color Best Practices</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Never use color as the only means to convey information (WCAG 1.4.1)</li>
                <li>Provide additional indicators like icons, patterns, or text labels</li>
                <li>Test your palette with color blindness simulators</li>
                <li>Consider how your colors appear in high contrast modes</li>
                <li>Maintain consistent color meaning throughout your interface</li>
                <li>Limit your palette to 3-5 primary colors for better cohesion</li>
              </ul>
              
              <h4 className="font-medium text-gray-900 mt-6 mb-3">Implementation Tips</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Use the generated palettes for complementary elements</li>
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
    </div>
  );
}