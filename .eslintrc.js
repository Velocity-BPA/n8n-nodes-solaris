/**
 * ESLint Configuration for n8n-nodes-solaris
 * @license Business Source License 1.1 - Velocity BPA
 */
module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
		project: './tsconfig.json',
	},
	plugins: ['@typescript-eslint', 'n8n-nodes-base'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:n8n-nodes-base/community',
	],
	env: {
		node: true,
		es2020: true,
	},
	rules: {
		// TypeScript specific
		'@typescript-eslint/no-explicit-any': 'warn',
		'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/no-non-null-assertion': 'warn',

		// n8n node rules
		'n8n-nodes-base/node-execute-block-missing-continue-on-fail': 'warn',
		'n8n-nodes-base/node-resource-description-filename-against-convention': 'off',
		'n8n-nodes-base/node-param-description-missing-final-period': 'off',
		'n8n-nodes-base/node-param-description-excess-final-period': 'off',

		// General
		'no-console': 'warn',
		'prefer-const': 'error',
		'no-var': 'error',
		eqeqeq: ['error', 'always'],
	},
	ignorePatterns: ['dist/', 'node_modules/', '*.js', '!.eslintrc.js'],
};
