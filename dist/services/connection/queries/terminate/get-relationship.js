"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET_RELATIONSHIP_FOR_TERMINATION_QUERY = void 0;
/**
 * Query to get a relationship for termination
 */
exports.GET_RELATIONSHIP_FOR_TERMINATION_QUERY = `
SELECT r.*, 
       o1.name as org1_name,
       o1.contact_email as org1_email,
       o2.name as org2_name,
       o2.contact_email as org2_email
FROM organization_relationships r
JOIN organizations o1 ON r.organization_id = o1.id
JOIN organizations o2 ON r.related_organization_id = o2.id
WHERE r.id = $1 AND (r.organization_id = $2 OR r.related_organization_id = $2) AND r.status = 'active'
`;
//# sourceMappingURL=get-relationship.js.map