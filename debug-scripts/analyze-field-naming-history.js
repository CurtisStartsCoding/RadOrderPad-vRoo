/**
 * Script to analyze the history of field naming conventions in the codebase
 * This will help determine when inconsistencies began to appear
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const rootDir = process.cwd();
const outputFile = path.join(rootDir, 'debug-scripts', 'field-naming-history-report.md');

// Field name variations to search for
const fieldVariations = [
  // ICD-10 Code field variations
  { category: 'ICD-10 Codes', patterns: [
    'suggestedICD10Codes',
    'diagnosisCodes',
    'icd10_codes',
    'icd10codes',
    'icd10',
    'icd_10_codes'
  ]},
  
  // CPT Code field variations
  { category: 'CPT Codes', patterns: [
    'suggestedCPTCodes',
    'procedureCodes',
    'cpt_codes',
    'cptcodes',
    'cpt'
  ]},
  
  // Validation Status field variations
  { category: 'Validation Status', patterns: [
    'validationStatus',
    'validation_status',
    'status'
  ]},
  
  // Compliance Score field variations
  { category: 'Compliance Score', patterns: [
    'complianceScore',
    'compliance_score',
    'score'
  ]},
  
  // Feedback field variations
  { category: 'Feedback', patterns: [
    'feedback',
    'feedback_text',
    'feedbacktext',
    'message'
  ]},
  
  // Internal Reasoning field variations
  { category: 'Internal Reasoning', patterns: [
    'internalReasoning',
    'internal_reasoning',
    'reasoning',
    'rationale'
  ]}
];

// Directories to include
const includeDirs = [
  'src',
  'tests',
  'Docs/implementation'
];

// File extensions to search
const extensions = ['.ts', '.js', '.tsx', '.jsx'];

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
        
        if (stat.isDirectory() && !file.startsWith('node_modules') && !file.startsWith('.git')) {
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
 * Get file modification history using git
 */
function getFileHistory(filePath) {
  try {
    const relativePath = path.relative(rootDir, filePath);
    const gitLog = execSync(`git log --follow --format="%ad|%h|%s" --date=short -- "${relativePath}"`, { encoding: 'utf8' });
    
    return gitLog.split('\n')
      .filter(line => line.trim() !== '')
      .map(line => {
        const [date, hash, ...messageParts] = line.split('|');
        return {
          date,
          hash,
          message: messageParts.join('|')
        };
      });
  } catch (error) {
    console.error(`Error getting history for ${filePath}:`, error.message);
    return [];
  }
}

/**
 * Search for pattern in file content at a specific git commit
 */
function searchInFileAtCommit(filePath, pattern, commitHash) {
  try {
    const relativePath = path.relative(rootDir, filePath);
    const fileContent = execSync(`git show ${commitHash}:"${relativePath}"`, { encoding: 'utf8' });
    
    const regex = new RegExp(pattern, 'g');
    const matches = fileContent.match(regex);
    
    return matches ? matches.length : 0;
  } catch (error) {
    // File might not exist at this commit
    return 0;
  }
}

/**
 * Analyze field naming history
 */
