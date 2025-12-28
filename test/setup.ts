/**
 * Jest Test Setup for n8n-nodes-solaris
 * @license Business Source License 1.1 - Velocity BPA
 */

// Increase timeout for integration tests
jest.setTimeout(30000);

// Mock console.warn to suppress licensing notices during tests
const originalWarn = console.warn;
console.warn = (...args: unknown[]) => {
	// Suppress licensing notices during tests
	if (args[0] && typeof args[0] === 'string' && args[0].includes('Velocity BPA')) {
		return;
	}
	originalWarn.apply(console, args);
};

// Global test utilities
declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace NodeJS {
		interface Global {
			testPersonId: string;
			testAccountId: string;
			testBusinessId: string;
		}
	}
}

// Test data
global.testPersonId = 'test-person-id-12345';
global.testAccountId = 'test-account-id-12345';
global.testBusinessId = 'test-business-id-12345';

export {};
