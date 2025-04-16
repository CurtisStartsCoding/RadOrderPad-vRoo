/**
 * Query to approve a relationship
 */
export declare const APPROVE_RELATIONSHIP_QUERY = "\nUPDATE organization_relationships\nSET status = 'active', approved_by_id = $1, updated_at = NOW()\nWHERE id = $2\n";
