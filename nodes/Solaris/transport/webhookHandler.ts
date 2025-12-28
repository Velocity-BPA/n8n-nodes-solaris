/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import crypto from 'crypto';
import type { IDataObject, IWebhookFunctions } from 'n8n-workflow';

/**
 * Webhook payload structure from Solaris
 */
export interface SolarisWebhookPayload {
	id: string;
	type: string;
	created_at: string;
	data: IDataObject;
	livemode: boolean;
}

/**
 * Verify webhook signature
 *
 * Solaris uses HMAC-SHA256 for webhook signature verification
 *
 * @param payload - Raw webhook payload as string
 * @param signature - Signature from X-Solaris-Signature header
 * @param secret - Webhook secret from credentials
 * @returns true if signature is valid
 */
export function verifyWebhookSignature(
	payload: string,
	signature: string,
	secret: string,
): boolean {
	if (!signature || !secret) {
		return false;
	}

	// Solaris uses HMAC-SHA256
	const expectedSignature = crypto
		.createHmac('sha256', secret)
		.update(payload, 'utf8')
		.digest('hex');

	// Use timing-safe comparison to prevent timing attacks
	try {
		return crypto.timingSafeEqual(
			Buffer.from(signature, 'hex'),
			Buffer.from(expectedSignature, 'hex'),
		);
	} catch {
		// If lengths don't match, timingSafeEqual will throw
		return false;
	}
}

/**
 * Parse and validate webhook payload
 *
 * @param this - Webhook functions context
 * @returns Parsed and validated webhook data
 */
export async function parseWebhookPayload(
	this: IWebhookFunctions,
): Promise<SolarisWebhookPayload[]> {
	const req = this.getRequestObject();
	const body = this.getBodyData() as IDataObject;
	const headers = this.getHeaderData() as IDataObject;

	// Get webhook secret from credentials if available
	const credentials = await this.getCredentials('solarisApi').catch(() => null);
	const webhookSecret = credentials?.webhookSecret as string;

	// Verify signature if secret is configured
	if (webhookSecret) {
		const signature = headers['x-solaris-signature'] as string;
		const rawBody = JSON.stringify(body);

		if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
			throw new Error('Invalid webhook signature');
		}
	}

	// Handle both single event and batch events
	const events: SolarisWebhookPayload[] = [];

	if (Array.isArray(body)) {
		events.push(...(body as unknown as SolarisWebhookPayload[]));
	} else if (body.events && Array.isArray(body.events)) {
		events.push(...(body.events as SolarisWebhookPayload[]));
	} else {
		events.push(body as unknown as SolarisWebhookPayload);
	}

	return events;
}

/**
 * Filter events by type
 *
 * @param events - List of webhook events
 * @param allowedTypes - List of event types to allow
 * @returns Filtered events
 */
export function filterEventsByType(
	events: SolarisWebhookPayload[],
	allowedTypes: string[],
): SolarisWebhookPayload[] {
	if (!allowedTypes.length || allowedTypes.includes('*')) {
		return events;
	}

	return events.filter((event) => allowedTypes.includes(event.type));
}

/**
 * Transform webhook event to n8n format
 *
 * @param event - Raw webhook event
 * @returns Formatted event data
 */
export function transformWebhookEvent(event: SolarisWebhookPayload): IDataObject {
	return {
		eventId: event.id,
		eventType: event.type,
		createdAt: event.created_at,
		livemode: event.livemode,
		...event.data,
	};
}

/**
 * Get event type category
 *
 * @param eventType - Full event type string
 * @returns Event category (e.g., 'person', 'account', 'card')
 */
export function getEventCategory(eventType: string): string {
	const parts = eventType.split('.');
	return parts[0] || 'unknown';
}

/**
 * Check if event matches filter criteria
 *
 * @param event - Webhook event
 * @param filters - Filter criteria
 * @returns true if event matches filters
 */
export function matchesFilters(
	event: SolarisWebhookPayload,
	filters: IDataObject,
): boolean {
	// Filter by person ID
	if (filters.personId && event.data.person_id !== filters.personId) {
		return false;
	}

	// Filter by business ID
	if (filters.businessId && event.data.business_id !== filters.businessId) {
		return false;
	}

	// Filter by account ID
	if (filters.accountId && event.data.account_id !== filters.accountId) {
		return false;
	}

	// Filter by card ID
	if (filters.cardId && event.data.card_id !== filters.cardId) {
		return false;
	}

	// Filter by livemode
	if (filters.livemodeOnly && !event.livemode) {
		return false;
	}

	return true;
}

/**
 * Create webhook registration payload
 *
 * @param webhookUrl - n8n webhook URL
 * @param events - List of event types to subscribe
 * @param description - Optional description
 * @returns Payload for webhook creation
 */
export function createWebhookRegistrationPayload(
	webhookUrl: string,
	events: string[],
	description?: string,
): IDataObject {
	return {
		url: webhookUrl,
		events,
		description: description || 'n8n workflow webhook',
		enabled: true,
	};
}
