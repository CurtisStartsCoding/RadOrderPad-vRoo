# Location Management Implementation

**Date:** 2025-04-13
**Author:** Roo
**Status:** Complete

## Overview

This document details the implementation of the Location Management functionality, which enables organization administrators (`admin_referring`, `admin_radiology`) to manage physical locations/facilities within their own organization. The implementation follows the requirements specified in the API endpoints documentation.

## Components Implemented

### 1. Service (`src/services/location.service.ts`)

Created a service with the following methods:

- `listLocations(orgId)`: Retrieves locations for an organization
- `createLocation(orgId, locationData)`: Creates a new location for an organization
- `getLocation(locationId, orgId)`: Retrieves details of a specific location
- `updateLocation(locationId, orgId, locationData)`: Updates a location
- `deactivateLocation(locationId, orgId)`: Deactivates a location (soft delete)
- `listUserLocations(userId, orgId)`: Retrieves locations assigned to a user
- `assignUserToLocation(userId, locationId, orgId)`: Assigns a user to a location
- `unassignUserFromLocation(userId, locationId, orgId)`: Unassigns a user from a location

### 2. Controller (`src/controllers/location.controller.ts`)

Implemented a controller with methods corresponding to the service methods:

- `listLocations`: Handles GET requests to list locations
- `createLocation`: Handles POST requests to create locations
- `getLocation`: Handles GET requests to retrieve location details
- `updateLocation`: Handles PUT requests to update locations
- `deactivateLocation`: Handles DELETE requests to deactivate locations
- `listUserLocations`: Handles GET requests to list user locations
- `assignUserToLocation`: Handles POST requests to assign users to locations
- `unassignUserFromLocation`: Handles DELETE requests to unassign users from locations

### 3. Routes

Created two route files:

#### Organization Routes (`src/routes/organization.routes.ts`)

- `GET /organizations/mine/locations`: List locations
- `POST /organizations/mine/locations`: Create location
- `GET /organizations/mine/locations/:locationId`: Get location details
- `PUT /organizations/mine/locations/:locationId`: Update location
- `DELETE /organizations/mine/locations/:locationId`: Deactivate location

#### User-Location Routes (`src/routes/user-location.routes.ts`)

- `GET /users/:userId/locations`: List locations for a user
- `POST /users/:userId/locations/:locationId`: Assign user to location
- `DELETE /users/:userId/locations/:locationId`: Unassign user from location

### 4. Main Router Update (`src/routes/index.ts`)

Updated the main router to include the new routes:

```typescript
router.use('/organizations', organizationRoutes);
router.use('/users', userLocationRoutes);
```

## Database Interactions

The implementation interacts with the following tables in the Main DB:

- `locations`: For storing location information
- `user_locations`: For storing user-location assignments
- `users`: For verifying user existence and organization membership

## Security Considerations

1. **Authentication**: All endpoints require a valid JWT token
2. **Authorization**: Endpoints are restricted to users with `admin_referring` or `admin_radiology` roles
3. **Data Access Control**: Admins can only manage locations within their own organization
4. **Parameterized Queries**: All database queries use parameterized statements to prevent SQL injection

## Testing

Created a comprehensive test script (`tests/batch/test-location-management.bat`) that tests all implemented endpoints:

1. List Locations
2. Create Location
3. Get Location Details
4. Update Location
5. Assign User to Location
6. List User Locations
7. Unassign User from Location
8. Deactivate Location

## Future Enhancements

1. **Bulk Operations**: Add support for bulk creation/update/deactivation of locations
2. **Location Types**: Add support for categorizing locations (e.g., clinic, hospital, imaging center)
3. **Location Hours**: Add support for storing operating hours for locations
4. **Location Services**: Add support for specifying services available at each location
5. **Location Search**: Add support for searching locations by name, address, etc.
6. **Geolocation**: Add support for storing and querying locations by geographic coordinates

## Related Documentation

- [API Endpoints](../../Docs/api_endpoints.md)
- [Database Schema](../../Docs/SCHEMA_Main_COMPLETE.md)
- [Role-Based Access Control](../../Docs/role_based_access.md)