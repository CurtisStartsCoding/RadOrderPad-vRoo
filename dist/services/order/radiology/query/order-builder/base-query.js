/**
 * Create the base query for getting incoming orders
 * @param orgId Radiology organization ID
 * @returns Object containing the query string, parameters, and next parameter index
 */
export function createBaseQuery(orgId) {
    const query = `
    SELECT o.id, o.order_number, o.status, o.priority, o.modality, o.body_part, 
           o.final_cpt_code, o.final_cpt_code_description, o.final_validation_status,
           o.created_at, o.updated_at, o.patient_name, o.patient_dob, o.patient_gender,
           o.referring_physician_name, o.referring_organization_id
    FROM orders o
    WHERE o.radiology_organization_id = $1
  `;
    return {
        query,
        params: [orgId],
        paramIndex: 2
    };
}
export default createBaseQuery;
//# sourceMappingURL=base-query.js.map