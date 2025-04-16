/**
 * Query to list incoming connection requests
 */
export declare const LIST_INCOMING_REQUESTS_QUERY = "\nSELECT r.*, \n       o1.name as initiating_org_name,\n       u1.first_name as initiator_first_name,\n       u1.last_name as initiator_last_name,\n       u1.email as initiator_email\nFROM organization_relationships r\nJOIN organizations o1 ON r.organization_id = o1.id\nLEFT JOIN users u1 ON r.initiated_by_id = u1.id\nWHERE r.related_organization_id = $1 AND r.status = 'pending'\nORDER BY r.created_at DESC\n";
