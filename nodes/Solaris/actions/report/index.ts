/**
 * @file Report Resource Actions
 * @description Operations for generating and managing banking reports
 * @license Business Source License 1.1 - Velocity BPA
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { solarisApiRequest, solarisApiRequestAllItems } from '../../transport/solarisClient';

export const reportOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['report'],
			},
		},
		options: [
			{
				name: 'Download',
				value: 'download',
				description: 'Download a generated report',
				action: 'Download a report',
			},
			{
				name: 'Generate',
				value: 'generate',
				description: 'Generate a new report',
				action: 'Generate a report',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get report details',
				action: 'Get a report',
			},
			{
				name: 'Get Account Report',
				value: 'getAccountReport',
				description: 'Get account-specific report',
				action: 'Get account report',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Get all reports',
				action: 'Get all reports',
			},
			{
				name: 'Get Status',
				value: 'getStatus',
				description: 'Get report generation status',
				action: 'Get report status',
			},
			{
				name: 'Get Transaction Report',
				value: 'getTransactionReport',
				description: 'Get transaction report',
				action: 'Get transaction report',
			},
			{
				name: 'Schedule',
				value: 'schedule',
				description: 'Schedule recurring report generation',
				action: 'Schedule a report',
			},
		],
		default: 'generate',
	},
];

export const reportFields: INodeProperties[] = [
	// ----------------------------------
	//         report: generate
	// ----------------------------------
	{
		displayName: 'Report Type',
		name: 'reportType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['report'],
				operation: ['generate', 'schedule'],
			},
		},
		options: [
			{ name: 'Account Balance', value: 'ACCOUNT_BALANCE' },
			{ name: 'Account Statement', value: 'ACCOUNT_STATEMENT' },
			{ name: 'AML Report', value: 'AML_REPORT' },
			{ name: 'Card Transactions', value: 'CARD_TRANSACTIONS' },
			{ name: 'Compliance Report', value: 'COMPLIANCE_REPORT' },
			{ name: 'Customer Overview', value: 'CUSTOMER_OVERVIEW' },
			{ name: 'Direct Debits', value: 'DIRECT_DEBITS' },
			{ name: 'Loan Summary', value: 'LOAN_SUMMARY' },
			{ name: 'Monthly Summary', value: 'MONTHLY_SUMMARY' },
			{ name: 'SEPA Transfers', value: 'SEPA_TRANSFERS' },
			{ name: 'Tax Report', value: 'TAX_REPORT' },
			{ name: 'Transaction History', value: 'TRANSACTION_HISTORY' },
			{ name: 'Yearly Summary', value: 'YEARLY_SUMMARY' },
		],
		default: 'ACCOUNT_STATEMENT',
		description: 'Type of report to generate',
	},
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['report'],
				operation: ['generate', 'getAccountReport', 'getTransactionReport'],
			},
		},
		description: 'The unique identifier of the account',
	},
	{
		displayName: 'Date Range',
		name: 'dateRange',
		type: 'fixedCollection',
		default: {},
		displayOptions: {
			show: {
				resource: ['report'],
				operation: ['generate', 'getAccountReport', 'getTransactionReport'],
			},
		},
		options: [
			{
				displayName: 'Date Range',
				name: 'range',
				values: [
					{
						displayName: 'From Date',
						name: 'fromDate',
						type: 'dateTime',
						default: '',
						description: 'Start date for the report',
					},
					{
						displayName: 'To Date',
						name: 'toDate',
						type: 'dateTime',
						default: '',
						description: 'End date for the report',
					},
				],
			},
		],
		description: 'Date range for the report',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['report'],
				operation: ['generate'],
			},
		},
		options: [
			{
				displayName: 'Format',
				name: 'format',
				type: 'options',
				options: [
					{ name: 'CSV', value: 'CSV' },
					{ name: 'JSON', value: 'JSON' },
					{ name: 'PDF', value: 'PDF' },
					{ name: 'XML', value: 'XML' },
				],
				default: 'PDF',
				description: 'Output format for the report',
			},
			{
				displayName: 'Include Details',
				name: 'includeDetails',
				type: 'boolean',
				default: true,
				description: 'Whether to include detailed transaction data',
			},
			{
				displayName: 'Include Summary',
				name: 'includeSummary',
				type: 'boolean',
				default: true,
				description: 'Whether to include summary statistics',
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'options',
				options: [
					{ name: 'German', value: 'de' },
					{ name: 'English', value: 'en' },
					{ name: 'French', value: 'fr' },
					{ name: 'Spanish', value: 'es' },
				],
				default: 'de',
				description: 'Language for the report',
			},
			{
				displayName: 'Person ID',
				name: 'personId',
				type: 'string',
				default: '',
				description: 'Filter report by person',
			},
		],
	},

	// ----------------------------------
	//         report: get, getStatus, download
	// ----------------------------------
	{
		displayName: 'Report ID',
		name: 'reportId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['report'],
				operation: ['get', 'getStatus', 'download'],
			},
		},
		description: 'The unique identifier of the report',
	},

	// ----------------------------------
	//         report: schedule
	// ----------------------------------
	{
		displayName: 'Schedule Configuration',
		name: 'scheduleConfig',
		type: 'collection',
		placeholder: 'Add Configuration',
		default: {},
		displayOptions: {
			show: {
				resource: ['report'],
				operation: ['schedule'],
			},
		},
		options: [
			{
				displayName: 'Account ID',
				name: 'accountId',
				type: 'string',
				default: '',
				description: 'Account ID for the scheduled report',
			},
			{
				displayName: 'Day of Month',
				name: 'dayOfMonth',
				type: 'number',
				default: 1,
				typeOptions: {
					minValue: 1,
					maxValue: 28,
				},
				description: 'Day of month to generate report (for monthly schedules)',
			},
			{
				displayName: 'Day of Week',
				name: 'dayOfWeek',
				type: 'options',
				options: [
					{ name: 'Monday', value: 'MONDAY' },
					{ name: 'Tuesday', value: 'TUESDAY' },
					{ name: 'Wednesday', value: 'WEDNESDAY' },
					{ name: 'Thursday', value: 'THURSDAY' },
					{ name: 'Friday', value: 'FRIDAY' },
					{ name: 'Saturday', value: 'SATURDAY' },
					{ name: 'Sunday', value: 'SUNDAY' },
				],
				default: 'MONDAY',
				description: 'Day of week to generate report (for weekly schedules)',
			},
			{
				displayName: 'Email Recipients',
				name: 'emailRecipients',
				type: 'string',
				default: '',
				description: 'Comma-separated email addresses to receive the report',
			},
			{
				displayName: 'Format',
				name: 'format',
				type: 'options',
				options: [
					{ name: 'CSV', value: 'CSV' },
					{ name: 'PDF', value: 'PDF' },
				],
				default: 'PDF',
				description: 'Output format',
			},
			{
				displayName: 'Frequency',
				name: 'frequency',
				type: 'options',
				options: [
					{ name: 'Daily', value: 'DAILY' },
					{ name: 'Monthly', value: 'MONTHLY' },
					{ name: 'Quarterly', value: 'QUARTERLY' },
					{ name: 'Weekly', value: 'WEEKLY' },
					{ name: 'Yearly', value: 'YEARLY' },
				],
				default: 'MONTHLY',
				description: 'How often to generate the report',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name for the scheduled report',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'When to start the schedule',
			},
		],
	},

	// ----------------------------------
	//         report: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['report'],
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
				resource: ['report'],
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
				resource: ['report'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Account ID',
				name: 'accountId',
				type: 'string',
				default: '',
				description: 'Filter by account',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Completed', value: 'COMPLETED' },
					{ name: 'Failed', value: 'FAILED' },
					{ name: 'Pending', value: 'PENDING' },
					{ name: 'Processing', value: 'PROCESSING' },
				],
				default: '',
				description: 'Filter by report status',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Account Statement', value: 'ACCOUNT_STATEMENT' },
					{ name: 'Tax Report', value: 'TAX_REPORT' },
					{ name: 'Transaction History', value: 'TRANSACTION_HISTORY' },
				],
				default: '',
				description: 'Filter by report type',
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
		case 'generate': {
			const reportType = this.getNodeParameter('reportType', i) as string;
			const accountId = this.getNodeParameter('accountId', i) as string;
			const dateRange = this.getNodeParameter('dateRange', i) as IDataObject;
			const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

			const body: IDataObject = {
				type: reportType,
				account_id: accountId,
			};

			// Handle date range
			const range = dateRange.range as IDataObject;
			if (range) {
				if (range.fromDate) body.from_date = range.fromDate;
				if (range.toDate) body.to_date = range.toDate;
			}

			if (additionalFields.format) body.format = additionalFields.format;
			if (additionalFields.language) body.language = additionalFields.language;
			if (additionalFields.includeDetails !== undefined) body.include_details = additionalFields.includeDetails;
			if (additionalFields.includeSummary !== undefined) body.include_summary = additionalFields.includeSummary;
			if (additionalFields.personId) body.person_id = additionalFields.personId;

			responseData = await solarisApiRequest.call(
				this,
				'POST',
				'/v1/reports',
				body,
			);
			break;
		}

		case 'get': {
			const reportId = this.getNodeParameter('reportId', i) as string;

			responseData = await solarisApiRequest.call(
				this,
				'GET',
				`/v1/reports/${reportId}`,
			);
			break;
		}

		case 'getAll': {
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			const filters = this.getNodeParameter('filters', i) as IDataObject;

			const qs: IDataObject = {};
			if (filters.type) qs.type = filters.type;
			if (filters.status) qs.status = filters.status;
			if (filters.accountId) qs.account_id = filters.accountId;

			if (returnAll) {
				responseData = await solarisApiRequestAllItems.call(
					this,
					'GET',
					'/v1/reports',
					{},
					qs,
				);
			} else {
				const limit = this.getNodeParameter('limit', i) as number;
				qs.page = { size: limit };
				const response = await solarisApiRequest.call(
					this,
					'GET',
					'/v1/reports',
					{},
					qs,
				);
				responseData = Array.isArray(response) ? response : [response];
			}
			break;
		}

		case 'getStatus': {
			const reportId = this.getNodeParameter('reportId', i) as string;

			responseData = await solarisApiRequest.call(
				this,
				'GET',
				`/v1/reports/${reportId}/status`,
			);
			break;
		}

		case 'download': {
			const reportId = this.getNodeParameter('reportId', i) as string;

			responseData = await solarisApiRequest.call(
				this,
				'GET',
				`/v1/reports/${reportId}/download`,
			);
			break;
		}

		case 'schedule': {
			const reportType = this.getNodeParameter('reportType', i) as string;
			const scheduleConfig = this.getNodeParameter('scheduleConfig', i) as IDataObject;

			const body: IDataObject = {
				type: reportType,
			};

			if (scheduleConfig.name) body.name = scheduleConfig.name;
			if (scheduleConfig.accountId) body.account_id = scheduleConfig.accountId;
			if (scheduleConfig.frequency) body.frequency = scheduleConfig.frequency;
			if (scheduleConfig.format) body.format = scheduleConfig.format;
			if (scheduleConfig.startDate) body.start_date = scheduleConfig.startDate;
			if (scheduleConfig.dayOfWeek) body.day_of_week = scheduleConfig.dayOfWeek;
			if (scheduleConfig.dayOfMonth) body.day_of_month = scheduleConfig.dayOfMonth;
			if (scheduleConfig.emailRecipients) {
				body.email_recipients = (scheduleConfig.emailRecipients as string).split(',').map(e => e.trim());
			}

			responseData = await solarisApiRequest.call(
				this,
				'POST',
				'/v1/reports/schedules',
				body,
			);
			break;
		}

		case 'getAccountReport': {
			const accountId = this.getNodeParameter('accountId', i) as string;
			const dateRange = this.getNodeParameter('dateRange', i) as IDataObject;

			const qs: IDataObject = {};
			const range = dateRange.range as IDataObject;
			if (range) {
				if (range.fromDate) qs.from = range.fromDate;
				if (range.toDate) qs.to = range.toDate;
			}

			responseData = await solarisApiRequest.call(
				this,
				'GET',
				`/v1/accounts/${accountId}/report`,
				{},
				qs,
			);
			break;
		}

		case 'getTransactionReport': {
			const accountId = this.getNodeParameter('accountId', i) as string;
			const dateRange = this.getNodeParameter('dateRange', i) as IDataObject;

			const qs: IDataObject = {};
			const range = dateRange.range as IDataObject;
			if (range) {
				if (range.fromDate) qs.from = range.fromDate;
				if (range.toDate) qs.to = range.toDate;
			}

			responseData = await solarisApiRequest.call(
				this,
				'GET',
				`/v1/accounts/${accountId}/transactions/report`,
				{},
				qs,
			);
			break;
		}

		default:
			throw new Error(`Operation "${operation}" is not supported for report resource`);
	}

	return responseData;
}
