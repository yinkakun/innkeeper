import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

/** @type {Awaited<import('typescript-eslint').Config>} */
export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      react: reactPlugin,
      'react-hooks': hooksPlugin,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...hooksPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules,
      'react-refresh/only-export-components': 'warn',
    },
    languageOptions: {
      globals: {
        React: 'writable',
      },
    },
  },
];
