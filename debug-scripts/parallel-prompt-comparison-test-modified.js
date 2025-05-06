/**
 * Parallel Prompt Comparison Test
 * 
 * This script tests both the old and new prompts with the same dictation text
 * in parallel across multiple LLMs including Claude, GPT, and Grok.
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');
const Redis = require('ioredis');

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
 * Get database context from Redis
 * @param {string} dictationText - The dictation text
 * @returns {Promise<string>} - The database context
 */
async function getDatabaseContextFromRedis(dictationText) {
  try {
    if (!redisClient) {
      console.log('Redis client not initialized, using hardcoded context');
      return OLD_DATABASE_CONTEXT;
    }
    
    // Generate a cache key based on the first 20 characters of the dictation
    const cacheKey = `pgcontext:${Buffer.from(dictationText.substring(0, 20)).toString('base64')}`;
    console.log('🔍 Checking Redis cache for database context...');
    console.log('Cache key:', cacheKey);
    
    // Try to get the context from Redis
    const cachedContext = await redisClient.get(cacheKey);
    
    if (cachedContext) {
      console.log('✅ REDIS CACHE HIT - Using cached database context');
      return cachedContext;
    }
    
    console.log('❌ REDIS CACHE MISS - Using hardcoded database context');
    return OLD_DATABASE_CONTEXT;
  } catch (error) {
    console.error('Error getting database context from Redis:', error.message);
    console.log('Using hardcoded context instead');
    return OLD_DATABASE_CONTEXT;
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

// Hemochromatosis case dictation text
const DICTATION_TEXT = "48-year-old female with chronic diarrhea for past 4 months, typically 4-5 loose stools daily. Reports upper right quadrant discomfort after meals. Patient has noted darkening of skin on knuckles and neck folds. Recent lab work shows mildly elevated ferritin and transaminases. Family history significant for father with cirrhosis of \"unknown cause.\" Order abdominal ultrasound to evaluate for possible gallbladder disease.";

// Database context from the old prompt
const OLD_DATABASE_CONTEXT = `REDIS DATABASE CONTEXT:
POSSIBLE DIAGNOSES (from Redis database):
- E83.110: Hereditary hemochromatosis (confidence: 90%)
- E83.4: Disorders of magnesium metabolism (confidence: 80%)
- E83.52: Hypercalcemia (confidence: 80%)
- E83.3: Disorders of phosphorus metabolism and phosphatases (confidence: 80%)
- E83.30: Disorder of phosphorus metabolism, unspecified (confidence: 80%)
- E83.09: Other disorders of copper metabolism (confidence: 80%)

POSSIBLE PROCEDURES (from Redis database):
- 76700: Ultrasound, abdominal, complete (Ultrasound) (confidence: 90%)
- 76705: Ultrasound, abdominal, real time with image documentation; limited (eg, single organ, quadrant, follow-up) (Ultrasound) (confidence: 80%)

No appropriateness mappings found in database.

No medical documentation found in database.`;

// Old prompt template
const OLD_PROMPT = `You are RadValidator, an AI clinical decision support system for radiology order validation.

Your task is to analyze a physician's dictation for a radiology order and produce the following outputs:
1. Extract relevant ICD-10 diagnosis codes
2. Extract or suggest appropriate CPT procedure codes 
3. Validate if the imaging order is clinically appropriate
4. Assign a compliance score from 1-9 (9 being most appropriate)
5. Provide brief educational feedback if the order is inappropriate

The dictation is for a patient with the specialty context: General Radiology.

${OLD_DATABASE_CONTEXT}

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

${OLD_DATABASE_CONTEXT}

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
    model: process.env.CLAUDE_MODEL_NAME || 'claude-3-7-sonnet-20250219',
    apiKey: process.env.ANTHROPIC_API_KEY,
    endpoint: 'https://api.anthropic.com/v1/messages',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    formatRequest: (prompt, dictationText, oldFormat) => ({
      model: process.env.CLAUDE_MODEL_NAME || 'claude-3-7-sonnet-20250219',
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
      ]
    }),
    extractResponse: (response) => {
      if (response.data && response.data.choices && response.data.choices.length > 0) {
        return response.data.choices[0].message.content;
      }
      return JSON.stringify(response.data);
    }
  },
  {
    name: 'Grok',
    model: 'grok-3-beta',
    apiKey: process.env.GROK_API_KEY,
    client: new OpenAI({
      apiKey: process.env.GROK_API_KEY,
      baseURL: 'https://api.x.ai/v1',
    }),
    formatRequest: (prompt, dictationText, oldFormat) => ({
      model: 'grok-3-beta',
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
const resultsDir = path.join(__dirname, 'parallel-prompt-results');
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir);
}

// Function to call LLM API
async function callLLM(llmConfig, prompt, dictationText, oldFormat) {
  try {
    console.log(`Calling ${llmConfig.name} API with ${oldFormat ? 'OLD' : 'NEW'} prompt format...`);
    const startTime = Date.now();
    
    let response;
    
    // Special handling for Grok using OpenAI client
    if (llmConfig.name === 'Grok') {
      const requestParams = llmConfig.formatRequest(prompt, dictationText, oldFormat);
      response = await llmConfig.client.chat.completions.create(requestParams);
    } else {
      // Standard handling for other LLMs
      response = await axios.post(
        llmConfig.endpoint,
        llmConfig.formatRequest(prompt, dictationText, oldFormat),
        { headers: llmConfig.headers }
      );
    }
    
    const responseTime = Date.now() - startTime;
    console.log(`${llmConfig.name} API call completed in ${responseTime}ms`);
    
    return {
      content: llmConfig.extractResponse(response),
      responseTime,
      provider: llmConfig.name,
      model: llmConfig.model
    };
  } catch (error) {
    console.error(`Error calling ${llmConfig.name} API:`, error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.status) {
      console.error('OpenAI error status:', error.status);
      console.error('OpenAI error message:', error.message);
    }
    throw error;
  }
}

// Function to parse LLM response
function parseLLMResponse(response) {
  try {
    // Extract JSON from the response
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || 
                     response.match(/```\n([\s\S]*?)\n```/) || 
                     [null, response];
    
    const jsonStr = jsonMatch[1];
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Error parsing LLM response:', error);
    return {
      error: 'Failed to parse response',
      rawResponse: response
    };
  }
}

// Function to check if hemochromatosis code is present
function checkForHemochromatosis(parsedResponse, oldFormat) {
  const codesArray = oldFormat ? parsedResponse.diagnosisCodes : parsedResponse.suggestedICD10Codes;
  
  if (!codesArray || !Array.isArray(codesArray)) {
    return {
      found: false,
      message: 'No diagnosis codes found in response'
    };
  }
  
  const hemochromatosisCode = codesArray.find(code => code.code === 'E83.110');
  
  return {
    found: !!hemochromatosisCode,
    code: hemochromatosisCode,
    message: hemochromatosisCode ? 
      `Hemochromatosis code E83.110 found${!oldFormat && hemochromatosisCode.isPrimary ? ' (marked as primary)' : ''}` : 
      'Hemochromatosis code E83.110 not found'
  };
}

// Function to process a single test iteration for a specific LLM
async function processIteration(llmConfig, iteration, aggregatedResults, oldPromptOverride = null, newPromptOverride = null) {
  try {
    console.log(`\n=== Testing with ${llmConfig.name} (Iteration ${iteration + 1}) ===`);
    
    const results = {
      llm: llmConfig.name,
      iteration: iteration + 1,
      oldPrompt: null,
      newPrompt: null
    };
    
    // Test with old prompt
    try {
      console.log(`--- Testing ${llmConfig.name} with OLD prompt ---`);
      const promptToUse = oldPromptOverride || OLD_PROMPT;
      const oldPromptResponse = await callLLM(llmConfig, promptToUse, DICTATION_TEXT, true);
      
      // Save raw response to file
      const oldPromptResponsePath = path.join(resultsDir, `${llmConfig.name}_old_prompt_response_${iteration + 1}.txt`);
      fs.writeFileSync(oldPromptResponsePath, oldPromptResponse.content);
      
      // Parse response
      const oldPromptParsed = parseLLMResponse(oldPromptResponse.content);
      
      // Check for hemochromatosis
      const oldPromptHemochromatosisCheck = checkForHemochromatosis(oldPromptParsed, true);
      console.log(`${llmConfig.name} OLD prompt: ${oldPromptHemochromatosisCheck.message}`);
      
      // Update aggregated results
      aggregatedResults.oldPromptResults[llmConfig.name].totalRuns++;
      if (oldPromptHemochromatosisCheck.found) {
        aggregatedResults.oldPromptResults[llmConfig.name].hemochromatosisDetected++;
      }
      
      results.oldPrompt = {
        responseTime: oldPromptResponse.responseTime,
        parsedResponse: oldPromptParsed,
        hemochromatosisCheck: oldPromptHemochromatosisCheck
      };
    } catch (error) {
      console.error(`Error with ${llmConfig.name} OLD prompt:`, error.message);
      results.oldPrompt = { error: error.message };
    }
    
    // Test with new prompt
    try {
      console.log(`--- Testing ${llmConfig.name} with NEW prompt ---`);
      const promptToUse = newPromptOverride || NEW_PROMPT;
      const newPromptResponse = await callLLM(llmConfig, promptToUse, DICTATION_TEXT, false);
      
      // Save raw response to file
      const newPromptResponsePath = path.join(resultsDir, `${llmConfig.name}_new_prompt_response_${iteration + 1}.txt`);
      fs.writeFileSync(newPromptResponsePath, newPromptResponse.content);
      
      // Parse response
      const newPromptParsed = parseLLMResponse(newPromptResponse.content);
      
      // Check for hemochromatosis
      const newPromptHemochromatosisCheck = checkForHemochromatosis(newPromptParsed, false);
      console.log(`${llmConfig.name} NEW prompt: ${newPromptHemochromatosisCheck.message}`);
      
      // Update aggregated results
      aggregatedResults.newPromptResults[llmConfig.name].totalRuns++;
      if (newPromptHemochromatosisCheck.found) {
        aggregatedResults.newPromptResults[llmConfig.name].hemochromatosisDetected++;
      }
      
      results.newPrompt = {
        responseTime: newPromptResponse.responseTime,
        parsedResponse: newPromptParsed,
        hemochromatosisCheck: newPromptHemochromatosisCheck
      };
    } catch (error) {
      console.error(`Error with ${llmConfig.name} NEW prompt:`, error.message);
      results.newPrompt = { error: error.message };
    }
    
    return results;
  } catch (error) {
    console.error(`Error processing ${llmConfig.name} iteration ${iteration + 1}:`, error.message);
    return {
      llm: llmConfig.name,
      iteration: iteration + 1,
      error: error.message
    };
  }
}

// Function to run multiple tests in parallel
async function runParallelTests(iterations = 10, oldPromptOverride = null, newPromptOverride = null) {
  console.log(`Starting ${iterations} iterations of parallel prompt comparison tests...`);
  
  const aggregatedResults = {
    dictationText: DICTATION_TEXT,
    iterations,
    oldPromptResults: {},
    newPromptResults: {},
    allResults: []
  };
  
  // Initialize results for each LLM
  for (const llmConfig of LLM_CONFIGS) {
    aggregatedResults.oldPromptResults[llmConfig.name] = { 
      hemochromatosisDetected: 0, 
      totalRuns: 0 
    };
    aggregatedResults.newPromptResults[llmConfig.name] = { 
      hemochromatosisDetected: 0, 
      totalRuns: 0 
    };
  }
  
  // Create an array of all test tasks
  const allTasks = [];
  for (let i = 0; i < iterations; i++) {
    for (const llmConfig of LLM_CONFIGS) {
      allTasks.push(processIteration(llmConfig, i, aggregatedResults, oldPromptOverride, newPromptOverride));
    }
  }
  
  // Run all tasks in parallel
  console.log(`Running ${allTasks.length} tests in parallel...`);
  const startTime = Date.now();
  const results = await Promise.all(allTasks);
  const totalTime = Date.now() - startTime;
  console.log(`All tests completed in ${totalTime}ms`);
  
  // Add results to aggregated results
  aggregatedResults.allResults = results;
  
  // Calculate detection rates
  for (const llmConfig of LLM_CONFIGS) {
    const oldPromptRate = aggregatedResults.oldPromptResults[llmConfig.name].totalRuns > 0
      ? aggregatedResults.oldPromptResults[llmConfig.name].hemochromatosisDetected / aggregatedResults.oldPromptResults[llmConfig.name].totalRuns
      : 0;
    
    const newPromptRate = aggregatedResults.newPromptResults[llmConfig.name].totalRuns > 0
      ? aggregatedResults.newPromptResults[llmConfig.name].hemochromatosisDetected / aggregatedResults.newPromptResults[llmConfig.name].totalRuns
      : 0;
    
    aggregatedResults.oldPromptResults[llmConfig.name].detectionRate = oldPromptRate;
    aggregatedResults.newPromptResults[llmConfig.name].detectionRate = newPromptRate;
  }
  
  // Save aggregated results
  const aggregatedResultsPath = path.join(resultsDir, 'parallel_aggregated_results.json');
  fs.writeFileSync(aggregatedResultsPath, JSON.stringify(aggregatedResults, null, 2));
  console.log(`\nAggregated results saved to ${aggregatedResultsPath}`);
  
  // Print summary
  console.log('\n=== Summary of Parallel Test Runs ===');
  console.log(`Total iterations: ${iterations}`);
  console.log(`Total time: ${totalTime}ms`);
  
  for (const llmConfig of LLM_CONFIGS) {
    console.log(`\n${llmConfig.name}:`);
    
    const oldPromptResults = aggregatedResults.oldPromptResults[llmConfig.name];
    console.log(`  OLD prompt: Detected hemochromatosis in ${oldPromptResults.hemochromatosisDetected}/${oldPromptResults.totalRuns} runs (${(oldPromptResults.detectionRate * 100).toFixed(2)}%)`);
    
    const newPromptResults = aggregatedResults.newPromptResults[llmConfig.name];
    console.log(`  NEW prompt: Detected hemochromatosis in ${newPromptResults.hemochromatosisDetected}/${newPromptResults.totalRuns} runs (${(newPromptResults.detectionRate * 100).toFixed(2)}%)`);
  }
  
  return aggregatedResults;
}

/**
 * Run parallel tests with Redis integration
 * @param {number} iterations - Number of iterations to run
 */
async function runParallelTestsWithRedis(iterations) {
  try {
    // Initialize Redis
    const redisInitialized = await initRedis();
    console.log(`Redis initialization ${redisInitialized ? 'successful' : 'failed'}`);
    
    // Get database context from Redis if available
    let databaseContext = OLD_DATABASE_CONTEXT;
    if (redisInitialized) {
      try {
        databaseContext = await getDatabaseContextFromRedis(DICTATION_TEXT);
        console.log('Using database context from Redis');
      } catch (error) {
        console.error('Error getting database context from Redis:', error.message);
        console.log('Falling back to hardcoded database context');
      }
    } else {
      console.log('Using hardcoded database context');
    }
    
    // Update prompts with database context
    const oldPromptWithContext = OLD_PROMPT.replace('{{DATABASE_CONTEXT}}', databaseContext);
    const newPromptWithContext = NEW_PROMPT.replace('{{DATABASE_CONTEXT}}', databaseContext);
    
    // Run parallel tests
    const results = await runParallelTests(iterations, oldPromptWithContext, newPromptWithContext);
    
    // Close Redis connection
    if (redisInitialized) {
      await closeRedis();
    }
    
    return results;
  } catch (error) {
    console.error('Error running tests with Redis:', error.message);
    
    // Close Redis connection
    if (redisClient) {
      await closeRedis();
    }
    
    throw error;
  }
}

// Run parallel tests with Redis integration
runParallelTestsWithRedis(10).catch(error => {
  console.error('Error running tests:', error.message);
});