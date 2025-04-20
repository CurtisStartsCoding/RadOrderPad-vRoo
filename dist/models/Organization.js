"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationStatus = exports.OrganizationType = void 0;
var OrganizationType;
(function (OrganizationType) {
    OrganizationType["REFERRING_PRACTICE"] = "referring_practice";
    OrganizationType["RADIOLOGY_GROUP"] = "radiology_group";
})(OrganizationType || (exports.OrganizationType = OrganizationType = {}));
var OrganizationStatus;
(function (OrganizationStatus) {
    OrganizationStatus["ACTIVE"] = "active";
    OrganizationStatus["ON_HOLD"] = "on_hold";
    OrganizationStatus["PURGATORY"] = "purgatory";
    OrganizationStatus["TERMINATED"] = "terminated";
})(OrganizationStatus || (exports.OrganizationStatus = OrganizationStatus = {}));
//# sourceMappingURL=Organization.js.map