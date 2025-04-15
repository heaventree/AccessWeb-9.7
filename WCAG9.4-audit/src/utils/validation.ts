/**
 * Data Validation Utility
 * 
 * Provides utilities for validating data using Zod schemas with
 * standardized error handling and formatting.
 */

import { z } from 'zod';
import { ErrorType, createError } from './errorHandler';

/**
 * Validate data against a Zod schema
 * 
 * @param schema Zod schema to validate against
 * @param data Data to validate
 * @param errorMessage Custom error message
 * @returns Validated data
 */
export function validateData<T>(
  schema: z.ZodType<T>,
  data: unknown,
  errorMessage: string = 'Invalid data format'
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError(
        ErrorType.VALIDATION,
        'data_validation_failed',
        errorMessage,
        {
          validationErrors: error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }))
        },
        error
      );
    }
    
    throw createError(
      ErrorType.VALIDATION,
      'data_validation_error',
      errorMessage,
      {},
      error
    );
  }
}

/**
 * Safely validate data against a Zod schema
 * Returns null instead of throwing errors
 * 
 * @param schema Zod schema to validate against
 * @param data Data to validate
 * @returns Validated data or null if invalid
 */
export function safeValidateData<T>(
  schema: z.ZodType<T>,
  data: unknown
): T | null {
  try {
    return schema.parse(data);
  } catch (error) {
    return null;
  }
}

/**
 * Format Zod validation errors into user-friendly messages
 * 
 * @param error Zod error
 * @returns User-friendly error messages
 */
export function formatZodError(error: z.ZodError): string[] {
  return error.errors.map(err => {
    const path = err.path.join('.');
    return path ? `${path}: ${err.message}` : err.message;
  });
}

// Common validation schemas
export const schemas = {
  // User schemas
  email: z.string().email('Invalid email address'),
  password: z.string().min(12, 'Password must be at least 12 characters long'),
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  id: z.string().uuid('Invalid ID format'),
  
  // Common schemas
  url: z.string().url('Invalid URL'),
  date: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    { message: 'Invalid date format' }
  ),
  phoneNumber: z.string().regex(
    /^\+?[1-9]\d{1,14}$/,
    'Invalid phone number format. Please use international format.'
  ),
  
  // Security-related schemas
  csrfToken: z.string().min(32, 'Invalid CSRF token'),
  jwt: z.string().regex(
    /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/,
    'Invalid JWT format'
  )
};

// Common schema builders
export function createUserSchema() {
  return z.object({
    id: schemas.id,
    name: schemas.name,
    email: schemas.email,
    role: z.enum(['user', 'admin']),
    organization: z.string().min(1, 'Organization name is required')
  });
}

export function createLoginSchema() {
  return z.object({
    email: schemas.email,
    password: schemas.password
  });
}

export function createRegistrationSchema() {
  return z.object({
    name: schemas.name,
    email: schemas.email,
    password: schemas.password,
    organization: z.string().min(1, 'Organization name is required')
  });
}

export default {
  validateData,
  safeValidateData,
  formatZodError,
  schemas,
  createUserSchema,
  createLoginSchema,
  createRegistrationSchema
};