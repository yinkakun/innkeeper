/// <reference types="./types.d.ts" />

import eslint from '@eslint/js';
import turboPlugin from 'eslint-plugin-turbo';
import importPlugin from 'eslint-plugin-import';
import typescriptESLint from 'typescript-eslint';

export default typescriptESLint.config(
  {
    // Globally ignored files
    ignores: ['**/*.config.*', '**/sst-env.d.ts'],
  },
  {
    files: ['**/*.js', '**/*.ts', '**/*.tsx'],
    plugins: {
      import: importPlugin,
      turbo: turboPlugin,
    },
    extends: [
      eslint.configs.recommended,
      ...typescriptESLint.configs.recommended,
      ...typescriptESLint.configs.stylisticTypeChecked,
      ...typescriptESLint.configs.recommendedTypeChecked,
    ],
    rules: {
      ...turboPlugin.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports', fixStyle: 'separate-type-imports' }],
      '@typescript-eslint/no-misused-promises': ['warn', { checksVoidReturn: { attributes: false } }],
      '@typescript-eslint/no-unnecessary-condition': [
        'error',
        {
          allowConstantLoopConditions: true,
        },
      ],
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/require-await': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
    },
  },
  {
    linterOptions: { reportUnusedDisableDirectives: true },
    languageOptions: { parserOptions: { projectService: true } },
  },
);
