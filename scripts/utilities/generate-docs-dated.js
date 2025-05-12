const fs = require('fs');
const path = require('path');

// Function to get current date in YYYY-MM-DD format
function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Configuration
const rootDir = path.resolve(__dirname, '../..');  // Root directory (2 levels up from scripts/utilities)
const docsDir = path.join(rootDir, 'DOCS');  // DOCS directory
const dateStr = getCurrentDate();
const outputFile = path.join(rootDir, `all-docs-${dateStr}.txt`);  // Output file in the root directory with date
const excludeDirs = [
  'node_modules',
  '.git',
  '.vercel',
  'dist'
];
const includeExtensions = [
  '.md',
  '.txt',
  '.json',
  '.js',
  '.ts'
];

// Initialize output file
fs.writeFileSync(outputFile, '', 'utf8');

// Function to get current timestamp
function getCurrentTimestamp() {
  const now = new Date();
  return now.toLocaleString();
}

// Function to append content to the output file
function appendToOutput(content) {
  fs.appendFileSync(outputFile, content, 'utf8');
}

// Function to process a file
function processFile(filePath) {
  const relativePath = path.relative(rootDir, filePath).replace(/\\/g, '/');
  const ext = path.extname(filePath).toLowerCase();
  
  // Skip files with extensions not in the include list
  if (!includeExtensions.includes(ext)) {
    console.log(`Skipping file with excluded extension: ${relativePath}`);
    return;
  }
  
  try {
    // Read file content
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const timestamp = getCurrentTimestamp();
    
    // Format and write to output file with timestamp
    appendToOutput(`\n\n${'='.repeat(80)}\n`);
    appendToOutput(`FILE: ${relativePath} | TIMESTAMP: ${timestamp}\n`);
    appendToOutput(`${'='.repeat(80)}\n\n`);
    appendToOutput(`${fileContent}\n`);
    
    console.log(`Processed: ${relativePath}`);
  } catch (error) {
    // Handle binary files or other read errors
    const timestamp = getCurrentTimestamp();
    appendToOutput(`\n\n${'='.repeat(80)}\n`);
    appendToOutput(`FILE: ${relativePath} | TIMESTAMP: ${timestamp}\n`);
    appendToOutput(`${'='.repeat(80)}\n\n`);
    appendToOutput(`[Binary file or error reading file: ${error.message}]\n`);
    
    console.log(`Error processing: ${relativePath} - ${error.message}`);
  }
}

// Function to traverse directories recursively
function traverseDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);
    
    if (stats.isDirectory()) {
      // Skip excluded directories
      if (excludeDirs.includes(item)) {
        console.log(`Skipping excluded directory: ${item}`);
        continue;
      }
      
      // Recursively process subdirectory
      traverseDirectory(itemPath);
    } else if (stats.isFile()) {
      // Process file
      processFile(itemPath);
    }
  }
}

// Main execution
console.log('Starting directory traversal...');
console.log(`Processing the DOCS directory`);
console.log(`Output will be written to: ${outputFile}`);

try {
  // Check if DOCS directory exists
  if (fs.existsSync(docsDir)) {
    // Traverse the DOCS directory
    traverseDirectory(docsDir);
    console.log('Directory traversal complete!');
    console.log(`File listing has been written to: ${outputFile}`);
  } else {
    console.log(`DOCS directory not found at: ${docsDir}`);
  }
} catch (error) {
  console.error('Error during directory traversal:', error);
}