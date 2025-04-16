"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processLLMResponse = processLLMResponse;
const models_1 = require("../models");
/**
 * Utility functions for processing LLM responses
 */
/**
 * Process the LLM response for validation
 */
function processLLMResponse(responseContent) {
    try {
        console.log("Processing LLM response:", responseContent.substring(0, 100) + "...");
        // Extract JSON from the response
        // The response might be wrapped in markdown code blocks like ```json ... ```
        let jsonContent = responseContent;
        // Try to extract JSON from code blocks
        const jsonBlockMatch = responseContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonBlockMatch) {
            jsonContent = jsonBlockMatch[1].trim();
        }
        // If no code blocks, try to find JSON object directly
        if (!jsonBlockMatch) {
            const jsonObjectMatch = responseContent.match(/(\{[\s\S]*\})/);
            if (jsonObjectMatch) {
                jsonContent = jsonObjectMatch[1].trim();
            }
        }
        // If the response doesn't contain valid JSON, generate a default response
        let parsedResponse;
        try {
            parsedResponse = JSON.parse(jsonContent);
        }
        catch (parseError) {
            console.log("Failed to parse JSON, generating default response");
            // Generate a mock response for testing purposes
            return {
                validationStatus: models_1.ValidationStatus.NEEDS_CLARIFICATION,
                complianceScore: 5,
                feedback: "Unable to determine appropriateness from the provided information. " +
                    "The system is currently in test mode. In a production environment, " +
                    "this would provide detailed feedback based on clinical guidelines.",
                suggestedICD10Codes: [
                    { code: "R68.89", description: "Other general symptoms and signs" }
                ],
                suggestedCPTCodes: [
                    { code: "76000", description: "Fluoroscopy (separate procedure), up to 1 hour" }
                ],
                internalReasoning: "This is a default response generated because the LLM did not return valid JSON. Original response: " + responseContent.substring(0, 100) + "..."
            };
        }
        // Normalize field names (handle potential casing issues)
        const normalizedResponse = normalizeResponseFields(parsedResponse);
        // Validate required fields
        validateRequiredFields(normalizedResponse);
        // Ensure validationStatus is a valid enum value
        validateValidationStatus(normalizedResponse.validationStatus);
        // Normalize ICD-10 and CPT code arrays
        const normalizedICD10Codes = normalizeCodeArray(normalizedResponse.suggestedICD10Codes);
        const normalizedCPTCodes = normalizeCodeArray(normalizedResponse.suggestedCPTCodes);
        // Return the validation result
        return {
            validationStatus: normalizedResponse.validationStatus,
            complianceScore: normalizedResponse.complianceScore,
            feedback: normalizedResponse.feedback,
            suggestedICD10Codes: normalizedICD10Codes,
            suggestedCPTCodes: normalizedCPTCodes,
            internalReasoning: normalizedResponse.internalReasoning || 'No internal reasoning provided'
        };
    }
    catch (error) {
        console.error('Error processing LLM response:', error);
        console.error('Raw response:', responseContent);
        // Try to extract any useful information from the response
        const extractedInfo = extractPartialInformation(responseContent);
        // Return a default error result with any extracted information
        return {
            validationStatus: models_1.ValidationStatus.NEEDS_CLARIFICATION,
            complianceScore: extractedInfo.complianceScore || 0,
            feedback: extractedInfo.feedback || 'Unable to process the validation request. Please try again or contact support if the issue persists.',
            suggestedICD10Codes: extractedInfo.icd10Codes || [],
            suggestedCPTCodes: extractedInfo.cptCodes || [],
            internalReasoning: `Error processing LLM response: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
    }
}
/**
 * Normalize response field names to handle casing issues
 */
function normalizeResponseFields(response) {
    const normalized = {};
    // Map of possible field names to normalized field names
    const fieldMap = {
        // validationStatus variations
        'validationstatus': 'validationStatus',
        'validation_status': 'validationStatus',
        'status': 'validationStatus',
        // complianceScore variations
        'compliancescore': 'complianceScore',
        'compliance_score': 'complianceScore',
        'score': 'complianceScore',
        // feedback variations
        'feedback_text': 'feedback',
        'feedbacktext': 'feedback',
        'message': 'feedback',
        // suggestedICD10Codes variations
        'suggestedicd10codes': 'suggestedICD10Codes',
        'suggested_icd10_codes': 'suggestedICD10Codes',
        'icd10_codes': 'suggestedICD10Codes',
        'icd10codes': 'suggestedICD10Codes',
        'icd10': 'suggestedICD10Codes',
        'icd_10_codes': 'suggestedICD10Codes',
        // suggestedCPTCodes variations
        'suggestedcptcodes': 'suggestedCPTCodes',
        'suggested_cpt_codes': 'suggestedCPTCodes',
        'cpt_codes': 'suggestedCPTCodes',
        'cptcodes': 'suggestedCPTCodes',
        'cpt': 'suggestedCPTCodes',
        // internalReasoning variations
        'internalreasoning': 'internalReasoning',
        'internal_reasoning': 'internalReasoning',
        'reasoning': 'internalReasoning',
        'rationale': 'internalReasoning'
    };
    // Check for each possible field name
    for (const [key, value] of Object.entries(response)) {
        const normalizedKey = fieldMap[key.toLowerCase()] || key;
        normalized[normalizedKey] = value;
    }
    return normalized;
}
/**
 * Validate that all required fields are present
 */
function validateRequiredFields(response) {
    const requiredFields = [
        'validationStatus',
        'complianceScore',
        'feedback',
        'suggestedICD10Codes',
        'suggestedCPTCodes'
    ];
    const missingFields = requiredFields.filter(field => !response[field]);
    if (missingFields.length > 0) {
        throw new Error(`LLM response missing required fields: ${missingFields.join(', ')}`);
    }
}
/**
 * Validate that the validation status is a valid enum value
 */
function validateValidationStatus(status) {
    // Convert to lowercase for case-insensitive comparison
    const normalizedStatus = status.toLowerCase();
    // Map of possible status values to enum values
    const statusMap = {
        'appropriate': models_1.ValidationStatus.APPROPRIATE,
        'inappropriate': models_1.ValidationStatus.INAPPROPRIATE,
        'needs_clarification': models_1.ValidationStatus.NEEDS_CLARIFICATION,
        'needs clarification': models_1.ValidationStatus.NEEDS_CLARIFICATION,
        'override': models_1.ValidationStatus.OVERRIDE
    };
    // Check if the status is valid
    if (!statusMap[normalizedStatus]) {
        throw new Error(`Invalid validationStatus: ${status}`);
    }
}
/**
 * Normalize code arrays to ensure consistent format
 */
function normalizeCodeArray(codes) {
    if (!codes)
        return [];
    // If codes is already an array of objects with code and description
    if (Array.isArray(codes) && codes.length > 0 && typeof codes[0] === 'object') {
        return codes.map(item => ({
            code: item.code || '',
            description: item.description || ''
        }));
    }
    // If codes is an array of strings
    if (Array.isArray(codes) && codes.length > 0 && typeof codes[0] === 'string') {
        return codes.map(code => ({
            code,
            description: ''
        }));
    }
    // If codes is a string (comma-separated list)
    if (typeof codes === 'string') {
        return codes.split(',').map(code => ({
            code: code.trim(),
            description: ''
        }));
    }
    // Default to empty array
    return [];
}
/**
 * Extract partial information from a malformed response
 */
function extractPartialInformation(responseContent) {
    const result = {};
    // Try to extract compliance score
    const scoreMatch = responseContent.match(/(?:compliance|score)[\s:]+(\d+)/i);
    if (scoreMatch) {
        result.complianceScore = parseInt(scoreMatch[1], 10);
    }
    // Try to extract feedback
    const feedbackMatch = responseContent.match(/feedback[\s:]+([^\n]+)/i);
    if (feedbackMatch) {
        result.feedback = feedbackMatch[1].trim();
    }
    // Try to extract ICD-10 codes
    const icd10Matches = responseContent.match(/[A-Z]\d{2}(?:\.\d{1,2})?/g);
    if (icd10Matches) {
        result.icd10Codes = [...new Set(icd10Matches)].map(code => ({
            code,
            description: ''
        }));
    }
    // Try to extract CPT codes
    const cptMatches = responseContent.match(/\b\d{5}\b/g);
    if (cptMatches) {
        // Filter to likely CPT codes (starting with 7 for radiology)
        const likelyCptCodes = cptMatches.filter(code => code.startsWith('7'));
        if (likelyCptCodes.length > 0) {
            result.cptCodes = likelyCptCodes.map(code => ({
                code,
                description: ''
            }));
        }
    }
    return result;
}
//# sourceMappingURL=response-processing.js.map