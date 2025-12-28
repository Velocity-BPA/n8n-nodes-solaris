/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { solarisApiRequest, solarisApiRequestAllItems } from '../../transport/solarisClient';
import { CARD_TRANSACTION_ENDPOINTS } from '../../constants/endpoints';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['cardTransaction'],
			},
		},
		options: [
			{ name: 'Dispute Transaction', value: 'dispute', description: 'Dispute a card transaction', action: 'Dispute a transaction' },
			{ name: 'Get Authorization', value: 'getAuthorization', description: 'Get authorization details', action: 'Get authorization' },
			{ name: 'Get Card Transaction', value: 'get', description: 'Get card transaction details', action: 'Get a card transaction' },
			{ name: 'Get Chargeback', value: 'getChargeback', description: 'Get chargeback details', action: 'Get chargeback' },
			{ name: 'Get Clearing', value: 'getClearing', description: 'Get clearing details', action: 'Get clearing' },
			{ name: 'Get Dispute Status', value: 'getDisputeStatus', description: 'Get dispute status', action: 'Get dispute status' },
			{ name: 'Get Presentment', value: 'getPresentment', description: 'Get presentment details', action: 'Get presentment' },
			{ name: 'List Authorizations', value: 'listAuthorizations', description: 'List card authorizations', action: 'List authorizations' },
			{ name: 'List Card Transactions', value: 'list', description: 'List card transactions', action: 'List card transactions' },
		],
		default: 'list',
	},
	// Card ID
	{
		displayName: 'Card ID',
		name: 'cardId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['cardTransaction'],
				operation: ['list', 'listAuthorizations'],
			},
		},
		default: '',
		description: 'The unique identifier of the card',
	},
	// Transaction ID
	{
		displayName: 'Transaction ID',
		name: 'transactionId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['cardTransaction'],
				operation: ['get', 'dispute', 'getDisputeStatus', 'getClearing', 'getChargeback'],
			},
		},
		default: '',
		description: 'The unique identifier of the transaction',
	},
	// Authorization ID
	{
		displayName: 'Authorization ID',
		name: 'authorizationId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['cardTransaction'],
				operation: ['getAuthorization', 'getPresentment'],
			},
		},
		default: '',
		description: 'The unique identifier of the authorization',
	},
	// Dispute reason
	{
		displayName: 'Dispute Reason',
		name: 'disputeReason',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['cardTransaction'],
				operation: ['dispute'],
			},
		},
		options: [
			{ name: 'Unauthorized Transaction', value: 'unauthorized' },
			{ name: 'Duplicate Transaction', value: 'duplicate' },
			{ name: 'Incorrect Amount', value: 'incorrect_amount' },
			{ name: 'Goods Not Received', value: 'goods_not_received' },
			{ name: 'Goods Not as Described', value: 'goods_not_as_described' },
			{ name: 'Credit Not Processed', value: 'credit_not_processed' },
			{ name: 'Other', value: 'other' },
		],
		default: 'unauthorized',
		description: 'Reason for disputing the transaction',
	},
	// Dispute description
	{
		displayName: 'Dispute Description',
		name: 'disputeDescription',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		displayOptions: {
			show: {
				resource: ['cardTransaction'],
				operation: ['dispute'],
			},
		},
		default: '',
		description: 'Detailed description of the dispute',
	},
	// Filter options
	{
		displayName: 'Filter Options',
		name: 'filterOptions',
		type: 'collection',
		placeholder: 'Add Filter',
		displayOptions: {
			show: {
				resource: ['cardTransaction'],
				operation: ['list', 'listAuthorizations'],
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
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Authorized', value: 'authorized' },
					{ name: 'Cleared', value: 'cleared' },
					{ name: 'Declined', value: 'declined' },
					{ name: 'Reversed', value: 'reversed' },
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
		case 'get': {
			const transactionId = this.getNodeParameter('transactionId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				CARD_TRANSACTION_ENDPOINTS.GET(transactionId),
			);
			break;
		}

		case 'list': {
			const cardId = this.getNodeParameter('cardId', index) as string;
			const filterOptions = this.getNodeParameter('filterOptions', index, {}) as {
				returnAll?: boolean;
				fromDate?: string;
				toDate?: string;
				status?: string;
			};

			const qs: Record<string, unknown> = {};
			if (filterOptions.fromDate) qs.from_date = filterOptions.fromDate;
			if (filterOptions.toDate) qs.to_date = filterOptions.toDate;
			if (filterOptions.status) qs.status = filterOptions.status;

			if (filterOptions.returnAll) {
				responseData = await solarisApiRequestAllItems.call(
					this,
					'GET',
					CARD_TRANSACTION_ENDPOINTS.LIST(cardId),
					{},
					qs,
				);
			} else {
				responseData = await solarisApiRequest.call(
					this,
					'GET',
					CARD_TRANSACTION_ENDPOINTS.LIST(cardId),
					{},
					qs,
				);
			}
			break;
		}

		case 'getAuthorization': {
			const authorizationId = this.getNodeParameter('authorizationId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				CARD_TRANSACTION_ENDPOINTS.AUTHORIZATION(authorizationId),
			);
			break;
		}

		case 'listAuthorizations': {
			const cardId = this.getNodeParameter('cardId', index) as string;
			const filterOptions = this.getNodeParameter('filterOptions', index, {}) as {
				returnAll?: boolean;
				fromDate?: string;
				toDate?: string;
				status?: string;
			};

			const qs: Record<string, unknown> = {};
			if (filterOptions.fromDate) qs.from_date = filterOptions.fromDate;
			if (filterOptions.toDate) qs.to_date = filterOptions.toDate;
			if (filterOptions.status) qs.status = filterOptions.status;

			if (filterOptions.returnAll) {
				responseData = await solarisApiRequestAllItems.call(
					this,
					'GET',
					CARD_TRANSACTION_ENDPOINTS.AUTHORIZATIONS(cardId),
					{},
					qs,
				);
			} else {
				responseData = await solarisApiRequest.call(
					this,
					'GET',
					CARD_TRANSACTION_ENDPOINTS.AUTHORIZATIONS(cardId),
					{},
					qs,
				);
			}
			break;
		}

		case 'getPresentment': {
			const authorizationId = this.getNodeParameter('authorizationId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				CARD_TRANSACTION_ENDPOINTS.PRESENTMENT(authorizationId),
			);
			break;
		}

		case 'getClearing': {
			const transactionId = this.getNodeParameter('transactionId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				CARD_TRANSACTION_ENDPOINTS.CLEARING(transactionId),
			);
			break;
		}

		case 'getChargeback': {
			const transactionId = this.getNodeParameter('transactionId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				CARD_TRANSACTION_ENDPOINTS.CHARGEBACK(transactionId),
			);
			break;
		}

		case 'dispute': {
			const transactionId = this.getNodeParameter('transactionId', index) as string;
			const disputeReason = this.getNodeParameter('disputeReason', index) as string;
			const disputeDescription = this.getNodeParameter('disputeDescription', index, '') as string;

			const body: Record<string, unknown> = {
				reason: disputeReason,
			};

			if (disputeDescription) body.description = disputeDescription;

			responseData = await solarisApiRequest.call(
				this,
				'POST',
				CARD_TRANSACTION_ENDPOINTS.DISPUTE(transactionId),
				body,
			);
			break;
		}

		case 'getDisputeStatus': {
			const transactionId = this.getNodeParameter('transactionId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				CARD_TRANSACTION_ENDPOINTS.DISPUTE_STATUS(transactionId),
			);
			break;
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData as object;
}
