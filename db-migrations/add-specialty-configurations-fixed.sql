-- Migration: Add specialty_configurations table and update prompt_templates
-- Date: 2025-04-15

-- Connect to the radorder_main database
\c radorder_main;

-- Create the specialty_configurations table (if it doesn't exist already)
CREATE TABLE IF NOT EXISTS specialty_configurations (
    specialty_name TEXT PRIMARY KEY, -- Matches users.specialty
    optimal_word_count INTEGER NOT NULL DEFAULT 33,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

COMMENT ON TABLE specialty_configurations IS 'Stores configuration specific to medical specialties, like optimal feedback word counts.';
COMMENT ON COLUMN specialty_configurations.specialty_name IS 'Name of the medical specialty, matching users.specialty.';
COMMENT ON COLUMN specialty_configurations.optimal_word_count IS 'Target word count for LLM feedback for this specialty.';

-- Clear existing data if table already exists
DELETE FROM specialty_configurations;

-- Populate the specialty_configurations table with data from specialty_word_count_list.md
INSERT INTO specialty_configurations (specialty_name, optimal_word_count) VALUES
('Family Medicine', 29),
('Dermatology', 30),
('Orthopedics', 30),
('General Radiology', 30),
('Ultrasound', 30),
('Computed Tomography (CT)', 30),
('Magnetic Resonance Imaging (MRI)', 30),
('Fluoroscopy', 30),
('Oncology', 31),
('Hematology', 31),
('Endocrinology', 31),
('Vascular', 31),
('Urogenital', 31),
('Allergy & Immunology', 31),
('Internal Medicine', 31),
('Neurology', 32),
('Women''s Health', 32),
('Gastroenterology', 32),
('Pulmonary', 32),
('Rheumatology', 32),
('Body Imaging', 32),
('Oncologic Imaging', 32),
('Genitourinary Radiology', 32),
('Cardiology', 33),
('Trauma', 33),
('Infectious Disease', 33),
('Geriatrics', 33),
('Musculoskeletal Radiology', 33),
('Breast Imaging', 33),
('Abdominal Imaging', 33),
('Chest Imaging', 33),
('Gastrointestinal Radiology', 33),
('Head and Neck Imaging', 33),
('Cardiac Imaging', 33),
('Obstetric/Gynecologic Imaging', 33),
('Molecular Imaging', 33),
('PET/CT Imaging', 33),
('Pediatrics', 34),
('Emergency Medicine', 34),
('Cardiothoracic Imaging', 34),
('Nuclear Medicine', 34),
('Cardiovascular Imaging', 34),
('Interventional Radiology', 35),
('Neuroradiology', 35),
('Pediatric Radiology', 35),
('Emergency Radiology', 35),
('Trauma Imaging', 35),
('Functional Imaging', 35),
('Musculoskeletal Interventional', 36),
('Neurologic Interventional', 37),
('Thoracic Interventional', 37),
('Abdominal Interventional', 37),
('Pediatric Interventional Radiology', 38);

-- Update existing prompt templates to set active = false
UPDATE prompt_templates 
SET active = false, 
    name = CASE 
        WHEN name NOT LIKE '%(Inactive)%' THEN name || ' (Inactive)' 
        ELSE name 
    END
WHERE type = 'default' AND active = true;

-- Insert the new lean prompt template
INSERT INTO prompt_templates (
    name, 
    type, 
    version, 
    content_template, 
    active
) VALUES (
    'Default Validation V1.1 (Lean w/ Specialty Context)',
    'default',
    '1.1',
    '# PROMPT METADATA - For reference, not sent to LLM
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
  "diagnosisCodes": [
    {"code": "string", "description": "string", "isPrimary": boolean}
  ],
  "procedureCodes": [
    {"code": "string", "description": "string"}
  ],
  "validationStatus": "string (valid|needs_clarification|inappropriate)",
  "complianceScore": number (1-9),
  "feedback": "string (null if validationStatus is ''valid'', otherwise brief educational note - aim for ~{{TARGET_WORD_COUNT}} words for the {{SPECIALTY}} specialty)"
}
```

CRITICAL JSON REQUIREMENTS:
- The entire response MUST be a single, valid JSON object.
- The `diagnosisCodes` array MUST contain at least one ICD-10 code object.
- Each object in `diagnosisCodes` MUST include the `isPrimary` boolean property.
- EXACTLY ONE object in `diagnosisCodes` MUST have `isPrimary` set to `true`.
- The `feedback` field MUST be null if `validationStatus` is ''valid''.
- Do not add any fields not listed in the specified JSON structure.',
    true
);