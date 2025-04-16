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

// Define physician personalities
const PHYSICIAN_PERSONALITIES = [
  {
    name: "Rushed Doctor",
    description: "Always in a hurry, uses abbreviations, writes very brief notes, often omits details.",
    prompt: "You are a rushed physician who is always short on time. You write very brief notes, use medical abbreviations, and often omit details. Generate a radiology order dictation in 1-3 sentences for a patient with {{CONDITION}}. Be realistic but rushed."
  },
  {
    name: "Thorough Doctor",
    description: "Extremely detailed, documents everything, provides comprehensive history and findings.",
    prompt: "You are an extremely thorough physician who documents everything meticulously. You provide comprehensive history and detailed findings. Generate a radiology order dictation in 3-5 sentences for a patient with {{CONDITION}}. Include relevant history, symptoms, physical exam findings, and your specific clinical question."
  },
  {
    name: "Irritable Doctor",
    description: "Annoyed at having to document, uses terse language, sometimes passive-aggressive.",
    prompt: "You are an irritable physician who is annoyed at having to document everything. You use terse language and sometimes sound passive-aggressive. Generate a radiology order dictation in 1-3 sentences for a patient with {{CONDITION}}. Make it sound like you're annoyed at having to write this."
  },
  {
    name: "Sleep-Deprived Doctor",
    description: "Makes occasional errors, rambles, sometimes loses track of thought.",
    prompt: "You are a sleep-deprived physician who has been working for 24 hours straight. You occasionally make errors, ramble, and sometimes lose track of thought. Generate a radiology order dictation in 2-4 sentences for a patient with {{CONDITION}}. Include at least one minor error or inconsistency."
  },
  {
    name: "New Resident",
    description: "Overly formal, includes unnecessary information, unsure of what's relevant.",
    prompt: "You are a new medical resident who is still learning how to write effective orders. You tend to be overly formal, include unnecessary information, and are unsure of what's relevant. Generate a radiology order dictation in 2-4 sentences for a patient with {{CONDITION}}. Include some information that isn't strictly necessary."
  },
  {
    name: "Old-School Doctor",
    description: "Uses outdated terminology, prefers older imaging techniques, resistant to new protocols.",
    prompt: "You are an old-school physician who has been practicing for 40 years. You use somewhat outdated terminology, prefer older imaging techniques, and are resistant to new protocols. Generate a radiology order dictation in 2-3 sentences for a patient with {{CONDITION}}. Use terminology that might be slightly outdated."
  },
  {
    name: "Tech-Savvy Doctor",
    description: "Uses latest medical terminology, references recent studies, very precise.",
    prompt: "You are a tech-savvy physician who stays current with the latest research. You use the most recent medical terminology, reference recent studies, and are very precise in your language. Generate a radiology order dictation in 2-4 sentences for a patient with {{CONDITION}}. Include a reference to recent guidelines or research."
  },
  {
    name: "Defensive Doctor",
    description: "Practices defensive medicine, orders more tests than necessary, documents extensively to avoid liability.",
    prompt: "You are a physician who practices defensive medicine due to concerns about malpractice. You tend to order more tests than strictly necessary and document extensively to avoid liability. Generate a radiology order dictation in 3-5 sentences for a patient with {{CONDITION}}. Make it clear you're being thorough partly to protect yourself legally."
  },
  {
    name: "Empathetic Doctor",
    description: "Very patient-centered, includes patient's concerns and preferences, humanizes the case.",
    prompt: "You are an empathetic physician who takes a very patient-centered approach. You include the patient's concerns and preferences in your notes and humanize the case. Generate a radiology order dictation in 2-4 sentences for a patient with {{CONDITION}}. Include the patient's perspective or concerns."
  },
  {
    name: "Overconfident Doctor",
    description: "Already certain of diagnosis, ordering imaging as a formality, dismissive of alternatives.",
    prompt: "You are an overconfident physician who is already certain of your diagnosis and is ordering imaging more as a formality. You tend to be dismissive of alternative diagnoses. Generate a radiology order dictation in 1-3 sentences for a patient with {{CONDITION}}. Make it clear you're already convinced of the diagnosis."
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

// Define response styles for feedback
const RESPONSE_STYLES = [
  {
    name: "Accepting",
    description: "Accepts feedback graciously, willing to provide additional information.",
    prompt: "You are a physician who accepts feedback graciously and is willing to provide additional information. Respond to this feedback about your radiology order: {{FEEDBACK}}. Your original order was: {{ORIGINAL_DICTATION}}. Provide additional information as requested, in a cooperative tone."
  },
  {
    name: "Defensive",
    description: "Defends original order, reluctant to provide more information, questions the need.",
    prompt: "You are a physician who tends to be defensive about your clinical decisions. Respond to this feedback about your radiology order: {{FEEDBACK}}. Your original order was: {{ORIGINAL_DICTATION}}. Be somewhat defensive but ultimately provide some of the requested information, while questioning whether it's really necessary."
  },
  {
    name: "Frustrated",
    description: "Annoyed at the bureaucracy, complies but expresses frustration.",
    prompt: "You are a physician who is frustrated with administrative bureaucracy and documentation requirements. Respond to this feedback about your radiology order: {{FEEDBACK}}. Your original order was: {{ORIGINAL_DICTATION}}. Express your frustration with the process but ultimately provide the requested information."
  },
  {
    name: "Apologetic",
    description: "Apologizes for omissions, eager to correct and provide complete information.",
    prompt: "You are a physician who is apologetic when you've made an oversight. Respond to this feedback about your radiology order: {{FEEDBACK}}. Your original order was: {{ORIGINAL_DICTATION}}. Apologize for any omissions and eagerly provide the additional information requested."
  },
  {
    name: "Minimal",
    description: "Provides bare minimum additional information, brief and to the point.",
    prompt: "You are a physician who provides only the bare minimum additional information when asked. Respond to this feedback about your radiology order: {{FEEDBACK}}. Your original order was: {{ORIGINAL_DICTATION}}. Be brief and to the point, providing just enough information to satisfy the request."
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
    console.error(`Error generating dictation with ${llmFunction.name}:`, error.message);
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
    console.error(`Error generating response with ${llmFunction.name}:`, error.message);
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
  const llmFunctions = [llmClient.callClaude, llmClient.callGrok, llmClient.callGPT];
  const dictationLlmIndex = Math.floor(Math.random() * llmFunctions.length);
  let responseLlmIndex;
  do {
    responseLlmIndex = Math.floor(Math.random() * llmFunctions.length);
  } while (responseLlmIndex === dictationLlmIndex);
  
  const dictationLlm = llmFunctions[dictationLlmIndex];
  const responseLlm = llmFunctions[responseLlmIndex];
  
  // Step 1: Generate the initial dictation
  console.log(`\nGenerating dictation as ${personality.name} using ${dictationLlm.name}...`);
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
  console.log(`\nGenerating response as ${responseStyle.name} using ${responseLlm.name}...`);
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