/**
 * Connection validation utilities
 */
// Import functions
import { validateRelationshipId } from './validate-relationship-id';
import { validateTargetOrgId } from './validate-target-org-id';
// Re-export functions
export { validateRelationshipId };
export { validateTargetOrgId };
// Default export for backward compatibility
export default {
    validateRelationshipId,
    validateTargetOrgId
};
//# sourceMappingURL=index.js.map