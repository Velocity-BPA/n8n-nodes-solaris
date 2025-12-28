/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { solarisApiRequest } from '../../transport/solarisClient';
import { TAX_ENDPOINTS } from '../../constants/endpoints';

/**
 * Tax Resource
 * Manages tax-related information for German banking customers.
 * Handles Steuer-ID (German tax ID), tax residency, and withholding tax.
 */

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['tax'],
			},
		},
		options: [
			{ name: 'Get Tax Documents', value: 'getDocuments', description: 'Get tax documents for a person', action: 'Get tax documents' },
			{ name: 'Get Tax Information', value: 'getInfo', description: 'Get tax identification information', action: 'Get tax information' },
			{ name: 'Get Tax Report', value: 'getReport', description: 'Get tax report for a person', action: 'Get tax report' },
			{ name: 'Get Tax Residency', value: 'getResidency', description: 'Get tax residency information', action: 'Get tax residency' },
			{ name: 'Get Tax Withholding', value: 'getWithholding', description: 'Get tax withholding information', action: 'Get tax withholding' },
			{ name: 'Submit Tax ID', value: 'submitId', description: 'Submit German Steuer-ID', action: 'Submit tax ID' },
			{ name: 'Update Tax Information', value: 'updateInfo', description: 'Update tax identification information', action: 'Update tax information' },
		],
		default: 'getInfo',
	},
	// Person ID - required for all operations
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['tax'],
			},
		},
		default: '',
		description: 'The person ID',
	},
	// Tax ID (Steuer-ID) for submit
	{
		displayName: 'Tax ID (Steuer-ID)',
		name: 'taxId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['tax'],
				operation: ['submitId'],
			},
		},
		default: '',
		description: 'German tax identification number (11 digits)',
		placeholder: '12345678901',
	},
	// Tax residency country for update
	{
		displayName: 'Tax Residency Country',
		name: 'taxResidencyCountry',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['tax'],
				operation: ['updateInfo'],
			},
		},
		default: 'DE',
		description: 'ISO 3166-1 alpha-2 country code for tax residency',
	},
	// Additional tax info fields
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['tax'],
				operation: ['updateInfo'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Foreign Tax ID',
				name: 'foreignTaxId',
				type: 'string',
				default: '',
				description: 'Tax ID in foreign country',
			},
			{
				displayName: 'Secondary Tax Residency',
				name: 'secondaryTaxResidency',
				type: 'string',
				default: '',
				description: 'ISO 3166-1 alpha-2 country code for secondary tax residency',
			},
			{
				displayName: 'US Person',
				name: 'usPerson',
				type: 'boolean',
				default: false,
				description: 'Whether the person is a US person for FATCA purposes',
			},
		],
	},
	// Report options
	{
		displayName: 'Report Options',
		name: 'reportOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['tax'],
				operation: ['getReport'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Year',
				name: 'year',
				type: 'number',
				default: new Date().getFullYear() - 1,
				description: 'Tax year for the report',
			},
			{
				displayName: 'Format',
				name: 'format',
				type: 'options',
				options: [
					{ name: 'JSON', value: 'json' },
					{ name: 'PDF', value: 'pdf' },
				],
				default: 'json',
				description: 'Report format',
			},
		],
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
	operation: string,
): Promise<object> {
	let responseData;
	const personId = this.getNodeParameter('personId', index) as string;

	switch (operation) {
		case 'getInfo': {
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				TAX_ENDPOINTS.info(personId),
			);
			break;
		}

		case 'updateInfo': {
			const taxResidencyCountry = this.getNodeParameter('taxResidencyCountry', index) as string;
			const additionalFields = this.getNodeParameter('additionalFields', index, {}) as {
				foreignTaxId?: string;
				secondaryTaxResidency?: string;
				usPerson?: boolean;
			};

			const body: Record<string, unknown> = {
				tax_residency_country: taxResidencyCountry,
			};

			if (additionalFields.foreignTaxId) {
				body.foreign_tax_id = additionalFields.foreignTaxId;
			}
			if (additionalFields.secondaryTaxResidency) {
				body.secondary_tax_residency = additionalFields.secondaryTaxResidency;
			}
			if (additionalFields.usPerson !== undefined) {
				body.us_person = additionalFields.usPerson;
			}

			responseData = await solarisApiRequest.call(
				this,
				'PATCH',
				TAX_ENDPOINTS.info(personId),
				body,
			);
			break;
		}

		case 'getDocuments': {
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				TAX_ENDPOINTS.documents(personId),
			);
			break;
		}

		case 'getWithholding': {
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				TAX_ENDPOINTS.withholding(personId),
			);
			break;
		}

		case 'getReport': {
			const reportOptions = this.getNodeParameter('reportOptions', index, {}) as {
				year?: number;
				format?: string;
			};

			const qs: Record<string, unknown> = {};
			if (reportOptions.year) qs.year = reportOptions.year;
			if (reportOptions.format) qs.format = reportOptions.format;

			responseData = await solarisApiRequest.call(
				this,
				'GET',
				TAX_ENDPOINTS.report(personId),
				{},
				qs,
			);
			break;
		}

		case 'submitId': {
			const taxId = this.getNodeParameter('taxId', index) as string;

			responseData = await solarisApiRequest.call(
				this,
				'POST',
				TAX_ENDPOINTS.submitId(personId),
				{ tax_id: taxId },
			);
			break;
		}

		case 'getResidency': {
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				TAX_ENDPOINTS.residency(personId),
			);
			break;
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData as object;
}
