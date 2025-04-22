# AccessWeb UI Kit Usage Guide

This guide explains how to use the UI Kit effectively in the AccessWeb application.

## Getting Started

The UI Kit provides a comprehensive set of components, tokens, and utilities to ensure consistent design and accessibility across the application. Always import components from the top-level UI Kit export:

```tsx
// Good
import { Card, Button, Container } from '../ui-kit';

// Avoid
import { Card } from '../ui-kit/components/Card';
import { Button } from '../ui-kit/components/Button';
```

## Core Principles

1. **Consistency First** - Always use existing components before creating new ones
2. **Accessibility Built-in** - All components are designed with WCAG compliance in mind
3. **Dark Mode Support** - All components fully support both light and dark modes
4. **Responsive Design** - All components are responsive by default
5. **Token-based Design** - Use design tokens for colors, spacing, and typography

## Component Usage Guidelines

### Page Structure

Use the `PageLayout` and `Container` components to structure your pages:

```tsx
import { PageLayout, PageHeader } from '../ui-kit/layouts/PageLayout';
import { Container, Section } from '../ui-kit';

export function MyPage() {
  return (
    <PageLayout
      header={
        <PageHeader
          title="My Page Title"
          description="Page description goes here"
          background="brand"
        />
      }
    >
      <Section background="light" spacing="lg">
        <Container variant={{ size: 'xl' }}>
          {/* Page content goes here */}
        </Container>
      </Section>
    </PageLayout>
  );
}
```

### Card Components

Use `Card` components for content grouping and information organization:

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui-kit';

<Card hoverable>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Card content goes here */}
  </CardContent>
  <CardFooter>
    <Button variant={{ variant: 'primary' }}>Action</Button>
  </CardFooter>
</Card>
```

### Button Components

Use `Button` components with appropriate variants:

```tsx
import { Button, ButtonGroup } from '../ui-kit';

// Primary action button
<Button 
  variant={{ 
    variant: 'primary',
    shape: 'pill'
  }}
  onClick={handleAction}
>
  Primary Action
</Button>

// Secondary action button
<Button variant={{ variant: 'secondary' }}>
  Secondary Action
</Button>

// Button with icon
<Button 
  variant={{ variant: 'outline' }}
  icon={<ArrowRightIcon />}
  iconPosition="right"
>
  Continue
</Button>

// Button group
<ButtonGroup>
  <Button variant={{ variant: 'primary' }}>Save</Button>
  <Button variant={{ variant: 'outline' }}>Cancel</Button>
</ButtonGroup>
```

### Container Components

Use `Container` and `Section` components for layout structure:

```tsx
import { Container, Section } from '../ui-kit';

// Standard section with container
<Section background="light" spacing="lg">
  <Container variant={{ size: 'xl' }}>
    {/* Content */}
  </Container>
</Section>

// Full-width container with background
<Container 
  variant={{ size: 'full' }}
  background="brand"
  verticalPadding="lg"
>
  {/* Content */}
</Container>
```

## Using Design Tokens

Always use design tokens instead of hardcoded values:

```tsx
import { colors, typography, spacing } from '../ui-kit/tokens';

// Good - uses token
<div className="text-[#0fae96]">...</div>

// Avoid - hardcoded hex value
<div style={{ color: '#0fae96' }}>...</div>
```

## Component Variants and Props

Most components support variant props for flexible styling:

```tsx
// Card with variants
<Card
  variant={{
    variant: 'primary', // Or 'secondary', 'outline', etc.
    size: 'md',         // Or 'sm', 'lg'
    radius: 'lg'        // Or 'none', 'sm', 'md', 'xl', 'full'
  }}
  hoverable
>
  {/* Content */}
</Card>

// Button with variants
<Button
  variant={{
    variant: 'primary', // Or 'secondary', 'outline', 'ghost', 'link', 'danger'
    size: 'md',         // Or 'xs', 'sm', 'lg', 'xl'
    shape: 'pill',      // Or 'square', 'rounded'
    width: 'auto'       // Or 'full', 'fit'
  }}
>
  Button Text
</Button>
```

## Dark Mode Support

All components automatically support dark mode using Tailwind's dark mode classes:

```tsx
// This will show white text on dark backgrounds automatically
<h1 className="text-gray-900 dark:text-white">Heading</h1>

// This will show a lighter background in dark mode
<div className="bg-white dark:bg-gray-800">Content</div>
```

## Accessibility Features

All components are designed with accessibility in mind:

1. **Proper color contrast** - All colors meet WCAG AA requirements
2. **Keyboard navigation** - All interactive elements are keyboard accessible
3. **Screen reader support** - Appropriate ARIA attributes are used
4. **Focus management** - Focus indicators are clear and visible

## Component-Specific Guides

For detailed information on specific components, refer to these guides:

- [WCAG Checker Component Guide](./WCAGCheckerComponentGuide.md)
- [Color Palette Component Guide](./ColorPaletteComponentGuide.md)
- [URL Input Component Guide](./URLInputComponentGuide.md)

## Usage Examples

For working examples of how to use the UI Kit components together, see the demo page:

```tsx
import { DemoPage } from '../ui-kit/examples';

// Use this in your route configuration or directly in your app
<DemoPage />
```

## Best Practices

1. **Consistency is key** - Use the same components and patterns throughout the application
2. **Mobile-first approach** - Design for mobile first, then enhance for larger screens
3. **Semantic HTML** - Use the appropriate HTML elements for content
4. **Avoid direct style overrides** - Use the provided variants and props instead of direct CSS
5. **Test for accessibility** - Regularly test for keyboard navigation and screen reader compatibility

## Troubleshooting

If you encounter issues with the UI Kit:

1. **Styling inconsistencies** - Check that you're using the correct variant props
2. **Dark mode issues** - Ensure you're using `dark:` prefixed classes
3. **Component errors** - Check the component props documentation
4. **Missing imports** - Ensure you're importing from the correct location