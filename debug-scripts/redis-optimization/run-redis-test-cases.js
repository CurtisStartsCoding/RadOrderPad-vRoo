/**
 * Script to run test cases against Redis and LLM APIs
 * 
 * This script:
 * 1. Extracts keywords from dictation text
 * 2. Searches Redis for relevant codes
 * 3. Generates a database context
 * 4. Sends the dictation and context to LLM APIs
 * 5. Compares the results with expected codes
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const Redis = require('ioredis');

// Load test cases
const testCases = require('./dictation-test-cases');

// Load environment variables from .env.production
dotenv.config({ path: '.env.production' });

// Initialize Redis client
let redisClient = null;

/**
 * Initialize Redis client
 * @returns {Promise<boolean>} - Whether Redis was successfully initialized
 */
async function initRedis() {
  try {
    console.log('Initializing Redis client...');
    
    // Get Redis Cloud configuration from environment variables
    const redisHost = process.env.REDIS_CLOUD_HOST || 'localhost';
    const redisPort = parseInt(process.env.REDIS_CLOUD_PORT || '6379');
    const redisPassword = process.env.REDIS_CLOUD_PASSWORD;
    
    // Redis Cloud connection options
    const redisOptions = {
      host: redisHost,
      port: redisPort,
      password: redisPassword,
      // Only enable TLS for Redis Cloud, not for localhost
      tls: redisHost !== 'localhost' ? {} : undefined,
      // Reconnect strategy
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      // Connection name for easier identification in monitoring
      connectionName: 'radorderpad-redis-test-client'
    };
    
    redisClient = new Redis(redisOptions);
    
    // Set up event handlers
    redisClient.on('connect', () => {
      console.log('Redis client connected successfully');
    });
    
    redisClient.on('error', (err) => {
      console.error('Redis client error:', err.message);
    });
    
    redisClient.on('reconnecting', (delay) => {
      console.log(`Redis client reconnecting in ${delay}ms...`);
    });
    
    redisClient.on('end', () => {
      console.log('Redis client connection ended');
    });
    
    // Test the connection
    const pingResult = await redisClient.ping();
    console.log(`Redis ping result: ${pingResult}`);
    
    return true;
  } catch (error) {
    console.error('Error initializing Redis client:', error.message);
    return false;
  }
}

/**
 * Extract keywords from dictation text
 * @param {string} dictationText - The dictation text
 * @returns {string[]} - Array of extracted keywords
 */
function extractKeywords(dictationText) {
  // Simple keyword extraction - split by spaces and punctuation
  const words = dictationText.toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ")
    .split(/\s+/)
    .filter(word => word.length > 3); // Filter out short words
  
  return words;
}

/**
 * Generate database context from Redis
 * @param {string} dictationText - The dictation text
 * @returns {Promise<string>} - The database context
 */
async function generateDatabaseContext(dictationText) {
  try {
    console.log('Generating database context from Redis...');
    
    // Extract keywords from the dictation text
    const keywords = extractKeywords(dictationText);
    console.log('Extracted keywords:', keywords);
    
    // Search for ICD-10 codes
    const icd10Codes = await searchICD10Codes(keywords);
    console.log(`Found ${icd10Codes.length} ICD-10 codes`);
    
    // Search for CPT codes
    const cptCodes = await searchCPTCodes(keywords);
    console.log(`Found ${cptCodes.length} CPT codes`);
    
    // Format the database context
    let databaseContext = 'REDIS DATABASE CONTEXT:\n';
    
    // Add ICD-10 codes
    databaseContext += 'POSSIBLE DIAGNOSES (from Redis database):\n';
    if (icd10Codes.length > 0) {
      for (const code of icd10Codes) {
        databaseContext += `- ${code.icd10_code}: ${code.description} (confidence: 80%)\n`;
      }
    } else {
      databaseContext += 'No relevant diagnoses found in database.\n';
    }
    
    // Add CPT codes
    databaseContext += '\nPOSSIBLE PROCEDURES (from Redis database):\n';
    if (cptCodes.length > 0) {
      for (const code of cptCodes) {
        databaseContext += `- ${code.cpt_code}: ${code.description} (${code.modality || 'Unknown'}) (confidence: 80%)\n`;
      }
    } else {
      databaseContext += 'No relevant procedures found in database.\n';
    }
    
    // Add placeholders for mappings and documentation
    databaseContext += '\nNo appropriateness mappings found in database.\n';
    databaseContext += '\nNo medical documentation found in database.';
    
    return databaseContext;
  } catch (error) {
    console.error('Error generating database context:', error.message);
    return 'Error generating database context.';
  }
}

