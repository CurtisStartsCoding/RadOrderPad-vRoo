# Location Assignment

This guide covers the process of assigning users to locations in the RadOrderPad API, which enables organizations to manage which users have access to which physical locations.

## Prerequisites

- You must have an administrator role
- Your organization must be active
- You must have a valid JWT token

## Location Assignment Overview

Location assignment in RadOrderPad allows organizations to:

1. Control which users can access which physical locations
2. Restrict user access to patient data based on location
3. Organize staff by location for scheduling and management
4. Configure location-specific settings and workflows

## Retrieving Location Assignments

### Get User's Assigned Locations

Retrieve the locations assigned to a specific user:

```javascript
const getUserLocations = async (token, userId) => {
  try {
    const response = await fetch(`/api/users/${userId}/locations`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to retrieve user locations:', error);
    throw error;
  }
};
```

The response will include:
- `locations`: Array of location records
- `isPrimaryLocationAssigned`: Boolean indicating whether a primary location is assigned

Each location record includes:
- `id`: Location ID
- `name`: Location name
- `address`: Location address
- `isPrimary`: Whether this is the user's primary location
- `assignedAt`: Date the location was assigned to the user
- `assignedBy`: User who assigned the location

### Get Your Own Assigned Locations

Retrieve your own assigned locations:

```javascript
const getMyLocations = async (token) => {
  try {
    const response = await fetch('/api/users/me/locations', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to retrieve my locations:', error);
    throw error;
  }
};
```

### Get Users Assigned to a Location

Retrieve users assigned to a specific location:

