import { ValidationStatus } from '../../models';
import { normalizeResponseFields, normalizeCodeArray } from './normalizer';
import { validateRequiredFields, validateValidationStatus } from './validator';
import { extractPartialInformation } from './extractor';
/**
 * Process the LLM response for validation
 */
export function processLLMResponse(responseContent) {
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
        // Parse the JSON content
        let parsedResponse;
        try {
            parsedResponse = JSON.parse(jsonContent);
        }
        catch (error) {
            console.error("Failed to parse JSON from LLM response:", error);
            throw new Error(`Failed to parse JSON from LLM response: ${error instanceof Error ? error.message : String(error)}`);
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
            validationStatus: ValidationStatus.NEEDS_CLARIFICATION,
            complianceScore: extractedInfo.complianceScore || 0,
            feedback: extractedInfo.feedback || 'Unable to process the validation request. Please try again or contact support if the issue persists.',
            suggestedICD10Codes: extractedInfo.icd10Codes || [],
            suggestedCPTCodes: extractedInfo.cptCodes || [],
            internalReasoning: `Error processing LLM response: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
    }
}
//# sourceMappingURL=processor.js.map