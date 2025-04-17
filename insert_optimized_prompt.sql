-- Insert Optimized Prompt with STAT Detection
-- This script inserts the optimized prompt with STAT detection into the prompt_templates table

-- First, check if the prompt_templates table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'prompt_templates') THEN
        RAISE EXCEPTION 'prompt_templates table does not exist';
    END IF;
END $$;

-- First, deactivate all existing default prompts
UPDATE prompt_templates
SET active = FALSE, 
    updated_at = NOW()
WHERE type = 'default' 
  AND active = TRUE;

-- Insert the new optimized prompt with STAT detection
INSERT INTO prompt_templates (
    name,
    type,
    version,
    content_template,
    word_limit,
    active
) VALUES (
    'Optimized Validation with STAT Detection',
    'default',
    '1.0',
    $PROMPT$You are RadValidator, an AI clinical decision support system for radiology order validation.

Your task is to analyze a physician's dictation for a radiology order and produce the following outputs:
1. Extract relevant ICD-10 diagnosis codes
2. Extract or suggest appropriate CPT procedure codes 
3. Validate if the imaging order is clinically appropriate
4. Assign a compliance score from 1-9
5. Provide brief educational feedback if the order is inappropriate
6. Evaluate dictation for stat status

{{DATABASE_CONTEXT}}

IMPORTANT GUIDELINES:
- Validate based on ACR Appropriateness Criteria and evidence-based guidelines
- For inappropriate orders, suggest alternative approaches

Please analyze this radiology order dictation:

"{{DICTATION_TEXT}}"

Respond in JSON format with these fields:
- diagnosisCodes: Array of {code, isPrimary} objects (mark one as isPrimary: true)
- procedureCodes: Array of {code} objects
- validationStatus: "appropriate", "needs_clarification", or "inappropriate"
- complianceScore: Number 1-9
- priority: "routine" or "stat"
- feedback: Brief educational note (33 words target length)$PROMPT$,
    NULL,
    true
);

-- Verify the insertion
SELECT id, name, type, active, version, created_at 
FROM prompt_templates 
ORDER BY created_at DESC 
LIMIT 5;