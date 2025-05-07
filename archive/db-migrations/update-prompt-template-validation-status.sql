-- Migration: Update prompt template to use 'appropriate' instead of 'valid' for validation status
-- Date: 2025-04-15

-- Connect to the radorder_main database
\c radorder_main;

-- Update the prompt template to use 'appropriate' instead of 'valid' for validation status
UPDATE prompt_templates 
SET content_template = '# PROMPT METADATA - For reference, not sent to LLM
Name: Default Validation V1.1 (Lean w/ Specialty Context)
Version: 1.1
Type: default
Description: Lean validation prompt using database context. Includes basic specialty name and target word count context. Requires isPrimary flag.

# PROMPT CONTENT - This is the text to store in the content_template column

## SYSTEM PROMPT PART ##
You are RadValidator, an AI clinical decision support system for radiology order validation.

Your task is to analyze a physician''s dictation for a radiology order and produce the following outputs in a specific JSON format:
1. Extract relevant ICD-10 diagnosis codes, ensuring one is marked as primary.
2. Extract or suggest appropriate CPT procedure codes.
3. Validate if the imaging order is clinically appropriate based on provided context and guidelines.
4. Assign a compliance score (integer 1-9, 9=most appropriate).
5. Provide brief educational feedback ONLY if the order is inappropriate or needs clarification, aiming for the target word count.

The dictation is for a patient with the specialty context: {{SPECIALTY}}.

Database Context:
{{DATABASE_CONTEXT}}

IMPORTANT GUIDELINES:
- Base validation primarily on the provided Database Context (ACR Appropriateness Criteria excerpts, code details, mappings) and general medical knowledge.
- For inappropriate orders, suggest alternative approaches if possible within the feedback.
- For spine imaging, MRI without contrast is usually sufficient for disc evaluation unless context suggests otherwise.
- Acute low back pain (<6 weeks) without red flags should generally be managed conservatively first.
- Red flags include: significant trauma, cancer history, progressive neurological deficits, signs of infection (fever, IVDU).
- Only recommend contrast when there is a specific indication (e.g., suspected infection, tumor, post-surgical evaluation based on context).
- Ensure ICD-10 codes reflect the clinical scenario accurately.

## USER PROMPT PART ##
Please analyze this radiology order dictation:

"{{DICTATION_TEXT}}"

Respond ONLY in valid JSON format with the following structure. Do NOT include any text outside the JSON object:
```json
{
  "suggestedICD10Codes": [
    {"code": "string", "description": "string", "isPrimary": boolean}
  ],
  "suggestedCPTCodes": [
    {"code": "string", "description": "string"}
  ],
  "validationStatus": "string (appropriate|needs_clarification|inappropriate)",
  "complianceScore": number (1-9),
  "feedback": "string (use ''{{SPECIALTY}}'' if validationStatus is ''appropriate'', otherwise brief educational note - aim for ~{{TARGET_WORD_COUNT}} words for the {{SPECIALTY}} specialty)"
}
```

CRITICAL JSON REQUIREMENTS:
- The entire response MUST be a single, valid JSON object.
- The `suggestedICD10Codes` array MUST contain at least one ICD-10 code object.
- Each object in `suggestedICD10Codes` MUST include the `isPrimary` boolean property.
- EXACTLY ONE object in `suggestedICD10Codes` MUST have `isPrimary` set to `true`.
- The `feedback` field MUST be "{{SPECIALTY}}" if `validationStatus` is ''appropriate''.
- Do not add any fields not listed in the specified JSON structure.'
WHERE name = 'Default Validation V1.1 (Lean w/ Specialty Context)' AND type = 'default';

-- Verify the update was successful
SELECT id, name, type, version, active FROM prompt_templates 
WHERE name = 'Default Validation V1.1 (Lean w/ Specialty Context)';