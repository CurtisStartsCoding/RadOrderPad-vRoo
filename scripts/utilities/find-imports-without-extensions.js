import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Regular expression to match import statements without .js extensions
// This regex looks for:
// 1. import statements (import ... from)
// 2. that import from a relative path (./ or ../)
// 3. that don't end with a file extension (.js, .json, etc.)
const importRegex = /import\s+(?:(?:\{[^}]*\})|(?:[^{}\s,]+))(?:\s*,\s*(?:(?:\{[^}]*\})|(?:[^{}\s,]+)))?\s+from\s+['"]([\.\/][^'"]*?)(?:\.js|\.json|\.ts)?['"];/g;

// Function to recursively find all TypeScript files
function findTypeScriptFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findTypeScriptFiles(filePath, fileList);
    } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to check a file for import statements without .js extensions
function checkFileForImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const matches = [];
  let match;
  
  // Reset the regex
  importRegex.lastIndex = 0;
  
  // Find all matches
  while ((match = importRegex.exec(content)) !== null) {
    matches.push({
      importPath: match[1],
      fullMatch: match[0]
    });
  }
  
  return matches;
}

// Main function
function findImportsWithoutExtensions() {
  const srcDir = path.join(__dirname, 'src');
  const tsFiles = findTypeScriptFiles(srcDir);
  
  console.log(`Found ${tsFiles.length} TypeScript files to check.`);
  
  let totalImportsWithoutExtensions = 0;
  const filesWithImportsWithoutExtensions = [];
  
  tsFiles.forEach(file => {
    const imports = checkFileForImports(file);
    
    if (imports.length > 0) {
      const relativePath = path.relative(__dirname, file);
      filesWithImportsWithoutExtensions.push({
        file: relativePath,
        imports: imports,
        count: imports.length
      });
      
      totalImportsWithoutExtensions += imports.length;
    }
  });
  
  console.log(`Found ${totalImportsWithoutExtensions} import statements without .js extensions in ${filesWithImportsWithoutExtensions.length} files.`);
  
  // Sort files by number of imports
  filesWithImportsWithoutExtensions.sort((a, b) => b.count - a.count);
  
  // Print the top 10 files with the most imports without extensions
  console.log('\nTop 10 files with the most imports without extensions:');
  filesWithImportsWithoutExtensions.slice(0, 10).forEach(file => {
    console.log(`${file.file}: ${file.count} imports`);
  });
  
  // Write the full results to a file
  const results = {
    totalFiles: tsFiles.length,
    totalImportsWithoutExtensions: totalImportsWithoutExtensions,
    filesWithImportsWithoutExtensions: filesWithImportsWithoutExtensions
  };
  
  fs.writeFileSync('imports-without-extensions-report.json', JSON.stringify(results, null, 2));
  console.log('\nFull results written to imports-without-extensions-report.json');
}

// Run the main function
findImportsWithoutExtensions();