/**
 * Consolidate Test Results
 * 
 * This script consolidates all test results into a single file,
 * showing the full API payload sent and received for each test case.
 */

const fs = require('fs');
const path = require('path');

// Directory containing the test results
const resultsDir = path.join(__dirname, 'test-results');

// Output file path
const outputPath = path.join(__dirname, 'consolidated-test-results.json');

// Function to consolidate test results
async function consolidateTestResults() {
  try {
    console.log('Consolidating test results...');
    
    // Read all files in the test results directory
    const files = fs.readdirSync(resultsDir);
    
    // Filter for individual test case files
    const testCaseFiles = files.filter(file => file.startsWith('all-cases-test-case-'));
    
    console.log(`Found ${testCaseFiles.length} test case files.`);
    
    // Sort the files by case number
    testCaseFiles.sort((a, b) => {
      const caseNumA = parseInt(a.match(/case-(\d+)/)[1]);
      const caseNumB = parseInt(b.match(/case-(\d+)/)[1]);
      return caseNumA - caseNumB;
    });
    
    // Consolidate the results
    const consolidatedResults = {
      testDate: new Date().toISOString(),
      totalCases: testCaseFiles.length,
      cases: []
    };
    
    // Process each test case file
    for (const file of testCaseFiles) {
      const filePath = path.join(resultsDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const testCase = JSON.parse(fileContent);
      
      // Extract the relevant information
      consolidatedResults.cases.push({
        name: testCase.testCase.name,
        dictation: testCase.testCase.dictation,
        apiPayloadSent: {
          systemPrompt: testCase.optimizedFormat.systemPrompt,
          userPrompt: testCase.optimizedFormat.userPrompt
        },
        apiPayloadReceived: {
          content: testCase.optimizedFormat.result.content,
          usage: testCase.optimizedFormat.result.usage,
          apiCallTime: testCase.optimizedFormat.result.apiCallTime
        },
        parsedResult: testCase.optimizedFormat.result.parsedJson
      });
    }
    
    // Write the consolidated results to a file
    fs.writeFileSync(outputPath, JSON.stringify(consolidatedResults, null, 2));
    
    console.log(`Consolidated results saved to: ${outputPath}`);
    
  } catch (error) {
    console.error('Error consolidating test results:', error);
  }
}

// Run the consolidation function
consolidateTestResults();