/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { solarisApiRequest } from '../../transport/solarisClient';
import { COMPLIANCE_ENDPOINTS } from '../../constants/endpoints';

/**
 * Compliance Resource
 * Manages AML (Anti-Money Laundering), PEP (Politically Exposed Persons),
 * sanctions screening, and risk assessment for German banking compliance.
 * Required by BaFin (Federal Financial Supervisory Authority) regulations.
 */

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['compliance'],
			},
		},
		options: [
			{ name: 'Get AML Check', value: 'getAmlCheck', description: 'Get Anti-Money Laundering check results', action: 'Get AML check' },
			{ name: 'Get Compliance Alerts', value: 'getAlerts', description: 'Get compliance alerts for an entity', action: 'Get compliance alerts' },
			{ name: 'Get Compliance Report', value: 'getReport', description: 'Get full compliance report', action: 'Get compliance report' },
			{ name: 'Get Compliance Status', value: 'getStatus', description: 'Get overall compliance status', action: 'Get compliance status' },
			{ name: 'Get PEP Check', value: 'getPepCheck', description: 'Get Politically Exposed Persons check results', action: 'Get PEP check' },
			{ name: 'Get Risk Assessment', value: 'getRiskAssessment', description: 'Get risk assessment results', action: 'Get risk assessment' },
			{ name: 'Get Sanctions Check', value: 'getSanctionsCheck', description: 'Get sanctions screening results', action: 'Get sanctions check' },
			{ name: 'Submit Compliance Data', value: 'submitData', description: 'Submit compliance data for review', action: 'Submit compliance data' },
			{ name: 'Update Compliance Information', value: 'updateInfo', description: 'Update compliance information', action: 'Update compliance information' },
		],
		default: 'getStatus',
	},
	// Entity ID - required for all operations
	{
		displayName: 'Entity ID',
		name: 'entityId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['compliance'],
			},
		},
		default: '',
		description: 'The person or business ID',
	},
	// Compliance data for submit
	{
		displayName: 'Compliance Data',
		name: 'complianceData',
		type: 'collection',
		placeholder: 'Add Field',
		required: true,
		displayOptions: {
			show: {
				resource: ['compliance'],
				operation: ['submitData'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Beneficial Owners',
				name: 'beneficialOwners',
				type: 'json',
				default: '[]',
				description: 'JSON array of beneficial owners (for businesses)',
			},
			{
				displayName: 'Business Activity',
				name: 'businessActivity',
				type: 'string',
				default: '',
				description: 'Description of business activities',
			},
			{
				displayName: 'Expected Monthly Transaction Volume',
				name: 'expectedMonthlyVolume',
				type: 'number',
				default: 0,
				description: 'Expected monthly transaction volume in EUR',
			},
			{
				displayName: 'Expected Monthly Transactions',
				name: 'expectedMonthlyTransactions',
				type: 'number',
				default: 0,
				description: 'Expected number of monthly transactions',
			},
			{
				displayName: 'Purpose of Account',
				name: 'purposeOfAccount',
				type: 'options',
				options: [
					{ name: 'Business Operations', value: 'business_operations' },
					{ name: 'Investment', value: 'investment' },
					{ name: 'Payroll', value: 'payroll' },
					{ name: 'Personal', value: 'personal' },
					{ name: 'Savings', value: 'savings' },
				],
				default: 'personal',
				description: 'Purpose of the account',
			},
			{
				displayName: 'Source of Funds',
				name: 'sourceOfFunds',
				type: 'options',
				options: [
					{ name: 'Business Revenue', value: 'business_revenue' },
					{ name: 'Employment', value: 'employment' },
					{ name: 'Inheritance', value: 'inheritance' },
					{ name: 'Investment', value: 'investment' },
					{ name: 'Savings', value: 'savings' },
				],
				default: 'employment',
				description: 'Primary source of funds',
			},
		],
	},
	// Update fields
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['compliance'],
				operation: ['updateInfo'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Business Activity Changed',
				name: 'businessActivityChanged',
				type: 'boolean',
				default: false,
				description: 'Whether business activity has changed',
			},
			{
				displayName: 'New Business Activity',
				name: 'newBusinessActivity',
				type: 'string',
				default: '',
				description: 'Updated business activity description',
			},
			{
				displayName: 'Ownership Changed',
				name: 'ownershipChanged',
				type: 'boolean',
				default: false,
				description: 'Whether ownership structure has changed',
			},
			{
				displayName: 'PEP Status Changed',
				name: 'pepStatusChanged',
				type: 'boolean',
				default: false,
				description: 'Whether PEP status has changed',
			},
			{
				displayName: 'Risk Profile Changed',
				name: 'riskProfileChanged',
				type: 'boolean',
				default: false,
				description: 'Whether risk profile has changed',
			},
		],
	},
	// Alert filters
	{
		displayName: 'Alert Filters',
		name: 'alertFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		displayOptions: {
			show: {
				resource: ['compliance'],
				operation: ['getAlerts'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Alert Type',
				name: 'alertType',
				type: 'options',
				options: [
					{ name: 'AML', value: 'aml' },
					{ name: 'Document Expiry', value: 'document_expiry' },
					{ name: 'PEP', value: 'pep' },
					{ name: 'Sanctions', value: 'sanctions' },
					{ name: 'Suspicious Activity', value: 'suspicious_activity' },
				],
				default: '',
				description: 'Filter by alert type',
			},
			{
				displayName: 'Since Date',
				name: 'sinceDate',
				type: 'dateTime',
				default: '',
				description: 'Get alerts since this date',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Active', value: 'active' },
					{ name: 'Dismissed', value: 'dismissed' },
					{ name: 'Resolved', value: 'resolved' },
				],
				default: 'active',
				description: 'Filter by alert status',
			},
		],
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
	operation: string,
): Promise<object> {
	let responseData;
	const entityId = this.getNodeParameter('entityId', index) as string;

	switch (operation) {
		case 'getStatus': {
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				COMPLIANCE_ENDPOINTS.status(entityId),
			);
			break;
		}

		case 'submitData': {
			const complianceData = this.getNodeParameter('complianceData', index, {}) as {
				sourceOfFunds?: string;
				purposeOfAccount?: string;
				expectedMonthlyTransactions?: number;
				expectedMonthlyVolume?: number;
				businessActivity?: string;
				beneficialOwners?: string;
			};

			const body: Record<string, unknown> = {};
			if (complianceData.sourceOfFunds) body.source_of_funds = complianceData.sourceOfFunds;
			if (complianceData.purposeOfAccount) body.purpose_of_account = complianceData.purposeOfAccount;
			if (complianceData.expectedMonthlyTransactions) {
				body.expected_monthly_transactions = complianceData.expectedMonthlyTransactions;
			}
			if (complianceData.expectedMonthlyVolume) {
				body.expected_monthly_volume = {
					value: complianceData.expectedMonthlyVolume,
					currency: 'EUR',
				};
			}
			if (complianceData.businessActivity) body.business_activity = complianceData.businessActivity;
			if (complianceData.beneficialOwners) {
				try {
					body.beneficial_owners = JSON.parse(complianceData.beneficialOwners);
				} catch {
					throw new Error('Invalid JSON for beneficial owners');
				}
			}

			responseData = await solarisApiRequest.call(
				this,
				'POST',
				COMPLIANCE_ENDPOINTS.submit(entityId),
				body,
			);
			break;
		}

		case 'getAmlCheck': {
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				COMPLIANCE_ENDPOINTS.amlCheck(entityId),
			);
			break;
		}

		case 'getPepCheck': {
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				COMPLIANCE_ENDPOINTS.pepCheck(entityId),
			);
			break;
		}

		case 'getSanctionsCheck': {
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				COMPLIANCE_ENDPOINTS.sanctionsCheck(entityId),
			);
			break;
		}

		case 'getRiskAssessment': {
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				COMPLIANCE_ENDPOINTS.riskAssessment(entityId),
			);
			break;
		}

		case 'getReport': {
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				COMPLIANCE_ENDPOINTS.report(entityId),
			);
			break;
		}

		case 'updateInfo': {
			const updateFields = this.getNodeParameter('updateFields', index, {}) as {
				pepStatusChanged?: boolean;
				ownershipChanged?: boolean;
				businessActivityChanged?: boolean;
				newBusinessActivity?: string;
				riskProfileChanged?: boolean;
			};

			const body: Record<string, unknown> = {};
			if (updateFields.pepStatusChanged !== undefined) {
				body.pep_status_changed = updateFields.pepStatusChanged;
			}
			if (updateFields.ownershipChanged !== undefined) {
				body.ownership_changed = updateFields.ownershipChanged;
			}
			if (updateFields.businessActivityChanged !== undefined) {
				body.business_activity_changed = updateFields.businessActivityChanged;
			}
			if (updateFields.newBusinessActivity) {
				body.business_activity = updateFields.newBusinessActivity;
			}
			if (updateFields.riskProfileChanged !== undefined) {
				body.risk_profile_changed = updateFields.riskProfileChanged;
			}

			responseData = await solarisApiRequest.call(
				this,
				'PATCH',
				COMPLIANCE_ENDPOINTS.update(entityId),
				body,
			);
			break;
		}

		case 'getAlerts': {
			const alertFilters = this.getNodeParameter('alertFilters', index, {}) as {
				status?: string;
				alertType?: string;
				sinceDate?: string;
			};

			const qs: Record<string, unknown> = {};
			if (alertFilters.status) qs.status = alertFilters.status;
			if (alertFilters.alertType) qs.type = alertFilters.alertType;
			if (alertFilters.sinceDate) qs.since = alertFilters.sinceDate;

			responseData = await solarisApiRequest.call(
				this,
				'GET',
				COMPLIANCE_ENDPOINTS.alerts(entityId),
				{},
				qs,
			);
			break;
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData as object;
}
