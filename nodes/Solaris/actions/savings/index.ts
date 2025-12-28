/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { solarisApiRequest, solarisApiRequestAllItems } from '../../transport/solarisClient';
import { SAVINGS_ENDPOINTS } from '../../constants/endpoints';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['savings'],
			},
		},
		options: [
			{ name: 'Create Savings Account', value: 'create', description: 'Create a savings account', action: 'Create savings account' },
			{ name: 'Get Interest Earned', value: 'getInterestEarned', description: 'Get interest earned', action: 'Get interest earned' },
			{ name: 'Get Interest Rate', value: 'getInterestRate', description: 'Get current interest rate', action: 'Get interest rate' },
			{ name: 'Get Savings Account', value: 'get', description: 'Get savings account details', action: 'Get savings account' },
			{ name: 'Get Savings Balance', value: 'getBalance', description: 'Get savings balance', action: 'Get savings balance' },
			{ name: 'Get Savings Transactions', value: 'getTransactions', description: 'Get savings transactions', action: 'Get savings transactions' },
			{ name: 'Transfer from Savings', value: 'transferFrom', description: 'Transfer from savings to checking', action: 'Transfer from savings' },
			{ name: 'Transfer to Savings', value: 'transferTo', description: 'Transfer to savings from checking', action: 'Transfer to savings' },
		],
		default: 'get',
	},
	// Person ID
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['savings'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The person ID',
	},
	// Savings Account ID
	{
		displayName: 'Savings Account ID',
		name: 'savingsAccountId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['savings'],
				operation: ['get', 'getBalance', 'getInterestRate', 'getInterestEarned', 'getTransactions', 'transferTo', 'transferFrom'],
			},
		},
		default: '',
		description: 'The savings account ID',
	},
	// Checking Account ID for transfers
	{
		displayName: 'Checking Account ID',
		name: 'checkingAccountId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['savings'],
				operation: ['transferTo', 'transferFrom'],
			},
		},
		default: '',
		description: 'The checking account ID',
	},
	// Transfer amount
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'number',
		typeOptions: {
			numberPrecision: 2,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['savings'],
				operation: ['transferTo', 'transferFrom'],
			},
		},
		default: 0,
		description: 'Transfer amount in EUR',
	},
	// Filter options
	{
		displayName: 'Filter Options',
		name: 'filterOptions',
		type: 'collection',
		placeholder: 'Add Filter',
		displayOptions: {
			show: {
				resource: ['savings'],
				operation: ['getTransactions'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'From Date',
				name: 'fromDate',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'To Date',
				name: 'toDate',
				type: 'dateTime',
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
		case 'create': {
			const personId = this.getNodeParameter('personId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'POST',
				SAVINGS_ENDPOINTS.CREATE(personId),
				{ type: 'savings' },
			);
			break;
		}

		case 'get': {
			const savingsAccountId = this.getNodeParameter('savingsAccountId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				SAVINGS_ENDPOINTS.GET(savingsAccountId),
			);
			break;
		}

		case 'getBalance': {
			const savingsAccountId = this.getNodeParameter('savingsAccountId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				SAVINGS_ENDPOINTS.BALANCE(savingsAccountId),
			);
			break;
		}

		case 'getInterestRate': {
			const savingsAccountId = this.getNodeParameter('savingsAccountId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				SAVINGS_ENDPOINTS.INTEREST_RATE(savingsAccountId),
			);
			break;
		}

		case 'getInterestEarned': {
			const savingsAccountId = this.getNodeParameter('savingsAccountId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				SAVINGS_ENDPOINTS.INTEREST_EARNED(savingsAccountId),
			);
			break;
		}

		case 'transferTo': {
			const savingsAccountId = this.getNodeParameter('savingsAccountId', index) as string;
			const checkingAccountId = this.getNodeParameter('checkingAccountId', index) as string;
			const amount = this.getNodeParameter('amount', index) as number;

			responseData = await solarisApiRequest.call(
				this,
				'POST',
				SAVINGS_ENDPOINTS.TRANSFER_TO(savingsAccountId),
				{
					source_account_id: checkingAccountId,
					amount: {
						value: amount,
						currency: 'EUR',
					},
				},
			);
			break;
		}

		case 'transferFrom': {
			const savingsAccountId = this.getNodeParameter('savingsAccountId', index) as string;
			const checkingAccountId = this.getNodeParameter('checkingAccountId', index) as string;
			const amount = this.getNodeParameter('amount', index) as number;

			responseData = await solarisApiRequest.call(
				this,
				'POST',
				SAVINGS_ENDPOINTS.TRANSFER_FROM(savingsAccountId),
				{
					destination_account_id: checkingAccountId,
					amount: {
						value: amount,
						currency: 'EUR',
					},
				},
			);
			break;
		}

		case 'getTransactions': {
			const savingsAccountId = this.getNodeParameter('savingsAccountId', index) as string;
			const filterOptions = this.getNodeParameter('filterOptions', index, {}) as {
				returnAll?: boolean;
				fromDate?: string;
				toDate?: string;
			};

			const qs: Record<string, unknown> = {};
			if (filterOptions.fromDate) qs.from_date = filterOptions.fromDate;
			if (filterOptions.toDate) qs.to_date = filterOptions.toDate;

			if (filterOptions.returnAll) {
				responseData = await solarisApiRequestAllItems.call(
					this,
					'GET',
					SAVINGS_ENDPOINTS.TRANSACTIONS(savingsAccountId),
					{},
					qs,
				);
			} else {
				responseData = await solarisApiRequest.call(
					this,
					'GET',
					SAVINGS_ENDPOINTS.TRANSACTIONS(savingsAccountId),
					{},
					qs,
				);
			}
			break;
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData as object;
}
