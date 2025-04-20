/**
 * SQL queries for connection operations
 */
/**
 * Query to list connections for an organization
 */
export const LIST_CONNECTIONS_QUERY = `
SELECT r.*, 
       o1.name as initiating_org_name,
       o2.name as target_org_name,
       u1.first_name as initiator_first_name,
       u1.last_name as initiator_last_name,
       u2.first_name as approver_first_name,
       u2.last_name as approver_last_name
FROM organization_relationships r
JOIN organizations o1 ON r.organization_id = o1.id
JOIN organizations o2 ON r.related_organization_id = o2.id
LEFT JOIN users u1 ON r.initiated_by_id = u1.id
LEFT JOIN users u2 ON r.approved_by_id = u2.id
WHERE (r.organization_id = $1 OR r.related_organization_id = $1)
ORDER BY r.created_at DESC
`;
/**
 * Query to list incoming connection requests
 */
export const LIST_INCOMING_REQUESTS_QUERY = `
SELECT r.*, 
       o1.name as initiating_org_name,
       u1.first_name as initiator_first_name,
       u1.last_name as initiator_last_name,
       u1.email as initiator_email
FROM organization_relationships r
JOIN organizations o1 ON r.organization_id = o1.id
LEFT JOIN users u1 ON r.initiated_by_id = u1.id
WHERE r.related_organization_id = $1 AND r.status = 'pending'
ORDER BY r.created_at DESC
`;
/**
 * Query to check if organizations exist
 */
export const CHECK_ORGANIZATIONS_QUERY = `
SELECT id, name, contact_email FROM organizations WHERE id IN ($1, $2)
`;
/**
 * Query to check if a relationship already exists
 */
export const CHECK_EXISTING_RELATIONSHIP_QUERY = `
SELECT id, status FROM organization_relationships 
WHERE (organization_id = $1 AND related_organization_id = $2)
OR (organization_id = $2 AND related_organization_id = $1)
`;
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
/**
 * Query to create a new relationship
 */
export const CREATE_RELATIONSHIP_QUERY = `
INSERT INTO organization_relationships
(organization_id, related_organization_id, status, initiated_by_id, notes)
VALUES ($1, $2, 'pending', $3, $4)
RETURNING id
`;
/**
 * Query to get a relationship for approval
 */
export const GET_RELATIONSHIP_FOR_APPROVAL_QUERY = `
SELECT r.*, 
       o1.name as initiating_org_name,
       o1.contact_email as initiating_org_email
FROM organization_relationships r
JOIN organizations o1 ON r.organization_id = o1.id
WHERE r.id = $1 AND r.related_organization_id = $2 AND r.status = 'pending'
`;
/**
 * Query to approve a relationship
 */
export const APPROVE_RELATIONSHIP_QUERY = `
UPDATE organization_relationships
SET status = 'active', approved_by_id = $1, updated_at = NOW()
WHERE id = $2
`;
/**
 * Query to reject a relationship
 */
export const REJECT_RELATIONSHIP_QUERY = `
UPDATE organization_relationships
SET status = 'rejected', approved_by_id = $1, updated_at = NOW()
WHERE id = $2
`;
/**
 * Query to get a relationship for termination
 */
export const GET_RELATIONSHIP_FOR_TERMINATION_QUERY = `
SELECT r.*, 
       o1.name as org1_name,
       o1.contact_email as org1_email,
       o2.name as org2_name,
       o2.contact_email as org2_email
FROM organization_relationships r
JOIN organizations o1 ON r.organization_id = o1.id
JOIN organizations o2 ON r.related_organization_id = o2.id
WHERE r.id = $1 AND (r.organization_id = $2 OR r.related_organization_id = $2) AND r.status = 'active'
`;
/**
 * Query to terminate a relationship
 */
export const TERMINATE_RELATIONSHIP_QUERY = `
UPDATE organization_relationships
SET status = 'terminated', updated_at = NOW()
WHERE id = $1
`;
//# sourceMappingURL=connection-queries.js.map