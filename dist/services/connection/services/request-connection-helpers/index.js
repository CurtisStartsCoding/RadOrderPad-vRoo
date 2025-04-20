"use strict";
/**
 * Connection request helper functions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewRelationship = exports.updateExistingRelationship = void 0;
// Import functions
const update_existing_relationship_1 = require("./update-existing-relationship");
Object.defineProperty(exports, "updateExistingRelationship", { enumerable: true, get: function () { return update_existing_relationship_1.updateExistingRelationship; } });
const create_new_relationship_1 = require("./create-new-relationship");
Object.defineProperty(exports, "createNewRelationship", { enumerable: true, get: function () { return create_new_relationship_1.createNewRelationship; } });
// Default export for backward compatibility
exports.default = {
    updateExistingRelationship: update_existing_relationship_1.updateExistingRelationship,
    createNewRelationship: create_new_relationship_1.createNewRelationship
};
//# sourceMappingURL=index.js.map