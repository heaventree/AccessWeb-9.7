# Color Palette Generator Component Guide

This guide provides specific styling guidelines for the Color Palette Generator component.

## Overview

The Color Palette Generator is a critical component of the AccessWeb platform, allowing users to generate and test accessible color combinations that meet WCAG guidelines. This component should follow specific styling patterns to maintain consistency with the overall design system.

## Component Structure

The Color Palette Generator follows a structured layout pattern:

1. **Input Section** - Where users input their colors or color schemes
2. **Controls Section** - For adjusting generation parameters
3. **Results Section** - Displaying the generated palette
4. **Info Section** - Providing WCAG compliance information

## Styling Guidelines

### Container

The main container for the Color Palette Generator should use the `Container` component:

```tsx
<Container 
  variant={{ size: 'xl' }}
  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
>
  {/* Content */}
</Container>
```

### Section Title

Section titles within the component should use consistent styling:

```tsx
<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
  Generate Accessible Color Palette
</h2>
```

### Input Fields

Color input fields should use a consistent style with rounded-full shape:

```tsx
<div className="flex flex-col space-y-2">
  <label htmlFor="baseColor" className="text-sm font-medium text-gray-700 dark:text-gray-300">
    Base Color
  </label>
  <div className="flex rounded-full overflow-hidden border border-gray-300 dark:border-gray-600 focus-within:ring-2 focus-within:ring-[#0fae96]">
    <input
      type="text"
      id="baseColor"
      placeholder="#0fae96"
      className="flex-1 px-4 py-2 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
    />
    <div className="w-10 h-10 p-1">
      <div 
        className="w-full h-full rounded-full" 
        style={{ backgroundColor: '#0fae96' }}
      />
    </div>
  </div>
</div>
```

### Color Swatches

Color swatches should be presented in a consistent format:

```tsx
<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
  {colors.map((color, index) => (
    <div key={index} className="flex flex-col items-center">
      <div 
        className="w-16 h-16 rounded-md mb-2 border border-gray-200 dark:border-gray-700" 
        style={{ backgroundColor: color }}
      />
      <span className="text-sm font-mono text-gray-700 dark:text-gray-300">{color}</span>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {contrastRatios[index] >= 4.5 ? '✓ AA' : '✗ Fails AA'}
      </span>
    </div>
  ))}
</div>
```

### Control Panels

Control panels for adjusting generation parameters should use the Card component:

```tsx
<Card variant={{ variant: 'secondary' }} className="mt-6">
  <CardHeader>
    <CardTitle>Generation Controls</CardTitle>
    <CardDescription>Adjust parameters to customize your palette</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Controls content */}
  </CardContent>
</Card>
```

### WCAG Information

Information about WCAG compliance should be clearly displayed:

```tsx
<div className="mt-8 p-4 bg-[#0fae96]/10 dark:bg-[#0fae96]/20 rounded-lg">
  <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-2">
    WCAG Contrast Requirements
  </h3>
  <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
    <li>AA Normal Text: 4.5:1 contrast ratio minimum</li>
    <li>AA Large Text: 3:1 contrast ratio minimum</li>
    <li>AAA Normal Text: 7:1 contrast ratio minimum</li>
    <li>AAA Large Text: 4.5:1 contrast ratio minimum</li>
  </ul>
</div>
```

### Action Buttons

Action buttons should use the mint/teal primary style and rounded-full shape:

```tsx
<Button
  variant={{ 
    variant: 'primary',
    shape: 'pill'
  }}
  onClick={generatePalette}
>
  Generate Palette
</Button>
```

## Color Palette Card

When displaying a saved color palette, use a consistent card format:

```tsx
<Card hoverable interactive onClick={handlePaletteClick}>
  <CardHeader>
    <CardTitle>Brand Color Palette</CardTitle>
    <CardDescription>WCAG AA Compliant</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="flex space-x-2">
      {palette.colors.map((color, index) => (
        <div 
          key={index}
          className="w-8 h-8 rounded-sm border border-gray-200 dark:border-gray-700"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  </CardContent>
  <CardFooter>
    <div className="text-xs text-gray-500 dark:text-gray-400">
      Created 2 days ago
    </div>
  </CardFooter>
</Card>
```

## Dark Mode Considerations

All components must be designed to work in both light and dark modes:

1. Use `dark:` variants for all text and background colors
2. Ensure all color inputs and swatches have proper border colors in dark mode
3. Information panels should use opacity for brand colors instead of solid fills

## Accessibility Guidelines

1. All color information must have text alternatives (don't rely solely on the color itself)
2. Include both the color hex code and contrast ratio information for each swatch
3. Use proper heading structure and semantic HTML
4. Ensure all interactive elements are keyboard accessible

## Best Practices

1. Always provide visual feedback about contrast compliance (checkmarks, x-marks, etc.)
2. Include copy functionality for color codes
3. Allow export of palettes to various formats (JSON, CSS variables, etc.)
4. Provide educational information about WCAG guidelines alongside tools