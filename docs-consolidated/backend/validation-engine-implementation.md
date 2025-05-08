# Validation Engine Implementation Guide

## Overview

This document provides a comprehensive guide to the implementation of the RadOrderPad Validation Engine, which is responsible for validating radiology orders based on clinical indications. It covers the implementation details, configuration, and best practices for developers working on the validation engine.

## Implementation Timeline

| Date | Activity | Description |
|------|----------|-------------|
| April 13, 2025 | Database Connection Fix | Fixed database connection URLs and port configuration |
| April 13, 2025 | Prompt Template Update | Updated prompt template query to filter for `type = 'default'` |
| April 13, 2025 | Null Value Handling | Enhanced prompt construction to handle null values |
| April 13, 2025 | API Key Configuration | Added Anthropic and X.ai API keys to the environment |
| April 13, 2025 | LLM Integration Testing | Tested the Validation Engine with real clinical scenarios |

## Implementation Details

### 1. Database Connection Fix

The database connection was failing due to incorrect connection URLs and port configuration. The following changes were made:

```diff
- MAIN_DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/radorder_main
- PHI_DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/radorder_phi
+ MAIN_DATABASE_URL=postgres://postgres:postgres123@localhost:5433/radorder_main
+ PHI_DATABASE_URL=postgres://postgres:postgres123@localhost:5433/radorder_phi
```

### 2. Prompt Template Update

The `getActivePromptTemplate` function was updated to specifically look for templates with `type = 'default'`:

```typescript
export async function getActivePromptTemplate(): Promise<PromptTemplate> {
  console.log("Looking for active default prompt template");
  
  const result = await queryMainDb(
    `SELECT * FROM prompt_templates
     WHERE type = 'default' AND active = true
     ORDER BY created_at DESC
     LIMIT 1`
  );
  
  console.log("Prompt template query result:", result.rows);
  
  if (result.rows.length === 0) {
    throw new Error('No active default prompt template found');
  }
  
  return result.rows[0] as PromptTemplate;
}
```

The existing prompt template in the database was updated to have `type = 'default'`:

```sql
UPDATE prompt_templates SET type = 'default' WHERE id = 1
```

### 3. Null Value Handling

The `constructPrompt` function was enhanced to safely handle null values:

```typescript
export function constructPrompt(
  templateContent: string,
  sanitizedText: string,
  databaseContext: string,
  wordLimit: number | null | undefined,
  isOverrideValidation: boolean
): string {
  let prompt = templateContent;

  // Replace placeholders safely
  prompt = prompt.replace('{{DATABASE_CONTEXT}}', databaseContext || '');
  prompt = prompt.replace('{{DICTATION_TEXT}}', sanitizedText || '');
  prompt = prompt.replace('{{WORD_LIMIT}}', wordLimit != null ? wordLimit.toString() : '500'); // default to 500 if missing

  if (isOverrideValidation) {
    prompt += `

IMPORTANT: This is an OVERRIDE validation request. The physician has provided justification for why they believe this study is appropriate despite potential guidelines to the contrary. Please consider this justification carefully in your assessment.`;
  }

  return prompt;
}
```

### 4. API Key Configuration

The `.env` file was updated with real API keys for Anthropic and X.ai (Grok), and the model names were updated to use the latest versions:

```
# LLM API Keys
ANTHROPIC_API_KEY=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
GROK_API_KEY=xai-KIZ8vxeKtcEMztJjaeUk8UvElR7sjIBsA2LrO5Azm6YVGZawRux2ziyjXmahh5FMthstaPi4o7nSl3BY
OPENAI_API_KEY=your_openai_api_key_here

# LLM Model Names
CLAUDE_MODEL_NAME=claude-3-7-sonnet-20250219
GROK_MODEL_NAME=grok-3 
GPT_MODEL_NAME=gpt-4-turbo
```

## Key Components Implementation

### 1. Text Processing (`src/utils/text-processing.ts`)

The text processing component is responsible for removing PHI from the dictation text and extracting medical keywords:

