/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { solarisApiRequest, solarisApiRequestAllItems } from '../../transport/solarisClient';
import { DOCUMENT_ENDPOINTS } from '../../constants/endpoints';

/**
 * Document Resource
 * Manages document uploads and retrieval for KYC/compliance purposes.
 * Supports ID documents, proof of address, business documents, etc.
 */

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['document'],
			},
		},
		options: [
			{ name: 'Delete Document', value: 'delete', description: 'Delete a document', action: 'Delete document' },
			{ name: 'Download Document', value: 'download', description: 'Download a document', action: 'Download document' },
			{ name: 'Get Document', value: 'get', description: 'Get document details', action: 'Get document' },
			{ name: 'Get Document by Type', value: 'getByType', description: 'Get documents of a specific type', action: 'Get document by type' },
			{ name: 'Get Document Status', value: 'getStatus', description: 'Get document verification status', action: 'Get document status' },
			{ name: 'Get Required Documents', value: 'getRequired', description: 'Get list of required documents', action: 'Get required documents' },
			{ name: 'List Documents', value: 'list', description: 'List all documents', action: 'List documents' },
			{ name: 'Upload Document', value: 'upload', description: 'Upload a new document', action: 'Upload document' },
		],
		default: 'list',
	},
	// Document ID
	{
		displayName: 'Document ID',
		name: 'documentId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['get', 'download', 'delete', 'getStatus'],
			},
		},
		default: '',
		description: 'The document ID',
	},
	// Document Type for filtering
	{
		displayName: 'Document Type',
		name: 'documentType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['getByType', 'upload'],
			},
		},
		options: [
			{ name: 'Bank Statement', value: 'bank_statement' },
			{ name: 'Business License', value: 'business_license' },
			{ name: 'Commercial Register Extract', value: 'commercial_register_extract' },
			{ name: 'Contract', value: 'contract' },
			{ name: 'ID Back', value: 'id_back' },
			{ name: 'ID Front', value: 'id_front' },
			{ name: 'Other', value: 'other' },
			{ name: 'Passport', value: 'passport' },
			{ name: 'Power of Attorney', value: 'power_of_attorney' },
			{ name: 'Proof of Address', value: 'proof_of_address' },
			{ name: 'Selfie', value: 'selfie' },
			{ name: 'Shareholder List', value: 'shareholder_list' },
			{ name: 'Tax Certificate', value: 'tax_certificate' },
			{ name: 'Utility Bill', value: 'utility_bill' },
		],
		default: 'id_front',
		description: 'The type of document',
	},
	// Person/Entity ID for context
	{
		displayName: 'Entity Type',
		name: 'entityType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['upload', 'getRequired'],
			},
		},
		options: [
			{ name: 'Person', value: 'person' },
			{ name: 'Business', value: 'business' },
		],
		default: 'person',
		description: 'The type of entity the document belongs to',
	},
	{
		displayName: 'Entity ID',
		name: 'entityId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['upload', 'getRequired'],
			},
		},
		default: '',
		description: 'The person or business ID',
	},
	// File content for upload
	{
		displayName: 'File Content (Base64)',
		name: 'fileContent',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['upload'],
			},
		},
		default: '',
		description: 'Base64-encoded file content',
		typeOptions: {
			rows: 4,
		},
	},
	{
		displayName: 'File Name',
		name: 'fileName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['upload'],
			},
		},
		default: '',
		description: 'Original file name with extension',
		placeholder: 'passport.pdf',
	},
	// Content Type
	{
		displayName: 'Content Type',
		name: 'contentType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['upload'],
			},
		},
		options: [
			{ name: 'JPEG Image', value: 'image/jpeg' },
			{ name: 'PDF', value: 'application/pdf' },
			{ name: 'PNG Image', value: 'image/png' },
		],
		default: 'application/pdf',
		description: 'MIME type of the document',
	},
	// List filters
	{
		displayName: 'Filter Options',
		name: 'filterOptions',
		type: 'collection',
		placeholder: 'Add Filter',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['list'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Entity ID',
				name: 'entityId',
				type: 'string',
				default: '',
				description: 'Filter by person or business ID',
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				description: 'Whether to return all results',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Approved', value: 'approved' },
					{ name: 'Pending', value: 'pending' },
					{ name: 'Rejected', value: 'rejected' },
				],
				default: '',
				description: 'Filter by document status',
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

	switch (operation) {
		case 'upload': {
			const entityType = this.getNodeParameter('entityType', index) as string;
			const entityId = this.getNodeParameter('entityId', index) as string;
			const documentType = this.getNodeParameter('documentType', index) as string;
			const fileContent = this.getNodeParameter('fileContent', index) as string;
			const fileName = this.getNodeParameter('fileName', index) as string;
			const contentType = this.getNodeParameter('contentType', index) as string;

			const body = {
				type: documentType,
				[`${entityType}_id`]: entityId,
				file: {
					name: fileName,
					content_type: contentType,
					data: fileContent,
				},
			};

			responseData = await solarisApiRequest.call(
				this,
				'POST',
				DOCUMENT_ENDPOINTS.base,
				body,
			);
			break;
		}

		case 'get': {
			const documentId = this.getNodeParameter('documentId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				DOCUMENT_ENDPOINTS.byId(documentId),
			);
			break;
		}

		case 'list': {
			const filterOptions = this.getNodeParameter('filterOptions', index, {}) as {
				returnAll?: boolean;
				entityId?: string;
				status?: string;
			};

			const qs: Record<string, unknown> = {};
			if (filterOptions.entityId) qs.entity_id = filterOptions.entityId;
			if (filterOptions.status) qs.status = filterOptions.status;

			if (filterOptions.returnAll) {
				responseData = await solarisApiRequestAllItems.call(
					this,
					'GET',
					DOCUMENT_ENDPOINTS.base,
					{},
					qs,
				);
			} else {
				responseData = await solarisApiRequest.call(
					this,
					'GET',
					DOCUMENT_ENDPOINTS.base,
					{},
					qs,
				);
			}
			break;
		}

		case 'getByType': {
			const documentType = this.getNodeParameter('documentType', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				DOCUMENT_ENDPOINTS.byType(documentType),
			);
			break;
		}

		case 'download': {
			const documentId = this.getNodeParameter('documentId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				DOCUMENT_ENDPOINTS.download(documentId),
			);
			break;
		}

		case 'delete': {
			const documentId = this.getNodeParameter('documentId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'DELETE',
				DOCUMENT_ENDPOINTS.byId(documentId),
			);
			break;
		}

		case 'getStatus': {
			const documentId = this.getNodeParameter('documentId', index) as string;
			responseData = await solarisApiRequest.call(
				this,
				'GET',
				DOCUMENT_ENDPOINTS.status(documentId),
			);
			break;
		}

		case 'getRequired': {
			const entityType = this.getNodeParameter('entityType', index) as string;
			const entityId = this.getNodeParameter('entityId', index) as string;

			responseData = await solarisApiRequest.call(
				this,
				'GET',
				DOCUMENT_ENDPOINTS.required,
				{},
				{ entity_type: entityType, entity_id: entityId },
			);
			break;
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData as object;
}
