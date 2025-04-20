"use strict";
/**
 * Connection validation utilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTargetOrgId = exports.validateRelationshipId = void 0;
// Import functions
const validate_relationship_id_1 = require("./validate-relationship-id");
Object.defineProperty(exports, "validateRelationshipId", { enumerable: true, get: function () { return validate_relationship_id_1.validateRelationshipId; } });
const validate_target_org_id_1 = require("./validate-target-org-id");
Object.defineProperty(exports, "validateTargetOrgId", { enumerable: true, get: function () { return validate_target_org_id_1.validateTargetOrgId; } });
// Default export for backward compatibility
exports.default = {
    validateRelationshipId: validate_relationship_id_1.validateRelationshipId,
    validateTargetOrgId: validate_target_org_id_1.validateTargetOrgId
};
//# sourceMappingURL=index.js.map