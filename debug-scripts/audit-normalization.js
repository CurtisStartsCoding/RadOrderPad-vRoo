/**
 * Script to audit the codebase for normalization-related issues
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const rootDir = process.cwd();
const outputFile = path.join(rootDir, 'normalization-audit-report.md');
const srcDir = path.join(rootDir, 'src');

// Patterns to search for
const patterns = [
  // Field name variations
  { name: 'ICD-10 Code Field Names', pattern: '(diagnosisCodes|suggestedICD10Codes|icd10_codes|icd10codes|icd10|icd_10_codes)' },
  { name: 'CPT Code Field Names', pattern: '(procedureCodes|suggestedCPTCodes|cpt_codes|cptcodes|cpt)' },
  { name: 'Validation Status Field Names', pattern: '(validationStatus|validation_status|status)' },
  { name: 'Compliance Score Field Names', pattern: '(complianceScore|compliance_score|score)' },
  { name: 'Feedback Field Names', pattern: '(feedback|feedback_text|feedbacktext|message)' },
  { name: 'Internal Reasoning Field Names', pattern: '(internalReasoning|internal_reasoning|reasoning|rationale)' },
  
  // Normalization functions
  { name: 'Normalization Functions', pattern: '(normalize|normalizeResponseFields|normalizeCodeArray)' },
  
  // isPrimary flag
  { name: 'isPrimary Flag', pattern: 'isPrimary' },
  
  // Strict comparison
  { name: 'Strict Comparison', pattern: '===\\s*true' },
  
  // Field mapping
  { name: 'Field Mapping', pattern: 'fieldMap' },
  
  // JSON parsing
  { name: 'JSON Parsing', pattern: 'JSON\\.parse' },
  
  // Validation
  { name: 'Validation', pattern: '(validate|validateRequiredFields|validateValidationStatus)' }
];

// File extensions to search
const extensions = ['.ts', '.js', '.tsx', '.jsx', '.json', '.md'];

/**
 * Find all files with specified extensions
 */
function findFiles(dir, extensions, results = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('node_modules') && !file.startsWith('.git')) {
      findFiles(filePath, extensions, results);
    } else if (extensions.includes(path.extname(file))) {
      results.push(filePath);
    }
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
function generateReport(results) {
  let report = '# Normalization Audit Report\n\n';
  report += `Generated on: ${new Date().toLocaleString()}\n\n`;
  
  // Summary
  report += '## Summary\n\n';
  
  const totalFiles = Object.values(results).reduce((sum, result) => sum + result.files.length, 0);
  const totalMatches = Object.values(results).reduce((sum, result) => sum + result.totalMatches, 0);
  
  report += `- Total files scanned: ${totalFiles}\n`;
  report += `- Total matches found: ${totalMatches}\n\n`;
  
  // Results by pattern
  report += '## Results by Pattern\n\n';
  
  for (const [patternName, result] of Object.entries(results)) {
    report += `### ${patternName}\n\n`;
    report += `- Files affected: ${result.files.length}\n`;
    report += `- Total matches: ${result.totalMatches}\n\n`;
    
    if (result.files.length > 0) {
      report += '#### Affected Files\n\n';
      
      for (const file of result.files) {
        const relativePath = path.relative(rootDir, file.filePath);
        report += `- **${relativePath}** (${file.matches} matches)\n`;
        
        // Add unique matches
        if (file.uniqueMatches.length > 0) {
          report += '  - Unique matches: `' + file.uniqueMatches.join('`, `') + '`\n';
        }
        
        // Add sample context (limit to 3 for brevity)
        if (file.lines.length > 0) {
          report += '  - Sample context:\n';
          
          for (let i = 0; i < Math.min(3, file.lines.length); i++) {
            report += '    ```\n';
            report += `    ${file.lines[i].context}\n`;
            report += '    ```\n';
          }
          
          if (file.lines.length > 3) {
            report += `    ... and ${file.lines.length - 3} more matches\n`;
          }
        }
      }
      
      report += '\n';
    }
  }
  
  // Recommendations
  report += '## Recommendations\n\n';
  report += '1. **Standardize Field Names**\n';
  report += '   - Use the `ValidationResult` interface as the standard (suggestedICD10Codes, suggestedCPTCodes)\n';
  report += '   - Update all templates to use these standard field names\n\n';
  
  report += '2. **Fix isPrimary Flag Issues**\n';
  report += '   - Update the normalizeCodeArray function to properly preserve the isPrimary flag\n';
  report += '   - Fix: Change `isPrimary: item.isPrimary === true` to `isPrimary: Boolean(item.isPrimary)`\n\n';
  
  report += '3. **Gradual Normalization Removal**\n';
  report += '   - Start with isolated components\n';
  report += '   - Work inward toward core logic\n';
  report += '   - Implement changes in small, testable increments\n\n';
  
  return report;
}

/**
 * Main function
 */
async function main() {
  console.log('Starting normalization audit...');
  
  // Find all files
  console.log('Finding files...');
  const files = findFiles(srcDir, extensions);
  console.log(`Found ${files.length} files to scan`);
  
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
  const report = generateReport(results);
  
  // Write report to file
  fs.writeFileSync(outputFile, report);
  console.log(`Report written to ${outputFile}`);
  
  // Open the report
  console.log('Opening report...');
  try {
    if (process.platform === 'win32') {
      execSync(`start ${outputFile}`);
    } else if (process.platform === 'darwin') {
      execSync(`open ${outputFile}`);
    } else {
      execSync(`xdg-open ${outputFile}`);
    }
  } catch (error) {
    console.error('Error opening report:', error.message);
  }
  
  console.log('Audit complete!');
}

// Run the main function
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});