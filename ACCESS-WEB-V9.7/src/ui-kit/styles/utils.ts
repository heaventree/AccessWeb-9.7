/**
 * ACCESS-WEB UI Kit - Style Utilities
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges class names and handles Tailwind conflicts with twMerge
 * 
 * This utility merges multiple class names, similar to clsx/classnames,
 * but also properly handles Tailwind CSS class conflicts.
 * 
 * @example
 * // Returns 'mt-4 text-blue-500' (no conflict resolution needed)
 * cn('mt-4', 'text-blue-500')
 * 
 * @example
 * // Returns 'p-4' (resolves conflict between padding utilities)
 * cn('p-2', 'p-4')
 * 
 * @example
 * // Returns 'mt-4 text-blue-500' (conditional class application)
 * cn('mt-4', isActive && 'text-blue-500')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Creates a conditional class string based on a condition
 * 
 * @example
 * // Returns 'bg-red-500' if isError is true, otherwise returns ''
 * classIf(isError, 'bg-red-500')
 * 
 * @example
 * // Returns 'bg-red-500' if isError is true, otherwise returns 'bg-gray-200'
 * classIf(isError, 'bg-red-500', 'bg-gray-200')
 */
export function classIf(condition: boolean, trueClass: string, falseClass: string = '') {
  return condition ? trueClass : falseClass
}

/**
 * Creates a variant selector for component styling
 * 
 * This allows components to define multiple variant types with their own classes
 * and then merge them all together.
 * 
 * @example
 * const buttonVariants = variantClasses({
 *   variant: {
 *     primary: 'bg-blue-500 text-white',
 *     secondary: 'bg-gray-200 text-gray-800',
 *   },
 *   size: {
 *     sm: 'text-sm py-1 px-2',
 *     md: 'text-base py-2 px-4',
 *     lg: 'text-lg py-3 px-6',
 *   },
 * })
 * 
 * // Use it like this:
 * buttonVariants({ variant: 'primary', size: 'md' })
 * // Returns: 'bg-blue-500 text-white text-base py-2 px-4'
 */
export type VariantOptions<T extends Record<string, Record<string, string>>> = {
  [K in keyof T]?: keyof T[K]
}

export const variantClasses = <T extends Record<string, Record<string, string>>>(
  variants: T
) => {
  return (options: VariantOptions<T> = {}) => {
    const classes: string[] = []
    
    Object.entries(options).forEach(([key, value]) => {
      if (value && variants[key] && variants[key][value as string]) {
        classes.push(variants[key][value as string])
      }
    })
    
    return classes.join(' ')
  }
}

export default {
  cn,
  classIf,
  variantClasses,
}