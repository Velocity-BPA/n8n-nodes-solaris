/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { solarisApiRequest, solarisApiRequestAllItems } from '../../transport/solarisClient';
import { DIRECT_DEBIT_ENDPOINTS } from '../../constants/endpoints';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['directDebit'],
			},
		},
		options: [
			{ name: 'Activate Mandate', value: 'activateMandate', description: 'Activate a direct debit mandate', action: 'Activate mandate' },
			{ name: 'Block Direct Debit', value: 'block', description: 'Block a direct debit', action: 'Block direct debit' },
			{ name: 'Cancel Mandate', value: 'cancelMandate', description: 'Cancel a direct debit mandate', action: 'Cancel mandate' },
			{ name: 'Create Direct Debit', value: 'createDebit', description: 'Create a direct debit', action: 'Create direct debit' },
			{ name: 'Create Mandate', value: 'createMandate', description: 'Create a direct debit mandate', action: 'Create mandate' },
			{ name: 'Get Direct Debit', value: 'getDebit', description: 'Get direct debit details', action: 'Get direct debit' },
			{ name: 'Get Direct Debit Returns', value: 'getReturns', description: 'Get returned direct debits', action: 'Get direct debit returns' },
			{ name: 'Get Mandate', value: 'getMandate', description: 'Get mandate details', action: 'Get mandate' },
			{ name: 'Get Mandate Status', value: 'getMandateStatus', description: 'Get mandate status', action: 'Get mandate status' },
			{ name: 'List Mandates', value: 'listMandates', description: 'List all mandates', action: 'List mandates' },
		],
		default: 'listMandates',
	},
	// Account ID
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['directDebit'],
				operation: ['createMandate', 'listMandates', 'createDebit', 'getReturns'],
			},
		},
		default: '',
		description: 'The account ID',
	},
	// Mandate ID
	{
		displayName: 'Mandate ID',
		name: 'mandateId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['directDebit'],
				operation: ['getMandate', 'getMandateStatus', 'activateMandate', 'cancelMandate', 'createDebit'],
			},
		},
		default: '',
		description: 'The mandate ID',
	},
	// Direct Debit ID
	{
		displayName: 'Direct Debit ID',
		name: 'directDebitId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['directDebit'],
				operation: ['getDebit', 'block'],
			},
		},
		default: '',
		description: 'The direct debit ID',
	},
	// Mandate fields
	{
		displayName: 'Creditor Name',
		name: 'creditorName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['directDebit'],
				operation: ['createMandate'],
			},
		},
		default: '',
		description: 'Name of the creditor',
	},
	{
		displayName: 'Creditor IBAN',
		name: 'creditorIban',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['directDebit'],
				operation: ['createMandate'],
			},
		},
		default: '',
		description: 'IBAN of the creditor',
	},
	{
		displayName: 'Creditor Identifier',
		name: 'creditorIdentifier',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['directDebit'],
				operation: ['createMandate'],
			},
		},
		default: '',
		description: 'Creditor identifier (Gläubiger-ID)',
	},
	{
		displayName: 'Mandate Reference',
		name: 'mandateReference',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['directDebit'],
				operation: ['createMandate'],
			},
		},
		default: '',
		description: 'Unique mandate reference',
	},
	{
		displayName: 'Sequence Type',
		name: 'sequenceType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['directDebit'],
				operation: ['createMandate', 'createDebit'],
			},
		},
		options: [
			{ name: 'First (FRST)', value: 'FRST' },
			{ name: 'Recurring (RCUR)', value: 'RCUR' },
			{ name: 'Final (FNAL)', value: 'FNAL' },
			{ name: 'One-Off (OOFF)', value: 'OOFF' },
		],
		default: 'RCUR',
		description: 'SEPA direct debit sequence type',
	},
	// Direct debit creation
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
				resource: ['directDebit'],
				operation: ['createDebit'],
			},
		},
		default: 0,
		description: 'Direct debit amount in EUR',
	},
	{
		displayName: 'Reference',
		name: 'reference',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['directDebit'],
				operation: ['createDebit'],
			},
		},
		default: '',
		description: 'Payment reference',
	},
	{
		displayName: 'Collection Date',
		name: 'collectionDate',
		type: 'dateTime',
		displayOptions: {
			show: {
				resource: ['directDebit'],
				operation: ['createDebit'],
			},
		},
		default: '',
		description: 'Requested collection date',
	},
	// Filter options
	{
		displayName: 'Filter Options',
		name: 'filterOptions',
		type: 'collection',
		placeholder: 'Add Filter',
		displayOptions: {
			show: {
				resource: ['directDebit'],
				operation: ['listMandates', 'getReturns'],
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
					{ name: 'Inactive', value: 'inactive' },
					{ name: 'Cancelled', value: 'cancelled' },
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
		case 'createMandate': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			const creditorName = this.getNodeParameter('creditorName', index) as string;
			const creditorIban = this.getNodeParameter('creditorIban', index) as string;
			const creditorIdentifier = this.getNodeParameter('creditorIdentifier', index) as string;
			const mandateReference = this.getNodeParameter('mandateReference', index) as string;
			const sequenceType = this.getNodeParameter('sequenceType', index) as string;

			responseData = await solarisApiRequest.call(
				this,
				'POST',
				DIRECT_DEBIT_ENDPOINTS.CREATE_MANDATE(accountId),
				{
					creditor_name: creditorName,
					creditor_iban: creditorIban.replace(/\s/g, '').toUpperCase(),
					creditor_identifier: creditorIdentifier,
					mandate_reference: mandateReference,
					sequence_type: sequenceType,
				},
			);
			break;
		}

		case 'getMandate': {
			const mandateId = this.getNodeParameter('mandateId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				DIRECT_DEBIT_ENDPOINTS.GET_MANDATE(mandateId),
			);
			break;
		}

		case 'listMandates': {
			const accountId = this.getNodeParameter('accountId', index) as string;
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
					DIRECT_DEBIT_ENDPOINTS.LIST_MANDATES(accountId),
					{},
					qs,
				);
			} else {
				responseData = await solarisApiRequest.call(
					this,
					'GET',
					DIRECT_DEBIT_ENDPOINTS.LIST_MANDATES(accountId),
					{},
					qs,
				);
			}
			break;
		}

		case 'activateMandate': {
			const mandateId = this.getNodeParameter('mandateId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'POST',
				DIRECT_DEBIT_ENDPOINTS.ACTIVATE_MANDATE(mandateId),
			);
			break;
		}

		case 'cancelMandate': {
			const mandateId = this.getNodeParameter('mandateId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'POST',
				DIRECT_DEBIT_ENDPOINTS.CANCEL_MANDATE(mandateId),
			);
			break;
		}

		case 'getMandateStatus': {
			const mandateId = this.getNodeParameter('mandateId', index) as string;
			const mandate = await solarisApiRequest.call(
				this,
				'GET',
				DIRECT_DEBIT_ENDPOINTS.GET_MANDATE(mandateId),
			);
			responseData = {
				mandate_id: mandateId,
				status: (mandate as { status?: string }).status,
			};
			break;
		}

		case 'createDebit': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			const mandateId = this.getNodeParameter('mandateId', index) as string;
			const amount = this.getNodeParameter('amount', index) as number;
			const reference = this.getNodeParameter('reference', index, '') as string;
			const collectionDate = this.getNodeParameter('collectionDate', index, '') as string;
			const sequenceType = this.getNodeParameter('sequenceType', index) as string;

			const body: Record<string, unknown> = {
				mandate_id: mandateId,
				amount: {
					value: amount,
					currency: 'EUR',
				},
				sequence_type: sequenceType,
			};

			if (reference) body.reference = reference;
			if (collectionDate) body.collection_date = collectionDate;

			responseData = await solarisApiRequest.call(
				this,
				'POST',
				DIRECT_DEBIT_ENDPOINTS.CREATE_DEBIT(accountId),
				body,
			);
			break;
		}

		case 'getDebit': {
			const directDebitId = this.getNodeParameter('directDebitId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				DIRECT_DEBIT_ENDPOINTS.GET_DEBIT(directDebitId),
			);
			break;
		}

		case 'getReturns': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			const filterOptions = this.getNodeParameter('filterOptions', index, {}) as {
				returnAll?: boolean;
			};

			if (filterOptions.returnAll) {
				responseData = await solarisApiRequestAllItems.call(
					this,
					'GET',
					DIRECT_DEBIT_ENDPOINTS.RETURNS(accountId),
				);
			} else {
				responseData = await solarisApiRequest.call(
					this,
					'GET',
					DIRECT_DEBIT_ENDPOINTS.RETURNS(accountId),
				);
			}
			break;
		}

		case 'block': {
			const directDebitId = this.getNodeParameter('directDebitId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'POST',
				DIRECT_DEBIT_ENDPOINTS.BLOCK(directDebitId),
			);
			break;
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData as object;
}
