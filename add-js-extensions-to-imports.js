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
const importRegex = /import\s+(?:(?:\{[^}]*\})|(?:[^{}\s,]+))(?:\s*,\s*(?:(?:\{[^}]*\})|(?:[^{}\s,]+)))?\s+from\s+['"]([\.\/][^'"]*?)(?!\.js|\.json|\.ts)['"];/g;

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

// Function to update import statements in a file
function updateImportsInFile(filePath, dryRun = true) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Replace import statements without .js extensions
  content = content.replace(importRegex, (match, importPath) => {
    return match.replace(`'${importPath}'`, `'${importPath}.js'`).replace(`"${importPath}"`, `"${importPath}.js"`);
  });
  
  // Check if the content has changed
  if (content !== originalContent) {
    if (!dryRun) {
      fs.writeFileSync(filePath, content);
    }
    return true;
  }
  
  return false;
}

// Main function
function addJsExtensionsToImports(dryRun = true) {
  const srcDir = path.join(__dirname, 'src');
  const tsFiles = findTypeScriptFiles(srcDir);
  
  console.log(`Found ${tsFiles.length} TypeScript files to check.`);
  
  let updatedFiles = 0;
  const updatedFilesList = [];
  
  tsFiles.forEach(file => {
    const wasUpdated = updateImportsInFile(file, dryRun);
    
    if (wasUpdated) {
      updatedFiles++;
      updatedFilesList.push(path.relative(__dirname, file));
    }
  });
  
  console.log(`${dryRun ? 'Would update' : 'Updated'} ${updatedFiles} files.`);
  
  // Write the list of updated files to a file
  fs.writeFileSync('updated-files.json', JSON.stringify(updatedFilesList, null, 2));
  console.log(`List of ${dryRun ? 'files that would be updated' : 'updated files'} written to updated-files.json`);
}

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.indexOf('--apply') === -1;

if (dryRun) {
  console.log('Running in dry-run mode. No files will be modified.');
  console.log('To apply changes, run with --apply flag.');
}

// Run the main function
addJsExtensionsToImports(dryRun);