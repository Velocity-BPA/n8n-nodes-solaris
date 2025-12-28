/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Solaris Error Codes
 * Common error codes returned by the Solaris API
 */
export const ERROR_CODES = {
	// Authentication Errors
	UNAUTHORIZED: 'unauthorized',
	INVALID_CREDENTIALS: 'invalid_credentials',
	TOKEN_EXPIRED: 'token_expired',
	INSUFFICIENT_SCOPE: 'insufficient_scope',

	// Validation Errors
	VALIDATION_ERROR: 'validation_error',
	INVALID_IBAN: 'invalid_iban',
	INVALID_BIC: 'invalid_bic',
	INVALID_AMOUNT: 'invalid_amount',
	INVALID_CURRENCY: 'invalid_currency',
	INVALID_DATE: 'invalid_date',
	MISSING_REQUIRED_FIELD: 'missing_required_field',

	// Resource Errors
	NOT_FOUND: 'not_found',
	PERSON_NOT_FOUND: 'person_not_found',
	BUSINESS_NOT_FOUND: 'business_not_found',
	ACCOUNT_NOT_FOUND: 'account_not_found',
	CARD_NOT_FOUND: 'card_not_found',
	TRANSACTION_NOT_FOUND: 'transaction_not_found',
	DOCUMENT_NOT_FOUND: 'document_not_found',

	// State Errors
	INVALID_STATE: 'invalid_state',
	ACCOUNT_BLOCKED: 'account_blocked',
	ACCOUNT_CLOSED: 'account_closed',
	CARD_BLOCKED: 'card_blocked',
	CARD_INACTIVE: 'card_inactive',
	PERSON_NOT_IDENTIFIED: 'person_not_identified',
	BUSINESS_NOT_IDENTIFIED: 'business_not_identified',

	// Limit Errors
	INSUFFICIENT_FUNDS: 'insufficient_funds',
	LIMIT_EXCEEDED: 'limit_exceeded',
	DAILY_LIMIT_EXCEEDED: 'daily_limit_exceeded',
	MONTHLY_LIMIT_EXCEEDED: 'monthly_limit_exceeded',
	TRANSACTION_LIMIT_EXCEEDED: 'transaction_limit_exceeded',

	// Transfer Errors
	TRANSFER_FAILED: 'transfer_failed',
	TRANSFER_REJECTED: 'transfer_rejected',
	INVALID_RECIPIENT: 'invalid_recipient',
	RECIPIENT_BANK_UNREACHABLE: 'recipient_bank_unreachable',
	SEPA_INSTANT_NOT_SUPPORTED: 'sepa_instant_not_supported',
	SEPA_INSTANT_TIMEOUT: 'sepa_instant_timeout',

	// Card Errors
	CARD_EXPIRED: 'card_expired',
	CARD_NOT_ACTIVATED: 'card_not_activated',
	PIN_INCORRECT: 'pin_incorrect',
	PIN_BLOCKED: 'pin_blocked',
	CARD_LIMIT_EXCEEDED: 'card_limit_exceeded',
	MERCHANT_BLOCKED: 'merchant_blocked',

	// Compliance Errors
	COMPLIANCE_CHECK_FAILED: 'compliance_check_failed',
	PEP_CHECK_REQUIRED: 'pep_check_required',
	SANCTIONS_HIT: 'sanctions_hit',
	AML_BLOCKED: 'aml_blocked',
	DOCUMENT_VERIFICATION_FAILED: 'document_verification_failed',

	// SCA Errors
	SCA_REQUIRED: 'sca_required',
	SCA_CHALLENGE_FAILED: 'sca_challenge_failed',
	SCA_CHALLENGE_EXPIRED: 'sca_challenge_expired',
	DEVICE_NOT_BOUND: 'device_not_bound',

	// Rate Limit Errors
	RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',
	TOO_MANY_REQUESTS: 'too_many_requests',

	// Server Errors
	INTERNAL_ERROR: 'internal_error',
	SERVICE_UNAVAILABLE: 'service_unavailable',
	MAINTENANCE: 'maintenance',
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

/**
 * Error Messages
 * Human-readable error messages for each error code
 */
export const ERROR_MESSAGES: Record<string, string> = {
	[ERROR_CODES.UNAUTHORIZED]: 'Authentication failed. Please check your credentials.',
	[ERROR_CODES.INVALID_CREDENTIALS]: 'Invalid client credentials provided.',
	[ERROR_CODES.TOKEN_EXPIRED]: 'Access token has expired. Please re-authenticate.',
	[ERROR_CODES.INSUFFICIENT_SCOPE]: 'Insufficient permissions for this operation.',

	[ERROR_CODES.VALIDATION_ERROR]: 'Request validation failed. Please check your input.',
	[ERROR_CODES.INVALID_IBAN]: 'Invalid IBAN format provided.',
	[ERROR_CODES.INVALID_BIC]: 'Invalid BIC/SWIFT code provided.',
	[ERROR_CODES.INVALID_AMOUNT]: 'Invalid amount. Amount must be positive.',
	[ERROR_CODES.INVALID_CURRENCY]: 'Invalid or unsupported currency code.',
	[ERROR_CODES.INVALID_DATE]: 'Invalid date format. Use ISO 8601 format.',
	[ERROR_CODES.MISSING_REQUIRED_FIELD]: 'Required field is missing from the request.',

	[ERROR_CODES.NOT_FOUND]: 'Requested resource was not found.',
	[ERROR_CODES.PERSON_NOT_FOUND]: 'Person with the specified ID was not found.',
	[ERROR_CODES.BUSINESS_NOT_FOUND]: 'Business with the specified ID was not found.',
	[ERROR_CODES.ACCOUNT_NOT_FOUND]: 'Account with the specified ID was not found.',
	[ERROR_CODES.CARD_NOT_FOUND]: 'Card with the specified ID was not found.',
	[ERROR_CODES.TRANSACTION_NOT_FOUND]: 'Transaction with the specified ID was not found.',
	[ERROR_CODES.DOCUMENT_NOT_FOUND]: 'Document with the specified ID was not found.',

	[ERROR_CODES.INVALID_STATE]: 'Operation not allowed in current resource state.',
	[ERROR_CODES.ACCOUNT_BLOCKED]: 'Account is blocked. Operations are not permitted.',
	[ERROR_CODES.ACCOUNT_CLOSED]: 'Account is closed. Operations are not permitted.',
	[ERROR_CODES.CARD_BLOCKED]: 'Card is blocked. Please unblock or use another card.',
	[ERROR_CODES.CARD_INACTIVE]: 'Card has not been activated yet.',
	[ERROR_CODES.PERSON_NOT_IDENTIFIED]: 'Person has not completed identification (KYC).',
	[ERROR_CODES.BUSINESS_NOT_IDENTIFIED]: 'Business has not completed identification.',

	[ERROR_CODES.INSUFFICIENT_FUNDS]: 'Insufficient funds in the account.',
	[ERROR_CODES.LIMIT_EXCEEDED]: 'Transaction limit has been exceeded.',
	[ERROR_CODES.DAILY_LIMIT_EXCEEDED]: 'Daily transaction limit has been exceeded.',
	[ERROR_CODES.MONTHLY_LIMIT_EXCEEDED]: 'Monthly transaction limit has been exceeded.',
	[ERROR_CODES.TRANSACTION_LIMIT_EXCEEDED]: 'Single transaction limit has been exceeded.',

	[ERROR_CODES.TRANSFER_FAILED]: 'Transfer could not be completed.',
	[ERROR_CODES.TRANSFER_REJECTED]: 'Transfer was rejected by the recipient bank.',
	[ERROR_CODES.INVALID_RECIPIENT]: 'Invalid recipient account details.',
	[ERROR_CODES.RECIPIENT_BANK_UNREACHABLE]: 'Recipient bank is currently unreachable.',
	[ERROR_CODES.SEPA_INSTANT_NOT_SUPPORTED]:
		'SEPA Instant is not supported by the recipient bank.',
	[ERROR_CODES.SEPA_INSTANT_TIMEOUT]: 'SEPA Instant transfer timed out.',

	[ERROR_CODES.CARD_EXPIRED]: 'Card has expired.',
	[ERROR_CODES.CARD_NOT_ACTIVATED]: 'Card must be activated before use.',
	[ERROR_CODES.PIN_INCORRECT]: 'Incorrect PIN entered.',
	[ERROR_CODES.PIN_BLOCKED]: 'PIN is blocked due to too many incorrect attempts.',
	[ERROR_CODES.CARD_LIMIT_EXCEEDED]: 'Card spending limit has been exceeded.',
	[ERROR_CODES.MERCHANT_BLOCKED]: 'Merchant category is blocked for this card.',

	[ERROR_CODES.COMPLIANCE_CHECK_FAILED]: 'Compliance check could not be completed.',
	[ERROR_CODES.PEP_CHECK_REQUIRED]: 'Additional PEP (Politically Exposed Person) check required.',
	[ERROR_CODES.SANCTIONS_HIT]: 'Transaction blocked due to sanctions screening.',
	[ERROR_CODES.AML_BLOCKED]: 'Operation blocked by AML (Anti-Money Laundering) controls.',
	[ERROR_CODES.DOCUMENT_VERIFICATION_FAILED]: 'Document verification failed.',

	[ERROR_CODES.SCA_REQUIRED]: 'Strong Customer Authentication (SCA) is required.',
	[ERROR_CODES.SCA_CHALLENGE_FAILED]: 'SCA challenge verification failed.',
	[ERROR_CODES.SCA_CHALLENGE_EXPIRED]: 'SCA challenge has expired. Please request a new one.',
	[ERROR_CODES.DEVICE_NOT_BOUND]: 'Device is not registered for SCA.',

	[ERROR_CODES.RATE_LIMIT_EXCEEDED]: 'API rate limit exceeded. Please slow down.',
	[ERROR_CODES.TOO_MANY_REQUESTS]: 'Too many requests. Please wait before retrying.',

	[ERROR_CODES.INTERNAL_ERROR]: 'Internal server error. Please try again later.',
	[ERROR_CODES.SERVICE_UNAVAILABLE]: 'Service is temporarily unavailable.',
	[ERROR_CODES.MAINTENANCE]: 'System is under maintenance. Please try again later.',
};

/**
 * HTTP Status Code Mapping
 */
export const HTTP_STATUS_CODES: Record<string, number> = {
	[ERROR_CODES.UNAUTHORIZED]: 401,
	[ERROR_CODES.INVALID_CREDENTIALS]: 401,
	[ERROR_CODES.TOKEN_EXPIRED]: 401,
	[ERROR_CODES.INSUFFICIENT_SCOPE]: 403,
	[ERROR_CODES.VALIDATION_ERROR]: 400,
	[ERROR_CODES.NOT_FOUND]: 404,
	[ERROR_CODES.INVALID_STATE]: 409,
	[ERROR_CODES.RATE_LIMIT_EXCEEDED]: 429,
	[ERROR_CODES.TOO_MANY_REQUESTS]: 429,
	[ERROR_CODES.INTERNAL_ERROR]: 500,
	[ERROR_CODES.SERVICE_UNAVAILABLE]: 503,
};
