/**
 * Modified version of llm-validation-flow-test.js that uses test-config-modified.js
 */

// Copy the original file but change the config import
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const config = require('./test-config-modified');
const { promptTemplates, selectRandomPrompts } = require('./tests/prompt-templates');

// Load environment variables from .env file
dotenv.config();

// Ensure results directory exists
const resultsDir = path.join(__dirname, 'test-results/llm-validation');
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

// Configuration
const API_BASE_URL = config.api.baseUrl;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || config.llm.anthropicApiKey;
const GROK_API_KEY = process.env.GROK_API_KEY || config.llm.grokApiKey;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || config.llm.openaiApiKey;

// Log API configuration
console.log('API Configuration:');
console.log(`API Base URL: ${API_BASE_URL}`);
console.log(`Anthropic API Key: ${ANTHROPIC_API_KEY ? 'Available' : 'Not available'}`);
console.log(`Grok API Key: ${GROK_API_KEY ? 'Available' : 'Not available'}`);
console.log(`OpenAI API Key: ${OPENAI_API_KEY ? 'Available' : 'Not available'}`);
console.log('');

// Check if API keys are available
if (!ANTHROPIC_API_KEY) {
  console.error('Error: ANTHROPIC_API_KEY is required. Set it in .env file or as an environment variable.');
  process.exit(1);
}

if (!GROK_API_KEY) {
  console.error('Error: GROK_API_KEY is required. Set it in .env file or as an environment variable.');
  process.exit(1);
}

if (!OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY is required. Set it in .env file or as an environment variable.');
  process.exit(1);
}

// Check if --random flag is passed
const useRandomPrompts = process.argv.includes('--random');
console.log(`Using ${useRandomPrompts ? 'random' : 'fixed'} test prompts`);

// Map API validation status to test case expected results
const STATUS_MAP = {
  'inappropriate': 'validation_failed',
  'needs_clarification': 'needs_clarification',
  'appropriate': 'validated'
};

// Helper function to map API status to test status
function mapApiStatus(apiStatus) {
  return STATUS_MAP[apiStatus] || apiStatus;
}

// Generate a JWT token for authentication
function generateToken(user = {
  userId: 1,
  orgId: 1,
  role: 'physician',
  email: 'test.physician@example.com'
}, expiresIn = '24h') {
  const payload = {
    userId: user.userId,
    orgId: user.orgId,
    role: user.role,
    email: user.email
  };
  
  return jwt.sign(payload, config.api.jwtSecret, { expiresIn });
}

// Test case definitions - using prompt templates
const testCases = {
  // Category A: Blatantly wrong cases
  categoryA: [
    {
      id: 'A1',
      ...promptTemplates.find(t => t.id === 'missing_indication')
    },
    {
      id: 'A2',
      ...promptTemplates.find(t => t.id === 'contradictory_info')
    },
    {
      id: 'A3',
      ...promptTemplates.find(t => t.id === 'mismatched_study')
    }
  ],
  
  // Category B: Cases that require one clarification
  categoryB: [
    {
      id: 'B1',
      ...promptTemplates.find(t => t.id === 'vague_symptoms')
    },
    {
      id: 'B2',
      ...promptTemplates.find(t => t.id === 'missing_duration')
    },
    {
      id: 'B3',
      ...promptTemplates.find(t => t.id === 'incomplete_history')
    }
  ],
  
  // Category C: Cases that are correct immediately
  categoryC: [
    {
      id: 'C1',
      ...promptTemplates.find(t => t.id === 'appropriate_neuro')
    },
    {
      id: 'C2',
      ...promptTemplates.find(t => t.id === 'appropriate_msk')
    },
    {
      id: 'C3',
      ...promptTemplates.find(t => t.id === 'multiple_studies')
    }
  ]
};

// Use random prompts if --random flag is passed
if (useRandomPrompts) {
  console.log('Using randomly selected prompts for testing');
  
  testCases.categoryA = selectRandomPrompts(3).map((template, index) => ({
    id: `A${index + 1}`,
    ...template
  }));
  
  testCases.categoryB = selectRandomPrompts(3).map((template, index) => ({
    id: `B${index + 1}`,
    ...template
  }));
  
  testCases.categoryC = selectRandomPrompts(3).map((template, index) => ({
    id: `C${index + 1}`,
    ...template
  }));
}

