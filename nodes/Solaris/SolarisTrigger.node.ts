/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	IHookFunctions,
	IWebhookFunctions,
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	NodeConnectionType,
} from 'n8n-workflow';

import { solarisApiRequest } from './transport/solarisClient';
import { verifyWebhookSignature, parseWebhookPayload, matchesFilters } from './transport/webhookHandler';
import { WEBHOOK_EVENT_OPTIONS } from './constants/webhookEvents';

// Runtime licensing notice - logged once per node load
let licensingNoticeLogged = false;
function logLicensingNotice(): void {
	if (!licensingNoticeLogged) {
		console.warn(`[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.`);
		licensingNoticeLogged = true;
	}
}

export class SolarisTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Solaris Trigger',
		name: 'solarisTrigger',
		icon: 'file:solaris.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Handle Solaris webhook events for real-time banking notifications',
		defaults: {
			name: 'Solaris Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'solarisApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event Type',
				name: 'event',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'All Events',
						value: '*',
						description: 'Trigger on any Solaris event',
					},
					...WEBHOOK_EVENT_OPTIONS,
				],
				default: '*',
				description: 'The event type to listen for',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Verify Signature',
						name: 'verifySignature',
						type: 'boolean',
						default: true,
						description: 'Whether to verify the webhook signature using HMAC-SHA256',
					},
					{
						displayName: 'Filter by Person ID',
						name: 'personId',
						type: 'string',
						default: '',
						description: 'Only trigger for events related to this person ID',
					},
					{
						displayName: 'Filter by Business ID',
						name: 'businessId',
						type: 'string',
						default: '',
						description: 'Only trigger for events related to this business ID',
					},
					{
						displayName: 'Filter by Account ID',
						name: 'accountId',
						type: 'string',
						default: '',
						description: 'Only trigger for events related to this account ID',
					},
					{
						displayName: 'Filter by Card ID',
						name: 'cardId',
						type: 'string',
						default: '',
						description: 'Only trigger for events related to this card ID',
					},
					{
						displayName: 'Live Mode Only',
						name: 'liveModeOnly',
						type: 'boolean',
						default: false,
						description: 'Whether to only trigger for live mode events (ignore sandbox/test events)',
					},
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				logLicensingNotice();
				
				const webhookUrl = this.getNodeWebhookUrl('default');
				const webhookData = this.getWorkflowStaticData('node');

				// Check if we already have a webhook registered
				if (webhookData.webhookId) {
					try {
						await solarisApiRequest.call(
							this,
							'GET',
							`/v1/webhooks/${webhookData.webhookId}`,
						);
						return true;
					} catch (error) {
						// Webhook doesn't exist anymore, need to create new one
						delete webhookData.webhookId;
						return false;
					}
				}

				// Check if there's an existing webhook with the same URL
				try {
					const webhooks = await solarisApiRequest.call(
						this,
						'GET',
						'/v1/webhooks',
					) as IDataObject[];

					for (const webhook of webhooks) {
						if (webhook.url === webhookUrl) {
							webhookData.webhookId = webhook.id;
							return true;
						}
					}
				} catch (error) {
					// Error checking webhooks, assume it doesn't exist
				}

				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				logLicensingNotice();

				const webhookUrl = this.getNodeWebhookUrl('default');
				const event = this.getNodeParameter('event') as string;
				const webhookData = this.getWorkflowStaticData('node');

				// Build event types array
				let eventTypes: string[];
				if (event === '*') {
					// Subscribe to all events
					eventTypes = ['*'];
				} else {
					eventTypes = [event];
				}

				const body: IDataObject = {
					url: webhookUrl,
					event_types: eventTypes,
				};

				try {
					const response = await solarisApiRequest.call(
						this,
						'POST',
						'/v1/webhooks',
						body,
					) as IDataObject;

					if (response.id) {
						webhookData.webhookId = response.id as string;
						return true;
					}
				} catch (error) {
					throw new Error(`Failed to create Solaris webhook: ${(error as Error).message}`);
				}

				return false;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId) {
					try {
						await solarisApiRequest.call(
							this,
							'DELETE',
							`/v1/webhooks/${webhookData.webhookId}`,
						);
					} catch (error) {
						// Webhook might already be deleted, continue
					}
					delete webhookData.webhookId;
				}

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		logLicensingNotice();

		const req = this.getRequestObject();
		const body = this.getBodyData() as IDataObject;
		const event = this.getNodeParameter('event') as string;
		const options = this.getNodeParameter('options', {}) as IDataObject;

		// Get headers for signature verification
		const signatureHeader = req.headers['x-solaris-signature'] as string | undefined;

		// Verify signature if enabled
		if (options.verifySignature !== false && signatureHeader) {
			const credentials = await this.getCredentials('solarisApi');
			const webhookSecret = credentials.webhookSecret as string;

			if (webhookSecret) {
				const rawBody = JSON.stringify(body);
				const isValid = verifyWebhookSignature(rawBody, signatureHeader, webhookSecret);

				if (!isValid) {
					return {
						webhookResponse: { status: 401, body: 'Invalid signature' },
					};
				}
			}
		}

		// Parse webhook payload
		let events: IDataObject[];
		try {
			events = parseWebhookPayload(body);
		} catch (error) {
			return {
				webhookResponse: { status: 400, body: 'Invalid payload format' },
			};
		}

		// Filter events by type
		if (event !== '*') {
			events = events.filter((e) => e.type === event);
		}

		// Apply additional filters
		const filters: IDataObject = {};
		if (options.personId) filters.personId = options.personId;
		if (options.businessId) filters.businessId = options.businessId;
		if (options.accountId) filters.accountId = options.accountId;
		if (options.cardId) filters.cardId = options.cardId;
		if (options.liveModeOnly) filters.livemode = true;

		if (Object.keys(filters).length > 0) {
			events = events.filter((e) => matchesFilters(e, filters));
		}

		// If no events match, acknowledge but don't trigger
		if (events.length === 0) {
			return {
				webhookResponse: { status: 200, body: 'OK' },
			};
		}

		// Return events as workflow data
		return {
			workflowData: [
				events.map((eventData) => ({
					json: eventData,
				})),
			],
		};
	}
}
