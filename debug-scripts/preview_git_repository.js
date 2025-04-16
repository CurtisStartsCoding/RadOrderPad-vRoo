/**
 * Script to preview what files will be included in the Git repository
 * This helps visualize what will be included/excluded based on .gitignore
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to execute shell commands and return output
function runCommand(command) {
  try {
    return execSync(command, { encoding: 'utf8' });
  } catch (error) {
    console.error(`Error executing command: ${error.message}`);
    return '';
  }
}

// Check if Git is initialized
function isGitInitialized() {
  try {
    execSync('git rev-parse --is-inside-work-tree', { encoding: 'utf8' });
    return true;
  } catch (error) {
    return false;
  }
}

// Get files that would be included in Git
function getIncludedFiles() {
  if (!isGitInitialized()) {
    console.log('Git is not initialized. Initializing temporary Git repository...');
    runCommand('git init --quiet');
    const files = runCommand('git add -n . && git ls-files --stage').split('\n').filter(Boolean);
    runCommand('rm -rf .git');
    return files;
  } else {
    return runCommand('git add -n . && git ls-files --stage').split('\n').filter(Boolean);
  }
}

// Get files that would be excluded by .gitignore
function getExcludedFiles() {
  if (!isGitInitialized()) {
    console.log('Git is not initialized. Initializing temporary Git repository...');
    runCommand('git init --quiet');
    const files = runCommand('git status --ignored -s').split('\n')
      .filter(line => line.startsWith('!!'))
      .map(line => line.substring(3));
    runCommand('rm -rf .git');
    return files;
  } else {
    return runCommand('git status --ignored -s').split('\n')
      .filter(line => line.startsWith('!!'))
      .map(line => line.substring(3));
  }
}

// Group files by directory
function groupFilesByDirectory(files) {
  const groups = {};
  
  files.forEach(file => {
    // Extract the file path without the Git staging info
    const filePath = file.split('\t').pop();
    
    // Get the top-level directory
    const parts = filePath.split('/');
    const topDir = parts[0];
    
    if (!groups[topDir]) {
      groups[topDir] = [];
    }
    
    groups[topDir].push(filePath);
  });
  
  return groups;
}

// Count files by extension
function countFilesByExtension(files) {
  const counts = {};
  
  files.forEach(file => {
    // Extract the file path without the Git staging info
    const filePath = file.split('\t').pop();
    
    // Get the file extension
    const ext = path.extname(filePath).toLowerCase() || '(no extension)';
    
    if (!counts[ext]) {
      counts[ext] = 0;
    }
    
    counts[ext]++;
  });
  
  return counts;
}

// Main function
function previewGitRepository() {
  console.log('=== Git Repository Preview ===\n');
  
  // Check if .gitignore exists
  if (!fs.existsSync('.gitignore')) {
    console.log('No .gitignore file found. All files would be included in the repository.');
    return;
  }
  
  console.log('Using .gitignore configuration:\n');
  const gitignore = fs.readFileSync('.gitignore', 'utf8');
  console.log(gitignore);
  
  // Get included and excluded files
  console.log('\n=== Files that WOULD be included in the repository ===\n');
  const includedFiles = getIncludedFiles();
  
  if (includedFiles.length === 0) {
    console.log('No files would be included in the repository.');
  } else {
    // Group by directory
    const includedGroups = groupFilesByDirectory(includedFiles);
    
    // Print summary by directory
    console.log('Summary by directory:');
    Object.keys(includedGroups).sort().forEach(dir => {
      console.log(`- ${dir}: ${includedGroups[dir].length} files`);
    });
    
    // Count by extension
    const includedExtCounts = countFilesByExtension(includedFiles);
    
    console.log('\nSummary by file extension:');
    Object.keys(includedExtCounts).sort().forEach(ext => {
      console.log(`- ${ext}: ${includedExtCounts[ext]} files`);
    });
    
    console.log(`\nTotal files to be included: ${includedFiles.length}`);
    
    // Print first 20 files as examples
    console.log('\nExample files (first 20):');
    includedFiles.slice(0, 20).forEach(file => {
      const filePath = file.split('\t').pop();
      console.log(`- ${filePath}`);
    });
    
    if (includedFiles.length > 20) {
      console.log(`... and ${includedFiles.length - 20} more files`);
    }
  }
  
  // Get excluded files
  console.log('\n=== Files that would be EXCLUDED from the repository ===\n');
  const excludedFiles = getExcludedFiles();
  
  if (excludedFiles.length === 0) {
    console.log('No files would be excluded from the repository.');
  } else {
    // Group by directory
    const excludedGroups = groupFilesByDirectory(excludedFiles);
    
    // Print summary by directory
    console.log('Summary by directory:');
    Object.keys(excludedGroups).sort().forEach(dir => {
      console.log(`- ${dir}: ${excludedGroups[dir].length} files`);
    });
    
    // Count by extension
    const excludedExtCounts = countFilesByExtension(excludedFiles);
    
    console.log('\nSummary by file extension:');
    Object.keys(excludedExtCounts).sort().forEach(ext => {
      console.log(`- ${ext}: ${excludedExtCounts[ext]} files`);
    });
    
    console.log(`\nTotal files to be excluded: ${excludedFiles.length}`);
    
    // Print first 20 files as examples
    console.log('\nExample excluded files (first 20):');
    excludedFiles.slice(0, 20).forEach(file => {
      console.log(`- ${file}`);
    });
    
    if (excludedFiles.length > 20) {
      console.log(`... and ${excludedFiles.length - 20} more files`);
    }
  }
  
  console.log('\n=== Recommendations ===\n');
  console.log('1. Review the list of included and excluded files to ensure it matches your expectations.');
  console.log('2. If you see files that should be excluded but aren\'t, update your .gitignore file.');
  console.log('3. If you see files that should be included but are excluded, check your .gitignore rules.');
  console.log('4. For more details, see Docs/git_inclusion_exclusion_details.md');
  
  console.log('\nFor a detailed explanation of what is included and excluded, see:');
  console.log('Docs/git_inclusion_exclusion_details.md');
}

// Run the function
previewGitRepository();