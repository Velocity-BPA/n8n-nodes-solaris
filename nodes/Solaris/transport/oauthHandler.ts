/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import axios from 'axios';
import type { IDataObject } from 'n8n-workflow';
import { getAuthUrl } from './solarisClient';

/**
 * OAuth Token Response
 */
export interface OAuthTokenResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
	refresh_token?: string;
	scope: string;
}

/**
 * Token storage
 */
interface StoredToken {
	accessToken: string;
	refreshToken?: string;
	expiresAt: number;
	scope: string;
}

const tokenStore: Map<string, StoredToken> = new Map();

/**
 * Generate cache key for token storage
 */
function getCacheKey(credentials: IDataObject): string {
	return `${credentials.clientId}-${credentials.environment}`;
}

/**
 * Get OAuth2 token using client credentials flow
 *
 * @param credentials - API credentials
 * @returns Access token response
 */
export async function getClientCredentialsToken(
	credentials: IDataObject,
): Promise<OAuthTokenResponse> {
	const authUrl = getAuthUrl(credentials);
	const tokenEndpoint = `${authUrl}/oauth/token`;

	const response = await axios.post<OAuthTokenResponse>(
		tokenEndpoint,
		new URLSearchParams({
			grant_type: 'client_credentials',
			client_id: credentials.clientId as string,
			client_secret: credentials.clientSecret as string,
			scope: (credentials.scope as string) || 'read write',
		}).toString(),
		{
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		},
	);

	// Store token
	const cacheKey = getCacheKey(credentials);
	tokenStore.set(cacheKey, {
		accessToken: response.data.access_token,
		refreshToken: response.data.refresh_token,
		expiresAt: Date.now() + response.data.expires_in * 1000,
		scope: response.data.scope,
	});

	return response.data;
}

/**
 * Refresh OAuth2 token
 *
 * @param credentials - API credentials
 * @param refreshToken - Current refresh token
 * @returns New access token response
 */
export async function refreshAccessToken(
	credentials: IDataObject,
	refreshToken: string,
): Promise<OAuthTokenResponse> {
	const authUrl = getAuthUrl(credentials);
	const tokenEndpoint = `${authUrl}/oauth/token`;

	const response = await axios.post<OAuthTokenResponse>(
		tokenEndpoint,
		new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: refreshToken,
			client_id: credentials.clientId as string,
			client_secret: credentials.clientSecret as string,
		}).toString(),
		{
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		},
	);

	// Update stored token
	const cacheKey = getCacheKey(credentials);
	tokenStore.set(cacheKey, {
		accessToken: response.data.access_token,
		refreshToken: response.data.refresh_token || refreshToken,
		expiresAt: Date.now() + response.data.expires_in * 1000,
		scope: response.data.scope,
	});

	return response.data;
}

/**
 * Get valid access token, refreshing if necessary
 *
 * @param credentials - API credentials
 * @returns Valid access token
 */
export async function getValidToken(credentials: IDataObject): Promise<string> {
	const cacheKey = getCacheKey(credentials);
	const stored = tokenStore.get(cacheKey);

	// Check if token exists and is still valid (with 1 minute buffer)
	if (stored && stored.expiresAt > Date.now() + 60000) {
		return stored.accessToken;
	}

	// Try to refresh if we have a refresh token
	if (stored?.refreshToken) {
		try {
			const response = await refreshAccessToken(credentials, stored.refreshToken);
			return response.access_token;
		} catch {
			// Refresh failed, get new token
		}
	}

	// Get new token
	const response = await getClientCredentialsToken(credentials);
	return response.access_token;
}

/**
 * Revoke OAuth2 token
 *
 * @param credentials - API credentials
 * @param token - Token to revoke
 */
export async function revokeToken(
	credentials: IDataObject,
	token: string,
): Promise<void> {
	const authUrl = getAuthUrl(credentials);
	const revokeEndpoint = `${authUrl}/oauth/revoke`;

	await axios.post(
		revokeEndpoint,
		new URLSearchParams({
			token,
			client_id: credentials.clientId as string,
			client_secret: credentials.clientSecret as string,
		}).toString(),
		{
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		},
	);

	// Remove from cache
	const cacheKey = getCacheKey(credentials);
	tokenStore.delete(cacheKey);
}

/**
 * Clear all cached tokens
 */
export function clearTokenCache(): void {
	tokenStore.clear();
}

/**
 * Check if token is expired
 *
 * @param credentials - API credentials
 * @returns true if token is expired or not found
 */
export function isTokenExpired(credentials: IDataObject): boolean {
	const cacheKey = getCacheKey(credentials);
	const stored = tokenStore.get(cacheKey);

	if (!stored) {
		return true;
	}

	return stored.expiresAt <= Date.now();
}

/**
 * Get token info (without sensitive data)
 *
 * @param credentials - API credentials
 * @returns Token metadata
 */
export function getTokenInfo(credentials: IDataObject): IDataObject | null {
	const cacheKey = getCacheKey(credentials);
	const stored = tokenStore.get(cacheKey);

	if (!stored) {
		return null;
	}

	return {
		expiresAt: new Date(stored.expiresAt).toISOString(),
		expiresIn: Math.max(0, Math.floor((stored.expiresAt - Date.now()) / 1000)),
		scope: stored.scope,
		hasRefreshToken: !!stored.refreshToken,
	};
}
