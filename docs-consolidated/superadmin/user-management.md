# Superadmin User Management Guide

This guide covers the user management capabilities available to superadmins in the RadOrderPad API.

## Prerequisites

- You must have a superadmin role
- You must have a valid JWT token with superadmin privileges

## User Management Overview

Superadmins have extended capabilities for managing users, including:

1. Viewing all users in the system
2. Viewing detailed user information
3. Managing user status (activating/deactivating users)
4. Resetting user passwords
5. Verifying user emails
6. Impersonating users for troubleshooting (with strict controls and logging)

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
- `email`: Filter by user email
- `organizationId`: Filter by organization ID
- `role`: Filter by user role (admin_referring, admin_radiology, physician, admin_staff, radiologist, scheduler, super_admin)
- `isActive`: Filter by active status
- `emailVerified`: Filter by email verification status
- `createdAfter`: Filter by creation date (ISO date string)
- `createdBefore`: Filter by creation date (ISO date string)
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
- `first_name`: User first name
- `last_name`: User last name
- `role`: User role
- `is_active`: User active status
- `last_login`: Date and time of last login
- `created_at`: Date the user was created
- `email_verified`: Email verification status
- `npi`: National Provider Identifier (for physicians and radiologists)
- `specialty`: Medical specialty (for physicians and radiologists)
- `phone_number`: User phone number
- `organization_id`: ID of the user's organization
- `organization_name`: Name of the user's organization
- `organization_type`: Type of the user's organization

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
- `first_name`: User first name
- `last_name`: User last name
- `role`: User role
- `is_active`: User active status
- `last_login`: Date and time of last login
- `created_at`: Date the user was created
- `email_verified`: Email verification status
- `npi`: National Provider Identifier (for physicians and radiologists)
- `specialty`: Medical specialty (for physicians and radiologists)
- `phone_number`: User phone number
- `organization_id`: ID of the user's organization
- `organization_name`: Name of the user's organization
- `organization_type`: Type of the user's organization
- `assigned_locations`: Array of locations assigned to the user
- `activity_history`: Array of recent user activity
- `permissions`: Array of user permissions
- `preferences`: User preferences
- `profile_image_url`: URL of the user's profile image

## Managing User Status

### Update User Status

Update a user's active status:

```javascript
const updateUserStatus = async (token, userId, isActive, reason = '') => {
  try {
    const response = await fetch(`/api/superadmin/users/${userId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ isActive, reason })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to update user status:', error);
    throw error;
  }
};
```

The response will include:
- `id`: User ID
- `previousStatus`: Previous active status
- `newStatus`: New active status
- `updatedAt`: Date and time of the update

### Verify User Email

Manually verify a user's email:

```javascript
const verifyUserEmail = async (token, userId, notes = '') => {
  try {
    const response = await fetch(`/api/superadmin/users/${userId}/verify-email`, {
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
    console.error('Failed to verify user email:', error);
    throw error;
  }
};
```

The response will include:
- `id`: User ID
- `email`: User email
- `email_verified`: Email verification status (should be true)
- `updatedAt`: Date and time of the update

## User Password Management

### Reset User Password

Send a password reset link to a user:

```javascript
const resetUserPassword = async (token, userId, notes = '') => {
  try {
    const response = await fetch(`/api/superadmin/users/${userId}/reset-password`, {
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
    console.error('Failed to reset user password:', error);
    throw error;
  }
};
```

The response will include:
- `success`: Boolean indicating success
- `message`: Success message
- `resetLink`: Password reset link (if configured to return it)

## User Impersonation

### Impersonate User

Impersonate a user for troubleshooting purposes:

```javascript
const impersonateUser = async (token, userId, reason) => {
  try {
    const response = await fetch(`/api/superadmin/users/${userId}/impersonate`, {
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
    console.error('Failed to impersonate user:', error);
    throw error;
  }
};
```

The response will include:
- `token`: Impersonation token
- `expiresAt`: Expiration time of the impersonation token
- `impersonationId`: ID of the impersonation session (for audit purposes)

> **IMPORTANT**: User impersonation should be used with extreme caution and only for legitimate troubleshooting purposes. All impersonation actions are strictly logged and audited.

### End Impersonation

End an impersonation session:

```javascript
const endImpersonation = async (token, impersonationId, notes = '') => {
  try {
    const response = await fetch(`/api/superadmin/impersonation/${impersonationId}/end`, {
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
    console.error('Failed to end impersonation:', error);
    throw error;
  }
};
```

## User Activity Monitoring

### Get User Activity Log

Retrieve the activity log for a specific user:

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
- `search`: Search term for activity details

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

Retrieve the login history for a specific user:

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
- `success`: Whether the login was successful
- `ipAddress`: IP address from which the login was attempted
- `userAgent`: User agent information
- `device`: Device information
- `location`: Approximate location based on IP address
- `failureReason`: Reason for login failure (if applicable)

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
- `first_name`: User first name (required)
- `last_name`: User last name (required)
- `role`: User role (required)
- `organization_id`: ID of the user's organization (required)
- `is_active`: User active status (optional, default: true)
- `send_invite`: Whether to send an invitation email (optional, default: true)
- `npi`: National Provider Identifier (optional, required for physicians and radiologists)
- `specialty`: Medical specialty (optional, required for physicians and radiologists)
- `phone_number`: User phone number (optional)
- `assigned_locations`: Array of location IDs to assign to the user (optional)

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

## Error Handling

When working with superadmin user management endpoints, be prepared to handle these common errors:

- 400 Bad Request: Invalid input
- 401 Unauthorized: Missing or invalid authentication token
- 403 Forbidden: Insufficient permissions (non-superadmin role)
- 404 Not Found: User not found
- 409 Conflict: Conflict with existing data (e.g., email already in use)
- 422 Unprocessable Entity: Cannot perform the requested operation

## Best Practices

1. **Document all actions**: Always provide detailed notes for administrative actions
2. **Use appropriate status changes**: Choose the correct status change for each situation
3. **Verify user identities thoroughly**: Verify user identities before making changes
4. **Monitor user activity**: Regularly review user activity logs
5. **Handle password resets carefully**: Follow security best practices when resetting passwords
6. **Respect privacy**: Access user data only when necessary
7. **Use impersonation sparingly**: Only impersonate users when absolutely necessary for troubleshooting
8. **Maintain audit trail**: Ensure all administrative actions are properly logged
9. **Communicate changes**: Notify users of significant changes to their accounts
10. **Apply consistent policies**: Treat all users fairly and consistently