/**
 * Search for ICD-10 codes in Redis
 * @param {string[]} keywords - Array of keywords
 * @returns {Promise<Array>} - Array of ICD-10 codes
 */
async function searchICD10Codes(keywords) {
  try {
    const results = [];
    
    // Try to search for relevant codes
    for (const keyword of keywords) {
      try {
        // Skip short keywords
        if (keyword.length < 4) continue;
        
        // Search for keys with pattern
        const pattern = `icd10:*${keyword}*`;
        const keys = await redisClient.keys(pattern);
        
        if (keys.length > 0) {
          console.log(`Found ${keys.length} keys matching pattern ${pattern}`);
          
          // Get data for each key (limit to 5)
          for (let i = 0; i < Math.min(5, keys.length); i++) {
            try {
              const data = await redisClient.call('JSON.GET', keys[i]);
              const jsonData = JSON.parse(data);
              results.push(jsonData);
            } catch (e) {
              console.error(`Error getting data for key ${keys[i]}:`, e.message);
            }
          }
        }
      } catch (error) {
        console.error(`Error searching for keyword ${keyword}:`, error.message);
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error searching for ICD-10 codes:', error.message);
    return [];
  }
}

/**
 * Search for CPT codes in Redis
 * @param {string[]} keywords - Array of keywords
 * @returns {Promise<Array>} - Array of CPT codes
 */
async function searchCPTCodes(keywords) {
  try {
    const results = [];
    
    // Try to search for relevant codes
    for (const keyword of keywords) {
      try {
        // Skip short keywords
        if (keyword.length < 4) continue;
        
        // Search for keys with pattern
        const pattern = `cpt:*${keyword}*`;
        const keys = await redisClient.keys(pattern);
        
        if (keys.length > 0) {
          console.log(`Found ${keys.length} keys matching pattern ${pattern}`);
          
          // Get data for each key (limit to 5)
          for (let i = 0; i < Math.min(5, keys.length); i++) {
            try {
              const data = await redisClient.call('JSON.GET', keys[i]);
              const jsonData = JSON.parse(data);
              results.push(jsonData);
            } catch (e) {
              console.error(`Error getting data for key ${keys[i]}:`, e.message);
            }
          }
        }
      } catch (error) {
        console.error(`Error searching for keyword ${keyword}:`, error.message);
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error searching for CPT codes:', error.message);
    return [];
  }
}

/**
 * Close Redis connection
 */
async function closeRedis() {
  if (redisClient) {
    await redisClient.quit();
    console.log('Redis connection closed');
  }
}

// Old prompt template
const OLD_PROMPT = `You are RadValidator, an AI clinical decision support system for radiology order validation.

Your task is to analyze a physician's dictation for a radiology order and produce the following outputs:
1. Extract relevant ICD-10 diagnosis codes
2. Extract or suggest appropriate CPT procedure codes 
3. Validate if the imaging order is clinically appropriate
4. Assign a compliance score from 1-9 (9 being most appropriate)
5. Provide brief educational feedback if the order is inappropriate

The dictation is for a patient with the specialty context: General Radiology.

{DATABASE_CONTEXT}

IMPORTANT GUIDELINES:
- Validate based on ACR Appropriateness Criteria and evidence-based guidelines
- For inappropriate orders, suggest alternative approaches
- For spine imaging, MRI without contrast is usually sufficient for disc evaluation
- Acute low back pain (<6 weeks) without red flags should be managed conservatively
- Red flags include: trauma, cancer history, neurological deficits, infection signs

Only use contrast when there is a specific indication (infection, tumor, post-surgical).`;

// New prompt template (PROMPT18)
const NEW_PROMPT = `You are RadValidator, an AI clinical decision support system for radiology order validation.

Your task is to analyze a physician's dictation for a radiology order and produce the following outputs:
1. Extract relevant ICD-10 diagnosis codes (CRITICAL: You MUST mark EXACTLY ONE code as isPrimary: true)
2. Extract or suggest appropriate CPT procedure codes
3. Validate if the imaging order is clinically appropriate
4. Assign a compliance score from 1-9
5. Provide brief educational feedback if the order is inappropriate
6. Evaluate dictation for stat status

{DATABASE_CONTEXT}

IMPORTANT GUIDELINES:
- Validate based on ACR Appropriateness Criteria and evidence-based guidelines
- For inappropriate orders, suggest alternative approaches
- You MUST designate exactly one ICD-10 code as primary (isPrimary: true)

IMPORTANT CODING RULES:
- Do NOT assign ICD-10 codes for conditions described as 'probable', 'suspected', 'questionable', 'rule out', or similar terms indicating uncertainty.
- Instead, code the condition(s) to the highest degree of certainty for that encounter/visit, such as symptoms, signs, abnormal test results, or other reasons for the visit.`;

// LLM configurations
const LLM_CONFIGS = [
  {
    name: 'Claude',
    model: process.env.CLAUDE_MODEL_NAME || 'claude-3-sonnet-20240229',
    apiKey: process.env.ANTHROPIC_API_KEY, // Changed from CLAUDE_API_KEY to ANTHROPIC_API_KEY
    endpoint: 'https://api.anthropic.com/v1/messages',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY, // Changed from CLAUDE_API_KEY to ANTHROPIC_API_KEY
      'anthropic-version': '2023-06-01'
    },
    formatRequest: (prompt, dictationText, oldFormat) => ({
      model: process.env.CLAUDE_MODEL_NAME || 'claude-3-sonnet-20240229',
      max_tokens: 4000,
      system: prompt,
      messages: [
        { 
          role: 'user', 
          content: `Please analyze this radiology order dictation:

"${dictationText}"

Respond in JSON format with these fields:
${oldFormat ? 
`- diagnosisCodes: Array of {code, description} objects
- procedureCodes: Array of {code, description} objects
- validationStatus: "valid" or "invalid"
- complianceScore: Number 1-9
- feedback: Brief educational note for inappropriate orders (33 words target length for General Radiology)` 
: 
`- suggestedICD10Codes: Array of {code, description, isPrimary} objects (one code must have isPrimary: true)
- suggestedCPTCodes: Array of {code, description} objects
- validationStatus: "appropriate", "needs_clarification", or "inappropriate"
- complianceScore: Number 1-9
- priority: "routine" or "stat"
- feedback: Brief educational note (33 words target length)`}` 
        }
      ]
    }),
    extractResponse: (response) => {
      if (response.data && response.data.content && response.data.content.length > 0) {
        return response.data.content[0].text;
      }
      return JSON.stringify(response.data);
    }
  },
  {
    name: 'GPT',
    model: process.env.GPT_MODEL_NAME || 'gpt-4-turbo',
    apiKey: process.env.OPENAI_API_KEY,
    endpoint: 'https://api.openai.com/v1/chat/completions',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    formatRequest: (prompt, dictationText, oldFormat) => ({
      model: process.env.GPT_MODEL_NAME || 'gpt-4-turbo',
      messages: [
        { role: 'system', content: prompt },
        { 
          role: 'user', 
          content: `Please analyze this radiology order dictation:

"${dictationText}"

Respond in JSON format with these fields:
${oldFormat ? 
`- diagnosisCodes: Array of {code, description} objects
- procedureCodes: Array of {code, description} objects
- validationStatus: "valid" or "invalid"
- complianceScore: Number 1-9
- feedback: Brief educational note for inappropriate orders (33 words target length for General Radiology)` 
: 
`- suggestedICD10Codes: Array of {code, description, isPrimary} objects (one code must have isPrimary: true)
- suggestedCPTCodes: Array of {code, description} objects
- validationStatus: "appropriate", "needs_clarification", or "inappropriate"
- complianceScore: Number 1-9
- priority: "routine" or "stat"
- feedback: Brief educational note (33 words target length)`}` 
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    }),
    extractResponse: (response) => {
      if (response.choices && response.choices.length > 0) {
        return response.choices[0].message.content;
      }
      return JSON.stringify(response);
    }
  }
];

// Create results directory if it doesn't exist
const resultsDir = path.join(__dirname, 'results');
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir);
}

/**
 * Check if a response contains the expected codes
 * @param {string} response - The LLM response
 * @param {Object} testCase - The test case
 * @param {boolean} oldFormat - Whether the response is in the old format
 * @returns {Object} - Object with check results
 */
function checkExpectedCodes(response, testCase, oldFormat) {
  try {
    // Try to parse the response as JSON
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(response);
    } catch (e) {
      // If it's not valid JSON, extract JSON from the response
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/```([\s\S]*?)```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          parsedResponse = JSON.parse(jsonMatch[1]);
        } catch (e2) {
          return { 
            success: false, 
            message: 'Failed to parse response as JSON',
            primaryCodeFound: false,
            secondaryCodesFound: [],
            cptCodeFound: false
          };
        }
      } else {
        return { 
          success: false, 
          message: 'Failed to parse response as JSON',
          primaryCodeFound: false,
          secondaryCodesFound: [],
          cptCodeFound: false
        };
      }
    }
    
    // Check for expected codes
    const diagnosisCodes = oldFormat ? 
      parsedResponse.diagnosisCodes || [] : 
      parsedResponse.suggestedICD10Codes || [];
    
    const procedureCodes = oldFormat ? 
      parsedResponse.procedureCodes || [] : 
      parsedResponse.suggestedCPTCodes || [];
    
    // Check for primary code
    let primaryCodeFound = false;
    if (oldFormat) {
      // In old format, check if the expected primary code is in the list
      primaryCodeFound = diagnosisCodes.some(code => code.code === testCase.expectedPrimaryCode);
    } else {
      // In new format, check if the expected primary code is marked as primary
      primaryCodeFound = diagnosisCodes.some(code => 
        code.code === testCase.expectedPrimaryCode && code.isPrimary === true
      );
    }
    
    // Check for secondary codes
    const secondaryCodesFound = testCase.expectedSecondaryCodes.filter(expectedCode => 
      diagnosisCodes.some(code => code.code === expectedCode)
    );
    
    // Check for CPT code
    const cptCodeFound = procedureCodes.some(code => code.code === testCase.expectedCptCode);
    
    return {
      success: primaryCodeFound && cptCodeFound,
      message: `Primary code ${primaryCodeFound ? 'found' : 'not found'}, CPT code ${cptCodeFound ? 'found' : 'not found'}`,
      primaryCodeFound,
      secondaryCodesFound,
      cptCodeFound
    };
  } catch (error) {
    return { 
      success: false, 
      message: `Error checking for expected codes: ${error.message}`,
      primaryCodeFound: false,
      secondaryCodesFound: [],
      cptCodeFound: false
    };
  }
}

