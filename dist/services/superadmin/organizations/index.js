"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrganizationById = exports.listAllOrganizations = void 0;
/**
 * Export all organization-related service functions
 */
var list_all_organizations_1 = require("./list-all-organizations");
Object.defineProperty(exports, "listAllOrganizations", { enumerable: true, get: function () { return list_all_organizations_1.listAllOrganizations; } });
var get_organization_by_id_1 = require("./get-organization-by-id");
Object.defineProperty(exports, "getOrganizationById", { enumerable: true, get: function () { return get_organization_by_id_1.getOrganizationById; } });
//# sourceMappingURL=index.js.map