/**
 * Script to examine the full structure of the SQL statements
 * This will help us understand the proper format before attempting any fixes
 */
const fs = require('fs');
const readline = require('readline');

// Source file
const sourceFile = 'Data/medical_tables_export_2025-04-11T23-40-51-963Z.sql';

async function examineFullSqlStructure() {
  console.log(`Examining SQL file: ${sourceFile}`);
  
  // Read the file line by line
  const fileStream = fs.createReadStream(sourceFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  let lineNumber = 0;
  let currentStatement = '';
  let inMappingStatement = false;
  let statementStartLine = 0;
  let mappingStatements = [];
  let completeStatements = 0;
  let incompleteStatements = 0;
  
  // Process each line
  for await (const line of rl) {
    lineNumber++;
    
    // Check if this is the start of a mapping statement
    if (line.startsWith('INSERT INTO medical_cpt_icd10_mappings')) {
      // If we were already in a statement, it means the previous one didn't end properly
      if (inMappingStatement) {
        incompleteStatements++;
        mappingStatements.push({
          startLine: statementStartLine,
          endLine: lineNumber - 1,
          statement: currentStatement,
          complete: false
        });
      }
      
      // Start a new statement
      currentStatement = line;
      inMappingStatement = true;
      statementStartLine = lineNumber;
      
      // If the statement ends on this line
      if (line.endsWith(');')) {
        inMappingStatement = false;
        completeStatements++;
        mappingStatements.push({
          startLine: statementStartLine,
          endLine: lineNumber,
          statement: currentStatement,
          complete: true
        });
        currentStatement = '';
      }
    }
    // If we're in a mapping statement, append this line
    else if (inMappingStatement) {
      currentStatement += '\n' + line;
      
      // If the statement ends on this line
      if (line.endsWith(');')) {
        inMappingStatement = false;
        completeStatements++;
        mappingStatements.push({
          startLine: statementStartLine,
          endLine: lineNumber,
          statement: currentStatement,
          complete: true
        });
        currentStatement = '';
      }
    }
  }
  
  // If we're still in a statement at the end of the file
  if (inMappingStatement) {
    incompleteStatements++;
    mappingStatements.push({
      startLine: statementStartLine,
      endLine: lineNumber,
      statement: currentStatement,
      complete: false
    });
  }
  
  console.log(`\nFound ${mappingStatements.length} mapping statements`);
  console.log(`Complete statements: ${completeStatements}`);
  console.log(`Incomplete statements: ${incompleteStatements}`);
  
  // Analyze a sample of complete statements
  console.log('\n=== ANALYZING COMPLETE STATEMENTS ===');
  const completeSample = mappingStatements.filter(s => s.complete).slice(0, 3);
  
  completeSample.forEach((item, index) => {
    console.log(`\nComplete Statement #${index + 1} (Lines ${item.startLine}-${item.endLine}):`);
    console.log(item.statement);
    
    // Count quotes
    const singleQuotes = (item.statement.match(/'/g) || []).length;
    console.log(`Single quotes count: ${singleQuotes} (${singleQuotes % 2 === 0 ? 'balanced' : 'unbalanced'})`);
  });
  
  // Analyze a sample of incomplete statements
  console.log('\n=== ANALYZING INCOMPLETE STATEMENTS ===');
  const incompleteSample = mappingStatements.filter(s => !s.complete).slice(0, 3);
  
  incompleteSample.forEach((item, index) => {
    console.log(`\nIncomplete Statement #${index + 1} (Lines ${item.startLine}-${item.endLine}):`);
    console.log(item.statement);
    
    // Count quotes
    const singleQuotes = (item.statement.match(/'/g) || []).length;
    console.log(`Single quotes count: ${singleQuotes} (${singleQuotes % 2 === 0 ? 'balanced' : 'unbalanced'})`);
    
    // Check if it contains "when:"
    if (item.statement.includes('when:')) {
      console.log('Contains "when:" which might be causing the issue');
    }
  });
  
  // Look for statements with "when:" that span multiple lines
  console.log('\n=== ANALYZING MULTILINE STATEMENTS WITH "when:" ===');
  const multilineWhenStatements = mappingStatements.filter(s => 
    s.statement.includes('when:') && 
    s.statement.includes('\n') && 
    s.endLine > s.startLine
  ).slice(0, 3);
  
  multilineWhenStatements.forEach((item, index) => {
    console.log(`\nMultiline Statement with "when:" #${index + 1} (Lines ${item.startLine}-${item.endLine}):`);
    console.log(item.statement);
    
    // Count quotes
    const singleQuotes = (item.statement.match(/'/g) || []).length;
    console.log(`Single quotes count: ${singleQuotes} (${singleQuotes % 2 === 0 ? 'balanced' : 'unbalanced'})`);
    
    // Find the line with "when:"
    const lines = item.statement.split('\n');
    const whenLineIndex = lines.findIndex(line => line.includes('when:'));
    
    if (whenLineIndex !== -1) {
      console.log(`"when:" appears on line ${item.startLine + whenLineIndex} (relative line ${whenLineIndex + 1})`);
      console.log(`Line with "when:": ${lines[whenLineIndex]}`);
      
      // Check if there are lines after the "when:" line
      if (whenLineIndex < lines.length - 1) {
        console.log(`There are ${lines.length - whenLineIndex - 1} lines after the "when:" line`);
        console.log(`First line after "when:": ${lines[whenLineIndex + 1]}`);
      }
    }
  });
  
  // Look for the specific problematic line we identified earlier
  console.log('\n=== EXAMINING LINE 47116 ===');
  const line47116Statement = mappingStatements.find(s => 
    s.startLine <= 47116 && s.endLine >= 47116
  );
  
  if (line47116Statement) {
    console.log(`Statement containing line 47116 (Lines ${line47116Statement.startLine}-${line47116Statement.endLine}):`);
    console.log(line47116Statement.statement);
    
    // Count quotes
    const singleQuotes = (line47116Statement.statement.match(/'/g) || []).length;
    console.log(`Single quotes count: ${singleQuotes} (${singleQuotes % 2 === 0 ? 'balanced' : 'unbalanced'})`);
    
    // Find the line with "when:"
    const lines = line47116Statement.statement.split('\n');
    const whenLineIndex = lines.findIndex(line => line.includes('when:'));
    
    if (whenLineIndex !== -1) {
      console.log(`"when:" appears on line ${line47116Statement.startLine + whenLineIndex} (relative line ${whenLineIndex + 1})`);
      console.log(`Line with "when:": ${lines[whenLineIndex]}`);
      
      // Check if there are lines after the "when:" line
      if (whenLineIndex < lines.length - 1) {
        console.log(`There are ${lines.length - whenLineIndex - 1} lines after the "when:" line`);
        for (let i = whenLineIndex + 1; i < lines.length; i++) {
          console.log(`Line ${line47116Statement.startLine + i} (relative line ${i + 1}): ${lines[i]}`);
        }
      }
    }
  } else {
    console.log('Could not find statement containing line 47116');
  }
}

// Run the function
examineFullSqlStructure().catch(err => {
  console.error('Error:', err);
});