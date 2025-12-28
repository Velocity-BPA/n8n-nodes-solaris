/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Solaris API Endpoints
 *
 * Defines base URLs and API paths for Solaris Banking-as-a-Service platform.
 * Solaris is a German BaFin-regulated banking platform providing embedded
 * banking infrastructure for European fintechs.
 */

export const SOLARIS_ENVIRONMENTS = {
	production: {
		baseUrl: 'https://api.solarisgroup.com',
		authUrl: 'https://auth.solarisgroup.com',
		webhookUrl: 'https://webhooks.solarisgroup.com',
	},
	sandbox: {
		baseUrl: 'https://api.sandbox.solarisgroup.com',
		authUrl: 'https://auth.sandbox.solarisgroup.com',
		webhookUrl: 'https://webhooks.sandbox.solarisgroup.com',
	},
} as const;

export const API_VERSION = 'v1';

/**
 * Person API Endpoints
 * Person = Individual customer in Solaris terminology
 */
export const PERSON_ENDPOINTS = {
	base: '/v1/persons',
	byId: (id: string) => `/v1/persons/${id}`,
	byExternalId: (id: string) => `/v1/persons/external/${id}`,
	status: (id: string) => `/v1/persons/${id}/status`,
	documents: (id: string) => `/v1/persons/${id}/documents`,
	taxInfo: (id: string) => `/v1/persons/${id}/tax_identification`,
	address: (id: string) => `/v1/persons/${id}/address`,
	accounts: (id: string) => `/v1/persons/${id}/accounts`,
	cards: (id: string) => `/v1/persons/${id}/cards`,
	limits: (id: string) => `/v1/persons/${id}/limits`,
	archive: (id: string) => `/v1/persons/${id}/archive`,
} as const;

/**
 * Business API Endpoints
 * Business = Company/corporate customer in Solaris terminology
 */
export const BUSINESS_ENDPOINTS = {
	base: '/v1/businesses',
	byId: (id: string) => `/v1/businesses/${id}`,
	byExternalId: (id: string) => `/v1/businesses/external/${id}`,
	status: (id: string) => `/v1/businesses/${id}/status`,
	representatives: (id: string) => `/v1/businesses/${id}/representatives`,
	representativeById: (businessId: string, repId: string) =>
		`/v1/businesses/${businessId}/representatives/${repId}`,
	documents: (id: string) => `/v1/businesses/${id}/documents`,
	accounts: (id: string) => `/v1/businesses/${id}/accounts`,
	limits: (id: string) => `/v1/businesses/${id}/limits`,
} as const;

/**
 * Identification API Endpoints
 * Identification = KYC verification process (Video-Ident, Bank-Ident, eID)
 */
export const IDENTIFICATION_ENDPOINTS = {
	base: '/v1/identifications',
	byId: (id: string) => `/v1/identifications/${id}`,
	status: (id: string) => `/v1/identifications/${id}/status`,
	videoIdent: '/v1/identifications/video',
	bankIdent: '/v1/identifications/bank',
	eidIdent: '/v1/identifications/eid',
	result: (id: string) => `/v1/identifications/${id}/result`,
	documents: (id: string) => `/v1/identifications/${id}/documents`,
	reidentification: (id: string) => `/v1/identifications/${id}/reidentification`,
	url: (id: string) => `/v1/identifications/${id}/url`,
} as const;

/**
 * Account API Endpoints
 * Account = German IBAN bank account
 */
export const ACCOUNT_ENDPOINTS = {
	base: '/v1/accounts',
	byId: (id: string) => `/v1/accounts/${id}`,
	close: (id: string) => `/v1/accounts/${id}/close`,
	block: (id: string) => `/v1/accounts/${id}/block`,
	unblock: (id: string) => `/v1/accounts/${id}/unblock`,
	balance: (id: string) => `/v1/accounts/${id}/balance`,
	iban: (id: string) => `/v1/accounts/${id}/iban`,
	bic: (id: string) => `/v1/accounts/${id}/bic`,
	statement: (id: string) => `/v1/accounts/${id}/statement`,
	transactions: (id: string) => `/v1/accounts/${id}/transactions`,
	reservations: (id: string) => `/v1/accounts/${id}/reservations`,
	limits: (id: string) => `/v1/accounts/${id}/limits`,
	standingOrders: (id: string) => `/v1/accounts/${id}/standing_orders`,
} as const;

/**
 * Transaction API Endpoints
 * Transaction = Account transaction (booking or reservation)
 */
export const TRANSACTION_ENDPOINTS = {
	base: '/v1/transactions',
	byId: (id: string) => `/v1/transactions/${id}`,
	byReference: (ref: string) => `/v1/transactions/reference/${ref}`,
	status: (id: string) => `/v1/transactions/${id}/status`,
	pending: '/v1/transactions/pending',
	booked: '/v1/transactions/booked',
	search: '/v1/transactions/search',
	export: '/v1/transactions/export',
	categories: '/v1/transactions/categories',
} as const;

