/**
 * Data Validation Utility
 * 
 * Provides comprehensive validation utilities for form data and API payloads.
 * Implements secure validation patterns for common data types and formats.
 */

import { z } from 'zod';
import { ErrorType, createError } from './errorHandler';

// Common validation patterns for reuse
const PATTERNS = {
  // Email validation using RFC 5322 compliant regex
  EMAIL: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  
  // URL validation pattern
  URL: /^(https?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)?(\/\S*)?$/,
  
  // Password strength pattern (8+ chars, upper, lower, number, special char)
  STRONG_PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
  
  // UUID v4 validation pattern
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  
  // ISO date format (YYYY-MM-DD)
  ISO_DATE: /^\d{4}-\d{2}-\d{2}$/,
  
  // Phone number validation (international format)
  PHONE: /^\+?[1-9]\d{1,14}$/,
};

// Common Zod schemas for reuse
export const CommonSchemas = {
  // Email validation schema with error message
  email: z.string()
    .min(5, { message: 'Email is too short' })
    .max(255, { message: 'Email is too long' })
    .regex(PATTERNS.EMAIL, { message: 'Invalid email format' }),
  
  // Password validation with strength requirements
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(72, { message: 'Password is too long' })
    .regex(PATTERNS.STRONG_PASSWORD, {
      message: 'Password must include uppercase, lowercase, number, and special character'
    }),
    
  // URL validation
  url: z.string()
    .regex(PATTERNS.URL, { message: 'Invalid URL format' }),
    
  // UUID validation
  uuid: z.string()
    .regex(PATTERNS.UUID, { message: 'Invalid UUID format' }),
    
  // ISO date validation
  isoDate: z.string()
    .regex(PATTERNS.ISO_DATE, { message: 'Invalid date format (YYYY-MM-DD)' }),
    
  // Phone number validation
  phone: z.string()
    .regex(PATTERNS.PHONE, { message: 'Invalid phone number format' }),
    
  // User name validation
  username: z.string()
    .min(3, { message: 'Username must be at least 3 characters' })
    .max(50, { message: 'Username must be less than 50 characters' })
    .regex(/^[a-zA-Z0-9_-]+$/, { message: 'Username can only contain letters, numbers, underscore and hyphen' }),
};

/**
 * Validates data against a schema and returns validated data or throws formatted errors
 * @param schema Zod schema to validate against
 * @param data Data to validate
 * @returns Validated data
 */
export const validateData = <T>(schema: z.ZodType<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Extract validation issues and format them
      const fieldErrors = error.errors.reduce<Record<string, string>>((acc, curr) => {
        const path = curr.path.join('.');
        acc[path] = curr.message;
        return acc;
      }, {});
      
      throw createError(
        ErrorType.VALIDATION,
        'validation_error',
        'The provided data is invalid',
        { fields: fieldErrors }
      );
    }
    
    // Re-throw unexpected errors
    throw error;
  }
};

/**
 * Sanitizes user input to prevent XSS attacks
 * @param input String to sanitize
 * @returns Sanitized string
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return input;
  
  // Replace HTML entities
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Sanitizes an object by applying sanitizeInput to all string properties
 * @param obj Object to sanitize
 * @returns Sanitized object
 */
export const sanitizeObject = <T extends Record<string, any>>(obj: T): T => {
  const sanitized: Record<string, any> = {};
  
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? sanitizeInput(item) : 
        (item && typeof item === 'object' ? sanitizeObject(item) : item)
      );
    } else {
      sanitized[key] = value;
    }
  });
  
  return sanitized as T;
};

/**
 * Checks if a value is a valid email
 */
export const isValidEmail = (email: string): boolean => {
  return PATTERNS.EMAIL.test(email);
};

/**
 * Checks if a value is a valid URL
 */
export const isValidUrl = (url: string): boolean => {
  return PATTERNS.URL.test(url);
};

/**
 * Checks if a value is a strong password
 */
export const isStrongPassword = (password: string): boolean => {
  return PATTERNS.STRONG_PASSWORD.test(password);
};

/**
 * Checks if a value is a valid UUID
 */
export const isValidUuid = (uuid: string): boolean => {
  return PATTERNS.UUID.test(uuid);
};

/**
 * Checks if a value is a valid ISO date
 */
export const isValidIsoDate = (date: string): boolean => {
  return PATTERNS.ISO_DATE.test(date);
};

/**
 * Checks if a value is a valid phone number
 */
export const isValidPhone = (phone: string): boolean => {
  return PATTERNS.PHONE.test(phone);
};