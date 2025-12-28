/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

/**
 * Solaris OAuth2 Credentials
 *
 * OAuth2 authentication for Solaris Banking-as-a-Service platform.
 * Used for user-level authentication flows and delegated access.
 *
 * Supports standard OAuth2 flows:
 * - Client Credentials (machine-to-machine)
 * - Authorization Code (user consent)
 * - Device Authorization (mobile apps)
 */
export class SolarisOAuth implements ICredentialType {
	name = 'solarisOAuth';
	displayName = 'Solaris OAuth2';
	extends = ['oAuth2Api'];
	documentationUrl = 'https://docs.solarisgroup.com/api-reference/authentication/';
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
					description: 'Live banking environment',
				},
				{
					name: 'Sandbox',
					value: 'sandbox',
					description: 'Testing environment',
				},
			],
			default: 'sandbox',
			description: 'The Solaris environment to authenticate against',
		},
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'clientCredentials',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: '={{$self.environment === "production" ? "https://auth.solarisgroup.com/oauth/authorize" : "https://auth.sandbox.solarisgroup.com/oauth/authorize"}}',
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: '={{$self.environment === "production" ? "https://auth.solarisgroup.com/oauth/token" : "https://auth.sandbox.solarisgroup.com/oauth/token"}}',
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'string',
			default: 'read write',
			description: 'OAuth2 scopes to request (space-separated)',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'header',
		},
		{
			displayName: 'Partner ID',
			name: 'partnerId',
			type: 'string',
			default: '',
			required: true,
			description: 'Your Solaris Partner ID',
		},
	];
}
