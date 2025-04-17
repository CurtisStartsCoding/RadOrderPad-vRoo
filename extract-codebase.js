const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// File extensions to include
const codeExtensions = [
  // Backend
  '.js', '.ts', '.mjs', '.cjs',
  // Frontend
  '.jsx', '.tsx', '.vue',
  // Config files
  '.json', '.yml', '.yaml', '.env',
  // Other
  '.md'
  // Removed '.sql' as requested
];

// Directories to exclude
const excludeDirs = [
  'node_modules',
  '.git',
  'dist',
  'build',
  'coverage',
  'test-results',
  'old_code',
  'Data',           // Added as requested
  'debug-scripts',  // Added as requested
  'debug_scripts',  // Added in case of different naming
  'sql-scripts'     // Added to exclude SQL scripts directory
];

// Function to recursively get all files
async function getFiles(dir) {
  const subdirs = await readdir(dir);
  const files = await Promise.all(subdirs.map(async (subdir) => {
    const res = path.resolve(dir, subdir);
    if (excludeDirs.includes(subdir)) {
      return [];
    }
    
    try {
      const stats = await stat(res);
      if (stats.isDirectory()) {
        return getFiles(res);
      } else {
        const ext = path.extname(res).toLowerCase();
        if (codeExtensions.includes(ext)) {
          return res;
        }
        return null;
      }
    } catch (err) {
      console.error(`Error processing ${res}:`, err);
      return null;
    }
  }));
  
  return files.filter(Boolean).flat();
}

// Function to categorize files
function categorizeFile(filePath) {
  const relativePath = path.relative(process.cwd(), filePath);
  
  // Backend files
  if (
    relativePath.startsWith('src/') ||
    relativePath.startsWith('server/') ||
    relativePath.startsWith('api/') ||
    relativePath.startsWith('db-migrations/') ||
    relativePath.startsWith('migrations/')
  ) {
    return 'backend';
  }
  
  // Frontend files
  if (
    relativePath.startsWith('client/') ||
    relativePath.startsWith('frontend/') ||
    relativePath.startsWith('public/')
  ) {
    return 'frontend';
  }
  
  // Config files
  if (
    relativePath.includes('config') ||
    relativePath.endsWith('.json') ||
    relativePath.endsWith('.yml') ||
    relativePath.endsWith('.yaml') ||
    relativePath.endsWith('.env')
  ) {
    return 'config';
  }
  
  // Documentation
  if (
    relativePath.startsWith('docs/') ||
    relativePath.startsWith('Docs/') ||
    relativePath.endsWith('.md')
  ) {
    return 'docs';
  }
  
  // Default to other
  return 'other';
}

// Main function
async function extractCodebase() {
  try {
    console.log('Starting codebase extraction...');
    
    // Get all files
    const files = await getFiles(process.cwd());
    console.log(`Found ${files.length} files to process`);
    
    // Categorize files
    const categorizedFiles = {
      backend: [],
      frontend: [],
      config: [],
      docs: [],
      other: []
    };
    
    files.forEach(file => {
      const category = categorizeFile(file);
      categorizedFiles[category].push(file);
    });
    
    // Create output
    let output = '# RadOrderPad Codebase Extraction\n\n';
    output += `Extraction Date: ${new Date().toISOString()}\n\n`;
    output += `Total Files: ${files.length}\n`;
    output += `Backend Files: ${categorizedFiles.backend.length}\n`;
    output += `Frontend Files: ${categorizedFiles.frontend.length}\n`;
    output += `Config Files: ${categorizedFiles.config.length}\n`;
    output += `Documentation Files: ${categorizedFiles.docs.length}\n`;
    output += `Other Files: ${categorizedFiles.other.length}\n\n`;
    
    // Process each category
    for (const [category, categoryFiles] of Object.entries(categorizedFiles)) {
      if (categoryFiles.length === 0) continue;
      
      output += `## ${category.toUpperCase()} FILES\n\n`;
      
      // Sort files by path
      categoryFiles.sort();
      
      // Process each file
      for (const file of categoryFiles) {
        const relativePath = path.relative(process.cwd(), file);
        const content = await readFile(file, 'utf8');
        
        output += `### ${relativePath}\n\n`;
        output += '```' + path.extname(file).substring(1) + '\n';
        output += content;
        output += '\n```\n\n';
      }
    }
    
    // Write output to file
    const outputFile = 'codebase-extraction.md';
    await writeFile(outputFile, output);
    
    console.log(`Codebase extraction complete. Output written to ${outputFile}`);
    return outputFile;
  } catch (err) {
    console.error('Error extracting codebase:', err);
    throw err;
  }
}

// Run the extraction
extractCodebase()
  .then(outputFile => {
    console.log(`Successfully extracted codebase to ${outputFile}`);
  })
  .catch(err => {
    console.error('Failed to extract codebase:', err);
    process.exit(1);
  });