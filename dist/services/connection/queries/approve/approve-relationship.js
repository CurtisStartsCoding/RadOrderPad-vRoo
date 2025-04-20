"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APPROVE_RELATIONSHIP_QUERY = void 0;
/**
 * Query to approve a relationship
 */
exports.APPROVE_RELATIONSHIP_QUERY = `
UPDATE organization_relationships
SET status = 'active', approved_by_id = $1, updated_at = NOW()
WHERE id = $2
`;
//# sourceMappingURL=approve-relationship.js.map