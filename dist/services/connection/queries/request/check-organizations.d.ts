/**
 * Query to check if organizations exist
 */
export declare const CHECK_ORGANIZATIONS_QUERY = "\nSELECT id, name, contact_email FROM organizations WHERE id IN ($1, $2)\n";
