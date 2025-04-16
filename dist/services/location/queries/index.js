"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unassignUserFromLocation = exports.assignUserToLocation = exports.listUserLocations = exports.deactivateLocation = exports.updateLocation = exports.getLocation = exports.createLocation = exports.listLocations = void 0;
const list_1 = require("./list");
Object.defineProperty(exports, "listLocations", { enumerable: true, get: function () { return list_1.listLocations; } });
const create_1 = require("./create");
Object.defineProperty(exports, "createLocation", { enumerable: true, get: function () { return create_1.createLocation; } });
const get_1 = require("./get");
Object.defineProperty(exports, "getLocation", { enumerable: true, get: function () { return get_1.getLocation; } });
const update_1 = require("./update");
Object.defineProperty(exports, "updateLocation", { enumerable: true, get: function () { return update_1.updateLocation; } });
const deactivate_1 = require("./deactivate");
Object.defineProperty(exports, "deactivateLocation", { enumerable: true, get: function () { return deactivate_1.deactivateLocation; } });
const user_1 = require("./user");
Object.defineProperty(exports, "listUserLocations", { enumerable: true, get: function () { return user_1.listUserLocations; } });
Object.defineProperty(exports, "assignUserToLocation", { enumerable: true, get: function () { return user_1.assignUserToLocation; } });
Object.defineProperty(exports, "unassignUserFromLocation", { enumerable: true, get: function () { return user_1.unassignUserFromLocation; } });
//# sourceMappingURL=index.js.map