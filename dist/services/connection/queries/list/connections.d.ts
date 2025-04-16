/**
 * Query to list connections for an organization
 */
export declare const LIST_CONNECTIONS_QUERY = "\nSELECT r.*, \n       o1.name as initiating_org_name,\n       o2.name as target_org_name,\n       u1.first_name as initiator_first_name,\n       u1.last_name as initiator_last_name,\n       u2.first_name as approver_first_name,\n       u2.last_name as approver_last_name\nFROM organization_relationships r\nJOIN organizations o1 ON r.organization_id = o1.id\nJOIN organizations o2 ON r.related_organization_id = o2.id\nLEFT JOIN users u1 ON r.initiated_by_id = u1.id\nLEFT JOIN users u2 ON r.approved_by_id = u2.id\nWHERE (r.organization_id = $1 OR r.related_organization_id = $1)\nORDER BY r.created_at DESC\n";
