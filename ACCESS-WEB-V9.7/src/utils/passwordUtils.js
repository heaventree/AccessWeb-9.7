/**
 * Password utility functions for secure password handling
 */
import bcrypt from 'bcryptjs';

// Cost factor for bcrypt (higher is more secure but slower)
const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 * @param {string} password The plain text password to hash
 * @returns {Promise<string>} A promise that resolves to the hashed password
 */
export const hashPassword = async (password) => {
  try {
    // Generate a salt and hash the password
    return await bcrypt.hash(password, SALT_ROUNDS);
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Failed to hash password');
  }
};

/**
 * Verify a password against a hash
 * @param {string} password The plain text password to verify
 * @param {string} hashedPassword The hashed password to compare against
 * @returns {Promise<boolean>} A promise that resolves to true if the password matches, false otherwise
 */
export const verifyPassword = async (password, hashedPassword) => {
  try {
    // Compare the password with the hash
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
};