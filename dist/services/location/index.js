"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unassignUserFromLocation = exports.assignUserToLocation = exports.listUserLocations = exports.deactivateLocation = exports.updateLocation = exports.getLocation = exports.createLocation = exports.listLocations = exports.userLocationManager = exports.locationManager = void 0;
const manager_1 = require("./manager");
Object.defineProperty(exports, "locationManager", { enumerable: true, get: function () { return manager_1.locationManager; } });
Object.defineProperty(exports, "userLocationManager", { enumerable: true, get: function () { return manager_1.userLocationManager; } });
const services_1 = require("./services");
Object.defineProperty(exports, "listLocations", { enumerable: true, get: function () { return services_1.listLocations; } });
Object.defineProperty(exports, "createLocation", { enumerable: true, get: function () { return services_1.createLocation; } });
Object.defineProperty(exports, "getLocation", { enumerable: true, get: function () { return services_1.getLocation; } });
Object.defineProperty(exports, "updateLocation", { enumerable: true, get: function () { return services_1.updateLocation; } });
Object.defineProperty(exports, "deactivateLocation", { enumerable: true, get: function () { return services_1.deactivateLocation; } });
Object.defineProperty(exports, "listUserLocations", { enumerable: true, get: function () { return services_1.listUserLocations; } });
Object.defineProperty(exports, "assignUserToLocation", { enumerable: true, get: function () { return services_1.assignUserToLocation; } });
Object.defineProperty(exports, "unassignUserFromLocation", { enumerable: true, get: function () { return services_1.unassignUserFromLocation; } });
// Export a default object with all functions
exports.default = {
    // Location manager functions
    listLocations: services_1.listLocations,
    createLocation: services_1.createLocation,
    getLocation: services_1.getLocation,
    updateLocation: services_1.updateLocation,
    deactivateLocation: services_1.deactivateLocation,
    // User location manager functions
    listUserLocations: services_1.listUserLocations,
    assignUserToLocation: services_1.assignUserToLocation,
    unassignUserFromLocation: services_1.unassignUserFromLocation
};
//# sourceMappingURL=index.js.map