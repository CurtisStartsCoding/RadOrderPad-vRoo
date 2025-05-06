/**
 * Script to modify the parallel-prompt-comparison-test.js file
 * to use the hemochromatosis database context
 */
const fs = require('fs');
const path = require('path');

// Paths
const sourceFile = path.join(__dirname, 'parallel-prompt-comparison-test.js');
const targetFile = path.join(__dirname, 'parallel-prompt-comparison-test-modified.js');
const contextFile = path.join(__dirname, 'redis-context', 'hemochromatosis-context.txt');

// Read the source file
console.log(`Reading source file: ${sourceFile}`);
const sourceCode = fs.readFileSync(sourceFile, 'utf8');

// Read the database context
console.log(`Reading database context: ${contextFile}`);
const databaseContext = fs.readFileSync(contextFile, 'utf8');

// Modify the source code
console.log('Modifying source code...');

// Replace the OLD_DATABASE_CONTEXT with the new database context
const oldDatabaseContextRegex = /const OLD_DATABASE_CONTEXT = `([\s\S]*?)`;/;
const modifiedCode = sourceCode.replace(
  oldDatabaseContextRegex,
  `const OLD_DATABASE_CONTEXT = \`${databaseContext}\`;`
);

// Write the modified code to the target file
console.log(`Writing modified code to: ${targetFile}`);
fs.writeFileSync(targetFile, modifiedCode);

console.log('Modification completed successfully!');