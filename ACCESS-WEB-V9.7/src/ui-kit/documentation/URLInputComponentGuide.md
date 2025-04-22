# URL Input Component Guide

This guide provides specific styling guidelines for the URLInput component, which has a distinct rounded design pattern.

## Overview

The URLInput component is used throughout the AccessWeb platform for entering website URLs for analysis and testing. This component has a specific rounded-full design that differs from standard input fields.

## Component Structure

The URLInput component has three main states:
1. **Default state** - Empty input field with placeholder
2. **Filled state** - Input field with a URL entered
3. **Loading state** - Input field with a loading indicator

## Styling Guidelines

### Container

The main container for the URLInput should be rounded-full and have a subtle shadow:

```tsx
<div className="relative w-full max-w-2xl mx-auto">
  <div className="flex rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow transition-shadow focus-within:ring-2 focus-within:ring-[#0fae96] focus-within:border-transparent">
    {/* Input and button content */}
  </div>
</div>
```

### Input Field

The input field itself should also maintain the rounded-full appearance:

```tsx
<input
  type="url"
  placeholder="Enter website URL (e.g., https://example.com)"
  value={url}
  onChange={(e) => setUrl(e.target.value)}
  className="flex-1 px-4 md:px-6 py-3 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
  aria-label="Website URL"
/>
```

### Submit Button

The submit button should maintain the rounded-full shape on the right side:

```tsx
<button
  type="submit"
  disabled={isLoading || !url}
  className="inline-flex items-center px-4 md:px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-[#0fae96] to-teal-500 hover:from-teal-500 hover:to-[#0fae96] disabled:opacity-70 disabled:cursor-not-allowed"
>
  {isLoading ? (
    <>
      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Analyzing...
    </>
  ) : (
    <>
      <svg className="mr-2 -ml-1 w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      Analyze
    </>
  )}
</button>
```

### Implementation Example

Here's a complete example of how to implement the URLInput component:

```tsx
import React, { useState } from 'react';

interface URLInputProps {
  onSubmit: (url: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export function URLInput({
  onSubmit,
  isLoading = false,
  placeholder = "Enter website URL (e.g., https://example.com)",
  className,
}: URLInputProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url && !isLoading) {
      onSubmit(url);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative w-full max-w-2xl mx-auto ${className || ''}`}>
      <div className="flex rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow transition-shadow focus-within:ring-2 focus-within:ring-[#0fae96] focus-within:border-transparent">
        <input
          type="url"
          placeholder={placeholder}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 px-4 md:px-6 py-3 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          aria-label="Website URL"
        />
        <button
          type="submit"
          disabled={isLoading || !url}
          className="inline-flex items-center px-4 md:px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-[#0fae96] to-teal-500 hover:from-teal-500 hover:to-[#0fae96] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            <>
              <svg className="mr-2 -ml-1 w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Analyze
            </>
          )}
        </button>
      </div>
    </form>
  );
}
```

## Usage in Different Sections

The URLInput component should be used consistently across different sections of the application:

### WCAG Checker Page

```tsx
<Container verticalPadding="lg">
  <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
    WCAG Accessibility Checker
  </h1>
  <p className="text-lg text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
    Test your website against WCAG 2.1 and 2.2 standards
  </p>
  
  <URLInput 
    onSubmit={handleAnalyze} 
    isLoading={isAnalyzing} 
  />
</Container>
```

### Color Contrast Analyzer

```tsx
<Section background="light">
  <Container>
    <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
      Color Contrast Analyzer
    </h1>
    <p className="text-lg text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
      Test your website's color contrast against WCAG guidelines
    </p>
    
    <URLInput 
      onSubmit={analyzeColors} 
      isLoading={isAnalyzing}
      placeholder="Enter URL to analyze colors (e.g., https://example.com)" 
    />
  </Container>
</Section>
```

## Variants

While the main URLInput component has the rounded-full design, you can create variants for different contexts:

### Compact Variant

For use in headers or tighter spaces:

```tsx
<div className="flex rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
  <input
    type="url"
    placeholder="URL..."
    value={url}
    onChange={(e) => setUrl(e.target.value)}
    className="flex-1 px-3 py-1 text-sm focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
  />
  <button
    type="submit"
    className="px-3 py-1 text-xs font-medium text-white bg-gradient-to-r from-[#0fae96] to-teal-500"
  >
    Go
  </button>
</div>
```

### With Additional Options

For more advanced search functionality:

```tsx
<div className="flex flex-col space-y-4">
  <div className="flex rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
    <input
      type="url"
      placeholder="Enter website URL..."
      className="flex-1 px-4 py-3 focus:outline-none"
    />
    <button
      type="submit"
      className="px-4 py-3 text-white bg-gradient-to-r from-[#0fae96] to-teal-500"
    >
      Analyze
    </button>
  </div>
  
  <div className="flex flex-wrap gap-4 justify-center">
    {/* Additional options */}
    <label className="inline-flex items-center">
      <input type="checkbox" className="rounded text-[#0fae96]" />
      <span className="ml-2 text-sm">WCAG 2.1</span>
    </label>
    <label className="inline-flex items-center">
      <input type="checkbox" className="rounded text-[#0fae96]" />
      <span className="ml-2 text-sm">WCAG 2.2</span>
    </label>
  </div>
</div>
```

## Dark Mode Considerations

In dark mode, ensure:
1. Input background is dark (`dark:bg-gray-800`)
2. Text color is white (`dark:text-white`)
3. Border color is darker (`dark:border-gray-700`)
4. Focus ring still uses the teal brand color

## Accessibility Guidelines

1. Always include appropriate `aria-label` attributes
2. Provide visual feedback for the loading state
3. Ensure the button is disabled when appropriate (during loading or when empty)
4. Maintain adequate color contrast between the input text and background
5. Include clear error messages for invalid URLs (below the input)