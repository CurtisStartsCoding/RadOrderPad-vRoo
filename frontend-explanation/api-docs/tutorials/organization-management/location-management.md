# Location Management

This guide covers the management of organization locations in the RadOrderPad API, including creating, retrieving, updating, and deleting location information.

## Prerequisites

- You must have an administrator role
- Your organization must be active
- You must have a valid JWT token

## Location Management Overview

Organizations in RadOrderPad can have multiple physical locations, each with its own:

1. Address and contact information
2. Operating hours
3. Available services
4. Assigned staff members
5. Specific settings and configurations

## Retrieving Location Information

### List All Locations

Retrieve all locations for your organization:

```javascript
const getAllLocations = async (token, page = 1, limit = 20) => {
  try {
    const response = await fetch(`/api/organizations/mine/locations?page=${page}&limit=${limit}`, {
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
    console.error('Failed to retrieve locations:', error);
    throw error;
  }
};
```

The response will include:
- `locations`: Array of location records
- `pagination`: Pagination information
  - `currentPage`: Current page number
  - `totalPages`: Total number of pages
  - `totalItems`: Total number of locations
  - `itemsPerPage`: Number of locations per page

Each location record includes:
- `id`: Location ID
- `name`: Location name
- `status`: Location status (active, inactive)
- `isPrimary`: Whether this is the primary location
- `address`: Location address
  - `street1`: Street address line 1
  - `street2`: Street address line 2 (optional)
  - `city`: City
  - `state`: State/province
  - `zipCode`: ZIP/postal code
  - `country`: Country
- `contactInfo`: Contact information
  - `phone`: Location phone number
  - `fax`: Location fax number
  - `email`: Location email
- `createdAt`: Date the location was created
- `updatedAt`: Date the location was last updated

### Get Location Details

Retrieve detailed information for a specific location:

```javascript
const getLocationDetails = async (token, locationId) => {
  try {
    const response = await fetch(`/api/organizations/mine/locations/${locationId}`, {
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
    console.error('Failed to retrieve location details:', error);
    throw error;
  }
};
```

The response will include all location information:
- `id`: Location ID
- `name`: Location name
- `status`: Location status
- `isPrimary`: Whether this is the primary location
- `address`: Location address
- `contactInfo`: Contact information
- `operatingHours`: Operating hours
  - `monday`: Monday hours (e.g., "9:00-17:00" or "Closed")
  - `tuesday`: Tuesday hours
  - `wednesday`: Wednesday hours
  - `thursday`: Thursday hours
  - `friday`: Friday hours
  - `saturday`: Saturday hours
  - `sunday`: Sunday hours
  - `holidays`: Holiday schedule
- `services`: Available services at this location
  - Array of service objects with:
    - `serviceType`: Type of service
    - `availability`: Availability information
    - `specialInstructions`: Special instructions
- `assignedUsers`: Users assigned to this location
  - Array of user IDs and roles
- `settings`: Location-specific settings
  - `defaultLanguage`: Default language
  - `timeZone`: Time zone
  - `notificationPreferences`: Notification settings
- `metadata`: Additional metadata
  - `parkingInfo`: Parking information
  - `directions`: Directions to the location
  - `accessibilityFeatures`: Accessibility features
- `createdAt`: Date the location was created
- `updatedAt`: Date the location was last updated

## Creating and Updating Locations

### Create a New Location

Create a new location for your organization:

```javascript
const createLocation = async (token, locationData) => {
  try {
    const response = await fetch('/api/organizations/mine/locations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(locationData)
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to create location:', error);
    throw error;
  }
};
```

The `locationData` object should include:
- `name`: Location name (required)
- `address`: Location address (required)
  - `street1`: Street address line 1 (required)
  - `street2`: Street address line 2 (optional)
  - `city`: City (required)
  - `state`: State/province (required)
  - `zipCode`: ZIP/postal code (required)
  - `country`: Country (required)
- `contactInfo`: Contact information (required)
  - `phone`: Location phone number (required)
  - `fax`: Location fax number (optional)
  - `email`: Location email (optional)
- `isPrimary`: Whether this is the primary location (optional, default: false)
- `operatingHours`: Operating hours (optional)
- `services`: Available services (optional)
- `settings`: Location-specific settings (optional)
- `metadata`: Additional metadata (optional)

### Update a Location

Update an existing location:

