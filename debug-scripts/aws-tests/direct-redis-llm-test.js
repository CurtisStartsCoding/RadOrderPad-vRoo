/**
 * Direct Redis LLM Test
 * 
 * This script connects directly to Redis, performs searches with the same keywords,
 * and tests different LLMs with the data retrieved directly from Redis.
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const redis = require('redis');
const axios = require('axios');

// Load environment variables from .env.production
dotenv.config({ path: '.env.production' });

// Redis connection configuration
const redisConfig = {
  host: process.env.REDIS_CLOUD_HOST,
  port: process.env.REDIS_CLOUD_PORT,
  password: process.env.REDIS_CLOUD_PASSWORD,
  tls: true
};

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
    formatRequest: (prompt) => ({
      model: process.env.CLAUDE_MODEL_NAME || 'claude-3-7-sonnet-20250219',
      max_tokens: 4000,
      messages: [
        { role: 'user', content: prompt }
      ]
    }),
    extractResponse: (response) => response.data.content[0].text
  },
  {
    name: 'Grok',
    model: process.env.GROK_MODEL_NAME || 'grok-3-latest',
    apiKey: process.env.GROK_API_KEY,
    endpoint: 'https://api.xai.com/v1/chat/completions',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROK_API_KEY}`
    },
    formatRequest: (prompt) => ({
      model: process.env.GROK_MODEL_NAME || 'grok-3-latest',
      messages: [
        { role: 'user', content: prompt }
      ]
    }),
    extractResponse: (response) => response.data.choices[0].message.content
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
    formatRequest: (prompt) => ({
      model: process.env.GPT_MODEL_NAME || 'gpt-4-turbo',
      messages: [
        { role: 'user', content: prompt }
      ]
    }),
    extractResponse: (response) => response.data.choices[0].message.content
  }
];

// Test cases - medical scenarios
const TEST_CASES = [
  {
    name: 'Hemochromatosis',
    dictationText: "48-year-old female with chronic diarrhea for past 4 months, typically 4-5 loose stools daily. Reports upper right quadrant discomfort after meals. Patient has noted darkening of skin on knuckles and neck folds. Recent lab work shows mildly elevated ferritin and transaminases. Family history significant for father with cirrhosis of \"unknown cause.\" Order abdominal ultrasound to evaluate for possible gallbladder disease.",
    expectedDiagnoses: ['E83.110', 'K74.60', 'R10.13', 'R19.7'],
    expectedProcedures: ['76700']
  }
];

// Create results directory if it doesn't exist
const resultsDir = path.join(__dirname, 'redis-direct-test-results');
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir);
}

// Function to measure execution time
function measureExecutionTime(startTime) {
  return (Date.now() - startTime);
}

// Function to extract keywords from text
function extractKeywords(text) {
  // Simple keyword extraction based on common medical terms
  const keywords = [];
  const terms = [
    // Anatomy terms
    'abdomen', 'abdominal', 'liver', 'gallbladder', 'skin', 'knuckles', 'neck', 'folds',
    // Symptoms
    'pain', 'discomfort', 'diarrhea', 'chronic', 'loose', 'stools', 'darkening',
    // Lab findings
    'ferritin', 'transaminases', 'elevated',
    // Family history
    'cirrhosis', 'family', 'history',
    // Procedures
    'ultrasound'
  ];
  
  const lowerText = text.toLowerCase();
  terms.forEach(term => {
    if (lowerText.includes(term)) {
      keywords.push(term);
    }
  });
  
  return keywords;
}

// Function to process search terms for Redis
function processSearchTerms(keywords) {
  return keywords.map(kw => kw.replace(/[^a-zA-Z0-9]/g, ' ')).join('|');
}

// Function to search ICD-10 codes in Redis
async function searchICD10Codes(client, keywords) {
  try {
    const searchTerms = processSearchTerms(keywords);
    console.log(`Searching ICD-10 codes with terms: ${searchTerms}`);
    
    // Execute FT.SEARCH command
    const result = await client.ft.search('icd10_index', searchTerms, {
      LIMIT: { from: 0, size: 20 },
      RETURN: ['$.icd10_code', '$.description', '$.clinical_notes', '$.imaging_modalities', '$.primary_imaging'],
      WITHSCORES: true
    });
    
    console.log(`Found ${result.total} ICD-10 codes`);
    
    // Process results
    const icd10Codes = [];
    for (const doc of result.documents) {
      icd10Codes.push({
        icd10_code: doc.value.$.icd10_code,
        description: doc.value.$.description,
        clinical_notes: doc.value.$?.clinical_notes,
        imaging_modalities: doc.value.$?.imaging_modalities,
        primary_imaging: doc.value.$?.primary_imaging,
        score: doc.score
      });
    }
    
    return icd10Codes;
  } catch (error) {
    console.error('Error searching ICD-10 codes:', error);
    return [];
  }
}

// Function to search CPT codes in Redis
async function searchCPTCodes(client, keywords) {
  try {
    const searchTerms = processSearchTerms(keywords);
    console.log(`Searching CPT codes with terms: ${searchTerms}`);
    
    // Execute FT.SEARCH command
    const result = await client.ft.search('cpt_index', searchTerms, {
      LIMIT: { from: 0, size: 20 },
      RETURN: ['$.cpt_code', '$.description', '$.modality', '$.body_part'],
      WITHSCORES: true
    });
    
    console.log(`Found ${result.total} CPT codes`);
    
    // Process results
    const cptCodes = [];
    for (const doc of result.documents) {
      cptCodes.push({
        cpt_code: doc.value.$.cpt_code,
        description: doc.value.$.description,
        modality: doc.value.$?.modality,
        body_part: doc.value.$?.body_part,
        score: doc.score
      });
    }
    
    return cptCodes;
  } catch (error) {
    console.error('Error searching CPT codes:', error);
    return [];
  }
}

// Function to get mappings between ICD-10 and CPT codes
async function getMappings(client, icd10Codes) {
  try {
    const mappings = [];
    
    // Get mappings for each ICD-10 code
    for (const icd10 of icd10Codes.slice(0, 5)) {
      console.log(`Getting mappings for ICD-10 code: ${icd10.icd10_code}`);
      
      // Execute FT.SEARCH command
      const result = await client.ft.search('mapping_index', `@icd10_code:{${icd10.icd10_code}}`, {
        LIMIT: { from: 0, size: 10 },
        RETURN: ['$.icd10_code', '$.cpt_code', '$.appropriateness_score', '$.evidence_source', '$.refined_justification'],
        WITHSCORES: true
      });
      
      console.log(`Found ${result.total} mappings for ${icd10.icd10_code}`);
      
      // Process results
      for (const doc of result.documents) {
        mappings.push({
          icd10_code: doc.value.$.icd10_code,
          cpt_code: doc.value.$.cpt_code,
          appropriateness_score: doc.value.$?.appropriateness_score,
          evidence_source: doc.value.$?.evidence_source,
          refined_justification: doc.value.$?.refined_justification,
          score: doc.score
        });
      }
    }
    
    return mappings;
  } catch (error) {
    console.error('Error getting mappings:', error);
    return [];
  }
}

// Function to get markdown docs for ICD-10 codes
async function getMarkdownDocs(client, icd10Codes) {
  try {
    const docs = [];
    
    // Get markdown docs for each ICD-10 code
    for (const icd10 of icd10Codes.slice(0, 5)) {
      console.log(`Getting markdown docs for ICD-10 code: ${icd10.icd10_code}`);
      
      // Execute FT.SEARCH command
      const result = await client.ft.search('markdown_index', `@icd10_code:{${icd10.icd10_code}}`, {
        LIMIT: { from: 0, size: 5 },
        RETURN: ['$.icd10_code', '$.content'],
        WITHSCORES: true
      });
      
      console.log(`Found ${result.total} markdown docs for ${icd10.icd10_code}`);
      
      // Process results
      for (const doc of result.documents) {
        docs.push({
          icd10_code: doc.value.$.icd10_code,
          content: doc.value.$.content,
          score: doc.score
        });
      }
    }
    
    return docs;
  } catch (error) {
    console.error('Error getting markdown docs:', error);
    return [];
  }
}

// Function to format database context
function formatDatabaseContext(icd10Codes, cptCodes, mappings, markdownDocs) {
  // Format diagnoses
  const diagnosesSection = icd10Codes.length > 0
    ? `POSSIBLE DIAGNOSES (from Redis database):
${icd10Codes.map(d => 
  `- ${d.icd10_code}: ${d.description} (confidence: ${Math.round((d.score || 0.5) * 100)}%)`
).join('\n')}`
    : 'No relevant diagnoses found in database.';

  // Format procedures
  const proceduresSection = cptCodes.length > 0
    ? `POSSIBLE PROCEDURES (from Redis database):
${cptCodes.map(p => 
  `- ${p.cpt_code}: ${p.description} (${p.modality || 'modality unknown'}) (confidence: ${Math.round((p.score || 0.5) * 100)}%)`
).join('\n')}`
    : 'No relevant procedures found in database.';

  // Format appropriateness mappings
  const mappingsSection = mappings.length > 0
    ? `APPROPRIATENESS MAPPINGS (from ACR guidelines in Redis):
${mappings.map(m => 
  `- ${m.icd10_code} + ${m.cpt_code}:
  * Score: ${m.appropriateness_score}/9 (${m.appropriateness_score >= 7 ? 'Usually Appropriate' : m.appropriateness_score >= 4 ? 'May Be Appropriate' : 'Rarely Appropriate'})
  * Evidence: ${m.evidence_source || 'Not specified'}
  * Justification: ${m.refined_justification || 'Not specified'}`
).join('\n\n')}`
    : 'No appropriateness mappings found in database.';

  // Format the markdown documentation
  const markdownSection = markdownDocs && markdownDocs.length > 0
    ? `MEDICAL DOCUMENTATION (from Redis guidelines):
${markdownDocs.map(doc => 
  `--- DOCUMENTATION FOR ${doc.icd10_code} ---
${doc.content}`
).join('\n\n')}`
    : 'No medical documentation found in database.';

  return `
REDIS DATABASE CONTEXT:
${diagnosesSection}

${proceduresSection}

${mappingsSection}

${markdownSection}
`;
}

// Function to construct prompt for LLM
function constructPrompt(dictationText, databaseContext) {
  return `You are RadValidator, an AI clinical decision support system for radiology order validation.

Your task is to analyze a physician's dictation for a radiology order and produce the following outputs:
1. Extract relevant ICD-10 diagnosis codes
2. Extract or suggest appropriate CPT procedure codes 
3. Validate if the imaging order is clinically appropriate
4. Assign a compliance score from 1-9 (9 being most appropriate)
5. Provide brief educational feedback if the order is inappropriate

The dictation is for a patient with the specialty context: General Radiology.

${databaseContext}

IMPORTANT GUIDELINES:
- Validate based on ACR Appropriateness Criteria and evidence-based guidelines
- For inappropriate orders, suggest alternative approaches
- For spine imaging, MRI without contrast is usually sufficient for disc evaluation
- Acute low back pain (<6 weeks) without red flags should be managed conservatively
- Red flags include: trauma, cancer history, neurological deficits, infection signs

Only use contrast when there is a specific indication (infection, tumor, post-surgical).

Please analyze this radiology order dictation:

"${dictationText}"

Respond in JSON format with these fields:
- diagnosisCodes: Array of {code, description} objects
- procedureCodes: Array of {code, description} objects
- validationStatus: "appropriate" or "inappropriate"
- complianceScore: Number 1-9
- feedback: Brief educational note for inappropriate orders (33 words target length for General Radiology)`;
}

// Function to call LLM API
async function callLLM(llmConfig, prompt) {
  try {
    console.log(`Calling ${llmConfig.name} API...`);
    const startTime = Date.now();
    
    const response = await axios.post(
      llmConfig.endpoint,
      llmConfig.formatRequest(prompt),
      { headers: llmConfig.headers }
    );
    
    const responseTime = measureExecutionTime(startTime);
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
      diagnosisCodes: [],
      procedureCodes: [],
      validationStatus: 'unknown',
      complianceScore: 0,
      feedback: 'Error parsing response'
    };
  }
}

// Function to evaluate diagnosis code accuracy
function evaluateDiagnosisAccuracy(result, expectedCodes) {
  if (!result.diagnosisCodes) {
    return { accuracy: 0, found: [], missing: expectedCodes, unexpected: [] };
  }
  
  const suggestedCodes = result.diagnosisCodes.map(code => code.code);
  const found = expectedCodes.filter(code => suggestedCodes.includes(code));
  const missing = expectedCodes.filter(code => !suggestedCodes.includes(code));
  const unexpected = suggestedCodes.filter(code => !expectedCodes.includes(code));
  
  const accuracy = found.length / expectedCodes.length;
  
  return { accuracy, found, missing, unexpected };
}

// Function to evaluate procedure code accuracy
function evaluateProcedureAccuracy(result, expectedCodes) {
  if (!result.procedureCodes) {
    return { accuracy: 0, found: [], missing: expectedCodes, unexpected: [] };
  }
  
  const suggestedCodes = result.procedureCodes.map(code => code.code);
  const found = expectedCodes.filter(code => suggestedCodes.includes(code));
  const missing = expectedCodes.filter(code => !suggestedCodes.includes(code));
  const unexpected = suggestedCodes.filter(code => !expectedCodes.includes(code));
  
  const accuracy = found.length / expectedCodes.length;
  
  return { accuracy, found, missing, unexpected };
}

// Main function to run the test
async function runTest() {
  console.log('Starting direct Redis LLM test...');
  console.log(`Redis host: ${redisConfig.host}`);
  console.log(`Redis port: ${redisConfig.port}`);
  
  try {
    // Create Redis client
    console.log('Connecting to Redis...');
    const client = redis.createClient({
      url: `rediss://:${redisConfig.password}@${redisConfig.host}:${redisConfig.port}`
    });
    
    // Connect to Redis
    await client.connect();
    console.log('Connected to Redis successfully');
    
    // Test Redis connection
    const pingResult = await client.ping();
    console.log(`Redis ping result: ${pingResult}`);
    
    // Process each test case
    for (const testCase of TEST_CASES) {
      console.log(`\n=== Processing test case: ${testCase.name} ===`);
      
      // Extract keywords from dictation text
      const keywords = extractKeywords(testCase.dictationText);
      console.log(`Extracted ${keywords.length} keywords: ${keywords.join(', ')}`);
      
      // Search for ICD-10 codes
      const startTime = Date.now();
      const icd10Codes = await searchICD10Codes(client, keywords);
      console.log(`Found ${icd10Codes.length} ICD-10 codes in ${measureExecutionTime(startTime)}ms`);
      
      // Search for CPT codes
      const cptCodes = await searchCPTCodes(client, keywords);
      console.log(`Found ${cptCodes.length} CPT codes`);
      
      // Get mappings
      const mappings = await getMappings(client, icd10Codes);
      console.log(`Found ${mappings.length} mappings`);
      
      // Get markdown docs
      const markdownDocs = await getMarkdownDocs(client, icd10Codes);
      console.log(`Found ${markdownDocs.length} markdown docs`);
      
      // Format database context
      const databaseContext = formatDatabaseContext(icd10Codes, cptCodes, mappings, markdownDocs);
      
      // Save database context to file
      const contextPath = path.join(resultsDir, `${testCase.name.replace(/\s+/g, '_')}_context.txt`);
      fs.writeFileSync(contextPath, databaseContext);
      console.log(`Database context saved to ${contextPath}`);
      
      // Construct prompt for LLM
      const prompt = constructPrompt(testCase.dictationText, databaseContext);
      
      // Save prompt to file
      const promptPath = path.join(resultsDir, `${testCase.name.replace(/\s+/g, '_')}_prompt.txt`);
      fs.writeFileSync(promptPath, prompt);
      console.log(`Prompt saved to ${promptPath}`);
      
      // Test with each LLM
      for (const llmConfig of LLM_CONFIGS) {
        try {
          console.log(`\n=== Testing with ${llmConfig.name} ===`);
          
          // Call LLM API
          const llmResponse = await callLLM(llmConfig, prompt);
          
          // Save raw response to file
          const responsePath = path.join(resultsDir, `${testCase.name.replace(/\s+/g, '_')}_${llmConfig.name}_response.txt`);
          fs.writeFileSync(responsePath, llmResponse.content);
          console.log(`Raw response saved to ${responsePath}`);
          
          // Parse LLM response
          const parsedResponse = parseLLMResponse(llmResponse.content);
          
          // Evaluate accuracy
          const diagnosisAccuracy = evaluateDiagnosisAccuracy(parsedResponse, testCase.expectedDiagnoses);
          const procedureAccuracy = evaluateProcedureAccuracy(parsedResponse, testCase.expectedProcedures);
          
          console.log(`Diagnosis accuracy: ${(diagnosisAccuracy.accuracy * 100).toFixed(2)}%`);
          console.log(`Procedure accuracy: ${(procedureAccuracy.accuracy * 100).toFixed(2)}%`);
          
          // Save results
          const result = {
            testCase: testCase.name,
            llm: llmConfig.name,
            model: llmConfig.model,
            responseTime: llmResponse.responseTime,
            keywords,
            keywordCount: keywords.length,
            icd10Codes,
            cptCodes,
            mappings,
            markdownDocs,
            diagnosisAccuracy,
            procedureAccuracy,
            parsedResponse
          };
          
          // Save to file
          const resultPath = path.join(resultsDir, `${testCase.name.replace(/\s+/g, '_')}_${llmConfig.name}_result.json`);
          fs.writeFileSync(resultPath, JSON.stringify(result, null, 2));
          console.log(`Result saved to ${resultPath}`);
        } catch (error) {
          console.error(`Error testing with ${llmConfig.name}:`, error.message);
        }
      }
    }
    
    // Disconnect from Redis
    await client.disconnect();
    console.log('Disconnected from Redis');
    
  } catch (error) {
    console.error('Error running test:', error);
  }
}

// Run the test
runTest();