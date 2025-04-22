/**
 * ACCESS-WEB UI Kit - Color Tokens
 * 
 * This is the single source of truth for all color values used in the application.
 * Always reference these tokens instead of hardcoding colors in components.
 */

export const colors = {
  // Brand Colors
  brand: {
    primary: '#0fae96',  // Main teal color
    primaryLight: '#5eead4',
    primaryDark: '#0e8a76',
    secondary: '#6366f1', // Indigo
    accent: '#f59e0b',    // Amber
  },

  // UI States
  state: {
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  },

  // Gray Scale (Light Mode)
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Text Colors
  text: {
    light: {
      primary: '#111827',
      secondary: '#4b5563',
      tertiary: '#6b7280',
      disabled: '#9ca3af',
      inverse: '#ffffff',
    },
    dark: {
      primary: '#ffffff',
      secondary: '#e5e7eb',
      tertiary: '#9ca3af',
      disabled: '#6b7280',
      inverse: '#111827',
    },
  },

  // Background Colors
  background: {
    light: {
      primary: '#ffffff',
      secondary: '#f9fafb',
      tertiary: '#f3f4f6',
      elevated: '#ffffff',
    },
    dark: {
      primary: '#111827',
      secondary: '#1f2937',
      tertiary: '#374151',
      elevated: '#1f2937',
    },
  },

  // Border Colors
  border: {
    light: {
      primary: '#e5e7eb',
      secondary: '#d1d5db',
      focus: '#5eead4',
    },
    dark: {
      primary: '#4b5563',
      secondary: '#374151',
      focus: '#0fae96',
    },
  }
};

/**
 * Helper function to get a color value based on the current theme
 */
export function getThemeColor(
  colorKey: keyof typeof colors.text | keyof typeof colors.background | keyof typeof colors.border,
  variant: 'primary' | 'secondary' | 'tertiary' | 'elevated' | 'focus' | 'inverse' | 'disabled',
  theme: 'light' | 'dark'
): string {
  const colorObj = colors[colorKey as keyof typeof colors];
  if (!colorObj) return '';
  
  const themeObj = colorObj[theme as keyof typeof colorObj];
  if (!themeObj) return '';
  
  return themeObj[variant as keyof typeof themeObj] || '';
}