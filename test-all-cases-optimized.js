/**
 * Test All Cases with Optimized Format
 * 
 * This script extracts test cases from the test-cases-for-prompt-optimization.md file
 * and runs them through the optimized format with STAT detection.
 */

require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const { performance } = require('perf_hooks');

// Anthropic API key from environment variables
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!ANTHROPIC_API_KEY) {
  console.error('Error: ANTHROPIC_API_KEY environment variable is not set.');
  console.error('Please set it in your .env file or environment variables.');
  process.exit(1);
}

/**
 * Parse the test cases from the markdown file
 */
async function parseTestCases() {
  try {
    // First try to read the file directly
    let markdownPath = path.join(__dirname, 'tests', 'test-cases-for-prompt-optimization.md');
    
    // If file doesn't exist at the first path, try the second path
    if (!fs.existsSync(markdownPath)) {
      markdownPath = path.join(__dirname, 'test-cases-for-prompt-optimization.md');
      
      // If file doesn't exist at the second path, try the third path
      if (!fs.existsSync(markdownPath)) {
        // Search for the file in the current directory and subdirectories
        console.log('Searching for test-cases-for-prompt-optimization.md...');
        const files = fs.readdirSync(__dirname);
        let found = false;
        
        for (const file of files) {
          const filePath = path.join(__dirname, file);
          const stats = fs.statSync(filePath);
          
          if (stats.isDirectory()) {
            const subFiles = fs.readdirSync(filePath);
            for (const subFile of subFiles) {
              if (subFile === 'test-cases-for-prompt-optimization.md') {
                markdownPath = path.join(filePath, subFile);
                found = true;
                break;
              }
            }
          }
          
          if (found) break;
        }
        
        if (!found) {
          console.error('Error: test-cases-for-prompt-optimization.md not found.');
          return [];
        }
      }
    }
    
    console.log(`Reading test cases from: ${markdownPath}`);
    const markdownContent = await fsPromises.readFile(markdownPath, 'utf8');
    
    // Extract dictations directly from the markdown content
    const dictationRegex = /Dictation: "([^"]+)"/g;
    const dictations = [];
    let match;
    while ((match = dictationRegex.exec(markdownContent)) !== null) {
      dictations.push(match[1]);
    }
    
    // If no dictations found using the first pattern, try alternative patterns
    if (dictations.length === 0) {
      // Try to extract from user messages in JSON
      const userMessageRegex = /"content": "Please analyze this radiology order dictation:\\n\\n\\"([^"]+)\\"/g;
      while ((match = userMessageRegex.exec(markdownContent)) !== null) {
        dictations.push(match[1]);
      }
    }
    
    // Extract database contexts from the system prompts
    const dbContextRegex = /POSTGRESQL DATABASE CONTEXT:[\s\S]*?(?=IMPORTANT GUIDELINES:|$)/g;
    const dbContexts = [];
    while ((match = dbContextRegex.exec(markdownContent)) !== null) {
      dbContexts.push(match[0].trim());
    }
    
    console.log(`Found ${dbContexts.length} database contexts and ${dictations.length} dictations.`);
    
    // Create test cases
    const testCases = [];
    for (let i = 0; i < Math.min(dbContexts.length, dictations.length); i++) {
      testCases.push({
        name: `Case ${i + 1}`,
        dictation: dictations[i],
        dbContext: dbContexts[i]
      });
    }
    
    return testCases;
  } catch (error) {
    console.error('Error parsing test cases:', error);
    return [];
  }
}

/**
 * Create the optimized system prompt with minimal STAT detection
 */
function createOptimizedSystemPrompt(dbContext) {
  return `You are RadValidator, an AI clinical decision support system for radiology order validation.

Your task is to analyze a physician's dictation for a radiology order and produce the following outputs:
1. Extract relevant ICD-10 diagnosis codes
2. Extract or suggest appropriate CPT procedure codes 
3. Validate if the imaging order is clinically appropriate
4. Assign a compliance score from 1-9 (9 being most appropriate)
5. Provide brief educational feedback if the order is inappropriate
6. Evaluate dictation for stat status

The dictation is for a patient with the specialty context: General Radiology.

${dbContext}

IMPORTANT GUIDELINES:
- Validate based on ACR Appropriateness Criteria and evidence-based guidelines
- For inappropriate orders, suggest alternative approaches
- For spine imaging, MRI without contrast is usually sufficient for disc evaluation
- Acute low back pain (<6 weeks) without red flags should be managed conservatively
- Red flags include: trauma, cancer history, neurological deficits, infection signs

Only use contrast when there is a specific indication (infection, tumor, post-surgical).`;
}

/**
 * Create the optimized user prompt with simplified JSON format including urgencyLevel
 */
function createOptimizedUserPrompt(dictation) {
  return `Please analyze this radiology order dictation:

"${dictation}"

Respond in JSON format with these fields:
- diagnosisCodes: Array of {code, isPrimary} objects (mark one as isPrimary: true)
- procedureCodes: Array of {code} objects
- validationStatus: "appropriate", "needs_clarification", or "inappropriate"
- complianceScore: Number 1-9
- urgencyLevel: "routine" or "stat"
- feedback: Brief educational note (33 words target length)`;
}

/**
 * Call Anthropic Claude API with the given prompt
 */