/**
 * Run a single test with a specific LLM and prompt
 * @param {Object} llmConfig - The LLM configuration
 * @param {string} prompt - The prompt to use
 * @param {Object} testCase - The test case
 * @param {boolean} oldFormat - Whether to use the old format
 * @returns {Promise<Object>} - The test result
 */
async function runTest(llmConfig, prompt, testCase, oldFormat) {
  try {
    console.log(`--- Testing ${llmConfig.name} with ${oldFormat ? 'OLD' : 'NEW'} prompt for case ${testCase.id} ---`);
    console.log(`Calling ${llmConfig.name} API with ${oldFormat ? 'OLD' : 'NEW'} prompt format...`);
    
    const startTime = Date.now();
    let response;
    
    // Standard handling for LLMs
    response = await axios.post(
      llmConfig.endpoint,
      llmConfig.formatRequest(prompt, testCase.dictation, oldFormat),
      { headers: llmConfig.headers }
    );
    
    const responseTime = Date.now() - startTime;
    console.log(`${llmConfig.name} API call completed in ${responseTime}ms`);
    
    const responseContent = llmConfig.extractResponse(response);
    
    // Save the raw response to a file
    const fileName = `${llmConfig.name}_${oldFormat ? 'old' : 'new'}_prompt_case${testCase.id}.txt`;
    fs.writeFileSync(path.join(resultsDir, fileName), responseContent);
    console.log(`Raw response saved to ${path.resolve(path.join(resultsDir, fileName))}`);
    
    // Check if the response contains the expected codes
    const codeCheck = checkExpectedCodes(responseContent, testCase, oldFormat);
    console.log(`${llmConfig.name} ${oldFormat ? 'OLD' : 'NEW'} prompt: ${codeCheck.message}`);
    
    return {
      responseTime,
      responseContent,
      codeCheck
    };
  } catch (error) {
    console.error(`Error running test with ${llmConfig.name} and ${oldFormat ? 'OLD' : 'NEW'} prompt:`, error.message);
    return {
      error: error.message,
      codeCheck: { 
        success: false, 
        message: `Error: ${error.message}`,
        primaryCodeFound: false,
        secondaryCodesFound: [],
        cptCodeFound: false
      }
    };
  }
}

