/**
 * Token Optimization Test Script
 * 
 * This script tests the token usage difference between the current database context format
 * and an optimized format by making real API calls to Claude.
 */

require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

// Anthropic API key from environment variables
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!ANTHROPIC_API_KEY) {
  console.error('Error: ANTHROPIC_API_KEY environment variable is not set.');
  console.error('Please set it in your .env file or environment variables.');
  process.exit(1);
}

// Test case
const TEST_CASE = {
  name: "Back Pain Case",
  text: "47-year-old male with low back pain after moving furniture yesterday, radiating to left buttock without leg symptoms. Order lumbar spine X-ray 2 views."
};

// Sample database context in your current format
const CURRENT_FORMAT = `-- Relevant ICD-10 Codes --
M54.5 - Low back pain
Clinical Notes: Common condition affecting the lumbar region. May be acute or chronic. Often associated with muscle strain, disc issues, or arthritis.
Recommended Imaging: X-ray for initial evaluation, MRI for persistent symptoms or red flags
Primary Imaging: X-ray

M54.4 - Lumbago with sciatica
Clinical Notes: Low back pain with radiation to lower limb following nerve root distribution. May involve sensory and motor symptoms.
Recommended Imaging: MRI lumbar spine, X-ray
Primary Imaging: MRI lumbar spine

M51.2 - Other specified intervertebral disc displacement
Clinical Notes: Includes disc herniation, prolapse, or bulge. May cause nerve root compression and radicular symptoms.
Recommended Imaging: MRI lumbar spine, CT in select cases
Primary Imaging: MRI lumbar spine

-- Relevant CPT Codes --
72100 - Radiologic examination, spine, lumbosacral; 2 or 3 views
Modality: X-ray
Body Part: Lumbar spine

72110 - Radiologic examination, spine, lumbosacral; minimum of 4 views
Modality: X-ray
Body Part: Lumbar spine

72114 - Radiologic examination, spine, lumbosacral; complete, including bending views, minimum of 6 views
Modality: X-ray
Body Part: Lumbar spine

-- Relevant ICD-10 to CPT Mappings --
ICD-10: M54.5 (Low back pain) -> CPT: 72100 (Radiologic examination, spine, lumbosacral; 2 or 3 views)
Appropriateness Score: 8/9
Evidence Source: ACR Appropriateness Criteria
Justification: X-ray is appropriate for initial evaluation of low back pain, especially with history of trauma or when red flags are present.

ICD-10: M54.5 (Low back pain) -> CPT: 72148 (Magnetic resonance (eg, proton) imaging, spinal canal and contents, lumbar; without contrast material)
Appropriateness Score: 5/9
Evidence Source: ACR Appropriateness Criteria
Justification: MRI is generally not indicated for acute low back pain without red flags or neurological deficits. Consider for persistent symptoms.

-- Additional Clinical Information --
ICD-10: M54.5 (Low back pain)
Low back pain is one of the most common reasons for medical visits. The differential diagnosis is broad and includes muscle strain, disc herniation, facet arthropathy, sacroiliitis, compression fracture, and spinal stenosis. Red flags that may indicate serious underlying conditions include trauma, unexplained weight loss, history of cancer, fever, immunosuppression, saddle anesthesia, severe or progressive neurological deficits, and duration >6 weeks. Initial imaging with radiographs is appropriate for patients with red flags or those with risk factors for fracture. MRI is typically reserved for patients with persistent symptoms, red flags, or neurological deficits. Conservative management is recommended for acute low back pain without red flags, including activity modification, physical therapy, and appropriate analgesics.`;

// Sample database context in the optimized format
const OPTIMIZED_FORMAT = `POSTGRESQL DATABASE CONTEXT:
POSSIBLE DIAGNOSES (from PostgreSQL database):
- M54.5: Low back pain (confidence: 80%)
- M54.4: Lumbago with sciatica (confidence: 80%)
- M51.2: Other specified intervertebral disc displacement (confidence: 80%)

POSSIBLE PROCEDURES (from PostgreSQL database):
- 72100: Radiologic examination, spine, lumbosacral; 2 or 3 views (X-ray) (confidence: 80%)
- 72110: Radiologic examination, spine, lumbosacral; minimum of 4 views (X-ray) (confidence: 80%)
- 72114: Radiologic examination, spine, lumbosacral; complete, including bending views, minimum of 6 views (X-ray) (confidence: 80%)

APPROPRIATENESS MAPPINGS (from PostgreSQL database):
- M54.5 (Low back pain) → 72100 (Radiologic examination, spine, lumbosacral; 2 or 3 views) Score 8/9
- M54.5 (Low back pain) → 72148 (Magnetic resonance (eg, proton) imaging, spinal canal and contents, lumbar; without contrast material) Score 5/9
- 1 additional mapping(s) found but not included to save tokens.

MEDICAL DOCUMENTATION (from PostgreSQL database):
- M54.5 (Low back pain): Low back pain is one of the most common reasons for medical visits. The differential diagnosis is broad and includes muscle strain, disc herniation, facet arthropathy, sacroiliitis, compression fracture, and spinal stenosis. Red flags that may indicate...`;

