/**
 * Multi-LLM Personality Test for RadOrderPad Validation
 * 
 * This script uses different LLMs to:
 * 1. Generate test cases with varying complexity (simple to complex, rare diseases)
 * 2. Create different physician personalities (rushed, angry, irritable, sleep-deprived, etc.)
 * 3. Have these personalities respond to feedback from the validation system
 * 4. Ensure the LLM generating the dictation is different from the one responding to feedback
 */
require('dotenv').config();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const llmClient = require('../dist/utils/llm-client');

// Import the centralized configuration
const config = require('../test-config');

// API URL construction
const API_URL = config.api.baseUrl;

// Database connection for fetching the active prompt
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '5433';
const DB_NAME = process.env.DB_NAME || 'radorder_main';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres123';

// Create a connection pool
const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD
});

// Generate token for testing
const TEST_TOKEN = jwt.sign(
  { userId: 1, orgId: 1, role: 'physician', email: 'test.physician@example.com' },
  config.api.jwtSecret,
  { expiresIn: '24h' }
);

// Define physician personalities with realistic sentence limits
const PHYSICIAN_PERSONALITIES = [
  {
    name: "Rushed Doctor",
    description: "Always in a hurry, uses abbreviations, writes very brief notes.",
    prompt: "You are a rushed physician with many patients to see. Generate a radiology order dictation for a patient with {{CONDITION}}. Keep it very brief - just 1-2 sentences maximum. Use common medical abbreviations. Focus only on the essential clinical information needed for the order."
  },
  {
    name: "Thorough Doctor",
    description: "Detailed but realistic, provides relevant history and findings.",
    prompt: "You are a thorough physician who documents carefully. Generate a radiology order dictation for a patient with {{CONDITION}}. Use 3-5 sentences maximum. Include relevant history, key symptoms, and your specific clinical question. Be thorough but realistic - focus on clinically relevant details only."
  },
  {
    name: "Irritable Doctor",
    description: "Annoyed at documentation requirements, brief and to the point.",
    prompt: "You are a physician who finds documentation requirements annoying. Generate a radiology order dictation for a patient with {{CONDITION}}. Keep it brief - 1-2 sentences maximum. Be direct and to the point, but include just enough information to justify the order."
  },
  {
    name: "Sleep-Deprived Doctor",
    description: "Working long hours, occasionally disorganized but gets key info across.",
    prompt: "You are a sleep-deprived physician at the end of a long shift. Generate a radiology order dictation for a patient with {{CONDITION}}. Use 2-3 sentences maximum. Your note might be slightly disorganized but should still contain the essential clinical information."
  },
  {
    name: "New Resident",
    description: "Still learning what's relevant, includes some unnecessary details.",
    prompt: "You are a new medical resident still learning how to write effective orders. Generate a radiology order dictation for a patient with {{CONDITION}}. Use 2-4 sentences maximum. Include one detail that isn't strictly necessary but that you think might be helpful."
  },
  {
    name: "Experienced Doctor",
    description: "Efficient documentation with just the right amount of detail.",
    prompt: "You are an experienced physician who documents efficiently. Generate a radiology order dictation for a patient with {{CONDITION}}. Use 2-3 sentences maximum. Include only the most relevant clinical information that will help justify the imaging study."
  },
  {
    name: "Tech-Savvy Doctor",
    description: "Uses current terminology, precise but concise.",
    prompt: "You are a tech-savvy physician who stays current with medical literature. Generate a radiology order dictation for a patient with {{CONDITION}}. Use 2-3 sentences maximum. Use current medical terminology and be precise but concise."
  },
  {
    name: "Defensive Doctor",
    description: "Documents to avoid liability, slightly more detailed.",
    prompt: "You are a physician who practices defensive medicine. Generate a radiology order dictation for a patient with {{CONDITION}}. Use 3-4 sentences maximum. Include details that would help justify the order from a medical necessity standpoint."
  },
  {
    name: "Empathetic Doctor",
    description: "Includes patient's perspective, humanizes the case.",
    prompt: "You are an empathetic physician who considers the patient's perspective. Generate a radiology order dictation for a patient with {{CONDITION}}. Use 2-4 sentences maximum. Include a brief mention of how the condition is affecting the patient's life or their concerns."
  },
  {
    name: "Overconfident Doctor",
    description: "Already certain of diagnosis, brief and directive.",
    prompt: "You are a confident physician who is fairly certain of your diagnosis. Generate a radiology order dictation for a patient with {{CONDITION}}. Use 1-3 sentences maximum. Be direct about what you're looking for and why."
  }
];

