/**
 * Script to find and examine the problematic SQL line
 */
const fs = require('fs');
const readline = require('readline');

// Source file
const sourceFile = 'Data/medical_tables_export_2025-04-11T23-40-51-963Z.sql';

async function findProblematicLine() {
  console.log(`Examining SQL file: ${sourceFile}`);
  
  // Read the file line by line
  const fileStream = fs.createReadStream(sourceFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  let lineNumber = 0;
  let problematicLines = [];
  
  // Search for the problematic line
  for await (const line of rl) {
    lineNumber++;
    
    // Look for the specific error text
    if (line.includes('MRA of the lower extremity is usually appropriate (7/9) for evaluating bypass graft atherosclerosis when')) {
      problematicLines.push({
        lineNumber,
        line,
        excerpt: line.substring(0, Math.min(line.length, 200)) + '...'
      });
      
      // Analyze the line for SQL syntax issues
      analyzeQuotes(line, lineNumber);
    }
  }
  
  console.log(`\nFound ${problematicLines.length} problematic lines`);
  
  // Display the problematic lines
  problematicLines.forEach((item, index) => {
    console.log(`\nProblematic Line #${index + 1} (Line ${item.lineNumber}):`);
    console.log(`Excerpt: ${item.excerpt}`);
    
    // Check for unbalanced quotes
    const singleQuotes = (item.line.match(/'/g) || []).length;
    console.log(`Single quotes count: ${singleQuotes} (${singleQuotes % 2 === 0 ? 'balanced' : 'unbalanced'})`);
    
    // Check for escaped quotes
    const escapedQuotes = (item.line.match(/''/g) || []).length;
    console.log(`Escaped quotes count: ${escapedQuotes}`);
    
    // Check for specific problematic pattern
    if (item.line.includes("when:")) {
      console.log(`Contains "when:" which might be causing the issue`);
    }
  });
  
  // If no problematic lines found, search for similar patterns
  if (problematicLines.length === 0) {
    console.log('\nNo exact match found. Searching for similar patterns...');
    await searchSimilarPatterns();
  }
}

// Analyze quotes in a line
function analyzeQuotes(line, lineNumber) {
  console.log(`\nAnalyzing quotes in line ${lineNumber}:`);
  
  let inQuote = false;
  let quotePositions = [];
  
  for (let i = 0; i < line.length; i++) {
    if (line[i] === "'") {
      // Check if it's an escaped quote
      if (i + 1 < line.length && line[i + 1] === "'") {
        console.log(`Escaped quote at position ${i}-${i+1}`);
        i++; // Skip the next quote
      } else {
        inQuote = !inQuote;
        quotePositions.push({
          position: i,
          type: inQuote ? 'opening' : 'closing'
        });
      }
    }
  }
  
  console.log(`Quote positions: ${quotePositions.map(p => `${p.type} at ${p.position}`).join(', ')}`);
  
  if (inQuote) {
    console.log(`ISSUE FOUND: Unclosed quote at the end of the line`);
    
    // Show the context around the last quote
    const lastQuotePos = quotePositions[quotePositions.length - 1].position;
    const start = Math.max(0, lastQuotePos - 20);
    const end = Math.min(line.length, lastQuotePos + 100);
    console.log(`Context: ${line.substring(start, lastQuotePos)}[LAST QUOTE]${line.substring(lastQuotePos + 1, end)}`);
  }
}

// Search for similar patterns
async function searchSimilarPatterns() {
  const fileStream = fs.createReadStream(sourceFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  let lineNumber = 0;
  let mappingLines = [];
  
  // Search for mapping lines
  for await (const line of rl) {
    lineNumber++;
    
    if (line.startsWith('INSERT INTO medical_cpt_icd10_mappings')) {
      mappingLines.push({
        lineNumber,
        line,
        excerpt: line.substring(0, Math.min(line.length, 200)) + '...'
      });
    }
  }
  
  console.log(`\nFound ${mappingLines.length} mapping lines`);
  
  // Analyze a sample of mapping lines
  const sampleSize = Math.min(5, mappingLines.length);
  console.log(`\nAnalyzing a sample of ${sampleSize} mapping lines:`);
  
  for (let i = 0; i < sampleSize; i++) {
    const item = mappingLines[i];
    console.log(`\nSample Line #${i + 1} (Line ${item.lineNumber}):`);
    console.log(`Excerpt: ${item.excerpt}`);
    
    // Check for unbalanced quotes
    const singleQuotes = (item.line.match(/'/g) || []).length;
    console.log(`Single quotes count: ${singleQuotes} (${singleQuotes % 2 === 0 ? 'balanced' : 'unbalanced'})`);
  }
  
  // Look for lines with "MRA" or "atherosclerosis"
  console.log('\nSearching for lines with "MRA" or "atherosclerosis":');
  let mraLines = mappingLines.filter(item => 
    item.line.includes('MRA') || 
    item.line.includes('atherosclerosis')
  );
  
  mraLines.forEach((item, index) => {
    console.log(`\nMRA Line #${index + 1} (Line ${item.lineNumber}):`);
    console.log(`Excerpt: ${item.excerpt}`);
  });
}

// Run the function
findProblematicLine().catch(err => {
  console.error('Error:', err);
});