// Helper function to log results
function logResult(testCase, result) {
  const logFile = path.join(resultsDir, `${testCase.id}-result.json`);
  fs.writeFileSync(logFile, JSON.stringify(result, null, 2));
  console.log(`Results for test case ${testCase.id} saved to ${logFile}`);
}

// Helper function to generate dictation using Grok
async function generateDictation(testCase) {
  console.log(`Generating dictation for test case ${testCase.id}: ${testCase.description}`);
  
  try {
    console.log('Calling Grok API...');
    
    const response = await axios.post('https://api.x.ai/v1/chat/completions', {
      model: process.env.GROK_MODEL_NAME || 'grok-3-latest',
      messages: [
        {
          role: 'system',
          content: 'You are a physician in a fast-paced clinical environment dictating a radiology order. Keep your dictation extremely concise and include ONLY: patient age, gender, requested modality, and clinical indication. No pleasantries, patient names, or other details. Maximum 2-3 sentences. Format: "Age/Gender. Modality. Clinical indication."'
        },
        {
          role: 'user',
          content: testCase.prompt
        }
      ],
      stream: false,
      temperature: 0.7,
      max_tokens: 500
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROK_API_KEY}`
      },
      timeout: 30000
    });
    
    if (response.status !== 200) {
      throw new Error(`Grok API error: ${response.status} ${response.statusText}`);
    }
    
    const dictation = response.data.choices[0].message.content;
    
    // Display the full dictation text
    console.log('\n=== GENERATED DICTATION ===');
    console.log(dictation);
    console.log('=========================\n');
    
    return dictation;
  } catch (error) {
    console.error(`Error generating dictation: ${error.message}`);
    if (error.response) {
      console.error(`Response data: ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
}

// Helper function to validate dictation using Anthropic (Claude)
async function validateDictation(dictation, patientInfo) {
  console.log(`Validating dictation using Anthropic (Claude)`);
  
  try {
    // Use pre-generated physician token from file
    const token = fs.readFileSync('./tokens/physician-token.txt', 'utf8').trim();
    console.log(`Using pre-generated physician token: ${token.substring(0, 20)}...`);
    
    const response = await axios.post(`${API_BASE_URL}/orders/validate`, {
      dictationText: dictation,
      patientInfo: patientInfo || {
        id: 1,
        firstName: "Test",
        lastName: "Patient",
        dateOfBirth: "1980-01-01",
        gender: "M",
        mrn: "TEST12345"
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Test-Mode': 'true'
      }
    });
    
    // Display the full validation result
    console.log('\n=== VALIDATION RESULT ===');
    console.log(JSON.stringify(response.data, null, 2));
    console.log('=========================\n');
    
    return response.data;
  } catch (error) {
    console.error(`Error validating dictation: ${error.message}`);
    if (error.response) {
      console.error(`Response data: ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
}

// Helper function to generate clarification using GPT
async function generateClarification(dictation, validationFeedback) {
  console.log(`Generating clarification using GPT`);
  
  try {
    console.log('Calling OpenAI API...');
    
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: process.env.GPT_MODEL_NAME || 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a physician responding to feedback about a radiology order. Provide a brief, direct clarification that addresses the feedback. Be concise and clinical - no pleasantries or unnecessary details. Focus only on providing the missing information or correcting the issues mentioned in the feedback.'
        },
        {
          role: 'user',
          content: `Original dictation: "${dictation}"\n\nFeedback from radiologist: "${validationFeedback}"\n\nProvide a concise clarification that addresses this feedback.`
        }
      ],
      stream: false,
      temperature: 0.7,
      max_tokens: 500
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      timeout: 30000
    });
    
    if (response.status !== 200) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }
    
    const clarification = response.data.choices[0].message.content;
    
    // Display the full clarification
    console.log('\n=== CLARIFICATION RESPONSE ===');
    console.log(clarification);
    console.log('=============================\n');
    
    return clarification;
  } catch (error) {
    console.error(`Error generating clarification: ${error.message}`);
    if (error.response) {
      console.error(`Response data: ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
}

// Helper function to validate clarification using Anthropic (Claude)
async function validateClarification(dictation, clarification, patientInfo, orderId) {
  console.log(`Validating clarification using Anthropic (Claude)`);
  
  try {
    // Use pre-generated physician token from file
    const token = fs.readFileSync('./tokens/physician-token.txt', 'utf8').trim();
    
    const response = await axios.post(`${API_BASE_URL}/orders/${orderId}/clarify`, {
      originalDictation: dictation,
      clarification: clarification,
      patientInfo: patientInfo || {
        id: 1,
        firstName: "Test",
        lastName: "Patient",
        dateOfBirth: "1980-01-01",
        gender: "M",
        mrn: "TEST12345"
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Test-Mode': 'true'
      }
    });
    
    console.log(`Clarification validation result: ${response.data.validationStatus}`);
    return response.data;
  } catch (error) {
    console.error(`Error validating clarification: ${error.message}`);
    if (error.response) {
      console.error(`Response data: ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
}

// Run a single test case
async function runTestCase(testCase) {
  console.log(`\n=== Running Test Case ${testCase.id}: ${testCase.description} ===`);
  
  const result = {
    testCase: testCase,
    startTime: new Date().toISOString(),
    steps: []
  };
  
  try {
    // Step 1: Generate dictation using Grok
    const dictation = await generateDictation(testCase);
    result.dictation = dictation;
    result.steps.push({
      step: 'generate_dictation',
      model: 'grok',
      timestamp: new Date().toISOString(),
      output: dictation
    });
    
    // Step 2: Validate dictation using Anthropic (Claude)
    const validationResult = await validateDictation(dictation);
    result.initialValidation = validationResult;
    result.steps.push({
      step: 'validate_dictation',
      model: 'anthropic',
      timestamp: new Date().toISOString(),
      output: validationResult
    });
    
    // Step 3: If validation failed or needs clarification, generate clarification using GPT
    if (validationResult.validationStatus === 'failed' || validationResult.validationStatus === 'needs_clarification') {
      const validationFeedback = validationResult.feedback || validationResult.suggestedActions.join(', ');
      const clarification = await generateClarification(dictation, validationFeedback);
      result.clarification = clarification;
      result.steps.push({
        step: 'generate_clarification',
        model: 'gpt',
        timestamp: new Date().toISOString(),
        output: clarification
      });
      
      // Step 4: Validate clarification using Anthropic (Claude)
      const clarificationResult = await validateClarification(dictation, clarification, null, validationResult.orderId);
      result.clarificationValidation = clarificationResult;
      result.steps.push({
        step: 'validate_clarification',
        model: 'anthropic',
        timestamp: new Date().toISOString(),
        output: clarificationResult
      });
    }
    
    // Step 5: Determine test result
    // Get the validation result from the API response
    const finalValidationResult = result.clarificationValidation || result.initialValidation;
    
    // Extract the validation status from the validation result
    if (finalValidationResult && finalValidationResult.validationStatus) {
      result.finalValidationStatus = finalValidationResult.validationStatus;
    } else if (finalValidationResult && finalValidationResult.validationResult && finalValidationResult.validationResult.validationStatus) {
      // Handle nested structure if present
      result.finalValidationStatus = finalValidationResult.validationResult.validationStatus;
    } else {
      // Default to 'unknown' if no status is found
      result.finalValidationStatus = 'unknown';
      console.log('Warning: Could not find validation status in result:', JSON.stringify(finalValidationResult, null, 2).substring(0, 200) + '...');
    }
    
    // Map API validation status to test case expected results
    const mappedStatus = mapApiStatus(result.finalValidationStatus);
    result.success = (testCase.expectedResult === mappedStatus);
    
    if (testCase.expectedResult === 'validated' && finalValidationResult.validationStatus === 'validated') {
      // Check if CPT and ICD-10 codes match expected values
      const cptMatch = testCase.expectedCPT ? finalValidationResult.cptCode.startsWith(testCase.expectedCPT) : true;
      const icd10Match = testCase.expectedICD10 ? testCase.expectedICD10.some(code => 
        finalValidationResult.icd10Codes.some(resultCode => resultCode.startsWith(code))
      ) : true;
      
      result.cptMatch = cptMatch;
      result.icd10Match = icd10Match;
      result.success = result.success && cptMatch && icd10Match;
    }
    
    result.endTime = new Date().toISOString();
    result.duration = (new Date(result.endTime) - new Date(result.startTime)) / 1000;
    
    // Log result
    logResult(testCase, result);
    
    // Print result summary
    console.log(`\n=== TEST CASE ${testCase.id} RESULT ===`);
    console.log(`Status: ${result.success ? 'PASSED' : 'FAILED'}`);
    console.log(`Expected result: ${testCase.expectedResult}`);
    console.log(`Actual result: ${mappedStatus} (API status: ${result.finalValidationStatus})`);
    console.log(`Duration: ${result.duration} seconds`);
    
    if (!result.success) {
      console.log('\nExpected feedback: ' + (testCase.expectedFeedback || 'Not specified'));
      if (result.initialValidation && result.initialValidation.feedback) {
        console.log('Actual feedback: ' + result.initialValidation.feedback);
      }
    }
    
    console.log('===========================\n');
    
    return result;
  } catch (error) {
    console.error(`Error running test case ${testCase.id}: ${error.message}`);
    result.error = error.message;
    result.endTime = new Date().toISOString();
    result.duration = (new Date(result.endTime) - new Date(result.startTime)) / 1000;
    result.success = false;
    
    // Log result
    logResult(testCase, result);
    
    return result;
  }
}

// Run all test cases
async function runAllTests() {
  console.log('Starting RadOrderPad LLM Validation Flow Tests');
  console.log('=============================================');
  
  const startTime = new Date();
  const summary = {
    startTime: startTime.toISOString(),
    categories: {
      A: { total: 0, passed: 0, failed: 0 },
      B: { total: 0, passed: 0, failed: 0 },
      C: { total: 0, passed: 0, failed: 0 }
    },
    results: []
  };
  
  // Run Category A tests (Blatantly wrong cases)
  console.log('\n=== Running Category A Tests: Blatantly Wrong Cases ===');
  for (const testCase of testCases.categoryA) {
    const result = await runTestCase(testCase);
    summary.categories.A.total++;
    if (result.success) {
      summary.categories.A.passed++;
    } else {
      summary.categories.A.failed++;
    }
    summary.results.push({
      id: testCase.id,
      description: testCase.description,
      success: result.success
    });
  }
  
  // Run Category B tests (Cases that require one clarification)
  console.log('\n=== Running Category B Tests: Cases Requiring One Clarification ===');
  for (const testCase of testCases.categoryB) {
    const result = await runTestCase(testCase);
    summary.categories.B.total++;
    if (result.success) {
      summary.categories.B.passed++;
    } else {
      summary.categories.B.failed++;
    }
    summary.results.push({
      id: testCase.id,
      description: testCase.description,
      success: result.success
    });
  }
  
  // Run Category C tests (Cases that are correct immediately)
  console.log('\n=== Running Category C Tests: Cases Correct Immediately ===');
  for (const testCase of testCases.categoryC) {
    const result = await runTestCase(testCase);
    summary.categories.C.total++;
    if (result.success) {
      summary.categories.C.passed++;
    } else {
      summary.categories.C.failed++;
    }
    summary.results.push({
      id: testCase.id,
      description: testCase.description,
      success: result.success
    });
  }
  
  // Calculate overall results
  const endTime = new Date();
  summary.endTime = endTime.toISOString();
  summary.duration = (endTime - startTime) / 1000;
  summary.totalTests = summary.categories.A.total + summary.categories.B.total + summary.categories.C.total;
  summary.totalPassed = summary.categories.A.passed + summary.categories.B.passed + summary.categories.C.passed;
  summary.totalFailed = summary.categories.A.failed + summary.categories.B.failed + summary.categories.C.failed;
  summary.successRate = (summary.totalPassed / summary.totalTests) * 100;
  
  // Save summary
  const summaryFile = path.join(resultsDir, 'summary.json');
  fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
  
  // Print summary
  console.log('\n=== Test Summary ===');
  console.log(`Total tests: ${summary.totalTests}`);
  console.log(`Passed: ${summary.totalPassed} (${summary.successRate.toFixed(2)}%)`);
  console.log(`Failed: ${summary.totalFailed}`);
  console.log(`Duration: ${summary.duration} seconds`);
  console.log('\nCategory breakdown:');
  console.log(`Category A (Blatantly wrong): ${summary.categories.A.passed}/${summary.categories.A.total} passed`);
  console.log(`Category B (Requiring clarification): ${summary.categories.B.passed}/${summary.categories.B.total} passed`);
  console.log(`Category C (Correct immediately): ${summary.categories.C.passed}/${summary.categories.C.total} passed`);
  console.log(`\nDetailed results saved to ${summaryFile}`);
  
  return summary;
}

// Run the tests
runAllTests().catch(error => {
  console.error('Error running tests:', error);
  process.exit(1);
});