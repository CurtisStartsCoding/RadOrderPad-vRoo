/**
 * Prompt Comparison Test
 * 
 * This script tests both the old and new prompts with the same dictation text
 * to compare their ability to identify hemochromatosis (E83.110).
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.production
dotenv.config({ path: '.env.production' });

// Hemochromatosis case dictation text
const DICTATION_TEXT = "48-year-old female with chronic diarrhea for past 4 months, typically 4-5 loose stools daily. Reports upper right quadrant discomfort after meals. Patient has noted darkening of skin on knuckles and neck folds. Recent lab work shows mildly elevated ferritin and transaminases. Family history significant for father with cirrhosis of \"unknown cause.\" Order abdominal ultrasound to evaluate for possible gallbladder disease.";

// Database context from the old prompt
const OLD_DATABASE_CONTEXT = `POSTGRESQL DATABASE CONTEXT:
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
  }
];

// Create results directory if it doesn't exist
const resultsDir = path.join(__dirname, 'prompt-comparison-results');
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir);
}

// Function to call LLM API
async function callLLM(llmConfig, prompt, dictationText, oldFormat) {
  try {
    console.log(`Calling ${llmConfig.name} API with ${oldFormat ? 'OLD' : 'NEW'} prompt format...`);
    const startTime = Date.now();
    
    const response = await axios.post(
      llmConfig.endpoint,
      llmConfig.formatRequest(prompt, dictationText, oldFormat),
      { headers: llmConfig.headers }
    );
    
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

// Main function to run the test
async function runTest() {
  console.log('Starting prompt comparison test...');
  
  const results = {
    dictationText: DICTATION_TEXT,
    oldPromptResults: {},
    newPromptResults: {}
  };
  
  // Test with each LLM
  for (const llmConfig of LLM_CONFIGS) {
    try {
      console.log(`\n=== Testing with ${llmConfig.name} ===`);
      
      // Test with old prompt
      console.log('\n--- Testing with OLD prompt ---');
      const oldPromptResponse = await callLLM(llmConfig, OLD_PROMPT, DICTATION_TEXT, true);
      
      // Save raw response to file
      const oldPromptResponsePath = path.join(resultsDir, `${llmConfig.name}_old_prompt_response.txt`);
      fs.writeFileSync(oldPromptResponsePath, oldPromptResponse.content);
      console.log(`Raw response saved to ${oldPromptResponsePath}`);
      
      // Parse response
      const oldPromptParsed = parseLLMResponse(oldPromptResponse.content);
      
      // Check for hemochromatosis
      const oldPromptHemochromatosisCheck = checkForHemochromatosis(oldPromptParsed, true);
      console.log(`Hemochromatosis check: ${oldPromptHemochromatosisCheck.message}`);
      
      // Save results
      results.oldPromptResults[llmConfig.name] = {
        responseTime: oldPromptResponse.responseTime,
        parsedResponse: oldPromptParsed,
        hemochromatosisCheck: oldPromptHemochromatosisCheck
      };
      
      // Test with new prompt
      console.log('\n--- Testing with NEW prompt ---');
      const newPromptResponse = await callLLM(llmConfig, NEW_PROMPT, DICTATION_TEXT, false);
      
      // Save raw response to file
      const newPromptResponsePath = path.join(resultsDir, `${llmConfig.name}_new_prompt_response.txt`);
      fs.writeFileSync(newPromptResponsePath, newPromptResponse.content);
      console.log(`Raw response saved to ${newPromptResponsePath}`);
      
      // Parse response
      const newPromptParsed = parseLLMResponse(newPromptResponse.content);
      
      // Check for hemochromatosis
      const newPromptHemochromatosisCheck = checkForHemochromatosis(newPromptParsed, false);
      console.log(`Hemochromatosis check: ${newPromptHemochromatosisCheck.message}`);
      
      // Save results
      results.newPromptResults[llmConfig.name] = {
        responseTime: newPromptResponse.responseTime,
        parsedResponse: newPromptParsed,
        hemochromatosisCheck: newPromptHemochromatosisCheck
      };
      
    } catch (error) {
      console.error(`Error testing with ${llmConfig.name}:`, error.message);
      results[llmConfig.name] = {
        error: error.message
      };
    }
  }
  
  // Save overall results
  const resultsPath = path.join(resultsDir, 'comparison_results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`\nOverall results saved to ${resultsPath}`);
  
  // Print summary
  console.log('\n=== Summary ===');
  for (const llmConfig of LLM_CONFIGS) {
    console.log(`\n${llmConfig.name}:`);
    
    if (results.oldPromptResults[llmConfig.name]) {
      console.log(`  OLD prompt: ${results.oldPromptResults[llmConfig.name].hemochromatosisCheck.message}`);
    } else {
      console.log(`  OLD prompt: Error or no results`);
    }
    
    if (results.newPromptResults[llmConfig.name]) {
      console.log(`  NEW prompt: ${results.newPromptResults[llmConfig.name].hemochromatosisCheck.message}`);
    } else {
      console.log(`  NEW prompt: Error or no results`);
    }
  }
}

// Function to run multiple tests and aggregate results
async function runMultipleTests(iterations = 10) {
  console.log(`Starting ${iterations} iterations of prompt comparison tests...`);
  
  const aggregatedResults = {
    dictationText: DICTATION_TEXT,
    iterations,
    oldPromptResults: {
      Claude: { hemochromatosisDetected: 0, totalRuns: 0 },
      GPT: { hemochromatosisDetected: 0, totalRuns: 0 }
    },
    newPromptResults: {
      Claude: { hemochromatosisDetected: 0, totalRuns: 0 },
      GPT: { hemochromatosisDetected: 0, totalRuns: 0 }
    },
    allResults: []
  };
  
  for (let i = 0; i < iterations; i++) {
    console.log(`\n=== Running iteration ${i + 1}/${iterations} ===`);
    
    try {
      const results = {
        iteration: i + 1,
        oldPromptResults: {},
        newPromptResults: {}
      };
      
      // Test with each LLM
      for (const llmConfig of LLM_CONFIGS) {
        try {
          console.log(`\n=== Testing with ${llmConfig.name} ===`);
          
          // Test with old prompt
          console.log('\n--- Testing with OLD prompt ---');
          const oldPromptResponse = await callLLM(llmConfig, OLD_PROMPT, DICTATION_TEXT, true);
          
          // Save raw response to file
          const oldPromptResponsePath = path.join(resultsDir, `${llmConfig.name}_old_prompt_response_${i + 1}.txt`);
          fs.writeFileSync(oldPromptResponsePath, oldPromptResponse.content);
          console.log(`Raw response saved to ${oldPromptResponsePath}`);
          
          // Parse response
          const oldPromptParsed = parseLLMResponse(oldPromptResponse.content);
          
          // Check for hemochromatosis
          const oldPromptHemochromatosisCheck = checkForHemochromatosis(oldPromptParsed, true);
          console.log(`Hemochromatosis check: ${oldPromptHemochromatosisCheck.message}`);
          
          // Update aggregated results
          aggregatedResults.oldPromptResults[llmConfig.name].totalRuns++;
          if (oldPromptHemochromatosisCheck.found) {
            aggregatedResults.oldPromptResults[llmConfig.name].hemochromatosisDetected++;
          }
          
          // Save results
          results.oldPromptResults[llmConfig.name] = {
            responseTime: oldPromptResponse.responseTime,
            parsedResponse: oldPromptParsed,
            hemochromatosisCheck: oldPromptHemochromatosisCheck
          };
          
          // Test with new prompt
          console.log('\n--- Testing with NEW prompt ---');
          const newPromptResponse = await callLLM(llmConfig, NEW_PROMPT, DICTATION_TEXT, false);
          
          // Save raw response to file
          const newPromptResponsePath = path.join(resultsDir, `${llmConfig.name}_new_prompt_response_${i + 1}.txt`);
          fs.writeFileSync(newPromptResponsePath, newPromptResponse.content);
          console.log(`Raw response saved to ${newPromptResponsePath}`);
          
          // Parse response
          const newPromptParsed = parseLLMResponse(newPromptResponse.content);
          
          // Check for hemochromatosis
          const newPromptHemochromatosisCheck = checkForHemochromatosis(newPromptParsed, false);
          console.log(`Hemochromatosis check: ${newPromptHemochromatosisCheck.message}`);
          
          // Update aggregated results
          aggregatedResults.newPromptResults[llmConfig.name].totalRuns++;
          if (newPromptHemochromatosisCheck.found) {
            aggregatedResults.newPromptResults[llmConfig.name].hemochromatosisDetected++;
          }
          
          // Save results
          results.newPromptResults[llmConfig.name] = {
            responseTime: newPromptResponse.responseTime,
            parsedResponse: newPromptParsed,
            hemochromatosisCheck: newPromptHemochromatosisCheck
          };
          
        } catch (error) {
          console.error(`Error testing with ${llmConfig.name}:`, error.message);
          results[llmConfig.name] = {
            error: error.message
          };
        }
      }
      
      // Add this iteration's results to the aggregated results
      aggregatedResults.allResults.push(results);
      
    } catch (error) {
      console.error(`Error in iteration ${i + 1}:`, error.message);
    }
  }
  
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
  const aggregatedResultsPath = path.join(resultsDir, 'aggregated_results.json');
  fs.writeFileSync(aggregatedResultsPath, JSON.stringify(aggregatedResults, null, 2));
  console.log(`\nAggregated results saved to ${aggregatedResultsPath}`);
  
  // Print summary
  console.log('\n=== Summary of Multiple Test Runs ===');
  console.log(`Total iterations: ${iterations}`);
  
  for (const llmConfig of LLM_CONFIGS) {
    console.log(`\n${llmConfig.name}:`);
    
    const oldPromptResults = aggregatedResults.oldPromptResults[llmConfig.name];
    console.log(`  OLD prompt: Detected hemochromatosis in ${oldPromptResults.hemochromatosisDetected}/${oldPromptResults.totalRuns} runs (${(oldPromptResults.detectionRate * 100).toFixed(2)}%)`);
    
    const newPromptResults = aggregatedResults.newPromptResults[llmConfig.name];
    console.log(`  NEW prompt: Detected hemochromatosis in ${newPromptResults.hemochromatosisDetected}/${newPromptResults.totalRuns} runs (${(newPromptResults.detectionRate * 100).toFixed(2)}%)`);
  }
  
  return aggregatedResults;
}

// Run multiple tests
runMultipleTests(10);