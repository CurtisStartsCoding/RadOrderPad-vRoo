/**
 * Clinical Workflow Simulation
 * 
 * This script simulates a realistic clinical workflow where:
 * 1. A physician in a busy clinical environment generates a brief dictation for imaging
 * 2. The system validates the dictation and provides feedback
 * 3. The physician responds to the feedback with a clarification
 * 4. The system validates the clarification
 * 5. If needed, the physician provides additional clarification
 * 6. Finally, the physician may override if necessary
 * 
 * Usage: node tests/clinical-workflow-simulation.js [number_of_cases]
 */

require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const config = require('../test-config');

// API configuration
const API_BASE_URL = config.api.baseUrl;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || config.llm.anthropicApiKey;
const GROK_API_KEY = process.env.GROK_API_KEY || config.llm.grokApiKey;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || config.llm.openaiApiKey;

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

// Create results directory if it doesn't exist
const resultsDir = path.join(__dirname, '..', 'test-results', 'clinical-workflow');
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

// Get number of cases from command line argument
const numCases = parseInt(process.argv[2]) || 3;

// Modality options for random generation
const modalities = [
  'Chest X-ray',
  'Brain MRI',
  'CT Abdomen/Pelvis',
  'Ultrasound Abdomen',
  'MRI Knee',
  'CT Head',
  'Mammogram',
  'Bone Scan',
  'PET/CT',
  'Echocardiogram'
];

// Patient demographics for random generation
const patientDemographics = [
  { age: 25, gender: 'male' },
  { age: 35, gender: 'female' },
  { age: 45, gender: 'male' },
  { age: 55, gender: 'female' },
  { age: 65, gender: 'male' },
  { age: 75, gender: 'female' }
];

// Fallback dictations in case API calls fail
const fallbackDictations = [
  "45/Male. Chest X-ray. Chest pain.",
  "35/Female. Brain MRI. Headache.",
  "65/Male. CT Abdomen/Pelvis. Abdominal pain.",
  "55/Female. Ultrasound Abdomen. RUQ pain.",
  "25/Male. MRI Knee. Knee pain after fall.",
  "75/Female. CT Head. Dizziness."
];

/**
 * Generate a random dictation using Grok
 */
async function generateDictation() {
  console.log('Generating dictation using Grok...');
  
  // Randomly select a modality and patient demographics
  const modality = modalities[Math.floor(Math.random() * modalities.length)];
  const patient = patientDemographics[Math.floor(Math.random() * patientDemographics.length)];
  
  try {
    console.log(`Requesting dictation for ${patient.age}-year-old ${patient.gender} patient, ${modality}`);
    
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a busy physician in a clinical environment. Generate a brief, concise dictation for a radiology order. Include only the essential information a radiologist would need. Format should be: [Age/Gender]. [Modality]. [Brief clinical indication]. Keep it under 20 words total.'
        },
        {
          role: 'user',
          content: `Generate a brief dictation for a ${modality} order for a ${patient.age}-year-old ${patient.gender} patient. Make it realistic but intentionally include some ambiguity or incompleteness that might require clarification.`
        }
      ],
      temperature: 0.7,
      max_tokens: 100
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      }
    });
    
    console.log('Response received from OpenAI API');
    
    // Debug the response structure
    if (!response.data) {
      console.error('Error: response.data is undefined');
      throw new Error('Invalid response format: data is undefined');
    }
    
    if (!response.data.choices || !response.data.choices.length) {
      console.error('Error: response.data.choices is undefined or empty');
      console.error('Response data:', JSON.stringify(response.data, null, 2));
      throw new Error('Invalid response format: choices is undefined or empty');
    }
    
    if (!response.data.choices[0].message) {
      console.error('Error: response.data.choices[0].message is undefined');
      console.error('Response data:', JSON.stringify(response.data, null, 2));
      throw new Error('Invalid response format: message is undefined');
    }
    
    const dictation = response.data.choices[0].message.content.trim();
    
    console.log('\n=== GENERATED DICTATION ===');
    console.log(dictation);
    console.log('=========================\n');
    
    return dictation;
  } catch (error) {
    console.error(`Error generating dictation: ${error.message}`);
    if (error.response) {
      console.error(`Response status: ${error.response.status}`);
      console.error(`Response data: ${JSON.stringify(error.response.data)}`);
    }
    
    // Use a fallback dictation
    const fallbackDictation = fallbackDictations[Math.floor(Math.random() * fallbackDictations.length)];
    console.log(`Using fallback dictation: ${fallbackDictation}`);
    return fallbackDictation;
  }
}

/**
 * Validate dictation using Claude
 */
