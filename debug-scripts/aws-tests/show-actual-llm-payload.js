/**
 * Script to show the actual payload sent to the LLM
 * 
 * This script demonstrates what's actually sent to the LLM after PHI stripping
 * and database context generation.
 */

// The dictation text from the API request
const dictationText = "48-year-old female with chronic diarrhea for past 4 months, typically 4-5 loose stools daily. Reports upper right quadrant discomfort after meals. Patient has noted darkening of skin on knuckles and neck folds. Recent lab work shows mildly elevated ferritin and transaminases. Family history significant for father with cirrhosis of \"unknown cause.\" Order abdominal ultrasound to evaluate for possible gallbladder disease.";

// Step 1: Strip PHI from the text
// This is a simplified version of the actual PHI stripping function
function stripPHI(text) {
  // The actual function has more sophisticated patterns
  // but this gives you an idea of what it does
  let sanitizedText = text;
  
  // Replace potential dates
  sanitizedText = sanitizedText.replace(/\b(0?[1-9]|1[0-2])[/\-.](0?[1-9]|[12]\d|3[01])[/\-.](19|20)\d{2}\b/g, '[DATE]');
  
  // Replace potential names
  sanitizedText = sanitizedText.replace(/\b[A-Z][a-z]+(?:\s+[A-Z]\.?)?(?:\s+[A-Z][a-z]+)+\b/g, '[NAME]');
  
  // Replace potential phone numbers
  sanitizedText = sanitizedText.replace(/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g, '[PHONE]');
  
  return sanitizedText;
}

// Step 2: Extract medical keywords
// This is a simplified version of the actual keyword extraction
function extractMedicalKeywords(text) {
  // In reality, this uses a more sophisticated algorithm
  // but this gives you an idea of what it does
  const keywords = [];
  const medicalTerms = [
    'diarrhea', 'chronic', 'abdominal', 'pain', 'discomfort', 
    'ferritin', 'transaminases', 'cirrhosis', 'ultrasound',
    'gallbladder', 'liver', 'skin', 'darkening'
  ];
  
  medicalTerms.forEach(term => {
    if (text.toLowerCase().includes(term.toLowerCase())) {
      keywords.push(term);
    }
  });
  
  return keywords;
}

// Step 3: Generate database context
// This is an example of what the database context might look like
function generateDatabaseContext(keywords) {
  return `
-- Relevant ICD-10 Codes --
K59.1 - Functional diarrhea
Clinical Notes: Chronic diarrhea lasting more than 4 weeks without identifiable cause.
Recommended Imaging: Abdominal ultrasound, CT abdomen if needed

R10.13 - Right upper quadrant abdominal pain
Clinical Notes: Pain in the right upper quadrant of the abdomen, may indicate liver or gallbladder disease.
Recommended Imaging: Abdominal ultrasound, CT abdomen with contrast

K74.60 - Unspecified cirrhosis of liver
Clinical Notes: Chronic liver disease characterized by replacement of liver tissue by fibrosis, scar tissue, and regenerative nodules.
Recommended Imaging: Abdominal ultrasound, CT abdomen with contrast, MRI liver

E83.110 - Hemochromatosis, unspecified
Clinical Notes: Disorder of iron metabolism characterized by excessive absorption of iron, leading to deposition in various organs.
Recommended Imaging: Abdominal ultrasound, MRI liver

-- Relevant CPT Codes --
76700 - Ultrasound, abdominal, complete
Modality: Ultrasound
Body Part: Abdomen

74177 - CT abdomen and pelvis with contrast
Modality: CT
Body Part: Abdomen and pelvis

-- Relevant ICD-10 to CPT Mappings --
ICD-10: K59.1 (Functional diarrhea) -> CPT: 76700 (Ultrasound, abdominal, complete)
Appropriateness Score: 8/9
Justification: Abdominal ultrasound is appropriate for initial evaluation of chronic diarrhea to rule out structural abnormalities.

ICD-10: R10.13 (Right upper quadrant abdominal pain) -> CPT: 76700 (Ultrasound, abdominal, complete)
Appropriateness Score: 9/9
Justification: Abdominal ultrasound is the first-line imaging study for RUQ pain to evaluate liver, gallbladder, and biliary tract.

ICD-10: K74.60 (Unspecified cirrhosis of liver) -> CPT: 76700 (Ultrasound, abdominal, complete)
Appropriateness Score: 9/9
Justification: Abdominal ultrasound is appropriate for initial evaluation and monitoring of cirrhosis.

ICD-10: E83.110 (Hemochromatosis, unspecified) -> CPT: 76700 (Ultrasound, abdominal, complete)
Appropriateness Score: 8/9
Justification: Abdominal ultrasound is appropriate for evaluation of organ involvement in hemochromatosis.
`;
}

// Step 4: Construct the prompt
// This is a simplified version of the actual prompt template
function constructPrompt(templateContent, sanitizedText, databaseContext) {
  // The actual prompt template from PROMPT18.md
  const template = `
You are RadValidator, an AI clinical decision support system for radiology order validation.

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
- Instead, code the condition(s) to the highest degree of certainty for that encounter/visit, such as symptoms, signs, abnormal test results, or other reasons for the visit.


Please analyze this radiology order dictation:

"{{DICTATION_TEXT}}"

Respond in JSON format with these fields:
- suggestedICD10Codes: Array of {code, description, isPrimary} objects (one code must have isPrimary: true)
- suggestedCPTCodes: Array of {code, description} objects
- validationStatus: "appropriate", "needs_clarification", or "inappropriate"
- complianceScore: Number 1-9
- priority: "routine" or "stat"
- feedback: Brief educational note (33 words target length)
`;

  // Replace placeholders
  let prompt = template;
  prompt = prompt.replace('{{DATABASE_CONTEXT}}', databaseContext);
  prompt = prompt.replace('{{DICTATION_TEXT}}', sanitizedText);
  
  return prompt;
}

// Now let's show what's actually sent to the LLM
const sanitizedText = stripPHI(dictationText);
const keywords = extractMedicalKeywords(sanitizedText);
const databaseContext = generateDatabaseContext(keywords);
const prompt = constructPrompt("template", sanitizedText, databaseContext);

console.log("ORIGINAL DICTATION TEXT:");
console.log(dictationText);
console.log("\n");

console.log("SANITIZED TEXT (after PHI stripping):");
console.log(sanitizedText);
console.log("\n");

console.log("EXTRACTED KEYWORDS:");
console.log(keywords.join(", "));
console.log("\n");

console.log("DATABASE CONTEXT (from Redis/PostgreSQL):");
console.log(databaseContext);
console.log("\n");

console.log("ACTUAL PROMPT SENT TO LLM:");
console.log(prompt);