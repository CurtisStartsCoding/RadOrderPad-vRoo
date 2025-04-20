/**
 * Generate CSV export of order data
 * @param orderDetails Order details object
 * @returns CSV string
 */
export function generateCsvExport(orderDetails) {
    try {
        // Extract data from order details
        const { order, patient, insurance } = orderDetails;
        // Create a flattened object for CSV export
        const flatData = {
            // Order information
            order_id: order.id,
            order_number: order.order_number,
            status: order.status,
            priority: order.priority,
            modality: order.modality,
            body_part: order.body_part,
            laterality: order.laterality,
            cpt_code: order.final_cpt_code,
            cpt_description: order.final_cpt_code_description,
            icd10_codes: order.final_icd10_codes,
            icd10_descriptions: order.final_icd10_code_descriptions,
            clinical_indication: order.clinical_indication,
            validation_status: order.final_validation_status,
            compliance_score: order.final_compliance_score,
            contrast_indicated: order.is_contrast_indicated ? 'Yes' : 'No',
            // Patient information
            patient_id: patient?.id,
            patient_mrn: patient?.mrn,
            patient_first_name: patient?.first_name,
            patient_last_name: patient?.last_name,
            patient_dob: patient?.date_of_birth,
            patient_gender: patient?.gender,
            patient_address: patient?.address_line1,
            patient_address2: patient?.address_line2,
            patient_city: patient?.city,
            patient_state: patient?.state,
            patient_zip: patient?.zip_code,
            patient_phone: patient?.phone_number,
            patient_email: patient?.email,
            // Insurance information (primary only)
            insurance_provider: insurance?.[0]?.insurer_name,
            insurance_policy_number: insurance?.[0]?.policy_number,
            insurance_group_number: insurance?.[0]?.group_number,
            insurance_plan_type: insurance?.[0]?.plan_type,
            // Referring information
            referring_physician: order.referring_physician_name,
            referring_physician_npi: order.referring_physician_npi,
            // Dates
            created_at: order.created_at,
            updated_at: order.updated_at
        };
        // Create CSV header and data
        const header = Object.keys(flatData);
        // Generate CSV manually
        let csvString = header.join(',') + '\n';
        // Add the data row
        const values = header.map(key => {
            const value = flatData[key];
            // Handle values that might contain commas or quotes
            if (value === null || value === undefined) {
                return '';
            }
            else if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            else {
                return String(value);
            }
        });
        csvString += values.join(',');
        return csvString;
    }
    catch (error) {
        console.error('Error generating CSV export:', error);
        throw new Error('Failed to generate CSV export');
    }
}
//# sourceMappingURL=generate-csv-export.js.map