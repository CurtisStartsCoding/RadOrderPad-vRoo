const fs = require('fs');
const path = require('path');

// Configuration
const targetDirectory = 'frontend-explanation/api-docs';
const outputFilePath = 'combined-api-docs.md';
let combinedContent = '';
let fileCount = 0;

// Function to recursively process files in a directory
function processDirectory(directoryPath) {
  try {
    const items = fs.readdirSync(directoryPath);
    
    for (const item of items) {
      const itemPath = path.join(directoryPath, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        // Recursively process subdirectories
        processDirectory(itemPath);
      } else if (stats.isFile()) {
        // Process file
        try {
          const content = fs.readFileSync(itemPath, 'utf8');
          
          // Add file header with path
          combinedContent += `\n\n${'='.repeat(80)}\n`;
          combinedContent += `FILE: ${itemPath}\n`;
          combinedContent += `${'='.repeat(80)}\n\n`;
          combinedContent += content;
          
          fileCount++;
          console.log(`Processed: ${itemPath}`);
        } catch (err) {
          console.error(`Error reading file ${itemPath}:`, err);
        }
      }
    }
  } catch (err) {
    console.error(`Error processing directory ${directoryPath}:`, err);
  }
}

// Main execution
console.log('Starting to combine files from the api-docs directory...');
const startTime = Date.now();

// Start processing from the target directory
processDirectory(targetDirectory);

// Write the combined content to the output file
fs.writeFileSync(outputFilePath, combinedContent);

const endTime = Date.now();
const duration = (endTime - startTime) / 1000;

console.log(`\nCombination complete!`);
console.log(`Files processed: ${fileCount}`);
console.log(`Output written to: ${outputFilePath}`);
console.log(`Time taken: ${duration.toFixed(2)} seconds`);