async function callClaudeAPI(systemPrompt, userPrompt) {
  try {
    console.log('Calling Anthropic Claude API...');
    const startTime = performance.now();
    
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 4000,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: userPrompt
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        }
      }
    );
    
    const endTime = performance.now();
    const apiCallTime = Math.round(endTime - startTime);
    
    return {
      content: response.data.content[0].text,
      usage: response.data.usage,
      model: response.data.model,
      apiCallTime: apiCallTime
    };
  } catch (error) {
    console.error('Error calling Claude API:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Run the test for a given test case
 */
async function runTest(testCase) {
  try {
    console.log(`\n=== TESTING: ${testCase.name} ===`);
    console.log(`Dictation: "${testCase.dictation}"`);
    
    // Create prompts
    const optimizedSystemPrompt = createOptimizedSystemPrompt(testCase.dbContext);
    const optimizedUserPrompt = createOptimizedUserPrompt(testCase.dictation);
    
    // Call Claude API with optimized format
    console.log('\n=== TESTING OPTIMIZED FORMAT WITH STAT DETECTION ===');
    const optimizedResult = await callClaudeAPI(optimizedSystemPrompt, optimizedUserPrompt);
    
    // Calculate token usage
    const optimizedInputTokens = optimizedResult.usage.input_tokens;
    const optimizedOutputTokens = optimizedResult.usage.output_tokens;
    const optimizedTotalTokens = optimizedInputTokens + optimizedOutputTokens;
    
    // Output results
    console.log('\n=== RESULTS ===');
    console.log('Optimized Format with STAT Detection:');
    console.log(`- Input Tokens: ${optimizedInputTokens}`);
    console.log(`- Output Tokens: ${optimizedOutputTokens}`);
    console.log(`- Total Tokens: ${optimizedTotalTokens}`);
    console.log(`- API Call Time: ${optimizedResult.apiCallTime} ms`);
    
    // Extract JSON from the response
    let optimizedJson;
    try {
      const jsonMatch = optimizedResult.content.match(/```json\n([\s\S]*?)\n```/) || 
                        optimizedResult.content.match(/```\n([\s\S]*?)\n```/) ||
                        optimizedResult.content.match(/{[\s\S]*?}/);
      
      const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : optimizedResult.content;
      optimizedJson = JSON.parse(jsonString);
      
      console.log('\nResponse:');
      console.log(`- Diagnosis Codes: ${JSON.stringify(optimizedJson.diagnosisCodes)}`);
      console.log(`- Procedure Codes: ${JSON.stringify(optimizedJson.procedureCodes)}`);
      console.log(`- Validation Status: ${optimizedJson.validationStatus}`);
      console.log(`- Compliance Score: ${optimizedJson.complianceScore}`);
      console.log(`- Urgency Level: ${optimizedJson.urgencyLevel}`);
      console.log(`- Feedback: ${optimizedJson.feedback}`);
    } catch (error) {
      console.error('Error parsing JSON from response:', error);
      optimizedJson = null;
    }
    
    // Save results to file
    const resultsDir = path.join(__dirname, 'test-results');
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const resultsPath = path.join(resultsDir, `all-cases-test-${testCase.name.replace(/\s+/g, '-').toLowerCase()}-${timestamp}.json`);
    
    await fsPromises.writeFile(resultsPath, JSON.stringify({
      testCase: {
        name: testCase.name,
        dictation: testCase.dictation,
        dbContext: testCase.dbContext
      },
      optimizedFormat: {
        systemPrompt: optimizedSystemPrompt,
        userPrompt: optimizedUserPrompt,
        result: {
          content: optimizedResult.content,
          usage: optimizedResult.usage,
          apiCallTime: optimizedResult.apiCallTime,
          parsedJson: optimizedJson
        }
      }
    }, null, 2));
    
    console.log(`\nFull results saved to: ${resultsPath}`);
    
    return {
      testCase: {
        name: testCase.name,
        dictation: testCase.dictation
      },
      optimizedInputTokens,
      optimizedOutputTokens,
      optimizedTotalTokens,
      optimizedApiCallTime: optimizedResult.apiCallTime,
      response: optimizedJson
    };
    
  } catch (error) {
    console.error(`Error testing ${testCase.name}:`, error);
    return {
      testCase: {
        name: testCase.name,
        dictation: testCase.dictation
      },
      error: error.message
    };
  }
}

/**
 * Run tests for all test cases
 */
async function runAllTests() {
  try {
    console.log('Starting tests for all cases...');
    
    // Parse test cases from markdown file
    const testCases = await parseTestCases();
    console.log(`Found ${testCases.length} test cases.`);
    
    // Run tests for each case
    const results = [];
    for (const testCase of testCases) {
      const result = await runTest(testCase);
      results.push(result);
    }
    
    // Save summary to file
    const summaryPath = path.join(__dirname, 'test-results', `all-cases-summary-${new Date().toISOString().replace(/:/g, '-')}.json`);
    await fsPromises.writeFile(summaryPath, JSON.stringify({
      totalCases: testCases.length,
      results: results
    }, null, 2));
    
    console.log('\n=== SUMMARY ===');
    console.log(`Total Cases: ${testCases.length}`);
    console.log(`Results saved to: ${summaryPath}`);
    
    console.log('\nTests completed successfully.');
    
  } catch (error) {
    console.error('Error running tests:', error);
    throw error;
  }
}

// Run the tests if this script is executed directly
if (require.main === module) {
  runAllTests()
    .then(() => {
      process.exit(0);
    })
    .catch(error => {
      console.error('Tests failed:', error);
      process.exit(1);
    });
}

module.exports = {
  parseTestCases,
  runTest,
  runAllTests
};