/**
 * Test Configuration
 *
 * This file contains configuration settings for all test scenarios.
 */

module.exports = {
  api: {
    baseUrl: 'https://api.radorderpad.com/api',
    timeout: 30000 // 30 seconds
  },
  database: {
    // Database connection settings (if needed)
  },
  jwt: {
    secret: '79e90196beeb1beccf61381b2ee3c8038905be3b4058fdf0f611eb78602a5285a7ab7a2a43e38853d5d65f2cfb2d8f955dad73dc67ffb1f0fb6f6e7282a3e112'
  },
  testData: {
    // Common test data
  }
};