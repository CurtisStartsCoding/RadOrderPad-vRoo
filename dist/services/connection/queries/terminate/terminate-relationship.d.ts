/**
 * Query to terminate a relationship
 */
export declare const TERMINATE_RELATIONSHIP_QUERY = "\nUPDATE organization_relationships\nSET status = 'terminated', updated_at = NOW()\nWHERE id = $1\n";
