/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { solarisApiRequest, solarisApiRequestAllItems } from '../../transport/solarisClient';
import { TRANSACTION_ENDPOINTS } from '../../constants/endpoints';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['transaction'],
			},
		},
		options: [
			{ name: 'Export Transactions', value: 'export', description: 'Export transactions to file', action: 'Export transactions' },
			{ name: 'Get Booked Transactions', value: 'getBooked', description: 'Get booked transactions', action: 'Get booked transactions' },
			{ name: 'Get Categories', value: 'getCategories', description: 'Get transaction categories', action: 'Get transaction categories' },
			{ name: 'Get Pending Transactions', value: 'getPending', description: 'Get pending transactions', action: 'Get pending transactions' },
			{ name: 'Get Transaction', value: 'get', description: 'Get transaction details', action: 'Get a transaction' },
			{ name: 'Get Transaction Status', value: 'getStatus', description: 'Get transaction status', action: 'Get transaction status' },
			{ name: 'Get Transactions by Account', value: 'getByAccount', description: 'Get transactions for an account', action: 'Get transactions by account' },
			{ name: 'Get Transaction by Reference', value: 'getByReference', description: 'Get transaction by reference', action: 'Get transaction by reference' },
			{ name: 'List Transactions', value: 'list', description: 'List all transactions', action: 'List transactions' },
			{ name: 'Search Transactions', value: 'search', description: 'Search transactions', action: 'Search transactions' },
		],
		default: 'list',
	},
	// Transaction ID
	{
		displayName: 'Transaction ID',
		name: 'transactionId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['get', 'getStatus'],
			},
		},
		default: '',
		description: 'The unique identifier of the transaction',
	},
	// Account ID
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['getByAccount', 'getPending', 'getBooked', 'export'],
			},
		},
		default: '',
		description: 'The unique identifier of the account',
	},
	// Reference
	{
		displayName: 'Reference',
		name: 'reference',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['getByReference'],
			},
		},
		default: '',
		description: 'The transaction reference',
	},
	// Search query
	{
		displayName: 'Search Query',
		name: 'searchQuery',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['search'],
			},
		},
		default: '',
		description: 'Search query for transactions',
	},
	// Export format
	{
		displayName: 'Export Format',
		name: 'exportFormat',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['export'],
			},
		},
		options: [
			{ name: 'CSV', value: 'csv' },
			{ name: 'MT940', value: 'mt940' },
			{ name: 'CAMT.053', value: 'camt053' },
		],
		default: 'csv',
		description: 'Export file format',
	},
	// Filter options
	{
		displayName: 'Filter Options',
		name: 'filterOptions',
		type: 'collection',
		placeholder: 'Add Filter',
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['list', 'getByAccount', 'getPending', 'getBooked', 'search', 'export'],
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
				displayName: 'Transaction Type',
				name: 'transactionType',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Card Transaction', value: 'card_transaction' },
					{ name: 'Direct Debit', value: 'direct_debit' },
					{ name: 'Internal Transfer', value: 'internal_transfer' },
					{ name: 'SEPA Credit Transfer', value: 'sepa_credit_transfer' },
					{ name: 'SEPA Direct Debit', value: 'sepa_direct_debit' },
				],
				default: '',
				description: 'Filter by transaction type',
			},
			{
				displayName: 'Min Amount',
				name: 'minAmount',
				type: 'number',
				typeOptions: {
					numberPrecision: 2,
				},
				default: 0,
				description: 'Minimum transaction amount',
			},
			{
				displayName: 'Max Amount',
				name: 'maxAmount',
				type: 'number',
				typeOptions: {
					numberPrecision: 2,
				},
				default: 0,
				description: 'Maximum transaction amount',
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
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
	operation: string,
): Promise<object> {
	let responseData;

	switch (operation) {
		case 'get': {
			const transactionId = this.getNodeParameter('transactionId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				TRANSACTION_ENDPOINTS.GET(transactionId),
			);
			break;
		}

		case 'list': {
			const filterOptions = this.getNodeParameter('filterOptions', index, {}) as {
				returnAll?: boolean;
				pageSize?: number;
				fromDate?: string;
				toDate?: string;
				transactionType?: string;
				minAmount?: number;
				maxAmount?: number;
			};

			const qs: Record<string, unknown> = {};
			if (filterOptions.pageSize) qs.size = filterOptions.pageSize;
			if (filterOptions.fromDate) qs.from_date = filterOptions.fromDate;
			if (filterOptions.toDate) qs.to_date = filterOptions.toDate;
			if (filterOptions.transactionType) qs.type = filterOptions.transactionType;
			if (filterOptions.minAmount) qs.min_amount = filterOptions.minAmount;
			if (filterOptions.maxAmount) qs.max_amount = filterOptions.maxAmount;

			if (filterOptions.returnAll) {
				responseData = await solarisApiRequestAllItems.call(
					this,
					'GET',
					TRANSACTION_ENDPOINTS.LIST,
					{},
					qs,
				);
			} else {
				responseData = await solarisApiRequest.call(
					this,
					'GET',
					TRANSACTION_ENDPOINTS.LIST,
					{},
					qs,
				);
			}
			break;
		}

		case 'getByAccount': {
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
					TRANSACTION_ENDPOINTS.BY_ACCOUNT(accountId),
					{},
					qs,
				);
			} else {
				responseData = await solarisApiRequest.call(
					this,
					'GET',
					TRANSACTION_ENDPOINTS.BY_ACCOUNT(accountId),
					{},
					qs,
				);
			}
			break;
		}

		case 'getByReference': {
			const reference = this.getNodeParameter('reference', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				TRANSACTION_ENDPOINTS.BY_REFERENCE(reference),
			);
			break;
		}

		case 'getStatus': {
			const transactionId = this.getNodeParameter('transactionId', index) as string;
			const transaction = await solarisApiRequest.call(
				this,
				'GET',
				TRANSACTION_ENDPOINTS.GET(transactionId),
			);
			responseData = {
				transaction_id: transactionId,
				status: (transaction as { status?: string }).status,
			};
			break;
		}

		case 'getPending': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			const filterOptions = this.getNodeParameter('filterOptions', index, {}) as {
				returnAll?: boolean;
			};

			const qs: Record<string, unknown> = { status: 'pending' };

			if (filterOptions.returnAll) {
				responseData = await solarisApiRequestAllItems.call(
					this,
					'GET',
					TRANSACTION_ENDPOINTS.BY_ACCOUNT(accountId),
					{},
					qs,
				);
			} else {
				responseData = await solarisApiRequest.call(
					this,
					'GET',
					TRANSACTION_ENDPOINTS.BY_ACCOUNT(accountId),
					{},
					qs,
				);
			}
			break;
		}

		case 'getBooked': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			const filterOptions = this.getNodeParameter('filterOptions', index, {}) as {
				returnAll?: boolean;
				fromDate?: string;
				toDate?: string;
			};

			const qs: Record<string, unknown> = { status: 'booked' };
			if (filterOptions.fromDate) qs.from_date = filterOptions.fromDate;
			if (filterOptions.toDate) qs.to_date = filterOptions.toDate;

			if (filterOptions.returnAll) {
				responseData = await solarisApiRequestAllItems.call(
					this,
					'GET',
					TRANSACTION_ENDPOINTS.BY_ACCOUNT(accountId),
					{},
					qs,
				);
			} else {
				responseData = await solarisApiRequest.call(
					this,
					'GET',
					TRANSACTION_ENDPOINTS.BY_ACCOUNT(accountId),
					{},
					qs,
				);
			}
			break;
		}

		case 'search': {
			const searchQuery = this.getNodeParameter('searchQuery', index) as string;
			const filterOptions = this.getNodeParameter('filterOptions', index, {}) as {
				returnAll?: boolean;
				fromDate?: string;
				toDate?: string;
			};

			const qs: Record<string, unknown> = { q: searchQuery };
			if (filterOptions.fromDate) qs.from_date = filterOptions.fromDate;
			if (filterOptions.toDate) qs.to_date = filterOptions.toDate;

			if (filterOptions.returnAll) {
				responseData = await solarisApiRequestAllItems.call(
					this,
					'GET',
					TRANSACTION_ENDPOINTS.SEARCH,
					{},
					qs,
				);
			} else {
				responseData = await solarisApiRequest.call(
					this,
					'GET',
					TRANSACTION_ENDPOINTS.SEARCH,
					{},
					qs,
				);
			}
			break;
		}

		case 'export': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			const exportFormat = this.getNodeParameter('exportFormat', index) as string;
			const filterOptions = this.getNodeParameter('filterOptions', index, {}) as {
				fromDate?: string;
				toDate?: string;
			};

			const qs: Record<string, unknown> = { format: exportFormat };
			if (filterOptions.fromDate) qs.from_date = filterOptions.fromDate;
			if (filterOptions.toDate) qs.to_date = filterOptions.toDate;

			responseData = await solarisApiRequest.call(
				this,
				'GET',
				TRANSACTION_ENDPOINTS.EXPORT(accountId),
				{},
				qs,
			);
			break;
		}

		case 'getCategories': {
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				TRANSACTION_ENDPOINTS.CATEGORIES,
			);
			break;
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData as object;
}
