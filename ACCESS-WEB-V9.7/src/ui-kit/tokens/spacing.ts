/**
 * ACCESS-WEB UI Kit - Spacing Tokens
 * 
 * This is the single source of truth for all spacing values used in the application.
 * Always reference these tokens instead of hardcoding values in components.
 */

export const spacing = {
  // Base unit in pixels - all other values are multiples of this
  base: 4,

  // Standard spacing values (in pixels)
  none: '0px',
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '96px',
  '5xl': '128px',

  // Component-specific spacing
  container: {
    padding: {
      sm: '16px',
      md: '24px',
      lg: '32px',
    },
    maxWidth: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    }
  },

  // Section spacing
  section: {
    small: '40px',
    medium: '80px',
    large: '120px',
  },

  // Card padding
  card: {
    padding: {
      sm: '12px',
      md: '16px',
      lg: '24px',
    },
  },
};

/**
 * Get spacing value by scale 
 * @param scale spacing size (0-20)
 * @returns spacing value in pixels
 */
export function getSpacing(scale: number): string {
  return `${scale * spacing.base}px`;
}