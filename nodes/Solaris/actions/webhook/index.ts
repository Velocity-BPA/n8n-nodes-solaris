/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { solarisApiRequest, solarisApiRequestAllItems } from '../../transport/solarisClient';
import { WEBHOOK_ENDPOINTS } from '../../constants/endpoints';
import { WEBHOOK_EVENTS } from '../../constants/webhookEvents';

/**
 * Webhook Resource
 * Manages webhook subscriptions for real-time event notifications.
 * Webhooks use HMAC-SHA256 signatures for security.
 */

// Build event options from constants
const eventOptions = Object.entries(WEBHOOK_EVENTS).map(([key, value]) => ({
	name: key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
	value: value,
}));

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
			},
		},
		options: [
			{ name: 'Create Webhook', value: 'create', description: 'Create a new webhook subscription', action: 'Create webhook' },
			{ name: 'Delete Webhook', value: 'delete', description: 'Delete a webhook subscription', action: 'Delete webhook' },
			{ name: 'Get Webhook', value: 'get', description: 'Get webhook details', action: 'Get webhook' },
			{ name: 'Get Webhook Deliveries', value: 'getDeliveries', description: 'Get webhook delivery history', action: 'Get webhook deliveries' },
			{ name: 'Get Webhook Events', value: 'getEvents', description: 'Get list of available webhook events', action: 'Get webhook events' },
			{ name: 'List Webhooks', value: 'list', description: 'List all webhook subscriptions', action: 'List webhooks' },
			{ name: 'Test Webhook', value: 'test', description: 'Send a test webhook event', action: 'Test webhook' },
			{ name: 'Update Webhook', value: 'update', description: 'Update webhook subscription', action: 'Update webhook' },
			{ name: 'Verify Webhook Signature', value: 'verifySignature', description: 'Verify a webhook signature', action: 'Verify webhook signature' },
		],
		default: 'list',
	},
	// Webhook ID
	{
		displayName: 'Webhook ID',
		name: 'webhookId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['get', 'update', 'delete', 'test', 'getDeliveries'],
			},
		},
		default: '',
		description: 'The webhook ID',
	},
	// Webhook URL for create
	{
		displayName: 'Webhook URL',
		name: 'webhookUrl',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The URL to receive webhook events',
		placeholder: 'https://your-domain.com/webhook',
	},
	// Events for create
	{
		displayName: 'Events',
		name: 'events',
		type: 'multiOptions',
		required: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		options: eventOptions,
		default: [],
		description: 'Events to subscribe to',
	},
	// Update fields
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['update'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Active',
				name: 'active',
				type: 'boolean',
				default: true,
				description: 'Whether the webhook is active',
			},
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				options: eventOptions,
				default: [],
				description: 'Events to subscribe to',
			},
			{
				displayName: 'Secret',
				name: 'secret',
				type: 'string',
				typeOptions: {
					password: true,
				},
				default: '',
				description: 'New webhook secret for signature verification',
			},
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				description: 'New webhook URL',
			},
		],
	},
	// Create options
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description for the webhook',
			},
			{
				displayName: 'Secret',
				name: 'secret',
				type: 'string',
				typeOptions: {
					password: true,
				},
				default: '',
				description: 'Secret for signature verification (auto-generated if not provided)',
			},
		],
	},
	// Delivery filters
	{
		displayName: 'Delivery Filters',
		name: 'deliveryFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['getDeliveries'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'From Date',
				name: 'fromDate',
				type: 'dateTime',
				default: '',
				description: 'Get deliveries from this date',
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				description: 'Whether to return all deliveries',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Failed', value: 'failed' },
					{ name: 'Pending', value: 'pending' },
					{ name: 'Success', value: 'success' },
				],
				default: '',
				description: 'Filter by delivery status',
			},
			{
				displayName: 'To Date',
				name: 'toDate',
				type: 'dateTime',
				default: '',
				description: 'Get deliveries until this date',
			},
		],
	},
	// Signature verification
	{
		displayName: 'Signature',
		name: 'signature',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['verifySignature'],
			},
		},
		default: '',
		description: 'The X-Solaris-Signature header value',
	},
	{
		displayName: 'Payload',
		name: 'payload',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['verifySignature'],
			},
		},
		default: '',
		description: 'The raw webhook payload body',
		typeOptions: {
			rows: 4,
		},
	},
	{
		displayName: 'Webhook Secret',
		name: 'webhookSecret',
		type: 'string',
		required: true,
		typeOptions: {
			password: true,
		},
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['verifySignature'],
			},
		},
		default: '',
		description: 'The webhook secret for signature verification',
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
			const webhookUrl = this.getNodeParameter('webhookUrl', index) as string;
			const events = this.getNodeParameter('events', index) as string[];
			const additionalOptions = this.getNodeParameter('additionalOptions', index, {}) as {
				secret?: string;
				description?: string;
			};

			const body: Record<string, unknown> = {
				url: webhookUrl,
				events: events,
			};

			if (additionalOptions.secret) body.secret = additionalOptions.secret;
			if (additionalOptions.description) body.description = additionalOptions.description;

			responseData = await solarisApiRequest.call(
				this,
				'POST',
				WEBHOOK_ENDPOINTS.base,
				body,
			);
			break;
		}

		case 'get': {
			const webhookId = this.getNodeParameter('webhookId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				WEBHOOK_ENDPOINTS.byId(webhookId),
			);
			break;
		}

		case 'list': {
			responseData = await solarisApiRequestAllItems.call(
				this,
				'GET',
				WEBHOOK_ENDPOINTS.base,
			);
			break;
		}

		case 'update': {
			const webhookId = this.getNodeParameter('webhookId', index) as string;
			const updateFields = this.getNodeParameter('updateFields', index, {}) as {
				url?: string;
				events?: string[];
				secret?: string;
				active?: boolean;
			};

			const body: Record<string, unknown> = {};
			if (updateFields.url) body.url = updateFields.url;
			if (updateFields.events && updateFields.events.length > 0) body.events = updateFields.events;
			if (updateFields.secret) body.secret = updateFields.secret;
			if (updateFields.active !== undefined) body.active = updateFields.active;

			responseData = await solarisApiRequest.call(
				this,
				'PATCH',
				WEBHOOK_ENDPOINTS.byId(webhookId),
				body,
			);
			break;
		}

		case 'delete': {
			const webhookId = this.getNodeParameter('webhookId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'DELETE',
				WEBHOOK_ENDPOINTS.byId(webhookId),
			);
			break;
		}

		case 'test': {
			const webhookId = this.getNodeParameter('webhookId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'POST',
				WEBHOOK_ENDPOINTS.test(webhookId),
			);
			break;
		}

		case 'getEvents': {
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				WEBHOOK_ENDPOINTS.events,
			);
			break;
		}

		case 'getDeliveries': {
			const webhookId = this.getNodeParameter('webhookId', index) as string;
			const deliveryFilters = this.getNodeParameter('deliveryFilters', index, {}) as {
				returnAll?: boolean;
				status?: string;
				fromDate?: string;
				toDate?: string;
			};

			const qs: Record<string, unknown> = {};
			if (deliveryFilters.status) qs.status = deliveryFilters.status;
			if (deliveryFilters.fromDate) qs.from_date = deliveryFilters.fromDate;
			if (deliveryFilters.toDate) qs.to_date = deliveryFilters.toDate;

			if (deliveryFilters.returnAll) {
				responseData = await solarisApiRequestAllItems.call(
					this,
					'GET',
					WEBHOOK_ENDPOINTS.deliveries(webhookId),
					{},
					qs,
				);
			} else {
				responseData = await solarisApiRequest.call(
					this,
					'GET',
					WEBHOOK_ENDPOINTS.deliveries(webhookId),
					{},
					qs,
				);
			}
			break;
		}

		case 'verifySignature': {
			const signature = this.getNodeParameter('signature', index) as string;
			const payload = this.getNodeParameter('payload', index) as string;
			const webhookSecret = this.getNodeParameter('webhookSecret', index) as string;

			// Import crypto for signature verification
			const crypto = await import('crypto');

			// Parse signature header (format: t=timestamp,v1=signature)
			const parts = signature.split(',');
			const timestampPart = parts.find((p) => p.startsWith('t='));
			const signaturePart = parts.find((p) => p.startsWith('v1='));

			if (!timestampPart || !signaturePart) {
				responseData = {
					valid: false,
					error: 'Invalid signature format',
				};
				break;
			}

			const timestamp = timestampPart.substring(2);
			const providedSignature = signaturePart.substring(3);

			// Check timestamp (5 minute tolerance)
			const timestampMs = parseInt(timestamp, 10) * 1000;
			const now = Date.now();
			const tolerance = 5 * 60 * 1000;

			if (Math.abs(now - timestampMs) > tolerance) {
				responseData = {
					valid: false,
					error: 'Signature timestamp expired',
					timestamp: new Date(timestampMs).toISOString(),
				};
				break;
			}

			// Compute expected signature
			const signedPayload = `${timestamp}.${payload}`;
			const expectedSignature = crypto
				.createHmac('sha256', webhookSecret)
				.update(signedPayload)
				.digest('hex');

			// Timing-safe comparison
			const isValid = crypto.timingSafeEqual(
				Buffer.from(providedSignature),
				Buffer.from(expectedSignature),
			);

			responseData = {
				valid: isValid,
				timestamp: new Date(timestampMs).toISOString(),
			};
			break;
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData as object;
}
