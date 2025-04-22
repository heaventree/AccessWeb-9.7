/**
 * ACCESS-WEB UI Kit - Style Utility Functions
 * 
 * This file contains utility functions for handling CSS classes and styles.
 */

import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

/**
 * Combines multiple class names and removes duplicates using TailwindCSS
 * @param inputs Array of class values, objects, or arrays
 * @returns Merged class string with duplicates removed
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Creates a variant-based class selector function for components
 * @param variants Record of variant classes
 * @param defaultVariant Default variant to use
 * @returns Function that selects classes based on variant
 */
export function createVariants<T extends Record<string, Record<string, string>>>(
  variants: T,
  defaultVariant: Partial<{
    [K in keyof T]: keyof T[K];
  }> = {},
) {
  return (props: {
    className?: string;
    variant?: {
      [K in keyof T]?: keyof T[K];
    }
  }) => {
    const variantClasses = Object.keys(variants).map((variantType) => {
      const variantTypeKey = variantType as keyof T;
      const variantKey = props.variant?.[variantTypeKey] || defaultVariant[variantTypeKey];
      const variantSelector = variantKey as keyof T[keyof T] | undefined;
      
      if (!variantSelector) return '';
      return variants[variantTypeKey][variantSelector] || '';
    });

    return cn(...variantClasses, props.className || '');
  };
}

/**
 * Helper function to ensure consistent dark mode handling
 * @param lightModeClass - Class to apply in light mode
 * @param darkModeClass - Class to apply in dark mode
 * @returns Combined class string with proper dark mode handling
 */
export function darkMode(lightModeClass: string, darkModeClass: string): string {
  return `${lightModeClass} dark:${darkModeClass}`;
}

/**
 * Helper function for focus ring styles
 * @param color Optional custom color (defaults to primary brand color)
 * @returns Class string for focus rings
 */
export function focusRing(color?: string): string {
  return `focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 focus-visible:ring-${color || 'brand-primary'}`;
}

/**
 * Helper function for state-based class generation
 * @param baseClasses Base classes applied always
 * @param stateClasses Object with conditional classes
 * @returns Merged class string
 */
export function stateClasses(
  baseClasses: string,
  stateClasses: Record<string, { condition: boolean; classes: string }>,
): string {
  const activeStateClasses = Object.values(stateClasses)
    .filter(({ condition }) => condition)
    .map(({ classes }) => classes);
  
  return cn(baseClasses, ...activeStateClasses);
}