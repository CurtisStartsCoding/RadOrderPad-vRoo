"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processLLMResponse = processLLMResponse;
const models_1 = require("../../models");
const normalizer_1 = require("./normalizer");
const validator_1 = require("./validator");
const extractor_1 = require("./extractor");
/**
 * Process the LLM response for validation
 */
function processLLMResponse(responseContent) {
    try {
        // Log that we're processing a response without showing its content
        // eslint-disable-next-line no-console
        console.log("Processing LLM response (content redacted for privacy)");
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
        // Parse the JSON content
        let parsedResponse;
        try {
            parsedResponse = JSON.parse(jsonContent);
        }
        catch (error) {
            // eslint-disable-next-line no-console
            console.error("Failed to parse JSON from LLM response:", error);
            throw new Error(`Failed to parse JSON from LLM response: ${error instanceof Error ? error.message : String(error)}`);
        }
        // Normalize field names (handle potential casing issues)
        const normalizedResponse = (0, normalizer_1.normalizeResponseFields)(parsedResponse);
        // Validate required fields
        (0, validator_1.validateRequiredFields)(normalizedResponse);
        // Ensure validationStatus is a valid enum value
        (0, validator_1.validateValidationStatus)(normalizedResponse.validationStatus);
        // Normalize ICD-10 and CPT code arrays
        const normalizedICD10Codes = (0, normalizer_1.normalizeCodeArray)(normalizedResponse.suggestedICD10Codes);
        const normalizedCPTCodes = (0, normalizer_1.normalizeCodeArray)(normalizedResponse.suggestedCPTCodes);
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
        // Log error without including the full raw response
        // eslint-disable-next-line no-console
        console.error('Error processing LLM response:', error);
        // Instead of logging the full raw response, log only that an error occurred
        // eslint-disable-next-line no-console
        console.error('Error occurred while processing LLM response - see error details above');
        // Try to extract any useful information from the response
        const extractedInfo = (0, extractor_1.extractPartialInformation)(responseContent);
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
//# sourceMappingURL=processor.js.map