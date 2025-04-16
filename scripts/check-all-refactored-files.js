/**
 * Script to check all potentially refactored files
 */
const fs = require('fs');
const path = require('path');

console.log('Checking all potentially refactored files...\n');

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
const results = [];

filesToCheck.forEach(fileToCheck => {
  const originalFilePath = path.join(fileToCheck.path, fileToCheck.originalFile);
  const refactoredDirPath = path.join(fileToCheck.path, fileToCheck.refactoredDir);
  
  const originalFileExists = fs.existsSync(originalFilePath);
  const refactoredDirExists = fs.existsSync(refactoredDirPath);
  const refactoredIndexExists = fs.existsSync(path.join(refactoredDirPath, 'index.ts'));
  
  results.push({
    name: fileToCheck.name,
    originalFile: originalFilePath,
    refactoredDir: refactoredDirPath,
    originalFileExists,
    refactoredDirExists,
    refactoredIndexExists,
    canMove: originalFileExists && refactoredDirExists && refactoredIndexExists
  });
  
  console.log(`${fileToCheck.name}:`);
  console.log(`  Original file: ${originalFileExists ? '✓ Exists' : '✗ Not found'} (${originalFilePath})`);
  console.log(`  Refactored directory: ${refactoredDirExists ? '✓ Exists' : '✗ Not found'} (${refactoredDirPath})`);
  console.log(`  Refactored index.ts: ${refactoredIndexExists ? '✓ Exists' : '✗ Not found'}`);
  console.log(`  Can be moved: ${originalFileExists && refactoredDirExists && refactoredIndexExists ? '✓ Yes' : '✗ No'}`);
  console.log('');
});

// Summary
const canMoveCount = results.filter(r => r.canMove).length;
console.log(`\nSummary: ${canMoveCount} out of ${results.length} files can be safely moved to old_code.`);

// Create a batch file to move the files
const batchCommands = [];
batchCommands.push('@echo off');
batchCommands.push('echo Moving files to old_code directory...');
batchCommands.push('');

results.forEach(result => {
  if (result.canMove) {
    const oldCodePath = result.originalFile.replace('src/', 'old_code/src/');
    const oldCodeDir = path.dirname(oldCodePath);
    
    batchCommands.push(`echo Moving ${result.name}...`);
    batchCommands.push(`mkdir "${oldCodeDir}" 2>nul`);
    batchCommands.push(`copy "${result.originalFile}" "${oldCodePath}"`);
    batchCommands.push(`del "${result.originalFile}"`);
    batchCommands.push('');
  }
});

batchCommands.push('echo Done!');
batchCommands.push('pause');

fs.writeFileSync('move-refactored-files.bat', batchCommands.join('\r\n'));
console.log('Created move-refactored-files.bat to move the files.');

// Also create a shell script for Unix systems
const shCommands = [];
shCommands.push('#!/bin/bash');
shCommands.push('echo "Moving files to old_code directory..."');
shCommands.push('');

results.forEach(result => {
  if (result.canMove) {
    const oldCodePath = result.originalFile.replace('src/', 'old_code/src/');
    const oldCodeDir = path.dirname(oldCodePath);
    
    shCommands.push(`echo "Moving ${result.name}..."`);
    shCommands.push(`mkdir -p "${oldCodeDir}"`);
    shCommands.push(`cp "${result.originalFile}" "${oldCodePath}"`);
    shCommands.push(`rm "${result.originalFile}"`);
    shCommands.push('');
  }
});

shCommands.push('echo "Done!"');
shCommands.push('read -p "Press enter to continue"');

fs.writeFileSync('move-refactored-files.sh', shCommands.join('\n'));
console.log('Created move-refactored-files.sh to move the files.');