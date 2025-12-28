/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IExecuteFunctions, IDataObject, INodeProperties } from 'n8n-workflow';
import { solarisApiRequest, solarisApiRequestAllItems } from '../../transport/solarisClient';
import { BUSINESS_ENDPOINTS } from '../../constants/endpoints';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['business'] } },
		options: [
			{ name: 'Add Representative', value: 'addRepresentative', description: 'Add a representative to a business', action: 'Add representative' },
			{ name: 'Create', value: 'create', description: 'Create a new business', action: 'Create a business' },
			{ name: 'Get', value: 'get', description: 'Get a business by ID', action: 'Get a business' },
			{ name: 'Get Accounts', value: 'getAccounts', description: 'Get accounts for a business', action: 'Get business accounts' },
			{ name: 'Get By External ID', value: 'getByExternalId', description: 'Get business by external reference', action: 'Get business by external ID' },
			{ name: 'Get Documents', value: 'getDocuments', description: 'Get documents for a business', action: 'Get business documents' },
			{ name: 'Get Representatives', value: 'getRepresentatives', description: 'Get representatives of a business', action: 'Get representatives' },
			{ name: 'Get Status', value: 'getStatus', description: 'Get current status of a business', action: 'Get business status' },
			{ name: 'List', value: 'list', description: 'List all businesses', action: 'List businesses' },
			{ name: 'Remove Representative', value: 'removeRepresentative', description: 'Remove a representative from a business', action: 'Remove representative' },
			{ name: 'Set Limits', value: 'setLimits', description: 'Set limits for a business', action: 'Set business limits' },
			{ name: 'Update', value: 'update', description: 'Update a business', action: 'Update a business' },
		],
		default: 'create',
	},
	// Create operation fields
	{
		displayName: 'Company Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['business'], operation: ['create'] } },
		description: 'Legal name of the business',
	},
	{
		displayName: 'Legal Form',
		name: 'legalForm',
		type: 'options',
		options: [
			{ name: 'GmbH', value: 'GMBH' },
			{ name: 'UG (haftungsbeschränkt)', value: 'UG' },
			{ name: 'AG', value: 'AG' },
			{ name: 'OHG', value: 'OHG' },
			{ name: 'KG', value: 'KG' },
			{ name: 'GmbH & Co. KG', value: 'GMBH_CO_KG' },
			{ name: 'e.K.', value: 'EK' },
			{ name: 'GbR', value: 'GBR' },
			{ name: 'Einzelunternehmen', value: 'EINZELUNTERNEHMEN' },
			{ name: 'Freiberufler', value: 'FREIBERUFLER' },
			{ name: 'e.V.', value: 'EV' },
			{ name: 'Stiftung', value: 'STIFTUNG' },
			{ name: 'Genossenschaft', value: 'GENOSSENSCHAFT' },
			{ name: 'Other', value: 'OTHER' },
		],
		default: 'GMBH',
		required: true,
		displayOptions: { show: { resource: ['business'], operation: ['create'] } },
		description: 'German legal form of the business',
	},
	{
		displayName: 'Registration Number',
		name: 'registrationNumber',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['business'], operation: ['create'] } },
		description: 'Commercial register number (Handelsregisternummer)',
		placeholder: 'HRB 12345',
	},
	{
		displayName: 'Registration Court',
		name: 'registrationCourt',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['business'], operation: ['create'] } },
		description: 'Registration court (e.g., Amtsgericht Berlin)',
	},
	{
		displayName: 'Tax ID',
		name: 'taxId',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['business'], operation: ['create'] } },
		description: 'Tax identification number (Steuernummer)',
	},
	{
		displayName: 'VAT ID',
		name: 'vatId',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['business'], operation: ['create'] } },
		description: 'VAT identification number (USt-IdNr)',
		placeholder: 'DE123456789',
	},
	{
		displayName: 'Industry',
		name: 'industry',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['business'], operation: ['create'] } },
		description: 'Industry sector of the business',
	},
	{
		displayName: 'Website',
		name: 'website',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['business'], operation: ['create'] } },
		placeholder: 'https://example.com',
	},
	{
		displayName: 'Business Address',
		name: 'address',
		type: 'fixedCollection',
		typeOptions: { multipleValues: false },
		default: {},
		required: true,
		displayOptions: { show: { resource: ['business'], operation: ['create'] } },
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
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['business'], operation: ['create'] } },
		options: [
			{ displayName: 'External Reference', name: 'external_reference', type: 'string', default: '' },
			{ displayName: 'Foundation Date', name: 'foundation_date', type: 'string', default: '', placeholder: '2020-01-01' },
			{ displayName: 'Phone Number', name: 'phone_number', type: 'string', default: '' },
			{ displayName: 'Email', name: 'email', type: 'string', default: '' },
		],
	},
	// Get/Update/Delete operations
	{
		displayName: 'Business ID',
		name: 'businessId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['business'], operation: ['get', 'update', 'getStatus', 'getRepresentatives', 'getDocuments', 'getAccounts', 'setLimits'] } },
		description: 'The ID of the business',
	},
	{
		displayName: 'External ID',
		name: 'externalId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['business'], operation: ['getByExternalId'] } },
		description: 'Your external reference ID for the business',
	},
	// Update fields
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['business'], operation: ['update'] } },
		options: [
			{ displayName: 'Name', name: 'name', type: 'string', default: '' },
			{ displayName: 'Industry', name: 'industry', type: 'string', default: '' },
			{ displayName: 'Website', name: 'website', type: 'string', default: '' },
			{ displayName: 'Phone Number', name: 'phone_number', type: 'string', default: '' },
			{ displayName: 'Email', name: 'email', type: 'string', default: '' },
			{ displayName: 'External Reference', name: 'external_reference', type: 'string', default: '' },
		],
	},
	// Add Representative fields
	{
		displayName: 'Business ID',
		name: 'businessId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['business'], operation: ['addRepresentative', 'removeRepresentative'] } },
	},
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['business'], operation: ['addRepresentative', 'removeRepresentative'] } },
		description: 'The ID of the person to add/remove as representative',
	},
	{
		displayName: 'Role',
		name: 'role',
		type: 'options',
		options: [
			{ name: 'Managing Director', value: 'MANAGING_DIRECTOR' },
			{ name: 'Authorized Signatory', value: 'AUTHORIZED_SIGNATORY' },
			{ name: 'Beneficial Owner', value: 'BENEFICIAL_OWNER' },
			{ name: 'Legal Representative', value: 'LEGAL_REPRESENTATIVE' },
		],
		default: 'MANAGING_DIRECTOR',
		required: true,
		displayOptions: { show: { resource: ['business'], operation: ['addRepresentative'] } },
	},
	{
		displayName: 'Ownership Percentage',
		name: 'ownershipPercentage',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0, maxValue: 100 },
		displayOptions: { show: { resource: ['business'], operation: ['addRepresentative'] } },
		description: 'Percentage of ownership (for beneficial owners)',
	},
	// Set Limits
	{
		displayName: 'Limits',
		name: 'limits',
		type: 'fixedCollection',
		typeOptions: { multipleValues: false },
		default: {},
		required: true,
		displayOptions: { show: { resource: ['business'], operation: ['setLimits'] } },
		options: [
			{
				name: 'limitFields',
				displayName: 'Limits',
				values: [
					{ displayName: 'Daily Transfer Limit', name: 'daily_transfer_limit', type: 'number', default: 50000 },
					{ displayName: 'Monthly Transfer Limit', name: 'monthly_transfer_limit', type: 'number', default: 250000 },
					{ displayName: 'Single Transfer Limit', name: 'single_transfer_limit', type: 'number', default: 25000 },
				],
			},
		],
	},
	// List fields
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['business'], operation: ['list', 'getRepresentatives', 'getDocuments', 'getAccounts'] } },
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1, maxValue: 100 },
		displayOptions: { show: { resource: ['business'], operation: ['list', 'getRepresentatives', 'getDocuments', 'getAccounts'], returnAll: [false] } },
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['business'], operation: ['list'] } },
		options: [
			{ displayName: 'Status', name: 'status', type: 'options', options: [
				{ name: 'Created', value: 'CREATED' },
				{ name: 'Pending', value: 'PENDING' },
				{ name: 'Active', value: 'ACTIVE' },
				{ name: 'Blocked', value: 'BLOCKED' },
				{ name: 'Rejected', value: 'REJECTED' },
				{ name: 'Archived', value: 'ARCHIVED' },
			], default: 'ACTIVE' },
			{ displayName: 'Legal Form', name: 'legal_form', type: 'string', default: '' },
			{ displayName: 'External Reference', name: 'external_reference', type: 'string', default: '' },
		],
	},
];

