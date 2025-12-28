/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Webhook Event Types
 * All event types available for Solaris webhooks
 */
export const WEBHOOK_EVENT_TYPES = {
	// Person Events
	PERSON_CREATED: 'person.created',
	PERSON_UPDATED: 'person.updated',
	PERSON_IDENTIFICATION_PENDING: 'person.identification_pending',
	PERSON_IDENTIFIED: 'person.identified',
	PERSON_BLOCKED: 'person.blocked',
	PERSON_UNBLOCKED: 'person.unblocked',
	PERSON_ARCHIVED: 'person.archived',

	// Business Events
	BUSINESS_CREATED: 'business.created',
	BUSINESS_UPDATED: 'business.updated',
	BUSINESS_IDENTIFIED: 'business.identified',
	BUSINESS_BLOCKED: 'business.blocked',
	BUSINESS_UNBLOCKED: 'business.unblocked',

	// Identification Events
	IDENTIFICATION_CREATED: 'identification.created',
	IDENTIFICATION_STARTED: 'identification.started',
	IDENTIFICATION_PENDING: 'identification.pending',
	IDENTIFICATION_SUCCESSFUL: 'identification.successful',
	IDENTIFICATION_FAILED: 'identification.failed',
	IDENTIFICATION_EXPIRED: 'identification.expired',

	// Account Events
	ACCOUNT_CREATED: 'account.created',
	ACCOUNT_ACTIVATED: 'account.activated',
	ACCOUNT_BLOCKED: 'account.blocked',
	ACCOUNT_UNBLOCKED: 'account.unblocked',
	ACCOUNT_CLOSED: 'account.closed',
	ACCOUNT_BALANCE_CHANGED: 'account.balance_changed',

	// Reservation Events
	RESERVATION_CREATED: 'reservation.created',
	RESERVATION_UPDATED: 'reservation.updated',
	RESERVATION_RELEASED: 'reservation.released',
	RESERVATION_RESOLVED: 'reservation.resolved',

	// Transaction Events
	TRANSACTION_CREATED: 'transaction.created',
	TRANSACTION_BOOKED: 'transaction.booked',
	TRANSACTION_PENDING: 'transaction.pending',
	TRANSACTION_FAILED: 'transaction.failed',
	TRANSACTION_REVERSED: 'transaction.reversed',
	TRANSACTION_CANCELLED: 'transaction.cancelled',

	// SEPA Transfer Events
	SEPA_TRANSFER_CREATED: 'sepa_credit_transfer.created',
	SEPA_TRANSFER_SUBMITTED: 'sepa_credit_transfer.submitted',
	SEPA_TRANSFER_EXECUTED: 'sepa_credit_transfer.executed',
	SEPA_TRANSFER_FAILED: 'sepa_credit_transfer.failed',
	SEPA_TRANSFER_RETURNED: 'sepa_credit_transfer.returned',
	SEPA_INSTANT_TRANSFER_CREATED: 'sepa_instant_credit_transfer.created',
	SEPA_INSTANT_TRANSFER_EXECUTED: 'sepa_instant_credit_transfer.executed',
	SEPA_INSTANT_TRANSFER_FAILED: 'sepa_instant_credit_transfer.failed',

	// Incoming Transfer Events
	INCOMING_TRANSFER_RECEIVED: 'incoming_transfer.received',
	INCOMING_INSTANT_TRANSFER_RECEIVED: 'incoming_instant_transfer.received',

	// Card Events
	CARD_CREATED: 'card.created',
	CARD_ACTIVATED: 'card.activated',
	CARD_BLOCKED: 'card.blocked',
	CARD_UNBLOCKED: 'card.unblocked',
	CARD_CLOSED: 'card.closed',
	CARD_REPLACED: 'card.replaced',
	CARD_SHIPPED: 'card.shipped',
	CARD_DELIVERED: 'card.delivered',
	CARD_PIN_SET: 'card.pin_set',
	CARD_PIN_CHANGED: 'card.pin_changed',

	// Card Transaction Events
	CARD_AUTHORIZATION_CREATED: 'card_authorization.created',
	CARD_AUTHORIZATION_DECLINED: 'card_authorization.declined',
	CARD_AUTHORIZATION_REVERSED: 'card_authorization.reversed',
	CARD_AUTHORIZATION_UPDATED: 'card_authorization.updated',
	CARD_PRESENTMENT_CREATED: 'card_presentment.created',
	CARD_CLEARING_CREATED: 'card_clearing.created',
	CARD_CHARGEBACK_CREATED: 'card_chargeback.created',

	// Direct Debit Events
	MANDATE_CREATED: 'sepa_direct_debit_mandate.created',
	MANDATE_ACTIVATED: 'sepa_direct_debit_mandate.activated',
	MANDATE_CANCELLED: 'sepa_direct_debit_mandate.cancelled',
	DIRECT_DEBIT_CREATED: 'sepa_direct_debit.created',
	DIRECT_DEBIT_EXECUTED: 'sepa_direct_debit.executed',
	DIRECT_DEBIT_RETURNED: 'sepa_direct_debit.returned',
	DIRECT_DEBIT_REVERSED: 'sepa_direct_debit.reversed',

	// Standing Order Events
	STANDING_ORDER_CREATED: 'standing_order.created',
	STANDING_ORDER_EXECUTED: 'standing_order.executed',
	STANDING_ORDER_FAILED: 'standing_order.failed',
	STANDING_ORDER_CANCELLED: 'standing_order.cancelled',

	// Overdraft Events
	OVERDRAFT_REQUESTED: 'overdraft.requested',
	OVERDRAFT_APPROVED: 'overdraft.approved',
	OVERDRAFT_DENIED: 'overdraft.denied',
	OVERDRAFT_ACTIVATED: 'overdraft.activated',
	OVERDRAFT_USED: 'overdraft.used',
	OVERDRAFT_REPAID: 'overdraft.repaid',
	OVERDRAFT_CANCELLED: 'overdraft.cancelled',

	// Loan Events
	LOAN_APPLICATION_CREATED: 'loan_application.created',
	LOAN_APPLICATION_APPROVED: 'loan_application.approved',
	LOAN_APPLICATION_DENIED: 'loan_application.denied',
	LOAN_DISBURSED: 'loan.disbursed',
	LOAN_REPAYMENT_DUE: 'loan.repayment_due',
	LOAN_REPAYMENT_RECEIVED: 'loan.repayment_received',
	LOAN_REPAID: 'loan.repaid',
	LOAN_DEFAULT: 'loan.default',

	// Compliance Events
	COMPLIANCE_CHECK_REQUIRED: 'compliance.check_required',
	COMPLIANCE_CHECK_STARTED: 'compliance.check_started',
	COMPLIANCE_CHECK_COMPLETED: 'compliance.check_completed',
	COMPLIANCE_ALERT: 'compliance.alert',
	COMPLIANCE_DOCUMENT_REQUIRED: 'compliance.document_required',
	RISK_ASSESSMENT_UPDATED: 'risk_assessment.updated',

	// SCA Events
	SCA_REQUIRED: 'sca.required',
	SCA_CHALLENGE_CREATED: 'sca.challenge_created',
	SCA_CHALLENGE_VERIFIED: 'sca.challenge_verified',
	SCA_CHALLENGE_FAILED: 'sca.challenge_failed',
	SCA_CHALLENGE_EXPIRED: 'sca.challenge_expired',

	// Device Binding Events
	DEVICE_BINDING_CREATED: 'device_binding.created',
	DEVICE_BINDING_VERIFIED: 'device_binding.verified',
	DEVICE_BINDING_DELETED: 'device_binding.deleted',
} as const;

