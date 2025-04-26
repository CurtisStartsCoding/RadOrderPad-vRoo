# Superadmin User Management

This guide covers the user management capabilities available to superadmins in the RadOrderPad API.

## Prerequisites

- You must have a superadmin role
- You must have a valid JWT token with superadmin privileges

## Superadmin User Management Overview

Superadmins have extended capabilities for managing users across all organizations, including:

1. Viewing all users in the system
2. Creating new users
3. Updating user information
4. Managing user status
5. Resetting user passwords
6. Assigning and modifying user roles
7. Viewing user activity and audit logs
8. Managing user sessions

## Retrieving User Information

### List All Users

Retrieve a list of all users in the system:

```javascript
const getAllUsers = async (token, filters = {}, page = 1, limit = 20) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...filters
    }).toString();
    
    const response = await fetch(`/api/superadmin/users?${queryParams}`, {
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
    console.error('Failed to retrieve users:', error);
    throw error;
  }
};
```

The `filters` object can include:
- `status`: Filter by user status (active, inactive, pending, suspended)
- `role`: Filter by user role (admin, physician, staff, radiologist)
- `organizationId`: Filter by organization ID
- `createdAfter`: Filter by creation date (ISO date string)
- `createdBefore`: Filter by creation date (ISO date string)
- `search`: Search term for user name, email, or ID

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
- `status`: User status
- `role`: User role
- `organizationId`: ID of the user's organization
- `organizationName`: Name of the user's organization
- `createdAt`: Date the user was created
- `updatedAt`: Date the user was last updated
- `lastLoginAt`: Date of the user's last login

### Get User Details

Retrieve detailed information for a specific user:

```javascript
const getUserDetails = async (token, userId) => {
  try {
    const response = await fetch(`/api/superadmin/users/${userId}`, {
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
    console.error('Failed to retrieve user details:', error);
    throw error;
  }
};
```

The response will include all user information, including:
- `id`: User ID
- `email`: User email
- `firstName`: User first name
- `lastName`: User last name
- `status`: User status
- `role`: User role
- `specialty`: User medical specialty (for physicians)
- `phoneNumber`: User phone number
- `organizationId`: ID of the user's organization
- `organizationName`: Name of the user's organization
- `locations`: Array of locations the user is assigned to
- `permissions`: Array of user permissions
- `createdAt`: Date the user was created
- `updatedAt`: Date the user was last updated
- `lastLoginAt`: Date of the user's last login
- `lastLoginIp`: IP address of the user's last login
- `twoFactorEnabled`: Whether two-factor authentication is enabled
- `profileImageUrl`: URL of the user's profile image
- `activityMetrics`: Activity metrics
  - `totalOrders`: Total number of orders
  - `ordersLast30Days`: Orders in the last 30 days
  - `validationAccuracy`: Validation accuracy percentage
  - `averageResponseTime`: Average response time in seconds

## Creating and Updating Users

### Create a New User

Create a new user:

```javascript
const createUser = async (token, userData) => {
  try {
    const response = await fetch('/api/superadmin/users', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to create user:', error);
    throw error;
  }
};
```

The `userData` object should include:
- `email`: User email (required)
- `firstName`: User first name (required)
- `lastName`: User last name (required)
- `role`: User role (required)
- `organizationId`: ID of the user's organization (required)
- `specialty`: User medical specialty (required for physicians)
- `phoneNumber`: User phone number (optional)
- `sendInvite`: Whether to send an invitation email (optional, default: true)
- `locationIds`: Array of location IDs to assign the user to (optional)
- `customPermissions`: Array of custom permissions (optional)

### Update User Information

Update a user's information:

