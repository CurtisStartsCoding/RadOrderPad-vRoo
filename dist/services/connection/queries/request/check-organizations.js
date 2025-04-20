"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHECK_ORGANIZATIONS_QUERY = void 0;
/**
 * Query to check if organizations exist
 */
exports.CHECK_ORGANIZATIONS_QUERY = `
SELECT id, name, contact_email FROM organizations WHERE id IN ($1, $2)
`;
//# sourceMappingURL=check-organizations.js.map