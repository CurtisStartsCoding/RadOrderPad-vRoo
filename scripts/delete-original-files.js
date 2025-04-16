/**
 * Script to delete original files that have been refactored
 */
const fs = require('fs');
const path = require('path');

console.log('Checking for files to delete...\n');

// All files to check from the list
const filesToCheck = [
  {
    name: 'Clinical Record Manager',
    originalFile: 'clinical-record-manager.ts',
    refactoredDir: 'clinical-record-manager',
    path: 'src/services/order/admin'
  },
  {
    name: 'Order Status Manager',
    originalFile: 'order-status-manager.ts',
    refactoredDir: 'order-status-manager',
    path: 'src/services/order/admin'
  },
  {
    name: 'Order Export Service',
    originalFile: 'order-export.service.ts',
    refactoredDir: 'order-export',
    path: 'src/services/order/radiology'
  },
  {
    name: 'Keyword Extractor',
    originalFile: 'keyword-extractor.ts',
    refactoredDir: 'keyword-extractor',
    path: 'src/utils/text-processing'
  },
  {
    name: 'Connection List Controller',
    originalFile: 'list.controller.ts',
    refactoredDir: 'list',
    path: 'src/controllers/connection'
  },
  {
    name: 'Connection Validation Utils',
    originalFile: 'validation-utils.ts',
    refactoredDir: 'validation-utils',
    path: 'src/controllers/connection'
  },
  {
    name: 'Handle Invoice Payment Failed',
    originalFile: 'handle-invoice-payment-failed.ts',
    refactoredDir: 'handle-invoice-payment-failed',
    path: 'src/services/billing/stripe/webhooks'
  },
  {
    name: 'Handle Subscription Updated',
    originalFile: 'handle-subscription-updated.ts',
    refactoredDir: 'handle-subscription-updated',
    path: 'src/services/billing/stripe/webhooks'
  },
  {
    name: 'Request Connection Helpers',
    originalFile: 'request-connection-helpers.ts',
    refactoredDir: 'request-connection-helpers',
    path: 'src/services/connection/services'
  },
  {
    name: 'File Upload Service',
    originalFile: 'fileUpload.service.ts',
    refactoredDir: 'upload',
    path: 'src/services'
  },
  {
    name: 'Email Test Mode',
    originalFile: 'test-mode.ts',
    refactoredDir: 'test-mode',
    path: 'src/services/notification/email-sender'
  },
  {
    name: 'Connection Approval',
    originalFile: 'approval.ts',
    refactoredDir: 'approval',
    path: 'src/services/notification/services/connection'
  },
  {
    name: 'Connection Rejection',
    originalFile: 'rejection.ts',
    refactoredDir: 'rejection',
    path: 'src/services/notification/services/connection'
  },
  {
    name: 'Connection Termination',
    originalFile: 'termination.ts',
    refactoredDir: 'termination',
    path: 'src/services/notification/services/connection'
  },
  {
    name: 'Patient Manager',
    originalFile: 'patient-manager.ts',
    refactoredDir: 'patient-manager',
    path: 'src/services/order/admin'
  },
  {
    name: 'Query Builder',
    originalFile: 'query-builder.ts',
    refactoredDir: 'query-builder',
    path: 'src/services/order/admin/utils'
  },
  {
    name: 'CSV Export Generate',
    originalFile: 'generate-csv-export.ts',
    refactoredDir: 'generate-csv-export',
    path: 'src/services/order/radiology/export/csv-export'
  },
  {
    name: 'CSV Export',
    originalFile: 'csv-export.ts',
    refactoredDir: 'csv-export',
    path: 'src/services/order/radiology/export'
  },
  {
    name: 'Metadata Filters',
    originalFile: 'metadata-filters.ts',
    refactoredDir: 'metadata-filters',
    path: 'src/services/order/radiology/query/order-builder'
  },
  {
    name: 'Attempt Tracking',
    originalFile: 'attempt-tracking.ts',
    refactoredDir: 'attempt-tracking',
    path: 'src/services/order/validation'
  },
  {
    name: 'Response Normalizer',
    originalFile: 'normalizer.ts',
    refactoredDir: 'normalizer',
    path: 'src/utils/response'
  },
  {
    name: 'Response Validator',
    originalFile: 'validator.ts',
    refactoredDir: 'validator',
    path: 'src/utils/response'
  }
];

// Check each file and directory
const filesToDelete = [];
const filesToSkip = [];

filesToCheck.forEach(fileToCheck => {
  const originalFilePath = path.join(fileToCheck.path, fileToCheck.originalFile);
  const refactoredDirPath = path.join(fileToCheck.path, fileToCheck.refactoredDir);
  
  const originalFileExists = fs.existsSync(originalFilePath);
  const refactoredDirExists = fs.existsSync(refactoredDirPath);
  const refactoredIndexExists = fs.existsSync(path.join(refactoredDirPath, 'index.ts'));
  
  if (originalFileExists && refactoredDirExists && refactoredIndexExists) {
    filesToDelete.push({
      name: fileToCheck.name,
      path: originalFilePath
    });
    console.log(`${fileToCheck.name}:`);
    console.log(`  Original file: ✓ Exists (${originalFilePath})`);
    console.log(`  Refactored directory: ✓ Exists (${refactoredDirPath})`);
    console.log(`  Refactored index.ts: ✓ Exists`);
    console.log(`  Can be deleted: ✓ Yes`);
    console.log('');
  } else {
    filesToSkip.push({
      name: fileToCheck.name,
      originalExists: originalFileExists,
      refactoredDirExists: refactoredDirExists,
      refactoredIndexExists: refactoredIndexExists
    });
    console.log(`${fileToCheck.name}:`);
    console.log(`  Original file: ${originalFileExists ? '✓ Exists' : '✗ Not found'} (${originalFilePath})`);
    console.log(`  Refactored directory: ${refactoredDirExists ? '✓ Exists' : '✗ Not found'} (${refactoredDirPath})`);
    console.log(`  Refactored index.ts: ${refactoredIndexExists ? '✓ Exists' : '✗ Not found'}`);
    console.log(`  Can be deleted: ✗ No`);
    console.log('');
  }
});

// Summary
console.log(`\nSummary: ${filesToDelete.length} out of ${filesToCheck.length} files can be safely deleted.`);

// Create a batch file to delete the files
const batchCommands = [];
batchCommands.push('@echo off');
batchCommands.push('echo Deleting original files...');
batchCommands.push('');

filesToDelete.forEach(file => {
  batchCommands.push(`echo Deleting ${file.name}...`);
  batchCommands.push(`del "${file.path}"`);
  batchCommands.push('');
});

batchCommands.push('echo Done!');
batchCommands.push('pause');

fs.writeFileSync('delete-original-files.bat', batchCommands.join('\r\n'));
console.log('Created delete-original-files.bat to delete the files.');

// Also create a shell script for Unix systems
const shCommands = [];
shCommands.push('#!/bin/bash');
shCommands.push('echo "Deleting original files..."');
shCommands.push('');

filesToDelete.forEach(file => {
  shCommands.push(`echo "Deleting ${file.name}..."`);
  shCommands.push(`rm "${file.path}"`);
  shCommands.push('');
});

shCommands.push('echo "Done!"');
shCommands.push('read -p "Press enter to continue"');

fs.writeFileSync('delete-original-files.sh', shCommands.join('\n'));
console.log('Created delete-original-files.sh to delete the files.');

// Ask for confirmation
console.log('\nWould you like to delete these files now? (Run delete-original-files.bat)');