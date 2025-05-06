/**
 * Redis-LLM Validation Test
 * 
 * This script tests the validation flow by:
 * 1. Extracting keywords from dictation text
 * 2. Using Redis to get database context (like the production system)
 * 3. Directly calling LLM APIs with the context
 * 4. Comparing results across different LLMs and prompts
 * 
 * This allows testing different prompts without redeploying the API.
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');
const Redis = require('ioredis');

// Load environment variables
dotenv.config({ path: '.env.production' });

// Initialize Redis client
let redisClient = null;

// Initialize OpenAI client for Grok
const grokClient = new OpenAI({
  apiKey: process.env.GROK_API_KEY,
  baseURL: 'https://api.x.ai/v1',
});

// Test case - the hemochromatosis case
const DICTATION_TEXT = "48-year-old female with chronic diarrhea for past 4 months, typically 4-5 loose stools daily. Reports upper right quadrant discomfort after meals. Patient has noted darkening of skin on knuckles and neck folds. Recent lab work shows mildly elevated ferritin and transaminases. Family history significant for father with cirrhosis of \"unknown cause.\" Order abdominal ultrasound to evaluate for possible gallbladder disease.";

// Prompts to test
const OLD_PROMPT = fs.readFileSync(path.join(__dirname, 'prompts', 'old_prompt.txt'), 'utf8');
const NEW_PROMPT = fs.readFileSync(path.join(__dirname, 'prompts', 'new_prompt.txt'), 'utf8');

// LLM configurations
const LLM_CONFIGS = [
  {
    name: 'Claude',
    model: process.env.CLAUDE_MODEL_NAME || 'claude-3-sonnet-20240229',
    apiKey: process.env.CLAUDE_API_KEY,
    endpoint: 'https://api.anthropic.com/v1/messages',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    formatRequest: (prompt, dictationText, databaseContext, oldFormat) => ({
      model: process.env.CLAUDE_MODEL_NAME || 'claude-3-sonnet-20240229',
      max_tokens: 4000,
      system: prompt.replace('{{DATABASE_CONTEXT}}', databaseContext),
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
    formatRequest: (prompt, dictationText, databaseContext, oldFormat) => ({
      model: process.env.GPT_MODEL_NAME || 'gpt-4-turbo',
      messages: [
        { role: 'system', content: prompt.replace('{{DATABASE_CONTEXT}}', databaseContext) },
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
    client: grokClient,
    formatRequest: (prompt, dictationText, databaseContext, oldFormat) => ({
      model: 'grok-3-beta',
      messages: [
        { role: 'system', content: prompt.replace('{{DATABASE_CONTEXT}}', databaseContext) },
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
const resultsDir = path.join(__dirname, 'redis-llm-results');
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir);
}

/**
 * Initialize Redis client
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
 * @param {string} dictationText - The dictation text to extract keywords from
 * @returns {string[]} - Array of extracted keywords
 */
function extractKeywords(dictationText) {
  // Simple keyword extraction - split by spaces and punctuation
  const words = dictationText.toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ")
    .split(/\s+/)
    .filter(word => word.length > 3); // Filter out short words
  
  console.log('Extracted keywords:', words);
  return words;
}

/**
 * Get database context from Redis
 * @param {string} dictationText - The dictation text
 * @returns {Promise<string>} - The database context
 */
