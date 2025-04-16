import { LocationData, LocationResponse } from './types';
import { locationManager, userLocationManager } from './manager';
import { listLocations, createLocation, getLocation, updateLocation, deactivateLocation, listUserLocations, assignUserToLocation, unassignUserFromLocation } from './services';
export { locationManager, userLocationManager };
export { LocationData, LocationResponse };
export { listLocations, createLocation, getLocation, updateLocation, deactivateLocation, listUserLocations, assignUserToLocation, unassignUserFromLocation };
declare const _default: {
    listLocations: typeof listLocations;
    createLocation: typeof createLocation;
    getLocation: typeof getLocation;
    updateLocation: typeof updateLocation;
    deactivateLocation: typeof deactivateLocation;
    listUserLocations: typeof listUserLocations;
    assignUserToLocation: typeof assignUserToLocation;
    unassignUserFromLocation: typeof unassignUserFromLocation;
};
export default _default;
