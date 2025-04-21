module.exports = {
  rules: {
    // Allow CommonJS require imports in test files
    '@typescript-eslint/no-require-imports': 'off',
    // Allow unused variables in test files
    '@typescript-eslint/no-unused-vars': 'off',
    // Allow undefined globals like require, jest, describe, it, etc.
    'no-undef': 'off'
  }
};