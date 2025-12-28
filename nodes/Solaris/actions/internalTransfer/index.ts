/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { solarisApiRequest, solarisApiRequestAllItems } from '../../transport/solarisClient';
import { INTERNAL_TRANSFER_ENDPOINTS } from '../../constants/endpoints';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['internalTransfer'],
			},
		},
		options: [
			{ name: 'Cancel Transfer', value: 'cancel', description: 'Cancel an internal transfer', action: 'Cancel a transfer' },
			{ name: 'Create Internal Transfer', value: 'create', description: 'Create an internal transfer between accounts', action: 'Create internal transfer' },
			{ name: 'Get Transfer', value: 'get', description: 'Get internal transfer details', action: 'Get a transfer' },
			{ name: 'Get Transfer Status', value: 'getStatus', description: 'Get transfer status', action: 'Get transfer status' },
			{ name: 'Get Transfers by Account', value: 'getByAccount', description: 'Get transfers for an account', action: 'Get transfers by account' },
		],
		default: 'create',
	},
	// Source Account ID
	{
		displayName: 'Source Account ID',
		name: 'sourceAccountId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['internalTransfer'],
				operation: ['create', 'getByAccount'],
			},
		},
		default: '',
		description: 'The source account ID',
	},
	// Destination Account ID
	{
		displayName: 'Destination Account ID',
		name: 'destinationAccountId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['internalTransfer'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The destination account ID',
	},
	// Transfer ID
	{
		displayName: 'Transfer ID',
		name: 'transferId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['internalTransfer'],
				operation: ['get', 'getStatus', 'cancel'],
			},
		},
		default: '',
		description: 'The unique identifier of the transfer',
	},
	// Amount
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'number',
		typeOptions: {
			numberPrecision: 2,
			minValue: 0.01,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['internalTransfer'],
				operation: ['create'],
			},
		},
		default: 0,
		description: 'Transfer amount in EUR',
	},
	// Reference
	{
		displayName: 'Reference',
		name: 'reference',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['internalTransfer'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Optional transfer reference',
	},
	// Filter options
	{
		displayName: 'Filter Options',
		name: 'filterOptions',
		type: 'collection',
		placeholder: 'Add Filter',
		displayOptions: {
			show: {
				resource: ['internalTransfer'],
				operation: ['getByAccount'],
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
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				description: 'Whether to return all results',
			},
		],
	},
	// Additional options
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['internalTransfer'],
				operation: ['create'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Idempotency Key',
				name: 'idempotencyKey',
				type: 'string',
				default: '',
				description: 'Unique key to prevent duplicate transfers',
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
			const sourceAccountId = this.getNodeParameter('sourceAccountId', index) as string;
			const destinationAccountId = this.getNodeParameter('destinationAccountId', index) as string;
			const amount = this.getNodeParameter('amount', index) as number;
			const reference = this.getNodeParameter('reference', index, '') as string;
			const additionalOptions = this.getNodeParameter('additionalOptions', index, {}) as {
				idempotencyKey?: string;
			};

			const body: Record<string, unknown> = {
				destination_account_id: destinationAccountId,
				amount: {
					value: amount,
					currency: 'EUR',
				},
			};

			if (reference) body.reference = reference;

			const headers: Record<string, string> = {};
			if (additionalOptions.idempotencyKey) {
				headers['Idempotency-Key'] = additionalOptions.idempotencyKey;
			}

			responseData = await solarisApiRequest.call(
				this,
				'POST',
				INTERNAL_TRANSFER_ENDPOINTS.CREATE(sourceAccountId),
				body,
				{},
				headers,
			);
			break;
		}

		case 'get': {
			const transferId = this.getNodeParameter('transferId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				INTERNAL_TRANSFER_ENDPOINTS.GET(transferId),
			);
			break;
		}

		case 'getStatus': {
			const transferId = this.getNodeParameter('transferId', index) as string;
			const transfer = await solarisApiRequest.call(
				this,
				'GET',
				INTERNAL_TRANSFER_ENDPOINTS.GET(transferId),
			);
			responseData = {
				transfer_id: transferId,
				status: (transfer as { status?: string }).status,
			};
			break;
		}

		case 'cancel': {
			const transferId = this.getNodeParameter('transferId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'POST',
				INTERNAL_TRANSFER_ENDPOINTS.CANCEL(transferId),
			);
			break;
		}

		case 'getByAccount': {
			const sourceAccountId = this.getNodeParameter('sourceAccountId', index) as string;
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
					INTERNAL_TRANSFER_ENDPOINTS.BY_ACCOUNT(sourceAccountId),
					{},
					qs,
				);
			} else {
				responseData = await solarisApiRequest.call(
					this,
					'GET',
					INTERNAL_TRANSFER_ENDPOINTS.BY_ACCOUNT(sourceAccountId),
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
