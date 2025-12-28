/**
 * Gulp build configuration for n8n-nodes-solaris
 * @license Business Source License 1.1 - Velocity BPA
 */

const { src, dest, series } = require('gulp');

/**
 * Copy node icons to dist folder
 */
function buildIcons() {
	return src('nodes/**/*.{svg,png}').pipe(dest('dist/nodes'));
}

/**
 * Copy credential icons to dist folder
 */
function buildCredentialIcons() {
	return src('credentials/**/*.{svg,png}').pipe(dest('dist/credentials'));
}

/**
 * Copy any additional assets
 */
function copyAssets() {
	return src(['package.json', 'README.md', 'LICENSE']).pipe(dest('dist/'));
}

// Export tasks
exports['build:icons'] = series(buildIcons, buildCredentialIcons);
exports['build:assets'] = copyAssets;
exports.default = series(buildIcons, buildCredentialIcons, copyAssets);
