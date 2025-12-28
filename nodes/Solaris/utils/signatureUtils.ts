/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import crypto from 'crypto';
import forge from 'node-forge';

/**
 * Signature algorithm types
 */
export type SignatureAlgorithm = 'sha256' | 'sha384' | 'sha512';

/**
 * Generate HMAC signature
 *
 * @param payload - Data to sign
 * @param secret - Secret key
 * @param algorithm - Hash algorithm
 * @returns Hex-encoded signature
 */
export function generateHmacSignature(
	payload: string,
	secret: string,
	algorithm: SignatureAlgorithm = 'sha256',
): string {
	return crypto
		.createHmac(algorithm, secret)
		.update(payload, 'utf8')
		.digest('hex');
}

/**
 * Verify HMAC signature using timing-safe comparison
 *
 * @param payload - Original data
 * @param signature - Signature to verify
 * @param secret - Secret key
 * @param algorithm - Hash algorithm
 * @returns true if signature is valid
 */
export function verifyHmacSignature(
	payload: string,
	signature: string,
	secret: string,
	algorithm: SignatureAlgorithm = 'sha256',
): boolean {
	const expectedSignature = generateHmacSignature(payload, secret, algorithm);

	try {
		// Use timing-safe comparison to prevent timing attacks
		return crypto.timingSafeEqual(
			Buffer.from(signature, 'hex'),
			Buffer.from(expectedSignature, 'hex'),
		);
	} catch {
		// If buffers have different lengths, timingSafeEqual throws
		return false;
	}
}

/**
 * Parse Solaris webhook signature header
 * Format: t=timestamp,v1=signature
 *
 * @param header - Raw signature header
 * @returns Parsed timestamp and signature
 */
export function parseWebhookSignatureHeader(
	header: string,
): { timestamp: number; signature: string } | null {
	if (!header) return null;

	const parts = header.split(',');
	let timestamp = 0;
	let signature = '';

	for (const part of parts) {
		const [key, value] = part.split('=');
		if (key === 't') {
			timestamp = parseInt(value, 10);
		} else if (key === 'v1') {
			signature = value;
		}
	}

	if (!timestamp || !signature) {
		return null;
	}

	return { timestamp, signature };
}

/**
 * Verify Solaris webhook signature with timestamp tolerance
 *
 * @param payload - Webhook payload
 * @param header - Signature header
 * @param secret - Webhook secret
 * @param toleranceSeconds - Maximum age of webhook (default: 5 minutes)
 * @returns true if signature is valid and within tolerance
 */
export function verifyWebhookSignatureWithTimestamp(
	payload: string,
	header: string,
	secret: string,
	toleranceSeconds: number = 300,
): boolean {
	const parsed = parseWebhookSignatureHeader(header);
	if (!parsed) return false;

	const { timestamp, signature } = parsed;

	// Check timestamp is within tolerance
	const currentTime = Math.floor(Date.now() / 1000);
	if (Math.abs(currentTime - timestamp) > toleranceSeconds) {
		return false;
	}

	// Build signed payload (timestamp + payload)
	const signedPayload = `${timestamp}.${payload}`;

	return verifyHmacSignature(signedPayload, signature, secret);
}

/**
 * Generate idempotency key for API requests
 *
 * @param prefix - Optional prefix for the key
 * @returns UUID-based idempotency key
 */
export function generateIdempotencyKey(prefix?: string): string {
	const uuid = crypto.randomUUID();
	return prefix ? `${prefix}-${uuid}` : uuid;
}

/**
 * Generate secure random string
 *
 * @param length - Length of the string
 * @returns Random hex string
 */
export function generateSecureRandom(length: number = 32): string {
	return crypto.randomBytes(length).toString('hex');
}

/**
 * Hash sensitive data for logging (one-way)
 *
 * @param data - Data to hash
 * @returns SHA-256 hash (first 8 chars)
 */
export function hashForLogging(data: string): string {
	return crypto.createHash('sha256').update(data).digest('hex').substring(0, 8);
}

/**
 * Parse PEM certificate
 *
 * @param pem - PEM-encoded certificate
 * @returns Parsed certificate info
 */
export function parseCertificate(pem: string): {
	subject: string;
	issuer: string;
	validFrom: Date;
	validTo: Date;
	serialNumber: string;
} | null {
	try {
		const cert = forge.pki.certificateFromPem(pem);

		return {
			subject: cert.subject.getField('CN')?.value || '',
			issuer: cert.issuer.getField('CN')?.value || '',
			validFrom: cert.validity.notBefore,
			validTo: cert.validity.notAfter,
			serialNumber: cert.serialNumber,
		};
	} catch {
		return null;
	}
}

/**
 * Check if certificate is expired
 *
 * @param pem - PEM-encoded certificate
 * @returns true if certificate is expired
 */
export function isCertificateExpired(pem: string): boolean {
	const info = parseCertificate(pem);
	if (!info) return true;

	return info.validTo < new Date();
}

/**
 * Check if certificate is about to expire
 *
 * @param pem - PEM-encoded certificate
 * @param daysThreshold - Days before expiry to warn
 * @returns true if certificate expires within threshold
 */
export function isCertificateExpiringSoon(
	pem: string,
	daysThreshold: number = 30,
): boolean {
	const info = parseCertificate(pem);
	if (!info) return true;

	const thresholdDate = new Date();
	thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

	return info.validTo < thresholdDate;
}

/**
 * Validate key pair matches certificate
 *
 * @param certPem - PEM-encoded certificate
 * @param keyPem - PEM-encoded private key
 * @returns true if key matches certificate
 */
export function validateKeyPair(certPem: string, keyPem: string): boolean {
	try {
		const cert = forge.pki.certificateFromPem(certPem);
		const privateKey = forge.pki.privateKeyFromPem(keyPem);

		// Create a test message and sign/verify
		const md = forge.md.sha256.create();
		md.update('test', 'utf8');

		const signature = privateKey.sign(md);
		const verified = cert.publicKey.verify(md.digest().bytes(), signature);

		return verified;
	} catch {
		return false;
	}
}

/**
 * Mask sensitive data for safe logging
 * Shows first and last 4 characters only
 *
 * @param data - Sensitive data to mask
 * @returns Masked string
 */
export function maskSensitiveData(data: string): string {
	if (!data || data.length < 8) {
		return '****';
	}

	const first = data.substring(0, 4);
	const last = data.substring(data.length - 4);

	return `${first}****${last}`;
}
