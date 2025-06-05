const fs = require('fs');
const path = require('path');

// Get directory to process from command line arguments
const directoryToProcess = process.argv[2] || 'src';
console.log(`Processing directory: ${directoryToProcess}`);

// Configuration
const outputDir = 'codebase-dump';
const outputFileName = `all-${directoryToProcess.replace(/\//g, '-')}.txt`;
const outputFile = path.join(outputDir, outputFileName);
let fileCount = 0;

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`Created output directory: ${outputDir}`);
}

// Clear the output file
fs.writeFileSync(outputFile, '', 'utf8');

// Function to get current timestamp
function getCurrentTimestamp() {
  const now = new Date();
  return now.toLocaleString();
}

// Function to determine if a file should be included
function shouldIncludeFile(filePath) {
  // Include all files from the specified directory
  if (filePath.startsWith(`${directoryToProcess}/`)) {
    return true;
  }
  
  // Include specific config files at the root level
  // Commented out for directory-specific processing
  /*
  const configFiles = [
    'package.json',
    'tsconfig.json',
    '.eslintrc.js',
    '.env',
    '.env.example'
  ];
  
  if (configFiles.includes(path.basename(filePath))) {
    return true;
  }
  */
  
  return false;
}

// Function to append content to the output file
function appendToFile(content) {
  try {
    fs.appendFileSync(outputFile, content, 'utf8');
    return true;
  } catch (err) {
    console.error(`Error appending to ${outputFile}:`, err);
    return false;
  }
}

// Function to process a single file
function processFile(filePath) {
  try {
    // Skip files larger than 5MB
    const stats = fs.statSync(filePath);
    if (stats.size > 5 * 1024 * 1024) {
      console.log(`Skipping large file (${(stats.size / (1024 * 1024)).toFixed(2)}MB): ${filePath}`);
      return false;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const timestamp = getCurrentTimestamp();
    
    // Create file header with path and timestamp
    let fileContent = `\n\n${'='.repeat(80)}\n`;
    fileContent += `FILE: ${filePath} | TIMESTAMP: ${timestamp}\n`;
    fileContent += `${'='.repeat(80)}\n\n`;
    fileContent += content;
    
    // Append to the output file
    if (appendToFile(fileContent)) {
      fileCount++;
      console.log(`Processed: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (err) {
    console.error(`Error processing file ${filePath}:`, err);
    return false;
  }
}

// Function to recursively process files in a directory
function processDirectory(directoryPath, relativePath = '') {
  try {
    const items = fs.readdirSync(directoryPath);
    
    for (const item of items) {
      const itemPath = path.join(directoryPath, item);
      const itemRelativePath = path.join(relativePath, item).replace(/\\/g, '/'); // Ensure forward slashes for consistency
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        // Skip node_modules, .git, and dist directories
        if (['node_modules', '.git', 'dist'].includes(item)) {
          continue;
        }
        
        // Process all directories to find src and config files
        processDirectory(itemPath, itemRelativePath);
      } else if (stats.isFile()) {
        // Check if file should be included
        if (shouldIncludeFile(itemRelativePath)) {
          processFile(itemRelativePath);
        }
      }
    }
  } catch (err) {
    console.error(`Error processing directory ${directoryPath}:`, err);
  }
}

// Main execution
console.log('Starting to combine src files and config files...');
const startTime = Date.now();

// Start processing from the root directory
processDirectory('.');

const endTime = Date.now();
const duration = (endTime - startTime) / 1000;

console.log(`\nCombination complete!`);
console.log(`Files processed: ${fileCount}`);
console.log(`Output written to: ${outputFile}`);
console.log(`Time taken: ${duration.toFixed(2)} seconds`);