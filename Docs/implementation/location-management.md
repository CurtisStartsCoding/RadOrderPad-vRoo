# Location Management Implementation

This document describes the implementation details of the Location Management feature in the RadOrderPad application.

## Overview

The Location Management feature allows organization administrators to:

- View a list of all locations in their organization
- Add new locations
- Edit existing locations
- Deactivate locations

## Architecture

The Location Management feature follows a modular architecture with strict adherence to the Single Responsibility Principle (SRP). Each component, hook, and utility function has a single, well-defined responsibility.

### Directory Structure

```
client/src/features/location-management/
├── components/
│   ├── index.ts
│   ├── LocationTable.tsx
│   └── LocationFormDialog.tsx
├── hooks/
│   ├── index.ts
│   ├── useLocationList.ts
│   ├── useSaveLocation.ts
│   ├── useDeactivateLocation.ts
│   └── useLocationManagement.ts
├── types/
│   ├── index.ts
│   └── location-types.ts
├── utils/
│   ├── index.ts
│   └── format-utils.ts
├── index.ts
└── README.md
```

### Components

- **LocationTable**: Displays a table of locations with their details and actions.
- **LocationFormDialog**: A dialog for adding and editing locations.

### Hooks

- **useLocationList**: Handles fetching and filtering locations.
- **useSaveLocation**: Handles adding and updating locations.
- **useDeactivateLocation**: Handles deactivating locations.
- **useLocationManagement**: A composition hook that combines the other hooks and manages the dialog state.

### Types

- **Location**: Represents a location in the system.
- **LocationStatus**: Enum of possible location statuses.
- **CreateLocationRequest**: Request payload for creating a location.
- **UpdateLocationRequest**: Request payload for updating a location.
- **LocationFilterOptions**: Filters for the location list.
- **LocationSortOptions**: Sort options for the location list.

### Utilities

- **formatStatus**: Formats a status for display.
- **formatDate**: Formats a date for display.
- **formatDateWithTime**: Formats a date with time for display.
- **formatFullAddress**: Formats a full address for display.
- **formatPhoneNumber**: Formats a phone number for display.
- **getStatusBadgeVariant**: Gets the appropriate badge variant for a status.

## Implementation Details

### LocationTable Component

The LocationTable component displays a table of locations with their details and actions. It uses the Shadcn UI Table component for the table layout and the Badge component for displaying location statuses.

Key features:
- Displays location name, address, phone, status, and creation date
- Shows loading state when fetching locations
- Shows empty state when no locations are found
- Provides actions to edit and deactivate locations
- Uses the format utilities to format address, phone, date, and status

### LocationFormDialog Component

The LocationFormDialog component displays a dialog for adding and editing locations. It uses the Shadcn UI Dialog, Input, and Label components.

Key features:
- Form for entering location details (name, address, city, state, zip code, phone)
- Validation for required fields
- Shows loading state when submitting
- Supports both adding and editing modes

### useLocationList Hook

The useLocationList hook handles fetching and filtering locations. It uses React Query for data fetching.

Key features:
- Fetches locations with filtering and sorting
- Provides state and handlers for filtering and sorting
- Shows loading and error states

### useSaveLocation Hook

The useSaveLocation hook handles adding and updating locations. It uses React Query for mutations.

Key features:
- Provides mutations for adding and updating locations
- Shows loading and error states
- Shows toast notifications for success and error states

### useDeactivateLocation Hook

The useDeactivateLocation hook handles deactivating locations. It uses React Query for mutations.

Key features:
- Provides a mutation for deactivating locations
- Shows loading and error states
- Shows toast notifications for success and error states

### useLocationManagement Hook

The useLocationManagement hook is a composition hook that combines the other hooks and manages the dialog state.

Key features:
- Uses the individual hooks for fetching, saving, and deactivating locations
- Manages the dialog state for adding and editing locations
- Provides handlers for opening and closing dialogs
- Provides a handler for saving locations

## API Integration

The Location Management feature integrates with the following API endpoints:

- `GET /organizations/mine/locations`: Fetch locations with filtering and sorting
- `POST /organizations/mine/locations`: Add a new location
- `PUT /organizations/mine/locations/{locationId}`: Update a location
- `DELETE /organizations/mine/locations/{locationId}`: Deactivate a location

## Future Improvements

1. **Add Pagination**: Add pagination to the LocationTable component for better performance with large location lists.

2. **Add Search**: Add a search input to the LocationTable component for easier location finding.

3. **Add Filtering**: Add filtering options to the LocationTable component for filtering by status.

4. **Add Sorting**: Add sorting options to the LocationTable component for sorting by name, address, or creation date.

5. **Add Bulk Actions**: Add the ability to perform actions on multiple locations at once.

6. **Add Location Assignment**: Add the ability to assign users to locations.

## Conclusion

The Location Management feature provides a comprehensive set of tools for managing locations in the RadOrderPad application. It follows a modular architecture with strict adherence to the Single Responsibility Principle, making it easy to maintain and extend.