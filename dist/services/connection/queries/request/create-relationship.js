/**
 * Query to create a new relationship
 */
export const CREATE_RELATIONSHIP_QUERY = `
INSERT INTO organization_relationships
(organization_id, related_organization_id, status, initiated_by_id, notes)
VALUES ($1, $2, 'pending', $3, $4)
RETURNING id
`;
//# sourceMappingURL=create-relationship.js.map