export async function execute(this: IExecuteFunctions, index: number, operation: string): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];

	switch (operation) {
		case 'create': {
			const name = this.getNodeParameter('name', index) as string;
			const legalForm = this.getNodeParameter('legalForm', index) as string;
			const registrationNumber = this.getNodeParameter('registrationNumber', index) as string;
			const registrationCourt = this.getNodeParameter('registrationCourt', index) as string;
			const taxId = this.getNodeParameter('taxId', index) as string;
			const vatId = this.getNodeParameter('vatId', index) as string;
			const industry = this.getNodeParameter('industry', index) as string;
			const website = this.getNodeParameter('website', index) as string;
			const address = this.getNodeParameter('address', index) as IDataObject;
			const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

			const body: IDataObject = {
				name,
				legal_form: legalForm,
				registration_number: registrationNumber,
				registration_court: registrationCourt,
			};

			if (taxId) body.tax_id = taxId;
			if (vatId) body.vat_id = vatId;
			if (industry) body.industry = industry;
			if (website) body.website = website;
			if (address.addressFields) body.address = address.addressFields;

			Object.assign(body, additionalFields);

			responseData = await solarisApiRequest.call(this, 'POST', BUSINESS_ENDPOINTS.CREATE, body);
			break;
		}

		case 'get': {
			const businessId = this.getNodeParameter('businessId', index) as string;
			responseData = await solarisApiRequest.call(this, 'GET', BUSINESS_ENDPOINTS.GET(businessId));
			break;
		}

		case 'getByExternalId': {
			const externalId = this.getNodeParameter('externalId', index) as string;
			responseData = await solarisApiRequest.call(this, 'GET', BUSINESS_ENDPOINTS.GET_BY_EXTERNAL_ID(externalId));
			break;
		}

		case 'update': {
			const businessId = this.getNodeParameter('businessId', index) as string;
			const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

			if (Object.keys(updateFields).length === 0) {
				throw new Error('At least one update field must be provided');
			}

			responseData = await solarisApiRequest.call(this, 'PATCH', BUSINESS_ENDPOINTS.UPDATE(businessId), updateFields);
			break;
		}

		case 'list': {
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;
			const filters = this.getNodeParameter('filters', index) as IDataObject;
			const qs: IDataObject = { ...filters };

			if (returnAll) {
				responseData = await solarisApiRequestAllItems.call(this, 'GET', BUSINESS_ENDPOINTS.LIST, {}, qs);
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				qs.page = { size: limit };
				responseData = await solarisApiRequest.call(this, 'GET', BUSINESS_ENDPOINTS.LIST, {}, qs);
			}
			break;
		}

		case 'getStatus': {
			const businessId = this.getNodeParameter('businessId', index) as string;
			responseData = await solarisApiRequest.call(this, 'GET', BUSINESS_ENDPOINTS.GET_STATUS(businessId));
			break;
		}

		case 'getRepresentatives': {
			const businessId = this.getNodeParameter('businessId', index) as string;
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;

			if (returnAll) {
				responseData = await solarisApiRequestAllItems.call(this, 'GET', BUSINESS_ENDPOINTS.GET_REPRESENTATIVES(businessId));
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				responseData = await solarisApiRequest.call(this, 'GET', BUSINESS_ENDPOINTS.GET_REPRESENTATIVES(businessId), {}, { page: { size: limit } });
			}
			break;
		}

		case 'addRepresentative': {
			const businessId = this.getNodeParameter('businessId', index) as string;
			const personId = this.getNodeParameter('personId', index) as string;
			const role = this.getNodeParameter('role', index) as string;
			const ownershipPercentage = this.getNodeParameter('ownershipPercentage', index) as number;

			const body: IDataObject = {
				person_id: personId,
				role,
			};

			if (ownershipPercentage > 0) {
				body.ownership_percentage = ownershipPercentage;
			}

			responseData = await solarisApiRequest.call(this, 'POST', BUSINESS_ENDPOINTS.ADD_REPRESENTATIVE(businessId), body);
			break;
		}

		case 'removeRepresentative': {
			const businessId = this.getNodeParameter('businessId', index) as string;
			const personId = this.getNodeParameter('personId', index) as string;

			responseData = await solarisApiRequest.call(this, 'DELETE', BUSINESS_ENDPOINTS.REMOVE_REPRESENTATIVE(businessId, personId));
			break;
		}

		case 'getDocuments': {
			const businessId = this.getNodeParameter('businessId', index) as string;
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;

			if (returnAll) {
				responseData = await solarisApiRequestAllItems.call(this, 'GET', BUSINESS_ENDPOINTS.GET_DOCUMENTS(businessId));
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				responseData = await solarisApiRequest.call(this, 'GET', BUSINESS_ENDPOINTS.GET_DOCUMENTS(businessId), {}, { page: { size: limit } });
			}
			break;
		}

		case 'getAccounts': {
			const businessId = this.getNodeParameter('businessId', index) as string;
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;

			if (returnAll) {
				responseData = await solarisApiRequestAllItems.call(this, 'GET', BUSINESS_ENDPOINTS.GET_ACCOUNTS(businessId));
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				responseData = await solarisApiRequest.call(this, 'GET', BUSINESS_ENDPOINTS.GET_ACCOUNTS(businessId), {}, { page: { size: limit } });
			}
			break;
		}

		case 'setLimits': {
			const businessId = this.getNodeParameter('businessId', index) as string;
			const limits = this.getNodeParameter('limits', index) as IDataObject;

			if (!limits.limitFields) {
				throw new Error('Limit fields are required');
			}

			responseData = await solarisApiRequest.call(this, 'PUT', BUSINESS_ENDPOINTS.SET_LIMITS(businessId), limits.limitFields);
			break;
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData;
}