```javascript
const updateUser = async (token, userId, userData) => {
  try {
    const response = await fetch(`/api/superadmin/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to update user:', error);
    throw error;
  }
};
```

The `userData` object can include any of the fields mentioned in the create operation.

## Managing User Status

### Activate a User

Activate a user:

```javascript
const activateUser = async (token, userId, notes = '') => {
  try {
    const response = await fetch(`/api/superadmin/users/${userId}/activate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ notes })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to activate user:', error);
    throw error;
  }
};
```

### Deactivate a User

Deactivate a user:

```javascript
const deactivateUser = async (token, userId, reason, notes = '') => {
  try {
    const response = await fetch(`/api/superadmin/users/${userId}/deactivate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reason, notes })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to deactivate user:', error);
    throw error;
  }
};
```

### Suspend a User

Suspend a user:

```javascript
const suspendUser = async (token, userId, reason, suspensionPeriod, notes = '') => {
  try {
    const response = await fetch(`/api/superadmin/users/${userId}/suspend`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reason, suspensionPeriod, notes })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to suspend user:', error);
    throw error;
  }
};
```

The `suspensionPeriod` parameter specifies the suspension duration in days.

### Unsuspend a User

Remove the suspension from a user:

```javascript
const unsuspendUser = async (token, userId, notes = '') => {
  try {
    const response = await fetch(`/api/superadmin/users/${userId}/unsuspend`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ notes })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to unsuspend user:', error);
    throw error;
  }
};
```

## Managing User Roles and Permissions

### Update User Role

Update a user's role:

```javascript
const updateUserRole = async (token, userId, role, notes = '') => {
  try {
    const response = await fetch(`/api/superadmin/users/${userId}/role`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ role, notes })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to update user role:', error);
    throw error;
  }
};
```

### Update User Permissions

Update a user's custom permissions:

```javascript
const updateUserPermissions = async (token, userId, permissions, notes = '') => {
  try {
    const response = await fetch(`/api/superadmin/users/${userId}/permissions`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ permissions, notes })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to update user permissions:', error);
    throw error;
  }
};
```

The `permissions` parameter is an array of permission strings.

### Transfer User to Another Organization

Transfer a user to a different organization:

```javascript
const transferUser = async (token, userId, newOrganizationId, newRole, notes = '') => {
  try {
    const response = await fetch(`/api/superadmin/users/${userId}/transfer`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ newOrganizationId, newRole, notes })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to transfer user:', error);
    throw error;
  }
};
```

## Managing User Authentication

### Reset User Password

Reset a user's password:

```javascript
const resetUserPassword = async (token, userId, sendEmail = true, notes = '') => {
  try {
    const response = await fetch(`/api/superadmin/users/${userId}/reset-password`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sendEmail, notes })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to reset user password:', error);
    throw error;
  }
};
```

The response will include:
- `success`: Boolean indicating success
- `resetLink`: Password reset link (if sendEmail is false)

### Force Password Change

Force a user to change their password on next login:

```javascript
const forcePasswordChange = async (token, userId, notes = '') => {
  try {
    const response = await fetch(`/api/superadmin/users/${userId}/force-password-change`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ notes })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to force password change:', error);
    throw error;
  }
};
```

### Manage Two-Factor Authentication

Enable or disable two-factor authentication for a user:

```javascript
const manageTwoFactorAuth = async (token, userId, enabled, notes = '') => {
  try {
    const response = await fetch(`/api/superadmin/users/${userId}/two-factor`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ enabled, notes })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to manage two-factor authentication:', error);
    throw error;
  }
};
```

### Terminate User Sessions

Terminate all active sessions for a user:

```javascript
const terminateUserSessions = async (token, userId, notes = '') => {
  try {
    const response = await fetch(`/api/superadmin/users/${userId}/terminate-sessions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ notes })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to terminate user sessions:', error);
    throw error;
  }
};
```

## Viewing User Activity

### Get User Activity Log

Retrieve the activity log for a user:

```javascript
const getUserActivityLog = async (token, userId, filters = {}, page = 1, limit = 20) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...filters
    }).toString();
    
    const response = await fetch(`/api/superadmin/users/${userId}/activity-log?${queryParams}`, {
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
    console.error('Failed to retrieve user activity log:', error);
    throw error;
  }
};
```

The `filters` object can include:
- `activityType`: Filter by activity type
- `startDate`: Filter by start date
- `endDate`: Filter by end date

The response will include:
- `activities`: Array of activity records
- `pagination`: Pagination information

Each activity record includes:
- `id`: Activity ID
- `timestamp`: Activity timestamp
- `activityType`: Type of activity
- `details`: Activity details
- `ipAddress`: IP address from which the activity was performed
- `userAgent`: User agent information

### Get User Login History

Retrieve the login history for a user:

```javascript
const getUserLoginHistory = async (token, userId, page = 1, limit = 20) => {
  try {
    const response = await fetch(`/api/superadmin/users/${userId}/login-history?page=${page}&limit=${limit}`, {
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
    console.error('Failed to retrieve user login history:', error);
    throw error;
  }
};
```

The response will include:
- `logins`: Array of login records
- `pagination`: Pagination information

Each login record includes:
- `id`: Login ID
- `timestamp`: Login timestamp
- `ipAddress`: IP address
- `userAgent`: User agent information
- `deviceType`: Device type
- `location`: Geographic location (if available)
- `status`: Login status (success, failure)
- `failureReason`: Reason for failure (if applicable)

### Get User Sessions

Retrieve active sessions for a user:

```javascript
const getUserSessions = async (token, userId) => {
  try {
    const response = await fetch(`/api/superadmin/users/${userId}/sessions`, {
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
    console.error('Failed to retrieve user sessions:', error);
    throw error;
  }
};
```

The response will include an array of session records, each with:
- `id`: Session ID
- `createdAt`: Session creation timestamp
- `expiresAt`: Session expiration timestamp
- `lastActivityAt`: Last activity timestamp
- `ipAddress`: IP address
- `userAgent`: User agent information
- `deviceType`: Device type
- `location`: Geographic location (if available)

## Error Handling

When working with superadmin user management endpoints, be prepared to handle these common errors:

- 400 Bad Request: Invalid input
- 401 Unauthorized: Missing or invalid authentication token
- 403 Forbidden: Insufficient permissions (non-superadmin role)
- 404 Not Found: User not found
- 409 Conflict: Conflict with existing data
- 422 Unprocessable Entity: Cannot perform the requested operation

## Best Practices

1. **Document all actions**: Always provide detailed notes for administrative actions
2. **Use appropriate status changes**: Choose the correct status change for each situation
3. **Respect privacy**: Access user data only when necessary
4. **Follow security protocols**: Adhere to security best practices when resetting passwords
5. **Maintain audit trail**: Ensure all administrative actions are properly logged
6. **Communicate changes**: Notify users of significant changes to their accounts
7. **Apply consistent policies**: Treat all users fairly and consistently
8. **Monitor suspicious activity**: Watch for unusual login patterns or activities
9. **Verify identity**: Confirm user identity before making significant changes
10. **Use least privilege principle**: Assign only necessary permissions to users