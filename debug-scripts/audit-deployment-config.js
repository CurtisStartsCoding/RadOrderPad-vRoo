/**
 * Deployment Configuration Audit Script
 * 
 * This script scans the codebase for potential deployment issues:
 * - Hardcoded URLs, hostnames, and ports
 * - Environment variable usage
 * - Configuration patterns that might cause issues in production
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const SEARCH_PATTERNS = [
  { pattern: 'localhost', description: 'Localhost reference' },
  { pattern: '127.0.0.1', description: 'Localhost IP reference' },
  { pattern: 'http://', description: 'HTTP URL (non-secure)' },
  { pattern: '3000', description: 'Port 3000 reference' },
  { pattern: 'process.env', description: 'Environment variable usage' },
  { pattern: 'API_BASE_URL', description: 'API base URL reference' },
  { pattern: 'DATABASE_URL', description: 'Database URL reference' },
  { pattern: 'REDIS_', description: 'Redis configuration reference' },
  { pattern: 'JWT_', description: 'JWT configuration reference' },
  { pattern: 'AWS_', description: 'AWS configuration reference' },
  { pattern: 'STRIPE_', description: 'Stripe configuration reference' }
];

// Directories to exclude from search
const EXCLUDE_DIRS = [
  'node_modules',
  'dist',
  '.git',
  'test-results'
];

// File extensions to search
const INCLUDE_EXTENSIONS = [
  '.js',
  '.ts',
  '.json',
  '.bat',
  '.sh'
];

// Results storage
const results = {
  byPattern: {},
  byFile: {},
  summary: {
    totalFiles: 0,
    totalMatches: 0,
    filesWithMatches: 0
  }
};

/**
 * Check if a file should be included in the search
 */
function shouldIncludeFile(filePath) {
  // Check if file is in excluded directory
  if (EXCLUDE_DIRS.some(dir => filePath.includes(`/${dir}/`) || filePath.includes(`\\${dir}\\`))) {
    return false;
  }
  
  // Check file extension
  const ext = path.extname(filePath).toLowerCase();
  return INCLUDE_EXTENSIONS.includes(ext);
}

/**
 * Search for a pattern in a file
 */
function searchInFile(filePath, pattern) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const matches = [];
    
    lines.forEach((line, index) => {
      if (line.includes(pattern)) {
        matches.push({
          line: index + 1,
          content: line.trim(),
          context: line.trim()
        });
      }
    });
    
    return matches;
  } catch (error) {
    console.error(`Error reading file ${filePath}: ${error.message}`);
    return [];
  }
}

/**
 * Walk through directory recursively
 */
function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !EXCLUDE_DIRS.includes(file)) {
      walkDir(filePath, callback);
    } else if (stat.isFile() && shouldIncludeFile(filePath)) {
      callback(filePath);
    }
  });
}

/**
 * Format results as markdown
 */
function formatResultsAsMarkdown() {
  let markdown = '# Deployment Configuration Audit Report\n\n';
  
  markdown += `## Summary\n\n`;
  markdown += `- Total files scanned: ${results.summary.totalFiles}\n`;
  markdown += `- Files with matches: ${results.summary.filesWithMatches}\n`;
  markdown += `- Total matches found: ${results.summary.totalMatches}\n\n`;
  
  markdown += `## Results by Pattern\n\n`;
  
  Object.keys(results.byPattern).forEach(pattern => {
    const patternResults = results.byPattern[pattern];
    markdown += `### ${patternResults.description} (${patternResults.matches.length} matches)\n\n`;
    
    if (patternResults.matches.length > 0) {
      markdown += `| File | Line | Content |\n`;
      markdown += `| ---- | ---- | ------- |\n`;
      
      patternResults.matches.forEach(match => {
        markdown += `| ${match.file} | ${match.line} | \`${match.content.replace(/\|/g, '\\|')}\` |\n`;
      });
      
      markdown += '\n';
    } else {
      markdown += `No matches found.\n\n`;
    }
  });
  
  markdown += `## Results by File\n\n`;
  
  Object.keys(results.byFile).sort().forEach(file => {
    const fileResults = results.byFile[file];
    markdown += `### ${file} (${fileResults.matches.length} matches)\n\n`;
    
    if (fileResults.matches.length > 0) {
      markdown += `| Pattern | Line | Content |\n`;
      markdown += `| ------- | ---- | ------- |\n`;
      
      fileResults.matches.forEach(match => {
        markdown += `| ${match.pattern} | ${match.line} | \`${match.content.replace(/\|/g, '\\|')}\` |\n`;
      });
      
      markdown += '\n';
    }
  });
  
  markdown += `## Recommendations\n\n`;
  markdown += `Based on the audit results, consider the following recommendations:\n\n`;
  
  // Add recommendations based on findings
  if (results.byPattern['localhost']?.matches.length > 0 || 
      results.byPattern['127.0.0.1']?.matches.length > 0) {
    markdown += `- **Replace hardcoded localhost references** with environment variables or configuration settings\n`;
  }
  
  if (results.byPattern['http://']?.matches.length > 0) {
    markdown += `- **Use HTTPS instead of HTTP** for production environments\n`;
  }
  
  if (results.byPattern['3000']?.matches.length > 0) {
    markdown += `- **Replace hardcoded port references** with environment variables\n`;
  }
  
  markdown += `- **Ensure all environment variables** are properly set in the Elastic Beanstalk environment\n`;
  markdown += `- **Create a centralized configuration module** to manage environment-specific settings\n`;
  
  return markdown;
}

/**
 * Main function
 */
function main() {
  const rootDir = path.resolve(__dirname, '..');
  console.log(`Scanning directory: ${rootDir}`);
  
  // Initialize results for each pattern
  SEARCH_PATTERNS.forEach(({ pattern, description }) => {
    results.byPattern[pattern] = {
      description,
      matches: []
    };
  });
  
  // Walk through directories and search for patterns
  walkDir(rootDir, (filePath) => {
    results.summary.totalFiles++;
    const relativePath = path.relative(rootDir, filePath);
    let fileHasMatches = false;
    
    SEARCH_PATTERNS.forEach(({ pattern }) => {
      const matches = searchInFile(filePath, pattern);
      
      if (matches.length > 0) {
        fileHasMatches = true;
        results.summary.totalMatches += matches.length;
        
        // Add to pattern results
        matches.forEach(match => {
          results.byPattern[pattern].matches.push({
            file: relativePath,
            ...match
          });
        });
        
        // Add to file results
        if (!results.byFile[relativePath]) {
          results.byFile[relativePath] = {
            matches: []
          };
        }
        
        matches.forEach(match => {
          results.byFile[relativePath].matches.push({
            pattern,
            ...match
          });
        });
      }
    });
    
    if (fileHasMatches) {
      results.summary.filesWithMatches++;
    }
  });
  
  // Generate markdown report
  const markdown = formatResultsAsMarkdown();
  const reportPath = path.join(__dirname, 'deployment-audit-report.md');
  fs.writeFileSync(reportPath, markdown);
  
  console.log(`\nAudit completed!`);
  console.log(`- Total files scanned: ${results.summary.totalFiles}`);
  console.log(`- Files with matches: ${results.summary.filesWithMatches}`);
  console.log(`- Total matches found: ${results.summary.totalMatches}`);
  console.log(`\nReport saved to: ${reportPath}`);
}

// Run the main function
main();