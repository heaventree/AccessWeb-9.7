/**
 * ACCESS-WEB UI Kit - Typography Tokens
 * 
 * This is the single source of truth for all typography values used in the application.
 * Always reference these tokens instead of hardcoding values in components.
 */

export const typography = {
  // Font families
  fontFamily: {
    sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },

  // Font sizes (in pixels)
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
    '6xl': '60px',
  },

  // Font weights
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },

  // Line heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // Text transforms
  textTransform: {
    uppercase: 'uppercase',
    lowercase: 'lowercase',
    capitalize: 'capitalize',
    normal: 'none',
  },

  // Text decorations
  textDecoration: {
    underline: 'underline',
    lineThrough: 'line-through',
    none: 'none',
  },

  // Predefined text styles
  textStyle: {
    // Headings
    h1: {
      fontSize: '36px',
      fontWeight: '700',
      lineHeight: '1.2',
      letterSpacing: '-0.025em',
      marginBottom: '24px',
    },
    h2: {
      fontSize: '30px',
      fontWeight: '700',
      lineHeight: '1.3',
      letterSpacing: '-0.025em',
      marginBottom: '20px',
    },
    h3: {
      fontSize: '24px',
      fontWeight: '600',
      lineHeight: '1.3',
      letterSpacing: '-0.015em',
      marginBottom: '16px',
    },
    h4: {
      fontSize: '20px',
      fontWeight: '600',
      lineHeight: '1.4',
      letterSpacing: '-0.01em',
      marginBottom: '12px',
    },
    h5: {
      fontSize: '18px',
      fontWeight: '600',
      lineHeight: '1.4',
      letterSpacing: 'normal',
      marginBottom: '8px',
    },
    h6: {
      fontSize: '16px',
      fontWeight: '600',
      lineHeight: '1.5',
      letterSpacing: 'normal',
      marginBottom: '8px',
    },

    // Body text
    bodyLarge: {
      fontSize: '18px',
      fontWeight: '400',
      lineHeight: '1.6',
      letterSpacing: 'normal',
    },
    bodyDefault: {
      fontSize: '16px',
      fontWeight: '400',
      lineHeight: '1.6',
      letterSpacing: 'normal',
    },
    bodySmall: {
      fontSize: '14px',
      fontWeight: '400',
      lineHeight: '1.5',
      letterSpacing: 'normal',
    },
    caption: {
      fontSize: '12px',
      fontWeight: '400',
      lineHeight: '1.5',
      letterSpacing: '0.01em',
    },

    // Special cases
    button: {
      fontSize: '16px',
      fontWeight: '600',
      lineHeight: '1.5',
      letterSpacing: '0.01em',
    },
    label: {
      fontSize: '14px',
      fontWeight: '500',
      lineHeight: '1.4',
      letterSpacing: '0.01em',
    },
    code: {
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      fontSize: '14px',
      fontWeight: '400',
      lineHeight: '1.7',
      letterSpacing: 'normal',
    },
  },
};