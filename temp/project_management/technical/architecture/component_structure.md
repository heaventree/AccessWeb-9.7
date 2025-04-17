# Component Structure and Organization

**Current Version:** 1.0  
**Last Updated:** April 15, 2024  
**Status:** Production  

## Overview

This document outlines the component structure and organization for the WCAG Accessibility Audit Tool frontend. It provides guidelines for component development, folder structure, and implementation patterns to ensure consistency and maintainability.

## Component Hierarchy

The WCAG Accessibility Audit Tool follows a hierarchical component organization based on the Atomic Design methodology, with some adaptations for our specific needs:

### 1. Atoms (Base Components)

Atoms are the smallest building blocks of the application, representing single-purpose UI elements.

Examples:
- Button
- Input
- Checkbox
- Icon
- Typography elements (Heading, Paragraph, etc.)
- Badge
- Spinner

### 2. Molecules (Composite Components)

Molecules are combinations of atoms that work together as a cohesive unit.

Examples:
- Form fields (Label + Input + Error message)
- Search bar (Input + Button + Icon)
- Navigation links (Icon + Text + Badge)
- Card headers (Icon + Title + Action buttons)
- Alert boxes (Icon + Message + Close button)

### 3. Organisms (Feature Components)

Organisms are more complex UI components composed of molecules and atoms that form a distinct section of the interface.

Examples:
- Navigation sidebar
- Scan results panel
- WCAG criteria checklist
- WordPress integration form
- Color contrast checker tool
- PDF upload and analysis section

### 4. Templates (Layout Components)

Templates define the overall structure and layout of pages.

Examples:
- Dashboard layout
- Documentation page layout
- Settings page layout
- Authentication page layout
- Results page layout

### 5. Pages (Route Components)

Pages combine templates and organisms to create complete views associated with specific routes.

Examples:
- Home page
- Dashboard page
- Scan results page
- Documentation page
- Settings page
- Profile page

## Component Directory Structure

```
src/
├── components/
│   ├── common/           # Atoms and molecules
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   ├── Button.stories.tsx
│   │   │   └── index.ts
│   │   ├── Input/
│   │   ├── Select/
│   │   └── ...
│   ├── forms/            # Form-related components
│   │   ├── FormField/
│   │   ├── FileUpload/
│   │   ├── ColorPicker/
│   │   └── ...
│   ├── layout/           # Layout and template components
│   │   ├── Header/
│   │   ├── Sidebar/
│   │   ├── Footer/
│   │   ├── PageContainer/
│   │   └── ...
│   ├── data-display/     # Data visualization components
│   │   ├── ResultsTable/
│   │   ├── AccessibilityScore/
│   │   ├── ContrastChecker/
│   │   └── ...
│   ├── feedback/         # User feedback components
│   │   ├── Alert/
│   │   ├── Toast/
│   │   ├── ErrorBoundary/
│   │   └── ...
│   └── features/         # Feature-specific organisms
│       ├── scan/         # Scanning related components
│       ├── wordpress/    # WordPress integration components
│       ├── pdf/          # PDF analysis components
│       └── ...
└── pages/                # Page components
    ├── Dashboard/
    ├── Scan/
    ├── Results/
    ├── Settings/
    └── ...
```

## Component Composition Patterns

### 1. Component File Structure

Each component should be organized in its own directory with consistent file structure:

```
ComponentName/
├── ComponentName.tsx     # Main component implementation
├── ComponentName.test.tsx # Tests for the component
├── ComponentName.css     # Component-specific styles (if not using Tailwind only)
├── ComponentName.stories.tsx # Storybook stories (if applicable)
├── index.ts              # Re-export the component
└── types.ts              # TypeScript types (optional, for complex components)
```

### 2. Component Implementation Pattern

