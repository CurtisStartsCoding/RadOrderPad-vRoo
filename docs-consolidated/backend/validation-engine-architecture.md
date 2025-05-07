# Validation Engine Architecture

## Overview

The Validation Engine is a core component of the RadOrderPad application that validates radiology orders based on clinical indications. It uses Large Language Models (LLMs) to analyze dictation text, compare it against medical guidelines, and provide feedback on the appropriateness of the requested imaging study.

## Architecture

The Validation Engine follows a modular architecture with the following components:

1. **Text Processing**: Handles PHI removal and medical keyword extraction
2. **Database Context Generation**: Retrieves relevant medical information from the database
3. **Prompt Construction**: Creates prompts for the LLM based on templates
4. **LLM Orchestration**: Manages LLM API calls with fallback logic
5. **Response Processing**: Parses and validates LLM responses
6. **Validation Service**: Orchestrates the entire validation process

### Component Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Text Processing │────▶│ Database Context│────▶│     Prompt      │
└─────────────────┘     │   Generation    │     │  Construction   │
                        └─────────────────┘     └────────┬────────┘
                                                         │
                                                         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Response     │◀────│      LLM        │◀────│       LLM       │
│   Processing    │     │  Orchestration  │     │       API       │
└────────┬────────┘     └─────────────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐
│   Validation    │
│     Result      │
└─────────────────┘
```

## Components

### 1. Text Processing (`src/utils/text-processing.ts`)

Responsible for:
- Removing Protected Health Information (PHI) from dictation text
- Extracting medical keywords for context generation

Key functions:
- `stripPHI(text: string): string`
- `extractMedicalKeywords(text: string): string[]`

### 2. Database Context Generation (`src/utils/database-context.ts`)

Responsible for:
- Retrieving active prompt templates from the database
- Generating relevant medical context based on keywords

Key functions:
- `getActivePromptTemplate(): Promise<PromptTemplate>`
- `generateDatabaseContext(keywords: string[]): Promise<string>`
- `categorizeKeywords(keywords: string[]): { anatomyTerms: string[]; modalities: string[]; symptoms: string[]; codes: string[] }`
- `formatDatabaseContext(icd10Rows: any[], cptRows: any[], mappingRows: any[], markdownRows: any[]): string`

The engine queries the following tables to generate context:
- `medical_icd10_codes`: Diagnosis codes and descriptions
- `medical_cpt_codes`: Procedure codes and descriptions
- `medical_cpt_icd10_mappings`: Appropriateness mappings between diagnoses and procedures
- `medical_icd10_markdown_docs`: Detailed clinical information for diagnoses

### 3. Prompt Construction (`src/utils/prompt-construction.ts`)

Responsible for:
- Creating prompts for the LLM based on templates
- Replacing placeholders with actual content

Key functions:
- `constructPrompt(templateContent: string, sanitizedText: string, databaseContext: string, wordLimit: number | null | undefined, isOverrideValidation: boolean): string`

The prompt is constructed using:
- The template content from the `prompt_templates` table
- The sanitized dictation text
- The generated database context
- The word limit for feedback
- Override flag (if applicable)

### 4. LLM Orchestration (`src/utils/llm-client.ts`)

Responsible for:
- Managing LLM API calls with fallback logic
- Handling API errors and timeouts

Key functions:
- `callLLMWithFallback(prompt: string): Promise<LLMResponse>`
- `callClaude(prompt: string): Promise<LLMResponse>`
- `callGrok(prompt: string): Promise<LLMResponse>`
- `callGPT(prompt: string): Promise<LLMResponse>`

Implements sequential fallback between different LLM providers:
1. Anthropic Claude (primary)
2. Grok (fallback #1)
3. OpenAI GPT (fallback #2)

### 5. Response Processing (`src/utils/response-processing.ts`)

Responsible for:
- Parsing LLM responses
- Validating required fields
- Normalizing response format

Key functions:
- `processLLMResponse(responseContent: string): ValidationResult`
- `normalizeResponseFields(response: any): any`
- `validateRequiredFields(response: any): void`
- `validateValidationStatus(status: string): void`
- `normalizeCodeArray(codes: any): Array<{ code: string; description: string }>`
- `extractPartialInformation(responseContent: string): { complianceScore?: number; feedback?: string; icd10Codes?: Array<{ code: string; description: string }>; cptCodes?: Array<{ code: string; description: string }>; }`

The LLM response is expected to be a JSON object with the following fields:
- `validationStatus`: "appropriate", "needs_clarification", or "inappropriate"
- `complianceScore`: Numeric score (1-9)
- `feedback`: Educational note for the physician
- `suggestedICD10Codes`: Array of ICD-10 code objects
- `suggestedCPTCodes`: Array of CPT code objects
- `internalReasoning`: Explanation of the reasoning process

### 6. Validation Service (`src/services/validation.service.ts`)

Responsible for:
- Orchestrating the entire validation process
- Logging validation attempts to the PHI database

Key functions:
- `runValidation(text: string, context: any = {}): Promise<ValidationResult>`
- `logValidationAttempt(originalText: string, validationResult: ValidationResult, llmResponse: LLMResponse, orderId?: number, userId: number = 1): Promise<void>`

## Data Flow

1. The validation process begins when a user submits a dictation text for validation.
2. The `ValidationService.runValidation` function orchestrates the entire process.
3. The dictation text is processed to remove PHI and extract medical keywords.
4. The active default prompt template is retrieved from the database.
5. Relevant medical context is generated based on the extracted keywords.
6. A prompt is constructed using the template, sanitized text, and database context.
7. The prompt is sent to the LLM API with fallback logic (Claude -> Grok -> GPT).
8. The LLM response is processed and validated.
9. The validation attempt is logged to the PHI database.
10. The validation result is returned to the user.

## Main Flow

1. **PHI Stripping**: Sanitize input text to remove identifiable information
2. **Keyword Extraction**: Extract medical keywords for context generation
3. **Prompt Template Retrieval**: Get the active default prompt template from the database
4. **Database Context Generation**: Query medical reference tables based on extracted keywords
5. **Prompt Construction**: Combine template, sanitized text, and database context
6. **LLM Call**: Send the prompt to LLMs with fallback logic
7. **Response Processing**: Parse and validate the LLM response
8. **Result Return**: Return the structured validation result

## Configuration

The Validation Engine is configured through environment variables:

- `ANTHROPIC_API_KEY`: API key for Anthropic Claude
- `GROK_API_KEY`: API key for Grok
- `OPENAI_API_KEY`: API key for OpenAI GPT
- `CLAUDE_MODEL_NAME`: Model name for Claude (default: 'claude-3-7-sonnet-20250219')
- `GROK_MODEL_NAME`: Model name for Grok (default: 'grok-3')
- `GPT_MODEL_NAME`: Model name for GPT (default: 'gpt-4-turbo')
- `LLM_MAX_TOKENS`: Maximum tokens for LLM responses (default: 4000)
- `LLM_TIMEOUT`: Timeout for LLM API calls in milliseconds (default: 30000)

## Error Handling

The Validation Engine includes robust error handling:

- **LLM API Errors**: If an LLM API call fails, the system falls back to the next LLM provider.
- **Parsing Errors**: If the LLM response cannot be parsed as JSON, the system attempts to extract partial information.
- **Database Errors**: Database errors are caught and logged, with appropriate error messages returned to the user.
- **Missing Fields**: If required fields are missing in the LLM response, the system returns a default error response.

## Logging

The Validation Engine logs key events for debugging and monitoring:

- **Validation Attempts**: All validation attempts are logged to the PHI database.
- **LLM Usage**: LLM usage details (provider, model, tokens, latency) are logged to the database.
- **Console Logs**: Key events are logged to the console for debugging.

## Future Improvements

1. **Enhanced PHI Stripping**: Implement more sophisticated PHI detection and removal using NLP techniques.
2. **Improved Keyword Extraction**: Use more advanced NLP techniques for better keyword extraction.
3. **Context Optimization**: Refine database queries to provide more relevant context.
4. **Caching**: Implement caching for database context and LLM responses.
5. **Performance Optimization**: Optimize database queries and LLM calls.
6. **Monitoring**: Add detailed logging and monitoring for production use.
7. **Error Handling**: Enhance error handling for edge cases and API failures.
8. **Testing**: Create comprehensive unit and integration tests to ensure reliability.
9. **User Feedback**: Implement a feedback mechanism for physicians to provide input on validation results.