"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHECK_EXISTING_RELATIONSHIP_QUERY = void 0;
/**
 * Query to check if a relationship already exists
 */
exports.CHECK_EXISTING_RELATIONSHIP_QUERY = `
SELECT id, status FROM organization_relationships 
WHERE (organization_id = $1 AND related_organization_id = $2)
OR (organization_id = $2 AND related_organization_id = $1)
`;
//# sourceMappingURL=check-existing-relationship.js.map