/**
 * Unit Tests for IBAN Utilities
 * @license Business Source License 1.1 - Velocity BPA
 */

import { validateIBAN, validateBIC, formatIBAN, parseIBAN, generateIBANCheckDigits } from '../../nodes/Solaris/utils/ibanUtils';

describe('IBAN Utilities', () => {
	describe('validateIBAN', () => {
		test('should validate correct German IBAN', () => {
			expect(validateIBAN('DE89370400440532013000')).toBe(true);
		});

		test('should validate correct French IBAN', () => {
			expect(validateIBAN('FR1420041010050500013M02606')).toBe(true);
		});

		test('should validate correct UK IBAN', () => {
			expect(validateIBAN('GB29NWBK60161331926819')).toBe(true);
		});

		test('should validate IBAN with spaces', () => {
			expect(validateIBAN('DE89 3704 0044 0532 0130 00')).toBe(true);
		});

		test('should validate lowercase IBAN', () => {
			expect(validateIBAN('de89370400440532013000')).toBe(true);
		});

		test('should reject invalid checksum', () => {
			expect(validateIBAN('DE89370400440532013001')).toBe(false);
		});

		test('should reject too short IBAN', () => {
			expect(validateIBAN('DE8937040044')).toBe(false);
		});

		test('should reject too long IBAN', () => {
			expect(validateIBAN('DE893704004405320130001234567890')).toBe(false);
		});

		test('should reject empty string', () => {
			expect(validateIBAN('')).toBe(false);
		});

		test('should reject invalid characters', () => {
			expect(validateIBAN('DE89370400440532013@00')).toBe(false);
		});
	});

	describe('validateBIC', () => {
		test('should validate correct 8-character BIC', () => {
			expect(validateBIC('COBADEFF')).toBe(true);
		});

		test('should validate correct 11-character BIC', () => {
			expect(validateBIC('COBADEFFXXX')).toBe(true);
		});

		test('should validate lowercase BIC', () => {
			expect(validateBIC('cobadeff')).toBe(true);
		});

		test('should reject invalid BIC length', () => {
			expect(validateBIC('COBADE')).toBe(false);
			expect(validateBIC('COBADEFF1234')).toBe(false);
		});

		test('should reject BIC with invalid characters', () => {
			expect(validateBIC('COBA1234')).toBe(false);
		});

		test('should reject empty string', () => {
			expect(validateBIC('')).toBe(false);
		});
	});

	describe('formatIBAN', () => {
		test('should format IBAN with spaces', () => {
			expect(formatIBAN('DE89370400440532013000')).toBe('DE89 3704 0044 0532 0130 00');
		});

		test('should handle already formatted IBAN', () => {
			expect(formatIBAN('DE89 3704 0044 0532 0130 00')).toBe('DE89 3704 0044 0532 0130 00');
		});

		test('should convert to uppercase', () => {
			expect(formatIBAN('de89370400440532013000')).toBe('DE89 3704 0044 0532 0130 00');
		});
	});

	describe('parseIBAN', () => {
		test('should parse German IBAN correctly', () => {
			const result = parseIBAN('DE89370400440532013000');
			expect(result).toEqual({
				countryCode: 'DE',
				checkDigits: '89',
				bban: '370400440532013000',
				bankCode: '37040044',
				accountNumber: '0532013000',
			});
		});

		test('should parse French IBAN correctly', () => {
			const result = parseIBAN('FR1420041010050500013M02606');
			expect(result).toEqual({
				countryCode: 'FR',
				checkDigits: '14',
				bban: '20041010050500013M02606',
				bankCode: '20041',
				branchCode: '01005',
				accountNumber: '0500013M026',
				nationalCheckDigits: '06',
			});
		});

		test('should return null for invalid IBAN', () => {
			expect(parseIBAN('INVALID')).toBeNull();
		});

		test('should handle IBAN with spaces', () => {
			const result = parseIBAN('DE89 3704 0044 0532 0130 00');
			expect(result?.countryCode).toBe('DE');
		});
	});

	describe('generateIBANCheckDigits', () => {
		test('should generate correct check digits for German BBAN', () => {
			expect(generateIBANCheckDigits('DE', '370400440532013000')).toBe('89');
		});

		test('should return null for invalid country', () => {
			expect(generateIBANCheckDigits('XX', '370400440532013000')).toBeNull();
		});
	});
});
