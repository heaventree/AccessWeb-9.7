/**
 * Validation Utility
 * 
 * Provides validation functions using Zod for type checking and validation
 * with proper error handling and reporting.
 */

import { z } from 'zod';
import { ErrorType, createError } from './errorHandler';

/**
 * Validates data against a Zod schema
 * 
 * @param schema Zod schema to validate against
 * @param data Data to validate
 * @returns Validated data with proper typing
 * @throws Error if validation fails
 */
export function validateData<T extends z.ZodType>(
  schema: T,
  data: unknown
): z.infer<T> {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Format validation errors in a user-friendly and secure way
      const formattedErrors = error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }));
      
      throw createError(
        ErrorType.VALIDATION,
        'validation_error',
        'Data validation failed',
        { validationErrors: formattedErrors }
      );
    }
    
    // Re-throw any other errors
    throw error;
  }
}

/**
 * Safely attempts to validate data without throwing an error
 * 
 * @param schema Zod schema to validate against
 * @param data Data to validate
 * @returns Object with validation result
 */
export function safeValidate<T extends z.ZodType>(
  schema: T,
  data: unknown
): { 
  success: boolean; 
  data?: z.infer<T>; 
  error?: { 
    code: string; 
    message: string; 
    details: unknown 
  } 
} {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }));
      
      return {
        success: false,
        error: {
          code: 'validation_error',
          message: 'Data validation failed',
          details: { validationErrors: formattedErrors }
        }
      };
    }
    
    // Handle any other errors
    return {
      success: false,
      error: {
        code: 'unknown_validation_error',
        message: 'An unexpected error occurred during validation',
        details: { originalError: String(error) }
      }
    };
  }
}

/**
 * Common validation schemas
 */
export const commonSchemas = {
  // Authentication
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  
  // IDs and tokens
  uuid: z.string().uuid('Invalid ID format'),
  token: z.string().min(10, 'Invalid token'),
  
  // Common data types
  positiveNumber: z.number().positive('Value must be positive'),
  nonEmptyString: z.string().min(1, 'This field cannot be empty'),
  url: z.string().url('Please enter a valid URL'),
  
  // Date validation
  isoDate: z.string().refine(
    (value) => !isNaN(Date.parse(value)),
    { message: 'Invalid date format' }
  ),
  
  // Object with data and metadata
  dataWithMetadata: <T extends z.ZodTypeAny>(dataSchema: T) => 
    z.object({
      data: dataSchema,
      metadata: z.record(z.string()).optional()
    })
};

/**
 * Sanitizes data based on allowed schema fields
 * Removes any fields not defined in the schema
 * 
 * @param schema Schema defining allowed fields
 * @param data Data to sanitize
 * @returns Sanitized data with only allowed fields
 */
export function sanitizeData<T extends z.ZodType>(
  schema: T,
  data: Record<string, unknown>
): Record<string, unknown> {
  // Get schema shape (only works with object schemas)
  if (!(schema instanceof z.ZodObject)) {
    throw createError(
      ErrorType.VALIDATION,
      'invalid_schema',
      'Schema must be a ZodObject for sanitization'
    );
  }
  
  const shape = schema.shape;
  const allowedKeys = Object.keys(shape);
  
  // Filter data to only include allowed keys
  const sanitized = Object.fromEntries(
    Object.entries(data).filter(([key]) => allowedKeys.includes(key))
  );
  
  return sanitized;
}

export default {
  validateData,
  safeValidate,
  commonSchemas,
  sanitizeData
};