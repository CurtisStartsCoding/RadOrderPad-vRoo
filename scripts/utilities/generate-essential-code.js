const fs = require('fs');
const path = require('path');

// Configuration
const rootDir = path.resolve(__dirname, '../..');  // Root directory (2 levels up from scripts/utilities)
const outputFile = path.join(rootDir, 'essential-code.txt');  // Output file in the root directory

// Only include these directories
const includeDirs = [
  'src'
];

// Include root config files
const includeRootConfigPatterns = [
  '.json',
  '.js',
  '.ts',
  '.yml',
  '.yaml',
  '.env'
];

// Exclude these directories
const excludeDirs = [
  'node_modules',
  '.git',
  '.vercel',
  'dist',
  'deployment',
  'eb-deploy',
  'vercel-deploy',
  'tests',
  'test-results',
  'sql-scripts',
  'scripts',
  'temp-extract',
  'tokens',
  'logs',
  'keytemp',
  'migrations',
  'migration',
  'old_code',
  'debug-scripts',
  'docker-scripts',
  'Data',
  'db-migrations',
  'DOCS'
];

// Initialize output file
fs.writeFileSync(outputFile, '', 'utf8');

// Function to append content to the output file
function appendToOutput(content) {
  fs.appendFileSync(outputFile, content, 'utf8');
}

// Function to check if a file is a root config file
function isRootConfigFile(filePath) {
  // Only include files directly in the root directory
  if (path.dirname(filePath) !== rootDir) {
    return false;
  }
  
  const ext = path.extname(filePath).toLowerCase();
  const filename = path.basename(filePath).toLowerCase();
  
  // Check if it's a config file based on extension or name
  return includeRootConfigPatterns.some(pattern => 
    filename.endsWith(pattern) || 
    filename.includes('config') || 
    filename.includes('.env')
  );
}

// Function to process a file
function processFile(filePath) {
  const relativePath = path.relative(rootDir, filePath).replace(/\\/g, '/');
  
  try {
    // Check if file is binary
    const buffer = Buffer.alloc(4096);
    const fd = fs.openSync(filePath, 'r');
    const bytesRead = fs.readSync(fd, buffer, 0, 4096, 0);
    fs.closeSync(fd);
    
    // Simple binary check - if there are null bytes or too many non-printable characters
    const slice = buffer.slice(0, bytesRead);
    const isBinary = slice.includes(0) || 
                     slice.filter(b => b < 9).length > 0 ||
                     (slice.filter(b => b < 32 && b !== 9 && b !== 10 && b !== 13).length / bytesRead > 0.3);
    
    if (isBinary) {
      appendToOutput(`---------${relativePath}-------\n`);
      appendToOutput(`[Binary file - content not included]\n`);
      appendToOutput(`--------------------\n\n`);
      console.log(`Skipped binary file: ${relativePath}`);
      return;
    }
    
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
    appendToOutput(`[Error reading file: ${error.message}]\n`);
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
      
      // Only process included directories if not at root level
      const relativeDir = path.relative(rootDir, dirPath);
      if (relativeDir !== '' && !includeDirs.some(dir => itemPath.includes(dir))) {
        console.log(`Skipping non-included directory: ${item}`);
        continue;
      }
      
      // Recursively process subdirectory
      traverseDirectory(itemPath);
    } else if (stats.isFile()) {
      // Process file if it's in an included directory or is a root config file
      const relativeDir = path.relative(rootDir, dirPath);
      if (relativeDir === '' && !isRootConfigFile(itemPath)) {
        console.log(`Skipping non-config root file: ${item}`);
        continue;
      }
      
      if (relativeDir !== '' && !includeDirs.some(dir => dirPath.includes(dir))) {
        console.log(`Skipping file in non-included directory: ${item}`);
        continue;
      }
      
      processFile(itemPath);
    }
  }
}

// Main execution
console.log('Starting directory traversal...');
console.log(`Processing source code and config files`);
console.log(`Output will be written to: ${outputFile}`);

try {
  // Traverse the entire project directory
  traverseDirectory(rootDir);
  console.log('Directory traversal complete!');
  console.log(`Essential code has been written to: ${outputFile}`);
} catch (error) {
  console.error('Error during directory traversal:', error);
}