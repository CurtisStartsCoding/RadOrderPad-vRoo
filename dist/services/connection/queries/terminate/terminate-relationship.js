"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TERMINATE_RELATIONSHIP_QUERY = void 0;
/**
 * Query to terminate a relationship
 */
exports.TERMINATE_RELATIONSHIP_QUERY = `
UPDATE organization_relationships
SET status = 'terminated', updated_at = NOW()
WHERE id = $1
`;
//# sourceMappingURL=terminate-relationship.js.map