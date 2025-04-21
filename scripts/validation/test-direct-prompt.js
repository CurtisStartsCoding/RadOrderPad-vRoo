/**
 * Test script to directly test the comprehensive prompt with Claude API
 * This bypasses the database and application logic to test if the prompt itself works
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Claude API configuration
const CLAUDE_API_KEY = process.env.ANTHROPIC_API_KEY;
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_MODEL = 'claude-3-7-sonnet-20250219';

// Sample dictation text for testing
const SAMPLE_DICTATION = `
Patient is a 45-year-old female with persistent right lower quadrant pain for 3 weeks. 
Pain is sharp, 7/10 intensity, and worse with movement. 
Patient reports nausea but no vomiting. 
No fever. 
Previous ultrasound 2 weeks ago was inconclusive. 
Patient has tried OTC pain medications without relief.
Physical exam shows tenderness to palpation in RLQ with mild guarding.
No rebound tenderness.
Patient has history of ovarian cysts 5 years ago.
Lab results show slightly elevated WBC of 11.2.
Request CT abdomen and pelvis with contrast to evaluate for appendicitis vs. ovarian pathology.
`;

/**
 * Read the prompt template from file
 */
function readPromptTemplate() {
  const promptPath = path.join(__dirname, 'Docs', 'implementation', 'FINAL_PROMPT.txt');
  console.log(`Reading prompt from: ${promptPath}`);
  
  try {
    const promptTemplate = fs.readFileSync(promptPath, 'utf8');
    console.log(`Prompt template loaded (${promptTemplate.length} characters)`);
    return promptTemplate;
  } catch (error) {
    console.error(`Error reading prompt template: ${error.message}`);
    throw error;
  }
}

/**
 * Prepare the prompt by replacing placeholders
 */
function preparePrompt(template, patientCase) {
  console.log('Preparing prompt with patient case...');
  return template.replace('{{PATIENT_CASE}}', patientCase);
}

/**
 * Call the Claude API directly
 */
async function callClaudeAPI(prompt) {
  console.log(`Calling Claude API (${CLAUDE_MODEL})...`);
  
  try {
    const response = await axios.post(
      CLAUDE_API_URL,
      {
        model: CLAUDE_MODEL,
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        }
      }
    );
    
    return response.data.content[0].text;
  } catch (error) {
    console.error('Error calling Claude API:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received from API');
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
}

/**
 * Extract JSON from Claude's response
 */
function extractJSON(response) {
  console.log('Extracting JSON from response...');
  
  // Try to extract JSON from code blocks
  const jsonBlockMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonBlockMatch) {
    return jsonBlockMatch[1].trim();
  }
  
  // If no code blocks, try to find JSON object directly
  const jsonObjectMatch = response.match(/(\{[\s\S]*\})/);
  if (jsonObjectMatch) {
    return jsonObjectMatch[1].trim();
  }
  
  console.error('No JSON found in response');
  console.log('Raw response:', response);
  throw new Error('No JSON found in response');
}

/**
 * Verify the response follows the format requirements
 */
function verifyResponse(parsedResponse) {
  console.log('\nVerifying response format...');
  
  // Check for required fields
  const requiredFields = [
    'validationStatus', 
    'complianceScore', 
    'feedback', 
    'suggestedICD10Codes', 
    'suggestedCPTCodes'
  ];
  
  for (const field of requiredFields) {
    if (!(field in parsedResponse)) {
      console.error(`❌ Missing required field: ${field}`);
    } else {
      console.log(`✅ Found required field: ${field}`);
    }
  }

  // Check ICD-10 codes (should have at least 3-4)
  const icd10Codes = parsedResponse.suggestedICD10Codes || [];
  if (icd10Codes.length < 3) {
    console.error(`❌ Not enough ICD-10 codes: ${icd10Codes.length} (expected at least 3)`);
  } else {
    console.log(`✅ Found ${icd10Codes.length} ICD-10 codes`);
  }

  // Check if there's a primary ICD-10 code
  const primaryCodes = icd10Codes.filter(code => code.isPrimary);
  if (primaryCodes.length !== 1) {
    console.error(`❌ Expected exactly 1 primary ICD-10 code, found ${primaryCodes.length}`);
    
    // Print all ICD-10 codes to see if isPrimary is present
    console.log('\nICD-10 Codes:');
    icd10Codes.forEach((code, index) => {
      console.log(`Code ${index + 1}:`, JSON.stringify(code, null, 2));
    });
  } else {
    console.log(`✅ Found primary ICD-10 code: ${primaryCodes[0].code}`);
  }

  // Check CPT codes
  const cptCodes = parsedResponse.suggestedCPTCodes || [];
  if (cptCodes.length === 0) {
    console.error('❌ No CPT codes found');
  } else {
    console.log(`✅ Found ${cptCodes.length} CPT codes`);
  }

  console.log('\nVerification complete!');
}

/**
 * Main function to run the test
 */
async function runTest() {
  try {
    // Read the prompt template
    const promptTemplate = readPromptTemplate();
    
    // Prepare the prompt with the patient case
    const prompt = preparePrompt(promptTemplate, SAMPLE_DICTATION);
    
    // Call the Claude API
    const response = await callClaudeAPI(prompt);
    console.log('\nReceived response from Claude API');
    
    // Extract JSON from the response
    const jsonContent = extractJSON(response);
    console.log('\nExtracted JSON:');
    console.log(jsonContent);
    
    // Parse the JSON
    const parsedResponse = JSON.parse(jsonContent);
    
    // Verify the response
    verifyResponse(parsedResponse);
    
    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('\nTest failed:', error.message);
    process.exit(1);
  }
}

// Run the test
runTest();