/**
 * Query to terminate a relationship
 */
export const TERMINATE_RELATIONSHIP_QUERY = `
UPDATE organization_relationships
SET status = 'terminated', updated_at = NOW()
WHERE id = $1
`;