// Sample prompt template in your current format
const CURRENT_PROMPT_TEMPLATE = `You are RadValidator, an AI clinical decision support system for radiology order validation.

Your job is to review the physician's dictation and return a JSON object that includes:
- ICD-10 diagnosis codes (must include exactly one marked as isPrimary: true)
- CPT procedure codes
- Appropriateness assessment
- A compliance score from 1 to 9
- A concise educational note if the order is inappropriate or needs clarification
- An internal explanation of how the decision was made, including any missing clinical elements that may affect payer approval

DATABASE CONTEXT:
{{DATABASE_CONTEXT}}

DICTATION TEXT:
{{DICTATION_TEXT}}

IMPORTANT VALIDATION GUIDELINES:
- Validate based on ACR Appropriateness Criteria and evidence-based standards.
- Review the dictation for the following 15 clinical completeness elements that impact payer review and peer-to-peer justification:

  1. Symptom onset and duration  
  2. Laterality (right vs. left)  
  3. Failed conservative treatment  
  4. Pertinent negative findings  
  5. Exam findings  
  6. Progression or worsening  
  7. Functional impact (e.g., walking, vision, daily living)  
  8. Supporting data (labs, vitals)  
  9. Relevant risk factors or comorbidities  
  10. Prior imaging performed  
  11. Red flag symptoms (e.g., weight loss, trauma, neuro deficits)  
  12. Recent hospitalization or ED visit  
  13. Treatment response to prior care  
  14. Impression consistency (does stated concern match study?)  
  15. Specific clinical question or concern being evaluated

If any of these are missing and would affect payer approval, provide concise physician-facing feedback to improve the order.


RESPONSE FORMAT:
Return your output in this exact JSON structure:

\`\`\`json
{
  "validationStatus": "appropriate",  // or "needs_clarification" or "inappropriate"
  "complianceScore": 1-9,
  "feedback": "Always return a concise, educational note (33 words target length). If the order is appropriate, highlight what was done well to support payer approval.",
  "suggestedICD10Codes": [
    { "code": "ICD-10", "description": "Diagnosis description", "isPrimary": true },
    { "code": "ICD-10", "description": "Diagnosis description", "isPrimary": false }
  ],
  "suggestedCPTCodes": [
    { "code": "CPT", "description": "Procedure description" }
  ],
  "internalReasoning": "Explanation of validation logic, including which clinical elements are present and which are missing. This should include appropriateness rationale and payer-review risk based on gaps."
}
\`\`\``;

// Sample prompt template in the optimized format
const OPTIMIZED_PROMPT_TEMPLATE = `You are RadValidator, an AI clinical decision support system for radiology order validation.

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

Only use contrast when there is a specific indication (infection, tumor, post-surgical).`;

/**
 * Call Anthropic Claude API with the given prompt
 */
