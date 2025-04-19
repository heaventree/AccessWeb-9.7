/**
 * Error Boundaries Module
 * 
 * Exports all error boundary components for easy imports
 * throughout the application.
 */

export { default as ErrorBoundary } from './ErrorBoundary';
export { default as GlobalErrorBoundary } from './GlobalErrorBoundary';
export { default as RouteErrorBoundary } from './RouteErrorBoundary';
export { default as FeatureErrorBoundary } from './FeatureErrorBoundary';
export { default as ErrorFallback } from './ErrorFallback';

// Also export types
export type { ErrorBoundaryProps, ErrorBoundaryState, ErrorType } from './ErrorBoundary';