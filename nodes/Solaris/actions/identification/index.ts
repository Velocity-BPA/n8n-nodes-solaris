/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IExecuteFunctions, IDataObject, INodeProperties } from 'n8n-workflow';
import { solarisApiRequest } from '../../transport/solarisClient';
import { IDENTIFICATION_ENDPOINTS } from '../../constants/endpoints';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['identification'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create a new identification', action: 'Create identification' },
			{ name: 'Get', value: 'get', description: 'Get identification by ID', action: 'Get identification' },
			{ name: 'Get Documents', value: 'getDocuments', description: 'Get identification documents', action: 'Get identification documents' },
			{ name: 'Get Result', value: 'getResult', description: 'Get identification result', action: 'Get identification result' },
			{ name: 'Get Status', value: 'getStatus', description: 'Get identification status', action: 'Get identification status' },
			{ name: 'Get URL', value: 'getUrl', description: 'Get identification URL', action: 'Get identification URL' },
			{ name: 'Request Re-Identification', value: 'requestReIdentification', description: 'Request re-identification', action: 'Request re-identification' },
			{ name: 'Start Bank Identification', value: 'startBankIdent', description: 'Start bank identification (Bank-Ident)', action: 'Start bank identification' },
			{ name: 'Start eID Identification', value: 'startEid', description: 'Start eID identification', action: 'Start eID identification' },
			{ name: 'Start Video Identification', value: 'startVideoIdent', description: 'Start video identification (Video-Ident)', action: 'Start video identification' },
		],
		default: 'create',
	},
	// Person ID for most operations
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['identification'], operation: ['create', 'startVideoIdent', 'startBankIdent', 'startEid'] } },
		description: 'The ID of the person to identify',
	},
	// Identification ID
	{
		displayName: 'Identification ID',
		name: 'identificationId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['identification'], operation: ['get', 'getStatus', 'getResult', 'getDocuments', 'getUrl', 'requestReIdentification'] } },
	},
	// Create operation
	{
		displayName: 'Method',
		name: 'method',
		type: 'options',
		options: [
			{ name: 'Video-Ident', value: 'video_ident', description: 'Video identification via IDnow' },
			{ name: 'Bank-Ident', value: 'bank_ident', description: 'Identification via bank transfer' },
			{ name: 'eID', value: 'eid', description: 'German electronic ID card' },
			{ name: 'PostIdent', value: 'postident', description: 'Identification via Deutsche Post' },
			{ name: 'Qualified Signature', value: 'qualified_signature', description: 'Qualified electronic signature' },
		],
		default: 'video_ident',
		required: true,
		displayOptions: { show: { resource: ['identification'], operation: ['create'] } },
		description: 'Identification method to use',
	},
	{
		displayName: 'Additional Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { resource: ['identification'], operation: ['create', 'startVideoIdent', 'startBankIdent', 'startEid'] } },
		options: [
			{ displayName: 'Language', name: 'language', type: 'options', options: [
				{ name: 'German', value: 'de' },
				{ name: 'English', value: 'en' },
			], default: 'de' },
			{ displayName: 'Callback URL', name: 'callback_url', type: 'string', default: '', description: 'URL for identification completion callback' },
			{ displayName: 'External Reference', name: 'external_reference', type: 'string', default: '' },
		],
	},
];

export async function execute(this: IExecuteFunctions, index: number, operation: string): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];

	switch (operation) {
		case 'create': {
			const personId = this.getNodeParameter('personId', index) as string;
			const method = this.getNodeParameter('method', index) as string;
			const options = this.getNodeParameter('options', index) as IDataObject;

			const body: IDataObject = {
				method,
				...options,
			};

			responseData = await solarisApiRequest.call(this, 'POST', IDENTIFICATION_ENDPOINTS.CREATE(personId), body);
			break;
		}

		case 'get': {
			const identificationId = this.getNodeParameter('identificationId', index) as string;
			responseData = await solarisApiRequest.call(this, 'GET', IDENTIFICATION_ENDPOINTS.GET(identificationId));
			break;
		}

		case 'getStatus': {
			const identificationId = this.getNodeParameter('identificationId', index) as string;
			responseData = await solarisApiRequest.call(this, 'GET', IDENTIFICATION_ENDPOINTS.GET_STATUS(identificationId));
			break;
		}

		case 'startVideoIdent': {
			const personId = this.getNodeParameter('personId', index) as string;
			const options = this.getNodeParameter('options', index) as IDataObject;

			const body: IDataObject = {
				method: 'video_ident',
				...options,
			};

			responseData = await solarisApiRequest.call(this, 'POST', IDENTIFICATION_ENDPOINTS.START_VIDEO_IDENT(personId), body);
			break;
		}

		case 'startBankIdent': {
			const personId = this.getNodeParameter('personId', index) as string;
			const options = this.getNodeParameter('options', index) as IDataObject;

			const body: IDataObject = {
				method: 'bank_ident',
				...options,
			};

			responseData = await solarisApiRequest.call(this, 'POST', IDENTIFICATION_ENDPOINTS.START_BANK_IDENT(personId), body);
			break;
		}

		case 'startEid': {
			const personId = this.getNodeParameter('personId', index) as string;
			const options = this.getNodeParameter('options', index) as IDataObject;

			const body: IDataObject = {
				method: 'eid',
				...options,
			};

			responseData = await solarisApiRequest.call(this, 'POST', IDENTIFICATION_ENDPOINTS.START_EID(personId), body);
			break;
		}

		case 'getResult': {
			const identificationId = this.getNodeParameter('identificationId', index) as string;
			responseData = await solarisApiRequest.call(this, 'GET', IDENTIFICATION_ENDPOINTS.GET_RESULT(identificationId));
			break;
		}

		case 'getDocuments': {
			const identificationId = this.getNodeParameter('identificationId', index) as string;
			responseData = await solarisApiRequest.call(this, 'GET', IDENTIFICATION_ENDPOINTS.GET_DOCUMENTS(identificationId));
			break;
		}

		case 'requestReIdentification': {
			const identificationId = this.getNodeParameter('identificationId', index) as string;
			responseData = await solarisApiRequest.call(this, 'POST', IDENTIFICATION_ENDPOINTS.REQUEST_REIDENTIFICATION(identificationId));
			break;
		}

		case 'getUrl': {
			const identificationId = this.getNodeParameter('identificationId', index) as string;
			responseData = await solarisApiRequest.call(this, 'GET', IDENTIFICATION_ENDPOINTS.GET_URL(identificationId));
			break;
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData;
}
