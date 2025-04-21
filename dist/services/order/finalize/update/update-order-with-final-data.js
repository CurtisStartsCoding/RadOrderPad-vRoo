"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderWithFinalData = updateOrderWithFinalData;
const models_1 = require("../../../../models");
const db_1 = require("../../../../config/db");
/**
 * Update the order with final data
 *
 * @param client Database client for transaction
 * @param orderId The ID of the order to update
 * @param patientId The ID of the patient
 * @param payload The finalize order payload
 * @param userId The ID of the user performing the update
 */
async function updateOrderWithFinalData(client, orderId, patientId, payload, userId) {
    // Fetch user details from main database
    const userResult = await (0, db_1.queryMainDb)(`SELECT 
      u.first_name, 
      u.last_name, 
      u.email, 
      u.phone_number, 
      u.npi, 
      u.specialty
    FROM users u
    WHERE u.id = $1`, [userId]);
    if (userResult.rows.length === 0) {
        throw new Error(`User with ID ${userId} not found`);
    }
    const user = userResult.rows[0];
    // Fetch referring organization details from main database
    const referringOrgResult = await (0, db_1.queryMainDb)(`SELECT 
      o.name, 
      o.npi, 
      o.tax_id, 
      o.address_line1, 
      o.address_line2, 
      o.city, 
      o.state, 
      o.zip_code, 
      o.phone_number, 
      o.fax_number, 
      o.contact_email
    FROM organizations o
    WHERE o.id = $1`, [payload.referringOrganizationId || 0]);
    const referringOrg = referringOrgResult.rows.length > 0 ? referringOrgResult.rows[0] : null;
    // Fetch radiology organization details from main database
    const radiologyOrgResult = await (0, db_1.queryMainDb)(`SELECT 
      o.name, 
      o.npi, 
      o.tax_id, 
      o.address_line1, 
      o.address_line2, 
      o.city, 
      o.state, 
      o.zip_code, 
      o.phone_number, 
      o.fax_number, 
      o.contact_email
    FROM organizations o
    WHERE o.id = $1`, [payload.radiologyOrganizationId || 0]);
    const radiologyOrg = radiologyOrgResult.rows.length > 0 ? radiologyOrgResult.rows[0] : null;
    // Update the order with all the data
    await client.query(`UPDATE orders SET
    patient_id = $1,
    status = $2,
    clinical_indication = $3,
    final_cpt_code = $4,
    final_cpt_code_description = $5,
    final_icd10_codes = $6,
    final_icd10_code_descriptions = $7,
    final_validation_status = $8,
    final_compliance_score = $9,
    overridden = $10,
    override_justification = $11,
    is_urgent_override = $12,
    signed_by_user_id = $13,
    signature_date = NOW(),
    validated_at = NOW(),
    updated_at = NOW(),
    updated_by_user_id = $14,
    
    -- Referring physician details
    referring_physician_name = $15,
    referring_physician_npi = $16,
    referring_physician_email = $17,
    referring_physician_phone = $18,
    referring_physician_specialty = $19,
    
    -- Referring organization details
    referring_organization_name = $20,
    referring_organization_npi = $21,
    referring_organization_tax_id = $22,
    referring_organization_address = $23,
    referring_organization_city = $24,
    referring_organization_state = $25,
    referring_organization_zip = $26,
    referring_organization_phone = $27,
    referring_organization_fax = $28,
    referring_organization_email = $29,
    
    -- Radiology organization details
    radiology_organization_name = $30,
    radiology_organization_npi = $31,
    radiology_organization_tax_id = $32,
    radiology_organization_address = $33,
    radiology_organization_city = $34,
    radiology_organization_state = $35,
    radiology_organization_zip = $36,
    radiology_organization_phone = $37,
    radiology_organization_fax = $38,
    radiology_organization_email = $39,
    
    -- Consent and authorization placeholders
    patient_consent_obtained = $40,
    patient_consent_date = $41,
    insurance_authorization_number = $42,
    insurance_authorization_date = $43,
    insurance_authorization_contact = $44,
    medical_necessity_documentation = $45
    
    WHERE id = $46`, [
        patientId,
        models_1.OrderStatus.PENDING_ADMIN,
        payload.clinicalIndication,
        payload.finalCPTCode,
        payload.finalCPTCodeDescription,
        payload.finalICD10Codes,
        payload.finalICD10CodeDescriptions,
        payload.finalValidationStatus,
        payload.finalComplianceScore,
        payload.overridden || false,
        payload.overrideJustification || null,
        payload.isUrgentOverride || false,
        userId, // Signed by the current user
        userId, // Updated by the current user
        // Referring physician details
        `${user.first_name} ${user.last_name}`,
        user.npi || null,
        user.email || null,
        user.phone_number || null,
        user.specialty || null,
        // Referring organization details
        referringOrg?.name || null,
        referringOrg?.npi || null,
        referringOrg?.tax_id || null,
        referringOrg?.address_line1 || null,
        referringOrg?.city || null,
        referringOrg?.state || null,
        referringOrg?.zip_code || null,
        referringOrg?.phone_number || null,
        referringOrg?.fax_number || null,
        referringOrg?.contact_email || null,
        // Radiology organization details
        radiologyOrg?.name || null,
        radiologyOrg?.npi || null,
        radiologyOrg?.tax_id || null,
        radiologyOrg?.address_line1 || null,
        radiologyOrg?.city || null,
        radiologyOrg?.state || null,
        radiologyOrg?.zip_code || null,
        radiologyOrg?.phone_number || null,
        radiologyOrg?.fax_number || null,
        radiologyOrg?.contact_email || null,
        // Consent and authorization placeholders
        payload.patientConsentObtained || false,
        payload.patientConsentDate || null,
        payload.insuranceAuthorizationNumber || null,
        payload.insuranceAuthorizationDate || null,
        payload.insuranceAuthorizationContact || null,
        payload.medicalNecessityDocumentation || null,
        orderId
    ]);
}
//# sourceMappingURL=update-order-with-final-data.js.map