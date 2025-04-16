/**
 * Script to perform a thorough audit of normalization-related issues across the entire codebase
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const rootDir = process.cwd();
const outputFile = path.join(rootDir, 'debug-scripts', 'thorough-normalization-audit-report.md');

// Patterns to search for
const patterns = [
  // Field name variations - more comprehensive
  { name: 'Field Name Variations', pattern: '(diagnosisCodes|suggestedICD10Codes|icd10_codes|icd10codes|icd10|icd_10_codes|procedureCodes|suggestedCPTCodes|cpt_codes|cptcodes|cpt|validationStatus|validation_status|status|complianceScore|compliance_score|score|feedback|feedback_text|feedbacktext|message|internalReasoning|internal_reasoning|reasoning|rationale)' },
  
  // Normalization functions - more comprehensive
  { name: 'Normalization Functions', pattern: '(normalize|normalizeResponseFields|normalizeCodeArray|normalizedResponse|normalizedFields|normalizedKey|normalizedStatus|normalizedICD10Codes|normalizedCPTCodes)' },
  
  // JSON structure handling
  { name: 'JSON Structure Handling', pattern: '(JSON\\.parse|JSON\\.stringify|jsonContent|jsonBlockMatch|jsonObjectMatch)' },
  
  // Field mapping and transformation
  { name: 'Field Mapping and Transformation', pattern: '(fieldMap|statusMap|map\\(|Object\\.entries|toLowerCase\\(|toUpperCase\\(|trim\\(|split\\(|join\\()' },
  
  // Validation and verification
  { name: 'Validation and Verification', pattern: '(validate|validateRequiredFields|validateValidationStatus|verification|verify|check|test\\()' },
  
  // Database field access
  { name: 'Database Field Access', pattern: '(SELECT.*FROM|INSERT INTO|UPDATE.*SET|\\$\\d+|\\?|final_icd10_codes|final_cpt_code|generated_icd10_codes|generated_cpt_codes)' },
  
  // Response processing
  { name: 'Response Processing', pattern: '(processLLMResponse|extractPartialInformation|response\\.|result\\.)' },
  
  // isPrimary flag handling
  { name: 'isPrimary Flag Handling', pattern: '(isPrimary|is_primary|primary|===\\s*true|==\\s*true|Boolean\\()' },
  
  // Template handling
  { name: 'Template Handling', pattern: '(template|\\{\\{.*\\}\\}|prompt)' }
];

// File extensions to search
const extensions = ['.ts', '.js', '.tsx', '.jsx', '.json', '.md', '.sql'];

// Directories to exclude
const excludeDirs = ['node_modules', '.git', 'dist', 'debug-scripts'];

/**
 * Find all files with specified extensions
 */
function findFiles(dir, extensions, excludeDirs, results = []) {
  if (excludeDirs.some(excludeDir => dir.includes(path.sep + excludeDir))) {
    return results;
  }
  
  try {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      
      try {
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          findFiles(filePath, extensions, excludeDirs, results);
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
      
      // Get context (2 lines before and after)
      const startLine = Math.max(0, i - 2);
      const endLine = Math.min(lines.length - 1, i + 2);
      
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
  let report = '# Thorough Normalization Audit Report\n\n';
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
    const percentage = ((files.length / uniqueFiles.size) * 100).toFixed(1);
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
      // Group files by directory
      const filesByDir = {};
      
      result.files.forEach(file => {
        const relativePath = path.relative(rootDir, file.filePath);
        const dir = path.dirname(relativePath);
        
        if (!filesByDir[dir]) {
          filesByDir[dir] = [];
        }
        
        filesByDir[dir].push(file);
      });
      
      // Show directory breakdown
      report += '#### Directory Breakdown\n\n';
      
      Object.entries(filesByDir).sort((a, b) => b[1].length - a[1].length).forEach(([dir, files]) => {
        const percentage = ((files.length / result.files.length) * 100).toFixed(1);
        report += `- **${dir}**: ${files.length} files (${percentage}%)\n`;
      });
      
      report += '\n';
      
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
  
  report += '### Critical Components\n\n';
  report += '1. **Response Normalization**\n';
  report += '   - Field name mapping in `normalizeResponseFields`\n';
  report += '   - Code array normalization in `normalizeCodeArray`\n';
  report += '   - isPrimary flag handling\n\n';
  
  report += '2. **Database Interaction**\n';
  report += '   - Field name mismatches between database and application\n';
  report += '   - Inconsistent field naming in queries\n\n';
  
  report += '3. **Template System**\n';
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
  
  return report;
}

/**
 * Main function
 */
async function main() {
  console.log('Starting thorough normalization audit...');
  
  // Find all files
  console.log('Finding files...');
  const files = findFiles(rootDir, extensions, excludeDirs);
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
  
  console.log('Thorough audit complete!');
}

// Run the main function
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});