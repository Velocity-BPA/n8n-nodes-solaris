/**
 * @file Utility Resource Actions
 * @description Utility operations for validation, lookup, and API status
 * @license Business Source License 1.1 - Velocity BPA
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { solarisApiRequest } from '../../transport/solarisClient';
import { validateIBAN, validateBIC, formatIBAN, parseIBAN } from '../../utils/ibanUtils';

export const utilityOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['utility'],
			},
		},
		options: [
			{
				name: 'Get API Status',
				value: 'getApiStatus',
				description: 'Get Solaris API health status',
				action: 'Get API status',
			},
			{
				name: 'Get Bank By BIC',
				value: 'getBankByBic',
				description: 'Get bank information by BIC/SWIFT code',
				action: 'Get bank by BIC',
			},
			{
				name: 'Get Exchange Rates',
				value: 'getExchangeRates',
				description: 'Get current exchange rates',
				action: 'Get exchange rates',
			},
			{
				name: 'Get Rate Limits',
				value: 'getRateLimits',
				description: 'Get current API rate limit status',
				action: 'Get rate limits',
			},
			{
				name: 'Get Supported Countries',
				value: 'getSupportedCountries',
				description: 'Get list of supported countries',
				action: 'Get supported countries',
			},
			{
				name: 'Test Connection',
				value: 'testConnection',
				description: 'Test API connection and credentials',
				action: 'Test connection',
			},
			{
				name: 'Validate BIC',
				value: 'validateBic',
				description: 'Validate a BIC/SWIFT code',
				action: 'Validate BIC',
			},
			{
				name: 'Validate IBAN',
				value: 'validateIban',
				description: 'Validate an IBAN',
				action: 'Validate IBAN',
			},
		],
		default: 'validateIban',
	},
];

export const utilityFields: INodeProperties[] = [
	// ----------------------------------
	//         utility: validateIban
	// ----------------------------------
	{
		displayName: 'IBAN',
		name: 'iban',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['validateIban'],
			},
		},
		description: 'The IBAN to validate',
		placeholder: 'DE89370400440532013000',
	},
	{
		displayName: 'Options',
		name: 'ibanOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['validateIban'],
			},
		},
		options: [
			{
				displayName: 'Include Bank Info',
				name: 'includeBankInfo',
				type: 'boolean',
				default: true,
				description: 'Whether to include bank information lookup',
			},
			{
				displayName: 'Strict Mode',
				name: 'strictMode',
				type: 'boolean',
				default: false,
				description: 'Whether to use strict validation (rejects unknown country codes)',
			},
		],
	},

	// ----------------------------------
	//         utility: validateBic
	// ----------------------------------
	{
		displayName: 'BIC',
		name: 'bic',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['validateBic'],
			},
		},
		description: 'The BIC/SWIFT code to validate',
		placeholder: 'COBADEFFXXX',
	},

	// ----------------------------------
	//         utility: getBankByBic
	// ----------------------------------
	{
		displayName: 'BIC',
		name: 'bicLookup',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['getBankByBic'],
			},
		},
		description: 'The BIC/SWIFT code to look up',
		placeholder: 'COBADEFFXXX',
	},

	// ----------------------------------
	//         utility: getExchangeRates
	// ----------------------------------
	{
		displayName: 'Base Currency',
		name: 'baseCurrency',
		type: 'string',
		required: true,
		default: 'EUR',
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['getExchangeRates'],
			},
		},
		description: 'Base currency for exchange rates (ISO 4217)',
	},
	{
		displayName: 'Target Currencies',
		name: 'targetCurrencies',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['getExchangeRates'],
			},
		},
		description: 'Comma-separated list of target currencies (leave empty for all)',
		placeholder: 'USD,GBP,CHF',
	},

	// ----------------------------------
	//         utility: getSupportedCountries
	// ----------------------------------
	{
		displayName: 'Filter',
		name: 'countryFilter',
		type: 'options',
		default: 'all',
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['getSupportedCountries'],
			},
		},
		options: [
			{ name: 'All Countries', value: 'all' },
			{ name: 'Card Issuing', value: 'card_issuing' },
			{ name: 'SEPA Countries', value: 'sepa' },
			{ name: 'SEPA Instant Countries', value: 'sepa_instant' },
		],
		description: 'Filter countries by supported feature',
	},
];

export async function execute(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];

	switch (operation) {
		case 'validateIban': {
			const iban = this.getNodeParameter('iban', i) as string;
			const options = this.getNodeParameter('ibanOptions', i) as IDataObject;

			// Local validation first
			const isValid = validateIBAN(iban);
			const formattedIban = formatIBAN(iban);
			const parsed = parseIBAN(iban);

			const result: IDataObject = {
				iban: formattedIban,
				valid: isValid,
				country_code: parsed?.countryCode || null,
				check_digits: parsed?.checkDigits || null,
				bban: parsed?.bban || null,
			};

			// Optionally call API for bank info lookup
			if (isValid && options.includeBankInfo) {
				try {
					const bankInfo = await solarisApiRequest.call(
						this,
						'GET',
						'/v1/iban/validate',
						{},
						{ iban: formattedIban.replace(/\s/g, '') },
					);
					result.bank_info = bankInfo;
				} catch {
					result.bank_info = null;
				}
			}

			responseData = result;
			break;
		}

		case 'validateBic': {
			const bic = this.getNodeParameter('bic', i) as string;

			// Local validation
			const isValid = validateBIC(bic);

			const result: IDataObject = {
				bic: bic.toUpperCase(),
				valid: isValid,
			};

			if (isValid) {
				result.institution_code = bic.substring(0, 4);
				result.country_code = bic.substring(4, 6);
				result.location_code = bic.substring(6, 8);
				result.branch_code = bic.length === 11 ? bic.substring(8, 11) : 'XXX';
			}

			responseData = result;
			break;
		}

		case 'getBankByBic': {
			const bic = this.getNodeParameter('bicLookup', i) as string;

			responseData = await solarisApiRequest.call(
				this,
				'GET',
				`/v1/banks/${bic.toUpperCase()}`,
			);
			break;
		}

		case 'getSupportedCountries': {
			const filter = this.getNodeParameter('countryFilter', i) as string;

			let endpoint = '/v1/countries';
			const qs: IDataObject = {};

			if (filter !== 'all') {
				qs.feature = filter;
			}

			responseData = await solarisApiRequest.call(
				this,
				'GET',
				endpoint,
				{},
				qs,
			);
			break;
		}

		case 'getExchangeRates': {
			const baseCurrency = this.getNodeParameter('baseCurrency', i) as string;
			const targetCurrencies = this.getNodeParameter('targetCurrencies', i) as string;

			const qs: IDataObject = {
				base: baseCurrency.toUpperCase(),
			};

			if (targetCurrencies) {
				qs.symbols = targetCurrencies.toUpperCase().replace(/\s/g, '');
			}

			responseData = await solarisApiRequest.call(
				this,
				'GET',
				'/v1/exchange_rates',
				{},
				qs,
			);
			break;
		}

		case 'getApiStatus': {
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				'/v1/status',
			);
			break;
		}

		case 'getRateLimits': {
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				'/v1/rate_limits',
			);
			break;
		}

		case 'testConnection': {
			try {
				const startTime = Date.now();
				await solarisApiRequest.call(
					this,
					'GET',
					'/v1/status',
				);
				const endTime = Date.now();

				responseData = {
					success: true,
					message: 'Connection successful',
					latency_ms: endTime - startTime,
					timestamp: new Date().toISOString(),
				};
			} catch (error) {
				responseData = {
					success: false,
					message: 'Connection failed',
					error: (error as Error).message,
					timestamp: new Date().toISOString(),
				};
			}
			break;
		}

		default:
			throw new Error(`Operation "${operation}" is not supported for utility resource`);
	}

	return responseData;
}
