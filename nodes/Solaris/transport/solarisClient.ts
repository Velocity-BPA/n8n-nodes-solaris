/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, ILoadOptionsFunctions, IDataObject } from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';
import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { SOLARIS_ENVIRONMENTS, API_VERSION } from '../constants/endpoints';
import { ERROR_MESSAGES } from '../constants/errorCodes';

/**
 * Runtime licensing notice - logged once per node load
 */
let licensingNoticeLogged = false;

function logLicensingNotice(): void {
	if (!licensingNoticeLogged) {
		console.warn(`
[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.
`);
		licensingNoticeLogged = true;
	}
}

/**
 * Solaris API Response interface
 */
export interface SolarisApiResponse<T = IDataObject> {
	data: T;
	meta?: {
		total_count?: number;
		page?: number;
		per_page?: number;
	};
}

/**
 * Pagination options
 */
export interface PaginationOptions {
	page?: number;
	perPage?: number;
	sortBy?: string;
	sortOrder?: 'asc' | 'desc';
}

/**
 * Request options
 */
export interface RequestOptions {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	endpoint: string;
	body?: IDataObject;
	query?: IDataObject;
	headers?: IDataObject;
	pagination?: PaginationOptions;
}

/**
 * Token cache for OAuth tokens
 */
interface TokenCache {
	accessToken: string;
	expiresAt: number;
	refreshToken?: string;
}

const tokenCache: Map<string, TokenCache> = new Map();

/**
 * Get the base URL for the Solaris API based on environment
 */
export function getBaseUrl(credentials: IDataObject): string {
	const environment = credentials.environment as string;

	if (environment === 'custom') {
		return credentials.customUrl as string;
	}

	return SOLARIS_ENVIRONMENTS[environment as keyof typeof SOLARIS_ENVIRONMENTS]?.baseUrl
		|| SOLARIS_ENVIRONMENTS.sandbox.baseUrl;
}

/**
 * Get the auth URL for the Solaris API based on environment
 */
export function getAuthUrl(credentials: IDataObject): string {
	const environment = credentials.environment as string;

	if (environment === 'custom') {
		return (credentials.customUrl as string).replace('/api', '/auth');
	}

	return SOLARIS_ENVIRONMENTS[environment as keyof typeof SOLARIS_ENVIRONMENTS]?.authUrl
		|| SOLARIS_ENVIRONMENTS.sandbox.authUrl;
}

/**
 * Obtain OAuth2 access token
 */
async function getAccessToken(credentials: IDataObject): Promise<string> {
	const cacheKey = `${credentials.clientId}-${credentials.environment}`;
	const cached = tokenCache.get(cacheKey);

	// Return cached token if still valid
	if (cached && cached.expiresAt > Date.now() + 60000) {
		return cached.accessToken;
	}

	const authUrl = getAuthUrl(credentials);
	const tokenEndpoint = `${authUrl}/oauth/token`;

	try {
		const response = await axios.post(
			tokenEndpoint,
			new URLSearchParams({
				grant_type: 'client_credentials',
				client_id: credentials.clientId as string,
				client_secret: credentials.clientSecret as string,
				scope: 'read write',
			}).toString(),
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			},
		);

		const { access_token, expires_in, refresh_token } = response.data;

		tokenCache.set(cacheKey, {
			accessToken: access_token,
			expiresAt: Date.now() + (expires_in * 1000),
			refreshToken: refresh_token,
		});

		return access_token;
	} catch (error) {
		throw new Error(`Failed to obtain access token: ${(error as Error).message}`);
	}
}

/**
 * Create Axios instance with authentication
 */
