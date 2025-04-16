/**
 * Query to get a relationship for termination
 */
export declare const GET_RELATIONSHIP_FOR_TERMINATION_QUERY = "\nSELECT r.*, \n       o1.name as org1_name,\n       o1.contact_email as org1_email,\n       o2.name as org2_name,\n       o2.contact_email as org2_email\nFROM organization_relationships r\nJOIN organizations o1 ON r.organization_id = o1.id\nJOIN organizations o2 ON r.related_organization_id = o2.id\nWHERE r.id = $1 AND (r.organization_id = $2 OR r.related_organization_id = $2) AND r.status = 'active'\n";
