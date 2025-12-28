/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

/**
 * Solaris API Credentials
 *
 * Supports authentication to Solaris Banking-as-a-Service platform.
 * Solaris provides embedded banking infrastructure for European fintechs.
 *
 * Environment options:
 * - Production: Live banking operations (BaFin regulated)
 * - Sandbox: Testing environment with simulated data
 * - Custom: Self-hosted or partner-specific endpoints
 */
export class SolarisApi implements ICredentialType {
	name = 'solarisApi';
	displayName = 'Solaris API';
	documentationUrl = 'https://docs.solarisgroup.com/api-reference/';
	icon = 'file:solaris.svg';
	properties: INodeProperties[] = [
		{
			displayName: 'Environment',
			name: 'environment',
			type: 'options',
			options: [
				{
					name: 'Production',
					value: 'production',
					description: 'Live banking environment (BaFin regulated)',
				},
				{
					name: 'Sandbox',
					value: 'sandbox',
					description: 'Testing environment with simulated data',
				},
				{
					name: 'Custom',
					value: 'custom',
					description: 'Custom or partner-specific endpoint',
				},
			],
			default: 'sandbox',
			description: 'The Solaris environment to connect to',
		},
		{
			displayName: 'Custom API URL',
			name: 'customUrl',
			type: 'string',
			default: '',
			placeholder: 'https://api.partner.solarisgroup.com',
			description: 'Custom API endpoint URL',
			displayOptions: {
				show: {
					environment: ['custom'],
				},
			},
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			required: true,
			description: 'OAuth2 Client ID provided by Solaris',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'OAuth2 Client Secret provided by Solaris',
		},
		{
			displayName: 'Partner ID',
			name: 'partnerId',
			type: 'string',
			default: '',
			required: true,
			description: 'Your Solaris Partner ID (assigned during onboarding)',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Optional API key for additional authentication',
		},
		{
			displayName: 'Webhook Secret',
			name: 'webhookSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Secret for verifying webhook signatures (optional)',
		},
		{
			displayName: 'Use mTLS',
			name: 'useMtls',
			type: 'boolean',
			default: false,
			description: 'Whether to use mutual TLS authentication (required for some production operations)',
		},
		{
			displayName: 'Client Certificate',
			name: 'clientCertificate',
			type: 'string',
			typeOptions: {
				password: true,
				rows: 5,
			},
			default: '',
			description: 'PEM-encoded client certificate for mTLS',
			displayOptions: {
				show: {
					useMtls: [true],
				},
			},
		},
		{
			displayName: 'Client Private Key',
			name: 'clientPrivateKey',
			type: 'string',
			typeOptions: {
				password: true,
				rows: 5,
			},
			default: '',
			description: 'PEM-encoded private key for mTLS',
			displayOptions: {
				show: {
					useMtls: [true],
				},
			},
		},
		{
			displayName: 'CA Certificate',
			name: 'caCertificate',
			type: 'string',
			typeOptions: {
				password: true,
				rows: 5,
			},
			default: '',
			description: 'PEM-encoded CA certificate for mTLS (optional)',
			displayOptions: {
				show: {
					useMtls: [true],
				},
			},
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-Partner-ID': '={{$credentials.partnerId}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.environment === "production" ? "https://api.solarisgroup.com" : $credentials.environment === "sandbox" ? "https://api.sandbox.solarisgroup.com" : $credentials.customUrl}}',
			url: '/v1/partner',
			method: 'GET',
		},
	};
}
