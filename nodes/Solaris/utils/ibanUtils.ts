/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * IBAN Utilities
 *
 * IBAN (International Bank Account Number) validation and formatting utilities.
 * IBANs are used throughout SEPA for identifying bank accounts.
 *
 * Format: 2-letter country code + 2 check digits + BBAN (country-specific)
 * Example: DE89 3704 0044 0532 0130 00 (German IBAN)
 */

/**
 * IBAN country length specifications
 * Each country has a specific IBAN length
 */
const IBAN_LENGTHS: Record<string, number> = {
	DE: 22, // Germany
	AT: 20, // Austria
	BE: 16, // Belgium
	BG: 22, // Bulgaria
	HR: 21, // Croatia
	CY: 28, // Cyprus
	CZ: 24, // Czech Republic
	DK: 18, // Denmark
	EE: 20, // Estonia
	FI: 18, // Finland
	FR: 27, // France
	GR: 27, // Greece
	HU: 28, // Hungary
	IE: 22, // Ireland
	IT: 27, // Italy
	LV: 21, // Latvia
	LT: 20, // Lithuania
	LU: 20, // Luxembourg
	MT: 31, // Malta
	NL: 18, // Netherlands
	PL: 28, // Poland
	PT: 25, // Portugal
	RO: 24, // Romania
	SK: 24, // Slovakia
	SI: 19, // Slovenia
	ES: 24, // Spain
	SE: 24, // Sweden
	CH: 21, // Switzerland
	GB: 22, // United Kingdom
};

/**
 * Clean IBAN by removing spaces and converting to uppercase
 */
export function cleanIban(iban: string): string {
	return iban.replace(/\s+/g, '').toUpperCase();
}

/**
 * Format IBAN with spaces for readability
 * Standard format: groups of 4 characters
 */
export function formatIban(iban: string): string {
	const cleaned = cleanIban(iban);
	return cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
}

/**
 * Validate IBAN format and check digits
 *
 * @param iban - IBAN to validate
 * @returns true if IBAN is valid
 */
export function validateIban(iban: string): boolean {
	const cleaned = cleanIban(iban);

	// Check minimum length
	if (cleaned.length < 15) {
		return false;
	}

	// Extract country code
	const countryCode = cleaned.substring(0, 2);

	// Check if country is known and length matches
	const expectedLength = IBAN_LENGTHS[countryCode];
	if (!expectedLength || cleaned.length !== expectedLength) {
		return false;
	}

	// Validate check digits using MOD-97 algorithm
	return validateIbanChecksum(cleaned);
}

/**
 * Validate IBAN checksum using MOD-97 algorithm (ISO 13616)
 *
 * @param iban - Cleaned IBAN
 * @returns true if checksum is valid
 */
function validateIbanChecksum(iban: string): boolean {
	// Move first 4 characters to end
	const rearranged = iban.substring(4) + iban.substring(0, 4);

	// Convert letters to numbers (A=10, B=11, ..., Z=35)
	let numericString = '';
	for (const char of rearranged) {
		if (char >= 'A' && char <= 'Z') {
			numericString += (char.charCodeAt(0) - 55).toString();
		} else {
			numericString += char;
		}
	}

	// Calculate MOD 97
	let remainder = 0;
	for (const char of numericString) {
		remainder = (remainder * 10 + parseInt(char, 10)) % 97;
	}

	return remainder === 1;
}

/**
 * Extract country code from IBAN
 */
export function getCountryCode(iban: string): string {
	const cleaned = cleanIban(iban);
	return cleaned.substring(0, 2);
}

/**
 * Extract check digits from IBAN
 */
export function getCheckDigits(iban: string): string {
	const cleaned = cleanIban(iban);
	return cleaned.substring(2, 4);
}

/**
 * Extract BBAN (Basic Bank Account Number) from IBAN
 * BBAN is the country-specific part of the IBAN
 */
export function getBban(iban: string): string {
	const cleaned = cleanIban(iban);
	return cleaned.substring(4);
}

/**
 * Extract bank code from German IBAN (Bankleitzahl)
 * German BBAN format: 8-digit bank code + 10-digit account number
 */
export function getGermanBankCode(iban: string): string | null {
	const cleaned = cleanIban(iban);
	if (!cleaned.startsWith('DE') || cleaned.length !== 22) {
		return null;
	}
	return cleaned.substring(4, 12);
}

/**
 * Extract account number from German IBAN
 */
export function getGermanAccountNumber(iban: string): string | null {
	const cleaned = cleanIban(iban);
	if (!cleaned.startsWith('DE') || cleaned.length !== 22) {
		return null;
	}
	return cleaned.substring(12);
}

/**
 * Check if IBAN is German
 */
export function isGermanIban(iban: string): boolean {
	const cleaned = cleanIban(iban);
	return cleaned.startsWith('DE') && cleaned.length === 22;
}

/**
 * Check if IBAN is from a SEPA country
 */
export function isSepaIban(iban: string): boolean {
	const countryCode = getCountryCode(iban);
	// SEPA includes all EU countries plus some additional ones
	return countryCode in IBAN_LENGTHS;
}

/**
 * Get human-readable validation result
 */
export function getIbanValidationResult(iban: string): {
	valid: boolean;
	formatted: string;
	countryCode: string;
	error?: string;
} {
	const cleaned = cleanIban(iban);

	if (cleaned.length < 2) {
		return {
			valid: false,
			formatted: '',
			countryCode: '',
			error: 'IBAN too short',
		};
	}

	const countryCode = getCountryCode(cleaned);
	const expectedLength = IBAN_LENGTHS[countryCode];

	if (!expectedLength) {
		return {
			valid: false,
			formatted: formatIban(cleaned),
			countryCode,
			error: `Unknown country code: ${countryCode}`,
		};
	}

	if (cleaned.length !== expectedLength) {
		return {
			valid: false,
			formatted: formatIban(cleaned),
			countryCode,
			error: `Invalid length: expected ${expectedLength}, got ${cleaned.length}`,
		};
	}

	if (!validateIbanChecksum(cleaned)) {
		return {
			valid: false,
			formatted: formatIban(cleaned),
			countryCode,
			error: 'Invalid check digits',
		};
	}

	return {
		valid: true,
		formatted: formatIban(cleaned),
		countryCode,
	};
}
