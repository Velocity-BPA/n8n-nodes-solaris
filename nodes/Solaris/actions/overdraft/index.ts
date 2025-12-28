/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { solarisApiRequest } from '../../transport/solarisClient';
import { OVERDRAFT_ENDPOINTS } from '../../constants/endpoints';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['overdraft'],
			},
		},
		options: [
			{ name: 'Cancel Overdraft', value: 'cancel', description: 'Cancel an overdraft facility', action: 'Cancel overdraft' },
			{ name: 'Get Overdraft', value: 'get', description: 'Get overdraft details', action: 'Get overdraft' },
			{ name: 'Get Overdraft History', value: 'getHistory', description: 'Get overdraft usage history', action: 'Get overdraft history' },
			{ name: 'Get Overdraft Interest Rate', value: 'getInterestRate', description: 'Get current interest rate', action: 'Get interest rate' },
			{ name: 'Get Overdraft Limit', value: 'getLimit', description: 'Get overdraft limit', action: 'Get overdraft limit' },
			{ name: 'Get Overdraft Usage', value: 'getUsage', description: 'Get current usage', action: 'Get overdraft usage' },
			{ name: 'Request Overdraft', value: 'request', description: 'Request an overdraft facility', action: 'Request overdraft' },
			{ name: 'Update Overdraft Limit', value: 'updateLimit', description: 'Update overdraft limit', action: 'Update overdraft limit' },
		],
		default: 'get',
	},
	// Account ID
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['overdraft'],
			},
		},
		default: '',
		description: 'The account ID',
	},
	// Requested limit
	{
		displayName: 'Requested Limit',
		name: 'requestedLimit',
		type: 'number',
		typeOptions: {
			numberPrecision: 2,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['overdraft'],
				operation: ['request', 'updateLimit'],
			},
		},
		default: 0,
		description: 'Requested overdraft limit in EUR',
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
	operation: string,
): Promise<object> {
	let responseData;
	const accountId = this.getNodeParameter('accountId', index) as string;

	switch (operation) {
		case 'get': {
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				OVERDRAFT_ENDPOINTS.GET(accountId),
			);
			break;
		}

		case 'request': {
			const requestedLimit = this.getNodeParameter('requestedLimit', index) as number;
			responseData = await solarisApiRequest.call(
				this,
				'POST',
				OVERDRAFT_ENDPOINTS.REQUEST(accountId),
				{
					requested_limit: {
						value: requestedLimit,
						currency: 'EUR',
					},
				},
			);
			break;
		}

		case 'getLimit': {
			const overdraft = await solarisApiRequest.call(
				this,
				'GET',
				OVERDRAFT_ENDPOINTS.GET(accountId),
			);
			responseData = {
				account_id: accountId,
				limit: (overdraft as { limit?: object }).limit,
			};
			break;
		}

		case 'getInterestRate': {
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				OVERDRAFT_ENDPOINTS.INTEREST_RATE(accountId),
			);
			break;
		}

		case 'getUsage': {
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				OVERDRAFT_ENDPOINTS.USAGE(accountId),
			);
			break;
		}

		case 'getHistory': {
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				OVERDRAFT_ENDPOINTS.HISTORY(accountId),
			);
			break;
		}

		case 'updateLimit': {
			const requestedLimit = this.getNodeParameter('requestedLimit', index) as number;
			responseData = await solarisApiRequest.call(
				this,
				'PATCH',
				OVERDRAFT_ENDPOINTS.UPDATE_LIMIT(accountId),
				{
					limit: {
						value: requestedLimit,
						currency: 'EUR',
					},
				},
			);
			break;
		}

		case 'cancel': {
			responseData = await solarisApiRequest.call(
				this,
				'POST',
				OVERDRAFT_ENDPOINTS.CANCEL(accountId),
			);
			break;
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData as object;
}