async function validateDictation(dictation, orderId = null) {
  console.log('Validating dictation using Claude...');
  
  try {
    // Generate a JWT token for testing
    const token = jwt.sign(
      { userId: 1, orgId: 1, role: 'physician', email: 'test.physician@example.com' },
      config.api.jwtSecret,
      { expiresIn: '24h' }
    );
    console.log('Generated JWT token:', token.substring(0, 20) + '...');
    
    // Prepare the payload
    const payload = {
      dictationText: dictation,
      patientInfo: {
        id: 1,
        firstName: "Test",
        lastName: "Patient",
        dateOfBirth: "1980-01-01",
        gender: "M",
        mrn: "TEST12345"
      }
    };
    
    // If orderId is provided, include it in the payload
    if (orderId) {
      payload.orderId = orderId;
    }
    
    // Call the validation API
    const response = await axios.post(`${API_BASE_URL}/orders/validate`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
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

/**
 * Generate clarification using GPT
 */
async function generateClarification(dictation, validationFeedback) {
  console.log('Generating clarification using GPT...');
  
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: process.env.GPT_MODEL_NAME || 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a busy physician responding to feedback about a radiology order. Provide a brief, direct clarification that addresses the feedback. Be concise and clinical - no pleasantries or unnecessary details. Focus only on providing the missing information or correcting the issues mentioned in the feedback. Keep your response under 50 words.'
        },
        {
          role: 'user',
          content: `Original dictation: "${dictation}"\n\nFeedback from radiologist: "${validationFeedback}"\n\nProvide a concise clarification that addresses this feedback.`
        }
      ],
      stream: false,
      temperature: 0.7,
      max_tokens: 150
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      timeout: 30000
    });
    
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
    
    // Return a simple clarification if the API call fails
    return "Patient has had symptoms for 2 weeks. Pain is moderate to severe, localized, and worsens with movement. No prior imaging. No relevant medical history.";
  }
}

/**
 * Validate clarification using Claude
 */