// Define medical conditions with varying complexity
const MEDICAL_CONDITIONS = [
  // Simple conditions
  "lower back pain",
  "persistent headache",
  "knee pain after minor injury",
  "chronic sinusitis",
  "shoulder pain with limited range of motion",
  
  // Moderate complexity
  "unexplained weight loss and fatigue",
  "recurrent abdominal pain with elevated liver enzymes",
  "chest pain with normal ECG but family history of heart disease",
  "progressive neurological symptoms including tremor and gait disturbance",
  "recurrent pneumonia in the same lung segment",
  
  // Complex/rare conditions
  "suspected Erdheim-Chester disease with bone pain",
  "progressive supranuclear palsy with frequent falls",
  "adult-onset Still's disease with persistent fever and rash",
  "suspected cardiac sarcoidosis with arrhythmias",
  "Castleman disease with lymphadenopathy and systemic symptoms"
];

// Define response styles for feedback with realistic sentence limits
const RESPONSE_STYLES = [
  {
    name: "Accepting",
    description: "Accepts feedback graciously, provides additional information.",
    prompt: "You are a physician responding to feedback about your radiology order. Respond to this feedback: {{FEEDBACK}}. Your original order was: {{ORIGINAL_DICTATION}}. Provide the requested additional information in a cooperative tone. Keep your response to 3-5 sentences maximum."
  },
  {
    name: "Defensive",
    description: "Slightly defensive but provides information.",
    prompt: "You are a physician responding to feedback about your radiology order. Respond to this feedback: {{FEEDBACK}}. Your original order was: {{ORIGINAL_DICTATION}}. Be slightly defensive but ultimately provide the requested information. Keep your response to 2-4 sentences maximum."
  },
  {
    name: "Frustrated",
    description: "Annoyed at bureaucracy but complies.",
    prompt: "You are a physician responding to feedback about your radiology order. Respond to this feedback: {{FEEDBACK}}. Your original order was: {{ORIGINAL_DICTATION}}. Express mild frustration with the documentation requirements but provide the requested information. Keep your response to 2-3 sentences maximum."
  },
  {
    name: "Apologetic",
    description: "Apologizes for omissions, provides information.",
    prompt: "You are a physician responding to feedback about your radiology order. Respond to this feedback: {{FEEDBACK}}. Your original order was: {{ORIGINAL_DICTATION}}. Briefly apologize for any omissions and provide the requested information. Keep your response to 2-4 sentences maximum."
  },
  {
    name: "Minimal",
    description: "Provides bare minimum additional information.",
    prompt: "You are a physician responding to feedback about your radiology order. Respond to this feedback: {{FEEDBACK}}. Your original order was: {{ORIGINAL_DICTATION}}. Provide just the minimum additional information requested. Keep your response to 1-2 sentences maximum."
  }
];

// Function to print a section header
function printSectionHeader(title) {
  console.log('\n' + '='.repeat(80));
  console.log(title);
  console.log('='.repeat(80));
}

// Function to print a subsection header
function printSubsectionHeader(title) {
  console.log('\n' + '-'.repeat(60));
  console.log(title);
  console.log('-'.repeat(60));
}

// Function to fetch and display the active prompt template
async function fetchAndDisplayActivePrompt() {
  let client;
  
  try {
    client = await pool.connect();
    
    // Query the active prompt template
    const result = await client.query(`
      SELECT id, name, type, version, content_template, word_limit, active
      FROM prompt_templates
      WHERE active = TRUE;
    `);
    
    if (result.rows.length === 0) {
      console.log('No active prompt template found!');
      return null;
    }
    
    const activeTemplate = result.rows[0];
    
    printSectionHeader('ACTIVE PROMPT TEMPLATE');
    console.log(`ID: ${activeTemplate.id}`);
    console.log(`Name: ${activeTemplate.name}`);
    console.log(`Type: ${activeTemplate.type}`);
    console.log(`Version: ${activeTemplate.version}`);
    console.log(`Word Limit: ${activeTemplate.word_limit || 'Not set'}`);
    console.log(`Active: ${activeTemplate.active}`);
    
    printSectionHeader('PROMPT CONTENT');
    console.log(activeTemplate.content_template);
    
    return activeTemplate;
  } catch (error) {
    console.error('Error fetching active prompt template:', error.message);
    return null;
  } finally {
    if (client) {
      client.release();
    }
  }
}

// Define LLM functions with names
const callClaude = async (prompt) => {
  console.log('Calling Claude...');
  return await llmClient.callLLMWithFallback(prompt);
};
callClaude.displayName = 'Claude';

