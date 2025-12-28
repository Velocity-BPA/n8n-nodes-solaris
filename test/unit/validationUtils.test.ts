/**
 * Unit Tests for Validation Utilities
 * @license Business Source License 1.1 - Velocity BPA
 */

import {
	validateEmail,
	validatePhoneNumber,
	validateGermanTaxId,
	validateGermanBLZ,
	validateAmount,
	validateCurrency,
	validateDate,
	validatePersonName,
	sanitizeInput,
} from '../../nodes/Solaris/utils/validationUtils';

describe('Validation Utilities', () => {
	describe('validateEmail', () => {
		test('should validate correct email', () => {
			expect(validateEmail('test@example.com')).toBe(true);
			expect(validateEmail('user.name@domain.co.uk')).toBe(true);
			expect(validateEmail('user+tag@domain.com')).toBe(true);
		});

		test('should reject invalid email', () => {
			expect(validateEmail('invalid')).toBe(false);
			expect(validateEmail('invalid@')).toBe(false);
			expect(validateEmail('@domain.com')).toBe(false);
			expect(validateEmail('')).toBe(false);
		});
	});

	describe('validatePhoneNumber', () => {
		test('should validate E.164 format', () => {
			expect(validatePhoneNumber('+491701234567')).toBe(true);
			expect(validatePhoneNumber('+4930123456')).toBe(true);
		});

		test('should reject invalid phone numbers', () => {
			expect(validatePhoneNumber('01701234567')).toBe(false);
			expect(validatePhoneNumber('invalid')).toBe(false);
			expect(validatePhoneNumber('')).toBe(false);
		});
	});

	describe('validateGermanTaxId', () => {
		test('should validate correct Steuer-ID format', () => {
			// Note: Uses test pattern, real validation requires checksum
			expect(validateGermanTaxId('12345678901')).toBe(true);
		});

		test('should reject invalid Steuer-ID', () => {
			expect(validateGermanTaxId('1234567890')).toBe(false); // Too short
			expect(validateGermanTaxId('123456789012')).toBe(false); // Too long
			expect(validateGermanTaxId('1234567890a')).toBe(false); // Contains letter
		});
	});

	describe('validateGermanBLZ', () => {
		test('should validate correct BLZ format', () => {
			expect(validateGermanBLZ('37040044')).toBe(true);
			expect(validateGermanBLZ('10010010')).toBe(true);
		});

		test('should reject invalid BLZ', () => {
			expect(validateGermanBLZ('3704004')).toBe(false); // Too short
			expect(validateGermanBLZ('370400440')).toBe(false); // Too long
			expect(validateGermanBLZ('3704004a')).toBe(false); // Contains letter
		});
	});

	describe('validateAmount', () => {
		test('should validate positive amounts', () => {
			expect(validateAmount(100)).toBe(true);
			expect(validateAmount(0.01)).toBe(true);
			expect(validateAmount(1000000)).toBe(true);
		});

		test('should validate zero when allowed', () => {
			expect(validateAmount(0, true)).toBe(true);
		});

		test('should reject invalid amounts', () => {
			expect(validateAmount(-100)).toBe(false);
			expect(validateAmount(0)).toBe(false);
			expect(validateAmount(NaN)).toBe(false);
		});
	});

	describe('validateCurrency', () => {
		test('should validate ISO 4217 codes', () => {
			expect(validateCurrency('EUR')).toBe(true);
			expect(validateCurrency('USD')).toBe(true);
			expect(validateCurrency('GBP')).toBe(true);
		});

		test('should reject invalid currencies', () => {
			expect(validateCurrency('EURO')).toBe(false);
			expect(validateCurrency('EU')).toBe(false);
			expect(validateCurrency('123')).toBe(false);
		});
	});

	describe('validateDate', () => {
		test('should validate ISO date strings', () => {
			expect(validateDate('2024-01-15')).toBe(true);
			expect(validateDate('2024-12-31')).toBe(true);
		});

		test('should validate Date objects', () => {
			expect(validateDate(new Date())).toBe(true);
		});

		test('should reject invalid dates', () => {
			expect(validateDate('invalid')).toBe(false);
			expect(validateDate('2024-13-01')).toBe(false);
			expect(validateDate('2024-01-32')).toBe(false);
		});
	});

	describe('validatePersonName', () => {
		test('should validate normal names', () => {
			expect(validatePersonName('John')).toBe(true);
			expect(validatePersonName('María José')).toBe(true);
			expect(validatePersonName("O'Brien")).toBe(true);
			expect(validatePersonName('Müller')).toBe(true);
		});

		test('should reject invalid names', () => {
			expect(validatePersonName('')).toBe(false);
			expect(validatePersonName('A')).toBe(false); // Too short
			expect(validatePersonName('123')).toBe(false);
		});
	});

	describe('sanitizeInput', () => {
		test('should trim whitespace', () => {
			expect(sanitizeInput('  test  ')).toBe('test');
		});

		test('should remove dangerous characters', () => {
			expect(sanitizeInput('<script>alert(1)</script>')).toBe('scriptalert1script');
		});

		test('should handle empty strings', () => {
			expect(sanitizeInput('')).toBe('');
		});
	});
});
