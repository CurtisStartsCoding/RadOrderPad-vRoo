/**
 * Query to create a new relationship
 */
export declare const CREATE_RELATIONSHIP_QUERY = "\nINSERT INTO organization_relationships\n(organization_id, related_organization_id, status, initiated_by_id, notes)\nVALUES ($1, $2, 'pending', $3, $4)\nRETURNING id\n";
