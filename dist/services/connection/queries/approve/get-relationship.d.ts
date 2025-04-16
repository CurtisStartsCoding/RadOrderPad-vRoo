/**
 * Query to get a relationship for approval
 */
export declare const GET_RELATIONSHIP_FOR_APPROVAL_QUERY = "\nSELECT r.*, \n       o1.name as initiating_org_name,\n       o1.contact_email as initiating_org_email\nFROM organization_relationships r\nJOIN organizations o1 ON r.organization_id = o1.id\nWHERE r.id = $1 AND r.related_organization_id = $2 AND r.status = 'pending'\n";
