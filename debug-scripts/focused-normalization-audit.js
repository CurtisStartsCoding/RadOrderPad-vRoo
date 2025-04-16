/**
 * Script to perform a focused audit of normalization-related issues in the codebase
 * Excludes specified directories and focuses on actual code files
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const rootDir = process.cwd();
const outputFile = path.join(rootDir, 'debug-scripts', 'focused-normalization-audit-report.md');

// Patterns to search for
const patterns = [
  // Field name variations - more focused
  { name: 'Field Name Variations', pattern: '(diagnosisCodes|suggestedICD10Codes|procedureCodes|suggestedCPTCodes)' },
  
  // Normalization functions
  { name: 'Normalization Functions', pattern: '(normalize|normalizeResponseFields|normalizeCodeArray)' },
  
  // isPrimary flag handling
  { name: 'isPrimary Flag Handling', pattern: 'isPrimary' },
  
  // Strict comparison
  { name: 'Strict Comparison', pattern: '===\\s*true' },
  
  // Field mapping
  { name: 'Field Mapping', pattern: 'fieldMap' }
];

// File extensions to search
const extensions = ['.ts', '.js', '.tsx', '.jsx'];

// Directories to include
const includeDirs = [
  'src',
  'tests',
  'Docs/implementation'
];

/**
 * Find all files with specified extensions in the included directories
 */
function findFiles(extensions) {
  const results = [];
  
  // Process each include directory
  for (const includeDir of includeDirs) {
    const fullPath = path.join(rootDir, includeDir);
    
    // Check if directory exists
    if (!fs.existsSync(fullPath)) {
      console.log(`Directory not found: ${fullPath}`);
      continue;
    }
    
    // Find files recursively
    findFilesRecursive(fullPath, extensions, results);
  }
  
  return results;
}

/**
 * Recursively find files in a directory
 */
function findFilesRecursive(dir, extensions, results = []) {
  try {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      
      try {
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          findFilesRecursive(filePath, extensions, results);
        } else if (extensions.includes(path.extname(file))) {
          results.push(filePath);
        }
      } catch (error) {
        console.error(`Error accessing ${filePath}:`, error.message);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
  
  return results;
}

/**
 * Search for pattern in file
 */
function searchInFile(filePath, pattern) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const regex = new RegExp(pattern, 'g');
    const matches = content.match(regex);
    
    if (matches) {
      return {
        filePath,
        matches: matches.length,
        uniqueMatches: [...new Set(matches)],
        lines: getMatchingLines(content, regex, filePath)
      };
    }
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
  }
  
  return null;
}

/**
 * Get matching lines with context
 */
function getMatchingLines(content, regex, filePath) {
  const lines = content.split('\n');
  const matchingLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    if (regex.test(lines[i])) {
      // Reset regex lastIndex
      regex.lastIndex = 0;
      
      // Get context (1 line before and after)
      const startLine = Math.max(0, i - 1);
      const endLine = Math.min(lines.length - 1, i + 1);
      
      // Add matching line with context
      matchingLines.push({
        lineNumber: i + 1,
        context: lines.slice(startLine, endLine + 1).map((line, index) => {
          return `${startLine + index + 1}: ${line}`;
        }).join('\n')
      });
    }
  }
  
  return matchingLines;
}

/**
 * Generate report
 */
