const fs = require('fs');
const path = require('path');

// Configuration
const outputFile = 'all-code.txt';
const sourceDir = 'vercel-deploy';
const excludeDirs = [
  'node_modules', '.git', 'logs', 'temp', 'deployment/node_modules'
];
const excludePatterns = [
  /test/i,  // Exclude any files with "test" in the name
  /\.bat$/i, // Exclude batch files
  /\.sh$/i   // Exclude shell scripts
];
const includeExtensions = [
  '.js', '.ts', '.jsx', '.tsx', '.json'
];

// Clear or create the output file
fs.writeFileSync(outputFile, '');

// Function to check if a file should be excluded
function shouldExclude(filePath) {
  const fileName = path.basename(filePath);
  
  // Check if the file matches any exclude patterns
  for (const pattern of excludePatterns) {
    if (pattern.test(fileName)) {
      return true;
    }
  }
  
  // Check if the file has an extension we want to include
  const ext = path.extname(filePath).toLowerCase();
  if (!includeExtensions.includes(ext)) {
    return true;
  }
  
  return false;
}

// Function to process a file
function processFile(filePath) {
  try {
    if (shouldExclude(filePath)) {
      return;
    }

    // Read the file content
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Append to our output file
    const relativePath = path.relative(process.cwd(), filePath);
    const output = `\n\n// FILE: ${relativePath}\n\n${content}\n\n// endoffile\n`;
    fs.appendFileSync(outputFile, output);
    
    console.log(`Processed: ${relativePath}`);
  } catch (error) {
    console.error(`Error processing file ${filePath}: ${error.message}`);
  }
}

// Function to recursively process directories
function processDirectory(dirPath) {
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        // Skip excluded directories
        if (excludeDirs.includes(item)) {
          console.log(`Skipping directory: ${itemPath}`);
          continue;
        }
        
        // Process subdirectory
        processDirectory(itemPath);
      } else if (stats.isFile()) {
        // Process file
        processFile(itemPath);
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dirPath}: ${error.message}`);
  }
}

// Start processing from the vercel-deploy directory
console.log(`Starting to generate ${outputFile} from ${sourceDir}...`);
processDirectory(path.join(process.cwd(), sourceDir));
console.log(`Finished generating ${outputFile}`);