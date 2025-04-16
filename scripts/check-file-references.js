/**
 * Script to check for any references to the files in the codebase
 */
const fs = require('fs');
const path = require('path');

console.log('Checking for file references across the codebase...\n');

// Files to check
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

// Check each file for references
filesToCheck.forEach(fileToCheck => {
  console.log(`\n${fileToCheck.name}:`);
  
  // Check for imports through parent directory index files
  const parentDirIndexFile = path.join(fileToCheck.path, 'index.ts');
  if (fs.existsSync(parentDirIndexFile)) {
    const indexContent = fs.readFileSync(parentDirIndexFile, 'utf8');
    
    // Check if the index file exports from the original file
    if (indexContent.includes(fileToCheck.originalFile) || 
        indexContent.includes(fileToCheck.originalFile.replace('.ts', ''))) {
      console.log(`  ✓ Parent directory index file exports the original file`);
    }
    
    // Check if the index file exports from the refactored directory
    if (indexContent.includes(fileToCheck.refactoredDir)) {
      console.log(`  ✓ Parent directory index file exports the refactored directory`);
    }
  }
  
  // Check for direct references to the file
  let originalFileReferenceCount = 0;
  let refactoredDirReferenceCount = 0;
  let originalFileReferenceFiles = [];
  let refactoredDirReferenceFiles = [];
  
  allTsFiles.forEach(file => {
    // Skip the file itself and its refactored directory
    if (file.includes(path.join(fileToCheck.path, fileToCheck.originalFile)) ||
        file.includes(path.join(fileToCheck.path, fileToCheck.refactoredDir))) {
      return;
    }
    
    const content = fs.readFileSync(file, 'utf8');
    
    // Check for references to the original file
    if (content.includes(fileToCheck.originalFile) || 
        content.includes(fileToCheck.originalFile.replace('.ts', ''))) {
      originalFileReferenceCount++;
      originalFileReferenceFiles.push(file);
    }
    
    // Check for references to the refactored directory
    if (content.includes(fileToCheck.refactoredDir)) {
      refactoredDirReferenceCount++;
      refactoredDirReferenceFiles.push(file);
    }
  });
  
  console.log(`  Original file references: ${originalFileReferenceCount}`);
  if (originalFileReferenceCount > 0) {
    console.log(`  Files referencing original:`);
    originalFileReferenceFiles.slice(0, 5).forEach(file => console.log(`    - ${file}`));
    if (originalFileReferenceFiles.length > 5) {
      console.log(`    ... and ${originalFileReferenceFiles.length - 5} more`);
    }
  }
  
  console.log(`  Refactored directory references: ${refactoredDirReferenceCount}`);
  if (refactoredDirReferenceCount > 0) {
    console.log(`  Files referencing refactored:`);
    refactoredDirReferenceFiles.slice(0, 5).forEach(file => console.log(`    - ${file}`));
    if (refactoredDirReferenceFiles.length > 5) {
      console.log(`    ... and ${refactoredDirReferenceFiles.length - 5} more`);
    }
  }
  
  // Check the index file in the refactored directory
  const refactoredIndexFile = path.join(fileToCheck.path, fileToCheck.refactoredDir, 'index.ts');
  if (fs.existsSync(refactoredIndexFile)) {
    console.log(`  ✓ Refactored directory has an index.ts file`);
  }
});

console.log('\nReference check complete!');