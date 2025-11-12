// src/utils/validation.js
// Frontend input validation utilities for OWASP security

/**
 * Validate email format
 * Prevents: Invalid email formats, XSS in email field
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }

  // Remove whitespace
  email = email.trim();

  // Check length
  if (email.length > 100) {
    return { valid: false, error: 'Email too long' };
  }

  // Email regex pattern
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  // Check for dangerous characters (XSS prevention)
  if (/<|>|"|'|;|\(|\)/.test(email)) {
    return { valid: false, error: 'Email contains invalid characters' };
  }

  return { valid: true, value: email };
};

/**
 * Validate password strength
 * Requirements: Min 8 chars, uppercase, lowercase, number, special char
 * Prevents: Weak passwords, injection attacks
 */
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Password is required' };
  }

  // Length check
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }

  if (password.length > 128) {
    return { valid: false, error: 'Password too long' };
  }

  // Check for required character types
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  if (!hasUppercase) {
    return { valid: false, error: 'Password must contain an uppercase letter' };
  }

  if (!hasLowercase) {
    return { valid: false, error: 'Password must contain a lowercase letter' };
  }

  if (!hasNumber) {
    return { valid: false, error: 'Password must contain a number' };
  }

  if (!hasSpecial) {
    return { valid: false, error: 'Password must contain a special character' };
  }

  return { valid: true };
};

/**
 * Validate username
 * Prevents: XSS, SQL injection, special character attacks
 */
export const validateUsername = (username) => {
  if (!username || typeof username !== 'string') {
    return { valid: false, error: 'Username is required' };
  }

  // Remove whitespace
  username = username.trim();

  // Length check
  if (username.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' };
  }

  if (username.length > 20) {
    return { valid: false, error: 'Username too long (max 20 characters)' };
  }

  // Only allow alphanumeric and underscore
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  
  if (!usernameRegex.test(username)) {
    return { valid: false, error: 'Username can only contain letters, numbers, and underscores' };
  }

  return { valid: true, value: username };
};

/**
 * Validate age
 * Prevents: Invalid numbers, negative ages, SQL injection
 */
export const validateAge = (age) => {
  // Convert to number if string
  const ageNum = typeof age === 'string' ? parseInt(age, 10) : age;

  if (isNaN(ageNum)) {
    return { valid: false, error: 'Age must be a number' };
  }

  if (ageNum < 13) {
    return { valid: false, error: 'Must be at least 13 years old' };
  }

  if (ageNum > 120) {
    return { valid: false, error: 'Invalid age' };
  }

  return { valid: true, value: ageNum };
};

/**
 * Sanitize text input (for names, comments, etc.)
 * Prevents: XSS attacks, HTML injection
 */
export const sanitizeText = (text, maxLength = 1000) => {
  if (!text || typeof text !== 'string') {
    return { valid: false, error: 'Text is required' };
  }

  // Remove leading/trailing whitespace
  text = text.trim();

  // Check length
  if (text.length === 0) {
    return { valid: false, error: 'Text cannot be empty' };
  }

  if (text.length > maxLength) {
    return { valid: false, error: `Text too long (max ${maxLength} characters)` };
  }

  // Remove dangerous HTML tags and script attempts
  const dangerous = /<script|<iframe|<object|<embed|javascript:|onerror=|onload=/gi;
  
  if (dangerous.test(text)) {
    return { valid: false, error: 'Text contains invalid content' };
  }

  // Escape HTML special characters
  const sanitized = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');

  return { valid: true, value: sanitized };
};

/**
 * Validate product ID
 * Prevents: SQL injection, invalid IDs
 */
export const validateProductId = (id) => {
  // Convert to number if string
  const idNum = typeof id === 'string' ? parseInt(id, 10) : id;

  if (isNaN(idNum)) {
    return { valid: false, error: 'Invalid product ID' };
  }

  if (idNum <= 0) {
    return { valid: false, error: 'Product ID must be positive' };
  }

  if (idNum > 2147483647) {
    return { valid: false, error: 'Invalid product ID' };
  }

  return { valid: true, value: idNum };
};

/**
 * Validate price (for display/calculation, not storage)
 * Prevents: Invalid numbers, negative prices
 */
export const validatePrice = (price) => {
  // Convert to number if string
  const priceNum = typeof price === 'string' ? parseFloat(price) : price;

  if (isNaN(priceNum)) {
    return { valid: false, error: 'Invalid price' };
  }

  if (priceNum < 0) {
    return { valid: false, error: 'Price cannot be negative' };
  }

  if (priceNum > 9999.99) {
    return { valid: false, error: 'Price too high' };
  }

  return { valid: true, value: priceNum };
};

// Export all validators as default object
export default {
  validateEmail,
  validatePassword,
  validateUsername,
  validateAge,
  sanitizeText,
  validateProductId,
  validatePrice
};