import { ValidationResult, ValidationStatus } from '../../models';
import { normalizeResponseFields, normalizeCodeArray } from './normalizer';
import { validateRequiredFields, validateValidationStatus } from './validator';
import { extractPartialInformation } from './extractor';

/**
 * Process the LLM response for validation
 */
export function processLLMResponse(responseContent: string): ValidationResult {
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
    } catch (error) {
      // eslint-disable-next-line no-console
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
  } catch (error) {
    // Log error without including the full raw response
    // eslint-disable-next-line no-console
    console.error('Error processing LLM response:', error);
    // Instead of logging the full raw response, log only that an error occurred
    // eslint-disable-next-line no-console
    console.error('Error occurred while processing LLM response - see error details above');
    
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