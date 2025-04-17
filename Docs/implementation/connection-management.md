# Connection Management Implementation

This document describes the implementation details of the Connection Management feature in the RadOrderPad application.

## Overview

The Connection Management feature allows organization administrators to:

- View a list of all connections with partner organizations
- View and respond to pending connection requests
- Request new connections with partner organizations
- Terminate existing connections

## Architecture

The Connection Management feature follows a modular architecture with strict adherence to the Single Responsibility Principle (SRP). Each component, hook, and utility function has a single, well-defined responsibility.

### Directory Structure

```
client/src/features/connection-management/
├── components/
│   ├── index.ts
│   ├── ConnectionList.tsx
│   ├── PendingRequestsList.tsx
│   ├── RequestConnectionButton.tsx
│   └── RequestConnectionModal.tsx
├── hooks/
│   ├── index.ts
│   └── useConnectionManagement.ts
├── types/
│   ├── index.ts
│   └── connection-types.ts
├── utils/
│   ├── index.ts
│   └── format-utils.ts
└── index.ts
```

### Page Component

```
client/apps/web/app/admin/connections/page.tsx
```

## Components

### ConnectionList

- **Single Responsibility**: Display a table of existing connections
- **Line Count**: 97 lines
- **Props**:
  - `connections`: Array of Connection objects
  - `isLoading`: Boolean indicating if connections are loading
  - `onTerminate`: Function to terminate a connection
  - `isTerminating`: Boolean indicating if a termination is in progress

### PendingRequestsList

- **Single Responsibility**: Display a table of pending connection requests
- **Line Count**: 80 lines
- **Props**:
  - `requests`: Array of ConnectionRequest objects
  - `isLoading`: Boolean indicating if requests are loading
  - `onApprove`: Function to approve a request
  - `onReject`: Function to reject a request
  - `isApproving`: Boolean indicating if an approval is in progress
  - `isRejecting`: Boolean indicating if a rejection is in progress

### RequestConnectionButton

- **Single Responsibility**: Render a button to open the request connection modal
- **Line Count**: 23 lines
- **Props**:
  - `onClick`: Function to open the modal

### RequestConnectionModal

- **Single Responsibility**: Provide UI for searching and requesting connections
- **Line Count**: 217 lines
- **Props**:
  - `open`: Boolean indicating if the modal is open
  - `onClose`: Function to close the modal
  - `onSearch`: Function to search for organizations
  - `onSelectOrganization`: Function to select an organization
  - `onRequestConnection`: Function to request a connection
  - `searchResults`: Array of search results
  - `selectedOrganization`: Currently selected organization
  - `isSearching`: Boolean indicating if a search is in progress
  - `isRequesting`: Boolean indicating if a request is in progress
  - `userOrganizationType`: Type of the user's organization

## Hooks

### useConnectionManagement

- **Single Responsibility**: Manage connection data and operations
- **Line Count**: 229 lines
- **Returns**:
  - Data: `connections`, `pendingRequests`, `searchResults`, `selectedOrganization`
  - Loading states: `isLoadingConnections`, `isLoadingPendingRequests`, `isSearching`, etc.
  - Error states: `isErrorConnections`, `isErrorPendingRequests`, `isErrorSearching`, etc.
  - Modal state: `isRequestModalOpen`
  - Actions: `approveConnection`, `rejectConnection`, `terminateConnection`, `requestConnection`
  - Modal handlers: `openRequestModal`, `closeRequestModal`
  - Search handlers: `handleSearch`, `handleSelectOrganization`
  - Refetch functions: `refetchConnections`, `refetchPendingRequests`, `searchOrganizations`

## Types

### Connection

Represents a connection between two organizations.

### ConnectionRequest

Represents a pending connection request from another organization.

### OrganizationSearchResult

Represents an organization found in a search.

### ConnectionStatus

Enum for the possible statuses of a connection:
- `PENDING`
- `ACTIVE`
- `REJECTED`
- `PURGATORY`
- `TERMINATED`

### OrganizationType

Enum for the types of organizations:
- `REFERRING_PRACTICE`
- `RADIOLOGY_GROUP`

## Utilities

### format-utils.ts

Contains utility functions for formatting data:
- `formatDate`: Format a date string for display
- `formatDateWithTime`: Format a date with time for display
- `formatStatus`: Format a connection status for display
- `getStatusBadgeVariant`: Get the appropriate badge variant for a status

## API Integration

The feature integrates with these API endpoints:
- `GET /connections`: Fetch existing connections
- `GET /connections/requests`: Fetch pending connection requests
- `POST /connections`: Request a new connection
- `POST /connections/{id}/approve`: Approve a connection request
- `POST /connections/{id}/reject`: Reject a connection request
- `DELETE /connections/{id}`: Terminate an active connection
- `GET /organizations`: Search for organizations

## User Flow

1. Admin navigates to the Connections page
2. Admin can view existing connections and pending requests
3. Admin can approve or reject pending requests
4. Admin can terminate active connections
5. Admin can request new connections by:
   - Clicking "Request Connection"
   - Searching for partner organizations
   - Selecting an organization
   - Adding optional notes
   - Submitting the request

## Future Enhancements

Potential future enhancements for the Connection Management feature:
- Filtering and sorting options for connections and requests
- Pagination for large lists of connections
- Detailed connection history view
- Connection request notifications
- Bulk actions for approving/rejecting multiple requests