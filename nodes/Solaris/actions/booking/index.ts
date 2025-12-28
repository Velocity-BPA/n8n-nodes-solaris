/**
 * @file Booking Resource Actions
 * @description Operations for managing bookings (posted/settled transactions)
 * @license Business Source License 1.1 - Velocity BPA
 *
 * In banking terminology:
 * - Booking = Posted/settled transaction (final, irreversible)
 * - Reservation = Pending/authorized transaction (not yet settled)
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { solarisApiRequest, solarisApiRequestAllItems } from '../../transport/solarisClient';

export const bookingOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['booking'],
			},
		},
		options: [
			{
				name: 'Categorize',
				value: 'categorize',
				description: 'Categorize a booking',
				action: 'Categorize a booking',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a booking by ID',
				action: 'Get a booking',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Get all bookings for an account',
				action: 'Get all bookings',
			},
			{
				name: 'Get By Reference',
				value: 'getByReference',
				description: 'Get booking by reference number',
				action: 'Get booking by reference',
			},
			{
				name: 'Get Categories',
				value: 'getCategories',
				description: 'Get available booking categories',
				action: 'Get booking categories',
			},
			{
				name: 'Get Recurring',
				value: 'getRecurring',
				description: 'Get recurring bookings',
				action: 'Get recurring bookings',
			},
		],
		default: 'getAll',
	},
];

export const bookingFields: INodeProperties[] = [
	// ----------------------------------
	//         booking: get
	// ----------------------------------
	{
		displayName: 'Booking ID',
		name: 'bookingId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['booking'],
				operation: ['get', 'categorize'],
			},
		},
		description: 'The unique identifier of the booking',
	},

	// ----------------------------------
	//         booking: getAll, getRecurring
	// ----------------------------------
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['booking'],
				operation: ['getAll', 'getRecurring'],
			},
		},
		description: 'The unique identifier of the account',
	},

	// ----------------------------------
	//         booking: getByReference
	// ----------------------------------
	{
		displayName: 'Reference Number',
		name: 'referenceNumber',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['booking'],
				operation: ['getByReference'],
			},
		},
		description: 'The reference number of the booking',
	},

	// ----------------------------------
	//         booking: categorize
	// ----------------------------------
	{
		displayName: 'Category',
		name: 'category',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['booking'],
				operation: ['categorize'],
			},
		},
		options: [
			{ name: 'ATM Withdrawal', value: 'ATM_WITHDRAWAL' },
			{ name: 'Cash Deposit', value: 'CASH_DEPOSIT' },
			{ name: 'Charity', value: 'CHARITY' },
			{ name: 'Childcare', value: 'CHILDCARE' },
			{ name: 'Clothing', value: 'CLOTHING' },
			{ name: 'Education', value: 'EDUCATION' },
			{ name: 'Electronics', value: 'ELECTRONICS' },
			{ name: 'Entertainment', value: 'ENTERTAINMENT' },
			{ name: 'Food & Dining', value: 'FOOD_DINING' },
			{ name: 'Gifts', value: 'GIFTS' },
			{ name: 'Groceries', value: 'GROCERIES' },
			{ name: 'Healthcare', value: 'HEALTHCARE' },
			{ name: 'Household', value: 'HOUSEHOLD' },
			{ name: 'Income', value: 'INCOME' },
			{ name: 'Insurance', value: 'INSURANCE' },
			{ name: 'Internal Transfer', value: 'INTERNAL_TRANSFER' },
			{ name: 'Investment', value: 'INVESTMENT' },
			{ name: 'Loan Payment', value: 'LOAN_PAYMENT' },
			{ name: 'Other', value: 'OTHER' },
			{ name: 'Personal Care', value: 'PERSONAL_CARE' },
			{ name: 'Pet Care', value: 'PET_CARE' },
			{ name: 'Rent/Mortgage', value: 'RENT_MORTGAGE' },
			{ name: 'Salary', value: 'SALARY' },
			{ name: 'Savings', value: 'SAVINGS' },
			{ name: 'Shopping', value: 'SHOPPING' },
			{ name: 'Subscription', value: 'SUBSCRIPTION' },
			{ name: 'Tax', value: 'TAX' },
			{ name: 'Transport', value: 'TRANSPORT' },
			{ name: 'Travel', value: 'TRAVEL' },
			{ name: 'Utilities', value: 'UTILITIES' },
		],
		default: 'OTHER',
		description: 'Category to assign to the booking',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['booking'],
				operation: ['categorize'],
			},
		},
		options: [
			{
				displayName: 'Notes',
				name: 'notes',
				type: 'string',
				default: '',
				description: 'User notes for the booking',
			},
			{
				displayName: 'Sub-Category',
				name: 'subCategory',
				type: 'string',
				default: '',
				description: 'Sub-category for more detailed classification',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				description: 'Comma-separated tags for the booking',
			},
		],
	},

	// ----------------------------------
	//         booking: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['booking'],
				operation: ['getAll', 'getRecurring'],
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
				resource: ['booking'],
				operation: ['getAll', 'getRecurring'],
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
				resource: ['booking'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Amount From',
				name: 'amountFrom',
				type: 'number',
				default: 0,
				description: 'Minimum amount filter',
			},
			{
				displayName: 'Amount To',
				name: 'amountTo',
				type: 'number',
				default: 0,
				description: 'Maximum amount filter',
			},
			{
				displayName: 'Category',
				name: 'category',
				type: 'string',
				default: '',
				description: 'Filter by category',
			},
			{
				displayName: 'Date From',
				name: 'dateFrom',
				type: 'dateTime',
				default: '',
				description: 'Filter bookings from this date',
			},
			{
				displayName: 'Date To',
				name: 'dateTo',
				type: 'dateTime',
				default: '',
				description: 'Filter bookings until this date',
			},
			{
				displayName: 'Description Contains',
				name: 'descriptionContains',
				type: 'string',
				default: '',
				description: 'Filter by description text',
			},
			{
				displayName: 'Direction',
				name: 'direction',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Credit (Incoming)', value: 'CREDIT' },
					{ name: 'Debit (Outgoing)', value: 'DEBIT' },
				],
				default: '',
				description: 'Filter by booking direction',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'ATM', value: 'ATM' },
					{ name: 'Card Payment', value: 'CARD_PAYMENT' },
					{ name: 'Direct Debit', value: 'DIRECT_DEBIT' },
					{ name: 'Fee', value: 'FEE' },
					{ name: 'Interest', value: 'INTEREST' },
					{ name: 'Internal Transfer', value: 'INTERNAL_TRANSFER' },
					{ name: 'SEPA Transfer', value: 'SEPA_TRANSFER' },
				],
				default: '',
				description: 'Filter by booking type',
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
		case 'get': {
			const bookingId = this.getNodeParameter('bookingId', i) as string;

			responseData = await solarisApiRequest.call(
				this,
				'GET',
				`/v1/bookings/${bookingId}`,
			);
			break;
		}

		case 'getAll': {
			const accountId = this.getNodeParameter('accountId', i) as string;
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			const filters = this.getNodeParameter('filters', i) as IDataObject;

			const qs: IDataObject = {};

			// Apply filters
			if (filters.dateFrom) qs.from = filters.dateFrom;
			if (filters.dateTo) qs.to = filters.dateTo;
			if (filters.direction) qs.direction = filters.direction;
			if (filters.type) qs.type = filters.type;
			if (filters.category) qs.category = filters.category;
			if (filters.amountFrom) qs.amount_from = filters.amountFrom;
			if (filters.amountTo) qs.amount_to = filters.amountTo;
			if (filters.descriptionContains) qs.description = filters.descriptionContains;

			if (returnAll) {
				responseData = await solarisApiRequestAllItems.call(
					this,
					'GET',
					`/v1/accounts/${accountId}/bookings`,
					{},
					qs,
				);
			} else {
				const limit = this.getNodeParameter('limit', i) as number;
				qs.page = { size: limit };
				const response = await solarisApiRequest.call(
					this,
					'GET',
					`/v1/accounts/${accountId}/bookings`,
					{},
					qs,
				);
				responseData = Array.isArray(response) ? response : [response];
			}
			break;
		}

		case 'getByReference': {
			const referenceNumber = this.getNodeParameter('referenceNumber', i) as string;

			responseData = await solarisApiRequest.call(
				this,
				'GET',
				`/v1/bookings`,
				{},
				{ reference: referenceNumber },
			);
			break;
		}

		case 'getCategories': {
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				'/v1/bookings/categories',
			);
			break;
		}

		case 'categorize': {
			const bookingId = this.getNodeParameter('bookingId', i) as string;
			const category = this.getNodeParameter('category', i) as string;
			const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

			const body: IDataObject = {
				category,
			};

			if (additionalFields.subCategory) body.sub_category = additionalFields.subCategory;
			if (additionalFields.notes) body.notes = additionalFields.notes;
			if (additionalFields.tags) {
				body.tags = (additionalFields.tags as string).split(',').map(t => t.trim());
			}

			responseData = await solarisApiRequest.call(
				this,
				'PATCH',
				`/v1/bookings/${bookingId}/category`,
				body,
			);
			break;
		}

		case 'getRecurring': {
			const accountId = this.getNodeParameter('accountId', i) as string;
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;

			if (returnAll) {
				responseData = await solarisApiRequestAllItems.call(
					this,
					'GET',
					`/v1/accounts/${accountId}/bookings/recurring`,
					{},
					{},
				);
			} else {
				const limit = this.getNodeParameter('limit', i) as number;
				const response = await solarisApiRequest.call(
					this,
					'GET',
					`/v1/accounts/${accountId}/bookings/recurring`,
					{},
					{ page: { size: limit } },
				);
				responseData = Array.isArray(response) ? response : [response];
			}
			break;
		}

		default:
			throw new Error(`Operation "${operation}" is not supported for booking resource`);
	}

	return responseData;
}
