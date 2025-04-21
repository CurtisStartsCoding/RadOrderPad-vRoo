module.exports = {
  rules: {
    // Allow CommonJS require imports in script files
    '@typescript-eslint/no-require-imports': 'off',
    // Allow global objects like console, process
    'no-undef': 'off'
  },
  env: {
    node: true
  }
};