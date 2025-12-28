/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { solarisApiRequest, solarisApiRequestAllItems } from '../../transport/solarisClient';
import { PARTNER_ENDPOINTS } from '../../constants/endpoints';

/**
 * Partner Resource
 * Provides access to partner-level information and aggregated data.
 * Partners are fintech companies using Solaris as their banking infrastructure.
 */

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['partner'],
			},
		},
		options: [
			{ name: 'Get Partner Accounts', value: 'getAccounts', description: 'Get all partner accounts', action: 'Get partner accounts' },
			{ name: 'Get Partner Cards', value: 'getCards', description: 'Get all partner cards', action: 'Get partner cards' },
			{ name: 'Get Partner Info', value: 'getInfo', description: 'Get partner information', action: 'Get partner info' },
			{ name: 'Get Partner Limits', value: 'getLimits', description: 'Get partner limits', action: 'Get partner limits' },
			{ name: 'Get Partner Statistics', value: 'getStatistics', description: 'Get partner statistics', action: 'Get partner statistics' },
			{ name: 'Get Partner Transactions', value: 'getTransactions', description: 'Get partner transactions', action: 'Get partner transactions' },
		],
		default: 'getInfo',
	},
	// Account filters
	{
		displayName: 'Account Filters',
		name: 'accountFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		displayOptions: {
			show: {
				resource: ['partner'],
				operation: ['getAccounts'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Account Type',
				name: 'accountType',
				type: 'options',
				options: [
					{ name: 'Business', value: 'business' },
					{ name: 'Personal', value: 'personal' },
					{ name: 'Savings', value: 'savings' },
				],
				default: '',
				description: 'Filter by account type',
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				description: 'Whether to return all accounts',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Active', value: 'active' },
					{ name: 'Blocked', value: 'blocked' },
					{ name: 'Closed', value: 'closed' },
				],
				default: 'active',
				description: 'Filter by account status',
			},
		],
	},
	// Transaction filters
	{
		displayName: 'Transaction Filters',
		name: 'transactionFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		displayOptions: {
			show: {
				resource: ['partner'],
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
				description: 'Get transactions from this date',
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				description: 'Whether to return all transactions',
			},
			{
				displayName: 'To Date',
				name: 'toDate',
				type: 'dateTime',
				default: '',
				description: 'Get transactions until this date',
			},
			{
				displayName: 'Transaction Type',
				name: 'transactionType',
				type: 'options',
				options: [
					{ name: 'Card', value: 'card' },
					{ name: 'Direct Debit', value: 'direct_debit' },
					{ name: 'Internal', value: 'internal' },
					{ name: 'SEPA', value: 'sepa' },
				],
				default: '',
				description: 'Filter by transaction type',
			},
		],
	},
	// Card filters
	{
		displayName: 'Card Filters',
		name: 'cardFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		displayOptions: {
			show: {
				resource: ['partner'],
				operation: ['getCards'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Card Type',
				name: 'cardType',
				type: 'options',
				options: [
					{ name: 'Physical', value: 'physical' },
					{ name: 'Virtual', value: 'virtual' },
				],
				default: '',
				description: 'Filter by card type',
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				description: 'Whether to return all cards',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Active', value: 'active' },
					{ name: 'Blocked', value: 'blocked' },
					{ name: 'Inactive', value: 'inactive' },
				],
				default: 'active',
				description: 'Filter by card status',
			},
		],
	},
	// Statistics options
	{
		displayName: 'Statistics Options',
		name: 'statisticsOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['partner'],
				operation: ['getStatistics'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'From Date',
				name: 'fromDate',
				type: 'dateTime',
				default: '',
				description: 'Statistics start date',
			},
			{
				displayName: 'Granularity',
				name: 'granularity',
				type: 'options',
				options: [
					{ name: 'Daily', value: 'daily' },
					{ name: 'Monthly', value: 'monthly' },
					{ name: 'Weekly', value: 'weekly' },
				],
				default: 'daily',
				description: 'Statistics granularity',
			},
			{
				displayName: 'To Date',
				name: 'toDate',
				type: 'dateTime',
				default: '',
				description: 'Statistics end date',
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
		case 'getInfo': {
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				PARTNER_ENDPOINTS.info,
			);
			break;
		}

		case 'getAccounts': {
			const accountFilters = this.getNodeParameter('accountFilters', index, {}) as {
				returnAll?: boolean;
				status?: string;
				accountType?: string;
			};

			const qs: Record<string, unknown> = {};
			if (accountFilters.status) qs.status = accountFilters.status;
			if (accountFilters.accountType) qs.type = accountFilters.accountType;

			if (accountFilters.returnAll) {
				responseData = await solarisApiRequestAllItems.call(
					this,
					'GET',
					PARTNER_ENDPOINTS.accounts,
					{},
					qs,
				);
			} else {
				responseData = await solarisApiRequest.call(
					this,
					'GET',
					PARTNER_ENDPOINTS.accounts,
					{},
					qs,
				);
			}
			break;
		}

		case 'getTransactions': {
			const transactionFilters = this.getNodeParameter('transactionFilters', index, {}) as {
				returnAll?: boolean;
				fromDate?: string;
				toDate?: string;
				transactionType?: string;
			};

			const qs: Record<string, unknown> = {};
			if (transactionFilters.fromDate) qs.from_date = transactionFilters.fromDate;
			if (transactionFilters.toDate) qs.to_date = transactionFilters.toDate;
			if (transactionFilters.transactionType) qs.type = transactionFilters.transactionType;

			if (transactionFilters.returnAll) {
				responseData = await solarisApiRequestAllItems.call(
					this,
					'GET',
					PARTNER_ENDPOINTS.transactions,
					{},
					qs,
				);
			} else {
				responseData = await solarisApiRequest.call(
					this,
					'GET',
					PARTNER_ENDPOINTS.transactions,
					{},
					qs,
				);
			}
			break;
		}

		case 'getCards': {
			const cardFilters = this.getNodeParameter('cardFilters', index, {}) as {
				returnAll?: boolean;
				status?: string;
				cardType?: string;
			};

			const qs: Record<string, unknown> = {};
			if (cardFilters.status) qs.status = cardFilters.status;
			if (cardFilters.cardType) qs.type = cardFilters.cardType;

			if (cardFilters.returnAll) {
				responseData = await solarisApiRequestAllItems.call(
					this,
					'GET',
					PARTNER_ENDPOINTS.cards,
					{},
					qs,
				);
			} else {
				responseData = await solarisApiRequest.call(
					this,
					'GET',
					PARTNER_ENDPOINTS.cards,
					{},
					qs,
				);
			}
			break;
		}

		case 'getLimits': {
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				PARTNER_ENDPOINTS.limits,
			);
			break;
		}

		case 'getStatistics': {
			const statisticsOptions = this.getNodeParameter('statisticsOptions', index, {}) as {
				fromDate?: string;
				toDate?: string;
				granularity?: string;
			};

			const qs: Record<string, unknown> = {};
			if (statisticsOptions.fromDate) qs.from_date = statisticsOptions.fromDate;
			if (statisticsOptions.toDate) qs.to_date = statisticsOptions.toDate;
			if (statisticsOptions.granularity) qs.granularity = statisticsOptions.granularity;

			responseData = await solarisApiRequest.call(
				this,
				'GET',
				PARTNER_ENDPOINTS.statistics,
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