/**
 * SEPA Transfer API Endpoints
 * SEPA = Single Euro Payments Area (European payment network)
 */
export const SEPA_TRANSFER_ENDPOINTS = {
	base: '/v1/sepa_credit_transfers',
	instant: '/v1/sepa_instant_credit_transfers',
	byId: (id: string) => `/v1/sepa_credit_transfers/${id}`,
	instantById: (id: string) => `/v1/sepa_instant_credit_transfers/${id}`,
	status: (id: string) => `/v1/sepa_credit_transfers/${id}/status`,
	cancel: (id: string) => `/v1/sepa_credit_transfers/${id}/cancel`,
	fees: '/v1/sepa_credit_transfers/fees',
	batch: '/v1/sepa_credit_transfers/batch',
	batchStatus: (id: string) => `/v1/sepa_credit_transfers/batch/${id}/status`,
	directDebit: '/v1/sepa_direct_debits',
	standingOrders: '/v1/standing_orders',
	standingOrderById: (id: string) => `/v1/standing_orders/${id}`,
	cancelStandingOrder: (id: string) => `/v1/standing_orders/${id}/cancel`,
} as const;

/**
 * Internal Transfer API Endpoints
 * Internal Transfer = Transfer between Solaris accounts
 */
export const INTERNAL_TRANSFER_ENDPOINTS = {
	base: '/v1/internal_transfers',
	byId: (id: string) => `/v1/internal_transfers/${id}`,
	status: (id: string) => `/v1/internal_transfers/${id}/status`,
	cancel: (id: string) => `/v1/internal_transfers/${id}/cancel`,
	byAccount: (accountId: string) => `/v1/accounts/${accountId}/internal_transfers`,
} as const;

/**
 * Card API Endpoints
 * Card = Physical or virtual payment card
 */
export const CARD_ENDPOINTS = {
	base: '/v1/cards',
	byId: (id: string) => `/v1/cards/${id}`,
	activate: (id: string) => `/v1/cards/${id}/activate`,
	block: (id: string) => `/v1/cards/${id}/block`,
	unblock: (id: string) => `/v1/cards/${id}/unblock`,
	replace: (id: string) => `/v1/cards/${id}/replace`,
	close: (id: string) => `/v1/cards/${id}/close`,
	pin: (id: string) => `/v1/cards/${id}/pin`,
	changePin: (id: string) => `/v1/cards/${id}/pin/change`,
	details: (id: string) => `/v1/cards/${id}/details`,
	limits: (id: string) => `/v1/cards/${id}/limits`,
	status: (id: string) => `/v1/cards/${id}/status`,
	representation: (id: string) => `/v1/cards/${id}/representation`,
	virtual: '/v1/cards/virtual',
	walletProvisioning: (id: string) => `/v1/cards/${id}/wallet_provisioning`,
} as const;

/**
 * Card Transaction API Endpoints
 */
export const CARD_TRANSACTION_ENDPOINTS = {
	base: '/v1/card_transactions',
	byId: (id: string) => `/v1/card_transactions/${id}`,
	authorizations: '/v1/card_authorizations',
	authorizationById: (id: string) => `/v1/card_authorizations/${id}`,
	presentment: (id: string) => `/v1/card_transactions/${id}/presentment`,
	clearing: (id: string) => `/v1/card_transactions/${id}/clearing`,
	chargeback: (id: string) => `/v1/card_transactions/${id}/chargeback`,
	dispute: (id: string) => `/v1/card_transactions/${id}/dispute`,
	disputeStatus: (id: string) => `/v1/card_transactions/${id}/dispute/status`,
} as const;

/**
 * Card Control API Endpoints
 * Card Control = Spending limits and restrictions
 */
export const CARD_CONTROL_ENDPOINTS = {
	base: (cardId: string) => `/v1/cards/${cardId}/controls`,
	transactionLimits: (cardId: string) => `/v1/cards/${cardId}/controls/transaction_limits`,
	merchantCategories: (cardId: string) => `/v1/cards/${cardId}/controls/merchant_categories`,
	blockCategory: (cardId: string, category: string) =>
		`/v1/cards/${cardId}/controls/merchant_categories/${category}/block`,
	unblockCategory: (cardId: string, category: string) =>
		`/v1/cards/${cardId}/controls/merchant_categories/${category}/unblock`,
	geographic: (cardId: string) => `/v1/cards/${cardId}/controls/geographic`,
	onlineTransactions: (cardId: string) => `/v1/cards/${cardId}/controls/online_transactions`,
	atmWithdrawals: (cardId: string) => `/v1/cards/${cardId}/controls/atm_withdrawals`,
	contactless: (cardId: string) => `/v1/cards/${cardId}/controls/contactless`,
	history: (cardId: string) => `/v1/cards/${cardId}/controls/history`,
} as const;