async function getDatabaseContext(dictationText) {
  try {
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
    
    console.log('❌ REDIS CACHE MISS - Generating fresh database context');
    
    // If not in cache, we would normally generate it from the database
    // For this test, we'll use a hardcoded context similar to what we saw in the logs
    const hardcodedContext = `POSTGRESQL DATABASE CONTEXT:
POSSIBLE DIAGNOSES (from PostgreSQL database):
- C47.4: Malignant neoplasm of peripheral nerves of abdomen (confidence: 80%)
- C49.4: Malignant neoplasm of connective and soft tissue of abdomen (confidence: 80%)
- C76.2: Malignant neoplasm of abdomen (confidence: 80%)
- D21.4: Benign neoplasm of connective and other soft tissue of abdomen (confidence: 80%)
- D36.15: Benign neoplasm of peripheral nerves and autonomic nervous system of abdomen (confidence: 80%)
- M79.A3: Nontraumatic compartment syndrome of abdomen (confidence: 80%)
- M99.09: Segmental and somatic dysfunction of abdomen and other regions (confidence: 80%)
- M99.19: Subluxation complex (vertebral) of abdomen and other regions (confidence: 80%)
- M99.29: Subluxation stenosis of neural canal of abdomen and other regions (confidence: 80%)
- M99.39: Osseous stenosis of neural canal of abdomen and other regions (confidence: 80%)

POSSIBLE PROCEDURES (from PostgreSQL database):
- 76376: 3D rendering with interpretation and reporting of computed tomography, magnetic resonance imaging, ultrasound, or other tomographic modality with image postprocessing under concurrent supervision; not requiring image postprocessing on an independent workstation (Multiple (CT, MRI, Ultrasound, or other tomographic modality)) (confidence: 80%)
- 76881: Ultrasound, extremity, nonvascular, real-time with image documentation; complete (Ultrasound) (confidence: 80%)
- 76700: Ultrasound, abdominal, complete (Ultrasound) (confidence: 80%)
- 76705: Ultrasound, abdominal, real time with image documentation; limited (eg, single organ, quadrant, follow-up) (Ultrasound) (confidence: 80%)
- 76770: Ultrasound, retroperitoneal (e.g., renal, aorta, nodes), real time with image documentation; complete (Ultrasound) (confidence: 80%)
- 76775: Ultrasound, retroperitoneal; limited (Ultrasound) (confidence: 80%)
- 76776: Ultrasound, transplanted kidney, real time and duplex Doppler with image documentation (Ultrasound) (confidence: 80%)
- 76801: Ultrasound, pregnant uterus, real time with image documentation, fetal and maternal evaluation, first trimester (< 14 weeks 0 days), transabdominal approach; single or first gestation (Ultrasound) (confidence: 80%)
- 76802: Ultrasound, pregnant uterus, real time with image documentation, fetal and maternal evaluation, after first trimester (> or = 14 weeks 0 days), transabdominal approach; each additional gestation (List separately in addition to code for primary procedure) (Ultrasound) (confidence: 80%)
- 76805: Ultrasound, pregnant uterus, real time with image documentation, fetal and maternal evaluation, after first trimester (> or = 14 weeks 0 days), transabdominal approach; single or first gestation (Ultrasound) (confidence: 80%)

No appropriateness mappings found in database.

No medical documentation found in database.`;
    
    // Cache the context in Redis for future use
    await redisClient.set(cacheKey, hardcodedContext, 'EX', 3600); // 1 hour expiration
    console.log('💾 Cached database context in Redis for future use');
    
    return hardcodedContext;
  } catch (error) {
    console.error('Error getting database context:', error.message);
    return 'Error generating database context. Please try again later.';
  }
}

/**
 * Call LLM API
 * @param {Object} llmConfig - The LLM configuration
 * @param {string} prompt - The prompt template
 * @param {string} dictationText - The dictation text
 * @param {string} databaseContext - The database context
 * @param {boolean} oldFormat - Whether to use the old format
 * @returns {Promise<Object>} - The LLM response
 */
