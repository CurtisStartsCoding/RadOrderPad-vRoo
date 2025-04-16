"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REJECT_RELATIONSHIP_QUERY = void 0;
/**
 * Query to reject a relationship
 */
exports.REJECT_RELATIONSHIP_QUERY = `
UPDATE organization_relationships
SET status = 'rejected', approved_by_id = $1, updated_at = NOW()
WHERE id = $2
`;
//# sourceMappingURL=reject-relationship.js.map