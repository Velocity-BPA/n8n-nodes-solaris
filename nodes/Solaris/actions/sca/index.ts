/**
 * @file SCA (Strong Customer Authentication) Resource Actions
 * @description Operations for PSD2 Strong Customer Authentication management
 * @license Business Source License 1.1 - Velocity BPA
 *
 * SCA is required by PSD2 for:
 * - Online payments over €30
 * - Account access
 * - Sensitive operations (card activation, limit changes)
 *
 * Authentication factors:
 * - Knowledge: PIN, password
 * - Possession: Mobile device, card
 * - Inherence: Biometrics
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { solarisApiRequest, solarisApiRequestAllItems } from '../../transport/solarisClient';

export const scaOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['sca'],
			},
		},
		options: [
			{
				name: 'Create Challenge',
				value: 'createChallenge',
				description: 'Create a new SCA challenge',
				action: 'Create SCA challenge',
			},
			{
				name: 'Get Challenge',
				value: 'getChallenge',
				description: 'Get SCA challenge details',
				action: 'Get SCA challenge',
			},
			{
				name: 'Get Methods',
				value: 'getMethods',
				description: 'Get available SCA methods for a person',
				action: 'Get SCA methods',
			},
			{
				name: 'Get Status',
				value: 'getStatus',
				description: 'Get SCA challenge status',
				action: 'Get SCA status',
			},
			{
				name: 'Register Device',
				value: 'registerDevice',
				description: 'Register a device for SCA',
				action: 'Register SCA device',
			},
			{
				name: 'Verify',
				value: 'verify',
				description: 'Verify/complete SCA challenge',
				action: 'Verify SCA',
			},
		],
		default: 'createChallenge',
	},
];

export const scaFields: INodeProperties[] = [
	// ----------------------------------
	//         sca: createChallenge
	// ----------------------------------
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['sca'],
				operation: ['createChallenge', 'getMethods', 'registerDevice'],
			},
		},
		description: 'The unique identifier of the person',
	},
	{
		displayName: 'Operation Type',
		name: 'scaOperationType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['sca'],
				operation: ['createChallenge'],
			},
		},
		options: [
			{ name: 'Account Access', value: 'ACCOUNT_ACCESS' },
			{ name: 'Card Activation', value: 'CARD_ACTIVATION' },
			{ name: 'Card PIN Change', value: 'CARD_PIN_CHANGE' },
			{ name: 'Device Binding', value: 'DEVICE_BINDING' },
			{ name: 'Direct Debit', value: 'DIRECT_DEBIT' },
			{ name: 'Instant Transfer', value: 'INSTANT_TRANSFER' },
			{ name: 'Internal Transfer', value: 'INTERNAL_TRANSFER' },
			{ name: 'Limit Change', value: 'LIMIT_CHANGE' },
			{ name: 'Login', value: 'LOGIN' },
			{ name: 'SEPA Transfer', value: 'SEPA_TRANSFER' },
			{ name: 'Standing Order', value: 'STANDING_ORDER' },
		],
		default: 'SEPA_TRANSFER',
		description: 'Type of operation requiring SCA',
	},
	{
		displayName: 'SCA Method',
		name: 'scaMethod',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['sca'],
				operation: ['createChallenge'],
			},
		},
		options: [
			{ name: 'App Push Notification', value: 'PUSH' },
			{ name: 'Biometric', value: 'BIOMETRIC' },
			{ name: 'Email OTP', value: 'EMAIL_OTP' },
			{ name: 'Hardware Token', value: 'HARDWARE_TOKEN' },
			{ name: 'SMS OTP', value: 'SMS_OTP' },
			{ name: 'TOTP (Authenticator App)', value: 'TOTP' },
		],
		default: 'SMS_OTP',
		description: 'SCA method to use for authentication',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['sca'],
				operation: ['createChallenge'],
			},
		},
		options: [
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				default: 0,
				description: 'Transaction amount (for payment operations)',
			},
			{
				displayName: 'Callback URL',
				name: 'callbackUrl',
				type: 'string',
				default: '',
				description: 'URL to redirect after SCA completion',
			},
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'string',
				default: 'EUR',
				description: 'Currency code (ISO 4217)',
			},
			{
				displayName: 'Device Binding ID',
				name: 'deviceBindingId',
				type: 'string',
				default: '',
				description: 'Device binding to use for push/biometric SCA',
			},
			{
				displayName: 'Reference ID',
				name: 'referenceId',
				type: 'string',
				default: '',
				description: 'Reference to the operation requiring SCA (e.g., transfer ID)',
			},
			{
				displayName: 'TTL (Seconds)',
				name: 'ttl',
				type: 'number',
				default: 300,
				description: 'Time-to-live for the challenge in seconds',
			},
		],
	},

	// ----------------------------------
	//         sca: getChallenge, getStatus, verify
	// ----------------------------------
	{
		displayName: 'Challenge ID',
		name: 'challengeId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['sca'],
				operation: ['getChallenge', 'getStatus', 'verify'],
			},
		},
		description: 'The unique identifier of the SCA challenge',
	},

	// ----------------------------------
	//         sca: verify
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
				resource: ['sca'],
				operation: ['verify'],
			},
		},
		options: [
			{
				displayName: 'Biometric Data',
				name: 'biometricData',
				type: 'string',
				default: '',
				description: 'Base64-encoded biometric verification data',
			},
			{
				displayName: 'OTP Code',
				name: 'otpCode',
				type: 'string',
				default: '',
				description: 'One-time password (SMS/Email/TOTP)',
			},
			{
				displayName: 'Push Response',
				name: 'pushResponse',
				type: 'string',
				default: '',
				description: 'Response token from push notification',
			},
			{
				displayName: 'Signature',
				name: 'signature',
				type: 'string',
				default: '',
				description: 'Cryptographic signature from device',
			},
			{
				displayName: 'Token',
				name: 'token',
				type: 'string',
				default: '',
				description: 'Hardware token response',
			},
		],
	},

	// ----------------------------------
	//         sca: registerDevice
	// ----------------------------------
	{
		displayName: 'Device Registration Data',
		name: 'deviceData',
		type: 'collection',
		placeholder: 'Add Device Data',
		default: {},
		required: true,
		displayOptions: {
			show: {
				resource: ['sca'],
				operation: ['registerDevice'],
			},
		},
		options: [
			{
				displayName: 'Device Name',
				name: 'deviceName',
				type: 'string',
				default: '',
				description: 'Human-readable device name',
			},
			{
				displayName: 'Device Type',
				name: 'deviceType',
				type: 'options',
				options: [
					{ name: 'Android', value: 'ANDROID' },
					{ name: 'iOS', value: 'IOS' },
				],
				default: 'ANDROID',
				description: 'Type of mobile device',
			},
			{
				displayName: 'Public Key',
				name: 'publicKey',
				type: 'string',
				default: '',
				description: 'Device public key for cryptographic verification (PEM format)',
			},
			{
				displayName: 'Push Token',
				name: 'pushToken',
				type: 'string',
				default: '',
				description: 'FCM/APNs push notification token',
			},
			{
				displayName: 'SCA Capabilities',
				name: 'scaCapabilities',
				type: 'multiOptions',
				options: [
					{ name: 'Biometric', value: 'BIOMETRIC' },
					{ name: 'Device Signature', value: 'DEVICE_SIGNATURE' },
					{ name: 'Push Notification', value: 'PUSH' },
				],
				default: ['PUSH'],
				description: 'SCA capabilities supported by the device',
			},
		],
	},

	// ----------------------------------
	//         sca: getMethods
	// ----------------------------------
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['sca'],
				operation: ['getMethods'],
			},
		},
		options: [
			{
				displayName: 'Include Inactive',
				name: 'includeInactive',
				type: 'boolean',
				default: false,
				description: 'Whether to include inactive SCA methods',
			},
			{
				displayName: 'Operation Type',
				name: 'operationType',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Account Access', value: 'ACCOUNT_ACCESS' },
					{ name: 'Payment', value: 'PAYMENT' },
					{ name: 'Sensitive Operation', value: 'SENSITIVE' },
				],
				default: '',
				description: 'Filter methods by supported operation type',
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
		case 'createChallenge': {
			const personId = this.getNodeParameter('personId', i) as string;
			const scaOperationType = this.getNodeParameter('scaOperationType', i) as string;
			const scaMethod = this.getNodeParameter('scaMethod', i) as string;
			const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

			const body: IDataObject = {
				operation_type: scaOperationType,
				method: scaMethod,
			};

			if (additionalFields.referenceId) body.reference_id = additionalFields.referenceId;
			if (additionalFields.amount) body.amount = { value: additionalFields.amount, currency: additionalFields.currency || 'EUR' };
			if (additionalFields.deviceBindingId) body.device_binding_id = additionalFields.deviceBindingId;
			if (additionalFields.callbackUrl) body.callback_url = additionalFields.callbackUrl;
			if (additionalFields.ttl) body.ttl = additionalFields.ttl;

			responseData = await solarisApiRequest.call(
				this,
				'POST',
				`/v1/persons/${personId}/sca/challenges`,
				body,
			);
			break;
		}

		case 'getChallenge': {
			const challengeId = this.getNodeParameter('challengeId', i) as string;

			responseData = await solarisApiRequest.call(
				this,
				'GET',
				`/v1/sca/challenges/${challengeId}`,
			);
			break;
		}

		case 'getStatus': {
			const challengeId = this.getNodeParameter('challengeId', i) as string;

			responseData = await solarisApiRequest.call(
				this,
				'GET',
				`/v1/sca/challenges/${challengeId}/status`,
			);
			break;
		}

		case 'verify': {
			const challengeId = this.getNodeParameter('challengeId', i) as string;
			const verificationData = this.getNodeParameter('verificationData', i) as IDataObject;

			const body: IDataObject = {};

			if (verificationData.otpCode) body.otp = verificationData.otpCode;
			if (verificationData.pushResponse) body.push_response = verificationData.pushResponse;
			if (verificationData.signature) body.signature = verificationData.signature;
			if (verificationData.biometricData) body.biometric_data = verificationData.biometricData;
			if (verificationData.token) body.token = verificationData.token;

			responseData = await solarisApiRequest.call(
				this,
				'POST',
				`/v1/sca/challenges/${challengeId}/verify`,
				body,
			);
			break;
		}

		case 'getMethods': {
			const personId = this.getNodeParameter('personId', i) as string;
			const options = this.getNodeParameter('options', i) as IDataObject;

			const qs: IDataObject = {};
			if (options.includeInactive) qs.include_inactive = true;
			if (options.operationType) qs.operation_type = options.operationType;

			responseData = await solarisApiRequest.call(
				this,
				'GET',
				`/v1/persons/${personId}/sca/methods`,
				{},
				qs,
			);
			break;
		}

		case 'registerDevice': {
			const personId = this.getNodeParameter('personId', i) as string;
			const deviceData = this.getNodeParameter('deviceData', i) as IDataObject;

			const body: IDataObject = {};

			if (deviceData.deviceName) body.device_name = deviceData.deviceName;
			if (deviceData.deviceType) body.device_type = deviceData.deviceType;
			if (deviceData.publicKey) body.public_key = deviceData.publicKey;
			if (deviceData.pushToken) body.push_token = deviceData.pushToken;
			if (deviceData.scaCapabilities) body.sca_capabilities = deviceData.scaCapabilities;

			responseData = await solarisApiRequest.call(
				this,
				'POST',
				`/v1/persons/${personId}/sca/devices`,
				body,
			);
			break;
		}

		default:
			throw new Error(`Operation "${operation}" is not supported for sca resource`);
	}

	return responseData;
}
