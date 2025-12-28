/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { solarisApiRequest } from '../../transport/solarisClient';
import { CARD_CONTROL_ENDPOINTS } from '../../constants/endpoints';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['cardControl'],
			},
		},
		options: [
			{ name: 'Block Merchant Category', value: 'blockMcc', description: 'Block transactions for a merchant category', action: 'Block merchant category' },
			{ name: 'Enable/Disable ATM', value: 'toggleAtm', description: 'Enable or disable ATM withdrawals', action: 'Toggle ATM withdrawals' },
			{ name: 'Enable/Disable Contactless', value: 'toggleContactless', description: 'Enable or disable contactless payments', action: 'Toggle contactless' },
			{ name: 'Enable/Disable Online', value: 'toggleOnline', description: 'Enable or disable online transactions', action: 'Toggle online transactions' },
			{ name: 'Get Card Controls', value: 'get', description: 'Get current card controls', action: 'Get card controls' },
			{ name: 'Get Control History', value: 'getHistory', description: 'Get card control change history', action: 'Get control history' },
			{ name: 'Set Geographic Limits', value: 'setGeoLimits', description: 'Set geographic restrictions', action: 'Set geographic limits' },
			{ name: 'Set Merchant Category Limits', value: 'setMccLimits', description: 'Set spending limits by merchant category', action: 'Set merchant category limits' },
			{ name: 'Set Transaction Limits', value: 'setTransactionLimits', description: 'Set transaction limits', action: 'Set transaction limits' },
			{ name: 'Unblock Merchant Category', value: 'unblockMcc', description: 'Unblock transactions for a merchant category', action: 'Unblock merchant category' },
		],
		default: 'get',
	},
	// Card ID
	{
		displayName: 'Card ID',
		name: 'cardId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['cardControl'],
			},
		},
		default: '',
		description: 'The unique identifier of the card',
	},
	// Enable/disable toggle
	{
		displayName: 'Enabled',
		name: 'enabled',
		type: 'boolean',
		required: true,
		displayOptions: {
			show: {
				resource: ['cardControl'],
				operation: ['toggleAtm', 'toggleContactless', 'toggleOnline'],
			},
		},
		default: true,
		description: 'Whether to enable or disable the feature',
	},
	// Merchant Category Code
	{
		displayName: 'Merchant Category',
		name: 'merchantCategory',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['cardControl'],
				operation: ['blockMcc', 'unblockMcc', 'setMccLimits'],
			},
		},
		options: [
			{ name: 'Airlines', value: 'airlines' },
			{ name: 'Automotive', value: 'automotive' },
			{ name: 'Entertainment', value: 'entertainment' },
			{ name: 'Fuel', value: 'fuel' },
			{ name: 'Gambling', value: 'gambling' },
			{ name: 'Groceries', value: 'groceries' },
			{ name: 'Hotels', value: 'hotels' },
			{ name: 'Restaurants', value: 'restaurants' },
			{ name: 'Retail', value: 'retail' },
			{ name: 'Travel', value: 'travel' },
			{ name: 'Utilities', value: 'utilities' },
		],
		default: 'retail',
		description: 'Merchant category code group',
	},
	// MCC Limit amount
	{
		displayName: 'Limit Amount',
		name: 'mccLimitAmount',
		type: 'number',
		typeOptions: {
			numberPrecision: 2,
		},
		displayOptions: {
			show: {
				resource: ['cardControl'],
				operation: ['setMccLimits'],
			},
		},
		default: 0,
		description: 'Maximum amount for this merchant category (EUR)',
	},
	// Transaction limits
	{
		displayName: 'Transaction Limits',
		name: 'transactionLimits',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: ['cardControl'],
				operation: ['setTransactionLimits'],
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
						name: 'type',
						type: 'options',
						options: [
							{ name: 'Daily Spending', value: 'daily_spending' },
							{ name: 'Monthly Spending', value: 'monthly_spending' },
							{ name: 'Single Transaction', value: 'single_transaction' },
							{ name: 'Daily ATM', value: 'daily_atm' },
							{ name: 'Monthly ATM', value: 'monthly_atm' },
							{ name: 'Contactless', value: 'contactless' },
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
					},
				],
			},
		],
	},
	// Geographic limits
	{
		displayName: 'Allowed Countries',
		name: 'allowedCountries',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['cardControl'],
				operation: ['setGeoLimits'],
			},
		},
		default: '',
		placeholder: 'DE,AT,CH,NL,BE',
		description: 'Comma-separated list of allowed country codes (ISO 3166-1 alpha-2)',
	},
	{
		displayName: 'Block Non-SEPA Countries',
		name: 'blockNonSepa',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['cardControl'],
				operation: ['setGeoLimits'],
			},
		},
		default: false,
		description: 'Whether to block transactions outside SEPA zone',
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
	operation: string,
): Promise<object> {
	let responseData;
	const cardId = this.getNodeParameter('cardId', index) as string;

	switch (operation) {
		case 'get': {
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				CARD_CONTROL_ENDPOINTS.GET(cardId),
			);
			break;
		}

		case 'getHistory': {
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				CARD_CONTROL_ENDPOINTS.HISTORY(cardId),
			);
			break;
		}

		case 'toggleAtm': {
			const enabled = this.getNodeParameter('enabled', index) as boolean;
			responseData = await solarisApiRequest.call(
				this,
				'PATCH',
				CARD_CONTROL_ENDPOINTS.ATM(cardId),
				{ enabled },
			);
			break;
		}

		case 'toggleContactless': {
			const enabled = this.getNodeParameter('enabled', index) as boolean;
			responseData = await solarisApiRequest.call(
				this,
				'PATCH',
				CARD_CONTROL_ENDPOINTS.CONTACTLESS(cardId),
				{ enabled },
			);
			break;
		}

		case 'toggleOnline': {
			const enabled = this.getNodeParameter('enabled', index) as boolean;
			responseData = await solarisApiRequest.call(
				this,
				'PATCH',
				CARD_CONTROL_ENDPOINTS.ONLINE(cardId),
				{ enabled },
			);
			break;
		}

		case 'blockMcc': {
			const merchantCategory = this.getNodeParameter('merchantCategory', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'POST',
				CARD_CONTROL_ENDPOINTS.BLOCK_MCC(cardId),
				{ category: merchantCategory },
			);
			break;
		}

		case 'unblockMcc': {
			const merchantCategory = this.getNodeParameter('merchantCategory', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'DELETE',
				CARD_CONTROL_ENDPOINTS.UNBLOCK_MCC(cardId, merchantCategory),
			);
			break;
		}

		case 'setMccLimits': {
			const merchantCategory = this.getNodeParameter('merchantCategory', index) as string;
			const mccLimitAmount = this.getNodeParameter('mccLimitAmount', index) as number;

			responseData = await solarisApiRequest.call(
				this,
				'PUT',
				CARD_CONTROL_ENDPOINTS.MCC_LIMITS(cardId),
				{
					category: merchantCategory,
					limit: {
						value: mccLimitAmount,
						currency: 'EUR',
					},
				},
			);
			break;
		}

		case 'setTransactionLimits': {
			const transactionLimits = this.getNodeParameter('transactionLimits', index, {}) as {
				limit?: Array<{
					type: string;
					amount: number;
				}>;
			};

			const limits = (transactionLimits.limit || []).map((l) => ({
				type: l.type,
				amount: {
					value: l.amount,
					currency: 'EUR',
				},
			}));

			responseData = await solarisApiRequest.call(
				this,
				'PUT',
				CARD_CONTROL_ENDPOINTS.TRANSACTION_LIMITS(cardId),
				{ limits },
			);
			break;
		}

		case 'setGeoLimits': {
			const allowedCountries = this.getNodeParameter('allowedCountries', index, '') as string;
			const blockNonSepa = this.getNodeParameter('blockNonSepa', index) as boolean;

			const body: Record<string, unknown> = {
				block_non_sepa: blockNonSepa,
			};

			if (allowedCountries) {
				body.allowed_countries = allowedCountries.split(',').map((c) => c.trim().toUpperCase());
			}

			responseData = await solarisApiRequest.call(
				this,
				'PUT',
				CARD_CONTROL_ENDPOINTS.GEO_LIMITS(cardId),
				body,
			);
			break;
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData as object;
}
