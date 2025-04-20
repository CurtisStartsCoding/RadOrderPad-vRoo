/**
 * Validate patient has required information for sending to radiology
 * @param patient Patient data
 * @returns Array of missing field names
 */
export function validatePatientFields(patient) {
    const missingPatientFields = [];
    if (!patient.address_line1)
        missingPatientFields.push('address');
    if (!patient.city)
        missingPatientFields.push('city');
    if (!patient.state)
        missingPatientFields.push('state');
    if (!patient.zip_code)
        missingPatientFields.push('zip code');
    if (!patient.phone_number)
        missingPatientFields.push('phone number');
    return missingPatientFields;
}
//# sourceMappingURL=validate-patient-fields.js.map