```typescript
// PHI Stripping
export function stripPHI(text: string): string {
  // Basic PHI removal - replace names, dates, addresses, etc.
  let sanitized = text;
  
  // Replace names (Mr., Mrs., Dr. followed by names)
  sanitized = sanitized.replace(/\b(Mr\.|Mrs\.|Dr\.|Ms\.|Miss)\s+[A-Z][a-z]+\b/g, '[NAME]');
  
  // Replace dates (various formats)
  sanitized = sanitized.replace(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g, '[DATE]');
  sanitized = sanitized.replace(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{2,4}\b/g, '[DATE]');
  
  // Replace phone numbers
  sanitized = sanitized.replace(/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g, '[PHONE]');
  
  // Replace emails
  sanitized = sanitized.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]');
  
  // Replace SSNs
  sanitized = sanitized.replace(/\b\d{3}[-]?\d{2}[-]?\d{4}\b/g, '[SSN]');
  
  // Replace addresses
  sanitized = sanitized.replace(/\b\d+\s+[A-Za-z\s]+\b(Avenue|Ave|Street|St|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Court|Ct|Way|Place|Pl)\b/gi, '[ADDRESS]');
  
  // Replace medical record numbers
  sanitized = sanitized.replace(/\b(MRN|Medical Record Number|Record Number|Chart Number)[:.\s]?\s*\d+\b/gi, '[MRN]');
  
  console.log("PHI stripped from text");
  return sanitized;
}

// Keyword Extraction
export function extractMedicalKeywords(text: string): string[] {
  // Extract medical keywords from the text
  const keywords = new Set<string>();
  
  // Extract anatomy terms
  const anatomyTerms = [
    'brain', 'head', 'neck', 'spine', 'cervical', 'thoracic', 'lumbar', 'sacral',
    'shoulder', 'arm', 'elbow', 'wrist', 'hand', 'chest', 'abdomen', 'pelvis',
    'hip', 'leg', 'knee', 'ankle', 'foot', 'heart', 'lung', 'liver', 'kidney',
    'bowel', 'colon', 'stomach', 'pancreas', 'spleen', 'bladder', 'uterus', 'ovary',
    'prostate', 'testicle', 'breast', 'thyroid', 'lymph node', 'bone', 'joint',
    'muscle', 'tendon', 'ligament', 'nerve', 'artery', 'vein', 'skull', 'rib',
    'vertebra', 'disc', 'meniscus', 'rotator cuff', 'labrum', 'cartilage'
  ];
  
  // Extract modalities
  const modalities = [
    'xray', 'x-ray', 'radiograph', 'ct', 'cat scan', 'computed tomography',
    'mri', 'magnetic resonance', 'ultrasound', 'sonogram', 'pet', 'nuclear',
    'angiogram', 'fluoroscopy', 'mammogram', 'dexa', 'bone density'
  ];
  
  // Extract symptoms
  const symptoms = [
    'pain', 'ache', 'swelling', 'inflammation', 'numbness', 'tingling', 'weakness',
    'dizziness', 'vertigo', 'headache', 'nausea', 'vomiting', 'fever', 'cough',
    'shortness of breath', 'sob', 'dyspnea', 'bleeding', 'discharge', 'mass',
    'lump', 'lesion', 'nodule', 'tumor', 'fracture', 'break', 'tear', 'rupture',
    'strain', 'sprain', 'dislocation', 'infection', 'rash', 'bruise', 'burn',
    'wound', 'injury', 'trauma', 'acute', 'chronic', 'intermittent', 'constant',
    'progressive', 'radiating', 'referred', 'sharp', 'dull', 'throbbing', 'burning'
  ];
  
  // Check for each term in the text
  [...anatomyTerms, ...modalities, ...symptoms].forEach(term => {
    if (text.toLowerCase().includes(term.toLowerCase())) {
      keywords.add(term.toLowerCase());
    }
  });
  
  // Extract medical codes if present
  const icd10Pattern = /[A-Z]\d{2}(\.\d+)?/g;
  const cptPattern = /\b\d{5}\b/g;
  
  const icd10Matches = text.match(icd10Pattern) || [];
  const cptMatches = text.match(cptPattern) || [];
  
  icd10Matches.forEach(match => keywords.add(match));
  cptMatches.forEach(match => keywords.add(match));
  
  console.log("Extracted keywords:", Array.from(keywords));
  return Array.from(keywords);
}
```

