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