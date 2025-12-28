/**
 * @file Device Binding Resource Actions
 * @description Operations for managing device bindings for secure authentication (mobile/app devices)
 * @license Business Source License 1.1 - Velocity BPA
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { solarisApiRequest, solarisApiRequestAllItems } from '../../transport/solarisClient';

export const deviceBindingOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['deviceBinding'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new device binding',
				action: 'Create a device binding',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a device binding',
				action: 'Delete a device binding',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a device binding by ID',
				action: 'Get a device binding',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Get all device bindings for a person',
				action: 'Get all device bindings',
			},
			{
				name: 'Get Challenge',
				value: 'getChallenge',
				description: 'Get binding challenge for device verification',
				action: 'Get binding challenge',
			},
			{
				name: 'Verify',
				value: 'verify',
				description: 'Verify a device binding',
				action: 'Verify device binding',
			},
		],
		default: 'getAll',
	},
];

export const deviceBindingFields: INodeProperties[] = [
	// ----------------------------------
	//         deviceBinding: create
	// ----------------------------------
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['deviceBinding'],
				operation: ['create', 'getAll'],
			},
		},
		description: 'The unique identifier of the person',
	},
	{
		displayName: 'Device Type',
		name: 'deviceType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['deviceBinding'],
				operation: ['create'],
			},
		},
		options: [
			{ name: 'Android', value: 'ANDROID' },
			{ name: 'iOS', value: 'IOS' },
			{ name: 'Web Browser', value: 'WEB' },
		],
		default: 'ANDROID',
		description: 'Type of device being bound',
	},
	{
		displayName: 'Device Name',
		name: 'deviceName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['deviceBinding'],
				operation: ['create'],
			},
		},
		description: 'Human-readable name for the device (e.g., "John\'s iPhone")',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['deviceBinding'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'App Version',
				name: 'appVersion',
				type: 'string',
				default: '',
				description: 'Version of the app on the device',
			},
			{
				displayName: 'Device Fingerprint',
				name: 'deviceFingerprint',
				type: 'string',
				default: '',
				description: 'Unique device fingerprint for identification',
			},
			{
				displayName: 'Device ID',
				name: 'deviceId',
				type: 'string',
				default: '',
				description: 'Unique device identifier (UUID)',
			},
			{
				displayName: 'Device Model',
				name: 'deviceModel',
				type: 'string',
				default: '',
				description: 'Device model (e.g., "iPhone 14 Pro")',
			},
			{
				displayName: 'OS Version',
				name: 'osVersion',
				type: 'string',
				default: '',
				description: 'Operating system version',
			},
			{
				displayName: 'Public Key',
				name: 'publicKey',
				type: 'string',
				default: '',
				description: 'Public key for device authentication (PEM format)',
			},
			{
				displayName: 'Push Token',
				name: 'pushToken',
				type: 'string',
				default: '',
				description: 'Push notification token (FCM/APNs)',
			},
		],
	},

	// ----------------------------------
	//         deviceBinding: get, delete, verify, getChallenge
	// ----------------------------------
	{
		displayName: 'Device Binding ID',
		name: 'deviceBindingId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['deviceBinding'],
				operation: ['get', 'delete', 'verify', 'getChallenge'],
			},
		},
		description: 'The unique identifier of the device binding',
	},

	// ----------------------------------
	//         deviceBinding: verify
	// ----------------------------------
	{
		displayName: 'Verification Data',
		name: 'verificationData',
		type: 'collection',
		placeholder: 'Add Verification Data',
		default: {},
		required: true,
		displayOptions: {
			show: {
				resource: ['deviceBinding'],
				operation: ['verify'],
			},
		},
		options: [
			{
				displayName: 'Challenge Response',
				name: 'challengeResponse',
				type: 'string',
				default: '',
				description: 'Signed challenge response from device',
			},
			{
				displayName: 'OTP Code',
				name: 'otpCode',
				type: 'string',
				default: '',
				description: 'One-time password for SMS/email verification',
			},
			{
				displayName: 'Signature',
				name: 'signature',
				type: 'string',
				default: '',
				description: 'Cryptographic signature for verification',
			},
			{
				displayName: 'Verification Method',
				name: 'verificationMethod',
				type: 'options',
				options: [
					{ name: 'Challenge-Response', value: 'CHALLENGE_RESPONSE' },
					{ name: 'OTP via Email', value: 'EMAIL_OTP' },
					{ name: 'OTP via SMS', value: 'SMS_OTP' },
					{ name: 'Push Confirmation', value: 'PUSH_CONFIRMATION' },
				],
				default: 'SMS_OTP',
				description: 'Method used to verify device binding',
			},
		],
	},

	// ----------------------------------
	//         deviceBinding: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['deviceBinding'],
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
				resource: ['deviceBinding'],
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
				resource: ['deviceBinding'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Device Type',
				name: 'deviceType',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Android', value: 'ANDROID' },
					{ name: 'iOS', value: 'IOS' },
					{ name: 'Web', value: 'WEB' },
				],
				default: '',
				description: 'Filter by device type',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Active', value: 'ACTIVE' },
					{ name: 'Inactive', value: 'INACTIVE' },
					{ name: 'Pending', value: 'PENDING' },
					{ name: 'Revoked', value: 'REVOKED' },
				],
				default: '',
				description: 'Filter by binding status',
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
			const deviceType = this.getNodeParameter('deviceType', i) as string;
			const deviceName = this.getNodeParameter('deviceName', i) as string;
			const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

			const body: IDataObject = {
				device_type: deviceType,
				device_name: deviceName,
			};

			if (additionalFields.deviceId) body.device_id = additionalFields.deviceId;
			if (additionalFields.deviceModel) body.device_model = additionalFields.deviceModel;
			if (additionalFields.osVersion) body.os_version = additionalFields.osVersion;
			if (additionalFields.appVersion) body.app_version = additionalFields.appVersion;
			if (additionalFields.publicKey) body.public_key = additionalFields.publicKey;
			if (additionalFields.pushToken) body.push_token = additionalFields.pushToken;
			if (additionalFields.deviceFingerprint) body.device_fingerprint = additionalFields.deviceFingerprint;

			responseData = await solarisApiRequest.call(
				this,
				'POST',
				`/v1/persons/${personId}/device_bindings`,
				body,
			);
			break;
		}

		case 'get': {
			const deviceBindingId = this.getNodeParameter('deviceBindingId', i) as string;

			responseData = await solarisApiRequest.call(
				this,
				'GET',
				`/v1/device_bindings/${deviceBindingId}`,
			);
			break;
		}

		case 'getAll': {
			const personId = this.getNodeParameter('personId', i) as string;
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			const filters = this.getNodeParameter('filters', i) as IDataObject;

			const qs: IDataObject = {};
			if (filters.deviceType) qs.device_type = filters.deviceType;
			if (filters.status) qs.status = filters.status;

			if (returnAll) {
				responseData = await solarisApiRequestAllItems.call(
					this,
					'GET',
					`/v1/persons/${personId}/device_bindings`,
					{},
					qs,
				);
			} else {
				const limit = this.getNodeParameter('limit', i) as number;
				qs.page = { size: limit };
				const response = await solarisApiRequest.call(
					this,
					'GET',
					`/v1/persons/${personId}/device_bindings`,
					{},
					qs,
				);
				responseData = Array.isArray(response) ? response : [response];
			}
			break;
		}

		case 'delete': {
			const deviceBindingId = this.getNodeParameter('deviceBindingId', i) as string;

			responseData = await solarisApiRequest.call(
				this,
				'DELETE',
				`/v1/device_bindings/${deviceBindingId}`,
			);

			responseData = { success: true, id: deviceBindingId, deleted: true };
			break;
		}

		case 'verify': {
			const deviceBindingId = this.getNodeParameter('deviceBindingId', i) as string;
			const verificationData = this.getNodeParameter('verificationData', i) as IDataObject;

			const body: IDataObject = {};

			if (verificationData.verificationMethod) body.verification_method = verificationData.verificationMethod;
			if (verificationData.otpCode) body.otp_code = verificationData.otpCode;
			if (verificationData.challengeResponse) body.challenge_response = verificationData.challengeResponse;
			if (verificationData.signature) body.signature = verificationData.signature;

			responseData = await solarisApiRequest.call(
				this,
				'POST',
				`/v1/device_bindings/${deviceBindingId}/verify`,
				body,
			);
			break;
		}

		case 'getChallenge': {
			const deviceBindingId = this.getNodeParameter('deviceBindingId', i) as string;

			responseData = await solarisApiRequest.call(
				this,
				'GET',
				`/v1/device_bindings/${deviceBindingId}/challenge`,
			);
			break;
		}

		default:
			throw new Error(`Operation "${operation}" is not supported for deviceBinding resource`);
	}

	return responseData;
}
