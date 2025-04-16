/**
 * Query to check if organizations exist
 */
export const CHECK_ORGANIZATIONS_QUERY = `
SELECT id, name, contact_email FROM organizations WHERE id IN ($1, $2)
`;