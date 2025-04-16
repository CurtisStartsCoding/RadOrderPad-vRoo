"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET_RELATIONSHIP_FOR_APPROVAL_QUERY = void 0;
/**
 * Query to get a relationship for approval
 */
exports.GET_RELATIONSHIP_FOR_APPROVAL_QUERY = `
SELECT r.*, 
       o1.name as initiating_org_name,
       o1.contact_email as initiating_org_email
FROM organization_relationships r
JOIN organizations o1 ON r.organization_id = o1.id
WHERE r.id = $1 AND r.related_organization_id = $2 AND r.status = 'pending'
`;
//# sourceMappingURL=get-relationship.js.map