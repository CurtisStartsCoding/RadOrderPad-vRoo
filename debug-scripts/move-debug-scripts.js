/**
 * Script to move debug scripts to the debug-scripts folder
 */
const fs = require('fs');
const path = require('path');

// List of files to move
const filesToMove = [
  'activate-lean-template.js',
  'audit-normalization.js',
  'check-all-prompts.js',
  'check-specialty-table.js',
  'debug-normalization-fixed.js',
  'debug-normalization.js',
  'get-lean-template.js'
];

// Move files
console.log('Moving debug scripts to debug-scripts folder...');

filesToMove.forEach(file => {
  const sourcePath = path.join(__dirname, '..', file);
  const destPath = path.join(__dirname, file);
  
  // Check if source file exists
  if (fs.existsSync(sourcePath)) {
    try {
      // Read the file content
      const content = fs.readFileSync(sourcePath, 'utf8');
      
      // Write the content to the destination
      fs.writeFileSync(destPath, content);
      
      // Delete the source file
      fs.unlinkSync(sourcePath);
      
      console.log(`Moved ${file} to debug-scripts folder`);
    } catch (error) {
      console.error(`Error moving ${file}:`, error.message);
    }
  } else {
    console.log(`File ${file} not found in root directory`);
  }
});

// Also move the normalization audit report
const reportFile = 'normalization-audit-report.md';
const reportSourcePath = path.join(__dirname, '..', reportFile);
const reportDestPath = path.join(__dirname, reportFile);

if (fs.existsSync(reportSourcePath)) {
  try {
    const content = fs.readFileSync(reportSourcePath, 'utf8');
    fs.writeFileSync(reportDestPath, content);
    fs.unlinkSync(reportSourcePath);
    console.log(`Moved ${reportFile} to debug-scripts folder`);
  } catch (error) {
    console.error(`Error moving ${reportFile}:`, error.message);
  }
}

console.log('All debug scripts moved successfully!');