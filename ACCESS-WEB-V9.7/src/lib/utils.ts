import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Debounce a function call
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Extract a readable error message from an error object
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

/**
 * Convert HTML to plain text
 */
export function htmlToText(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

/**
 * Extract topics from text using simple keyword extraction
 * (Note: In a real app, use NLP or ML for better extraction)
 */
export function extractTopics(text: string): string[] {
  // Define important accessibility-related keywords
  const keyTopics = [
    'wcag', 'accessibility', 'aria', 'screen reader', 'keyboard', 'contrast',
    'focus', 'alt text', 'semantic', 'color blind', 'navigation', 'landmark',
    'headings', 'form', 'label', 'validation'
  ];
  
  const lowercaseText = text.toLowerCase();
  
  // Find matching topics
  return keyTopics.filter(topic => 
    lowercaseText.includes(topic.toLowerCase())
  );
}