const callGrok = async (prompt) => {
  console.log('Calling Grok...');
  // Force fallback to Grok by simulating Claude failure
  try {
    const originalCallClaude = llmClient.callClaude;
    llmClient.callClaude = async () => { throw new Error('Simulated Claude failure'); };
    const result = await llmClient.callLLMWithFallback(prompt);
    llmClient.callClaude = originalCallClaude;
    return result;
  } catch (error) {
    console.error('Error calling Grok:', error);
    throw error;
  }
};
callGrok.displayName = 'Grok';

const callGPT = async (prompt) => {
  console.log('Calling GPT...');
  // Force fallback to GPT by simulating Claude and Grok failures
  try {
    const originalCallClaude = llmClient.callClaude;
    const originalCallGrok = llmClient.callGrok;
    llmClient.callClaude = async () => { throw new Error('Simulated Claude failure'); };
    llmClient.callGrok = async () => { throw new Error('Simulated Grok failure'); };
    const result = await llmClient.callLLMWithFallback(prompt);
    llmClient.callClaude = originalCallClaude;
    llmClient.callGrok = originalCallGrok;
    return result;
  } catch (error) {
    console.error('Error calling GPT:', error);
    throw error;
  }
};
callGPT.displayName = 'GPT';

// Function to generate a dictation using a specific LLM
async function generateDictation(personality, condition, llmFunction) {
  const prompt = personality.prompt.replace('{{CONDITION}}', condition);
  
  try {
    const result = await llmFunction(prompt);
    return {
      dictation: result.content.trim(),
      llmProvider: result.provider,
      model: result.model
    };
  } catch (error) {
    console.error(`Error generating dictation with ${llmFunction.displayName}:`, error.message);
    throw error;
  }
}

// Function to generate a response to feedback using a specific LLM
async function generateResponse(responseStyle, feedback, originalDictation, llmFunction) {
  const prompt = responseStyle.prompt
    .replace('{{FEEDBACK}}', feedback)
    .replace('{{ORIGINAL_DICTATION}}', originalDictation);
  
  try {
    const result = await llmFunction(prompt);
    return {
      response: result.content.trim(),
      llmProvider: result.provider,
      model: result.model
    };
  } catch (error) {
    console.error(`Error generating response with ${llmFunction.displayName}:`, error.message);
    throw error;
  }
}

// Function to validate a dictation using the API
async function validateDictation(dictation) {
  try {
    // Prepare the request payload
    const payload = {
      dictationText: dictation,
      patientInfo: {
        id: 1,
        firstName: 'Test',
        lastName: 'Patient',
        dateOfBirth: '1980-01-01',
        gender: 'male'
      },
      referringPhysicianId: 1,
      referringOrganizationId: 1
    };
    
    // Make the API request
    const response = await axios.post(`${API_URL}/orders/validate`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    });
    
    return response.data.validationResult;
  } catch (error) {
    console.error('Error during validation:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received from server');
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
}

// Function to run a single test case
async function runTestCase(personality, condition, responseStyle) {
  printSubsectionHeader(`TEST CASE: ${personality.name} with ${condition}`);
  
  // Randomly select LLMs for dictation and response (ensuring they're different)
  const llmFunctions = [callClaude, callGrok, callGPT];
  const dictationLlmIndex = Math.floor(Math.random() * llmFunctions.length);
  let responseLlmIndex;
  do {
    responseLlmIndex = Math.floor(Math.random() * llmFunctions.length);
  } while (responseLlmIndex === dictationLlmIndex);
  
  const dictationLlm = llmFunctions[dictationLlmIndex];
  const responseLlm = llmFunctions[responseLlmIndex];
  
  // Step 1: Generate the initial dictation
  console.log(`\nGenerating dictation as ${personality.name} using ${dictationLlm.displayName}...`);
  const { dictation, llmProvider: dictationProvider, model: dictationModel } = await generateDictation(personality, condition, dictationLlm);
  
  console.log(`\nINITIAL DICTATION (${dictationProvider} - ${dictationModel}):`);
  console.log(dictation);
  
  // Step 2: Validate the dictation
  console.log('\nValidating dictation...');
  const validationResult = await validateDictation(dictation);
  
  console.log(`\nVALIDATION STATUS: ${validationResult.validationStatus}`);
  console.log(`COMPLIANCE SCORE: ${validationResult.complianceScore}`);
  
  console.log('\nFEEDBACK:');
  console.log(validationResult.feedback);
  
  // Step 3: Generate a response to the feedback
  console.log(`\nGenerating response as ${responseStyle.name} using ${responseLlm.displayName}...`);
  const { response, llmProvider: responseProvider, model: responseModel } = await generateResponse(
    responseStyle, 
    validationResult.feedback, 
    dictation, 
    responseLlm
  );
  
  console.log(`\nRESPONSE TO FEEDBACK (${responseProvider} - ${responseModel}):`);
  console.log(response);
  
  // Step 4: Validate the updated dictation (original + response)
  const updatedDictation = `${dictation}\n\nAdditional Information: ${response}`;
  console.log('\nValidating updated dictation...');
  const updatedValidationResult = await validateDictation(updatedDictation);
  
  console.log(`\nUPDATED VALIDATION STATUS: ${updatedValidationResult.validationStatus}`);
  console.log(`UPDATED COMPLIANCE SCORE: ${updatedValidationResult.complianceScore}`);
  
  console.log('\nUPDATED FEEDBACK:');
  console.log(updatedValidationResult.feedback);
  
  // Return the results
  return {
    personality,
    condition,
    responseStyle,
    dictation,
    dictationProvider,
    dictationModel,
    initialValidationStatus: validationResult.validationStatus,
    initialComplianceScore: validationResult.complianceScore,
    feedback: validationResult.feedback,
    response,
    responseProvider,
    responseModel,
    updatedValidationStatus: updatedValidationResult.validationStatus,
    updatedComplianceScore: updatedValidationResult.complianceScore,
    updatedFeedback: updatedValidationResult.feedback
  };
}

