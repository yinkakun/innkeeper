import baseConfig from 'eslint-config-custom/base';
import reactConfig from 'eslint-config-custom/react';
import nextjsConfig from 'eslint-config-custom/nextjs';

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ['.next/**'],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
];
