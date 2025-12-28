/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Identification Methods
 * KYC verification methods available in Solaris
 */
export const IDENTIFICATION_METHODS = {
	VIDEO_IDENT: 'video_ident',
	BANK_IDENT: 'bank_ident',
	EID: 'eid',
	IDNOW: 'idnow',
	POSTIDENT: 'postident',
	QUALIFIED_SIGNATURE: 'qualified_signature',
} as const;

export type IdentificationMethod = typeof IDENTIFICATION_METHODS[keyof typeof IDENTIFICATION_METHODS];

export const IDENTIFICATION_METHOD_OPTIONS = [
	{
		name: 'Video-Ident',
		value: 'video_ident',
		description: 'Video call identification with IDnow or similar provider',
	},
	{
		name: 'Bank-Ident',
		value: 'bank_ident',
		description: 'Identification via existing bank account',
	},
	{
		name: 'eID',
		value: 'eid',
		description: 'German electronic ID card (Personalausweis)',
	},
	{
		name: 'IDnow',
		value: 'idnow',
		description: 'IDnow video identification service',
	},
	{
		name: 'PostIdent',
		value: 'postident',
		description: 'Deutsche Post identification service',
	},
	{
		name: 'Qualified Electronic Signature',
		value: 'qualified_signature',
		description: 'QES-based identification',
	},
];

/**
 * Identification Status
 */
export const IDENTIFICATION_STATUS = {
	CREATED: 'created',
	PENDING: 'pending',
	PENDING_SUCCESSFUL: 'pending_successful',
	SUCCESSFUL: 'successful',
	FAILED: 'failed',
	EXPIRED: 'expired',
	ABORTED: 'aborted',
	CANCELED: 'canceled',
} as const;

export type IdentificationStatus = typeof IDENTIFICATION_STATUS[keyof typeof IDENTIFICATION_STATUS];

/**
 * Person Status
 */
export const PERSON_STATUS = {
	CREATED: 'created',
	IDENTIFICATION_PENDING: 'identification_pending',
	IDENTIFIED: 'identified',
	ONBOARDING_BLOCKED: 'onboarding_blocked',
	ACTIVE: 'active',
	BLOCKED: 'blocked',
	ARCHIVED: 'archived',
} as const;

export type PersonStatus = typeof PERSON_STATUS[keyof typeof PERSON_STATUS];

/**
 * Business Status
 */
export const BUSINESS_STATUS = {
	CREATED: 'created',
	IDENTIFICATION_PENDING: 'identification_pending',
	IDENTIFIED: 'identified',
	ACTIVE: 'active',
	BLOCKED: 'blocked',
	ARCHIVED: 'archived',
} as const;

export type BusinessStatus = typeof BUSINESS_STATUS[keyof typeof BUSINESS_STATUS];

/**
 * Business Types
 */
export const BUSINESS_TYPES = {
	SOLE_PROPRIETORSHIP: 'sole_proprietorship',
	GMBH: 'gmbh',
	UG: 'ug',
	AG: 'ag',
	GMBH_CO_KG: 'gmbh_co_kg',
	OHG: 'ohg',
	KG: 'kg',
	EK: 'ek',
	GBR: 'gbr',
	PARTG: 'partg',
	EV: 'ev',
	STIFTUNG: 'stiftung',
	GENOSSENSCHAFT: 'genossenschaft',
	OTHER: 'other',
} as const;

export type BusinessType = typeof BUSINESS_TYPES[keyof typeof BUSINESS_TYPES];

export const BUSINESS_TYPE_OPTIONS = [
	{ name: 'Sole Proprietorship (Einzelunternehmen)', value: 'sole_proprietorship' },
	{ name: 'GmbH (Limited Liability Company)', value: 'gmbh' },
	{ name: 'UG (Entrepreneurial Company)', value: 'ug' },
	{ name: 'AG (Stock Corporation)', value: 'ag' },
	{ name: 'GmbH & Co. KG', value: 'gmbh_co_kg' },
	{ name: 'OHG (General Partnership)', value: 'ohg' },
	{ name: 'KG (Limited Partnership)', value: 'kg' },
	{ name: 'e.K. (Registered Merchant)', value: 'ek' },
	{ name: 'GbR (Civil Law Partnership)', value: 'gbr' },
	{ name: 'PartG (Partnership)', value: 'partg' },
	{ name: 'e.V. (Registered Association)', value: 'ev' },
	{ name: 'Stiftung (Foundation)', value: 'stiftung' },
	{ name: 'Genossenschaft (Cooperative)', value: 'genossenschaft' },
	{ name: 'Other', value: 'other' },
];