export type WebhookEventType = typeof WEBHOOK_EVENT_TYPES[keyof typeof WEBHOOK_EVENT_TYPES];

/**
 * Webhook Event Options for n8n UI
 * Grouped by category for better organization
 */
export const WEBHOOK_EVENT_OPTIONS = [
	// Person Events
	{ name: 'Person - Created', value: 'person.created' },
	{ name: 'Person - Updated', value: 'person.updated' },
	{ name: 'Person - Identified', value: 'person.identified' },
	{ name: 'Person - Blocked', value: 'person.blocked' },
	{ name: 'Person - Archived', value: 'person.archived' },

	// Business Events
	{ name: 'Business - Created', value: 'business.created' },
	{ name: 'Business - Updated', value: 'business.updated' },
	{ name: 'Business - Identified', value: 'business.identified' },
	{ name: 'Business - Blocked', value: 'business.blocked' },

	// Identification Events
	{ name: 'Identification - Started', value: 'identification.started' },
	{ name: 'Identification - Successful', value: 'identification.successful' },
	{ name: 'Identification - Failed', value: 'identification.failed' },
	{ name: 'Identification - Expired', value: 'identification.expired' },

	// Account Events
	{ name: 'Account - Created', value: 'account.created' },
	{ name: 'Account - Blocked', value: 'account.blocked' },
	{ name: 'Account - Unblocked', value: 'account.unblocked' },
	{ name: 'Account - Closed', value: 'account.closed' },
	{ name: 'Account - Balance Changed', value: 'account.balance_changed' },

	// Reservation Events
	{ name: 'Reservation - Created', value: 'reservation.created' },
	{ name: 'Reservation - Released', value: 'reservation.released' },
	{ name: 'Reservation - Resolved', value: 'reservation.resolved' },

	// Transaction Events
	{ name: 'Transaction - Created', value: 'transaction.created' },
	{ name: 'Transaction - Booked', value: 'transaction.booked' },
	{ name: 'Transaction - Pending', value: 'transaction.pending' },
	{ name: 'Transaction - Failed', value: 'transaction.failed' },
	{ name: 'Transaction - Reversed', value: 'transaction.reversed' },

	// SEPA Transfer Events
	{ name: 'SEPA Transfer - Created', value: 'sepa_credit_transfer.created' },
	{ name: 'SEPA Transfer - Executed', value: 'sepa_credit_transfer.executed' },
	{ name: 'SEPA Transfer - Failed', value: 'sepa_credit_transfer.failed' },
	{ name: 'SEPA Transfer - Returned', value: 'sepa_credit_transfer.returned' },
	{ name: 'SEPA Instant Transfer - Created', value: 'sepa_instant_credit_transfer.created' },
	{ name: 'SEPA Instant Transfer - Executed', value: 'sepa_instant_credit_transfer.executed' },
	{ name: 'SEPA Instant Transfer - Failed', value: 'sepa_instant_credit_transfer.failed' },

	// Incoming Transfer Events
	{ name: 'Incoming Transfer - Received', value: 'incoming_transfer.received' },
	{ name: 'Incoming Instant Transfer - Received', value: 'incoming_instant_transfer.received' },

	// Card Events
	{ name: 'Card - Created', value: 'card.created' },
	{ name: 'Card - Activated', value: 'card.activated' },
	{ name: 'Card - Blocked', value: 'card.blocked' },
	{ name: 'Card - Unblocked', value: 'card.unblocked' },
	{ name: 'Card - Closed', value: 'card.closed' },
	{ name: 'Card - Shipped', value: 'card.shipped' },
	{ name: 'Card - Delivered', value: 'card.delivered' },

	// Card Transaction Events
	{ name: 'Card Authorization - Created', value: 'card_authorization.created' },
	{ name: 'Card Authorization - Declined', value: 'card_authorization.declined' },
	{ name: 'Card Authorization - Reversed', value: 'card_authorization.reversed' },
	{ name: 'Card Presentment - Created', value: 'card_presentment.created' },
	{ name: 'Card Chargeback - Created', value: 'card_chargeback.created' },

	// Direct Debit Events
	{ name: 'Mandate - Created', value: 'sepa_direct_debit_mandate.created' },
	{ name: 'Mandate - Activated', value: 'sepa_direct_debit_mandate.activated' },
	{ name: 'Mandate - Cancelled', value: 'sepa_direct_debit_mandate.cancelled' },
	{ name: 'Direct Debit - Created', value: 'sepa_direct_debit.created' },
	{ name: 'Direct Debit - Executed', value: 'sepa_direct_debit.executed' },
	{ name: 'Direct Debit - Returned', value: 'sepa_direct_debit.returned' },

	// Standing Order Events
	{ name: 'Standing Order - Created', value: 'standing_order.created' },
	{ name: 'Standing Order - Executed', value: 'standing_order.executed' },
	{ name: 'Standing Order - Failed', value: 'standing_order.failed' },
	{ name: 'Standing Order - Cancelled', value: 'standing_order.cancelled' },

	// Overdraft Events
	{ name: 'Overdraft - Requested', value: 'overdraft.requested' },
	{ name: 'Overdraft - Approved', value: 'overdraft.approved' },
	{ name: 'Overdraft - Denied', value: 'overdraft.denied' },
	{ name: 'Overdraft - Used', value: 'overdraft.used' },
	{ name: 'Overdraft - Repaid', value: 'overdraft.repaid' },

	// Loan Events
	{ name: 'Loan Application - Created', value: 'loan_application.created' },
	{ name: 'Loan Application - Approved', value: 'loan_application.approved' },
	{ name: 'Loan Application - Denied', value: 'loan_application.denied' },
	{ name: 'Loan - Disbursed', value: 'loan.disbursed' },
	{ name: 'Loan - Repayment Due', value: 'loan.repayment_due' },
	{ name: 'Loan - Repaid', value: 'loan.repaid' },

	// Compliance Events
	{ name: 'Compliance - Check Required', value: 'compliance.check_required' },
	{ name: 'Compliance - Check Completed', value: 'compliance.check_completed' },
	{ name: 'Compliance - Alert', value: 'compliance.alert' },
	{ name: 'Compliance - Document Required', value: 'compliance.document_required' },

	// SCA Events
	{ name: 'SCA - Required', value: 'sca.required' },
	{ name: 'SCA - Challenge Verified', value: 'sca.challenge_verified' },
	{ name: 'SCA - Challenge Failed', value: 'sca.challenge_failed' },

	// Device Binding Events
	{ name: 'Device Binding - Created', value: 'device_binding.created' },
	{ name: 'Device Binding - Verified', value: 'device_binding.verified' },
	{ name: 'Device Binding - Deleted', value: 'device_binding.deleted' },
];
