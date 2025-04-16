/**
 * Script to check if imports are using original files or refactored directories
 */
const fs = require('fs');
const path = require('path');

console.log('Checking import usage across the codebase...\n');

// Files to check
const filesToCheck = [
  {
    name: 'Clinical Record Manager',
    originalImport: 'clinical-record-manager',
    refactoredImport: 'clinical-record-manager/',
    path: 'src/services/order/admin'
  },
  {
    name: 'Order Status Manager',
    originalImport: 'order-status-manager',
    refactoredImport: 'order-status-manager/',
    path: 'src/services/order/admin'
  },
  {
    name: 'Order Export Service',
    originalImport: 'order-export.service',
    refactoredImport: 'order-export/',
    path: 'src/services/order/radiology'
  },
  {
    name: 'Keyword Extractor',
    originalImport: 'keyword-extractor',
    refactoredImport: 'keyword-extractor/',
    path: 'src/utils/text-processing'
  },
  {
    name: 'Connection List Controller',
    originalImport: 'list.controller',
    refactoredImport: 'list/',
    path: 'src/controllers/connection'
  },
  {
    name: 'Connection Validation Utils',
    originalImport: 'validation-utils',
    refactoredImport: 'validation-utils/',
    path: 'src/controllers/connection'
  }
];

// Function to recursively find all .ts files
function findTsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !filePath.includes('node_modules')) {
      fileList = findTsFiles(filePath, fileList);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Find all TypeScript files in the src directory
const allTsFiles = findTsFiles('src');
console.log(`Found ${allTsFiles.length} TypeScript files to check\n`);

// Check each file for imports
filesToCheck.forEach(fileToCheck => {
  console.log(`\n${fileToCheck.name}:`);
  
  let originalImportCount = 0;
  let refactoredImportCount = 0;
  let originalImportFiles = [];
  let refactoredImportFiles = [];
  
  allTsFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    
    // Check for imports of the original file
    const originalImportRegex = new RegExp(`from\\s+['"](\\.\\.?\\/)*${fileToCheck.path.replace(/\//g, '\\/')}\\/${fileToCheck.originalImport}['"]`, 'g');
    if (originalImportRegex.test(content)) {
      originalImportCount++;
      originalImportFiles.push(file);
    }
    
    // Check for imports of the refactored directory
    const refactoredImportRegex = new RegExp(`from\\s+['"](\\.\\.?\\/)*${fileToCheck.path.replace(/\//g, '\\/')}\\/${fileToCheck.refactoredImport}['"]`, 'g');
    if (refactoredImportRegex.test(content)) {
      refactoredImportCount++;
      refactoredImportFiles.push(file);
    }
  });
  
  console.log(`  Original imports: ${originalImportCount}`);
  if (originalImportCount > 0) {
    console.log(`  Files importing original:`);
    originalImportFiles.forEach(file => console.log(`    - ${file}`));
  }
  
  console.log(`  Refactored imports: ${refactoredImportCount}`);
  if (refactoredImportCount > 0) {
    console.log(`  Files importing refactored:`);
    refactoredImportFiles.forEach(file => console.log(`    - ${file}`));
  }
  
  if (originalImportCount === 0 && refactoredImportCount > 0) {
    console.log(`  ✅ All imports are using the refactored directory`);
  } else if (originalImportCount > 0 && refactoredImportCount === 0) {
    console.log(`  ❌ All imports are still using the original file`);
  } else if (originalImportCount > 0 && refactoredImportCount > 0) {
    console.log(`  ⚠️ Mixed imports - some using original, some using refactored`);
  } else {
    console.log(`  ℹ️ No imports found for this file`);
  }
});

console.log('\nImport check complete!');