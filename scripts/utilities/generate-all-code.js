const fs = require('fs');
const path = require('path');

// Configuration
const rootDir = path.resolve(__dirname, '../..');  // Root directory (2 levels up from scripts/utilities)
const outputFile = path.join(rootDir, 'all-code.txt');  // Output file in the root directory
const excludeDirs = [
  'node_modules',
  '.git',
  '.vercel',
  'dist',
  'deployment',
  'eb-deploy',
  'vercel-deploy'
];
const includeExtensions = [
  '.js',
  '.ts',
  '.jsx',
  '.tsx',
  '.json',
  '.md'
];

// Initialize output file
fs.writeFileSync(outputFile, '', 'utf8');

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
    
    // Format and write to output file
    appendToOutput(`---------${relativePath}-------\n`);
    appendToOutput(`${fileContent}\n`);
    appendToOutput(`--------------------\n\n`);
    
    console.log(`Processed: ${relativePath}`);
  } catch (error) {
    // Handle binary files or other read errors
    appendToOutput(`---------${relativePath}-------\n`);
    appendToOutput(`[Binary file or error reading file: ${error.message}]\n`);
    appendToOutput(`--------------------\n\n`);
    
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
console.log(`Processing the entire project directory`);
console.log(`Output will be written to: ${outputFile}`);

try {
  // Traverse the entire project directory
  traverseDirectory(rootDir);
  console.log('Directory traversal complete!');
  console.log(`File listing has been written to: ${outputFile}`);
} catch (error) {
  console.error('Error during directory traversal:', error);
}