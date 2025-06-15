import { LocationData, LocationResponse } from './types';
import { locationManager, userLocationManager } from './manager';
import {
  listLocations,
  createLocation,
  getLocation,
  updateLocation,
  deactivateLocation,
  listConnectedOrgLocations,
  listUserLocations,
  assignUserToLocation,
  unassignUserFromLocation
} from './services';

// Export the managers
export {
  locationManager,
  userLocationManager
};

// Export types
export {
  LocationData,
  LocationResponse
};

// Export individual functions for direct use
export {
  listLocations,
  createLocation,
  getLocation,
  updateLocation,
  deactivateLocation,
  listConnectedOrgLocations,
  listUserLocations,
  assignUserToLocation,
  unassignUserFromLocation
};

// Export a default object with all functions
export default {
  // Location manager functions
  listLocations,
  createLocation,
  getLocation,
  updateLocation,
  deactivateLocation,
  listConnectedOrgLocations,
  
  // User location manager functions
  listUserLocations,
  assignUserToLocation,
  unassignUserFromLocation
};