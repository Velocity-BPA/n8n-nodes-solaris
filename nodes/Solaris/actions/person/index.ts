/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IExecuteFunctions, IDataObject, INodeProperties } from 'n8n-workflow';
import { solarisApiRequest, solarisApiRequestAllItems } from '../../transport/solarisClient';
import { PERSON_ENDPOINTS } from '../../constants/endpoints';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['person'],
			},
		},
		options: [
			{ name: 'Archive', value: 'archive', description: 'Archive a person', action: 'Archive a person' },
			{ name: 'Create', value: 'create', description: 'Create a new person', action: 'Create a person' },
			{ name: 'Get', value: 'get', description: 'Get a person by ID', action: 'Get a person' },
			{ name: 'Get Accounts', value: 'getAccounts', description: 'Get accounts for a person', action: 'Get person accounts' },
			{ name: 'Get By External ID', value: 'getByExternalId', description: 'Get person by external reference', action: 'Get person by external ID' },
			{ name: 'Get Cards', value: 'getCards', description: 'Get cards for a person', action: 'Get person cards' },
			{ name: 'Get Documents', value: 'getDocuments', description: 'Get documents for a person', action: 'Get person documents' },
			{ name: 'Get Status', value: 'getStatus', description: 'Get current status of a person', action: 'Get person status' },
			{ name: 'Get Tax Info', value: 'getTaxInfo', description: 'Get tax information for a person', action: 'Get person tax info' },
			{ name: 'List', value: 'list', description: 'List all persons', action: 'List persons' },
			{ name: 'Set Limits', value: 'setLimits', description: 'Set limits for a person', action: 'Set person limits' },
			{ name: 'Update', value: 'update', description: 'Update a person', action: 'Update a person' },
			{ name: 'Update Address', value: 'updateAddress', description: 'Update person address', action: 'Update person address' },
		],
		default: 'create',
	},
	// Create operation fields
	{
		displayName: 'Salutation',
		name: 'salutation',
		type: 'options',
		options: [
			{ name: 'Mr', value: 'MR' },
			{ name: 'Ms', value: 'MS' },
		],
		default: 'MR',
		required: true,
		displayOptions: { show: { resource: ['person'], operation: ['create'] } },
		description: 'Salutation/title of the person',
	},
	{
		displayName: 'First Name',
		name: 'firstName',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['person'], operation: ['create'] } },
		description: 'First name of the person',
	},
	{
		displayName: 'Last Name',
		name: 'lastName',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['person'], operation: ['create'] } },
		description: 'Last name of the person',
	},
	{
		displayName: 'Birth Date',
		name: 'birthDate',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['person'], operation: ['create'] } },
		description: 'Date of birth in YYYY-MM-DD format',
		placeholder: '1990-01-15',
	},
	{
		displayName: 'Birth City',
		name: 'birthCity',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['person'], operation: ['create'] } },
		description: 'City of birth',
	},
	{
		displayName: 'Birth Country',
		name: 'birthCountry',
		type: 'string',
		default: 'DE',
		required: true,
		displayOptions: { show: { resource: ['person'], operation: ['create'] } },
		description: 'Country of birth (ISO 3166-1 alpha-2 code)',
	},
	{
		displayName: 'Nationality',
		name: 'nationality',
		type: 'string',
		default: 'DE',
		required: true,
		displayOptions: { show: { resource: ['person'], operation: ['create'] } },
		description: 'Nationality (ISO 3166-1 alpha-2 code)',
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@example.com',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['person'], operation: ['create'] } },
		description: 'Email address',
	},
	{
		displayName: 'Mobile Number',
		name: 'mobileNumber',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['person'], operation: ['create'] } },
		description: 'Mobile phone number in E.164 format (e.g., +49170XXXXXXX)',
		placeholder: '+4917012345678',
	},
	{
		displayName: 'Address',
		name: 'address',
		type: 'fixedCollection',
		typeOptions: { multipleValues: false },
		default: {},
		required: true,
		displayOptions: { show: { resource: ['person'], operation: ['create'] } },
		options: [
			{
				name: 'addressFields',
				displayName: 'Address',
				values: [
					{ displayName: 'Street', name: 'line_1', type: 'string', default: '', required: true },
					{ displayName: 'Additional', name: 'line_2', type: 'string', default: '' },
					{ displayName: 'Postal Code', name: 'postal_code', type: 'string', default: '', required: true },
					{ displayName: 'City', name: 'city', type: 'string', default: '', required: true },
					{ displayName: 'Country', name: 'country', type: 'string', default: 'DE', required: true, description: 'ISO 3166-1 alpha-2 code' },
				],
			},
		],
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['person'], operation: ['create'] } },
		options: [
			{ displayName: 'External Reference', name: 'external_reference', type: 'string', default: '', description: 'Your external ID for this person' },
			{ displayName: 'Tax ID', name: 'tax_id', type: 'string', default: '', description: 'German tax identification number (Steuer-ID)' },
			{ displayName: 'Employer', name: 'employer', type: 'string', default: '' },
			{ displayName: 'Employment Status', name: 'employment_status', type: 'options', options: [
				{ name: 'Employed', value: 'EMPLOYED' },
				{ name: 'Self-Employed', value: 'SELF_EMPLOYED' },
				{ name: 'Unemployed', value: 'UNEMPLOYED' },
				{ name: 'Retired', value: 'RETIRED' },
				{ name: 'Student', value: 'STUDENT' },
			], default: 'EMPLOYED' },
			{ displayName: 'Title', name: 'title', type: 'string', default: '', description: 'Academic or professional title (Dr., Prof., etc.)' },
		],
	},
	// Get operation fields
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['person'], operation: ['get', 'update', 'archive', 'getStatus', 'getDocuments', 'getTaxInfo', 'getAccounts', 'getCards', 'setLimits', 'updateAddress'] } },
		description: 'The ID of the person',
	},
	// Get by external ID
	{
		displayName: 'External ID',
		name: 'externalId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['person'], operation: ['getByExternalId'] } },
		description: 'Your external reference ID for the person',
	},
	// Update operation fields
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['person'], operation: ['update'] } },
		options: [
			{ displayName: 'Email', name: 'email', type: 'string', default: '' },
			{ displayName: 'Mobile Number', name: 'mobile_number', type: 'string', default: '' },
			{ displayName: 'Employer', name: 'employer', type: 'string', default: '' },
			{ displayName: 'Employment Status', name: 'employment_status', type: 'options', options: [
				{ name: 'Employed', value: 'EMPLOYED' },
				{ name: 'Self-Employed', value: 'SELF_EMPLOYED' },
				{ name: 'Unemployed', value: 'UNEMPLOYED' },
				{ name: 'Retired', value: 'RETIRED' },
				{ name: 'Student', value: 'STUDENT' },
			], default: 'EMPLOYED' },
			{ displayName: 'External Reference', name: 'external_reference', type: 'string', default: '' },
		],
	},
	// Update Address fields
	{
		displayName: 'New Address',
		name: 'newAddress',
		type: 'fixedCollection',
		typeOptions: { multipleValues: false },
		default: {},
		required: true,
		displayOptions: { show: { resource: ['person'], operation: ['updateAddress'] } },
		options: [
			{
				name: 'addressFields',
				displayName: 'Address',
				values: [
					{ displayName: 'Street', name: 'line_1', type: 'string', default: '', required: true },
					{ displayName: 'Additional', name: 'line_2', type: 'string', default: '' },
					{ displayName: 'Postal Code', name: 'postal_code', type: 'string', default: '', required: true },
					{ displayName: 'City', name: 'city', type: 'string', default: '', required: true },
					{ displayName: 'Country', name: 'country', type: 'string', default: 'DE', required: true },
				],
			},
		],
	},
	// Set Limits fields
	{
		displayName: 'Limits',
		name: 'limits',
		type: 'fixedCollection',
		typeOptions: { multipleValues: false },
		default: {},
		required: true,
		displayOptions: { show: { resource: ['person'], operation: ['setLimits'] } },
		options: [
			{
				name: 'limitFields',
				displayName: 'Limits',
				values: [
					{ displayName: 'Daily Transfer Limit', name: 'daily_transfer_limit', type: 'number', default: 10000, description: 'Maximum daily transfer amount in cents' },
					{ displayName: 'Monthly Transfer Limit', name: 'monthly_transfer_limit', type: 'number', default: 50000, description: 'Maximum monthly transfer amount in cents' },
					{ displayName: 'Single Transfer Limit', name: 'single_transfer_limit', type: 'number', default: 5000, description: 'Maximum single transfer amount in cents' },
				],
			},
		],
	},
	// List operation fields
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['person'], operation: ['list', 'getAccounts', 'getCards', 'getDocuments'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1, maxValue: 100 },
		displayOptions: { show: { resource: ['person'], operation: ['list', 'getAccounts', 'getCards', 'getDocuments'], returnAll: [false] } },
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['person'], operation: ['list'] } },
		options: [
			{ displayName: 'Status', name: 'status', type: 'options', options: [
				{ name: 'Created', value: 'CREATED' },
				{ name: 'Pending', value: 'PENDING' },
				{ name: 'Active', value: 'ACTIVE' },
				{ name: 'Blocked', value: 'BLOCKED' },
				{ name: 'Archived', value: 'ARCHIVED' },
			], default: 'ACTIVE' },
			{ displayName: 'Email', name: 'email', type: 'string', default: '' },
			{ displayName: 'External Reference', name: 'external_reference', type: 'string', default: '' },
		],
	},
];

