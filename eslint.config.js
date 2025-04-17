module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // General rules
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_' 
    }],
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      extends: [
        'plugin:@typescript-eslint/recommended',
      ],
      rules: {
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
    {
      files: ['**/*.jsx', '**/*.tsx'],
      extends: [
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
      ],
      rules: {
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
    },
  ],
};