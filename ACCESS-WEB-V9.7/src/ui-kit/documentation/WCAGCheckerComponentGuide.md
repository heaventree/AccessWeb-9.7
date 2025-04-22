# WCAG Checker Component Guide

This guide provides specific styling guidelines for the WCAG Checker page and related components.

## WCAG Checker Page Structure

The WCAG Checker page follows a specific structure with carefully defined styling. All components should adhere to these guidelines to maintain consistency.

### Main Container

The main container for the checker page uses the `Container` component with specific styling:

```tsx
<Container 
  variant={{ size: 'xl' }}
  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
>
  {/* Content */}
</Container>
```

### Section Titles

Section titles on the checker page use the following styles:

```tsx
<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
  WCAG Accessibility Checker
</h1>
<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
  Test your website against WCAG 2.1 and 2.2 standards
</p>
```

### Testing Options Section

The testing options section has a specific mint/teal background color:

```tsx
<div className="mt-4 p-4 bg-[#0fae96]/5 dark:bg-[#0fae96]/10 rounded-lg">
  {/* Testing options content */}
</div>
```

### Checkboxes

Checkboxes use the mint/teal accent color:

```tsx
<input
  type="checkbox"
  id="documentTesting"
  checked={enableDocumentTesting}
  onChange={(e) => setEnableDocumentTesting(e.target.checked)}
  className="h-4 w-4 rounded border-gray-300 text-[#0fae96] focus:ring-[#0fae96]"
/>
<label htmlFor="documentTesting" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
  Document Testing
</label>
```

### Help Tooltips

Help tooltips use a consistent style:

```tsx
<div className="absolute hidden group-hover:block z-10 whitespace-nowrap p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300 bottom-full mb-2 left-1/2 transform -translate-x-1/2">
  <p className="font-semibold mb-1 dark:text-white">Tooltip Title:</p>
  <ul className="list-disc list-inside">
    <li>Tooltip item description</li>
  </ul>
</div>
```

### URL Input

The URL input has a rounded-full design for both the input field and container:

```tsx
{/* Use the URLInput component which has the appropriate styling */}
<URLInput onSubmit={handleSubmit} isLoading={isLoading} />
```

### Feature Cards

Feature cards on the checker page use a consistent style:

```tsx
<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
  <FileSearch className="w-8 h-8 text-[#0fae96] mb-4" />
  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
    Card Title
  </h3>
  <p className="text-gray-600 dark:text-gray-300">
    Card description
  </p>
</div>
```

### Action Buttons

Action buttons use the mint/teal gradient:

```tsx
<button
  onClick={handleAction}
  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#0fae96] to-teal-500 hover:from-teal-500 hover:to-[#0fae96] shadow-md rounded-full transition-all hover:shadow-lg"
>
  <Icon className="w-4 h-4 mr-2" />
  Button Text
</button>
```

## Dark Mode Considerations

All components must be designed to work in both light and dark modes. Key considerations:

1. Text colors should be properly contrasted (`dark:text-white`, `dark:text-gray-300`, etc.)
2. Background colors should be properly adjusted (`dark:bg-gray-800`, `dark:bg-gray-900`, etc.)
3. Border colors should be properly adjusted (`dark:border-gray-700`)
4. Interactive elements should be clearly visible in dark mode

## Accessibility Guidelines

All components must meet WCAG 2.1 AA standards:

1. Color contrast ratio of at least 4.5:1 for normal text and 3:1 for large text
2. Proper focus indicators for keyboard navigation
3. Proper labeling and ARIA attributes for screen readers
4. Proper heading structure and semantic HTML

## Best Practices

1. Use the provided UI Kit components whenever possible
2. Maintain consistent spacing, padding, and margins
3. Use design tokens for colors, spacing, and typography
4. Ensure all interactive elements are keyboard accessible
5. Test all components in both light and dark modes