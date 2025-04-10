// Main components
export { default as SimpleFeedbackSystem } from './components/SimpleFeedbackSystem';
export { default as FeedbackMarker } from './components/feedback/FeedbackMarker';

// Admin pages
export { default as AdminDebug } from './pages/admin/AdminDebug';
export { default as AdminRoadmap } from './pages/admin/AdminRoadmap';
export { default as CompletionDashboard } from './pages/admin/CompletionDashboard';

// UI components
export * from './components/ui';

// Types
export * from './types/feedback';

// Hooks
export * from './hooks/useFeedbackSystem';

// Utilities
export * from './utils/elementFinder';

// Data models & functions
export * from './data/debugData';
export * from './data/roadmapData';