/**
 * @file Consent Resource Actions
 * @description Operations for managing customer consents (marketing, data sharing, GDPR)
 * @license Business Source License 1.1 - Velocity BPA
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { solarisApiRequest, solarisApiRequestAllItems } from '../../transport/solarisClient';

export const consentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['consent'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new consent record',
				action: 'Create a consent',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get consent by ID',
				action: 'Get a consent',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Get all consents for a person',
				action: 'Get all consents',
			},
			{
				name: 'Get By Type',
				value: 'getByType',
				description: 'Get consent by type',
				action: 'Get consent by type',
			},
			{
				name: 'Get Marketing Consent',
				value: 'getMarketing',
				description: 'Get marketing consent status',
				action: 'Get marketing consent',
			},
			{
				name: 'Revoke',
				value: 'revoke',
				description: 'Revoke an existing consent',
				action: 'Revoke a consent',
			},
			{
				name: 'Update Marketing Consent',
				value: 'updateMarketing',
				description: 'Update marketing consent preferences',
				action: 'Update marketing consent',
			},
		],
		default: 'getAll',
	},
];

export const consentFields: INodeProperties[] = [
	// ----------------------------------
	//         consent: create
	// ----------------------------------
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['consent'],
				operation: ['create', 'getAll', 'getByType', 'getMarketing', 'updateMarketing'],
			},
		},
		description: 'The unique identifier of the person',
	},
	{
		displayName: 'Consent Type',
		name: 'consentType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['consent'],
				operation: ['create'],
			},
		},
		options: [
			{ name: 'Data Processing', value: 'DATA_PROCESSING' },
			{ name: 'Data Sharing', value: 'DATA_SHARING' },
			{ name: 'Email Marketing', value: 'EMAIL_MARKETING' },
			{ name: 'General Marketing', value: 'MARKETING' },
			{ name: 'Phone Marketing', value: 'PHONE_MARKETING' },
			{ name: 'Push Notifications', value: 'PUSH_NOTIFICATIONS' },
			{ name: 'SMS Marketing', value: 'SMS_MARKETING' },
			{ name: 'Terms & Conditions', value: 'TERMS_AND_CONDITIONS' },
			{ name: 'Third Party Sharing', value: 'THIRD_PARTY_SHARING' },
		],
		default: 'DATA_PROCESSING',
		description: 'The type of consent being granted',
	},
	{
		displayName: 'Granted',
		name: 'granted',
		type: 'boolean',
		required: true,
		default: true,
		displayOptions: {
			show: {
				resource: ['consent'],
				operation: ['create'],
			},
		},
		description: 'Whether consent is granted or denied',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['consent'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Channel',
				name: 'channel',
				type: 'options',
				options: [
					{ name: 'API', value: 'API' },
					{ name: 'App', value: 'APP' },
					{ name: 'Email', value: 'EMAIL' },
					{ name: 'In Person', value: 'IN_PERSON' },
					{ name: 'Paper', value: 'PAPER' },
					{ name: 'Phone', value: 'PHONE' },
					{ name: 'Web', value: 'WEB' },
				],
				default: 'API',
				description: 'Channel through which consent was collected',
			},
			{
				displayName: 'External Reference',
				name: 'externalReference',
				type: 'string',
				default: '',
				description: 'External reference for the consent record',
			},
			{
				displayName: 'IP Address',
				name: 'ipAddress',
				type: 'string',
				default: '',
				description: 'IP address from which consent was given',
			},
			{
				displayName: 'Purpose',
				name: 'purpose',
				type: 'string',
				default: '',
				description: 'Specific purpose for which consent is granted',
			},
			{
				displayName: 'Valid Until',
				name: 'validUntil',
				type: 'dateTime',
				default: '',
				description: 'Date until which consent is valid',
			},
			{
				displayName: 'Version',
				name: 'version',
				type: 'string',
				default: '',
				description: 'Version of the consent document/terms',
			},
		],
	},

	// ----------------------------------
	//         consent: get
	// ----------------------------------
	{
		displayName: 'Consent ID',
		name: 'consentId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['consent'],
				operation: ['get', 'revoke'],
			},
		},
		description: 'The unique identifier of the consent',
	},

	// ----------------------------------
	//         consent: getByType
	// ----------------------------------
	{
		displayName: 'Consent Type',
		name: 'consentTypeFilter',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['consent'],
				operation: ['getByType'],
			},
		},
		options: [
			{ name: 'Data Processing', value: 'DATA_PROCESSING' },
			{ name: 'Data Sharing', value: 'DATA_SHARING' },
			{ name: 'Email Marketing', value: 'EMAIL_MARKETING' },
			{ name: 'General Marketing', value: 'MARKETING' },
			{ name: 'Phone Marketing', value: 'PHONE_MARKETING' },
			{ name: 'Push Notifications', value: 'PUSH_NOTIFICATIONS' },
			{ name: 'SMS Marketing', value: 'SMS_MARKETING' },
			{ name: 'Terms & Conditions', value: 'TERMS_AND_CONDITIONS' },
			{ name: 'Third Party Sharing', value: 'THIRD_PARTY_SHARING' },
		],
		default: 'MARKETING',
		description: 'The type of consent to retrieve',
	},

	// ----------------------------------
	//         consent: revoke
	// ----------------------------------
	{
		displayName: 'Revocation Options',
		name: 'revokeOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['consent'],
				operation: ['revoke'],
			},
		},
		options: [
			{
				displayName: 'Channel',
				name: 'channel',
				type: 'options',
				options: [
					{ name: 'API', value: 'API' },
					{ name: 'App', value: 'APP' },
					{ name: 'Email', value: 'EMAIL' },
					{ name: 'In Person', value: 'IN_PERSON' },
					{ name: 'Paper', value: 'PAPER' },
					{ name: 'Phone', value: 'PHONE' },
					{ name: 'Web', value: 'WEB' },
				],
				default: 'API',
				description: 'Channel through which revocation was requested',
			},
			{
				displayName: 'Reason',
				name: 'reason',
				type: 'string',
				default: '',
				description: 'Reason for consent revocation',
			},
		],
	},

	// ----------------------------------
	//         consent: updateMarketing
	// ----------------------------------
	{
		displayName: 'Marketing Preferences',
		name: 'marketingPreferences',
		type: 'collection',
		placeholder: 'Add Preference',
		default: {},
		displayOptions: {
			show: {
				resource: ['consent'],
				operation: ['updateMarketing'],
			},
		},
		options: [
			{
				displayName: 'Email Marketing',
				name: 'emailMarketing',
				type: 'boolean',
				default: false,
				description: 'Whether to allow email marketing',
			},
			{
				displayName: 'Phone Marketing',
				name: 'phoneMarketing',
				type: 'boolean',
				default: false,
				description: 'Whether to allow phone marketing',
			},
			{
				displayName: 'Push Notifications',
				name: 'pushNotifications',
				type: 'boolean',
				default: false,
				description: 'Whether to allow push notifications',
			},
			{
				displayName: 'SMS Marketing',
				name: 'smsMarketing',
				type: 'boolean',
				default: false,
				description: 'Whether to allow SMS marketing',
			},
			{
				displayName: 'Third Party Sharing',
				name: 'thirdPartySharing',
				type: 'boolean',
				default: false,
				description: 'Whether to allow third-party data sharing',
			},
		],
	},

	// ----------------------------------
	//         consent: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['consent'],
				operation: ['getAll'],
			},
		},
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		displayOptions: {
			show: {
				resource: ['consent'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['consent'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Granted Only',
				name: 'grantedOnly',
				type: 'boolean',
				default: false,
				description: 'Whether to only return granted consents',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Data Processing', value: 'DATA_PROCESSING' },
					{ name: 'Data Sharing', value: 'DATA_SHARING' },
					{ name: 'Marketing', value: 'MARKETING' },
				],
				default: '',
				description: 'Filter by consent type',
			},
		],
	},
];

export async function execute(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];

	switch (operation) {
		case 'create': {
			const personId = this.getNodeParameter('personId', i) as string;
			const consentType = this.getNodeParameter('consentType', i) as string;
			const granted = this.getNodeParameter('granted', i) as boolean;
			const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

			const body: IDataObject = {
				type: consentType,
				granted,
				confirmed_at: new Date().toISOString(),
			};

			if (additionalFields.channel) body.channel = additionalFields.channel;
			if (additionalFields.purpose) body.purpose = additionalFields.purpose;
			if (additionalFields.version) body.version = additionalFields.version;
			if (additionalFields.validUntil) body.valid_until = additionalFields.validUntil;
			if (additionalFields.ipAddress) body.ip_address = additionalFields.ipAddress;
			if (additionalFields.externalReference) body.external_reference = additionalFields.externalReference;

			responseData = await solarisApiRequest.call(
				this,
				'POST',
				`/v1/persons/${personId}/consents`,
				body,
			);
			break;
		}

		case 'get': {
			const consentId = this.getNodeParameter('consentId', i) as string;

			responseData = await solarisApiRequest.call(
				this,
				'GET',
				`/v1/consents/${consentId}`,
			);
			break;
		}

		case 'getAll': {
			const personId = this.getNodeParameter('personId', i) as string;
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			const filters = this.getNodeParameter('filters', i) as IDataObject;

			const qs: IDataObject = {};
			if (filters.type) qs.type = filters.type;
			if (filters.grantedOnly) qs.granted = true;

			if (returnAll) {
				responseData = await solarisApiRequestAllItems.call(
					this,
					'GET',
					`/v1/persons/${personId}/consents`,
					{},
					qs,
				);
			} else {
				const limit = this.getNodeParameter('limit', i) as number;
				qs.page = { size: limit };
				const response = await solarisApiRequest.call(
					this,
					'GET',
					`/v1/persons/${personId}/consents`,
					{},
					qs,
				);
				responseData = Array.isArray(response) ? response : [response];
			}
			break;
		}

		case 'getByType': {
			const personId = this.getNodeParameter('personId', i) as string;
			const consentType = this.getNodeParameter('consentTypeFilter', i) as string;

			responseData = await solarisApiRequest.call(
				this,
				'GET',
				`/v1/persons/${personId}/consents`,
				{},
				{ type: consentType },
			);
			break;
		}

		case 'getMarketing': {
			const personId = this.getNodeParameter('personId', i) as string;

			responseData = await solarisApiRequest.call(
				this,
				'GET',
				`/v1/persons/${personId}/marketing_consents`,
			);
			break;
		}

		case 'revoke': {
			const consentId = this.getNodeParameter('consentId', i) as string;
			const revokeOptions = this.getNodeParameter('revokeOptions', i) as IDataObject;

			const body: IDataObject = {
				revoked_at: new Date().toISOString(),
			};

			if (revokeOptions.reason) body.revocation_reason = revokeOptions.reason;
			if (revokeOptions.channel) body.revocation_channel = revokeOptions.channel;

			responseData = await solarisApiRequest.call(
				this,
				'PATCH',
				`/v1/consents/${consentId}/revoke`,
				body,
			);
			break;
		}

		case 'updateMarketing': {
			const personId = this.getNodeParameter('personId', i) as string;
			const preferences = this.getNodeParameter('marketingPreferences', i) as IDataObject;

			const body: IDataObject = {};

			if (preferences.emailMarketing !== undefined) body.email_marketing = preferences.emailMarketing;
			if (preferences.smsMarketing !== undefined) body.sms_marketing = preferences.smsMarketing;
			if (preferences.phoneMarketing !== undefined) body.phone_marketing = preferences.phoneMarketing;
			if (preferences.pushNotifications !== undefined) body.push_notifications = preferences.pushNotifications;
			if (preferences.thirdPartySharing !== undefined) body.third_party_sharing = preferences.thirdPartySharing;

			responseData = await solarisApiRequest.call(
				this,
				'PATCH',
				`/v1/persons/${personId}/marketing_consents`,
				body,
			);
			break;
		}

		default:
			throw new Error(`Operation "${operation}" is not supported for consent resource`);
	}

	return responseData;
}
