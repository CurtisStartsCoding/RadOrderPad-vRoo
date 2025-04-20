/**
 * Script to verify the module system configuration
 * 
 * This script checks that the package.json and tsconfig.json files
 * are correctly configured for CommonJS modules.
 */

const fs = require('fs');
const path = require('path');

// Get the project root directory
const projectRoot = path.resolve(__dirname, '..');

// Check package.json
console.log('Checking package.json...');
const packageJsonPath = path.join(projectRoot, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

if (packageJson.type === 'module') {
  console.error('❌ package.json has "type": "module", which will cause module resolution issues.');
  console.error('   Remove the "type": "module" line from package.json.');
} else {
  console.log('✅ package.json is correctly configured for CommonJS modules.');
}

// Check tsconfig.json
console.log('\nChecking tsconfig.json...');
const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

if (tsconfig.compilerOptions.module !== 'CommonJS') {
  console.error(`❌ tsconfig.json has "module": "${tsconfig.compilerOptions.module}", which may cause module resolution issues.`);
  console.error('   Change "module" to "CommonJS" in tsconfig.json.');
} else {
  console.log('✅ tsconfig.json is correctly configured with "module": "CommonJS".');
}

if (tsconfig.compilerOptions.moduleResolution !== 'node') {
  console.error(`❌ tsconfig.json has "moduleResolution": "${tsconfig.compilerOptions.moduleResolution}", which may cause module resolution issues.`);
  console.error('   Change "moduleResolution" to "node" in tsconfig.json.');
} else {
  console.log('✅ tsconfig.json is correctly configured with "moduleResolution": "node".');
}

// Check for .js extensions in import statements
console.log('\nChecking for .js extensions in import statements...');
console.log('This is a more complex check that requires parsing TypeScript files.');
console.log('If you encounter module resolution issues, make sure your TypeScript files:');
console.log('1. Do NOT include .js extensions in import statements when using CommonJS modules');
console.log('2. Example: import { something } from \'./file\' (correct)');
console.log('3. Example: import { something } from \'./file.js\' (may cause issues with CommonJS)');

// Summary
console.log('\nSummary:');
if (packageJson.type !== 'module' && 
    tsconfig.compilerOptions.module === 'CommonJS' && 
    tsconfig.compilerOptions.moduleResolution === 'node') {
  console.log('✅ Your module system configuration looks correct for CommonJS modules.');
  console.log('   The application should build and run without module resolution issues.');
} else {
  console.log('❌ Your module system configuration has issues that need to be fixed.');
  console.log('   Please fix the issues mentioned above and run this script again.');
}

console.log('\nFor more information, see Docs/module-system-fix.md');