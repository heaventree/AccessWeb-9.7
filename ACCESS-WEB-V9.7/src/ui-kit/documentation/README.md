# AccessWeb UI Kit

## Overview

The AccessWeb UI Kit is a comprehensive design system that serves as the single source of truth for all UI components, styles, and design patterns in the AccessWeb application. It ensures consistency, reduces duplication, and makes it easier for developers to implement UI elements that are both visually appealing and accessible.

## Goals

- Provide a **single source of truth** for all styling and UI patterns
- Ensure consistent styling across the entire application
- Make dark mode and accessibility features effortless to implement
- Reduce code duplication and maintenance overhead
- Provide clear, well-documented components for any developer to use

## Structure

The UI Kit is organized into the following directories:

```
src/ui-kit/
├── components/     # UI components
├── styles/         # Style utilities and variants
├── tokens/         # Design tokens (colors, spacing, typography)
├── layouts/        # Page layouts and patterns
├── documentation/  # Usage documentation and examples
└── index.ts        # Main entry point
```

## Usage Guidelines

### Importing Components

Always import components from the main UI Kit entry point:

```tsx
// Good
import { Card, Button } from '../ui-kit';

// Avoid 
import { Card } from '../ui-kit/components/Card';
import { Button } from '../ui-kit/components/Button';
```

### Design Tokens

Use design tokens for all visual properties instead of hardcoding values:

```tsx
// Good
import { colors } from '../ui-kit/tokens';
<div className="text-[#0fae96]">...</div>

// Avoid
<div style={{ color: '#0fae96' }}>...</div>
```

### Components vs Patterns

- **Components** are atomic UI elements (buttons, cards, inputs)
- **Patterns** are combinations of components for specific use cases (forms, tables, lists)

## Card Components

The Card component system provides a consistent way to display content in contained boxes.

### Card Types

1. **Primary Cards** - Main content cards with more advanced styling, often used on landing pages
2. **Secondary Cards** - Simpler info cards for content on internal pages

### Card Variants

- `primary` - Standard white card with shadow (default)
- `secondary` - Light gray background
- `outline` - Border only
- `elevated` - Extra shadow for emphasis
- `flat` - No shadow, just background
- `feature` - Special styling for feature highlighting

### Example

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '../ui-kit';

<Card variant={{ variant: 'primary', size: 'md' }} hoverable>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
</Card>
```

## Container Components

Containers help maintain consistent width constraints and padding throughout the application.

### Container Variants

- `default` - Standard centered container
- `fluid` - Full-width container
- `narrow` - Narrower container for focused content
- `wide` - Wider container for expansive content

### Container Sizes

- `sm` - 640px max width
- `md` - 768px max width
- `lg` - 1024px max width
- `xl` - 1280px max width
- `2xl` - 1536px max width

### Example

```tsx
import { Container } from '../ui-kit';

<Container 
  variant={{ size: 'xl' }}
  verticalPadding="md"
  background="light"
>
  Content goes here
</Container>
```

## Button Components

Buttons are used for interactive actions throughout the application.

### Button Variants

- `primary` - Teal gradient (default)
- `secondary` - Gray background
- `outline` - Border only
- `ghost` - No background until hover
- `link` - Looks like a link
- `danger` - Red for destructive actions

### Button Sizes

- `xs` - Extra small
- `sm` - Small
- `md` - Medium (default)
- `lg` - Large
- `xl` - Extra large

### Example

```tsx
import { Button } from '../ui-kit';

<Button 
  variant={{ 
    variant: 'primary',
    size: 'md',
    shape: 'pill'
  }}
  onClick={handleClick}
>
  Click Me
</Button>
```

## Best Practices

1. **Consistency First** - Always use existing components before creating new ones
2. **Responsive by Default** - All components should work across all viewport sizes
3. **Dark Mode Support** - All components must support both light and dark modes
4. **Accessibility** - Ensure all components meet WCAG accessibility guidelines
5. **Documentation** - Document every component with examples and usage guidelines

## Theme Colors

The main brand color palette:

- Primary: `#0fae96` (Teal)
- Primary Light: `#5eead4`
- Primary Dark: `#0e8a76`
- Secondary: `#6366f1` (Indigo)
- Accent: `#f59e0b` (Amber)

These colors should be used consistently throughout the application.