```javascript
const updateLocation = async (token, locationId, locationData) => {
  try {
    const response = await fetch(`/api/organizations/mine/locations/${locationId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(locationData)
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to update location:', error);
    throw error;
  }
};
```

The `locationData` object can include any of the fields mentioned in the create operation.

### Set Primary Location

Set a location as the primary location:

```javascript
const setPrimaryLocation = async (token, locationId) => {
  try {
    const response = await fetch(`/api/organizations/mine/locations/${locationId}/set-primary`, {
      method: 'POST',
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
    console.error('Failed to set primary location:', error);
    throw error;
  }
};
```

## Managing Location Services

### Update Location Services

Update the services available at a location:

```javascript
const updateLocationServices = async (token, locationId, services) => {
  try {
    const response = await fetch(`/api/organizations/mine/locations/${locationId}/services`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ services })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to update location services:', error);
    throw error;
  }
};
```

The `services` parameter is an array of service objects:
```javascript
const services = [
  {
    serviceType: 'CT_SCAN',
    availability: 'Monday-Friday, 9:00-17:00',
    specialInstructions: 'Please arrive 15 minutes early for preparation.'
  },
  {
    serviceType: 'MRI',
    availability: 'Monday-Friday, 9:00-17:00',
    specialInstructions: 'Please remove all metal objects before the procedure.'
  },
  {
    serviceType: 'X_RAY',
    availability: 'Monday-Saturday, 8:00-20:00',
    specialInstructions: ''
  }
];
```

### Get Available Services

Retrieve the services available at a location:

```javascript
const getLocationServices = async (token, locationId) => {
  try {
    const response = await fetch(`/api/organizations/mine/locations/${locationId}/services`, {
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
    console.error('Failed to retrieve location services:', error);
    throw error;
  }
};
```

## Managing Operating Hours

### Update Operating Hours

Update the operating hours for a location:

```javascript
const updateOperatingHours = async (token, locationId, operatingHours) => {
  try {
    const response = await fetch(`/api/organizations/mine/locations/${locationId}/operating-hours`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ operatingHours })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to update operating hours:', error);
    throw error;
  }
};
```

The `operatingHours` object should include:
```javascript
const operatingHours = {
  monday: '9:00-17:00',
  tuesday: '9:00-17:00',
  wednesday: '9:00-17:00',
  thursday: '9:00-17:00',
  friday: '9:00-17:00',
  saturday: 'Closed',
  sunday: 'Closed',
  holidays: 'Closed on all federal holidays'
};
```

## Managing User Assignments

### Assign Users to Location

Assign users to a location:

```javascript
const assignUsersToLocation = async (token, locationId, userIds) => {
  try {
    const response = await fetch(`/api/organizations/mine/locations/${locationId}/assign-users`, {
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
    console.error('Failed to assign users to location:', error);
    throw error;
  }
};
```

The `userIds` parameter is an array of user IDs:
```javascript
const userIds = ['user-123', 'user-456', 'user-789'];
```

### Remove Users from Location

Remove users from a location:

```javascript
const removeUsersFromLocation = async (token, locationId, userIds) => {
  try {
    const response = await fetch(`/api/organizations/mine/locations/${locationId}/remove-users`, {
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

### Get Users Assigned to Location

Retrieve users assigned to a location:

```javascript
const getLocationUsers = async (token, locationId, page = 1, limit = 20) => {
  try {
    const response = await fetch(`/api/organizations/mine/locations/${locationId}/users?page=${page}&limit=${limit}`, {
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

## Deactivating and Reactivating Locations

### Deactivate a Location

Deactivate a location:

```javascript
const deactivateLocation = async (token, locationId, reason) => {
  try {
    const response = await fetch(`/api/organizations/mine/locations/${locationId}/deactivate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reason })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to deactivate location:', error);
    throw error;
  }
};
```

### Reactivate a Location

Reactivate a location:

```javascript
const reactivateLocation = async (token, locationId) => {
  try {
    const response = await fetch(`/api/organizations/mine/locations/${locationId}/reactivate`, {
      method: 'POST',
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
    console.error('Failed to reactivate location:', error);
    throw error;
  }
};
```

## Deleting Locations

### Delete a Location

Delete a location:

```javascript
const deleteLocation = async (token, locationId) => {
  try {
    const response = await fetch(`/api/organizations/mine/locations/${locationId}`, {
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
    console.error('Failed to delete location:', error);
    throw error;
  }
};
```

Note: You cannot delete a location if:
- It is the primary location
- It has active users assigned to it
- It has active orders associated with it

## Location Metadata Management

### Update Location Metadata

Update metadata for a location:

```javascript
const updateLocationMetadata = async (token, locationId, metadata) => {
  try {
    const response = await fetch(`/api/organizations/mine/locations/${locationId}/metadata`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ metadata })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to update location metadata:', error);
    throw error;
  }
};
```

The `metadata` object can include:
```javascript
const metadata = {
  parkingInfo: 'Free parking available in the rear lot',
  directions: 'Located on the corner of Main St and Oak Ave',
  accessibilityFeatures: 'Wheelchair ramps, elevator access',
  nearbyLandmarks: 'Across from Central Park',
  publicTransportation: 'Bus routes 10, 15, and 22 stop nearby'
};
```

## Error Handling

When working with location management endpoints, be prepared to handle these common errors:

- 400 Bad Request: Invalid input
- 401 Unauthorized: Missing or invalid authentication token
- 403 Forbidden: Insufficient permissions (non-admin role)
- 404 Not Found: Location not found
- 409 Conflict: Conflict with existing data (e.g., duplicate name)
- 422 Unprocessable Entity: Cannot perform the requested operation (e.g., delete primary location)

## Best Practices

1. **Create a primary location first**: Always set up a primary location for your organization
2. **Provide complete address information**: Include all address components for proper mapping
3. **Set accurate operating hours**: Keep operating hours up-to-date for patient scheduling
4. **Assign appropriate services**: Only list services that are actually available at each location
5. **Manage user assignments**: Keep user assignments current as staff changes occur
6. **Use location-specific settings**: Configure settings appropriate for each location
7. **Include helpful metadata**: Add parking, directions, and accessibility information
8. **Maintain active status**: Deactivate locations that are temporarily closed
9. **Delete with caution**: Only delete locations that will never be used again
10. **Regularly review locations**: Periodically review and update location information