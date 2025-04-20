/**
 * Query to approve a relationship
 */
export const APPROVE_RELATIONSHIP_QUERY = `
UPDATE organization_relationships
SET status = 'active', approved_by_id = $1, updated_at = NOW()
WHERE id = $2
`;
//# sourceMappingURL=approve-relationship.js.map