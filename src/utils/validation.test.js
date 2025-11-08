// src/utils/validation.test.js
import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validateUsername,
  validateAge,
  sanitizeText,
  validateProductId,
  validatePrice
} from './validation';

describe('Frontend Input Validation', () => {

  describe('validateEmail', () => {
    it('should accept valid email', () => {
      const result = validateEmail('test@example.com');
      expect(result.valid).toBe(true);
      expect(result.value).toBe('test@example.com');
    });

    it('should reject invalid email format', () => {
      const result = validateEmail('notanemail');
      expect(result.valid).toBe(false);
    });

    it('should reject XSS attempts in email', () => {
      const result = validateEmail('test<script>@example.com');
      expect(result.valid).toBe(false);
    });

    it('should reject empty email', () => {
      const result = validateEmail('');
      expect(result.valid).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should accept strong password', () => {
      const result = validatePassword('Test123!');
      expect(result.valid).toBe(true);
    });

    it('should reject password without uppercase', () => {
      const result = validatePassword('test123!');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('uppercase');
    });

    it('should reject password without number', () => {
      const result = validatePassword('TestTest!');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('number');
    });

    it('should reject password too short', () => {
      const result = validatePassword('Test1!');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('8 characters');
    });
  });

  describe('validateUsername', () => {
    it('should accept valid username', () => {
      const result = validateUsername('user_123');
      expect(result.valid).toBe(true);
    });

    it('should reject username with special characters', () => {
      const result = validateUsername('user<script>');
      expect(result.valid).toBe(false);
    });

    it('should reject username too short', () => {
      const result = validateUsername('ab');
      expect(result.valid).toBe(false);
    });
  });

  describe('sanitizeText', () => {
    it('should escape HTML special characters', () => {
      const result = sanitizeText('<script>alert("XSS")</script>');
      expect(result.valid).toBe(false);
    });

    it('should accept safe text', () => {
      const result = sanitizeText('This is safe text');
      expect(result.valid).toBe(true);
    });
  });

  describe('validateProductId', () => {
    it('should accept valid product ID', () => {
      const result = validateProductId(123);
      expect(result.valid).toBe(true);
    });

    it('should reject negative ID', () => {
      const result = validateProductId(-5);
      expect(result.valid).toBe(false);
    });

    it('should reject non-numeric ID', () => {
      const result = validateProductId('abc');
      expect(result.valid).toBe(false);
    });
  });

});