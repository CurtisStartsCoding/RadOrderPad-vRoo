// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/*.test.ts',
      '**/*.test.js',
      '**/__tests__/**',
      '**/test-*.ts',
      '!**/src/services/order/admin/test-emr-parser.ts', // Don't ignore this specific file
      '**/test-*.js',
      '**/*.d.ts'
    ],
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      // Customize rules as needed
      'no-console': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', {
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_'
      }],
      '@typescript-eslint/ban-ts-comment': ['error', {
        'ts-nocheck': false,
        'ts-ignore': true,
        'ts-expect-error': 'allow-with-description'
      }]
    },
  },
  // Override for notification service files
  {
    files: ['**/src/services/notification/**/*.ts'],
    rules: {
      // Allow console statements in notification service files
      'no-console': 'off'
    }
  }
);