/**
 * Document Types
 */
export const DOCUMENT_TYPES = {
	ID_CARD: 'id_card',
	PASSPORT: 'passport',
	RESIDENCE_PERMIT: 'residence_permit',
	PROOF_OF_ADDRESS: 'proof_of_address',
	TAX_DOCUMENT: 'tax_document',
	BANK_STATEMENT: 'bank_statement',
	BUSINESS_REGISTRATION: 'business_registration',
	COMMERCIAL_REGISTER: 'commercial_register',
	ARTICLES_OF_ASSOCIATION: 'articles_of_association',
	SHAREHOLDER_LIST: 'shareholder_list',
	POWER_OF_ATTORNEY: 'power_of_attorney',
	BENEFICIAL_OWNER_DECLARATION: 'beneficial_owner_declaration',
	FINANCIAL_STATEMENT: 'financial_statement',
	CONTRACT: 'contract',
	OTHER: 'other',
} as const;

export type DocumentType = typeof DOCUMENT_TYPES[keyof typeof DOCUMENT_TYPES];

export const DOCUMENT_TYPE_OPTIONS = [
	{ name: 'ID Card', value: 'id_card' },
	{ name: 'Passport', value: 'passport' },
	{ name: 'Residence Permit', value: 'residence_permit' },
	{ name: 'Proof of Address', value: 'proof_of_address' },
	{ name: 'Tax Document', value: 'tax_document' },
	{ name: 'Bank Statement', value: 'bank_statement' },
	{ name: 'Business Registration', value: 'business_registration' },
	{ name: 'Commercial Register Extract', value: 'commercial_register' },
	{ name: 'Articles of Association', value: 'articles_of_association' },
	{ name: 'Shareholder List', value: 'shareholder_list' },
	{ name: 'Power of Attorney', value: 'power_of_attorney' },
	{ name: 'Beneficial Owner Declaration', value: 'beneficial_owner_declaration' },
	{ name: 'Financial Statement', value: 'financial_statement' },
	{ name: 'Contract', value: 'contract' },
	{ name: 'Other', value: 'other' },
];

/**
 * Consent Types
 */
export const CONSENT_TYPES = {
	TERMS_AND_CONDITIONS: 'terms_and_conditions',
	PRIVACY_POLICY: 'privacy_policy',
	MARKETING_EMAIL: 'marketing_email',
	MARKETING_SMS: 'marketing_sms',
	MARKETING_PHONE: 'marketing_phone',
	DATA_SHARING: 'data_sharing',
	CREDIT_CHECK: 'credit_check',
	SCHUFA: 'schufa',
} as const;

export type ConsentType = typeof CONSENT_TYPES[keyof typeof CONSENT_TYPES];

export const CONSENT_TYPE_OPTIONS = [
	{ name: 'Terms and Conditions', value: 'terms_and_conditions' },
	{ name: 'Privacy Policy', value: 'privacy_policy' },
	{ name: 'Marketing - Email', value: 'marketing_email' },
	{ name: 'Marketing - SMS', value: 'marketing_sms' },
	{ name: 'Marketing - Phone', value: 'marketing_phone' },
	{ name: 'Data Sharing', value: 'data_sharing' },
	{ name: 'Credit Check', value: 'credit_check' },
	{ name: 'SCHUFA Check', value: 'schufa' },
];

/**
 * SCA Methods
 * Strong Customer Authentication methods (PSD2)
 */
export const SCA_METHODS = {
	SMS_OTP: 'sms_otp',
	PUSH_NOTIFICATION: 'push_notification',
	TOTP: 'totp',
	DEVICE_SIGNATURE: 'device_signature',
	BIOMETRIC: 'biometric',
} as const;

export type ScaMethod = typeof SCA_METHODS[keyof typeof SCA_METHODS];

export const SCA_METHOD_OPTIONS = [
	{ name: 'SMS OTP', value: 'sms_otp' },
	{ name: 'Push Notification', value: 'push_notification' },
	{ name: 'TOTP (Time-based One-Time Password)', value: 'totp' },
	{ name: 'Device Signature', value: 'device_signature' },
	{ name: 'Biometric', value: 'biometric' },
];

