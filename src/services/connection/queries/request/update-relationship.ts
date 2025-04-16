/**
 * Query to update an existing relationship to pending
 */
export const UPDATE_RELATIONSHIP_TO_PENDING_QUERY = `
UPDATE organization_relationships
SET status = 'pending', 
    organization_id = $1,
    related_organization_id = $2,
    initiated_by_id = $3,
    approved_by_id = NULL,
    notes = $4,
    updated_at = NOW()
WHERE id = $5
RETURNING id
`;