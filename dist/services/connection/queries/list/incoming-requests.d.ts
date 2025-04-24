/**
 * Query to list incoming connection requests
 */
export declare const LIST_INCOMING_REQUESTS_QUERY = "\nSELECT\n  r.id,\n  r.organization_id,\n  r.related_organization_id,\n  r.status,\n  r.initiated_by_id,\n  r.notes,\n  r.created_at,\n  r.updated_at,\n  o1.name as initiating_org_name,\n  u1.first_name as initiator_first_name,\n  u1.last_name as initiator_last_name,\n  u1.email as initiator_email\nFROM\n  organization_relationships r\nLEFT JOIN\n  organizations o1 ON r.organization_id = o1.id\nLEFT JOIN\n  users u1 ON r.initiated_by_id = u1.id\nWHERE\n  r.related_organization_id = $1\n  AND r.status = 'pending'\nORDER BY\n  r.created_at DESC\n";