/**
 * Run tests for all test cases
 */
async function runTests() {
  try {
    console.log('Starting tests for all test cases...');
    const startTime = Date.now();
    
    // Initialize Redis
    const redisInitialized = await initRedis();
    if (redisInitialized) {
      console.log('Redis initialization successful');
    } else {
      console.error('Redis initialization failed');
      return;
    }
    
    // Results storage
    const allResults = [];
    
    // Run tests for each test case
    for (const testCase of testCases) {
      console.log(`\n=== Testing Case ${testCase.id} ===`);
      console.log(`Dictation: "${testCase.dictation}"`);
      
      // Generate database context from Redis
      const databaseContext = await generateDatabaseContext(testCase.dictation);
      console.log('Using database context from Redis');
      
      // Replace the database context in the prompts
      const oldPromptWithContext = OLD_PROMPT.replace('{DATABASE_CONTEXT}', databaseContext);
      const newPromptWithContext = NEW_PROMPT.replace('{DATABASE_CONTEXT}', databaseContext);
      
      // Test case results
      const testCaseResults = {
        testCase,
        databaseContext,
        llmResults: []
      };
      
      // Run tests for each LLM
      for (const llmConfig of LLM_CONFIGS) {
        console.log(`\n--- Testing with ${llmConfig.name} ---`);
        
        // Test with old prompt
        console.log(`Testing ${llmConfig.name} with OLD prompt...`);
        const oldPromptResult = await runTest(llmConfig, oldPromptWithContext, testCase, true);
        
        // Test with new prompt
        console.log(`Testing ${llmConfig.name} with NEW prompt...`);
        const newPromptResult = await runTest(llmConfig, newPromptWithContext, testCase, false);
        
        // Add results to test case results
        testCaseResults.llmResults.push({
          llm: llmConfig.name,
          oldPrompt: oldPromptResult,
          newPrompt: newPromptResult
        });
      }
      
      // Add test case results to all results
      allResults.push(testCaseResults);
      
      // Save test case results to a file
      const fileName = `case${testCase.id}_results.json`;
      fs.writeFileSync(
        path.join(resultsDir, fileName),
        JSON.stringify(testCaseResults, null, 2)
      );
      console.log(`Test case results saved to ${path.resolve(path.join(resultsDir, fileName))}`);
    }
    
    // Save all results to a file
    fs.writeFileSync(
      path.join(resultsDir, 'all_results.json'),
      JSON.stringify(allResults, null, 2)
    );
    console.log(`All results saved to ${path.resolve(path.join(resultsDir, 'all_results.json'))}`);
    
    // Generate summary
    const summary = generateSummary(allResults);
    
    // Save summary to a file
    fs.writeFileSync(
      path.join(resultsDir, 'summary.json'),
      JSON.stringify(summary, null, 2)
    );
    console.log(`Summary saved to ${path.resolve(path.join(resultsDir, 'summary.json'))}`);
    
    // Print summary
    console.log('\n=== Summary of Test Results ===');
    console.log(`Total test cases: ${testCases.length}`);
    console.log(`Total time: ${Date.now() - startTime}ms`);
    console.log('\nResults by LLM and prompt:');
    
    for (const llm of Object.keys(summary.byLlm)) {
      console.log(`\n${llm}:`);
      console.log(`  OLD prompt: Primary codes correct in ${summary.byLlm[llm].oldPrompt.primaryCorrect}/${testCases.length} cases (${(summary.byLlm[llm].oldPrompt.primaryCorrect / testCases.length * 100).toFixed(2)}%)`);
      console.log(`  OLD prompt: CPT codes correct in ${summary.byLlm[llm].oldPrompt.cptCorrect}/${testCases.length} cases (${(summary.byLlm[llm].oldPrompt.cptCorrect / testCases.length * 100).toFixed(2)}%)`);
      console.log(`  NEW prompt: Primary codes correct in ${summary.byLlm[llm].newPrompt.primaryCorrect}/${testCases.length} cases (${(summary.byLlm[llm].newPrompt.primaryCorrect / testCases.length * 100).toFixed(2)}%)`);
      console.log(`  NEW prompt: CPT codes correct in ${summary.byLlm[llm].newPrompt.cptCorrect}/${testCases.length} cases (${(summary.byLlm[llm].newPrompt.cptCorrect / testCases.length * 100).toFixed(2)}%)`);
    }
    
  } catch (error) {
    console.error('Error running tests:', error);
  } finally {
    await closeRedis();
  }
}

