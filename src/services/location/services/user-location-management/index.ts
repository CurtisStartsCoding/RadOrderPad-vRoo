/**
 * User location management services
 */

// Import functions
import { listUserLocations } from './list-user-locations';
import { assignUserToLocation } from './assign-user-to-location';
import { unassignUserFromLocation } from './unassign-user-from-location';

// Re-export functions
export { listUserLocations };
export { assignUserToLocation };
export { unassignUserFromLocation };

// Default export for backward compatibility
export default {
  listUserLocations,
  assignUserToLocation,
  unassignUserFromLocation
};