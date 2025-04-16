"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unassignUserFromLocation = exports.assignUserToLocation = exports.listUserLocations = exports.deactivateLocation = exports.updateLocation = exports.getLocation = exports.createLocation = exports.listLocations = void 0;
const list_locations_1 = require("./list-locations");
Object.defineProperty(exports, "listLocations", { enumerable: true, get: function () { return list_locations_1.listLocations; } });
const create_location_1 = require("./create-location");
Object.defineProperty(exports, "createLocation", { enumerable: true, get: function () { return create_location_1.createLocation; } });
const get_location_1 = require("./get-location");
Object.defineProperty(exports, "getLocation", { enumerable: true, get: function () { return get_location_1.getLocation; } });
const update_location_1 = require("./update-location");
Object.defineProperty(exports, "updateLocation", { enumerable: true, get: function () { return update_location_1.updateLocation; } });
const deactivate_location_1 = require("./deactivate-location");
Object.defineProperty(exports, "deactivateLocation", { enumerable: true, get: function () { return deactivate_location_1.deactivateLocation; } });
const user_location_management_1 = require("./user-location-management/");
Object.defineProperty(exports, "listUserLocations", { enumerable: true, get: function () { return user_location_management_1.listUserLocations; } });
Object.defineProperty(exports, "assignUserToLocation", { enumerable: true, get: function () { return user_location_management_1.assignUserToLocation; } });
Object.defineProperty(exports, "unassignUserFromLocation", { enumerable: true, get: function () { return user_location_management_1.unassignUserFromLocation; } });
//# sourceMappingURL=index.js.map