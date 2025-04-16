"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPDATE_RELATIONSHIP_TO_PENDING_QUERY = void 0;
/**
 * Query to update an existing relationship to pending
 */
exports.UPDATE_RELATIONSHIP_TO_PENDING_QUERY = `
UPDATE organization_relationships
SET status = 'pending', 
    organization_id = $1,
    related_organization_id = $2,
    initiated_by_id = $3,
    approved_by_id = NULL,
    notes = $4,
    updated_at = NOW()
WHERE id = $5
RETURNING id
`;
//# sourceMappingURL=update-relationship.js.map