// Main function to run the tests
async function runTests(numTests = 5) {
  // First, fetch and display the active prompt template
  await fetchAndDisplayActivePrompt();
  
  printSectionHeader('MULTI-LLM PERSONALITY TEST');
  console.log('This test uses different LLMs to generate test cases with varying complexity');
  console.log('and different physician personalities responding to validation feedback.');
  
  const results = [];
  
  // Run the specified number of tests
  for (let i = 0; i < numTests; i++) {
    // Randomly select a personality, condition, and response style
    const personality = PHYSICIAN_PERSONALITIES[Math.floor(Math.random() * PHYSICIAN_PERSONALITIES.length)];
    const condition = MEDICAL_CONDITIONS[Math.floor(Math.random() * MEDICAL_CONDITIONS.length)];
    const responseStyle = RESPONSE_STYLES[Math.floor(Math.random() * RESPONSE_STYLES.length)];
    
    printSectionHeader(`TEST ${i + 1}: ${personality.name} - ${condition} - ${responseStyle.name}`);
    
    try {
      const result = await runTestCase(personality, condition, responseStyle);
      results.push(result);
    } catch (error) {
      console.error(`Error in test ${i + 1}:`, error.message);
    }
  }
  
  // Print summary
  printSectionHeader('TEST RESULTS SUMMARY');
  
  console.log(`Total tests run: ${results.length}`);
  
  const initialStatusCounts = {};
  const updatedStatusCounts = {};
  
  results.forEach(result => {
    // Count initial validation statuses
    initialStatusCounts[result.initialValidationStatus] = (initialStatusCounts[result.initialValidationStatus] || 0) + 1;
    
    // Count updated validation statuses
    updatedStatusCounts[result.updatedValidationStatus] = (updatedStatusCounts[result.updatedValidationStatus] || 0) + 1;
  });
  
  console.log('\nInitial Validation Status Counts:');
  Object.entries(initialStatusCounts).forEach(([status, count]) => {
    console.log(`- ${status}: ${count}`);
  });
  
  console.log('\nUpdated Validation Status Counts:');
  Object.entries(updatedStatusCounts).forEach(([status, count]) => {
    console.log(`- ${status}: ${count}`);
  });
  
  // Calculate average compliance score improvement
  const averageInitialScore = results.reduce((sum, result) => sum + result.initialComplianceScore, 0) / results.length;
  const averageUpdatedScore = results.reduce((sum, result) => sum + result.updatedComplianceScore, 0) / results.length;
  
  console.log(`\nAverage Initial Compliance Score: ${averageInitialScore.toFixed(2)}`);
  console.log(`Average Updated Compliance Score: ${averageUpdatedScore.toFixed(2)}`);
  console.log(`Average Improvement: ${(averageUpdatedScore - averageInitialScore).toFixed(2)}`);
  
  printSectionHeader('TESTS COMPLETED');
  
  // Close the database pool
  await pool.end();
}

// Parse command line arguments
const numTests = process.argv[2] ? parseInt(process.argv[2]) : 5;

// Run the tests
runTests(numTests).catch(err => {
  console.error('Unhandled error:', err);
  // Make sure to close the pool on error
  pool.end();
});