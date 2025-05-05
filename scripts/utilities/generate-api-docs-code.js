const fs = require('fs');
const path = require('path');

// Configuration
const rootDir = path.resolve(__dirname, '../..');  // Root directory (2 levels up from scripts/utilities)
const targetDir = path.join(rootDir, 'frontend-explanation', 'api-docs');  // Target directory
const outputFile = path.join(rootDir, 'api-docs-export.txt');  // Output file in the root directory

// Initialize output file
fs.writeFileSync(outputFile, '', 'utf8');

// Function to append content to the output file
function appendToOutput(content) {
  fs.appendFileSync(outputFile, content, 'utf8');
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
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        // Recursively process subdirectory
        traverseDirectory(itemPath);
      } else if (stats.isFile()) {
        // Process file
        processFile(itemPath);
      }
    }
  } catch (error) {
    console.error(`Error accessing directory ${dirPath}: ${error.message}`);
    appendToOutput(`---------${dirPath}-------\n`);
    appendToOutput(`[Error accessing directory: ${error.message}]\n`);
    appendToOutput(`--------------------\n\n`);
  }
}

// Main execution
console.log('Starting directory traversal...');
console.log(`Processing the api-docs directory: ${targetDir}`);
console.log(`Output will be written to: ${outputFile}`);

try {
  // Check if the target directory exists
  if (!fs.existsSync(targetDir)) {
    console.error(`Target directory does not exist: ${targetDir}`);
    appendToOutput(`Error: Target directory does not exist: ${targetDir}\n`);
  } else {
    // Traverse the target directory
    traverseDirectory(targetDir);
    console.log('Directory traversal complete!');
    console.log(`API docs have been written to: ${outputFile}`);
  }
} catch (error) {
  console.error('Error during directory traversal:', error);
}