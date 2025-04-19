# Utility Functions Guidelines

This document outlines the standardized approach for creating and maintaining utility functions in the ACCESS-WEB-V9.7 project.

## Utility File Structure

Each utility file should focus on a specific domain or functionality. Utilities should be organized as follows:

```
utils/
├── accessibility/        # Accessibility-related utilities
│   ├── index.ts          # Main exports
│   ├── contrast.ts       # Color contrast utilities
│   └── scanner.ts        # Accessibility scanning functions
├── api/                  # API-related utilities
│   ├── index.ts          # Main exports
│   ├── client.ts         # API client functions
│   └── error-handling.ts # API error handling
├── auth/                 # Authentication utilities
│   ├── index.ts          # Main exports
│   ├── tokens.ts         # Token management
│   └── validation.ts     # Auth validation functions
└── common/               # General purpose utilities
    ├── index.ts          # Main exports
    ├── strings.ts        # String manipulation functions
    └── validation.ts     # General validation functions
```

## Utility Implementation Standards

### 1. File Organization

- Use **kebab-case** for utility filenames
- Group related utilities in subdirectories
- Use index.ts files to re-export and organize public API
- Keep each utility focused on a specific domain

### 2. Function Structure

```typescript
/**
 * A brief description of what the function does.
 * 
 * @param param1 - Description of the first parameter
 * @param param2 - Description of the second parameter
 * @returns Description of the return value
 * @throws Description of potential errors
 * 
 * @example
 * ```typescript
 * const result = utilityFunction('input', 123);
 * // result = 'processed: input-123'
 * ```
 */
export function utilityFunction(
  param1: string,
  param2: number,
  options?: UtilityOptions
): string {
  // Input validation
  if (!param1) {
    throw new Error('param1 is required');
  }
  
  // Function implementation
  const processed = `processed: ${param1}-${param2}`;
  
  // Return result
  return processed;
}
```

### 3. Type Definitions

```typescript
/**
 * Options for the utility function.
 */
export interface UtilityOptions {
  /** Whether to enable logging. Default: false */
  enableLogging?: boolean;
  
  /** Custom formatter function */
  formatter?: (value: string) => string;
}

/**
 * Result from the utility function.
 */
export interface UtilityResult {
  /** The processed value */
  value: string;
  
  /** Timestamp of when the processing occurred */
  timestamp: number;
}
```

### 4. Error Handling

```typescript
/**
 * Custom error for utility functions.
 */
export class UtilityError extends Error {
  /** The code for this error */
  code: string;
  
  /** Additional error context */
  context?: Record<string, any>;
  
  constructor(message: string, code: string, context?: Record<string, any>) {
    super(message);
    this.name = 'UtilityError';
    this.code = code;
    this.context = context;
  }
}

/**
 * Utility function with proper error handling.
 */
export function processData(data: unknown): string {
  try {
    // Validate input
    if (data === null || data === undefined) {
      throw new UtilityError(
        'Data is required',
        'MISSING_DATA'
      );
    }
    
    if (typeof data !== 'string') {
      throw new UtilityError(
        'Data must be a string',
        'INVALID_DATA_TYPE',
        { providedType: typeof data }
      );
    }
    
    // Process data
    return data.toUpperCase();
  } catch (error) {
    // Re-throw custom errors
    if (error instanceof UtilityError) {
      throw error;
    }
    
    // Wrap unknown errors
    throw new UtilityError(
      `Failed to process data: ${(error as Error).message}`,
      'PROCESSING_ERROR'
    );
  }
}
```

### 5. Testing

```typescript
// utils/__tests__/data-processor.test.ts
import { processData, UtilityError } from '../data-processor';

describe('processData', () => {
  it('processes valid string data', () => {
    expect(processData('test')).toBe('TEST');
  });
  
  it('throws MISSING_DATA error for null input', () => {
    expect(() => processData(null)).toThrow(UtilityError);
    expect(() => processData(null)).toThrow('Data is required');
    
    try {
      processData(null);
    } catch (error) {
      expect(error instanceof UtilityError).toBe(true);
      expect((error as UtilityError).code).toBe('MISSING_DATA');
    }
  });
  
  it('throws INVALID_DATA_TYPE error for non-string input', () => {
    expect(() => processData(123 as any)).toThrow(UtilityError);
    expect(() => processData(123 as any)).toThrow('Data must be a string');
    
    try {
      processData(123 as any);
    } catch (error) {
      expect(error instanceof UtilityError).toBe(true);
      expect((error as UtilityError).code).toBe('INVALID_DATA_TYPE');
      expect((error as UtilityError).context).toEqual({ providedType: 'number' });
    }
  });
});
```

## Utility Best Practices

### Pure Functions

- Prefer pure functions that don't have side effects
- Ensure a function returns the same output for the same input
- Avoid modifying input parameters

```typescript
// ❌ Bad - Modifies input parameter
function addItem(array: string[], item: string): void {
  array.push(item);
}

// ✅ Good - Returns new array, doesn't modify input
function addItem(array: string[], item: string): string[] {
  return [...array, item];
}
```

### Error Handling

- Use custom error classes for different error types
- Include error codes for programmatic handling
- Add context information to errors when helpful
- Document potential errors in JSDoc

### Performance

- Optimize critical functions for performance
- Consider memoization for expensive calculations
- Use appropriate data structures for the task
- Document performance considerations

```typescript
// Memoization example
const memoizedCalculator = (() => {
  const cache = new Map<string, number>();
  
  return (a: number, b: number): number => {
    const key = `${a}-${b}`;
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    // Expensive calculation
    const result = /* complex calculation */;
    
    cache.set(key, result);
    return result;
  };
})();
```

### Security

- Validate all inputs
- Sanitize data when needed
- Avoid using unsafe functions (e.g., eval)
- Handle sensitive data appropriately
- Document security considerations

### Documentation

- Include JSDoc comments for all exported functions
- Add usage examples
- Document parameters, return values, and errors
- Note any side effects or dependencies

## Utility Review Checklist

Before submitting a utility for review, ensure:

- [ ] Function follows the standard structure
- [ ] All parameters and return values are properly typed
- [ ] Comprehensive error handling is implemented
- [ ] Tests are included and cover edge cases
- [ ] Documentation is complete with examples
- [ ] Code is properly formatted and linted
- [ ] Performance considerations are addressed
- [ ] Security considerations are addressed