async function callLLM(llmConfig, prompt, dictationText, databaseContext, oldFormat) {
  try {
    console.log(`Calling ${llmConfig.name} API with ${oldFormat ? 'OLD' : 'NEW'} prompt format...`);
    const startTime = Date.now();
    
    let response;
    
    // Special handling for Grok using OpenAI client
    if (llmConfig.name === 'Grok') {
      const requestParams = llmConfig.formatRequest(prompt, dictationText, databaseContext, oldFormat);
      response = await llmConfig.client.chat.completions.create(requestParams);
    } else {
      // Standard handling for other LLMs
      response = await axios.post(
        llmConfig.endpoint,
        llmConfig.formatRequest(prompt, dictationText, databaseContext, oldFormat),
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

/**
 * Parse LLM response
 * @param {string} response - The LLM response
 * @returns {Object} - The parsed response
 */
function parseLLMResponse(response) {
  try {
    // Extract JSON from the response
    let jsonStr = response;
    
    // Handle responses that might have markdown code blocks
    if (response.includes('```json')) {
      jsonStr = response.split('```json')[1].split('```')[0].trim();
    } else if (response.includes('```')) {
      jsonStr = response.split('```')[1].split('```')[0].trim();
    }
    
    // Parse the JSON
    const parsedResponse = JSON.parse(jsonStr);
    return parsedResponse;
  } catch (error) {
    console.error('Error parsing LLM response:', error.message);
    console.error('Raw response:', response);
    return { error: 'Failed to parse response', raw: response };
  }
}

/**
 * Check if the response contains hemochromatosis code
 * @param {Object} parsedResponse - The parsed LLM response
 * @param {boolean} oldFormat - Whether the response is in the old format
 * @returns {boolean} - Whether the response contains hemochromatosis code
 */
function checkForHemochromatosis(parsedResponse, oldFormat) {
  try {
    const hemochromatosisCode = 'E83.110';
    
    if (oldFormat) {
      // Check in diagnosisCodes array
      if (parsedResponse.diagnosisCodes && Array.isArray(parsedResponse.diagnosisCodes)) {
        return parsedResponse.diagnosisCodes.some(code => 
          code.code === hemochromatosisCode || 
          code.code === 'E83.11' || 
          code.description?.toLowerCase().includes('hemochromatosis')
        );
      }
    } else {
      // Check in suggestedICD10Codes array
      if (parsedResponse.suggestedICD10Codes && Array.isArray(parsedResponse.suggestedICD10Codes)) {
        return parsedResponse.suggestedICD10Codes.some(code => 
          code.code === hemochromatosisCode || 
          code.code === 'E83.11' || 
          code.description?.toLowerCase().includes('hemochromatosis')
        );
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error checking for hemochromatosis:', error.message);
    return false;
  }
}

/**
 * Save response to file
 * @param {string} provider - The LLM provider
 * @param {string} format - The format (old or new)
 * @param {number} iteration - The iteration number
 * @param {string} content - The response content
 */
function saveResponseToFile(provider, format, iteration, content) {
  const fileName = `${provider}_${format}_prompt_response_${iteration}.txt`;
  const filePath = path.join(resultsDir, fileName);
  fs.writeFileSync(filePath, content);
  console.log(`Saved ${provider} ${format} prompt response to ${fileName}`);
}

/**
 * Run the test
 */
async function runTest() {
  try {
    // Initialize Redis
    const redisInitialized = await initRedis();
    if (!redisInitialized) {
      console.error('Failed to initialize Redis. Exiting...');
      return;
    }
    
    // Extract keywords from dictation text
    const keywords = extractKeywords(DICTATION_TEXT);
    
    // Get database context from Redis
    const databaseContext = await getDatabaseContext(DICTATION_TEXT);
    
    // Create directories for results
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir);
    }
    
    // Run tests for each LLM with both prompts
    const results = {
      dictationText: DICTATION_TEXT,
      oldPromptResults: {},
      newPromptResults: {},
      allResults: []
    };
    
    // Number of iterations to run
    const iterations = 5;
    
    console.log(`Starting ${iterations} iterations of Redis-LLM validation tests...`);
    
    for (let i = 1; i <= iterations; i++) {
      console.log(`\n=== Iteration ${i} ===`);
      
      for (const llmConfig of LLM_CONFIGS) {
        // Test with old prompt
        console.log(`\n--- Testing ${llmConfig.name} with OLD prompt ---`);
        try {
          const oldPromptResponse = await callLLM(llmConfig, OLD_PROMPT, DICTATION_TEXT, databaseContext, true);
          const parsedOldResponse = parseLLMResponse(oldPromptResponse.content);
          const hasHemochromatosisOld = checkForHemochromatosis(parsedOldResponse, true);
          
          console.log(`${llmConfig.name} OLD prompt: Hemochromatosis code E83.110 ${hasHemochromatosisOld ? 'found' : 'not found'}`);
          
          // Save response to file
          saveResponseToFile(llmConfig.name, 'old', i, oldPromptResponse.content);
          
          // Add to results
          if (!results.oldPromptResults[llmConfig.name]) {
            results.oldPromptResults[llmConfig.name] = {
              hemochromatosisDetected: 0,
              totalRuns: 0,
              detectionRate: 0
            };
          }
          
          results.oldPromptResults[llmConfig.name].totalRuns++;
          if (hasHemochromatosisOld) {
            results.oldPromptResults[llmConfig.name].hemochromatosisDetected++;
          }
          results.oldPromptResults[llmConfig.name].detectionRate = 
            results.oldPromptResults[llmConfig.name].hemochromatosisDetected / 
            results.oldPromptResults[llmConfig.name].totalRuns;
          
          results.allResults.push({
            llm: llmConfig.name,
            promptType: 'old',
            iteration: i,
            responseTime: oldPromptResponse.responseTime,
            hasHemochromatosis: hasHemochromatosisOld,
            response: parsedOldResponse
          });
        } catch (error) {
          console.error(`Error testing ${llmConfig.name} with OLD prompt:`, error.message);
        }
        
        // Test with new prompt
        console.log(`\n--- Testing ${llmConfig.name} with NEW prompt ---`);
        try {
          const newPromptResponse = await callLLM(llmConfig, NEW_PROMPT, DICTATION_TEXT, databaseContext, false);
          const parsedNewResponse = parseLLMResponse(newPromptResponse.content);
          const hasHemochromatosisNew = checkForHemochromatosis(parsedNewResponse, false);
          
          console.log(`${llmConfig.name} NEW prompt: Hemochromatosis code E83.110 ${hasHemochromatosisNew ? 'found' : 'not found'}`);
          
          // Save response to file
          saveResponseToFile(llmConfig.name, 'new', i, newPromptResponse.content);
          
          // Add to results
          if (!results.newPromptResults[llmConfig.name]) {
            results.newPromptResults[llmConfig.name] = {
              hemochromatosisDetected: 0,
              totalRuns: 0,
              detectionRate: 0
            };
          }
          
          results.newPromptResults[llmConfig.name].totalRuns++;
          if (hasHemochromatosisNew) {
            results.newPromptResults[llmConfig.name].hemochromatosisDetected++;
          }
          results.newPromptResults[llmConfig.name].detectionRate = 
            results.newPromptResults[llmConfig.name].hemochromatosisDetected / 
            results.newPromptResults[llmConfig.name].totalRuns;
          
          results.allResults.push({
            llm: llmConfig.name,
            promptType: 'new',
            iteration: i,
            responseTime: newPromptResponse.responseTime,
            hasHemochromatosis: hasHemochromatosisNew,
            response: parsedNewResponse
          });
        } catch (error) {
          console.error(`Error testing ${llmConfig.name} with NEW prompt:`, error.message);
        }
      }
    }
    
    // Save aggregated results
    const resultsFilePath = path.join(resultsDir, 'redis_llm_aggregated_results.json');
    fs.writeFileSync(resultsFilePath, JSON.stringify(results, null, 2));
    console.log(`\nAggregated results saved to ${resultsFilePath}`);
    
    // Print summary
    console.log('\n=== Summary of Redis-LLM Test Runs ===');
    console.log(`Total iterations: ${iterations}`);
    
    for (const llm of Object.keys(results.oldPromptResults)) {
      console.log(`\n${llm}:`);
      console.log(`  OLD prompt: Detected hemochromatosis in ${results.oldPromptResults[llm].hemochromatosisDetected}/${results.oldPromptResults[llm].totalRuns} runs (${(results.oldPromptResults[llm].detectionRate * 100).toFixed(2)}%)`);
      console.log(`  NEW prompt: Detected hemochromatosis in ${results.newPromptResults[llm].hemochromatosisDetected}/${results.newPromptResults[llm].totalRuns} runs (${(results.newPromptResults[llm].detectionRate * 100).toFixed(2)}%)`);
    }
    
    // Close Redis connection
    if (redisClient) {
      await redisClient.quit();
      console.log('Redis connection closed');
    }
  } catch (error) {
    console.error('Error running test:', error.message);
    
    // Close Redis connection
    if (redisClient) {
      await redisClient.quit();
      console.log('Redis connection closed');
    }
  }
}

// Create prompts directory and save prompts
const promptsDir = path.join(__dirname, 'prompts');
if (!fs.existsSync(promptsDir)) {
  fs.mkdirSync(promptsDir);
}

// Save old prompt
fs.writeFileSync(path.join(promptsDir, 'old_prompt.txt'), `You are RadValidator, an AI clinical decision support system for radiology order validation.

Your task is to analyze a physician's dictation for a radiology order and produce the following outputs:
1. Extract relevant ICD-10 diagnosis codes
2. Extract or suggest appropriate CPT procedure codes 
3. Validate if the imaging order is clinically appropriate
4. Assign a compliance score from 1-9 (9 being most appropriate)
5. Provide brief educational feedback if the order is inappropriate

The dictation is for a patient with the specialty context: General Radiology.

{{DATABASE_CONTEXT}}

IMPORTANT GUIDELINES:
- Validate based on ACR Appropriateness Criteria and evidence-based guidelines
- For inappropriate orders, suggest alternative approaches
- For spine imaging, MRI without contrast is usually sufficient for disc evaluation
- Acute low back pain (<6 weeks) without red flags should be managed conservatively
- Red flags include: trauma, cancer history, neurological deficits, infection signs

Only use contrast when there is a specific indication (infection, tumor, post-surgical).`);

// Save new prompt
fs.writeFileSync(path.join(promptsDir, 'new_prompt.txt'), `You are RadValidator, an AI clinical decision support system for radiology order validation.

Your task is to analyze a physician's dictation for a radiology order and produce the following outputs:
1. Extract relevant ICD-10 diagnosis codes (with one designated as primary)
2. Extract or suggest appropriate CPT procedure codes 
3. Validate if the imaging order is clinically appropriate
4. Assign a compliance score from 1-9 (9 being most appropriate)
5. Determine if the order should be prioritized as STAT
6. Provide brief educational feedback if the order is inappropriate

The dictation is for a patient with the specialty context: General Radiology.

{{DATABASE_CONTEXT}}

IMPORTANT CODING RULES:
- Only code conditions explicitly stated in the dictation
- Do not code suspected conditions unless clearly indicated
- Assign the most specific code available for each condition
- Designate one code as primary (the main reason for imaging)
- For each code, include the official ICD-10 description

IMPORTANT GUIDELINES:
- Validate based on ACR Appropriateness Criteria and evidence-based guidelines
- For inappropriate orders, suggest alternative approaches
- For spine imaging, MRI without contrast is usually sufficient for disc evaluation
- Acute low back pain (<6 weeks) without red flags should be managed conservatively
- Red flags include: trauma, cancer history, neurological deficits, infection signs

Only use contrast when there is a specific indication (infection, tumor, post-surgical).`);

// Run the test
runTest();