```javascript
const getLocationUsers = async (token, locationId, filters = {}, page = 1, limit = 20) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...filters
    }).toString();
    
    const response = await fetch(`/api/locations/${locationId}/users?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to retrieve location users:', error);
    throw error;
  }
};
```

The `filters` object can include:
- `role`: Filter by user role
- `status`: Filter by user status
- `search`: Search term for user name or email

The response will include:
- `users`: Array of user records
- `pagination`: Pagination information
  - `currentPage`: Current page number
  - `totalPages`: Total number of pages
  - `totalItems`: Total number of users
  - `itemsPerPage`: Number of users per page

Each user record includes:
- `id`: User ID
- `email`: User email
- `firstName`: User first name
- `lastName`: User last name
- `role`: User role
- `status`: User status
- `isPrimaryLocation`: Whether this is the user's primary location
- `assignedAt`: Date the location was assigned to the user
- `assignedBy`: User who assigned the location

## Managing Location Assignments

### Assign User to Locations

Assign a user to one or more locations:

```javascript
const assignUserToLocations = async (token, userId, locationAssignments) => {
  try {
    const response = await fetch(`/api/users/${userId}/locations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ locationAssignments })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to assign user to locations:', error);
    throw error;
  }
};
```

The `locationAssignments` parameter is an array of location assignment objects:
```javascript
const locationAssignments = [
  {
    locationId: 'location-123',
    isPrimary: true
  },
  {
    locationId: 'location-456',
    isPrimary: false
  }
];
```

The response will include:
- `successful`: Array of successful location assignments
- `failed`: Array of failed location assignments with error reasons
- `summary`: Summary of the operation
  - `total`: Total number of assignments
  - `successful`: Number of successful assignments
  - `failed`: Number of failed assignments

### Update User's Primary Location

Update a user's primary location:

```javascript
const updateUserPrimaryLocation = async (token, userId, locationId) => {
  try {
    const response = await fetch(`/api/users/${userId}/locations/primary`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ locationId })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to update primary location:', error);
    throw error;
  }
};
```

The response will include:
- `userId`: User ID
- `locationId`: Location ID
- `isPrimary`: Boolean indicating that this is now the primary location
- `updatedAt`: Date and time of the update

### Remove User from Location

Remove a user from a specific location:

```javascript
const removeUserFromLocation = async (token, userId, locationId) => {
  try {
    const response = await fetch(`/api/users/${userId}/locations/${locationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to remove user from location:', error);
    throw error;
  }
};
```

The response will include:
- `userId`: User ID
- `locationId`: Location ID
- `removedAt`: Date and time of the removal

### Remove User from All Locations

Remove a user from all assigned locations:

```javascript
const removeUserFromAllLocations = async (token, userId) => {
  try {
    const response = await fetch(`/api/users/${userId}/locations`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to remove user from all locations:', error);
    throw error;
  }
};
```

The response will include:
- `userId`: User ID
- `removedLocations`: Array of removed location IDs
- `removedAt`: Date and time of the removal

## Bulk Location Assignment

### Assign Multiple Users to a Location

Assign multiple users to a specific location:

```javascript
const assignUsersToLocation = async (token, locationId, userIds, isPrimary = false) => {
  try {
    const response = await fetch(`/api/locations/${locationId}/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userIds,
        isPrimary
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to assign users to location:', error);
    throw error;
  }
};
```

The `userIds` parameter is an array of user IDs.

The response will include:
- `successful`: Array of successful user assignments
- `failed`: Array of failed user assignments with error reasons
- `summary`: Summary of the operation
  - `total`: Total number of assignments
  - `successful`: Number of successful assignments
  - `failed`: Number of failed assignments

### Remove Multiple Users from a Location

Remove multiple users from a specific location:

```javascript
const removeUsersFromLocation = async (token, locationId, userIds) => {
  try {
    const response = await fetch(`/api/locations/${locationId}/users/remove`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userIds })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to remove users from location:', error);
    throw error;
  }
};
```

The `userIds` parameter is an array of user IDs.

The response will include:
- `successful`: Array of successfully removed user IDs
- `failed`: Array of failed removals with error reasons
- `summary`: Summary of the operation
  - `total`: Total number of removal attempts
  - `successful`: Number of successful removals
  - `failed`: Number of failed removals

## Location Assignment During User Creation

### Create User with Location Assignments

When creating a new user, you can assign them to locations in the same operation:

```javascript
const createUserWithLocations = async (token, userData, locationAssignments) => {
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...userData,
        locationAssignments
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to create user with locations:', error);
    throw error;
  }
};
```

The `userData` object should include:
- `email`: User email (required)
- `firstName`: User first name (required)
- `lastName`: User last name (required)
- `role`: User role (required)
- `specialty`: Medical specialty (required for physician role)
- `phoneNumber`: User phone number (optional)

The `locationAssignments` parameter is an array of location assignment objects, as shown in the assignUserToLocations method.

### Include Location Assignments in User Invitation

When sending a user invitation, you can include location assignments:

```javascript
const sendInvitationWithLocations = async (token, invitationData, locationAssignments) => {
  try {
    const response = await fetch('/api/users/invitations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...invitationData,
        locationAssignments
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to send invitation with locations:', error);
    throw error;
  }
};
```

The `invitationData` object should include the same fields as in the sendUserInvitation method.

The `locationAssignments` parameter is an array of location assignment objects, as shown in the assignUserToLocations method.

## Location-Based Access Control

### Get User's Location Access

Retrieve information about a user's access to a specific location:

```javascript
const getUserLocationAccess = async (token, userId, locationId) => {
  try {
    const response = await fetch(`/api/users/${userId}/locations/${locationId}/access`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to retrieve user location access:', error);
    throw error;
  }
};
```

The response will include:
- `userId`: User ID
- `locationId`: Location ID
- `hasAccess`: Boolean indicating whether the user has access to the location
- `isPrimary`: Boolean indicating whether this is the user's primary location
- `assignedAt`: Date the location was assigned to the user
- `assignedBy`: User who assigned the location
- `accessDetails`: Additional access details
  - `canViewPatients`: Whether the user can view patients at this location
  - `canCreateOrders`: Whether the user can create orders at this location
  - `canViewReports`: Whether the user can view reports at this location
  - `canManageUsers`: Whether the user can manage users at this location

### Update User's Location Access

Update a user's access settings for a specific location:

```javascript
const updateUserLocationAccess = async (token, userId, locationId, accessSettings) => {
  try {
    const response = await fetch(`/api/users/${userId}/locations/${locationId}/access`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(accessSettings)
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to update user location access:', error);
    throw error;
  }
};
```

The `accessSettings` object can include:
```javascript
const accessSettings = {
  canViewPatients: true,
  canCreateOrders: true,
  canViewReports: true,
  canManageUsers: false
};
```

## Location Assignment Audit

### Get Location Assignment History

Retrieve the history of location assignments for a user:

```javascript
const getLocationAssignmentHistory = async (token, userId, page = 1, limit = 20) => {
  try {
    const response = await fetch(`/api/users/${userId}/locations/history?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to retrieve location assignment history:', error);
    throw error;
  }
};
```

The response will include:
- `history`: Array of history records
- `pagination`: Pagination information

Each history record includes:
- `id`: History record ID
- `userId`: User ID
- `locationId`: Location ID
- `locationName`: Location name
- `action`: Action performed (assigned, removed, set_primary)
- `timestamp`: Date and time of the action
- `performedBy`: User who performed the action
- `reason`: Reason for the action (if provided)

## Error Handling

When working with location assignment endpoints, be prepared to handle these common errors:

- 400 Bad Request: Invalid input
- 401 Unauthorized: Missing or invalid authentication token
- 403 Forbidden: Insufficient permissions (non-admin role)
- 404 Not Found: User or location not found
- 409 Conflict: User already assigned to location
- 422 Unprocessable Entity: Cannot perform the requested operation

## Best Practices

1. **Assign users to appropriate locations**: Only assign users to locations they need access to
2. **Set a primary location**: Ensure each user has a primary location
3. **Regularly review location assignments**: Periodically audit and update location assignments
4. **Use bulk operations for efficiency**: Use bulk assignment methods for multiple users
5. **Document location assignment policies**: Maintain documentation of assignment procedures
6. **Consider access control needs**: Configure location-specific access settings
7. **Assign locations during user creation**: Include location assignments when creating users
8. **Maintain assignment history**: Keep records of location assignment changes
9. **Remove unnecessary assignments**: Remove users from locations they no longer need access to
10. **Coordinate with organization structure**: Align location assignments with organizational hierarchy