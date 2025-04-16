/**
 * Query to check if a relationship already exists
 */
export const CHECK_EXISTING_RELATIONSHIP_QUERY = `
SELECT id, status FROM organization_relationships 
WHERE (organization_id = $1 AND related_organization_id = $2)
OR (organization_id = $2 AND related_organization_id = $1)
`;