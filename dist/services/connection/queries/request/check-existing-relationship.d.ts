/**
 * Query to check if a relationship already exists
 */
export declare const CHECK_EXISTING_RELATIONSHIP_QUERY = "\nSELECT id, status FROM organization_relationships \nWHERE (organization_id = $1 AND related_organization_id = $2)\nOR (organization_id = $2 AND related_organization_id = $1)\n";
