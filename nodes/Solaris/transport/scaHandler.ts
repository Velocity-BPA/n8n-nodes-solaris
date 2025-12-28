/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { solarisApiRequest } from './solarisClient';
import { SCA_ENDPOINTS } from '../constants/endpoints';
import type { ScaMethod, ScaChallengeStatus } from '../constants/identificationMethods';

/**
 * SCA Challenge Response
 */
export interface ScaChallengeResponse {
	id: string;
	status: ScaChallengeStatus;
	method: ScaMethod;
	created_at: string;
	expires_at: string;
	challenge_data?: IDataObject;
}

/**
 * SCA Verification Request
 */
export interface ScaVerificationRequest {
	challenge_id: string;
	response: string;
	device_id?: string;
}

/**
 * Create SCA Challenge
 *
 * Creates a new SCA challenge for a specific operation.
 * This is required for PSD2 compliance on sensitive operations like:
 * - High-value transfers
 * - Card activations
 * - PIN changes
 * - Limit increases
 *
 * @param this - Execution context
 * @param personId - Person ID requiring authentication
 * @param method - SCA method to use
 * @param operationType - Type of operation requiring SCA
 * @param operationData - Additional data about the operation
 * @returns SCA challenge details
 */
export async function createScaChallenge(
	this: IExecuteFunctions,
	personId: string,
	method: ScaMethod,
	operationType: string,
	operationData?: IDataObject,
): Promise<ScaChallengeResponse> {
	const response = await solarisApiRequest.call(this, {
		method: 'POST',
		endpoint: SCA_ENDPOINTS.challenge,
		body: {
			person_id: personId,
			method,
			operation_type: operationType,
			operation_data: operationData,
		},
	});

	return response as unknown as ScaChallengeResponse;
}

/**
 * Get SCA Challenge Status
 *
 * Retrieves the current status of an SCA challenge.
 *
 * @param this - Execution context
 * @param challengeId - Challenge ID to check
 * @returns Challenge status
 */
export async function getScaChallengeStatus(
	this: IExecuteFunctions,
	challengeId: string,
): Promise<ScaChallengeResponse> {
	const response = await solarisApiRequest.call(this, {
		method: 'GET',
		endpoint: SCA_ENDPOINTS.status(challengeId),
	});

	return response as unknown as ScaChallengeResponse;
}

/**
 * Verify SCA Challenge
 *
 * Verifies the user's response to an SCA challenge.
 *
 * @param this - Execution context
 * @param verificationRequest - Verification data
 * @returns Verification result
 */
export async function verifyScaChallenge(
	this: IExecuteFunctions,
	verificationRequest: ScaVerificationRequest,
): Promise<IDataObject> {
	const response = await solarisApiRequest.call(this, {
		method: 'POST',
		endpoint: SCA_ENDPOINTS.verify(verificationRequest.challenge_id),
		body: {
			response: verificationRequest.response,
			device_id: verificationRequest.device_id,
		},
	});

	return response;
}

/**
 * Get Available SCA Methods
 *
 * Retrieves the SCA methods available for a person.
 *
 * @param this - Execution context
 * @param personId - Person ID
 * @returns List of available SCA methods
 */
export async function getAvailableScaMethods(
	this: IExecuteFunctions,
	personId: string,
): Promise<ScaMethod[]> {
	const response = await solarisApiRequest.call(this, {
		method: 'GET',
		endpoint: SCA_ENDPOINTS.methods(personId),
	});

	return (response.methods as ScaMethod[]) || [];
}

/**
 * Register SCA Device
 *
 * Registers a new device for SCA (device binding).
 *
 * @param this - Execution context
 * @param personId - Person ID
 * @param deviceData - Device information
 * @returns Registration result
 */
export async function registerScaDevice(
	this: IExecuteFunctions,
	personId: string,
	deviceData: IDataObject,
): Promise<IDataObject> {
	const response = await solarisApiRequest.call(this, {
		method: 'POST',
		endpoint: SCA_ENDPOINTS.registerDevice(personId),
		body: deviceData,
	});

	return response;
}

/**
 * SCA Operation Types
 *
 * Common operation types that require SCA under PSD2
 */
export const SCA_OPERATION_TYPES = {
	SEPA_TRANSFER: 'sepa_credit_transfer',
	SEPA_INSTANT_TRANSFER: 'sepa_instant_credit_transfer',
	CARD_ACTIVATION: 'card_activation',
	PIN_CHANGE: 'pin_change',
	LIMIT_INCREASE: 'limit_increase',
	DEVICE_BINDING: 'device_binding',
	HIGH_VALUE_OPERATION: 'high_value_operation',
} as const;

/**
 * Check if operation requires SCA
 *
 * Determines whether an operation requires Strong Customer Authentication.
 * PSD2 requires SCA for:
 * - Electronic payments over €30
 * - Adding payees
 * - Changing limits
 * - Card operations
 *
 * @param operationType - Type of operation
 * @param amount - Transaction amount (optional)
 * @returns true if SCA is required
 */
export function requiresSca(operationType: string, amount?: number): boolean {
	// Always require SCA for these operations
	const alwaysRequireSca = [
		SCA_OPERATION_TYPES.CARD_ACTIVATION,
		SCA_OPERATION_TYPES.PIN_CHANGE,
		SCA_OPERATION_TYPES.LIMIT_INCREASE,
		SCA_OPERATION_TYPES.DEVICE_BINDING,
	];

	if (alwaysRequireSca.includes(operationType as typeof SCA_OPERATION_TYPES[keyof typeof SCA_OPERATION_TYPES])) {
		return true;
	}

	// For transfers, check amount threshold (€30 under PSD2)
	if (
		(operationType === SCA_OPERATION_TYPES.SEPA_TRANSFER ||
			operationType === SCA_OPERATION_TYPES.SEPA_INSTANT_TRANSFER) &&
		amount !== undefined
	) {
		return amount >= 30;
	}

	return false;
}

/**
 * Format SCA challenge for n8n output
 *
 * @param challenge - Raw challenge response
 * @returns Formatted challenge data
 */
export function formatScaChallengeOutput(challenge: ScaChallengeResponse): IDataObject {
	return {
		challengeId: challenge.id,
		status: challenge.status,
		method: challenge.method,
		createdAt: challenge.created_at,
		expiresAt: challenge.expires_at,
		challengeData: challenge.challenge_data,
		isExpired: new Date(challenge.expires_at) < new Date(),
		isPending: challenge.status === 'pending' || challenge.status === 'created',
		isVerified: challenge.status === 'verified',
		isFailed: challenge.status === 'failed',
	};
}
