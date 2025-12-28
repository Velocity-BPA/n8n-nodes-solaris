/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { solarisApiRequest, solarisApiRequestAllItems } from '../../transport/solarisClient';
import { CARD_ENDPOINTS } from '../../constants/endpoints';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['card'],
			},
		},
		options: [
			{ name: 'Activate Card', value: 'activate', description: 'Activate a card', action: 'Activate a card' },
			{ name: 'Block Card', value: 'block', description: 'Block a card', action: 'Block a card' },
			{ name: 'Change Card PIN', value: 'changePIN', description: 'Change card PIN', action: 'Change card PIN' },
			{ name: 'Close Card', value: 'close', description: 'Close/terminate a card', action: 'Close a card' },
			{ name: 'Create Card', value: 'create', description: 'Create a new card', action: 'Create a card' },
			{ name: 'Create Virtual Card', value: 'createVirtual', description: 'Create a virtual card', action: 'Create virtual card' },
			{ name: 'Get Card', value: 'get', description: 'Get card details', action: 'Get a card' },
			{ name: 'Get Card Details', value: 'getDetails', description: 'Get sensitive card details (PAN, CVV)', action: 'Get card details' },
			{ name: 'Get Card Limits', value: 'getLimits', description: 'Get card spending limits', action: 'Get card limits' },
			{ name: 'Get Card PIN', value: 'getPIN', description: 'Get card PIN', action: 'Get card PIN' },
			{ name: 'Get Card Representation', value: 'getRepresentation', description: 'Get card visual representation', action: 'Get card representation' },
			{ name: 'Get Card Status', value: 'getStatus', description: 'Get card status', action: 'Get card status' },
			{ name: 'Get Mobile Wallet Data', value: 'getMobileWallet', description: 'Get mobile wallet provisioning data', action: 'Get mobile wallet data' },
			{ name: 'List Cards', value: 'list', description: 'List all cards', action: 'List cards' },
			{ name: 'Replace Card', value: 'replace', description: 'Replace a card', action: 'Replace a card' },
			{ name: 'Set Card Limits', value: 'setLimits', description: 'Set card spending limits', action: 'Set card limits' },
			{ name: 'Unblock Card', value: 'unblock', description: 'Unblock a card', action: 'Unblock a card' },
		],
		default: 'create',
	},
	// Account ID
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['create', 'createVirtual', 'list'],
			},
		},
		default: '',
		description: 'The account ID to link the card to',
	},
	// Card ID
	{
		displayName: 'Card ID',
		name: 'cardId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['get', 'activate', 'block', 'unblock', 'close', 'replace', 'getPIN', 'changePIN', 'getDetails', 'getLimits', 'setLimits', 'getStatus', 'getRepresentation', 'getMobileWallet'],
			},
		},
		default: '',
		description: 'The unique identifier of the card',
	},
	// Card Type
	{
		displayName: 'Card Type',
		name: 'cardType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['create'],
			},
		},
		options: [
			{ name: 'Virtual Only', value: 'virtual' },
			{ name: 'Physical Only', value: 'physical' },
			{ name: 'Virtual and Physical', value: 'virtual_physical' },
		],
		default: 'physical',
		description: 'Type of card to create',
	},
	// Card Brand
	{
		displayName: 'Card Brand',
		name: 'cardBrand',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['create', 'createVirtual'],
			},
		},
		options: [
			{ name: 'Mastercard', value: 'mastercard' },
			{ name: 'Visa', value: 'visa' },
		],
		default: 'mastercard',
		description: 'Card brand/network',
	},
	// Block reason
	{
		displayName: 'Block Reason',
		name: 'blockReason',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['block'],
			},
		},
		options: [
			{ name: 'Lost', value: 'lost' },
			{ name: 'Stolen', value: 'stolen' },
			{ name: 'Fraud', value: 'fraud' },
			{ name: 'Customer Request', value: 'customer_request' },
			{ name: 'Compliance', value: 'compliance' },
			{ name: 'Other', value: 'other' },
		],
		default: 'customer_request',
		description: 'Reason for blocking the card',
	},
	// Replace reason
	{
		displayName: 'Replace Reason',
		name: 'replaceReason',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['replace'],
			},
		},
		options: [
			{ name: 'Damaged', value: 'damaged' },
			{ name: 'Expired', value: 'expired' },
			{ name: 'Lost', value: 'lost' },
			{ name: 'Stolen', value: 'stolen' },
			{ name: 'Customer Request', value: 'customer_request' },
		],
		default: 'customer_request',
		description: 'Reason for replacing the card',
	},
	// New PIN
	{
		displayName: 'New PIN',
		name: 'newPin',
		type: 'string',
		typeOptions: {
			password: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['changePIN'],
			},
		},
		default: '',
		description: 'New 4-digit PIN',
	},
	// Mobile wallet type
	{
		displayName: 'Wallet Type',
		name: 'walletType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['getMobileWallet'],
			},
		},
		options: [
			{ name: 'Apple Pay', value: 'apple_pay' },
			{ name: 'Google Pay', value: 'google_pay' },
			{ name: 'Samsung Pay', value: 'samsung_pay' },
		],
		default: 'apple_pay',
		description: 'Mobile wallet type',
	},
	// Card limits
	{
		displayName: 'Limits',
		name: 'limits',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: ['card'],
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
							{ name: 'Daily Spending', value: 'daily_spending' },
							{ name: 'Monthly Spending', value: 'monthly_spending' },
							{ name: 'Single Transaction', value: 'single_transaction' },
							{ name: 'Daily ATM Withdrawal', value: 'daily_atm' },
							{ name: 'Monthly ATM Withdrawal', value: 'monthly_atm' },
							{ name: 'Contactless Transaction', value: 'contactless' },
							{ name: 'Online Transaction', value: 'online' },
						],
						default: 'daily_spending',
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
	// Additional options for card creation
	{
		displayName: 'Card Options',
		name: 'cardOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['create', 'createVirtual'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Cardholder Name',
				name: 'cardholderName',
				type: 'string',
				default: '',
				description: 'Name to emboss on the card',
			},
			{
				displayName: 'Reference',
				name: 'reference',
				type: 'string',
				default: '',
				description: 'External reference',
			},
			{
				displayName: 'Delivery Address',
				name: 'deliveryAddress',
				type: 'fixedCollection',
				default: {},
				options: [
					{
						displayName: 'Address',
						name: 'address',
						values: [
							{
								displayName: 'Line 1',
								name: 'line1',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Line 2',
								name: 'line2',
								type: 'string',
								default: '',
							},
							{
								displayName: 'City',
								name: 'city',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Postal Code',
								name: 'postalCode',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Country',
								name: 'country',
								type: 'string',
								default: 'DE',
							},
						],
					},
				],
			},
		],
	},
	// Filter options
	{
		displayName: 'Filter Options',
		name: 'filterOptions',
		type: 'collection',
		placeholder: 'Add Filter',
		displayOptions: {
			show: {
				resource: ['card'],
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
					{ name: 'Inactive', value: 'inactive' },
					{ name: 'Blocked', value: 'blocked' },
					{ name: 'Closed', value: 'closed' },
				],
				default: '',
			},
			{
				displayName: 'Card Type',
				name: 'cardType',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Virtual', value: 'virtual' },
					{ name: 'Physical', value: 'physical' },
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
		case 'create': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			const cardType = this.getNodeParameter('cardType', index) as string;
			const cardBrand = this.getNodeParameter('cardBrand', index) as string;
			const cardOptions = this.getNodeParameter('cardOptions', index, {}) as {
				cardholderName?: string;
				reference?: string;
				deliveryAddress?: {
					address?: {
						line1?: string;
						line2?: string;
						city?: string;
						postalCode?: string;
						country?: string;
					};
				};
			};

			const body: Record<string, unknown> = {
				type: cardType,
				brand: cardBrand,
			};

			if (cardOptions.cardholderName) body.cardholder_name = cardOptions.cardholderName;
			if (cardOptions.reference) body.reference = cardOptions.reference;
			if (cardOptions.deliveryAddress?.address) {
				body.delivery_address = {
					line_1: cardOptions.deliveryAddress.address.line1,
					line_2: cardOptions.deliveryAddress.address.line2,
					city: cardOptions.deliveryAddress.address.city,
					postal_code: cardOptions.deliveryAddress.address.postalCode,
					country: cardOptions.deliveryAddress.address.country,
				};
			}

			responseData = await solarisApiRequest.call(
				this,
				'POST',
				CARD_ENDPOINTS.CREATE(accountId),
				body,
			);
			break;
		}

		case 'createVirtual': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			const cardBrand = this.getNodeParameter('cardBrand', index) as string;
			const cardOptions = this.getNodeParameter('cardOptions', index, {}) as {
				cardholderName?: string;
				reference?: string;
			};

			const body: Record<string, unknown> = {
				type: 'virtual',
				brand: cardBrand,
			};

			if (cardOptions.cardholderName) body.cardholder_name = cardOptions.cardholderName;
			if (cardOptions.reference) body.reference = cardOptions.reference;

			responseData = await solarisApiRequest.call(
				this,
				'POST',
				CARD_ENDPOINTS.CREATE_VIRTUAL(accountId),
				body,
			);
			break;
		}

		case 'get': {
			const cardId = this.getNodeParameter('cardId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				CARD_ENDPOINTS.GET(cardId),
			);
			break;
		}

		case 'list': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			const filterOptions = this.getNodeParameter('filterOptions', index, {}) as {
				returnAll?: boolean;
				status?: string;
				cardType?: string;
			};

			const qs: Record<string, unknown> = {};
			if (filterOptions.status) qs.status = filterOptions.status;
			if (filterOptions.cardType) qs.type = filterOptions.cardType;

			if (filterOptions.returnAll) {
				responseData = await solarisApiRequestAllItems.call(
					this,
					'GET',
					CARD_ENDPOINTS.LIST(accountId),
					{},
					qs,
				);
			} else {
				responseData = await solarisApiRequest.call(
					this,
					'GET',
					CARD_ENDPOINTS.LIST(accountId),
					{},
					qs,
				);
			}
			break;
		}

		case 'activate': {
			const cardId = this.getNodeParameter('cardId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'POST',
				CARD_ENDPOINTS.ACTIVATE(cardId),
			);
			break;
		}

		case 'block': {
			const cardId = this.getNodeParameter('cardId', index) as string;
			const blockReason = this.getNodeParameter('blockReason', index) as string;

			responseData = await solarisApiRequest.call(
				this,
				'POST',
				CARD_ENDPOINTS.BLOCK(cardId),
				{ reason: blockReason },
			);
			break;
		}

		case 'unblock': {
			const cardId = this.getNodeParameter('cardId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'POST',
				CARD_ENDPOINTS.UNBLOCK(cardId),
			);
			break;
		}

		case 'close': {
			const cardId = this.getNodeParameter('cardId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'POST',
				CARD_ENDPOINTS.CLOSE(cardId),
			);
			break;
		}

		case 'replace': {
			const cardId = this.getNodeParameter('cardId', index) as string;
			const replaceReason = this.getNodeParameter('replaceReason', index) as string;

			responseData = await solarisApiRequest.call(
				this,
				'POST',
				CARD_ENDPOINTS.REPLACE(cardId),
				{ reason: replaceReason },
			);
			break;
		}

		case 'getPIN': {
			const cardId = this.getNodeParameter('cardId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				CARD_ENDPOINTS.PIN(cardId),
			);
			break;
		}

		case 'changePIN': {
			const cardId = this.getNodeParameter('cardId', index) as string;
			const newPin = this.getNodeParameter('newPin', index) as string;

			if (!/^\d{4}$/.test(newPin)) {
				throw new Error('PIN must be exactly 4 digits');
			}

			responseData = await solarisApiRequest.call(
				this,
				'POST',
				CARD_ENDPOINTS.CHANGE_PIN(cardId),
				{ pin: newPin },
			);
			break;
		}

		case 'getDetails': {
			const cardId = this.getNodeParameter('cardId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				CARD_ENDPOINTS.DETAILS(cardId),
			);
			break;
		}

		case 'getLimits': {
			const cardId = this.getNodeParameter('cardId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				CARD_ENDPOINTS.LIMITS(cardId),
			);
			break;
		}

		case 'setLimits': {
			const cardId = this.getNodeParameter('cardId', index) as string;
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
				CARD_ENDPOINTS.LIMITS(cardId),
				body,
			);
			break;
		}

		case 'getStatus': {
			const cardId = this.getNodeParameter('cardId', index) as string;
			const card = await solarisApiRequest.call(
				this,
				'GET',
				CARD_ENDPOINTS.GET(cardId),
			);
			responseData = {
				card_id: cardId,
				status: (card as { status?: string }).status,
			};
			break;
		}

		case 'getRepresentation': {
			const cardId = this.getNodeParameter('cardId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				CARD_ENDPOINTS.REPRESENTATION(cardId),
			);
			break;
		}

		case 'getMobileWallet': {
			const cardId = this.getNodeParameter('cardId', index) as string;
			const walletType = this.getNodeParameter('walletType', index) as string;

			responseData = await solarisApiRequest.call(
				this,
				'POST',
				CARD_ENDPOINTS.MOBILE_WALLET(cardId),
				{ wallet_type: walletType },
			);
			break;
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData as object;
}
