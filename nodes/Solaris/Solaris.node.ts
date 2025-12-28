/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';

import * as person from './actions/person';
import * as business from './actions/business';
import * as identification from './actions/identification';
import * as account from './actions/account';
import * as transaction from './actions/transaction';
import * as sepaTransfer from './actions/sepaTransfer';
import * as internalTransfer from './actions/internalTransfer';
import * as card from './actions/card';
import * as cardTransaction from './actions/cardTransaction';
import * as cardControl from './actions/cardControl';
import * as directDebit from './actions/directDebit';
import * as overdraft from './actions/overdraft';
import * as loan from './actions/loan';
import * as savings from './actions/savings';
import * as tax from './actions/tax';
import * as document from './actions/document';
import * as compliance from './actions/compliance';
import * as webhook from './actions/webhook';
import * as partner from './actions/partner';
import * as consent from './actions/consent';
import * as deviceBinding from './actions/deviceBinding';
import * as sca from './actions/sca';
import * as booking from './actions/booking';
import * as report from './actions/report';
import * as utility from './actions/utility';

// Runtime licensing notice - logged once per node load
let licensingNoticeLogged = false;
function logLicensingNotice(): void {
	if (!licensingNoticeLogged) {
		console.warn(`[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.`);
		licensingNoticeLogged = true;
	}
}

export class Solaris implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Solaris',
		name: 'solaris',
		icon: 'file:solaris.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Solaris Banking-as-a-Service API for embedded banking operations',
		defaults: {
			name: 'Solaris',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'solarisApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Account', value: 'account' },
					{ name: 'Booking', value: 'booking' },
					{ name: 'Business', value: 'business' },
					{ name: 'Card', value: 'card' },
					{ name: 'Card Control', value: 'cardControl' },
					{ name: 'Card Transaction', value: 'cardTransaction' },
					{ name: 'Compliance', value: 'compliance' },
					{ name: 'Consent', value: 'consent' },
					{ name: 'Device Binding', value: 'deviceBinding' },
					{ name: 'Direct Debit', value: 'directDebit' },
					{ name: 'Document', value: 'document' },
					{ name: 'Identification', value: 'identification' },
					{ name: 'Internal Transfer', value: 'internalTransfer' },
					{ name: 'Loan', value: 'loan' },
					{ name: 'Overdraft', value: 'overdraft' },
					{ name: 'Partner', value: 'partner' },
					{ name: 'Person', value: 'person' },
					{ name: 'Report', value: 'report' },
					{ name: 'Savings', value: 'savings' },
					{ name: 'SCA', value: 'sca' },
					{ name: 'SEPA Transfer', value: 'sepaTransfer' },
					{ name: 'Tax', value: 'tax' },
					{ name: 'Transaction', value: 'transaction' },
					{ name: 'Utility', value: 'utility' },
					{ name: 'Webhook', value: 'webhook' },
				],
				default: 'person',
			},
			// Person operations
			...person.description,
			// Business operations
			...business.description,
			// Identification operations
			...identification.description,
			// Account operations
			...account.description,
			// Transaction operations
			...transaction.description,
			// SEPA Transfer operations
			...sepaTransfer.description,
			// Internal Transfer operations
			...internalTransfer.description,
			// Card operations
			...card.description,
			// Card Transaction operations
			...cardTransaction.description,
			// Card Control operations
			...cardControl.description,
			// Direct Debit operations
			...directDebit.description,
			// Overdraft operations
			...overdraft.description,
			// Loan operations
			...loan.description,
			// Savings operations
			...savings.description,
			// Tax operations
			...tax.description,
			// Document operations
			...document.description,
			// Compliance operations
			...compliance.description,
			// Webhook operations
			...webhook.description,
			// Partner operations
			...partner.description,
			// Consent operations
			...consent.description,
			// Device Binding operations
			...deviceBinding.description,
			// SCA operations
			...sca.description,
			// Booking operations
			...booking.description,
			// Report operations
			...report.description,
			// Utility operations
			...utility.description,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Log licensing notice once per node load
		logLicensingNotice();

		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData;

				switch (resource) {
					case 'person':
						responseData = await person.execute.call(this, i, operation);
						break;
					case 'business':
						responseData = await business.execute.call(this, i, operation);
						break;
					case 'identification':
						responseData = await identification.execute.call(this, i, operation);
						break;
					case 'account':
						responseData = await account.execute.call(this, i, operation);
						break;
					case 'transaction':
						responseData = await transaction.execute.call(this, i, operation);
						break;
					case 'sepaTransfer':
						responseData = await sepaTransfer.execute.call(this, i, operation);
						break;
					case 'internalTransfer':
						responseData = await internalTransfer.execute.call(this, i, operation);
						break;
					case 'card':
						responseData = await card.execute.call(this, i, operation);
						break;
					case 'cardTransaction':
						responseData = await cardTransaction.execute.call(this, i, operation);
						break;
					case 'cardControl':
						responseData = await cardControl.execute.call(this, i, operation);
						break;
					case 'directDebit':
						responseData = await directDebit.execute.call(this, i, operation);
						break;
					case 'overdraft':
						responseData = await overdraft.execute.call(this, i, operation);
						break;
					case 'loan':
						responseData = await loan.execute.call(this, i, operation);
						break;
					case 'savings':
						responseData = await savings.execute.call(this, i, operation);
						break;
					case 'tax':
						responseData = await tax.execute.call(this, i, operation);
						break;
					case 'document':
						responseData = await document.execute.call(this, i, operation);
						break;
					case 'compliance':
						responseData = await compliance.execute.call(this, i, operation);
						break;
					case 'webhook':
						responseData = await webhook.execute.call(this, i, operation);
						break;
					case 'partner':
						responseData = await partner.execute.call(this, i, operation);
						break;
					case 'consent':
						responseData = await consent.execute.call(this, i, operation);
						break;
					case 'deviceBinding':
						responseData = await deviceBinding.execute.call(this, i, operation);
						break;
					case 'sca':
						responseData = await sca.execute.call(this, i, operation);
						break;
					case 'booking':
						responseData = await booking.execute.call(this, i, operation);
						break;
					case 'report':
						responseData = await report.execute.call(this, i, operation);
						break;
					case 'utility':
						responseData = await utility.execute.call(this, i, operation);
						break;
					default:
						throw new Error(`Unknown resource: ${resource}`);
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
