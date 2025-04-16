/**
 * Query to update an existing relationship to pending
 */
export declare const UPDATE_RELATIONSHIP_TO_PENDING_QUERY = "\nUPDATE organization_relationships\nSET status = 'pending', \n    organization_id = $1,\n    related_organization_id = $2,\n    initiated_by_id = $3,\n    approved_by_id = NULL,\n    notes = $4,\n    updated_at = NOW()\nWHERE id = $5\nRETURNING id\n";
