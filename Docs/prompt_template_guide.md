# Prompt Template Guide

**Version:** 1.0
**Date:** 2025-04-15

This document provides detailed guidance on creating and maintaining effective prompt templates for the RadOrderPad validation engine.

---

## 1. Purpose

- **Standardization:** Ensure all prompts follow a consistent structure and format
- **Quality Assurance:** Provide guidelines for creating effective prompts
- **Troubleshooting:** Help identify and fix common issues with prompts
- **Knowledge Transfer:** Enable new team members to understand prompt requirements

## 2. Prompt Template Structure

Every prompt template should follow this standardized structure:

```
# PROMPT METADATA
Name: [Prompt Name]
Version: [Version Number]
Type: [default/specialty/custom]
Description: [Brief description of what this prompt does]

# PROMPT CONTENT
You are an expert radiologist tasked with validating imaging orders. The following is a patient case that you need to evaluate:

PATIENT CASE:
{{PATIENT_CASE}}

Analyze this case according to these instructions and respond ONLY with a JSON object:

=== VALIDATION FRAMEWORK ===

[Framework sections with specific validation criteria]

# REQUIRED RESPONSE FORMAT
IMPORTANT: You MUST respond in the following JSON format and ONLY in this format. Do not include any explanatory text outside the JSON structure:

```json
{
  "validationStatus": "appropriate", 
  "complianceScore": 85,
  "feedback": "Brief explanation of the validation result",
  "suggestedICD10Codes": [
    {"code": "R10.31", "description": "Right lower quadrant pain", "isPrimary": true},
    {"code": "R10.83", "description": "Colic abdominal pain", "isPrimary": false},
    {"code": "N83.20", "description": "Unspecified ovarian cysts", "isPrimary": false}
  ],
  "suggestedCPTCodes": [
    {"code": "74177", "description": "CT abdomen and pelvis with contrast"}
  ],
  "internalReasoning": "Detailed explanation of reasoning process"
}
```

# CRITICAL REQUIREMENTS
- ALWAYS generate a MINIMUM of 3-4 ICD-10 codes for each case
- ALWAYS include the "isPrimary" property for each ICD-10 code
- EXACTLY ONE code should have isPrimary set to true
- NEVER include explanatory text outside the JSON structure
```

## 3. Template Placeholders

The following placeholders are supported in prompt templates:

| Placeholder | Description | Example |
|-------------|-------------|---------|
| `{{PATIENT_CASE}}` | The patient case text from the dictation | "Patient is a 45-year-old female with persistent right lower quadrant pain..." |
| `{{DATABASE_CONTEXT}}` | Context from the database (ICD-10 codes, CPT codes, etc.) | "ICD-10 Code R10.31: Right lower quadrant pain..." |
| `{{WORD_LIMIT}}` | Target word count for the feedback section | 30 |

## 4. Required JSON Response Format

Every prompt must instruct the LLM to respond with a JSON object containing these fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `validationStatus` | string | Yes | One of: "appropriate", "needs_clarification", "inappropriate" |
| `complianceScore` | number | Yes | 0-100 score indicating compliance with guidelines |
| `feedback` | string | Yes | Brief explanation of the validation result |
| `suggestedICD10Codes` | array | Yes | Array of ICD-10 code objects |
| `suggestedCPTCodes` | array | Yes | Array of CPT code objects |
| `internalReasoning` | string | Yes | Detailed explanation of reasoning process |

### ICD-10 Code Object Format

```json
{
  "code": "R10.31",
  "description": "Right lower quadrant pain",
  "isPrimary": true
}
```

**CRITICAL:** Each ICD-10 code object MUST include the `isPrimary` property, and exactly ONE code should have `isPrimary` set to `true`.

### CPT Code Object Format

```json
{
  "code": "74177",
  "description": "CT abdomen and pelvis with contrast"
}
```

## 5. Validation Framework Sections

The validation framework should include these key sections:

1. **Primary Validation Gates:** Critical criteria that must be met
2. **Required Clinical Information:** Specific clinical details needed
3. **Diagnosis Coding Requirements:** Guidelines for ICD-10 code selection
4. **Secondary Validation Criteria:** Additional considerations
5. **Insufficient Information Criteria:** Reasons for rejection
6. **Modality-Specific Validation:** Criteria specific to imaging modalities
7. **Specialty-Specific Validation:** Criteria specific to medical specialties

## 6. Best Practices

### 6.1. Clarity and Precision

- Use clear, unambiguous language
- Provide specific examples where helpful
- Define technical terms if they might be ambiguous
- Use numbered or bulleted lists for multi-step instructions

### 6.2. Prompt Engineering

- Start with a clear role definition ("You are an expert radiologist...")
- Provide context before asking for analysis
- Use explicit formatting instructions
- Include examples of desired output format
- Specify exactly what should and should not be included

### 6.3. Error Prevention

- Include explicit instructions about required fields
- Emphasize critical requirements (like the `isPrimary` flag)
- Provide clear examples of correct and incorrect responses
- Include fallback instructions for edge cases

## 7. Common Pitfalls and Solutions

| Pitfall | Solution |
|---------|----------|
| Missing `isPrimary` flag | Explicitly instruct the LLM to include this flag for each ICD-10 code |
| Too few ICD-10 codes | Specify a minimum number (3-4) of codes that must be included |
| Inconsistent validation status | Define clear criteria for each status (appropriate, needs_clarification, inappropriate) |
| Verbose non-JSON responses | Emphasize that ONLY JSON should be returned, with no explanatory text |
| Hallucinated codes | Instruct the LLM to use only codes supported by the documentation |

## 8. Testing and Validation

Before deploying a new prompt template:

1. Test with at least 5 diverse patient cases
2. Verify all required fields are present in the response
3. Check that exactly one ICD-10 code has `isPrimary: true`
4. Validate that the minimum number of ICD-10 codes are included
5. Review the feedback and internal reasoning for accuracy and helpfulness

## 9. Version Control

When updating a prompt template:

1. Increment the version number
2. Document the changes in a changelog
3. Consider running an A/B test before full deployment
4. Maintain a history of previous versions for reference

## 10. Example Template

See the [Comprehensive Imaging Order Validation](./prompt_examples/comprehensive_validation.md) template for a complete example.

---

## References

- [Prompt Registry](./prompt_registry.md) - System for managing and versioning prompts
- [Prompt Management UI](./prompt_management_ui.md) - Interface for managing prompts
- [Prompt Testing](./prompt_testing.md) - Guidelines for testing prompts