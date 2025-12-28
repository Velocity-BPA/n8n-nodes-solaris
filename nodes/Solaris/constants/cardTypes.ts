/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Card Types
 */
export const CARD_TYPES = {
	VIRTUAL: 'virtual',
	PHYSICAL: 'physical',
	VIRTUAL_PHYSICAL: 'virtual_physical',
} as const;

export type CardType = typeof CARD_TYPES[keyof typeof CARD_TYPES];

export const CARD_TYPE_OPTIONS = [
	{ name: 'Virtual Card', value: 'virtual' },
	{ name: 'Physical Card', value: 'physical' },
	{ name: 'Virtual + Physical Card', value: 'virtual_physical' },
];

/**
 * Card Status
 */
export const CARD_STATUS = {
	INACTIVE: 'inactive',
	ACTIVE: 'active',
	BLOCKED: 'blocked',
	BLOCKED_BY_SOLARIS: 'blocked_by_solaris',
	CLOSED: 'closed',
	PROCESSING: 'processing',
	SHIPPED: 'shipped',
	DELIVERED: 'delivered',
} as const;

export type CardStatus = typeof CARD_STATUS[keyof typeof CARD_STATUS];

/**
 * Card Brand
 */
export const CARD_BRANDS = {
	MASTERCARD: 'mastercard',
	VISA: 'visa',
} as const;

export type CardBrand = typeof CARD_BRANDS[keyof typeof CARD_BRANDS];

export const CARD_BRAND_OPTIONS = [
	{ name: 'Mastercard', value: 'mastercard' },
	{ name: 'Visa', value: 'visa' },
];

/**
 * Card Block Reason
 */
export const CARD_BLOCK_REASONS = {
	LOST: 'lost',
	STOLEN: 'stolen',
	FRAUD: 'fraud',
	CUSTOMER_REQUEST: 'customer_request',
	COMPLIANCE: 'compliance',
	OTHER: 'other',
} as const;

export type CardBlockReason = typeof CARD_BLOCK_REASONS[keyof typeof CARD_BLOCK_REASONS];

export const CARD_BLOCK_REASON_OPTIONS = [
	{ name: 'Lost', value: 'lost' },
	{ name: 'Stolen', value: 'stolen' },
	{ name: 'Fraud', value: 'fraud' },
	{ name: 'Customer Request', value: 'customer_request' },
	{ name: 'Compliance', value: 'compliance' },
	{ name: 'Other', value: 'other' },
];

/**
 * Merchant Category Codes (MCC)
 * Common categories for card controls
 */
export const MERCHANT_CATEGORIES = {
	AIRLINES: '3000-3299',
	AUTOMOTIVE: '5500-5599',
	CLOTHING: '5600-5699',
	DIGITAL_GOODS: '5815-5818',
	ENTERTAINMENT: '7800-7999',
	FINANCIAL_SERVICES: '6010-6099',
	FOOD_AND_BEVERAGE: '5800-5899',
	GAMBLING: '7800-7802',
	GAS_STATIONS: '5541-5542',
	GROCERIES: '5411-5499',
	HEALTHCARE: '8000-8099',
	HOTELS: '3500-3999',
	PROFESSIONAL_SERVICES: '8000-8999',
	RESTAURANTS: '5811-5814',
	RETAIL: '5300-5399',
	SUPERMARKETS: '5411',
	TELECOMMUNICATIONS: '4812-4816',
	TRAVEL: '4700-4799',
	UTILITIES: '4900',
} as const;

export const MERCHANT_CATEGORY_OPTIONS = [
	{ name: 'Airlines', value: '3000-3299' },
	{ name: 'Automotive', value: '5500-5599' },
	{ name: 'Clothing', value: '5600-5699' },
	{ name: 'Digital Goods', value: '5815-5818' },
	{ name: 'Entertainment', value: '7800-7999' },
	{ name: 'Financial Services', value: '6010-6099' },
	{ name: 'Food and Beverage', value: '5800-5899' },
	{ name: 'Gambling', value: '7800-7802' },
	{ name: 'Gas Stations', value: '5541-5542' },
	{ name: 'Groceries', value: '5411-5499' },
	{ name: 'Healthcare', value: '8000-8099' },
	{ name: 'Hotels', value: '3500-3999' },
	{ name: 'Professional Services', value: '8000-8999' },
	{ name: 'Restaurants', value: '5811-5814' },
	{ name: 'Retail', value: '5300-5399' },
	{ name: 'Supermarkets', value: '5411' },
	{ name: 'Telecommunications', value: '4812-4816' },
	{ name: 'Travel', value: '4700-4799' },
	{ name: 'Utilities', value: '4900' },
];

/**
 * Card Transaction Status
 */
export const CARD_TRANSACTION_STATUS = {
	AUTHORIZED: 'authorized',
	DECLINED: 'declined',
	CLEARED: 'cleared',
	REVERSED: 'reversed',
	REFUNDED: 'refunded',
	DISPUTED: 'disputed',
	CHARGEBACKED: 'chargebacked',
} as const;

export type CardTransactionStatus = typeof CARD_TRANSACTION_STATUS[keyof typeof CARD_TRANSACTION_STATUS];

/**
 * Card Authorization Status
 */
export const AUTHORIZATION_STATUS = {
	PENDING: 'pending',
	APPROVED: 'approved',
	DECLINED: 'declined',
	REVERSED: 'reversed',
	EXPIRED: 'expired',
} as const;

export type AuthorizationStatus = typeof AUTHORIZATION_STATUS[keyof typeof AUTHORIZATION_STATUS];

/**
 * Mobile Wallet Types
 */
export const MOBILE_WALLET_TYPES = {
	APPLE_PAY: 'apple_pay',
	GOOGLE_PAY: 'google_pay',
	SAMSUNG_PAY: 'samsung_pay',
} as const;

export type MobileWalletType = typeof MOBILE_WALLET_TYPES[keyof typeof MOBILE_WALLET_TYPES];

export const MOBILE_WALLET_OPTIONS = [
	{ name: 'Apple Pay', value: 'apple_pay' },
	{ name: 'Google Pay', value: 'google_pay' },
	{ name: 'Samsung Pay', value: 'samsung_pay' },
];

/**
 * Card Limit Types
 */
export const CARD_LIMIT_TYPES = {
	DAILY_TRANSACTION: 'daily_transaction',
	DAILY_ATM: 'daily_atm',
	MONTHLY_TRANSACTION: 'monthly_transaction',
	SINGLE_TRANSACTION: 'single_transaction',
	SINGLE_ATM: 'single_atm',
	CONTACTLESS_SINGLE: 'contactless_single',
	ONLINE_SINGLE: 'online_single',
} as const;

export type CardLimitType = typeof CARD_LIMIT_TYPES[keyof typeof CARD_LIMIT_TYPES];

export const CARD_LIMIT_TYPE_OPTIONS = [
	{ name: 'Daily Transaction Limit', value: 'daily_transaction' },
	{ name: 'Daily ATM Limit', value: 'daily_atm' },
	{ name: 'Monthly Transaction Limit', value: 'monthly_transaction' },
	{ name: 'Single Transaction Limit', value: 'single_transaction' },
	{ name: 'Single ATM Limit', value: 'single_atm' },
	{ name: 'Contactless Single Limit', value: 'contactless_single' },
	{ name: 'Online Single Limit', value: 'online_single' },
];
