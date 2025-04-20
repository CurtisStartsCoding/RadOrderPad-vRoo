"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeResponseFields = normalizeResponseFields;
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
//# sourceMappingURL=normalize-response-fields.js.map