/**
 * Script to check if original files or refactored directories exist
 */
const fs = require('fs');
const path = require('path');

console.log('Checking which files/directories exist...\n');

// Helper function to check if file or directory exists
function checkExists(description, originalPath, refactoredPath) {
  console.log(`\n${description}:`);
  
  // Check if original file exists
  const originalExists = fs.existsSync(originalPath);
  if (originalExists) {
    console.log(`   ✓ Original file exists: ${originalPath}`);
  } else {
    console.log(`   ✗ Original file does not exist: ${originalPath}`);
  }
  
  // Check if refactored directory exists
  const refactoredExists = fs.existsSync(refactoredPath);
  if (refactoredExists) {
    console.log(`   ✓ Refactored directory exists: ${refactoredPath}`);
    
    // If it's a directory, list its contents
    if (fs.statSync(refactoredPath).isDirectory()) {
      const files = fs.readdirSync(refactoredPath);
      console.log(`   Files in directory: ${files.join(', ')}`);
    }
  } else {
    console.log(`   ✗ Refactored directory does not exist: ${refactoredPath}`);
  }
}

// Check all files
try {
  // Files with 3 or more functions
  checkExists(
    '1. Auth Middleware',
    path.join('src', 'middleware', 'auth.middleware.ts'),
    path.join('src', 'middleware', 'auth')
  );
  
  checkExists(
    '2. User Location Management',
    path.join('src', 'services', 'location', 'services', 'user-location-management.ts'),
    path.join('src', 'services', 'location', 'services', 'user-location-management')
  );
  
  checkExists(
    '3. Connection Request',
    path.join('src', 'services', 'notification', 'services', 'connection', 'request.ts'),
    path.join('src', 'services', 'notification', 'services', 'connection', 'request')
  );
  
  checkExists(
    '4. Clinical Record Manager',
    path.join('src', 'services', 'order', 'admin', 'clinical-record-manager.ts'),
    path.join('src', 'services', 'order', 'admin', 'clinical-record-manager')
  );
  
  checkExists(
    '5. Order Status Manager',
    path.join('src', 'services', 'order', 'admin', 'order-status-manager.ts'),
    path.join('src', 'services', 'order', 'admin', 'order-status-manager')
  );
  
  checkExists(
    '6. Order Export Service',
    path.join('src', 'services', 'order', 'radiology', 'order-export.service.ts'),
    path.join('src', 'services', 'order', 'radiology', 'order-export')
  );
  
  checkExists(
    '7. Keyword Extractor',
    path.join('src', 'utils', 'text-processing', 'keyword-extractor.ts'),
    path.join('src', 'utils', 'text-processing', 'keyword-extractor')
  );
  
  // Files with 2 functions
  checkExists(
    '8. Connection List Controller',
    path.join('src', 'controllers', 'connection', 'list.controller.ts'),
    path.join('src', 'controllers', 'connection', 'list')
  );
  
  checkExists(
    '9. Connection Validation Utils',
    path.join('src', 'controllers', 'connection', 'validation-utils.ts'),
    path.join('src', 'controllers', 'connection', 'validation-utils')
  );
  
  // Add more checks for the remaining files...
  
} catch (err) {
  console.error('Error checking files:', err);
}

console.log('\nFile check complete!');