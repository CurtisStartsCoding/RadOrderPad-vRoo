import OrderService from '../../../services/order.service';
import { validateOrderId, validateFinalizePayload, validateUserAuth } from '../validation';
import { handleControllerError } from '../error-handling';
/**
 * Handles the finalize order request
 * @param req Express request object
 * @param res Express response object
 */
export async function finalizeOrder(req, res) {
    try {
        // Validate order ID
        if (!validateOrderId(req, res)) {
            return;
        }
        // Validate payload
        if (!validateFinalizePayload(req, res)) {
            return;
        }
        // Validate user authentication
        const userId = validateUserAuth(req, res);
        if (!userId) {
            return;
        }
        const orderId = parseInt(req.params.orderId);
        const rawPayload = req.body;
        // Convert snake_case to camelCase for backward compatibility
        const payload = {
            finalValidationStatus: rawPayload.finalValidationStatus || rawPayload.final_validation_status,
            finalComplianceScore: rawPayload.finalComplianceScore || rawPayload.final_compliance_score,
            finalICD10Codes: rawPayload.finalICD10Codes || rawPayload.final_icd10_codes,
            finalICD10CodeDescriptions: rawPayload.finalICD10CodeDescriptions || rawPayload.final_icd10_code_descriptions,
            finalCPTCode: rawPayload.finalCPTCode || rawPayload.final_cpt_code,
            finalCPTCodeDescription: rawPayload.finalCPTCodeDescription || rawPayload.final_cpt_code_description,
            clinicalIndication: rawPayload.clinicalIndication || rawPayload.clinical_indication || rawPayload.dictationText || rawPayload.dictation_text,
            overridden: rawPayload.overridden || false,
            overrideJustification: rawPayload.overrideJustification || rawPayload.override_justification,
            isUrgentOverride: rawPayload.isUrgentOverride || rawPayload.is_urgent_override || false,
            signatureData: rawPayload.signatureData || rawPayload.signature_data
        };
        // Handle temporary patient data
        if (rawPayload.isTemporaryPatient || rawPayload.patient_name_update) {
            payload.isTemporaryPatient = true;
            // Convert legacy format to new format
            if (rawPayload.patient_name_update) {
                const nameParts = rawPayload.patient_name_update.split(' ');
                const firstName = nameParts[0];
                const lastName = nameParts.slice(1).join(' ');
                payload.patientInfo = {
                    firstName: firstName,
                    lastName: lastName,
                    dateOfBirth: rawPayload.patient_dob_update,
                    gender: rawPayload.patient_gender_update,
                    mrn: rawPayload.patient_mrn_update,
                    phoneNumber: rawPayload.patient_phone_update
                };
            }
            else {
                payload.patientInfo = rawPayload.patientInfo;
            }
        }
        // Call the service to handle the finalization
        const result = await OrderService.handleFinalizeOrder(orderId, payload, userId);
        res.status(200).json(result);
    }
    catch (error) {
        handleControllerError(error, res, 'finalizeOrder');
    }
}
//# sourceMappingURL=finalize-order.js.map