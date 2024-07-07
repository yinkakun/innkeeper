import typescriptESLint from 'typescript-eslint';

export default typescriptESLint.config({
  files: ['**/*.js', '**/*.ts', '**/*.tsx'],
  rules: {
    'no-restricted-properties': [
      'error',
      {
        object: 'process',
        property: 'env',
        message: "Use `import { env } from '@/env'` instead to ensure validated types.",
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        name: 'process',
        importNames: ['env'],
        message: "Use `import { env } from '@/env'` instead to ensure validated types.",
      },
    ],
  },
});
