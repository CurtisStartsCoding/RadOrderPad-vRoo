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
//# sourceMappingURL=connections.js.map