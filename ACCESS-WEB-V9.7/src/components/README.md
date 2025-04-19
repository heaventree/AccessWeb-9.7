# Component Guidelines

This document outlines the standardized approach for creating and maintaining components in the ACCESS-WEB-V9.7 project.

## Component Structure

Each component should follow this standard structure:

```
ComponentName/
├── index.tsx           # Main component file
├── ComponentName.tsx   # (Alternative) Main component implementation
├── ComponentName.test.tsx  # Component tests
├── styles.ts           # Component-specific styles
├── types.ts            # Component-specific types
├── hooks/              # Component-specific hooks
│   └── useComponentLogic.ts
├── utils/              # Component-specific utilities  
│   └── helperFunctions.ts
└── components/         # Sub-components used only by this component
    └── SubComponent.tsx
```

## Component Implementation Standards

### 1. File Organization

- Use **PascalCase** for component files and directories
- Keep each component in its own directory
- Place component-specific utilities in a `utils` subdirectory
- Place component-specific hooks in a `hooks` subdirectory

### 2. Component Structure

```tsx
// ComponentName/index.tsx or ComponentName/ComponentName.tsx
import React from 'react';
import { useComponentLogic } from './hooks/useComponentLogic';
import { helperFunction } from './utils/helperFunctions';
import { ComponentProps } from './types';
import { StyledComponent } from './styles';

/**
 * ComponentName - [Brief description of what the component does]
 * 
 * @example
 * <ComponentName prop1="value" prop2={123} />
 */
export const ComponentName: React.FC<ComponentProps> = ({
  prop1,
  prop2,
  children,
  ...rest
}) => {
  // Component logic or custom hook
  const { state, handlers } = useComponentLogic(prop1, prop2);
  
  // Helper functions
  const processedValue = helperFunction(state.someValue);
  
  return (
    <StyledComponent {...rest}>
      {/* Component content */}
      <div className="component-content">
        {processedValue}
        {children}
      </div>
    </StyledComponent>
  );
};

// Default export
export default ComponentName;
```

### 3. Types

```tsx
// ComponentName/types.ts
import { ReactNode } from 'react';

export interface ComponentProps {
  /** Description of prop1 */
  prop1: string;
  
  /** Description of prop2 */
  prop2: number;
  
  /** Optional prop with default value */
  optionalProp?: boolean;
  
  /** Children elements */
  children?: ReactNode;
  
  /** Any other props */
  [key: string]: any;
}

export interface ComponentState {
  someValue: string;
  loading: boolean;
  error: Error | null;
}
```

### 4. Styles

```tsx
// ComponentName/styles.ts
import styled from 'styled-components';

export const StyledComponent = styled.div`
  /* Component-specific styles */
  display: flex;
  flex-direction: column;
  padding: 1rem;
  
  .component-content {
    /* Content styles */
  }
`;
```

### 5. Custom Hooks

```tsx
// ComponentName/hooks/useComponentLogic.ts
import { useState, useEffect } from 'react';
import { ComponentState } from '../types';

export const useComponentLogic = (prop1: string, prop2: number) => {
  const [state, setState] = useState<ComponentState>({
    someValue: '',
    loading: false,
    error: null
  });
  
  const handleSomeAction = () => {
    // Action logic
  };
  
  useEffect(() => {
    // Effect logic
  }, [prop1, prop2]);
  
  return {
    state,
    handlers: {
      handleSomeAction
    }
  };
};
```

### 6. Tests

```tsx
// ComponentName/ComponentName.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('renders correctly with required props', () => {
    render(<ComponentName prop1="test" prop2={123} />);
    
    // Assertions
    expect(screen.getByText(/test content/i)).toBeInTheDocument();
  });
  
  it('handles user interactions', () => {
    render(<ComponentName prop1="test" prop2={123} />);
    
    // Simulate user interaction
    fireEvent.click(screen.getByRole('button'));
    
    // Assertions after interaction
    expect(screen.getByText(/clicked/i)).toBeInTheDocument();
  });
  
  it('passes accessibility testing', async () => {
    const { container } = render(<ComponentName prop1="test" prop2={123} />);
    
    // Accessibility testing
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

## Component Best Practices

### Accessibility

- Always include proper ARIA attributes
- Ensure keyboard navigation works
- Test with screen readers
- Maintain appropriate color contrast
- Include alt text for images
- Use semantic HTML elements

### Performance

- Memoize expensive calculations
- Use React.memo for pure components
- Optimize re-renders with useMemo and useCallback
- Lazy load components when appropriate
- Minimize state updates

### Error Handling

- Include error boundaries
- Provide fallback UI for error states
- Handle loading states appropriately
- Validate props with PropTypes or TypeScript

### Documentation

- Include JSDoc comments for the component and its props
- Add usage examples
- Document any side effects
- Note any dependencies on global state or context

## Component Review Checklist

Before submitting a component for review, ensure:

- [ ] Component follows the standard structure
- [ ] All props are properly typed and documented
- [ ] Component is accessible (passes WCAG AA standards)
- [ ] Tests are included and passing
- [ ] Component handles all states (loading, error, empty, filled)
- [ ] Code is properly formatted and linted
- [ ] Documentation is complete
- [ ] No console errors or warnings are produced
- [ ] Performance considerations are addressed