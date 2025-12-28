/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { solarisApiRequest, solarisApiRequestAllItems } from '../../transport/solarisClient';
import { ACCOUNT_ENDPOINTS } from '../../constants/endpoints';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['account'],
			},
		},
		options: [
			{ name: 'Block Account', value: 'block', description: 'Block an account', action: 'Block an account' },
			{ name: 'Close Account', value: 'close', description: 'Close an account', action: 'Close an account' },
			{ name: 'Create Account', value: 'create', description: 'Create a new bank account', action: 'Create an account' },
			{ name: 'Get Account', value: 'get', description: 'Get account details', action: 'Get an account' },
			{ name: 'Get Balance', value: 'getBalance', description: 'Get account balance', action: 'Get account balance' },
			{ name: 'Get IBAN', value: 'getIban', description: 'Get account IBAN', action: 'Get account IBAN' },
			{ name: 'Get Reservations', value: 'getReservations', description: 'Get pending reservations', action: 'Get account reservations' },
			{ name: 'Get Standing Orders', value: 'getStandingOrders', description: 'Get standing orders', action: 'Get standing orders' },
			{ name: 'Get Statement', value: 'getStatement', description: 'Get account statement', action: 'Get account statement' },
			{ name: 'Get Transactions', value: 'getTransactions', description: 'Get account transactions', action: 'Get account transactions' },
			{ name: 'List Accounts', value: 'list', description: 'List all accounts', action: 'List accounts' },
			{ name: 'Set Limits', value: 'setLimits', description: 'Set account limits', action: 'Set account limits' },
			{ name: 'Unblock Account', value: 'unblock', description: 'Unblock an account', action: 'Unblock an account' },
		],
		default: 'create',
	},
	// Person ID for creating account
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The ID of the person to create the account for',
	},
	// Account ID for operations
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['get', 'close', 'block', 'unblock', 'getBalance', 'getIban', 'getStatement', 'getTransactions', 'getReservations', 'setLimits', 'getStandingOrders'],
			},
		},
		default: '',
		description: 'The unique identifier of the account',
	},
	// Account type for creation
	{
		displayName: 'Account Type',
		name: 'accountType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['create'],
			},
		},
		options: [
			{ name: 'Checking Account', value: 'checking' },
			{ name: 'Savings Account', value: 'savings' },
			{ name: 'Business Account', value: 'business' },
		],
		default: 'checking',
		description: 'Type of account to create',
	},
	// Statement options
	{
		displayName: 'Statement Options',
		name: 'statementOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['getStatement'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Format',
				name: 'format',
				type: 'options',
				options: [
					{ name: 'PDF', value: 'pdf' },
					{ name: 'MT940', value: 'mt940' },
					{ name: 'CAMT.053', value: 'camt053' },
				],
				default: 'pdf',
				description: 'Statement format',
			},
			{
				displayName: 'From Date',
				name: 'fromDate',
				type: 'dateTime',
				default: '',
				description: 'Start date for statement period',
			},
			{
				displayName: 'To Date',
				name: 'toDate',
				type: 'dateTime',
				default: '',
				description: 'End date for statement period',
			},
		],
	},
	// Transaction filters
	{
		displayName: 'Filter Options',
		name: 'filterOptions',
		type: 'collection',
		placeholder: 'Add Filter',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['getTransactions', 'list'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'From Date',
				name: 'fromDate',
				type: 'dateTime',
				default: '',
				description: 'Filter from this date',
			},
			{
				displayName: 'To Date',
				name: 'toDate',
				type: 'dateTime',
				default: '',
				description: 'Filter to this date',
			},
			{
				displayName: 'Page Size',
				name: 'pageSize',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				default: 20,
				description: 'Number of items per page',
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				description: 'Whether to return all results or paginate',
			},
		],
	},
	// Limits configuration
	{
		displayName: 'Limits',
		name: 'limits',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['setLimits'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Limit',
				name: 'limit',
				values: [
					{
						displayName: 'Limit Type',
						name: 'limitType',
						type: 'options',
						options: [
							{ name: 'Daily Transfer Limit', value: 'daily_transfer' },
							{ name: 'Monthly Transfer Limit', value: 'monthly_transfer' },
							{ name: 'Single Transfer Limit', value: 'single_transfer' },
						],
						default: 'daily_transfer',
					},
					{
						displayName: 'Amount',
						name: 'amount',
						type: 'number',
						typeOptions: {
							numberPrecision: 2,
						},
						default: 0,
						description: 'Limit amount in EUR',
					},
				],
			},
		],
	},
	// Additional options for creation
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['create'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'External Reference',
				name: 'externalReference',
				type: 'string',
				default: '',
				description: 'Your external reference for this account',
			},
			{
				displayName: 'Purpose',
				name: 'purpose',
				type: 'string',
				default: '',
				description: 'Purpose of the account',
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
			const accountType = this.getNodeParameter('accountType', index) as string;
			const additionalOptions = this.getNodeParameter('additionalOptions', index, {}) as {
				externalReference?: string;
				purpose?: string;
			};

			const body: Record<string, unknown> = {
				type: accountType,
			};

			if (additionalOptions.externalReference) {
				body.external_reference = additionalOptions.externalReference;
			}
			if (additionalOptions.purpose) {
				body.purpose = additionalOptions.purpose;
			}

			responseData = await solarisApiRequest.call(
				this,
				'POST',
				ACCOUNT_ENDPOINTS.CREATE(personId),
				body,
			);
			break;
		}

		case 'get': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				ACCOUNT_ENDPOINTS.GET(accountId),
			);
			break;
		}

		case 'list': {
			const filterOptions = this.getNodeParameter('filterOptions', index, {}) as {
				returnAll?: boolean;
				pageSize?: number;
				fromDate?: string;
				toDate?: string;
			};

			const qs: Record<string, unknown> = {};
			if (filterOptions.pageSize) qs.size = filterOptions.pageSize;
			if (filterOptions.fromDate) qs.from_date = filterOptions.fromDate;
			if (filterOptions.toDate) qs.to_date = filterOptions.toDate;

			if (filterOptions.returnAll) {
				responseData = await solarisApiRequestAllItems.call(
					this,
					'GET',
					ACCOUNT_ENDPOINTS.LIST,
					{},
					qs,
				);
			} else {
				responseData = await solarisApiRequest.call(
					this,
					'GET',
					ACCOUNT_ENDPOINTS.LIST,
					{},
					qs,
				);
			}
			break;
		}

		case 'close': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'POST',
				ACCOUNT_ENDPOINTS.CLOSE(accountId),
			);
			break;
		}

		case 'block': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'POST',
				ACCOUNT_ENDPOINTS.BLOCK(accountId),
			);
			break;
		}

		case 'unblock': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'POST',
				ACCOUNT_ENDPOINTS.UNBLOCK(accountId),
			);
			break;
		}

		case 'getBalance': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				ACCOUNT_ENDPOINTS.BALANCE(accountId),
			);
			break;
		}

		case 'getIban': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			const account = await solarisApiRequest.call(
				this,
				'GET',
				ACCOUNT_ENDPOINTS.GET(accountId),
			);
			responseData = {
				account_id: accountId,
				iban: (account as { iban?: string }).iban,
				bic: (account as { bic?: string }).bic,
			};
			break;
		}

		case 'getStatement': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			const statementOptions = this.getNodeParameter('statementOptions', index, {}) as {
				format?: string;
				fromDate?: string;
				toDate?: string;
			};

			const qs: Record<string, unknown> = {};
			if (statementOptions.format) qs.format = statementOptions.format;
			if (statementOptions.fromDate) qs.from_date = statementOptions.fromDate;
			if (statementOptions.toDate) qs.to_date = statementOptions.toDate;

			responseData = await solarisApiRequest.call(
				this,
				'GET',
				ACCOUNT_ENDPOINTS.STATEMENT(accountId),
				{},
				qs,
			);
			break;
		}

		case 'getTransactions': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			const filterOptions = this.getNodeParameter('filterOptions', index, {}) as {
				returnAll?: boolean;
				pageSize?: number;
				fromDate?: string;
				toDate?: string;
			};

			const qs: Record<string, unknown> = {};
			if (filterOptions.pageSize) qs.size = filterOptions.pageSize;
			if (filterOptions.fromDate) qs.from_date = filterOptions.fromDate;
			if (filterOptions.toDate) qs.to_date = filterOptions.toDate;

			if (filterOptions.returnAll) {
				responseData = await solarisApiRequestAllItems.call(
					this,
					'GET',
					ACCOUNT_ENDPOINTS.TRANSACTIONS(accountId),
					{},
					qs,
				);
			} else {
				responseData = await solarisApiRequest.call(
					this,
					'GET',
					ACCOUNT_ENDPOINTS.TRANSACTIONS(accountId),
					{},
					qs,
				);
			}
			break;
		}

		case 'getReservations': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				ACCOUNT_ENDPOINTS.RESERVATIONS(accountId),
			);
			break;
		}

		case 'setLimits': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			const limits = this.getNodeParameter('limits', index, {}) as {
				limit?: Array<{
					limitType: string;
					amount: number;
				}>;
			};

			const body: Record<string, unknown> = {};
			if (limits.limit) {
				body.limits = limits.limit.map((l) => ({
					type: l.limitType,
					amount: {
						value: l.amount,
						currency: 'EUR',
					},
				}));
			}

			responseData = await solarisApiRequest.call(
				this,
				'PATCH',
				ACCOUNT_ENDPOINTS.LIMITS(accountId),
				body,
			);
			break;
		}

		case 'getStandingOrders': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				ACCOUNT_ENDPOINTS.STANDING_ORDERS(accountId),
			);
			break;
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData as object;
}
