const fs = require('fs');
const path = require('path');

// Configuration
const rootDir = path.resolve(__dirname, '../..');  // Root directory (2 levels up from scripts/utilities)
const outputFile = path.join(rootDir, 'all-code.txt');  // Output file in the root directory
const testScriptsDir = path.join(rootDir, 'debug-scripts', 'vercel-tests');

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

// Function to extract test script paths from batch files
function extractTestScriptPaths(batchFilePath) {
  const content = fs.readFileSync(batchFilePath, 'utf8');
  const lines = content.split('\n');
  
  const testScripts = [];
  
  for (const line of lines) {
    // Look for lines that call node with a .js file or call a .bat file
    if (line.includes('node ') && line.includes('.js')) {
      const match = line.match(/node\s+([^\s]+\.js)/);
      if (match && match[1]) {
        const scriptPath = match[1].replace(/"/g, '').trim();
        if (!scriptPath.includes('%PROJECT_ROOT%')) {
          testScripts.push(path.join(path.dirname(batchFilePath), scriptPath));
        }
      }
    } else if (line.includes('call "') && line.includes('.bat"')) {
      const match = line.match(/call\s+"([^"]+\.bat)"/);
      if (match && match[1]) {
        const batchPath = match[1].trim();
        if (batchPath.includes('%PROJECT_ROOT%')) {
          const relativePath = batchPath.replace('%PROJECT_ROOT%', '').replace(/\\/g, '/');
          testScripts.push(path.join(rootDir, relativePath));
        } else {
          testScripts.push(batchPath);
        }
      }
    }
  }
  
  return testScripts;
}

// Function to process all test scripts
async function processAllTestScripts() {
  // Add a README section at the beginning of the file
  appendToOutput(`---------README-------\n`);
  appendToOutput(`This file contains all the test scripts used in the RadOrderPad API testing suite.
It includes tests for various endpoints and features, including:

1. Authentication and user management
2. Connection management between organizations
3. Order validation and processing
4. Radiology workflow
5. File uploads and downloads
6. Trial features
7. Super admin functionality

To run these tests, you need to:
1. Generate tokens for different user roles using the generate-all-role-tokens.js script
2. Set the API_URL environment variable to point to your API endpoint
3. Run the individual test scripts or use the working-tests.bat files to run groups of tests

The tests are organized by functionality and are designed to verify the correct operation
of the RadOrderPad API.
\n`);
  appendToOutput(`--------------------\n\n`);

  // Process token generation script first
  const tokenGenerationScript = path.join(rootDir, 'scripts', 'utilities', 'generate-all-role-tokens.js');
  if (fs.existsSync(tokenGenerationScript)) {
    processFile(tokenGenerationScript);
  }

  // Process the main batch files
  const mainBatchFiles = [
    path.join(testScriptsDir, 'run-all-tests.bat'),
    path.join(testScriptsDir, 'working-tests.bat'),
    path.join(testScriptsDir, 'working-tests-2.bat'),
    path.join(testScriptsDir, 'working-tests-3.bat')
  ];
  
  for (const batchFile of mainBatchFiles) {
    if (fs.existsSync(batchFile)) {
      processFile(batchFile);
    }
  }

  // Get all .js files in the vercel-tests directory
  const jsFiles = fs.readdirSync(testScriptsDir)
    .filter(file => file.endsWith('.js'))
    .map(file => path.join(testScriptsDir, file));
  
  // Process all .js files
  for (const jsFile of jsFiles) {
    processFile(jsFile);
  }

  // Get all .bat files that call individual test scripts
  const batFiles = fs.readdirSync(testScriptsDir)
    .filter(file => file.endsWith('.bat') && 
                   !['run-all-tests.bat', 'working-tests.bat', 'working-tests-2.bat', 'working-tests-3.bat'].includes(file))
    .map(file => path.join(testScriptsDir, file));
  
  // Process all .bat files
  for (const batFile of batFiles) {
    processFile(batFile);
  }

  // Process .env files if they exist
  const envFiles = fs.readdirSync(testScriptsDir)
    .filter(file => file.startsWith('.env'))
    .map(file => path.join(testScriptsDir, file));
  
  for (const envFile of envFiles) {
    processFile(envFile);
  }
}

// Main execution
console.log('Starting to compile all test scripts...');
console.log(`Output will be written to: ${outputFile}`);

try {
  processAllTestScripts();
  console.log('Compilation complete!');
  console.log(`All test scripts have been compiled into: ${outputFile}`);
} catch (error) {
  console.error('Error during compilation:', error);
}