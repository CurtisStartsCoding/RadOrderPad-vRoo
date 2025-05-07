# RadOrderPad Validation Engine

This document describes the implementation of the RadOrderPad Validation Engine, which is responsible for validating radiology orders based on clinical indications.

## Overview

The Validation Engine processes physician dictation text to determine the appropriateness of requested imaging studies. It leverages Large Language Models (LLMs) and medical reference data to provide evidence-based validation.

## Components

### 1. Text Processing (`src/utils/text-processing.ts`)

- **PHI Stripping**: Removes Personal Health Information from the input text
- **Keyword Extraction**: Identifies medical terms, anatomical references, modalities, and symptoms

### 2. LLM Client (`src/utils/llm-client.ts`)

- **Fallback Logic**: Implements sequential fallback between different LLM providers:
  1. Anthropic Claude (primary)
  2. Grok (fallback #1)
  3. OpenAI GPT (fallback #2)
- **Response Standardization**: Ensures consistent response format regardless of the LLM provider

### 3. Validation Service (`src/services/validation.service.ts`)

The core service that orchestrates the validation process:

#### Main Flow

1. **PHI Stripping**: Sanitize input text to remove identifiable information
2. **Keyword Extraction**: Extract medical keywords for context generation
3. **Prompt Template Retrieval**: Get the active default prompt template from the database
4. **Database Context Generation**: Query medical reference tables based on extracted keywords
5. **Prompt Construction**: Combine template, sanitized text, and database context
6. **LLM Call**: Send the prompt to LLMs with fallback logic
7. **Response Processing**: Parse and validate the LLM response
8. **Result Return**: Return the structured validation result

#### Database Context Generation

The engine queries the following tables to generate context:

- `medical_icd10_codes`: Diagnosis codes and descriptions
- `medical_cpt_codes`: Procedure codes and descriptions
- `medical_cpt_icd10_mappings`: Appropriateness mappings between diagnoses and procedures
- `medical_icd10_markdown_docs`: Detailed clinical information for diagnoses

#### Prompt Construction

The prompt is constructed using:
- The template content from the `prompt_templates` table
- The sanitized dictation text
- The generated database context
- The word limit for feedback
- Override flag (if applicable)

#### Response Processing

The LLM response is expected to be a JSON object with the following fields:
- `validationStatus`: "appropriate", "needs_clarification", or "inappropriate"
- `complianceScore`: Numeric score (1-9)
- `feedback`: Educational note for the physician
- `suggestedICD10Codes`: Array of ICD-10 code objects
- `suggestedCPTCodes`: Array of CPT code objects
- `internalReasoning`: Explanation of the reasoning process

## Error Handling

The engine includes robust error handling:
- LLM fallback logic if the primary provider fails
- Default response if all LLM providers fail
- JSON parsing error handling
- Database query error handling

## Configuration

The engine uses the following environment variables:
- `ANTHROPIC_API_KEY`: API key for Anthropic Claude
- `GROK_API_KEY`: API key for Grok
- `OPENAI_API_KEY`: API key for OpenAI GPT

## Future Improvements

1. **Enhanced PHI Stripping**: Implement more sophisticated PHI detection and removal
2. **Improved Keyword Extraction**: Use NLP techniques for better keyword extraction
3. **Context Optimization**: Refine database queries to provide more relevant context
4. **LLM Logging**: Implement comprehensive logging to `llm_validation_logs` table
5. **Caching**: Add caching for database context and LLM responses
6. **Performance Optimization**: Optimize database queries and LLM calls
7. **Metrics Collection**: Track validation accuracy and performance metrics

## Testing

To test the validation engine:

1. Ensure the database is populated with medical reference data
2. Ensure at least one active default prompt template exists in the `prompt_templates` table
3. Set the required environment variables for LLM API keys
4. Use the `/api/orders/validate` endpoint with sample dictation text