```tsx
// Standard component implementation pattern

import { useState } from 'react';
import cn from 'classnames';
import { ComponentNameProps } from './types';

const ComponentName = ({
  prop1,
  prop2,
  className,
  children,
  ...restProps
}: ComponentNameProps) => {
  // State hooks
  const [state, setState] = useState(initialState);
  
  // Event handlers
  const handleEvent = () => {
    // Implementation
  };
  
  // Computed values
  const computedValue = useMemo(() => {
    // Calculation
    return result;
  }, [dependencies]);
  
  // Component classes
  const componentClasses = cn(
    'base-class',
    {
      'conditional-class': condition,
      'another-class': anotherCondition,
    },
    className
  );
  
  return (
    <div className={componentClasses} {...restProps}>
      {/* Component content */}
    </div>
  );
};

export default ComponentName;
```

### 3. Compound Component Pattern

For complex, multi-part components, we use the compound component pattern:

```tsx
// Primary component definition
const Tabs = ({ children, defaultValue }: TabsProps) => {
  const [value, setValue] = useState(defaultValue);
  
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className="tabs-container">
        {children}
      </div>
    </TabsContext.Provider>
  );
};

// Sub-components
Tabs.List = TabsList;
Tabs.Tab = Tab;
Tabs.Panel = TabPanel;

export default Tabs;

// Usage
<Tabs defaultValue="general">
  <Tabs.List>
    <Tabs.Tab value="general">General</Tabs.Tab>
    <Tabs.Tab value="advanced">Advanced</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="general">General content</Tabs.Panel>
  <Tabs.Panel value="advanced">Advanced content</Tabs.Panel>
</Tabs>
```

## Component Props Guidelines

### 1. Common Props Pattern

All components should support these common props:

```tsx
type CommonProps = {
  className?: string;        // For custom styling
  id?: string;               // For identification and testing
  style?: React.CSSProperties; // For inline styles when needed
  'data-testid'?: string;    // For testing
};

type ComponentProps = {
  // Component-specific props
  specificProp1: string;
  specificProp2?: boolean;
} & CommonProps;
```

### 2. Component Variants and Sizes

Components with variants should follow this pattern:

```tsx
type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isFullWidth?: boolean;
  isLoading?: boolean;
  // Other button props
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ 
  variant = 'primary',
  size = 'md',
  isFullWidth = false,
  isLoading = false,
  className,
  children,
  ...props 
}: ButtonProps) => {
  // Implementation
};
```

## Accessibility Implementation Guidelines

### 1. ARIA Attributes

Components should include appropriate ARIA attributes:

```tsx
// Example: Accessible dropdown
const Dropdown = ({ label, options, value, onChange }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const id = useId();
  
  return (
    <div className="dropdown">
      <button
        id={`${id}-button`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={`${id}-label ${id}-button`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span id={`${id}-label`}>{label}</span>
        <span>{options.find(opt => opt.value === value)?.label}</span>
      </button>
      
      {isOpen && (
        <ul
          role="listbox"
          aria-labelledby={`${id}-label`}
          tabIndex={-1}
        >
          {options.map(option => (
            <li
              key={option.value}
              role="option"
              aria-selected={value === option.value}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

### 2. Keyboard Navigation

Ensure components are fully keyboard accessible:

```tsx
const handleKeyDown = (event: React.KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowDown':
      // Handle down arrow
      event.preventDefault();
      selectNextOption();
      break;
    case 'ArrowUp':
      // Handle up arrow
      event.preventDefault();
      selectPreviousOption();
      break;
    case 'Enter':
    case ' ':
      // Handle selection
      event.preventDefault();
      selectCurrentOption();
      break;
    case 'Escape':
      // Handle escape
      event.preventDefault();
      closeDropdown();
      break;
  }
};
```

### 3. Focus Management

Implement proper focus management, especially for modal dialogs and popups:

```tsx
const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Trap focus inside modal when open
  useEffect(() => {
    if (isOpen) {
      // Store the element that had focus before opening modal
      const previouslyFocused = document.activeElement as HTMLElement;
      
      // Focus the modal
      modalRef.current?.focus();
      
      return () => {
        // Restore focus when modal closes
        previouslyFocused?.focus();
      };
    }
  }, [isOpen]);
  
  // Handle tab key to trap focus
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
    if (event.key === 'Tab') {
      // ... focus trap implementation
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div
      role="dialog"
      aria-modal="true"
      ref={modalRef}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className="modal"
    >
      {children}
    </div>
  );
};
```

## Component Testing Guidelines

Each component should have comprehensive tests:

### 1. Rendering Tests

```tsx
test('renders correctly with default props', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button')).toHaveTextContent('Click me');
  expect(screen.getByRole('button')).toHaveClass('btn-primary');
});