async function validateClarification(dictation, clarification, orderId) {
  console.log('Validating clarification using Claude...');
  
  try {
    const response = await axios.post(`${API_BASE_URL}/orders/${orderId}/clarify`, {
      originalDictation: dictation,
      clarification: clarification,
      patientInfo: {
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
        'X-Test-Mode': 'true'
      }
    });
    
    console.log('\n=== CLARIFICATION VALIDATION RESULT ===');
    console.log(JSON.stringify(response.data, null, 2));
    console.log('=====================================\n');
    
    return response.data;
  } catch (error) {
    console.error(`Error validating clarification: ${error.message}`);
    if (error.response) {
      console.error(`Response data: ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
}

/**
 * Generate override justification using GPT
 */
async function generateOverrideJustification(dictation, validationFeedback, clarification, clarificationFeedback) {
  console.log('Generating override justification using GPT...');
  
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: process.env.GPT_MODEL_NAME || 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a busy physician who needs to override a radiology order that has been rejected twice. Provide a brief, direct justification for why this imaging is necessary despite the feedback. Be concise and clinical - focus on medical necessity and clinical judgment. Keep your response under 75 words.'
        },
        {
          role: 'user',
          content: `Original dictation: "${dictation}"\n\nInitial feedback: "${validationFeedback}"\n\nMy clarification: "${clarification}"\n\nSecond feedback: "${clarificationFeedback}"\n\nProvide a concise override justification explaining why this imaging is medically necessary despite the feedback.`
        }
      ],
      stream: false,
      temperature: 0.7,
      max_tokens: 200
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      timeout: 30000
    });
    
    const override = response.data.choices[0].message.content;
    
    // Display the full override justification
    console.log('\n=== OVERRIDE JUSTIFICATION ===');
    console.log(override);
    console.log('============================\n');
    
    return override;
  } catch (error) {
    console.error(`Error generating override justification: ${error.message}`);
    if (error.response) {
      console.error(`Response data: ${JSON.stringify(error.response.data)}`);
    }
    
    // Return a simple override justification if the API call fails
    return "Clinical judgment indicates this imaging is necessary despite guidelines. Patient's symptoms are concerning for serious pathology that requires immediate evaluation. Benefits outweigh risks in this specific case.";
  }
}

/**
 * Submit override using Claude
 */
async function submitOverride(dictation, clarification, override, orderId) {
  console.log('Submitting override using Claude...');
  
  try {
    // Generate a JWT token for testing
    const token = jwt.sign(
      { userId: 1, orgId: 1, role: 'physician', email: 'test.physician@example.com' },
      config.api.jwtSecret,
      { expiresIn: '24h' }
    );
    
    // Step 1: Final Validation Call with override flag
    const validationPayload = {
      orderId: orderId,
      dictationText: `${dictation}\n--------Clarification----------\n${clarification}\n--------Override Justification----------\n${override}`,
      isOverrideValidation: true,
      patientInfo: {
        id: 1,
        firstName: "Test",
        lastName: "Patient",
        dateOfBirth: "1980-01-01",
        gender: "M",
        mrn: "TEST12345"
      }
    };
    
    const finalValidationResponse = await axios.post(`${API_BASE_URL}/orders/validate`, validationPayload, {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      }
    });
    
    console.log('\n=== OVERRIDE VALIDATION RESULT ===');
    console.log(JSON.stringify(finalValidationResponse.data, null, 2));
    console.log('================================\n');
    
    const finalValidationResult = finalValidationResponse.data.validationResult;
    
    // Step 2: Final PUT Submission Call
    const submissionPayload = {
      // Required fields
      finalValidationStatus: 'override',
      finalCPTCode: finalValidationResult.suggestedCPTCodes?.[0]?.code || "70450",
      clinicalIndication: dictation,
      
      // Include all necessary fields from the final validation result
      final_cpt_code: finalValidationResult.suggestedCPTCodes?.[0]?.code || "70450",
      final_cpt_code_description: finalValidationResult.suggestedCPTCodes?.[0]?.description || "CT HEAD/BRAIN W/O CONTRAST",
      final_icd10_codes: Array.from(new Set(finalValidationResult.suggestedICD10Codes?.map(code => code.code).filter(Boolean) || [])).join(','),
      final_validation_status: 'override', // Explicitly mark as override
      final_compliance_score: finalValidationResult.complianceScore,
      final_validation_notes: finalValidationResult.feedback || null,
      validated_at: new Date().toISOString(),
      
      // Crucial Override Fields
      overridden: true,
      override_justification: override,
      
      // Signature Fields
      signed_by_user_id: 1, // Using the physician user ID
      signature_date: new Date().toISOString(),
      signer_name: "Test Physician",
      
      // Status
      status: 'pending_admin'
    };
    
    const submissionResponse = await axios.put(`${API_BASE_URL}/orders/${orderId}`, submissionPayload, {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      }
    });
    
    console.log('\n=== OVERRIDE SUBMISSION RESULT ===');
    console.log(JSON.stringify(submissionResponse.data, null, 2));
    console.log('=================================\n');
    
    return submissionResponse.data;
  } catch (error) {
    console.error(`Error submitting override: ${error.message}`);
    if (error.response) {
      console.error(`Response data: ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
}

/**
 * Run a single test case through the full workflow
 */
async function runTestCase(caseNumber) {
  console.log(`\n=== Running Test Case ${caseNumber} ===\n`);
  
  const result = {
    caseNumber: caseNumber,
    startTime: new Date().toISOString(),
    steps: []
  };
  
  try {
    // Step 1: Generate dictation using Grok
    const dictation = await generateDictation();
    result.dictation = dictation;
    result.steps.push({
      step: 'generate_dictation',
      model: 'gpt',
      timestamp: new Date().toISOString(),
      output: dictation
    });
    
    // Step 2: Validate dictation using Claude
    const validationResult = await validateDictation(dictation);
    result.initialValidation = validationResult;
    result.steps.push({
      step: 'validate_dictation',
      model: 'anthropic',
      timestamp: new Date().toISOString(),
      output: validationResult
    });
    
    const orderId = validationResult.orderId;
    
    // If validation passed, we're done
    if (validationResult.validationResult.validationStatus === 'appropriate') {
      console.log('Validation passed on first attempt!');
      result.finalStatus = 'validated_first_attempt';
      result.endTime = new Date().toISOString();
      result.duration = (new Date(result.endTime) - new Date(result.startTime)) / 1000;
      return result;
    }
    
    // Step 3: Generate clarification using GPT
    const validationFeedback = validationResult.validationResult.feedback;
    const clarification = await generateClarification(dictation, validationFeedback);
    result.clarification = clarification;
    result.steps.push({
      step: 'generate_clarification',
      model: 'gpt',
      timestamp: new Date().toISOString(),
      output: clarification
    });
    
    // Step 4: Validate clarification using Claude
    const clarificationResult = await validateClarification(dictation, clarification, orderId);
    result.clarificationValidation = clarificationResult;
    result.steps.push({
      step: 'validate_clarification',
      model: 'anthropic',
      timestamp: new Date().toISOString(),
      output: clarificationResult
    });
    
    // If clarification validation passed, we're done
    if (clarificationResult.validationStatus === 'appropriate') {
      console.log('Validation passed after clarification!');
      result.finalStatus = 'validated_after_clarification';
      result.endTime = new Date().toISOString();
      result.duration = (new Date(result.endTime) - new Date(result.startTime)) / 1000;
      return result;
    }
    
    // Step 5: Generate second clarification using GPT
    const clarificationFeedback = clarificationResult.feedback;
    const secondClarification = await generateClarification(dictation + '\n' + clarification, clarificationFeedback);
    result.secondClarification = secondClarification;
    result.steps.push({
      step: 'generate_second_clarification',
      model: 'gpt',
      timestamp: new Date().toISOString(),
      output: secondClarification
    });
    
    // Step 6: Validate second clarification using Claude
    const secondClarificationResult = await validateClarification(dictation + '\n' + clarification, secondClarification, orderId);
    result.secondClarificationValidation = secondClarificationResult;
    result.steps.push({
      step: 'validate_second_clarification',
      model: 'anthropic',
      timestamp: new Date().toISOString(),
      output: secondClarificationResult
    });
    
    // If second clarification validation passed, we're done
    if (secondClarificationResult.validationStatus === 'appropriate') {
      console.log('Validation passed after second clarification!');
      result.finalStatus = 'validated_after_second_clarification';
      result.endTime = new Date().toISOString();
      result.duration = (new Date(result.endTime) - new Date(result.startTime)) / 1000;
      return result;
    }
    
    // Step 7: Generate override justification using GPT
    const secondClarificationFeedback = secondClarificationResult.feedback;
    const override = await generateOverrideJustification(dictation, validationFeedback, clarification + '\n' + secondClarification, secondClarificationFeedback);
    result.override = override;
    result.steps.push({
      step: 'generate_override',
      model: 'gpt',
      timestamp: new Date().toISOString(),
      output: override
    });
    
    // Step 8: Submit override using Claude
    const overrideResult = await submitOverride(dictation, clarification + '\n' + secondClarification, override, orderId);
    result.overrideResult = overrideResult;
    result.steps.push({
      step: 'submit_override',
      model: 'anthropic',
      timestamp: new Date().toISOString(),
      output: overrideResult
    });
    
    console.log('Order successfully overridden!');
    result.finalStatus = 'overridden';
    result.endTime = new Date().toISOString();
    result.duration = (new Date(result.endTime) - new Date(result.startTime)) / 1000;
    return result;
  } catch (error) {
    console.error(`Error running test case ${caseNumber}: ${error.message}`);
    result.error = error.message;
    result.finalStatus = 'error';
    result.endTime = new Date().toISOString();
    result.duration = (new Date(result.endTime) - new Date(result.startTime)) / 1000;
    return result;
  }
}

/**
 * Run all test cases
 */
async function runAllTestCases() {
  console.log(`Starting Clinical Workflow Simulation with ${numCases} cases`);
  console.log('=============================================');
  
  const startTime = new Date();
  const summary = {
    startTime: startTime.toISOString(),
    results: []
  };
  
  for (let i = 1; i <= numCases; i++) {
    const result = await runTestCase(i);
    summary.results.push({
      caseNumber: i,
      finalStatus: result.finalStatus,
      duration: result.duration
    });
    
    // Save detailed result to file
    const resultFile = path.join(resultsDir, `case-${i}-result.json`);
    fs.writeFileSync(resultFile, JSON.stringify(result, null, 2));
    console.log(`Detailed results for case ${i} saved to ${resultFile}`);
  }
  
  // Calculate summary statistics
  const endTime = new Date();
  summary.endTime = endTime.toISOString();
  summary.duration = (endTime - startTime) / 1000;
  summary.totalCases = numCases;
  
  // Count cases by final status
  const statusCounts = {};
  for (const result of summary.results) {
    statusCounts[result.finalStatus] = (statusCounts[result.finalStatus] || 0) + 1;
  }
  summary.statusCounts = statusCounts;
  
  // Save summary to file
  const summaryFile = path.join(resultsDir, 'summary.json');
  fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
  
  // Print summary
  console.log('\n=== Test Summary ===');
  console.log(`Total cases: ${summary.totalCases}`);
  console.log('Status breakdown:');
  for (const [status, count] of Object.entries(statusCounts)) {
    console.log(`  ${status}: ${count} (${(count / summary.totalCases * 100).toFixed(2)}%)`);
  }
  console.log(`Duration: ${summary.duration.toFixed(2)} seconds`);
  console.log(`\nDetailed results saved to ${resultsDir}`);
  
  return summary;
}

// Run the tests
runAllTestCases().catch(error => {
  console.error('Error running tests:', error);
  process.exit(1);
});