function generateReport(results, filesByDirectory) {
  let report = '# Focused Normalization Audit Report\n\n';
  report += `Generated on: ${new Date().toLocaleString()}\n\n`;
  
  // Summary
  report += '## Summary\n\n';
  
  const totalFiles = Object.values(results).reduce((sum, result) => sum + result.files.length, 0);
  const totalMatches = Object.values(results).reduce((sum, result) => sum + result.totalMatches, 0);
  const uniqueFiles = new Set();
  
  Object.values(results).forEach(result => {
    result.files.forEach(file => uniqueFiles.add(file.filePath));
  });
  
  report += `- Total unique files affected: ${uniqueFiles.size}\n`;
  report += `- Total pattern matches found: ${totalMatches}\n\n`;
  
  // Directory breakdown
  report += '## Directory Breakdown\n\n';
  
  Object.entries(filesByDirectory).sort((a, b) => b[1].length - a[1].length).forEach(([dir, files]) => {
    const percentage = uniqueFiles.size > 0 ? ((files.length / uniqueFiles.size) * 100).toFixed(1) : 0;
    report += `- **${dir}**: ${files.length} files (${percentage}%)\n`;
  });
  
  report += '\n';
  
  // Results by pattern
  report += '## Results by Pattern\n\n';
  
  for (const [patternName, result] of Object.entries(results)) {
    report += `### ${patternName}\n\n`;
    report += `- Files affected: ${result.files.length}\n`;
    report += `- Total matches: ${result.totalMatches}\n\n`;
    
    if (result.files.length > 0) {
      // Show top affected files
      report += '#### Top Affected Files\n\n';
      
      result.files.sort((a, b) => b.matches - a.matches).slice(0, 10).forEach(file => {
        const relativePath = path.relative(rootDir, file.filePath);
        report += `- **${relativePath}** (${file.matches} matches)\n`;
        
        // Add unique matches
        if (file.uniqueMatches.length > 0) {
          report += '  - Unique matches: `' + file.uniqueMatches.join('`, `') + '`\n';
        }
        
        // Add sample context (limit to 2 for brevity)
        if (file.lines.length > 0) {
          report += '  - Sample context:\n';
          
          for (let i = 0; i < Math.min(2, file.lines.length); i++) {
            report += '    ```\n';
            report += `    ${file.lines[i].context}\n`;
            report += '    ```\n';
          }
          
          if (file.lines.length > 2) {
            report += `    ... and ${file.lines.length - 2} more matches\n`;
          }
        }
      });
      
      report += '\n';
    }
  }
  
  // Impact assessment
  report += '## Impact Assessment\n\n';
  
  if (uniqueFiles.size === 0) {
    report += 'No normalization issues found in the specified directories.\n\n';
  } else {
    report += '### Critical Components\n\n';
    report += '1. **Response Normalization**\n';
    report += '   - Field name mapping in `normalizeResponseFields`\n';
    report += '   - Code array normalization in `normalizeCodeArray`\n';
    report += '   - isPrimary flag handling\n\n';
    
    report += '2. **Template System**\n';
    report += '   - Inconsistent field names in templates\n';
    report += '   - Validation requirements in templates\n\n';
    
    // Recommendations
    report += '## Recommendations\n\n';
    
    report += '### Short-term Fixes\n\n';
    report += '1. **Fix isPrimary Flag Issue**\n';
    report += '   - Update `normalizeCodeArray` to properly preserve the isPrimary flag\n';
    report += '   - Change `isPrimary: item.isPrimary === true` to `isPrimary: Boolean(item.isPrimary)`\n\n';
    
    report += '2. **Update Templates**\n';
    report += '   - Ensure all templates use consistent field names\n';
    report += '   - Update the lean template to use suggestedICD10Codes instead of diagnosisCodes\n\n';
    
    report += '### Long-term Strategy\n\n';
    report += '1. **Standardize Field Names**\n';
    report += '   - Use the `ValidationResult` interface as the standard\n';
    report += '   - Create a style guide for field naming conventions\n\n';
    
    report += '2. **Gradual Normalization Removal**\n';
    report += '   - Start with isolated components\n';
    report += '   - Work inward toward core logic\n';
    report += '   - Implement changes in small, testable increments\n\n';
    
    report += '3. **Comprehensive Testing**\n';
    report += '   - Create tests that verify field name consistency\n';
    report += '   - Ensure tests cover the entire validation pipeline\n\n';
  }
  
  return report;
}

/**
 * Main function
 */
async function main() {
  console.log('Starting focused normalization audit...');
  console.log(`Including only directories: ${includeDirs.join(', ')}`);
  
  // Find all files
  console.log('Finding files...');
  const files = findFiles(extensions);
  console.log(`Found ${files.length} files to scan`);
  
  // Group files by directory
  const filesByDirectory = {};
  
  files.forEach(filePath => {
    const relativePath = path.relative(rootDir, filePath);
    const dir = path.dirname(relativePath);
    
    if (!filesByDirectory[dir]) {
      filesByDirectory[dir] = [];
    }
    
    filesByDirectory[dir].push(filePath);
  });
  
  // Search for patterns
  console.log('Searching for patterns...');
  const results = {};
  
  for (const { name, pattern } of patterns) {
    console.log(`Searching for pattern: ${name}`);
    results[name] = { files: [], totalMatches: 0 };
    
    for (const filePath of files) {
      const result = searchInFile(filePath, pattern);
      
      if (result) {
        results[name].files.push(result);
        results[name].totalMatches += result.matches;
      }
    }
    
    console.log(`Found ${results[name].totalMatches} matches in ${results[name].files.length} files`);
  }
  
  // Generate report
  console.log('Generating report...');
  const report = generateReport(results, filesByDirectory);
  
  // Write report to file
  fs.writeFileSync(outputFile, report);
  console.log(`Report written to ${outputFile}`);
  
  console.log('Focused audit complete!');
}

// Run the main function
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});