export async function execute(this: IExecuteFunctions, index: number, operation: string): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];

	switch (operation) {
		case 'create': {
			const salutation = this.getNodeParameter('salutation', index) as string;
			const firstName = this.getNodeParameter('firstName', index) as string;
			const lastName = this.getNodeParameter('lastName', index) as string;
			const birthDate = this.getNodeParameter('birthDate', index) as string;
			const birthCity = this.getNodeParameter('birthCity', index) as string;
			const birthCountry = this.getNodeParameter('birthCountry', index) as string;
			const nationality = this.getNodeParameter('nationality', index) as string;
			const email = this.getNodeParameter('email', index) as string;
			const mobileNumber = this.getNodeParameter('mobileNumber', index) as string;
			const address = this.getNodeParameter('address', index) as IDataObject;
			const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

			const body: IDataObject = {
				salutation,
				first_name: firstName,
				last_name: lastName,
				birth_date: birthDate,
				birth_city: birthCity,
				birth_country: birthCountry,
				nationality,
				email,
				mobile_number: mobileNumber,
			};

			if (address.addressFields) {
				body.address = address.addressFields;
			}

			Object.assign(body, additionalFields);

			responseData = await solarisApiRequest.call(this, 'POST', PERSON_ENDPOINTS.CREATE, body);
			break;
		}

		case 'get': {
			const personId = this.getNodeParameter('personId', index) as string;
			responseData = await solarisApiRequest.call(this, 'GET', PERSON_ENDPOINTS.GET(personId));
			break;
		}

		case 'getByExternalId': {
			const externalId = this.getNodeParameter('externalId', index) as string;
			responseData = await solarisApiRequest.call(this, 'GET', PERSON_ENDPOINTS.GET_BY_EXTERNAL_ID(externalId));
			break;
		}

		case 'update': {
			const personId = this.getNodeParameter('personId', index) as string;
			const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

			if (Object.keys(updateFields).length === 0) {
				throw new Error('At least one update field must be provided');
			}

			responseData = await solarisApiRequest.call(this, 'PATCH', PERSON_ENDPOINTS.UPDATE(personId), updateFields);
			break;
		}

		case 'list': {
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;
			const filters = this.getNodeParameter('filters', index) as IDataObject;

			const qs: IDataObject = { ...filters };

			if (returnAll) {
				responseData = await solarisApiRequestAllItems.call(this, 'GET', PERSON_ENDPOINTS.LIST, {}, qs);
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				qs.page = { size: limit };
				responseData = await solarisApiRequest.call(this, 'GET', PERSON_ENDPOINTS.LIST, {}, qs);
			}
			break;
		}

		case 'archive': {
			const personId = this.getNodeParameter('personId', index) as string;
			responseData = await solarisApiRequest.call(this, 'POST', PERSON_ENDPOINTS.ARCHIVE(personId));
			break;
		}

		case 'getStatus': {
			const personId = this.getNodeParameter('personId', index) as string;
			responseData = await solarisApiRequest.call(this, 'GET', PERSON_ENDPOINTS.GET_STATUS(personId));
			break;
		}

		case 'getDocuments': {
			const personId = this.getNodeParameter('personId', index) as string;
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;

			if (returnAll) {
				responseData = await solarisApiRequestAllItems.call(this, 'GET', PERSON_ENDPOINTS.GET_DOCUMENTS(personId));
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				responseData = await solarisApiRequest.call(this, 'GET', PERSON_ENDPOINTS.GET_DOCUMENTS(personId), {}, { page: { size: limit } });
			}
			break;
		}

		case 'getTaxInfo': {
			const personId = this.getNodeParameter('personId', index) as string;
			responseData = await solarisApiRequest.call(this, 'GET', PERSON_ENDPOINTS.GET_TAX_INFO(personId));
			break;
		}

		case 'updateAddress': {
			const personId = this.getNodeParameter('personId', index) as string;
			const newAddress = this.getNodeParameter('newAddress', index) as IDataObject;

			if (!newAddress.addressFields) {
				throw new Error('Address fields are required');
			}

			responseData = await solarisApiRequest.call(this, 'PATCH', PERSON_ENDPOINTS.UPDATE_ADDRESS(personId), { address: newAddress.addressFields });
			break;
		}

		case 'getAccounts': {
			const personId = this.getNodeParameter('personId', index) as string;
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;

			if (returnAll) {
				responseData = await solarisApiRequestAllItems.call(this, 'GET', PERSON_ENDPOINTS.GET_ACCOUNTS(personId));
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				responseData = await solarisApiRequest.call(this, 'GET', PERSON_ENDPOINTS.GET_ACCOUNTS(personId), {}, { page: { size: limit } });
			}
			break;
		}

		case 'getCards': {
			const personId = this.getNodeParameter('personId', index) as string;
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;

			if (returnAll) {
				responseData = await solarisApiRequestAllItems.call(this, 'GET', PERSON_ENDPOINTS.GET_CARDS(personId));
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				responseData = await solarisApiRequest.call(this, 'GET', PERSON_ENDPOINTS.GET_CARDS(personId), {}, { page: { size: limit } });
			}
			break;
		}

		case 'setLimits': {
			const personId = this.getNodeParameter('personId', index) as string;
			const limits = this.getNodeParameter('limits', index) as IDataObject;

			if (!limits.limitFields) {
				throw new Error('Limit fields are required');
			}

			responseData = await solarisApiRequest.call(this, 'PUT', PERSON_ENDPOINTS.SET_LIMITS(personId), limits.limitFields);
			break;
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData;
}
