/**
 * Query to reject a relationship
 */
export declare const REJECT_RELATIONSHIP_QUERY = "\nUPDATE organization_relationships\nSET status = 'rejected', approved_by_id = $1, updated_at = NOW()\nWHERE id = $2\n";
