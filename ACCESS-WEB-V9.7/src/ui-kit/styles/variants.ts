/**
 * ACCESS-WEB UI Kit - Component Variants
 * 
 * Defines standard styling variants for UI components.
 * Used with the createVariants utility for consistent component styling.
 */

// Button variants
export const buttonVariants = {
  variant: {
    primary: 'bg-gradient-to-r from-[#0fae96] to-teal-500 hover:from-teal-500 hover:to-[#0fae96] text-white shadow-md hover:shadow-lg',
    secondary: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white',
    outline: 'border border-[#0fae96] text-[#0fae96] hover:bg-[#0fae96]/5 dark:hover:bg-[#0fae96]/10',
    ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
    link: 'text-[#0fae96] hover:underline underline-offset-4 p-0 h-auto',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  },
  size: {
    xs: 'text-xs px-2 py-1 rounded-md',
    sm: 'text-sm px-3 py-1.5 rounded-lg',
    md: 'text-sm px-4 py-2 rounded-lg',
    lg: 'text-base px-5 py-2.5 rounded-lg',
    xl: 'text-lg px-6 py-3 rounded-xl',
  },
  shape: {
    default: '',
    square: 'rounded-none',
    pill: 'rounded-full',
  },
};

// Card variants
export const cardVariants = {
  variant: {
    // Main card types
    primary: 'bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700',
    secondary: 'bg-gray-50 dark:bg-gray-900 shadow-sm rounded-xl border border-gray-100 dark:border-gray-800',
    outline: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl',
    elevated: 'bg-white dark:bg-gray-800 shadow-md rounded-xl',
    flat: 'bg-white dark:bg-gray-800 rounded-xl',
    
    // Feature cards (landing page)
    feature: 'bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-200 rounded-xl overflow-hidden',
    
    // Information cards
    info: 'bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 rounded-xl',
    success: 'bg-green-50 dark:bg-green-900/30 text-green-900 dark:text-green-100 rounded-xl',
    warning: 'bg-amber-50 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100 rounded-xl',
    error: 'bg-red-50 dark:bg-red-900/30 text-red-900 dark:text-red-100 rounded-xl',
  },
  size: {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  },
};

// Input variants
export const inputVariants = {
  variant: {
    default: 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400',
    filled: 'border border-transparent bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:bg-white dark:focus:bg-gray-700 text-gray-900 dark:text-white',
    flushed: 'border-b border-gray-300 dark:border-gray-600 rounded-none px-0 bg-transparent',
    outline: 'bg-transparent border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white',
  },
  size: {
    sm: 'h-8 text-sm px-3 py-1 rounded-md',
    md: 'h-10 text-base px-4 py-2 rounded-lg',
    lg: 'h-12 text-lg px-4 py-2 rounded-lg',
  },
  state: {
    default: '',
    error: 'border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400',
    success: 'border-green-500 dark:border-green-400 focus:ring-green-500 dark:focus:ring-green-400',
  },
  shape: {
    default: '',
    rounded: 'rounded-lg',
    pill: 'rounded-full',
  },
};

// Badge variants
export const badgeVariants = {
  variant: {
    default: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
    primary: 'bg-[#0fae96] text-white',
    secondary: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200',
    outline: 'border border-[#0fae96] text-[#0fae96] bg-transparent',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
    warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200',
    error: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
    info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
  },
  size: {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1',
  },
  shape: {
    default: 'rounded-md',
    square: 'rounded-none',
    pill: 'rounded-full',
  },
};

// Container variants
export const containerVariants = {
  size: {
    sm: 'max-w-screen-sm mx-auto px-4',
    md: 'max-w-screen-md mx-auto px-4 md:px-6',
    lg: 'max-w-screen-lg mx-auto px-4 md:px-6',
    xl: 'max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8',
    '2xl': 'max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8',
    full: 'w-full px-4 md:px-6 lg:px-8',
  },
  variant: {
    default: 'mx-auto',
    fluid: 'w-full',
    narrow: 'mx-auto max-w-3xl',
    wide: 'mx-auto max-w-7xl',
  },
};