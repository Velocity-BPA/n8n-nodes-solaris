/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { solarisApiRequest, solarisApiRequestAllItems } from '../../transport/solarisClient';
import { LOAN_ENDPOINTS } from '../../constants/endpoints';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['loan'],
			},
		},
		options: [
			{ name: 'Create Loan Application', value: 'createApplication', description: 'Create a new loan application', action: 'Create loan application' },
			{ name: 'Get Loan', value: 'get', description: 'Get loan details', action: 'Get a loan' },
			{ name: 'Get Loan Application', value: 'getApplication', description: 'Get loan application details', action: 'Get loan application' },
			{ name: 'Get Loan Balance', value: 'getBalance', description: 'Get current loan balance', action: 'Get loan balance' },
			{ name: 'Get Loan Documents', value: 'getDocuments', description: 'Get loan documents', action: 'Get loan documents' },
			{ name: 'Get Loan Interest', value: 'getInterest', description: 'Get loan interest details', action: 'Get loan interest' },
			{ name: 'Get Loan Status', value: 'getStatus', description: 'Get loan status', action: 'Get loan status' },
			{ name: 'Get Repayment Schedule', value: 'getSchedule', description: 'Get repayment schedule', action: 'Get repayment schedule' },
			{ name: 'List Loans', value: 'list', description: 'List all loans', action: 'List loans' },
			{ name: 'Make Loan Repayment', value: 'repay', description: 'Make a loan repayment', action: 'Make loan repayment' },
		],
		default: 'list',
	},
	// Person ID
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['loan'],
				operation: ['createApplication', 'list'],
			},
		},
		default: '',
		description: 'The person ID',
	},
	// Loan ID
	{
		displayName: 'Loan ID',
		name: 'loanId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['loan'],
				operation: ['get', 'getStatus', 'getBalance', 'getInterest', 'getSchedule', 'getDocuments', 'repay'],
			},
		},
		default: '',
		description: 'The loan ID',
	},
	// Application ID
	{
		displayName: 'Application ID',
		name: 'applicationId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['loan'],
				operation: ['getApplication'],
			},
		},
		default: '',
		description: 'The loan application ID',
	},
	// Loan application fields
	{
		displayName: 'Loan Amount',
		name: 'loanAmount',
		type: 'number',
		typeOptions: {
			numberPrecision: 2,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['loan'],
				operation: ['createApplication'],
			},
		},
		default: 0,
		description: 'Requested loan amount in EUR',
	},
	{
		displayName: 'Term (Months)',
		name: 'termMonths',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['loan'],
				operation: ['createApplication'],
			},
		},
		default: 12,
		description: 'Loan term in months',
	},
	{
		displayName: 'Purpose',
		name: 'purpose',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['loan'],
				operation: ['createApplication'],
			},
		},
		options: [
			{ name: 'Car Purchase', value: 'car_purchase' },
			{ name: 'Debt Consolidation', value: 'debt_consolidation' },
			{ name: 'Education', value: 'education' },
			{ name: 'Home Improvement', value: 'home_improvement' },
			{ name: 'Medical Expenses', value: 'medical' },
			{ name: 'Other', value: 'other' },
			{ name: 'Travel', value: 'travel' },
		],
		default: 'other',
		description: 'Purpose of the loan',
	},
	// Repayment amount
	{
		displayName: 'Repayment Amount',
		name: 'repaymentAmount',
		type: 'number',
		typeOptions: {
			numberPrecision: 2,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['loan'],
				operation: ['repay'],
			},
		},
		default: 0,
		description: 'Repayment amount in EUR',
	},
	// Filter options
	{
		displayName: 'Filter Options',
		name: 'filterOptions',
		type: 'collection',
		placeholder: 'Add Filter',
		displayOptions: {
			show: {
				resource: ['loan'],
				operation: ['list'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Active', value: 'active' },
					{ name: 'Paid Off', value: 'paid_off' },
					{ name: 'Defaulted', value: 'defaulted' },
				],
				default: '',
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
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

	switch (operation) {
		case 'createApplication': {
			const personId = this.getNodeParameter('personId', index) as string;
			const loanAmount = this.getNodeParameter('loanAmount', index) as number;
			const termMonths = this.getNodeParameter('termMonths', index) as number;
			const purpose = this.getNodeParameter('purpose', index) as string;

			responseData = await solarisApiRequest.call(
				this,
				'POST',
				LOAN_ENDPOINTS.CREATE_APPLICATION(personId),
				{
					amount: {
						value: loanAmount,
						currency: 'EUR',
					},
					term_months: termMonths,
					purpose,
				},
			);
			break;
		}

		case 'getApplication': {
			const applicationId = this.getNodeParameter('applicationId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				LOAN_ENDPOINTS.GET_APPLICATION(applicationId),
			);
			break;
		}

		case 'get': {
			const loanId = this.getNodeParameter('loanId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				LOAN_ENDPOINTS.GET(loanId),
			);
			break;
		}

		case 'list': {
			const personId = this.getNodeParameter('personId', index) as string;
			const filterOptions = this.getNodeParameter('filterOptions', index, {}) as {
				returnAll?: boolean;
				status?: string;
			};

			const qs: Record<string, unknown> = {};
			if (filterOptions.status) qs.status = filterOptions.status;

			if (filterOptions.returnAll) {
				responseData = await solarisApiRequestAllItems.call(
					this,
					'GET',
					LOAN_ENDPOINTS.LIST(personId),
					{},
					qs,
				);
			} else {
				responseData = await solarisApiRequest.call(
					this,
					'GET',
					LOAN_ENDPOINTS.LIST(personId),
					{},
					qs,
				);
			}
			break;
		}

		case 'getStatus': {
			const loanId = this.getNodeParameter('loanId', index) as string;
			const loan = await solarisApiRequest.call(
				this,
				'GET',
				LOAN_ENDPOINTS.GET(loanId),
			);
			responseData = {
				loan_id: loanId,
				status: (loan as { status?: string }).status,
			};
			break;
		}

		case 'getSchedule': {
			const loanId = this.getNodeParameter('loanId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				LOAN_ENDPOINTS.SCHEDULE(loanId),
			);
			break;
		}

		case 'repay': {
			const loanId = this.getNodeParameter('loanId', index) as string;
			const repaymentAmount = this.getNodeParameter('repaymentAmount', index) as number;

			responseData = await solarisApiRequest.call(
				this,
				'POST',
				LOAN_ENDPOINTS.REPAY(loanId),
				{
					amount: {
						value: repaymentAmount,
						currency: 'EUR',
					},
				},
			);
			break;
		}

		case 'getBalance': {
			const loanId = this.getNodeParameter('loanId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				LOAN_ENDPOINTS.BALANCE(loanId),
			);
			break;
		}

		case 'getInterest': {
			const loanId = this.getNodeParameter('loanId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				LOAN_ENDPOINTS.INTEREST(loanId),
			);
			break;
		}

		case 'getDocuments': {
			const loanId = this.getNodeParameter('loanId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				LOAN_ENDPOINTS.DOCUMENTS(loanId),
			);
			break;
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData as object;
}