/**
 * Direct Debit API Endpoints
 * Direct Debit = SEPA Lastschrift (automatic bank debits)
 */
export const DIRECT_DEBIT_ENDPOINTS = {
	mandates: '/v1/sepa_direct_debit_mandates',
	mandateById: (id: string) => `/v1/sepa_direct_debit_mandates/${id}`,
	activateMandate: (id: string) => `/v1/sepa_direct_debit_mandates/${id}/activate`,
	cancelMandate: (id: string) => `/v1/sepa_direct_debit_mandates/${id}/cancel`,
	mandateStatus: (id: string) => `/v1/sepa_direct_debit_mandates/${id}/status`,
	directDebits: '/v1/sepa_direct_debits',
	directDebitById: (id: string) => `/v1/sepa_direct_debits/${id}`,
	returns: (id: string) => `/v1/sepa_direct_debits/${id}/returns`,
	block: (id: string) => `/v1/sepa_direct_debits/${id}/block`,
} as const;

/**
 * Overdraft API Endpoints
 * Overdraft = Dispositionskredit (German overdraft facility)
 */
export const OVERDRAFT_ENDPOINTS = {
	base: (accountId: string) => `/v1/accounts/${accountId}/overdraft`,
	request: (accountId: string) => `/v1/accounts/${accountId}/overdraft/request`,
	limit: (accountId: string) => `/v1/accounts/${accountId}/overdraft/limit`,
	interestRate: (accountId: string) => `/v1/accounts/${accountId}/overdraft/interest_rate`,
	usage: (accountId: string) => `/v1/accounts/${accountId}/overdraft/usage`,
	history: (accountId: string) => `/v1/accounts/${accountId}/overdraft/history`,
	update: (accountId: string) => `/v1/accounts/${accountId}/overdraft/limit`,
	cancel: (accountId: string) => `/v1/accounts/${accountId}/overdraft/cancel`,
} as const;

/**
 * Loan API Endpoints
 */
export const LOAN_ENDPOINTS = {
	applications: '/v1/loan_applications',
	applicationById: (id: string) => `/v1/loan_applications/${id}`,
	loans: '/v1/loans',
	loanById: (id: string) => `/v1/loans/${id}`,
	status: (id: string) => `/v1/loans/${id}/status`,
	repaymentSchedule: (id: string) => `/v1/loans/${id}/repayment_schedule`,
	repayment: (id: string) => `/v1/loans/${id}/repayment`,
	balance: (id: string) => `/v1/loans/${id}/balance`,
	interest: (id: string) => `/v1/loans/${id}/interest`,
	documents: (id: string) => `/v1/loans/${id}/documents`,
} as const;

/**
 * Savings API Endpoints
 */
export const SAVINGS_ENDPOINTS = {
	accounts: '/v1/savings_accounts',
	accountById: (id: string) => `/v1/savings_accounts/${id}`,
	balance: (id: string) => `/v1/savings_accounts/${id}/balance`,
	interestRate: (id: string) => `/v1/savings_accounts/${id}/interest_rate`,
	interestEarned: (id: string) => `/v1/savings_accounts/${id}/interest_earned`,
	transferTo: (id: string) => `/v1/savings_accounts/${id}/transfer_in`,
	transferFrom: (id: string) => `/v1/savings_accounts/${id}/transfer_out`,
	transactions: (id: string) => `/v1/savings_accounts/${id}/transactions`,
} as const;

/**
 * Tax API Endpoints
 */
export const TAX_ENDPOINTS = {
	info: (personId: string) => `/v1/persons/${personId}/tax_identification`,
	documents: (personId: string) => `/v1/persons/${personId}/tax_documents`,
	withholding: (personId: string) => `/v1/persons/${personId}/tax_withholding`,
	report: (personId: string) => `/v1/persons/${personId}/tax_report`,
	submitId: (personId: string) => `/v1/persons/${personId}/tax_id`,
	residency: (personId: string) => `/v1/persons/${personId}/tax_residency`,
} as const;

/**
 * Document API Endpoints
 */
export const DOCUMENT_ENDPOINTS = {
	base: '/v1/documents',
	byId: (id: string) => `/v1/documents/${id}`,
	byType: (type: string) => `/v1/documents/type/${type}`,
	download: (id: string) => `/v1/documents/${id}/download`,
	status: (id: string) => `/v1/documents/${id}/status`,
	required: '/v1/documents/required',
} as const;

/**
 * Compliance API Endpoints
 * Compliance = AML, PEP, sanctions screening
 */
