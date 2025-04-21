/**
 * Script to organize loose files in the root directory
 * This will move files into appropriate directories based on their type
 * IMPORTANT: This script preserves all existing documentation in the Docs directory
 */
const fs = require('fs');
const path = require('path');

// Define target directories
const directories = {
  scripts: 'scripts',
  sqlScripts: 'sql-scripts',
  batchFiles: 'batch-files',
  config: 'config'
};

// Create directories if they don't exist
Object.values(directories).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Files to keep in the root directory
const keepInRoot = [
  '.env',
  '.env.example',
  '.env.test',
  '.gitignore',
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'README.md',
  'docker-compose.yml',
  'organize-root-directory.js',
  'setup-github.js',
  'setup-github.bat',
  'setup-github.sh',
  'ORDER_API_README.md', // Keep existing API documentation in root
  'node_modules',
  'src',
  'dist',
  'tests',
  'Data',
  'Docs',
  'debug-scripts',
  'db-migrations',
  'migrations',
  'scripts',
  'sql-scripts',
  'batch-files',
  'config',
  'test-results',
  'docker-scripts',
  'old_code'
];

// Get all files in the root directory
const files = fs.readdirSync('.');

// Process each file
files.forEach(file => {
  // Skip directories and files to keep in root
  if (fs.statSync(file).isDirectory() || keepInRoot.includes(file)) {
    return;
  }

  let targetDir = null;

  // Determine target directory based on file extension or name
  if (file.endsWith('.js') && !file.includes('test') && !file.startsWith('import_')) {
    targetDir = directories.scripts;
  } else if (file.endsWith('.sql')) {
    targetDir = directories.sqlScripts;
  } else if (file.endsWith('.bat') || file.endsWith('.sh')) {
    targetDir = directories.batchFiles;
  } else if (file.startsWith('import_') || file.startsWith('verify_')) {
    targetDir = directories.sqlScripts;
  }

  // Move the file if a target directory was determined
  if (targetDir) {
    const sourcePath = path.join('.', file);
    const targetPath = path.join(targetDir, file);
    
    try {
      fs.renameSync(sourcePath, targetPath);
      console.log(`Moved ${file} to ${targetDir}/`);
    } catch (error) {
      console.error(`Error moving ${file}: ${error.message}`);
    }
  } else {
    console.log(`Keeping ${file} in root (no target directory determined)`);
  }
});

console.log('\nOrganization complete!');
console.log('Files have been moved to appropriate directories.');
console.log('All existing documentation has been preserved.');
console.log('You may want to review the organization before committing to Git.');