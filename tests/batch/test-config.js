/**
 * Test Configuration
 *
 * This file extends the root test-config.js file with batch-specific test data.
 * The API and database settings are inherited from the root config.
 */

// Import the root test-config.js
const rootConfig = require('../../test-config');

// Create a new config object that extends the root config
const batchConfig = {
    // Inherit API and database settings from root config
    ...rootConfig,
    
    // Add batch-specific test data
    testData: {
        adminStaff: {
            userId: 2,
            orgId: 1,
            role: 'admin_staff',
            email: 'test.admin@example.com'
        },
        adminReferring: {
            userId: 2,
            orgId: 1,
            role: 'admin_referring',
            email: 'test.admin@example.com'
        },
        physician: {
            userId: 1,
            orgId: 1,
            role: 'physician',
            email: 'test.physician@example.com'
        },
        testOrderId: 4
    }
};

module.exports = batchConfig;