/**
 * Generate summary of test results
 * @param {Array} allResults - All test results
 * @returns {Object} - Summary object
 */
function generateSummary(allResults) {
  const summary = {
    totalTestCases: testCases.length,
    byLlm: {}
  };
  
  // Initialize summary for each LLM
  for (const llmConfig of LLM_CONFIGS) {
    summary.byLlm[llmConfig.name] = {
      oldPrompt: {
        primaryCorrect: 0,
        cptCorrect: 0,
        secondaryCorrect: 0
      },
      newPrompt: {
        primaryCorrect: 0,
        cptCorrect: 0,
        secondaryCorrect: 0
      }
    };
  }
  
  // Calculate summary
  for (const testCaseResult of allResults) {
    for (const llmResult of testCaseResult.llmResults) {
      const llm = llmResult.llm;
      
      // Old prompt
      if (llmResult.oldPrompt.codeCheck && llmResult.oldPrompt.codeCheck.primaryCodeFound) {
        summary.byLlm[llm].oldPrompt.primaryCorrect++;
      }
      if (llmResult.oldPrompt.codeCheck && llmResult.oldPrompt.codeCheck.cptCodeFound) {
        summary.byLlm[llm].oldPrompt.cptCorrect++;
      }
      if (llmResult.oldPrompt.codeCheck && llmResult.oldPrompt.codeCheck.secondaryCodesFound) {
        summary.byLlm[llm].oldPrompt.secondaryCorrect += llmResult.oldPrompt.codeCheck.secondaryCodesFound.length;
      }
      
      // New prompt
      if (llmResult.newPrompt.codeCheck && llmResult.newPrompt.codeCheck.primaryCodeFound) {
        summary.byLlm[llm].newPrompt.primaryCorrect++;
      }
      if (llmResult.newPrompt.codeCheck && llmResult.newPrompt.codeCheck.cptCodeFound) {
        summary.byLlm[llm].newPrompt.cptCorrect++;
      }
      if (llmResult.newPrompt.codeCheck && llmResult.newPrompt.codeCheck.secondaryCodesFound) {
        summary.byLlm[llm].newPrompt.secondaryCorrect += llmResult.newPrompt.codeCheck.secondaryCodesFound.length;
      }
    }
  }
  
  return summary;
}

// Run the tests
runTests();