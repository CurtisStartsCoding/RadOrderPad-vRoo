import { listLocations } from './list-locations';
import { createLocation } from './create-location';
import { getLocation } from './get-location';
import { updateLocation } from './update-location';
import { deactivateLocation } from './deactivate-location';
import { listConnectedOrgLocations } from './list-connected-org-locations';
import {
  listUserLocations,
  assignUserToLocation,
  unassignUserFromLocation
} from './user-location-management/';

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