/**
 * SQL queries for connection operations
 */
/**
 * Query to list connections for an organization
 */
export declare const LIST_CONNECTIONS_QUERY = "\nSELECT r.*, \n       o1.name as initiating_org_name,\n       o2.name as target_org_name,\n       u1.first_name as initiator_first_name,\n       u1.last_name as initiator_last_name,\n       u2.first_name as approver_first_name,\n       u2.last_name as approver_last_name\nFROM organization_relationships r\nJOIN organizations o1 ON r.organization_id = o1.id\nJOIN organizations o2 ON r.related_organization_id = o2.id\nLEFT JOIN users u1 ON r.initiated_by_id = u1.id\nLEFT JOIN users u2 ON r.approved_by_id = u2.id\nWHERE (r.organization_id = $1 OR r.related_organization_id = $1)\nORDER BY r.created_at DESC\n";
/**
 * Query to list incoming connection requests
 */
export declare const LIST_INCOMING_REQUESTS_QUERY = "\nSELECT r.*, \n       o1.name as initiating_org_name,\n       u1.first_name as initiator_first_name,\n       u1.last_name as initiator_last_name,\n       u1.email as initiator_email\nFROM organization_relationships r\nJOIN organizations o1 ON r.organization_id = o1.id\nLEFT JOIN users u1 ON r.initiated_by_id = u1.id\nWHERE r.related_organization_id = $1 AND r.status = 'pending'\nORDER BY r.created_at DESC\n";
/**
 * Query to check if organizations exist
 */
export declare const CHECK_ORGANIZATIONS_QUERY = "\nSELECT id, name, contact_email FROM organizations WHERE id IN ($1, $2)\n";
/**
 * Query to check if a relationship already exists
 */
export declare const CHECK_EXISTING_RELATIONSHIP_QUERY = "\nSELECT id, status FROM organization_relationships \nWHERE (organization_id = $1 AND related_organization_id = $2)\nOR (organization_id = $2 AND related_organization_id = $1)\n";
/**
 * Query to update an existing relationship to pending
 */
export declare const UPDATE_RELATIONSHIP_TO_PENDING_QUERY = "\nUPDATE organization_relationships\nSET status = 'pending', \n    organization_id = $1,\n    related_organization_id = $2,\n    initiated_by_id = $3,\n    approved_by_id = NULL,\n    notes = $4,\n    updated_at = NOW()\nWHERE id = $5\nRETURNING id\n";
/**
 * Query to create a new relationship
 */
export declare const CREATE_RELATIONSHIP_QUERY = "\nINSERT INTO organization_relationships\n(organization_id, related_organization_id, status, initiated_by_id, notes)\nVALUES ($1, $2, 'pending', $3, $4)\nRETURNING id\n";
/**
 * Query to get a relationship for approval
 */
export declare const GET_RELATIONSHIP_FOR_APPROVAL_QUERY = "\nSELECT r.*, \n       o1.name as initiating_org_name,\n       o1.contact_email as initiating_org_email\nFROM organization_relationships r\nJOIN organizations o1 ON r.organization_id = o1.id\nWHERE r.id = $1 AND r.related_organization_id = $2 AND r.status = 'pending'\n";
/**
 * Query to approve a relationship
 */
export declare const APPROVE_RELATIONSHIP_QUERY = "\nUPDATE organization_relationships\nSET status = 'active', approved_by_id = $1, updated_at = NOW()\nWHERE id = $2\n";
/**
 * Query to reject a relationship
 */
export declare const REJECT_RELATIONSHIP_QUERY = "\nUPDATE organization_relationships\nSET status = 'rejected', approved_by_id = $1, updated_at = NOW()\nWHERE id = $2\n";
/**
 * Query to get a relationship for termination
 */
export declare const GET_RELATIONSHIP_FOR_TERMINATION_QUERY = "\nSELECT r.*, \n       o1.name as org1_name,\n       o1.contact_email as org1_email,\n       o2.name as org2_name,\n       o2.contact_email as org2_email\nFROM organization_relationships r\nJOIN organizations o1 ON r.organization_id = o1.id\nJOIN organizations o2 ON r.related_organization_id = o2.id\nWHERE r.id = $1 AND (r.organization_id = $2 OR r.related_organization_id = $2) AND r.status = 'active'\n";
/**
 * Query to terminate a relationship
 */
export declare const TERMINATE_RELATIONSHIP_QUERY = "\nUPDATE organization_relationships\nSET status = 'terminated', updated_at = NOW()\nWHERE id = $1\n";