### 2. LLM Client (`src/utils/llm-client.ts`)

The LLM client component is responsible for calling the LLM APIs with fallback logic:

```typescript
export async function callLLMWithFallback(prompt: string): Promise<LLMResponse> {
  // Try Claude first
  try {
    console.log("Calling Anthropic Claude API...");
    const claudeResponse = await callClaude(prompt);
    return claudeResponse;
  } catch (claudeError) {
    console.error("Claude API error:", claudeError);
    console.log("Falling back to Grok API...");
    
    // Try Grok as fallback
    try {
      const grokResponse = await callGrok(prompt);
      return grokResponse;
    } catch (grokError) {
      console.error("Grok API error:", grokError);
      console.log("Falling back to GPT API...");
      
      // Try GPT as final fallback
      try {
        const gptResponse = await callGPT(prompt);
        return gptResponse;
      } catch (gptError) {
        console.error("GPT API error:", gptError);
        
        // All LLMs failed, return a default error response
        return {
          provider: "none",
          model: "none",
          content: JSON.stringify({
            validationStatus: "needs_clarification",
            complianceScore: 0,
            feedback: "Unable to validate due to service unavailability. Please try again later.",
            suggestedICD10Codes: [],
            suggestedCPTCodes: [],
            internalReasoning: "All LLM providers failed to respond."
          }),
          tokensUsed: 0,
          latencyMs: 0
        };
      }
    }
  }
}
```

### 3. Validation Service (`src/services/validation.service.ts`)

The validation service orchestrates the entire validation process:

```typescript
export async function runValidation(text: string, context: any = {}): Promise<ValidationResult> {
  console.log("Starting validation process...");
  
  // 1. Strip PHI from the text
  const sanitizedText = stripPHI(text);
  
  // 2. Extract medical keywords
  const keywords = extractMedicalKeywords(sanitizedText);
  
  // 3. Get the active prompt template
  const promptTemplate = await getActivePromptTemplate();
  console.log("Using prompt template:", promptTemplate.name);
  
  // 4. Generate database context based on keywords
  const databaseContext = await generateDatabaseContext(keywords);
  console.log("Generated database context");
  
  // 5. Construct the prompt
  const prompt = constructPrompt(
    promptTemplate.content,
    sanitizedText,
    databaseContext,
    promptTemplate.word_limit,
    context.isOverrideValidation || false
  );
  console.log("Constructed prompt");
  
  // 6. Call the LLM with fallback logic
  const llmResponse = await callLLMWithFallback(prompt);
  console.log(`LLM call successful using ${llmResponse.provider} (${llmResponse.model})`);
  console.log(`Tokens used: ${llmResponse.tokensUsed}, Latency: ${llmResponse.latencyMs}ms`);
  
  // 7. Process the LLM response
  const validationResult = processLLMResponse(llmResponse.content);
  console.log("Processed LLM response");
  
  // 8. Log the validation attempt
  await logValidationAttempt(
    text,
    validationResult,
    llmResponse,
    context.orderId,
    context.userId || 1
  );
  console.log("Logged validation attempt to PHI database");
  
  // 9. Return the validation result
  return validationResult;
}
```

## Configuration

The Validation Engine uses the following environment variables:

```
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MAIN_DATABASE_URL=postgres://postgres:postgres123@localhost:5433/radorder_main
PHI_DATABASE_URL=postgres://postgres:postgres123@localhost:5433/radorder_phi

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# LLM API Keys
ANTHROPIC_API_KEY=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
GROK_API_KEY=xai-KIZ8vxeKtcEMztJjaeUk8UvElR7sjIBsA2LrO5Azm6YVGZawRux2ziyjXmahh5FMthstaPi4o7nSl3BY
OPENAI_API_KEY=your_openai_api_key_here

# LLM Model Names
CLAUDE_MODEL_NAME=claude-3-7-sonnet-20250219
GROK_MODEL_NAME=grok-3 
GPT_MODEL_NAME=gpt-4-turbo

# LLM Settings
LLM_MAX_TOKENS=4000
LLM_TIMEOUT=30000
```

