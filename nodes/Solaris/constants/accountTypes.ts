/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Account Types
 * Types of bank accounts supported by Solaris
 */
export const ACCOUNT_TYPES = {
	CHECKING: 'checking',
	SAVINGS: 'savings',
	BUSINESS: 'business',
	POOLED: 'pooled',
	SEGREGATED: 'segregated',
} as const;

export type AccountType = typeof ACCOUNT_TYPES[keyof typeof ACCOUNT_TYPES];

export const ACCOUNT_TYPE_OPTIONS = [
	{ name: 'Checking Account', value: 'checking' },
	{ name: 'Savings Account', value: 'savings' },
	{ name: 'Business Account', value: 'business' },
	{ name: 'Pooled Account', value: 'pooled' },
	{ name: 'Segregated Account', value: 'segregated' },
];

/**
 * Account Status
 */
export const ACCOUNT_STATUS = {
	ACTIVE: 'active',
	BLOCKED: 'blocked',
	CLOSED: 'closed',
	PENDING: 'pending',
	BLOCKED_INCOMING: 'blocked_incoming',
	BLOCKED_OUTGOING: 'blocked_outgoing',
} as const;

export type AccountStatus = typeof ACCOUNT_STATUS[keyof typeof ACCOUNT_STATUS];

/**
 * Transaction Types
 */
export const TRANSACTION_TYPES = {
	SEPA_CREDIT_TRANSFER: 'sepa_credit_transfer',
	SEPA_INSTANT_CREDIT_TRANSFER: 'sepa_instant_credit_transfer',
	SEPA_DIRECT_DEBIT: 'sepa_direct_debit',
	INTERNAL_TRANSFER: 'internal_transfer',
	CARD_TRANSACTION: 'card_transaction',
	ATM_WITHDRAWAL: 'atm_withdrawal',
	CARD_PAYMENT: 'card_payment',
	FEE: 'fee',
	INTEREST: 'interest',
	LOAN_DISBURSEMENT: 'loan_disbursement',
	LOAN_REPAYMENT: 'loan_repayment',
	STANDING_ORDER: 'standing_order',
	DIRECT_DEBIT_RETURN: 'direct_debit_return',
} as const;

export type TransactionType = typeof TRANSACTION_TYPES[keyof typeof TRANSACTION_TYPES];

export const TRANSACTION_TYPE_OPTIONS = [
	{ name: 'SEPA Credit Transfer', value: 'sepa_credit_transfer' },
	{ name: 'SEPA Instant Credit Transfer', value: 'sepa_instant_credit_transfer' },
	{ name: 'SEPA Direct Debit', value: 'sepa_direct_debit' },
	{ name: 'Internal Transfer', value: 'internal_transfer' },
	{ name: 'Card Transaction', value: 'card_transaction' },
	{ name: 'ATM Withdrawal', value: 'atm_withdrawal' },
	{ name: 'Card Payment', value: 'card_payment' },
	{ name: 'Fee', value: 'fee' },
	{ name: 'Interest', value: 'interest' },
	{ name: 'Loan Disbursement', value: 'loan_disbursement' },
	{ name: 'Loan Repayment', value: 'loan_repayment' },
	{ name: 'Standing Order', value: 'standing_order' },
	{ name: 'Direct Debit Return', value: 'direct_debit_return' },
];

/**
 * Transaction Status
 */
export const TRANSACTION_STATUS = {
	PENDING: 'pending',
	BOOKED: 'booked',
	DECLINED: 'declined',
	CANCELLED: 'cancelled',
	REVERSED: 'reversed',
	FAILED: 'failed',
} as const;

export type TransactionStatus = typeof TRANSACTION_STATUS[keyof typeof TRANSACTION_STATUS];

/**
 * SEPA Scheme Types
 */
export const SEPA_SCHEME_TYPES = {
	CORE: 'CORE',
	COR1: 'COR1',
	B2B: 'B2B',
	INST: 'INST',
} as const;

export type SepaSchemeType = typeof SEPA_SCHEME_TYPES[keyof typeof SEPA_SCHEME_TYPES];

/**
 * Direct Debit Types
 */
export const DIRECT_DEBIT_TYPES = {
	FIRST: 'FRST',
	RECURRING: 'RCUR',
	FINAL: 'FNAL',
	ONE_OFF: 'OOFF',
} as const;

export type DirectDebitType = typeof DIRECT_DEBIT_TYPES[keyof typeof DIRECT_DEBIT_TYPES];

/**
 * Standing Order Frequency
 */
export const STANDING_ORDER_FREQUENCY = {
	DAILY: 'daily',
	WEEKLY: 'weekly',
	BIWEEKLY: 'biweekly',
	MONTHLY: 'monthly',
	QUARTERLY: 'quarterly',
	SEMIANNUALLY: 'semiannually',
	ANNUALLY: 'annually',
} as const;

export type StandingOrderFrequency = typeof STANDING_ORDER_FREQUENCY[keyof typeof STANDING_ORDER_FREQUENCY];

export const STANDING_ORDER_FREQUENCY_OPTIONS = [
	{ name: 'Daily', value: 'daily' },
	{ name: 'Weekly', value: 'weekly' },
	{ name: 'Biweekly', value: 'biweekly' },
	{ name: 'Monthly', value: 'monthly' },
	{ name: 'Quarterly', value: 'quarterly' },
	{ name: 'Semiannually', value: 'semiannually' },
	{ name: 'Annually', value: 'annually' },
];