export const COMPLIANCE_ENDPOINTS = {
	status: (entityId: string) => `/v1/compliance/${entityId}/status`,
	submit: (entityId: string) => `/v1/compliance/${entityId}/data`,
	amlCheck: (entityId: string) => `/v1/compliance/${entityId}/aml`,
	pepCheck: (entityId: string) => `/v1/compliance/${entityId}/pep`,
	sanctionsCheck: (entityId: string) => `/v1/compliance/${entityId}/sanctions`,
	riskAssessment: (entityId: string) => `/v1/compliance/${entityId}/risk`,
	report: (entityId: string) => `/v1/compliance/${entityId}/report`,
	update: (entityId: string) => `/v1/compliance/${entityId}/update`,
	alerts: (entityId: string) => `/v1/compliance/${entityId}/alerts`,
} as const;

/**
 * Webhook API Endpoints
 */
export const WEBHOOK_ENDPOINTS = {
	base: '/v1/webhooks',
	byId: (id: string) => `/v1/webhooks/${id}`,
	test: (id: string) => `/v1/webhooks/${id}/test`,
	events: '/v1/webhooks/events',
	deliveries: (id: string) => `/v1/webhooks/${id}/deliveries`,
} as const;

/**
 * Partner API Endpoints
 */
export const PARTNER_ENDPOINTS = {
	info: '/v1/partner',
	accounts: '/v1/partner/accounts',
	transactions: '/v1/partner/transactions',
	cards: '/v1/partner/cards',
	limits: '/v1/partner/limits',
	statistics: '/v1/partner/statistics',
} as const;

/**
 * Consent API Endpoints
 * Consent = GDPR and marketing consents
 */
export const CONSENT_ENDPOINTS = {
	base: (personId: string) => `/v1/persons/${personId}/consents`,
	byType: (personId: string, type: string) => `/v1/persons/${personId}/consents/${type}`,
	revoke: (personId: string, consentId: string) =>
		`/v1/persons/${personId}/consents/${consentId}/revoke`,
	status: (personId: string, consentId: string) =>
		`/v1/persons/${personId}/consents/${consentId}/status`,
	marketing: (personId: string) => `/v1/persons/${personId}/consents/marketing`,
} as const;

/**
 * Device Binding API Endpoints
 * Device Binding = Secure device registration for SCA
 */
export const DEVICE_BINDING_ENDPOINTS = {
	base: (personId: string) => `/v1/persons/${personId}/device_bindings`,
	byId: (personId: string, bindingId: string) =>
		`/v1/persons/${personId}/device_bindings/${bindingId}`,
	verify: (personId: string, bindingId: string) =>
		`/v1/persons/${personId}/device_bindings/${bindingId}/verify`,
	challenge: (personId: string, bindingId: string) =>
		`/v1/persons/${personId}/device_bindings/${bindingId}/challenge`,
} as const;

/**
 * SCA API Endpoints
 * SCA = Strong Customer Authentication (PSD2 requirement)
 */
export const SCA_ENDPOINTS = {
	challenge: '/v1/sca/challenge',
	status: (challengeId: string) => `/v1/sca/challenge/${challengeId}/status`,
	verify: (challengeId: string) => `/v1/sca/challenge/${challengeId}/verify`,
	methods: (personId: string) => `/v1/persons/${personId}/sca/methods`,
	registerDevice: (personId: string) => `/v1/persons/${personId}/sca/devices`,
	challengeById: (challengeId: string) => `/v1/sca/challenge/${challengeId}`,
} as const;

/**
 * Booking API Endpoints
 * Booking = Posted/finalized transaction
 */
export const BOOKING_ENDPOINTS = {
	base: '/v1/bookings',
	byId: (id: string) => `/v1/bookings/${id}`,
	byReference: (ref: string) => `/v1/bookings/reference/${ref}`,
	categories: '/v1/bookings/categories',
	categorize: (id: string) => `/v1/bookings/${id}/categorize`,
	recurring: '/v1/bookings/recurring',
} as const;

/**
 * Report API Endpoints
 */
export const REPORT_ENDPOINTS = {
	generate: '/v1/reports',
	byId: (id: string) => `/v1/reports/${id}`,
	status: (id: string) => `/v1/reports/${id}/status`,
	download: (id: string) => `/v1/reports/${id}/download`,
	schedule: '/v1/reports/schedule',
	account: (accountId: string) => `/v1/accounts/${accountId}/report`,
	transaction: '/v1/reports/transactions',
} as const;

/**
 * Utility API Endpoints
 */
export const UTILITY_ENDPOINTS = {
	validateIban: '/v1/utilities/validate_iban',
	validateBic: '/v1/utilities/validate_bic',
	bankByBic: (bic: string) => `/v1/utilities/banks/${bic}`,
	countries: '/v1/utilities/countries',
	exchangeRates: '/v1/utilities/exchange_rates',
	status: '/v1/status',
	rateLimits: '/v1/rate_limits',
} as const;
