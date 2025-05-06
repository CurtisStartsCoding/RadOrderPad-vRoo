/**
 * Test Validation with Weighted Search - Modified Version
 * 
 * This script tests the validation engine with the weighted search implementation.
 * It runs a validation on a sample text and logs the results.
 * 
 * This modified version bypasses the database connection for getting the prompt template.
 */

import { callLLMWithFallback } from '../dist/utils/llm/index.js';
import { stripPHI, extractMedicalKeywords } from '../dist/utils/text-processing/index.js';
import { generateDatabaseContextWithRedis } from '../dist/utils/database/index.js';
import { processLLMResponse } from '../dist/utils/response/index.js';
import logger from '../dist/utils/logger.js';

// Sample text to validate
const sampleText = `
Patient presents with shoulder pain that has been ongoing for 3 weeks. 
The pain is worse with overhead activities and at night. 
Patient reports a history of rotator cuff tear in the past.
Requesting MRI of the shoulder to evaluate for possible rotator cuff tear.
`;

// Hardcoded prompt template
const promptTemplate = {
  id: 'hardcoded-template',
  content_template: `You are RadValidator, an AI clinical decision support system for radiology order validation.

Your task is to analyze a physician's dictation for a radiology order and produce the following outputs:
1. Extract relevant ICD-10 diagnosis codes (CRITICAL: You MUST mark EXACTLY ONE code as isPrimary: true)
2. Extract or suggest appropriate CPT procedure codes
3. Validate if the imaging order is clinically appropriate
4. Assign a compliance score from 1-9
5. Provide brief educational feedback if the order is inappropriate
6. Evaluate dictation for stat status

{{DATABASE_CONTEXT}}

IMPORTANT GUIDELINES:
- Validate based on ACR Appropriateness Criteria and evidence-based guidelines
- For inappropriate orders, suggest alternative approaches
- You MUST designate exactly one ICD-10 code as primary (isPrimary: true)

IMPORTANT CODING RULES:
- Do NOT assign ICD-10 codes for conditions described as 'probable', 'suspected', 'questionable', 'rule out', or similar terms indicating uncertainty.
- Instead, code the condition(s) to the highest degree of certainty for that encounter/visit, such as symptoms, signs, abnormal test results, or other reasons for the visit.`
};

// Enable debug logging to see the search results
process.env.LOG_LEVEL = 'debug';

/**
 * Construct the prompt with the template, text, and context
 */
function constructPrompt(template, text, databaseContext, wordLimit = 33, isOverrideValidation = false) {
  // Replace placeholders in the template
  let prompt = template.replace('{{DATABASE_CONTEXT}}', databaseContext);
  
  // Add the dictation text
  const promptWithText = `${prompt}\n\nPlease analyze this radiology order dictation:\n\n"${text}"`;
  
  // Add the response format instructions
  const responseFormat = `
Respond in JSON format with these fields:
- suggestedICD10Codes: Array of {code, description, isPrimary} objects (one code must have isPrimary: true)
- suggestedCPTCodes: Array of {code, description} objects
- validationStatus: "appropriate", "needs_clarification", or "inappropriate"
- complianceScore: Number 1-9
- priority: "routine" or "stat"
- feedback: Brief educational note (${wordLimit} words target length)`;
  
  return promptWithText + responseFormat;
}

async function testValidationWithWeightedSearch() {
  console.log('Testing validation with weighted search...');
  console.log('Sample text:', sampleText);
  
  try {
    // 1. Strip PHI from the text
    console.log('\nRunning validation...');
    console.log('Starting validation process...');
    const sanitizedText = stripPHI(sampleText);
    console.log('PHI sanitization completed');
    
    // 2. Extract medical keywords for context generation
    const keywords = extractMedicalKeywords(sanitizedText);
    console.log('Extracted keywords count:', keywords.length);
    
    // 3. Use hardcoded prompt template
    console.log('Using hardcoded prompt template');
    
    // 4. Generate database context based on keywords using RedisSearch
    const databaseContext = await generateDatabaseContextWithRedis(keywords);
    console.log('Database context generation completed');
    
    // 5. Construct the prompt with hard-coded word limit of 33
    console.log('Using word count limit: 33');
    const prompt = constructPrompt(promptTemplate.content_template, sanitizedText, databaseContext, 33);
    console.log('Prompt construction completed');
    
    // 6. Call LLM with fallback logic
    const llmResponse = await callLLMWithFallback(prompt);
    console.log(`LLM call completed using ${llmResponse.provider}`);
    console.log(`Performance metrics - Tokens: ${llmResponse.totalTokens}, Latency: ${llmResponse.latencyMs}ms`);
    
    // 7. Process the LLM response
    const result = processLLMResponse(llmResponse.content);
    console.log('Response processing completed');
    
    // Log the result
    console.log('\nValidation result:');
    console.log(JSON.stringify(result, null, 2));
    
    // Check the validation status
    if (result.validationStatus) {
      if (result.validationStatus === 'appropriate') {
        console.log('\nValidation SUCCESSFUL!');
        console.log('Validation Status: APPROPRIATE');
      } else if (result.validationStatus === 'needs_clarification') {
        console.log('\nValidation NEEDS CLARIFICATION!');
        console.log('Validation Status: NEEDS CLARIFICATION');
      } else if (result.validationStatus === 'inappropriate') {
        console.log('\nValidation FAILED - INAPPROPRIATE!');
        console.log('Validation Status: INAPPROPRIATE');
      } else {
        console.log('\nValidation completed with unknown status!');
        console.log('Validation Status:', result.validationStatus);
      }
      
      console.log('Compliance Score:', result.complianceScore);
      console.log('Suggested ICD-10 Codes:', result.suggestedICD10Codes.map(code => `${code.code}: ${code.description}`).join(', '));
      console.log('Suggested CPT Codes:', result.suggestedCPTCodes.map(code => `${code.code}: ${code.description}`).join(', '));
      console.log('Feedback:', result.feedback);
    } else {
      console.log('\nValidation processing error!');
      console.log('Error:', result.error);
    }
    
    console.log('\nTest completed.');
  } catch (error) {
    console.error('Error testing validation with weighted search:', error);
  }
}

// Run the test
testValidationWithWeightedSearch().catch(console.error);