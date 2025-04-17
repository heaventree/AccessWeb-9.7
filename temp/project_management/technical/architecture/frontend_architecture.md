# Frontend Architecture

**Current Version:** 1.0  
**Last Updated:** April 15, 2024  
**Status:** Production  

## Overview

This document outlines the frontend architecture of the WCAG Accessibility Audit Tool. The frontend is built using React with TypeScript and a modern development stack focused on performance, accessibility, and maintainability.

## Technology Stack

### Core Technologies

- **React 18+**: Component-based UI library with Hooks and Suspense
- **TypeScript**: Strongly-typed JavaScript for improved developer experience
- **Vite**: Fast, modern build tool with HMR and optimized production builds
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **React Router**: Declarative routing with nested routes
- **TanStack React Query**: Data fetching, caching, and state management
- **Zustand**: Lightweight global state management

### UI Components and Visualization

- **Framer Motion**: Animation library for interactive UI elements
- **Recharts**: Responsive charting library for data visualization
- **Tailwind Merge**: Utility for managing Tailwind class conflicts
- **React Markdown**: Markdown rendering for content
- **React Icons**: Comprehensive icon library
- **HeroIcons**: Additional icon set for consistent design

### Developer Tools

- **TypeScript ESLint**: Code quality and style enforcement
- **Vitest**: Fast unit testing framework
- **Cypress**: End-to-end testing framework
- **Storybook**: Component documentation and visual testing
- **PostCSS**: CSS processing for Tailwind and other plugins

## Architecture Patterns

The frontend follows these architectural patterns:

### 1. Component Architecture

- **Atomic Design Methodology**: Building UI from atoms to organisms to templates
- **Compound Components**: Complex components composed of smaller, specialized parts
- **Composition over Inheritance**: Using component composition for reusability
- **Render Props & HOCs**: Sharing functionality between components

### 2. State Management

- **Local Component State**: useState/useReducer for component-specific state
- **React Query**: For server state and data fetching
- **Zustand**: For global UI state that needs to be shared
- **Context API**: For theme, authentication, and feature flags

### 3. Code Organization

```
src/
├── assets/            # Static assets (images, fonts)
├── components/        # Shared UI components
│   ├── common/        # Reusable UI components
│   ├── layout/        # Layout components
│   ├── forms/         # Form components
│   └── features/      # Feature-specific components
├── hooks/             # Custom React hooks
├── lib/               # Utilities and helper functions
│   ├── api/           # API clients and services
│   ├── integrations/  # External integration code
│   └── utils/         # Utility functions
├── data/              # Data constants and mock data
├── pages/             # Page components
├── routes/            # Route definitions
├── services/          # Business logic services
├── stores/            # Zustand stores
├── styles/            # Global styles and Tailwind config
└── types/             # TypeScript type definitions
```

## Key Design Patterns

### 1. Component Patterns

- **Compound Components**: For complex interactive components
  ```jsx
  <Tabs>
    <Tabs.List>
      <Tabs.Tab>General</Tabs.Tab>
      <Tabs.Tab>Advanced</Tabs.Tab>
    </Tabs.List>
    <Tabs.Content tabId="general">...</Tabs.Content>
    <Tabs.Content tabId="advanced">...</Tabs.Content>
  </Tabs>
  ```

- **Controlled Components**: For forms and user inputs
  ```jsx
  <Input
    value={value}
    onChange={handleChange}
    label="Email"
    error={errors.email}
  />
  ```

- **Render Props**: For sharing component logic
  ```jsx
  <AccessibilityCheck url={url}>
    {(results) => (
      <ResultsDisplay data={results} />
    )}
  </AccessibilityCheck>
  ```

### 2. Data Fetching Pattern

- **React Query with Service Layer**:
  ```jsx
  // Service
  export const getAccessibilityResults = async (url) => {
    const response = await api.get(`/scan?url=${encodeURIComponent(url)}`);
    return response.data;
  };

  // Hook
  export const useAccessibilityResults = (url) => {
    return useQuery(['accessibility', url], () => getAccessibilityResults(url));
  };

  // Component
  const { data, isLoading, error } = useAccessibilityResults(url);
  ```

### 3. Component Composition

- **Component Composition with TypeScript**:
  ```tsx
  type ButtonProps = {
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>;

  const Button = ({ 
    variant = 'primary',
    size = 'md',
    isLoading = false,
    children,
    ...props 
  }: ButtonProps) => {
    // Implementation
  };
  ```

## Accessibility Implementation

### 1. Component Accessibility

- **ARIA Integration**: All components include proper ARIA attributes
  ```jsx
  <Button
    aria-pressed={isActive}
    aria-disabled={isDisabled}
    aria-expanded={isExpanded}
  >
    Toggle Menu
  </Button>
  ```

- **Keyboard Navigation**: Focus management and keyboard interactions
  ```jsx
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      toggleOption(option);
    }
  };

  return (
    <div
      role="option"
      tabIndex={0}
      aria-selected={isSelected}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
    >
      {option.label}
    </div>
  );
  ```

- **Focus Management**: Proper focus handling for modals and other interactive elements
  ```jsx
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  }, [isOpen]);
  ```

### 2. Color and Contrast

- **Accessible Color Scheme**: Meeting WCAG 2.2 color contrast requirements
- **Color Variables**: Centralized color definitions with contrast checking
- **Colorblind-Friendly**: Alternative indicators beyond color differences

### 3. Motion and Animation

- **Reduced Motion**: Respecting user preferences for reduced motion
  ```jsx
  const prefersReducedMotion = 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animationVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        duration: prefersReducedMotion ? 0 : 0.3 
      } 
    }
  };
  ```

## Performance Optimization

### 1. Code Splitting and Lazy Loading

- Route-based code splitting
- Component lazy loading for heavy features
- Dynamic imports for utility libraries

### 2. Render Optimization

- Memoization with React.memo
- useMemo and useCallback for expensive calculations
- Virtualization for long lists

### 3. Asset Optimization

- SVG optimization for icons
- WebP image format with fallbacks
- Responsive images with srcset

## Testing Approach

### 1. Component Testing

- Unit tests for component logic
- Visual regression tests in Storybook
- Accessibility testing with jest-axe

### 2. Integration Testing

- Testing component interactions
- API mocking with MSW
- Form validation testing

### 3. End-to-End Testing

- Critical user flows with Cypress
- Accessibility testing in real browser environments
- Cross-browser compatibility testing

## Development Guidelines

### 1. Component Structure

- Each component in its own directory
- Index.ts for exports
- Component, styles, tests, and stories in the same directory

### 2. State Management Rules

- Local state for component-specific data
- React Query for server state
- Zustand for shared UI state
- Context for theme and app-wide settings

### 3. Naming Conventions

- PascalCase for React components
- camelCase for functions, hooks, and variables
- kebab-case for CSS classes and file names
- ALL_CAPS for constants

## Frontend Deployment

The frontend is built with Vite and deployed to:

- Development: Vercel Preview Environments
- Staging: Vercel Staging Environment
- Production: Vercel Production Environment

## Future Architectural Considerations

1. **Server Components**: Evaluating React Server Components for content-heavy pages
2. **Streaming SSR**: For improved initial load performance
3. **Web Workers**: For CPU-intensive tasks like accessibility calculations
4. **PWA Features**: For offline capabilities
5. **WebAssembly**: For high-performance document processing