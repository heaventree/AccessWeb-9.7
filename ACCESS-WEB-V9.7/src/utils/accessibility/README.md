# Accessibility Utilities

This module provides utilities for accessibility testing, compliance checking, and other accessibility-related operations.

## Available Utilities

- **accessibilityTester**: Tools for testing accessibility compliance
- **accessibility-compliance**: Functions for checking WCAG compliance
- **colorContrastChecker**: Utilities for validating color contrast ratios
- **htmlStructureAnalyzer**: Tools for analyzing HTML structure accessibility
- **mediaAccessibilityTester**: Functions for testing media accessibility features
- **pdfAccessibilityTester**: Tools for validating PDF accessibility
- **responsiveDesignAnalyzer**: Utilities for testing responsive design accessibility
- **wcagHelper**: Helper functions for WCAG compliance checking
- **legislationMapper**: Tools for mapping accessibility requirements to legislation

## Usage Examples

```typescript
// Import specific utility
import { checkColorContrast } from '@/utils/accessibility';

// Use utility
const isCompliant = checkColorContrast('#FFFFFF', '#000000');
```

For more detailed documentation, see each individual utility file.