async function callClaudeAPI(systemPrompt, userPrompt) {
  try {
    console.log('Calling Anthropic Claude API...');
    
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 4000,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: userPrompt
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        }
      }
    );
    
    return {
      content: response.data.content[0].text,
      usage: response.data.usage,
      model: response.data.model
    };
  } catch (error) {
    console.error('Error calling Claude API:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Run the comparison test
 */
async function runComparisonTest() {
  try {
    console.log('=== COMPARING PROMPT FORMATS ===');
    console.log(`Test case: "${TEST_CASE.text}"`);
    
    // Create prompts
    const currentSystemPrompt = CURRENT_PROMPT_TEMPLATE.replace('{{DATABASE_CONTEXT}}', CURRENT_FORMAT).replace('{{DICTATION_TEXT}}', TEST_CASE.text);
    const optimizedSystemPrompt = OPTIMIZED_PROMPT_TEMPLATE.replace('{{DATABASE_CONTEXT}}', OPTIMIZED_FORMAT);
    
    const currentUserPrompt = `Please analyze this radiology order dictation:

"${TEST_CASE.text}"`;
    
    const optimizedUserPrompt = `Please analyze this radiology order dictation:

"${TEST_CASE.text}"

Respond in JSON format with these fields:
- diagnosisCodes: Array of {code, description} objects
- procedureCodes: Array of {code, description} objects
- validationStatus: "valid" or "invalid"
- complianceScore: Number 1-9
- feedback: Brief educational note for inappropriate orders (33 words target length for General Radiology)`;
    
    // Call Claude API with current format
    console.log('\n=== TESTING CURRENT FORMAT ===');
    const currentResult = await callClaudeAPI(currentSystemPrompt, currentUserPrompt);
    
    // Call Claude API with optimized format
    console.log('\n=== TESTING OPTIMIZED FORMAT ===');
    const optimizedResult = await callClaudeAPI(optimizedSystemPrompt, optimizedUserPrompt);
    
    // Calculate token usage
    const currentInputTokens = currentResult.usage.input_tokens;
    const currentOutputTokens = currentResult.usage.output_tokens;
    const currentTotalTokens = currentInputTokens + currentOutputTokens;
    
    const optimizedInputTokens = optimizedResult.usage.input_tokens;
    const optimizedOutputTokens = optimizedResult.usage.output_tokens;
    const optimizedTotalTokens = optimizedInputTokens + optimizedOutputTokens;
    
    const inputSavings = currentInputTokens - optimizedInputTokens;
    const outputSavings = currentOutputTokens - optimizedOutputTokens;
    const totalSavings = currentTotalTokens - optimizedTotalTokens;
    
    const inputSavingsPercent = Math.round((inputSavings / currentInputTokens) * 100);
    const outputSavingsPercent = Math.round((outputSavings / currentOutputTokens) * 100);
    const totalSavingsPercent = Math.round((totalSavings / currentTotalTokens) * 100);
    
    // Output results
    console.log('\n=== RESULTS ===');
    console.log('Current Format:');
    console.log(`- Input Tokens: ${currentInputTokens}`);
    console.log(`- Output Tokens: ${currentOutputTokens}`);
    console.log(`- Total Tokens: ${currentTotalTokens}`);
    
    console.log('\nOptimized Format:');
    console.log(`- Input Tokens: ${optimizedInputTokens}`);
    console.log(`- Output Tokens: ${optimizedOutputTokens}`);
    console.log(`- Total Tokens: ${optimizedTotalTokens}`);
    
    console.log('\nSavings:');
    console.log(`- Input Tokens: ${inputSavings} (${inputSavingsPercent}%)`);
    console.log(`- Output Tokens: ${outputSavings} (${outputSavingsPercent}%)`);
    console.log(`- Total Tokens: ${totalSavings} (${totalSavingsPercent}%)`);
    
    // Save results to file
    const resultsDir = path.join(__dirname, 'test-results');
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const resultsPath = path.join(resultsDir, `token-optimization-test-${timestamp}.json`);
    
    await fsPromises.writeFile(resultsPath, JSON.stringify({
      testCase: TEST_CASE,
      currentFormat: {
        systemPrompt: currentSystemPrompt,
        userPrompt: currentUserPrompt,
        result: {
          content: currentResult.content,
          usage: currentResult.usage
        }
      },
      optimizedFormat: {
        systemPrompt: optimizedSystemPrompt,
        userPrompt: optimizedUserPrompt,
        result: {
          content: optimizedResult.content,
          usage: optimizedResult.usage
        }
      },
      savings: {
        inputTokens: inputSavings,
        inputTokensPercent: inputSavingsPercent,
        outputTokens: outputSavings,
        outputTokensPercent: outputSavingsPercent,
        totalTokens: totalSavings,
        totalTokensPercent: totalSavingsPercent
      }
    }, null, 2));
    
    console.log(`\nFull results saved to: ${resultsPath}`);
    
    return {
      currentInputTokens,
      currentOutputTokens,
      currentTotalTokens,
      optimizedInputTokens,
      optimizedOutputTokens,
      optimizedTotalTokens,
      inputSavings,
      outputSavings,
      totalSavings,
      inputSavingsPercent,
      outputSavingsPercent,
      totalSavingsPercent
    };
    
  } catch (error) {
    console.error('Error running comparison test:', error);
    throw error;
  }
}

// Run the comparison test
runComparisonTest()
  .then(() => {
    console.log('\nComparison test completed successfully.');
  })
  .catch(error => {
    console.error('Comparison test failed:', error);
    process.exit(1);
  });