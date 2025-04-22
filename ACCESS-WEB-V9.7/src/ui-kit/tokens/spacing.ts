/**
 * ACCESS-WEB UI Kit - Spacing Tokens
 * 
 * These are the official spacing tokens for the UI Kit.
 * Use these values for consistent spacing throughout the application.
 */

export const spacing = {
  // Base spacing units (in pixels, converted to rem)
  px: '1px',
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
  
  // Named spacing values (for semantic usage)
  spacing: {
    // Component spacing
    component: {
      xs: '0.25rem',   // 4px
      sm: '0.5rem',    // 8px
      md: '1rem',      // 16px
      lg: '1.5rem',    // 24px
      xl: '2rem',      // 32px
      '2xl': '3rem',   // 48px
    },
    
    // Section spacing
    section: {
      xs: '1.5rem',    // 24px
      sm: '2rem',      // 32px
      md: '3rem',      // 48px
      lg: '4rem',      // 64px
      xl: '6rem',      // 96px
      '2xl': '8rem',   // 128px
    },
    
    // Page spacing
    page: {
      xs: '3rem',      // 48px
      sm: '4rem',      // 64px
      md: '6rem',      // 96px
      lg: '8rem',      // 128px
      xl: '12rem',     // 192px
    },
    
    // Content spacing
    content: {
      xs: '0.5rem',    // 8px
      sm: '0.75rem',   // 12px
      md: '1rem',      // 16px
      lg: '1.5rem',    // 24px
      xl: '2rem',      // 32px
    },
    
    // Form element spacing
    form: {
      element: '1rem',         // 16px (spacing between form elements)
      group: '1.5rem',         // 24px (spacing between form groups)
      label: '0.375rem',       // 6px (spacing between label and input)
      help: '0.375rem',        // 6px (spacing between input and help text)
      icon: '0.5rem',          // 8px (spacing between input and icon)
      inlineElements: '0.5rem', // 8px (spacing between inline form elements)
    },
  },
  
  // Container width constraints
  container: {
    xs: '20rem',      // 320px
    sm: '24rem',      // 384px
    md: '28rem',      // 448px
    lg: '32rem',      // 512px
    xl: '36rem',      // 576px
    '2xl': '42rem',   // 672px
    '3xl': '48rem',   // 768px
    '4xl': '56rem',   // 896px
    '5xl': '64rem',   // 1024px
    '6xl': '72rem',   // 1152px
    '7xl': '80rem',   // 1280px
    full: '100%',
  },
  
  // Screen breakpoints (these should match Tailwind's breakpoints)
  screens: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

export default spacing;