async function createClient(credentials: IDataObject): Promise<AxiosInstance> {
	const baseUrl = getBaseUrl(credentials);
	const accessToken = await getAccessToken(credentials);

	const config: AxiosRequestConfig = {
		baseURL: baseUrl,
		headers: {
			'Authorization': `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'X-Partner-ID': credentials.partnerId as string,
		},
		timeout: 30000,
	};

	// Add API key if provided
	if (credentials.apiKey) {
		config.headers!['X-API-Key'] = credentials.apiKey as string;
	}

	// Configure mTLS if enabled
	if (credentials.useMtls) {
		// Note: In a full implementation, you would configure HTTPS agent with certificates
		// This requires the 'https' module and certificate parsing
		// For n8n, this is typically handled at the platform level
	}

	return axios.create(config);
}

/**
 * Main API request function
 */
export async function solarisApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	options: RequestOptions,
): Promise<IDataObject> {
	// Log licensing notice once
	logLicensingNotice();

	const credentials = await this.getCredentials('solarisApi');
	const client = await createClient(credentials);

	// Build query parameters
	const params: IDataObject = { ...options.query };

	if (options.pagination) {
		if (options.pagination.page !== undefined) {
			params.page = options.pagination.page;
		}
		if (options.pagination.perPage !== undefined) {
			params.per_page = options.pagination.perPage;
		}
		if (options.pagination.sortBy) {
			params.sort_by = options.pagination.sortBy;
		}
		if (options.pagination.sortOrder) {
			params.sort_order = options.pagination.sortOrder;
		}
	}

	const requestConfig: AxiosRequestConfig = {
		method: options.method,
		url: options.endpoint,
		params,
		data: options.body,
		headers: options.headers as Record<string, string>,
	};

	try {
		const response = await client.request(requestConfig);
		return response.data;
	} catch (error) {
		if (error instanceof AxiosError) {
			const errorData = error.response?.data as IDataObject;
			const errorCode = errorData?.code as string;
			const errorMessage = ERROR_MESSAGES[errorCode]
				|| (errorData?.message as string)
				|| error.message;

			throw new NodeApiError(this.getNode(), error as unknown as IDataObject, {
				message: errorMessage,
				description: `Solaris API Error: ${errorCode || error.response?.status}`,
				httpCode: String(error.response?.status),
			});
		}

		throw new NodeOperationError(
			this.getNode(),
			`Request failed: ${(error as Error).message}`,
		);
	}
}

/**
 * Make API request with automatic pagination
 */
export async function solarisApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	options: RequestOptions,
	propertyName: string = 'items',
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	let page = 1;
	const perPage = 100;
	let hasMore = true;

	while (hasMore) {
		const response = await solarisApiRequest.call(this, {
			...options,
			pagination: {
				...options.pagination,
				page,
				perPage,
			},
		});

		const items = (response[propertyName] as IDataObject[]) || [];
		returnData.push(...items);

		// Check if there are more items
		const meta = response.meta as IDataObject;
		const totalCount = meta?.total_count as number;

		if (totalCount !== undefined) {
			hasMore = returnData.length < totalCount;
		} else {
			hasMore = items.length === perPage;
		}

		page++;

		// Safety limit
		if (page > 100) {
			break;
		}
	}

	return returnData;
}

/**
 * Helper to handle binary data uploads
 */
export async function solarisApiUpload(
	this: IExecuteFunctions,
	endpoint: string,
	binaryPropertyName: string,
	additionalFields: IDataObject = {},
): Promise<IDataObject> {
	const credentials = await this.getCredentials('solarisApi');
	const client = await createClient(credentials);

	const binaryData = this.helpers.assertBinaryData(0, binaryPropertyName);
	const buffer = await this.helpers.getBinaryDataBuffer(0, binaryPropertyName);

	const formData = new FormData();
	formData.append('file', new Blob([buffer]), binaryData.fileName || 'file');

	for (const [key, value] of Object.entries(additionalFields)) {
		formData.append(key, String(value));
	}

	try {
		const response = await client.post(endpoint, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});

		return response.data;
	} catch (error) {
		if (error instanceof AxiosError) {
			throw new NodeApiError(this.getNode(), error as unknown as IDataObject, {
				message: error.response?.data?.message || error.message,
			});
		}
		throw error;
	}
}

/**
 * Helper to download binary data
 */
export async function solarisApiDownload(
	this: IExecuteFunctions,
	endpoint: string,
): Promise<Buffer> {
	const credentials = await this.getCredentials('solarisApi');
	const client = await createClient(credentials);

	try {
		const response = await client.get(endpoint, {
			responseType: 'arraybuffer',
		});

		return Buffer.from(response.data);
	} catch (error) {
		if (error instanceof AxiosError) {
			throw new NodeApiError(this.getNode(), error as unknown as IDataObject, {
				message: error.response?.data?.message || error.message,
			});
		}
		throw error;
	}
}

/**
 * Test API connection
 */
export async function testConnection(credentials: IDataObject): Promise<boolean> {
	try {
		const client = await createClient(credentials);
		await client.get('/v1/partner');
		return true;
	} catch {
		return false;
	}
}
