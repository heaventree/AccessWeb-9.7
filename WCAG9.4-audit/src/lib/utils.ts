import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

/**
 * A utility function to conditionally join Tailwind CSS classes together
 * 
 * @param inputs The class or classes to conditionally join
 * @returns A string of joined classes
 */
export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}