import baseConfig from 'eslint-config-custom/base';
import reactConfig from 'eslint-config-custom/react';

/** @type {import('typescript-eslint').Config} */
export default [{ ignores: ['dist/**'] }, ...baseConfig, ...reactConfig];
