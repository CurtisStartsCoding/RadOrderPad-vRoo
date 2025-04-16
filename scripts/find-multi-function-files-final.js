/**
 * Final improved script to find files with multiple functions
 * This helps identify files that need further refactoring
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SRC_DIR = path.join(__dirname, 'src');
const IGNORE_DIRS = ['node_modules', 'dist', 'old_code'];
const IGNORE_FILES = [
  'index.ts', // Index files are allowed to have multiple exports
  'types.ts'  // Type definition files don't have functions
];
const FILE_EXTENSIONS = ['.js', '.ts'];

// Results storage
const multiFunctionFiles = [];
let totalFilesAnalyzed = 0;

/**
 * Count functions in a file by parsing the content
 * @param {string} content - File content
 * @returns {Array} - Array of function names found
 */
function findFunctions(content) {
  // Remove comments to avoid false positives
  content = content.replace(/\/\*[\s\S]*?\*\//g, ''); // Remove multi-line comments
  content = content.replace(/\/\/[^\n]*/g, ''); // Remove single-line comments
  
  const functions = [];
  
  // Match function declarations: function name() {}
  const functionDeclarationRegex = /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\([^)]*\)/g;
  let match;
  while ((match = functionDeclarationRegex.exec(content)) !== null) {
    functions.push(match[1]);
  }
  
  // Match arrow functions assigned to variables: const name = () => {}
  const arrowFunctionRegex = /(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>/g;
  while ((match = arrowFunctionRegex.exec(content)) !== null) {
    functions.push(match[1]);
  }
  
  // Match exported arrow functions: export const name = () => {}
  const exportedArrowFunctionRegex = /export\s+(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>/g;
  while ((match = exportedArrowFunctionRegex.exec(content)) !== null) {
    functions.push(match[1]);
  }
  
  // Match exported function declarations: export function name() {}
  const exportedFunctionRegex = /export\s+function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\([^)]*\)/g;
  while ((match = exportedFunctionRegex.exec(content)) !== null) {
    functions.push(match[1]);
  }
  
  // Match class methods: methodName() {}
  const classMethodRegex = /(?:async\s+)?([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\([^)]*\)\s*{/g;
  while ((match = classMethodRegex.exec(content)) !== null) {
    // Filter out if/for/while/switch statements
    const methodName = match[1];
    if (!['if', 'for', 'while', 'switch', 'catch'].includes(methodName)) {
      functions.push(methodName);
    }
  }
  
  // Remove duplicates
  return [...new Set(functions)];
}

/**
 * Analyze a file to count functions
 * @param {string} filePath - Path to the file
 * @returns {object} - File analysis result
 */
function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Find functions
    const functions = findFunctions(content);
    
    // Count lines
    const lineCount = content.split('\n').length;
    
    // Get file size
    const stats = fs.statSync(filePath);
    const fileSizeInBytes = stats.size;
    const fileSizeInKB = fileSizeInBytes / 1024;
    
    return {
      hasMultiple: functions.length > 1,
      count: functions.length,
      functions: functions,
      filePath: filePath.replace(__dirname, ''),
      size: fileSizeInKB.toFixed(2),
      lines: lineCount
    };
  } catch (error) {
    console.error(`Error analyzing file ${filePath}:`, error.message);
    return {
      hasMultiple: false,
      count: 0,
      functions: [],
      filePath: filePath.replace(__dirname, ''),
      size: 0,
      lines: 0
    };
  }
}

/**
 * Recursively scan a directory for files
 * @param {string} dir - Directory to scan
 */
function scanDirectory(dir) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      // Skip ignored directories
      if (entry.isDirectory() && !IGNORE_DIRS.includes(entry.name)) {
        scanDirectory(fullPath);
        continue;
      }
      
      // Skip non-JS/TS files and ignored files
      if (!entry.isFile() || 
          !FILE_EXTENSIONS.includes(path.extname(entry.name)) ||
          IGNORE_FILES.includes(entry.name)) {
        continue;
      }
      
      totalFilesAnalyzed++;
      
      // Analyze file
      const result = analyzeFile(fullPath);
      if (result.hasMultiple) {
        multiFunctionFiles.push(result);
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error.message);
  }
}

// Start the scan
console.log('Scanning for files with multiple functions...');
scanDirectory(SRC_DIR);

// Sort results by function count (descending)
multiFunctionFiles.sort((a, b) => b.count - a.count);

// Print results
console.log('\n=== Files with Multiple Functions ===');
console.log(`Found ${multiFunctionFiles.length} files with multiple functions out of ${totalFilesAnalyzed} total files.`);
console.log('\nTop files to refactor:');

multiFunctionFiles.forEach((file, index) => {
  console.log(`${index + 1}. ${file.filePath} (${file.count} functions, ${file.lines} lines)`);
  console.log(`   Functions: ${file.functions.join(', ')}`);
});

console.log('\nRefactoring these files will help achieve the goal of having single-responsibility files.');