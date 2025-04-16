/**
 * Script to check which files are being imported - original or refactored
 */
console.log('Checking which files are being imported...\n');

// Helper function to check imports
function checkImport(description, originalPath, refactoredPath) {
  console.log(`\n${description}:`);
  
  // Try to import the original file
  try {
    const original = require(originalPath);
    console.log(`   ✓ Original file can be imported`);
  } catch (err) {
    console.log(`   ✗ Original file cannot be imported: ${err.message}`);
  }
  
  // Try to import the refactored files
  try {
    const refactored = require(refactoredPath);
    console.log(`   ✓ Refactored files can be imported`);
    console.log(`   Functions available: ${Object.keys(refactored).join(', ')}`);
  } catch (err) {
    console.log(`   ✗ Refactored files cannot be imported: ${err.message}`);
  }
}

// Check all files
try {
  // Files with 3 or more functions
  checkImport(
    '1. Auth Middleware',
    './src/middleware/auth.middleware',
    './src/middleware/auth'
  );
  
  checkImport(
    '2. User Location Management',
    './src/services/location/services/user-location-management',
    './src/services/location/services/user-location-management/'
  );
  
  checkImport(
    '3. Connection Request',
    './src/services/notification/services/connection/request',
    './src/services/notification/services/connection/request/'
  );
  
  checkImport(
    '4. Clinical Record Manager',
    './src/services/order/admin/clinical-record-manager',
    './src/services/order/admin/clinical-record-manager/'
  );
  
  checkImport(
    '5. Order Status Manager',
    './src/services/order/admin/order-status-manager',
    './src/services/order/admin/order-status-manager/'
  );
  
  checkImport(
    '6. Order Export Service',
    './src/services/order/radiology/order-export.service',
    './src/services/order/radiology/order-export/'
  );
  
  checkImport(
    '7. Keyword Extractor',
    './src/utils/text-processing/keyword-extractor',
    './src/utils/text-processing/keyword-extractor/'
  );
  
  // Files with 2 functions
  checkImport(
    '8. Connection List Controller',
    './src/controllers/connection/list.controller',
    './src/controllers/connection/list/'
  );
  
  checkImport(
    '9. Connection Validation Utils',
    './src/controllers/connection/validation-utils',
    './src/controllers/connection/validation-utils/'
  );
  
  checkImport(
    '10. Handle Invoice Payment Failed',
    './src/services/billing/stripe/webhooks/handle-invoice-payment-failed',
    './src/services/billing/stripe/webhooks/handle-invoice-payment-failed/'
  );
  
  checkImport(
    '11. Handle Subscription Updated',
    './src/services/billing/stripe/webhooks/handle-subscription-updated',
    './src/services/billing/stripe/webhooks/handle-subscription-updated/'
  );
  
  checkImport(
    '12. Request Connection Helpers',
    './src/services/connection/services/request-connection-helpers',
    './src/services/connection/services/request-connection-helpers/'
  );
  
  checkImport(
    '13. File Upload Service',
    './src/services/fileUpload.service',
    './src/services/upload/'
  );
  
  checkImport(
    '14. Email Test Mode',
    './src/services/notification/email-sender/test-mode',
    './src/services/notification/email-sender/test-mode/'
  );
  
  checkImport(
    '15. Connection Approval',
    './src/services/notification/services/connection/approval',
    './src/services/notification/services/connection/approval/'
  );
  
  checkImport(
    '16. Connection Rejection',
    './src/services/notification/services/connection/rejection',
    './src/services/notification/services/connection/rejection/'
  );
  
  checkImport(
    '17. Connection Termination',
    './src/services/notification/services/connection/termination',
    './src/services/notification/services/connection/termination/'
  );
  
  checkImport(
    '18. Patient Manager',
    './src/services/order/admin/patient-manager',
    './src/services/order/admin/patient-manager/'
  );
  
  checkImport(
    '19. Query Builder',
    './src/services/order/admin/utils/query-builder',
    './src/services/order/admin/utils/query-builder/'
  );
  
  checkImport(
    '20. CSV Export Generate',
    './src/services/order/radiology/export/csv-export/generate-csv-export',
    './src/services/order/radiology/export/csv-export/generate-csv-export/'
  );
  
  checkImport(
    '21. CSV Export',
    './src/services/order/radiology/export/csv-export',
    './src/services/order/radiology/export/csv-export/'
  );
  
  checkImport(
    '22. Metadata Filters',
    './src/services/order/radiology/query/order-builder/metadata-filters',
    './src/services/order/radiology/query/order-builder/metadata-filters/'
  );
  
  checkImport(
    '23. Attempt Tracking',
    './src/services/order/validation/attempt-tracking',
    './src/services/order/validation/attempt-tracking/'
  );
  
  checkImport(
    '24. Response Normalizer',
    './src/utils/response/normalizer',
    './src/utils/response/normalizer/'
  );
  
  checkImport(
    '25. Response Validator',
    './src/utils/response/validator',
    './src/utils/response/validator/'
  );
  
} catch (err) {
  console.error('Error running import checks:', err);
}

console.log('\nImport check complete!');