import baseConfig from 'eslint-config-custom/base';

/** @type {import('typescript-eslint').Config} */

export default [{ ignores: ['dist/**', '.trigger/**'] }, ...baseConfig];