/**
 * SCA Challenge Status
 */
export const SCA_CHALLENGE_STATUS = {
	CREATED: 'created',
	PENDING: 'pending',
	VERIFIED: 'verified',
	FAILED: 'failed',
	EXPIRED: 'expired',
} as const;

export type ScaChallengeStatus = typeof SCA_CHALLENGE_STATUS[keyof typeof SCA_CHALLENGE_STATUS];

/**
 * Supported Countries
 */
export const SUPPORTED_COUNTRIES = [
	{ name: 'Germany', value: 'DE' },
	{ name: 'Austria', value: 'AT' },
	{ name: 'Belgium', value: 'BE' },
	{ name: 'Bulgaria', value: 'BG' },
	{ name: 'Croatia', value: 'HR' },
	{ name: 'Cyprus', value: 'CY' },
	{ name: 'Czech Republic', value: 'CZ' },
	{ name: 'Denmark', value: 'DK' },
	{ name: 'Estonia', value: 'EE' },
	{ name: 'Finland', value: 'FI' },
	{ name: 'France', value: 'FR' },
	{ name: 'Greece', value: 'GR' },
	{ name: 'Hungary', value: 'HU' },
	{ name: 'Ireland', value: 'IE' },
	{ name: 'Italy', value: 'IT' },
	{ name: 'Latvia', value: 'LV' },
	{ name: 'Lithuania', value: 'LT' },
	{ name: 'Luxembourg', value: 'LU' },
	{ name: 'Malta', value: 'MT' },
	{ name: 'Netherlands', value: 'NL' },
	{ name: 'Poland', value: 'PL' },
	{ name: 'Portugal', value: 'PT' },
	{ name: 'Romania', value: 'RO' },
	{ name: 'Slovakia', value: 'SK' },
	{ name: 'Slovenia', value: 'SI' },
	{ name: 'Spain', value: 'ES' },
	{ name: 'Sweden', value: 'SE' },
];

/**
 * Currency Codes
 */
export const CURRENCY_CODES = [
	{ name: 'Euro', value: 'EUR' },
	{ name: 'US Dollar', value: 'USD' },
	{ name: 'British Pound', value: 'GBP' },
	{ name: 'Swiss Franc', value: 'CHF' },
];

/**
 * Gender Options
 */
export const GENDER_OPTIONS = [
	{ name: 'Male', value: 'male' },
	{ name: 'Female', value: 'female' },
	{ name: 'Diverse', value: 'diverse' },
];

/**
 * Salutation Options
 */
export const SALUTATION_OPTIONS = [
	{ name: 'Mr.', value: 'mr' },
	{ name: 'Mrs.', value: 'mrs' },
	{ name: 'Ms.', value: 'ms' },
	{ name: 'Dr.', value: 'dr' },
	{ name: 'Prof.', value: 'prof' },
];

/**
 * Report Types
 */
export const REPORT_TYPES = {
	ACCOUNT_STATEMENT: 'account_statement',
	TRANSACTION_REPORT: 'transaction_report',
	CARD_REPORT: 'card_report',
	COMPLIANCE_REPORT: 'compliance_report',
	TAX_REPORT: 'tax_report',
	AUDIT_REPORT: 'audit_report',
} as const;

export type ReportType = typeof REPORT_TYPES[keyof typeof REPORT_TYPES];

export const REPORT_TYPE_OPTIONS = [
	{ name: 'Account Statement', value: 'account_statement' },
	{ name: 'Transaction Report', value: 'transaction_report' },
	{ name: 'Card Report', value: 'card_report' },
	{ name: 'Compliance Report', value: 'compliance_report' },
	{ name: 'Tax Report', value: 'tax_report' },
	{ name: 'Audit Report', value: 'audit_report' },
];

/**
 * Report Format
 */
export const REPORT_FORMATS = {
	PDF: 'pdf',
	CSV: 'csv',
	MT940: 'mt940',
	CAMT053: 'camt053',
} as const;

export type ReportFormat = typeof REPORT_FORMATS[keyof typeof REPORT_FORMATS];

export const REPORT_FORMAT_OPTIONS = [
	{ name: 'PDF', value: 'pdf' },
	{ name: 'CSV', value: 'csv' },
	{ name: 'MT940 (SWIFT)', value: 'mt940' },
	{ name: 'CAMT.053 (ISO 20022)', value: 'camt053' },
];