test('renders with custom class name', () => {
  render(<Button className="custom-class">Click me</Button>);
  expect(screen.getByRole('button')).toHaveClass('custom-class');
});
```

### 2. Interaction Tests

```tsx
test('calls onClick when clicked', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  userEvent.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});

test('disables button when isLoading is true', () => {
  render(<Button isLoading>Click me</Button>);
  expect(screen.getByRole('button')).toBeDisabled();
  expect(screen.getByRole('button')).toHaveClass('btn-loading');
});
```

### 3. Accessibility Tests

```tsx
test('meets accessibility requirements', async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('has appropriate ARIA attributes', () => {
  render(<Button aria-pressed="true">Toggle</Button>);
  expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
});
```

## Component Documentation Guidelines

All components should be documented in Storybook:

```tsx
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'Common/Button',
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    isLoading: {
      control: 'boolean',
    },
    isFullWidth: {
      control: 'boolean',
    },
  },
};

export default meta;

export const Primary: StoryObj<typeof Button> = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: StoryObj<typeof Button> = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

// Add more variants, states, and examples
```

## Component Reusability Guidelines

### 1. Composition Over Configuration

Prefer composing components rather than adding configuration props:

```tsx
// Instead of:
<Button 
  icon="download" 
  iconPosition="left" 
  label="Download Report" 
/>

// Prefer:
<Button>
  <DownloadIcon />
  <span>Download Report</span>
</Button>
```

### 2. Render Props for Flexibility

Use render props for components that need to render custom UI:

```tsx
<Dropdown
  renderItem={(item) => (
    <div className="custom-item">
      <img src={item.icon} alt="" />
      <span>{item.label}</span>
      {item.isPremium && <PremiumBadge />}
    </div>
  )}
  options={options}
/>
```

### 3. Component Customization

Allow component customization through className and style props:

```tsx
<Card 
  className="custom-card-class" 
  style={{ maxWidth: '400px' }}
>
  Card content
</Card>
```

## State Management in Components

### 1. Local State

Use useState and useReducer for component-specific state:

```tsx
const [isOpen, setIsOpen] = useState(false);
const [value, setValue] = useState(initialValue);

// For complex state:
const [state, dispatch] = useReducer(reducer, initialState);
```

### 2. Derived State

Use useMemo for derived values:

```tsx
const filteredItems = useMemo(() => {
  return items.filter(item => item.name.includes(searchTerm));
}, [items, searchTerm]);
```

### 3. Side Effects

Use useEffect for side effects:

```tsx
useEffect(() => {
  // Update document title based on component state
  document.title = `${count} items`;
  
  return () => {
    // Cleanup on unmount
    document.title = 'WCAG Accessibility Tool';
  };
}, [count]);
```

## Performance Optimization

### 1. Memoization

Use React.memo for expensive components:

```tsx
const MemoizedComponent = React.memo(Component);

// With custom comparison
const MemoizedComponentWithCustomCompare = React.memo(
  Component,
  (prevProps, nextProps) => {
    return prevProps.value === nextProps.value;
  }
);
```

### 2. Callback Memoization

Use useCallback for event handlers passed to child components:

```tsx
const handleClick = useCallback(() => {
  // Handle click
  console.log('Button clicked', value);
}, [value]);
```

### 3. Avoiding Unnecessary Re-renders

Avoid creating new objects or functions in render:

```tsx
// Bad:
<Button onClick={() => handleClick(id)} style={{ margin: '10px' }} />

// Good:
const onButtonClick = useCallback(() => handleClick(id), [id, handleClick]);
const buttonStyle = useMemo(() => ({ margin: '10px' }), []);

<Button onClick={onButtonClick} style={buttonStyle} />
```

## Conclusion

Following these component design and organization guidelines ensures a consistent, maintainable, and accessible component library for the WCAG Accessibility Audit Tool. These patterns support our goal of creating a tool that not only tests for accessibility but also exemplifies best practices in its own implementation.