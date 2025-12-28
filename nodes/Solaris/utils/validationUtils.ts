/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject } from 'n8n-workflow';
import { NodeOperationError, type INode } from 'n8n-workflow';

/**
 * Validation error details
 */
export interface ValidationError {
	field: string;
	message: string;
	value?: unknown;
}

/**
 * Validation result
 */
export interface ValidationResult {
	valid: boolean;
	errors: ValidationError[];
}

/**
 * Validate required fields
 */
export function validateRequired(
	data: IDataObject,
	requiredFields: string[],
): ValidationResult {
	const errors: ValidationError[] = [];

	for (const field of requiredFields) {
		const value = data[field];
		if (value === undefined || value === null || value === '') {
			errors.push({
				field,
				message: `Field '${field}' is required`,
			});
		}
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}

/**
 * Validate BIC/SWIFT code format
 *
 * BIC format: 8 or 11 characters
 * - 4 letters: bank code
 * - 2 letters: country code
 * - 2 alphanumeric: location code
 * - 3 alphanumeric (optional): branch code
 */
export function validateBic(bic: string): boolean {
	if (!bic) return false;

	const cleaned = bic.toUpperCase().replace(/\s+/g, '');

	// Must be 8 or 11 characters
	if (cleaned.length !== 8 && cleaned.length !== 11) {
		return false;
	}

	// First 6 characters must be letters
	if (!/^[A-Z]{6}/.test(cleaned)) {
		return false;
	}

	// Characters 7-8 must be alphanumeric
	if (!/^[A-Z]{6}[A-Z0-9]{2}/.test(cleaned)) {
		return false;
	}

	// If 11 characters, last 3 must be alphanumeric
	if (cleaned.length === 11 && !/^[A-Z]{6}[A-Z0-9]{5}$/.test(cleaned)) {
		return false;
	}

	return true;
}

/**
 * Validate email address format
 */
export function validateEmail(email: string): boolean {
	if (!email) return false;

	// Simple but effective email regex
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

/**
 * Validate phone number (E.164 format)
 * Format: +[country code][number]
 */
export function validatePhoneNumber(phone: string): boolean {
	if (!phone) return false;

	// E.164 format: + followed by 1-15 digits
	const phoneRegex = /^\+[1-9]\d{1,14}$/;
	return phoneRegex.test(phone.replace(/\s+/g, ''));
}

/**
 * Validate date format (ISO 8601)
 */
export function validateDate(date: string): boolean {
	if (!date) return false;

	// Try to parse as ISO date
	const parsed = Date.parse(date);
	return !isNaN(parsed);
}

/**
 * Validate date of birth (must be in past, person must be at least 18)
 */
export function validateDateOfBirth(dob: string): ValidationResult {
	const errors: ValidationError[] = [];

	if (!validateDate(dob)) {
		errors.push({
			field: 'date_of_birth',
			message: 'Invalid date format',
			value: dob,
		});
		return { valid: false, errors };
	}

	const birthDate = new Date(dob);
	const today = new Date();

	if (birthDate >= today) {
		errors.push({
			field: 'date_of_birth',
			message: 'Date of birth must be in the past',
			value: dob,
		});
	}

	// Calculate age
	const age = today.getFullYear() - birthDate.getFullYear();
	const monthDiff = today.getMonth() - birthDate.getMonth();
	const dayDiff = today.getDate() - birthDate.getDate();
	const actualAge =
		monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

	if (actualAge < 18) {
		errors.push({
			field: 'date_of_birth',
			message: 'Person must be at least 18 years old',
			value: dob,
		});
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}

/**
 * Validate amount (must be positive number)
 */
export function validateAmount(amount: number | string): boolean {
	const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

	if (isNaN(numAmount)) return false;
	if (numAmount <= 0) return false;
	if (!isFinite(numAmount)) return false;

	// Check for reasonable number of decimal places (max 2 for EUR)
	const decimals = numAmount.toString().split('.')[1];
	if (decimals && decimals.length > 2) return false;

	return true;
}

/**
 * Validate currency code (ISO 4217)
 */
export function validateCurrencyCode(code: string): boolean {
	if (!code) return false;

	// Must be exactly 3 uppercase letters
	const currencyRegex = /^[A-Z]{3}$/;
	return currencyRegex.test(code.toUpperCase());
}

/**
 * Validate country code (ISO 3166-1 alpha-2)
 */
export function validateCountryCode(code: string): boolean {
	if (!code) return false;

	// Must be exactly 2 uppercase letters
	return /^[A-Z]{2}$/.test(code.toUpperCase());
}

/**
 * Validate German tax ID (Steuer-Identifikationsnummer)
 * Format: 11 digits with specific check digit algorithm
 */
export function validateGermanTaxId(taxId: string): boolean {
	if (!taxId) return false;

	const cleaned = taxId.replace(/\s+/g, '');

	// Must be exactly 11 digits
	if (!/^\d{11}$/.test(cleaned)) {
		return false;
	}

	// First digit cannot be 0
	if (cleaned[0] === '0') {
		return false;
	}

	// Check digit validation using ISO 7064 MOD 11,10
	let product = 10;
	for (let i = 0; i < 10; i++) {
		let sum = (parseInt(cleaned[i], 10) + product) % 10;
		if (sum === 0) sum = 10;
		product = (sum * 2) % 11;
	}

	const checkDigit = 11 - product;
	const expectedCheckDigit = checkDigit === 10 ? 0 : checkDigit;

	return parseInt(cleaned[10], 10) === expectedCheckDigit;
}

/**
 * Validate postal code for a specific country
 */
export function validatePostalCode(postalCode: string, countryCode: string): boolean {
	if (!postalCode || !countryCode) return false;

	const patterns: Record<string, RegExp> = {
		DE: /^\d{5}$/,           // Germany: 5 digits
		AT: /^\d{4}$/,           // Austria: 4 digits
		CH: /^\d{4}$/,           // Switzerland: 4 digits
		NL: /^\d{4}\s?[A-Z]{2}$/i, // Netherlands: 4 digits + 2 letters
		BE: /^\d{4}$/,           // Belgium: 4 digits
		FR: /^\d{5}$/,           // France: 5 digits
		GB: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i, // UK: complex format
	};

	const pattern = patterns[countryCode.toUpperCase()];
	if (!pattern) {
		// For unknown countries, just check it's not empty
		return postalCode.length > 0;
	}

	return pattern.test(postalCode);
}

/**
 * Sanitize string for API (trim, remove control characters)
 */
export function sanitizeString(value: string): string {
	if (!value) return '';

	// Remove control characters and trim
	return value.replace(/[\x00-\x1F\x7F]/g, '').trim();
}

/**
 * Sanitize amount to proper format
 */
export function sanitizeAmount(amount: number | string): number {
	const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

	// Round to 2 decimal places
	return Math.round(numAmount * 100) / 100;
}

/**
 * Validate and throw error if invalid
 */
export function validateOrThrow(
	node: INode,
	data: IDataObject,
	requiredFields: string[],
): void {
	const result = validateRequired(data, requiredFields);

	if (!result.valid) {
		const errorMessages = result.errors.map((e) => e.message).join(', ');
		throw new NodeOperationError(node, `Validation failed: ${errorMessages}`);
	}
}

/**
 * Format validation errors as human-readable string
 */
export function formatValidationErrors(errors: ValidationError[]): string {
	return errors.map((e) => `${e.field}: ${e.message}`).join('\n');
}
