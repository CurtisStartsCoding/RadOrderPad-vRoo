# Location Service Refactoring

## Overview

The location service has been refactored following the extreme refactoring principles. The monolithic `location.service.ts` file (366 lines) has been broken down into smaller, more focused modules with a clear separation of concerns.

## Directory Structure

```
src/services/location/
├── queries/                  # SQL queries organized by functionality
│   ├── list/                 # Queries for listing locations
│   ├── create/               # Queries for creating locations
│   ├── get/                  # Queries for retrieving locations
│   ├── update/               # Queries for updating locations
│   ├── deactivate/           # Queries for deactivating locations
│   ├── user/                 # Queries for user-location operations
│   └── index.ts              # Exports all queries
├── services/                 # Service layer that uses queries
│   ├── list-locations.ts
│   ├── create-location.ts
│   ├── get-location.ts
│   ├── update-location.ts
│   ├── deactivate-location.ts
│   ├── user-location-management.ts
│   └── index.ts              # Exports all services
├── manager/                  # Manager layer that uses services
│   ├── location-manager.ts
│   ├── user-location-manager.ts
│   └── index.ts              # Exports all managers
├── types.ts                  # Type definitions
└── index.ts                  # Main entry point
```

## Refactoring Approach

1. **SQL Query Extraction**: All SQL queries have been extracted into separate files organized by functionality.
2. **Service Layer**: A service layer has been created to handle business logic and use the queries.
3. **Manager Layer**: A manager layer has been created to provide a clean API for controllers.
4. **Type Definitions**: Type definitions have been centralized in a single file.

## Benefits

- **Improved Maintainability**: Smaller, focused files are easier to understand and maintain.
- **Better Organization**: Clear separation of concerns with a logical directory structure.
- **Enhanced Testability**: Each component can be tested in isolation.
- **Easier Collaboration**: Multiple developers can work on different parts of the service without conflicts.
- **Simplified Debugging**: Issues can be traced to specific components more easily.

## Usage

The refactored location service can be used in the same way as before:

```typescript
import { locationManager, userLocationManager } from './services/location';

// Location operations
const locations = await locationManager.listLocations(orgId);
const location = await locationManager.getLocation(locationId, orgId);
const newLocation = await locationManager.createLocation(orgId, locationData);
const updatedLocation = await locationManager.updateLocation(locationId, orgId, locationData);
const success = await locationManager.deactivateLocation(locationId, orgId);

// User-location operations
const userLocations = await userLocationManager.listUserLocations(userId, orgId);
const assigned = await userLocationManager.assignUserToLocation(userId, locationId, orgId);
const unassigned = await userLocationManager.unassignUserFromLocation(userId, locationId, orgId);
```

Individual functions can also be imported directly:

```typescript
import { 
  listLocations, 
  createLocation,
  getLocation,
  updateLocation,
  deactivateLocation,
  listUserLocations,
  assignUserToLocation,
  unassignUserFromLocation
} from './services/location';