## Default Prompt Template

```
You are a medical validation assistant. Your task is to evaluate the appropriateness of a requested imaging study based on the clinical indications provided.

DATABASE CONTEXT:
{{DATABASE_CONTEXT}}

DICTATION TEXT:
{{DICTATION_TEXT}}

INSTRUCTIONS:
1. Analyze the dictation text and determine if the requested imaging study is appropriate based on clinical guidelines.
2. Consider the patient's symptoms, history, and any relevant medical context.
3. Provide a compliance score from 1-9 (1 = completely inappropriate, 9 = completely appropriate).
4. Suggest relevant ICD-10 diagnosis codes and CPT procedure codes.
5. Limit your feedback to {{WORD_LIMIT}} words.

RESPONSE FORMAT:
Provide your response in JSON format with the following fields:
- validationStatus: "appropriate", "inappropriate", or "needs_clarification"
- complianceScore: numeric score from 1-9
- feedback: educational note for the physician
- suggestedICD10Codes: array of objects with code and description
- suggestedCPTCodes: array of objects with code and description
- internalReasoning: explanation of your reasoning process

Example response format:
```json
{
  "validationStatus": "appropriate",
  "complianceScore": 8,
  "feedback": "The requested MRI is appropriate for the clinical indication of...",
  "suggestedICD10Codes": [
    {"code": "M54.5", "description": "Low back pain"},
    {"code": "M51.26", "description": "Intervertebral disc disorders with radiculopathy, lumbar region"}
  ],
  "suggestedCPTCodes": [
    {"code": "72148", "description": "MRI lumbar spine without contrast"}
  ],
  "internalReasoning": "Based on ACR guidelines, MRI is the preferred imaging modality for..."
}
```

Respond ONLY with the JSON object, no additional text.
```

## Challenges and Solutions

| Challenge | Solution |
|-----------|----------|
| Database connection issues | Updated connection URLs and port configuration |
| Null value handling | Enhanced prompt construction with null checks and default values |
| Prompt template filtering | Updated query to filter for `type = 'default'` |
| API key management | Added API keys to the `.env` file |
| Database context generation | Implemented keyword categorization for more targeted queries |

## Testing

To test the validation engine:

1. Ensure the database is populated with medical reference data
2. Ensure at least one active default prompt template exists in the `prompt_templates` table
3. Set the required environment variables for LLM API keys
4. Use the `/api/orders/validate` endpoint with sample dictation text

### Testing Commands

```powershell
# Test the health endpoint
curl -v https://api.radorderpad.com/health

# Test the validation endpoint with a persistent headache scenario
Invoke-WebRequest -Uri "https://api.radorderpad.com/api/orders/validate" -Method POST -Headers @{"Authorization"="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm9yZ0lkIjoxLCJyb2xlIjoicGh5c2ljaWFuIiwiZW1haWwiOiJ0ZXN0LnBoeXNpY2lhbkBleGFtcGxlLmNvbSIsImlhdCI6MTc0NDU1NzQ4MCwiZXhwIjoxNzQ0NjQzODgwfQ.LNPodxOGryfJj3xt7YBkHY4qvjQMx67XT8JyJm2Hg40"; "Content-Type"="application/json"} -Body '{"dictationText":"Patient with persistent headache for 3 weeks, worsening with movement. History of migraines. Request MRI brain to rule out structural abnormalities.", "patientInfo": {"id": 1}, "radiologyOrganizationId": 1}' | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

## Conclusion

The Validation Engine has been successfully implemented and tested with real LLM integration. The system is now fully functional and producing accurate medical validations using the Anthropic Claude API. The implementation follows best practices for software development, including modular architecture, error handling, and logging.