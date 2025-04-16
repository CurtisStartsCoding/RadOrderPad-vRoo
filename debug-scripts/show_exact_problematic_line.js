/**
 * Script to extract and display the exact problematic SQL statement
 */
const fs = require('fs');
const readline = require('readline');

// Source file
const sourceFile = 'Data/medical_tables_export_2025-04-11T23-40-51-963Z.sql';
const lineNumber = 47116; // The problematic line we identified earlier

async function showExactLine() {
  console.log(`Examining SQL file: ${sourceFile}`);
  console.log(`Looking for line ${lineNumber}`);
  
  // Read the file line by line
  const fileStream = fs.createReadStream(sourceFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  let currentLine = 0;
  
  // Search for the specific line
  for await (const line of rl) {
    currentLine++;
    
    if (currentLine === lineNumber) {
      console.log(`\nFound line ${lineNumber}:`);
      console.log(`\n${line}\n`);
      
      // Analyze the line
      console.log('Line analysis:');
      console.log(`Length: ${line.length} characters`);
      
      // Count quotes
      const singleQuotes = (line.match(/'/g) || []).length;
      console.log(`Single quotes count: ${singleQuotes} (${singleQuotes % 2 === 0 ? 'balanced' : 'unbalanced'})`);
      
      // Show positions of quotes
      let quotePositions = [];
      for (let i = 0; i < line.length; i++) {
        if (line[i] === "'") {
          quotePositions.push(i);
        }
      }
      console.log(`Quote positions: ${quotePositions.join(', ')}`);
      
      // Extract the problematic part
      if (line.includes('MRA of the lower extremity')) {
        const startIndex = line.indexOf('MRA of the lower extremity');
        const excerpt = line.substring(Math.max(0, startIndex - 20), Math.min(line.length, startIndex + 100));
        console.log(`\nProblematic part: "${excerpt}"`);
      }
      
      break;
    }
  }
  
  // If we didn't find the line, look for similar lines
  if (currentLine < lineNumber) {
    console.log(`\nCouldn't find line ${lineNumber} (file only has ${currentLine} lines)`);
    console.log('Looking for lines with "MRA of the lower extremity" instead...');
    
    // Reset the file stream
    fileStream.destroy();
    const newFileStream = fs.createReadStream(sourceFile);
    const newRl = readline.createInterface({
      input: newFileStream,
      crlfDelay: Infinity
    });
    
    currentLine = 0;
    let found = false;
    
    for await (const line of newRl) {
      currentLine++;
      
      if (line.includes('MRA of the lower extremity')) {
        console.log(`\nFound similar line at line ${currentLine}:`);
        console.log(`\n${line}\n`);
        found = true;
        break;
      }
    }
    
    if (!found) {
      console.log('No lines with "MRA of the lower extremity" found');
    }
  }
}

// Run the function
showExactLine().catch(err => {
  console.error('Error:', err);
});