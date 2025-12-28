/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { solarisApiRequest, solarisApiRequestAllItems } from '../../transport/solarisClient';
import { SEPA_TRANSFER_ENDPOINTS } from '../../constants/endpoints';
import { validateIban, validateBic } from '../../utils/validationUtils';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['sepaTransfer'],
			},
		},
		options: [
			{ name: 'Cancel Standing Order', value: 'cancelStandingOrder', description: 'Cancel a standing order', action: 'Cancel standing order' },
			{ name: 'Cancel Transfer', value: 'cancel', description: 'Cancel a SEPA transfer', action: 'Cancel a transfer' },
			{ name: 'Create Batch Transfer', value: 'createBatch', description: 'Create a batch SEPA transfer', action: 'Create batch transfer' },
			{ name: 'Create SEPA Credit Transfer', value: 'createCredit', description: 'Create a SEPA credit transfer', action: 'Create SEPA credit transfer' },
			{ name: 'Create SEPA Instant Transfer', value: 'createInstant', description: 'Create a SEPA instant transfer', action: 'Create SEPA instant transfer' },
			{ name: 'Create Standing Order', value: 'createStandingOrder', description: 'Create a standing order', action: 'Create standing order' },
			{ name: 'Get Batch Status', value: 'getBatchStatus', description: 'Get batch transfer status', action: 'Get batch status' },
			{ name: 'Get Standing Orders', value: 'getStandingOrders', description: 'Get standing orders', action: 'Get standing orders' },
			{ name: 'Get Transfer', value: 'get', description: 'Get SEPA transfer details', action: 'Get a transfer' },
			{ name: 'Get Transfer Fees', value: 'getFees', description: 'Get transfer fee information', action: 'Get transfer fees' },
			{ name: 'Get Transfer Status', value: 'getStatus', description: 'Get transfer status', action: 'Get transfer status' },
		],
		default: 'createCredit',
	},
	// Account ID
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['sepaTransfer'],
				operation: ['createCredit', 'createInstant', 'createBatch', 'createStandingOrder', 'getStandingOrders'],
			},
		},
		default: '',
		description: 'The source account ID',
	},
	// Transfer ID
	{
		displayName: 'Transfer ID',
		name: 'transferId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['sepaTransfer'],
				operation: ['get', 'getStatus', 'cancel', 'getFees'],
			},
		},
		default: '',
		description: 'The unique identifier of the transfer',
	},
	// Batch ID
	{
		displayName: 'Batch ID',
		name: 'batchId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['sepaTransfer'],
				operation: ['getBatchStatus'],
			},
		},
		default: '',
		description: 'The unique identifier of the batch transfer',
	},
	// Standing Order ID
	{
		displayName: 'Standing Order ID',
		name: 'standingOrderId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['sepaTransfer'],
				operation: ['cancelStandingOrder'],
			},
		},
		default: '',
		description: 'The unique identifier of the standing order',
	},
	// Recipient IBAN
	{
		displayName: 'Recipient IBAN',
		name: 'recipientIban',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['sepaTransfer'],
				operation: ['createCredit', 'createInstant', 'createStandingOrder'],
			},
		},
		default: '',
		description: 'The IBAN of the recipient account',
	},
	// Recipient BIC
	{
		displayName: 'Recipient BIC',
		name: 'recipientBic',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['sepaTransfer'],
				operation: ['createCredit', 'createInstant', 'createStandingOrder'],
			},
		},
		default: '',
		description: 'The BIC/SWIFT code of the recipient bank (optional for SEPA)',
	},
	// Recipient Name
	{
		displayName: 'Recipient Name',
		name: 'recipientName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['sepaTransfer'],
				operation: ['createCredit', 'createInstant', 'createStandingOrder'],
			},
		},
		default: '',
		description: 'The name of the recipient',
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
				resource: ['sepaTransfer'],
				operation: ['createCredit', 'createInstant', 'createStandingOrder'],
			},
		},
		default: 0,
		description: 'Transfer amount in EUR',
	},
	// Reference/Description
	{
		displayName: 'Reference',
		name: 'reference',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['sepaTransfer'],
				operation: ['createCredit', 'createInstant', 'createStandingOrder'],
			},
		},
		default: '',
		description: 'Payment reference/description (max 140 characters)',
	},
	// Standing Order specific fields
	{
		displayName: 'Frequency',
		name: 'frequency',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['sepaTransfer'],
				operation: ['createStandingOrder'],
			},
		},
		options: [
			{ name: 'Daily', value: 'daily' },
			{ name: 'Weekly', value: 'weekly' },
			{ name: 'Bi-Weekly', value: 'biweekly' },
			{ name: 'Monthly', value: 'monthly' },
			{ name: 'Quarterly', value: 'quarterly' },
			{ name: 'Semi-Annually', value: 'semiannually' },
			{ name: 'Annually', value: 'annually' },
		],
		default: 'monthly',
		description: 'Frequency of the standing order',
	},
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				resource: ['sepaTransfer'],
				operation: ['createStandingOrder'],
			},
		},
		default: '',
		description: 'Start date of the standing order',
	},
	{
		displayName: 'End Date',
		name: 'endDate',
		type: 'dateTime',
		displayOptions: {
			show: {
				resource: ['sepaTransfer'],
				operation: ['createStandingOrder'],
			},
		},
		default: '',
		description: 'End date of the standing order (optional)',
	},
	// Batch transfers
	{
		displayName: 'Transfers',
		name: 'batchTransfers',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['sepaTransfer'],
				operation: ['createBatch'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Transfer',
				name: 'transfer',
				values: [
					{
						displayName: 'Recipient IBAN',
						name: 'recipientIban',
						type: 'string',
						default: '',
						required: true,
					},
					{
						displayName: 'Recipient Name',
						name: 'recipientName',
						type: 'string',
						default: '',
						required: true,
					},
					{
						displayName: 'Amount',
						name: 'amount',
						type: 'number',
						typeOptions: {
							numberPrecision: 2,
						},
						default: 0,
						required: true,
					},
					{
						displayName: 'Reference',
						name: 'reference',
						type: 'string',
						default: '',
						required: true,
					},
				],
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
				resource: ['sepaTransfer'],
				operation: ['createCredit', 'createInstant'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'End to End ID',
				name: 'endToEndId',
				type: 'string',
				default: '',
				description: 'Unique identifier for end-to-end tracking',
			},
			{
				displayName: 'Execution Date',
				name: 'executionDate',
				type: 'dateTime',
				default: '',
				description: 'Scheduled execution date (for future-dated transfers)',
			},
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
		case 'createCredit': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			const recipientIban = this.getNodeParameter('recipientIban', index) as string;
			const recipientBic = this.getNodeParameter('recipientBic', index, '') as string;
			const recipientName = this.getNodeParameter('recipientName', index) as string;
			const amount = this.getNodeParameter('amount', index) as number;
			const reference = this.getNodeParameter('reference', index) as string;
			const additionalOptions = this.getNodeParameter('additionalOptions', index, {}) as {
				endToEndId?: string;
				executionDate?: string;
				idempotencyKey?: string;
			};

			// Validate IBAN
			const ibanValidation = validateIban(recipientIban);
			if (!ibanValidation.valid) {
				throw new Error(`Invalid IBAN: ${ibanValidation.error}`);
			}

			// Validate BIC if provided
			if (recipientBic) {
				const bicValidation = validateBic(recipientBic);
				if (!bicValidation.valid) {
					throw new Error(`Invalid BIC: ${bicValidation.error}`);
				}
			}

			const body: Record<string, unknown> = {
				recipient_iban: recipientIban.replace(/\s/g, '').toUpperCase(),
				recipient_name: recipientName,
				amount: {
					value: amount,
					currency: 'EUR',
				},
				reference: reference.substring(0, 140),
			};

			if (recipientBic) body.recipient_bic = recipientBic.toUpperCase();
			if (additionalOptions.endToEndId) body.end_to_end_id = additionalOptions.endToEndId;
			if (additionalOptions.executionDate) body.execution_date = additionalOptions.executionDate;

			const headers: Record<string, string> = {};
			if (additionalOptions.idempotencyKey) {
				headers['Idempotency-Key'] = additionalOptions.idempotencyKey;
			}

			responseData = await solarisApiRequest.call(
				this,
				'POST',
				SEPA_TRANSFER_ENDPOINTS.CREATE_CREDIT(accountId),
				body,
				{},
				headers,
			);
			break;
		}

		case 'createInstant': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			const recipientIban = this.getNodeParameter('recipientIban', index) as string;
			const recipientBic = this.getNodeParameter('recipientBic', index, '') as string;
			const recipientName = this.getNodeParameter('recipientName', index) as string;
			const amount = this.getNodeParameter('amount', index) as number;
			const reference = this.getNodeParameter('reference', index) as string;
			const additionalOptions = this.getNodeParameter('additionalOptions', index, {}) as {
				endToEndId?: string;
				idempotencyKey?: string;
			};

			// Validate IBAN
			const ibanValidation = validateIban(recipientIban);
			if (!ibanValidation.valid) {
				throw new Error(`Invalid IBAN: ${ibanValidation.error}`);
			}

			const body: Record<string, unknown> = {
				recipient_iban: recipientIban.replace(/\s/g, '').toUpperCase(),
				recipient_name: recipientName,
				amount: {
					value: amount,
					currency: 'EUR',
				},
				reference: reference.substring(0, 140),
			};

			if (recipientBic) body.recipient_bic = recipientBic.toUpperCase();
			if (additionalOptions.endToEndId) body.end_to_end_id = additionalOptions.endToEndId;

			const headers: Record<string, string> = {};
			if (additionalOptions.idempotencyKey) {
				headers['Idempotency-Key'] = additionalOptions.idempotencyKey;
			}

			responseData = await solarisApiRequest.call(
				this,
				'POST',
				SEPA_TRANSFER_ENDPOINTS.CREATE_INSTANT(accountId),
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
				SEPA_TRANSFER_ENDPOINTS.GET(transferId),
			);
			break;
		}

		case 'getStatus': {
			const transferId = this.getNodeParameter('transferId', index) as string;
			const transfer = await solarisApiRequest.call(
				this,
				'GET',
				SEPA_TRANSFER_ENDPOINTS.GET(transferId),
			);
			responseData = {
				transfer_id: transferId,
				status: (transfer as { status?: string }).status,
				created_at: (transfer as { created_at?: string }).created_at,
			};
			break;
		}

		case 'cancel': {
			const transferId = this.getNodeParameter('transferId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'POST',
				SEPA_TRANSFER_ENDPOINTS.CANCEL(transferId),
			);
			break;
		}

		case 'getFees': {
			const transferId = this.getNodeParameter('transferId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				SEPA_TRANSFER_ENDPOINTS.FEES(transferId),
			);
			break;
		}

		case 'createBatch': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			const batchTransfers = this.getNodeParameter('batchTransfers', index, {}) as {
				transfer?: Array<{
					recipientIban: string;
					recipientName: string;
					amount: number;
					reference: string;
				}>;
			};

			if (!batchTransfers.transfer || batchTransfers.transfer.length === 0) {
				throw new Error('At least one transfer is required for batch processing');
			}

			const transfers = batchTransfers.transfer.map((t) => ({
				recipient_iban: t.recipientIban.replace(/\s/g, '').toUpperCase(),
				recipient_name: t.recipientName,
				amount: {
					value: t.amount,
					currency: 'EUR',
				},
				reference: t.reference.substring(0, 140),
			}));

			responseData = await solarisApiRequest.call(
				this,
				'POST',
				SEPA_TRANSFER_ENDPOINTS.CREATE_BATCH(accountId),
				{ transfers },
			);
			break;
		}

		case 'getBatchStatus': {
			const batchId = this.getNodeParameter('batchId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				SEPA_TRANSFER_ENDPOINTS.BATCH_STATUS(batchId),
			);
			break;
		}

		case 'createStandingOrder': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			const recipientIban = this.getNodeParameter('recipientIban', index) as string;
			const recipientBic = this.getNodeParameter('recipientBic', index, '') as string;
			const recipientName = this.getNodeParameter('recipientName', index) as string;
			const amount = this.getNodeParameter('amount', index) as number;
			const reference = this.getNodeParameter('reference', index) as string;
			const frequency = this.getNodeParameter('frequency', index) as string;
			const startDate = this.getNodeParameter('startDate', index) as string;
			const endDate = this.getNodeParameter('endDate', index, '') as string;

			const body: Record<string, unknown> = {
				recipient_iban: recipientIban.replace(/\s/g, '').toUpperCase(),
				recipient_name: recipientName,
				amount: {
					value: amount,
					currency: 'EUR',
				},
				reference: reference.substring(0, 140),
				frequency,
				start_date: startDate,
			};

			if (recipientBic) body.recipient_bic = recipientBic.toUpperCase();
			if (endDate) body.end_date = endDate;

			responseData = await solarisApiRequest.call(
				this,
				'POST',
				SEPA_TRANSFER_ENDPOINTS.CREATE_STANDING_ORDER(accountId),
				body,
			);
			break;
		}

		case 'getStandingOrders': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			responseData = await solarisApiRequestAllItems.call(
				this,
				'GET',
				SEPA_TRANSFER_ENDPOINTS.STANDING_ORDERS(accountId),
			);
			break;
		}

		case 'cancelStandingOrder': {
			const standingOrderId = this.getNodeParameter('standingOrderId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'DELETE',
				SEPA_TRANSFER_ENDPOINTS.CANCEL_STANDING_ORDER(standingOrderId),
			);
			break;
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData as object;
}