async function analyzeFieldNamingHistory() {
  console.log('Starting field naming history analysis...');
  
  // Find all files
  console.log('Finding files...');
  const files = findFiles(extensions);
  console.log(`Found ${files.length} files to analyze`);
  
  // Results by field category
  const results = {};
  
  // Initialize results
  fieldVariations.forEach(({ category }) => {
    results[category] = {
      patterns: {},
      timeline: {}
    };
  });
  
  // Process each file
  for (const filePath of files) {
    const relativePath = path.relative(rootDir, filePath);
    console.log(`Analyzing ${relativePath}...`);
    
    // Get file history
    const history = getFileHistory(filePath);
    
    if (history.length === 0) {
      console.log(`No git history found for ${relativePath}`);
      continue;
    }
    
    // Analyze each commit
    for (const { date, hash } of history) {
      // Check each field variation
      for (const { category, patterns } of fieldVariations) {
        for (const pattern of patterns) {
          const matches = searchInFileAtCommit(filePath, pattern, hash);
          
          if (matches > 0) {
            // Initialize pattern if not exists
            if (!results[category].patterns[pattern]) {
              results[category].patterns[pattern] = {
                files: new Set(),
                firstSeen: date,
                occurrences: 0
              };
            }
            
            // Update pattern stats
            results[category].patterns[pattern].files.add(relativePath);
            results[category].patterns[pattern].occurrences += matches;
            
            // Update first seen date if earlier
            if (date < results[category].patterns[pattern].firstSeen) {
              results[category].patterns[pattern].firstSeen = date;
            }
            
            // Update timeline
            if (!results[category].timeline[date]) {
              results[category].timeline[date] = {};
            }
            
            if (!results[category].timeline[date][pattern]) {
              results[category].timeline[date][pattern] = 0;
            }
            
            results[category].timeline[date][pattern] += matches;
          }
        }
      }
    }
  }
  
  return results;
}

/**
 * Generate report
 */
function generateReport(results) {
  let report = '# Field Naming History Analysis\n\n';
  report += `Generated on: ${new Date().toLocaleString()}\n\n`;
  
  // Summary
  report += '## Summary\n\n';
  report += 'This report analyzes when different field naming conventions appeared in the codebase.\n\n';
  
  // Results by field category
  for (const [category, result] of Object.entries(results)) {
    report += `## ${category}\n\n`;
    
    // First appearance of each pattern
    report += '### First Appearance\n\n';
    report += '| Pattern | First Seen | Files | Occurrences |\n';
    report += '|---------|------------|-------|-------------|\n';
    
    Object.entries(result.patterns)
      .sort((a, b) => a[1].firstSeen.localeCompare(b[1].firstSeen))
      .forEach(([pattern, stats]) => {
        report += `| \`${pattern}\` | ${stats.firstSeen} | ${stats.files.size} | ${stats.occurrences} |\n`;
      });
    
    report += '\n';
    
    // Timeline
    report += '### Timeline\n\n';
    
    const sortedDates = Object.keys(result.timeline).sort();
    
    for (const date of sortedDates) {
      report += `#### ${date}\n\n`;
      
      Object.entries(result.timeline[date])
        .sort((a, b) => b[1] - a[1])
        .forEach(([pattern, count]) => {
          report += `- \`${pattern}\`: ${count} occurrences\n`;
        });
      
      report += '\n';
    }
  }
  
  // Conclusion
  report += '## Conclusion\n\n';
  report += 'Based on the analysis above, we can determine when field naming inconsistencies began to appear in the codebase.\n\n';
  
  // Find the earliest date for each category
  const earliestDates = {};
  
  for (const [category, result] of Object.entries(results)) {
    const patterns = Object.values(result.patterns);
    
    if (patterns.length > 0) {
      earliestDates[category] = patterns.reduce((earliest, pattern) => {
        return pattern.firstSeen < earliest ? pattern.firstSeen : earliest;
      }, patterns[0].firstSeen);
    }
  }
  
  // Add earliest dates to conclusion
  report += '### Earliest Appearance by Category\n\n';
  
  Object.entries(earliestDates)
    .sort((a, b) => a[1].localeCompare(b[1]))
    .forEach(([category, date]) => {
      report += `- **${category}**: ${date}\n`;
    });
  
  return report;
}

/**
 * Main function
 */
async function main() {
  try {
    // Analyze field naming history
    const results = await analyzeFieldNamingHistory();
    
    // Generate report
    console.log('Generating report...');
    const report = generateReport(results);
    
    // Write report to file
    fs.writeFileSync(outputFile, report);
    console.log(`Report written to ${outputFile}`);
    
    console.log('Analysis complete!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the main function
main();