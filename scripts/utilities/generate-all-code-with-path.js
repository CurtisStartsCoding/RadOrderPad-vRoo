const fs = require('fs');
const path = require('path');

// Configuration
const rootDir = path.resolve(__dirname, '../..');  // Root directory (2 levels up from scripts/utilities)
const outputFile = path.join(rootDir, 'all-code-with-path.txt');  // Output file in the root directory
const excludeDirs = [
  'node_modules',
  '.git',
  '.vercel',
  'dist',
  'deployment',
  'eb-deploy',
  'vercel-deploy',
  'tests',
  'temp',
  'logs',
  'Data',
  'redis-test-results',
  'test-results',
  'tokens',
  'old_code'
];

// Include both source code and config files
const includeExtensions = [
  // Source code
  '.js',
  '.ts',
  '.jsx',
  '.tsx',
  '.css',
  '.scss',
  '.html',
  // Config files
  '.json',
  '.env',
  '.yml',
  '.yaml',
  '.toml',
  '.ini',
  '.config',
  '.conf',
  // Documentation
  '.md',
  '.txt'
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
      appendToOutput(`\n\n${'='.repeat(80)}\n`);
      appendToOutput(`FILE: ${relativePath}\n`);
      appendToOutput(`${'='.repeat(80)}\n\n`);
      appendToOutput(`[Binary file - content not included]\n`);
      console.log(`Skipped binary file: ${relativePath}`);
      return;
    }
    
    // Read file content
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Format and write to output file with clear separator containing file path
    appendToOutput(`\n\n${'='.repeat(80)}\n`);
    appendToOutput(`FILE: ${relativePath}\n`);
    appendToOutput(`${'='.repeat(80)}\n\n`);
    appendToOutput(`${fileContent}\n`);
    
    console.log(`Processed: ${relativePath}`);
  } catch (error) {
    // Handle binary files or other read errors
    appendToOutput(`\n\n${'='.repeat(80)}\n`);
    appendToOutput(`FILE: ${relativePath}\n`);
    appendToOutput(`${'='.repeat(80)}\n\n`);
    appendToOutput(`[Error reading file: ${error.message}]\n`);
    
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
console.log(`Processing source code and config files only`);
console.log(`Output will be written to: ${outputFile}`);

try {
  // Process src directory for source code
  console.log('Processing src directory...');
  traverseDirectory(path.join(rootDir, 'src'));
  
  // Process config files in the root directory
  console.log('Processing config files in root directory...');
  const rootItems = fs.readdirSync(rootDir);
  for (const item of rootItems) {
    const itemPath = path.join(rootDir, item);
    const stats = fs.statSync(itemPath);
    
    if (stats.isFile()) {
      const ext = path.extname(itemPath).toLowerCase();
      if (['.json', '.js', '.ts', '.env', '.yml', '.yaml', '.config'].includes(ext)) {
        processFile(itemPath);
      }
    }
  }
  console.log('Directory traversal complete!');
  console.log(`Complete file listing has been written to: ${outputFile}`);
} catch (error) {
  console.error('Error during directory traversal:', error);
}