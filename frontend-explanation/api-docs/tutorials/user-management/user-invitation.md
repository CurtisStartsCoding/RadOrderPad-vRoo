# User Invitation

This guide covers the process of inviting and onboarding new users to your organization in the RadOrderPad API.

## Prerequisites

- You must have an administrator role
- Your organization must be active
- You must have a valid JWT token

## User Invitation Flow

The user invitation flow consists of these steps:

1. Administrator sends an invitation to a new user
2. User receives an email with an invitation link
3. User completes registration by setting up their account
4. Administrator assigns locations and permissions to the new user

## Sending User Invitations

### Send a Single Invitation

Send an invitation to a single user:

```javascript
const sendUserInvitation = async (token, invitationData) => {
  try {
    const response = await fetch('/api/users/invitations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(invitationData)
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to send user invitation:', error);
    throw error;
  }
};
```

The `invitationData` object should include:
- `email`: Email address of the invitee (required)
- `firstName`: First name of the invitee (required)
- `lastName`: Last name of the invitee (required)
- `role`: Role to assign to the user (required)
- `specialty`: Medical specialty (required for physician role)
- `locationIds`: Array of location IDs to assign to the user (optional)
- `message`: Personalized message to include in the invitation (optional)
- `expiresIn`: Invitation expiration time in days (optional, default: 7)

Example:
```javascript
const invitationData = {
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'physician',
  specialty: 'CARDIOLOGY',
  locationIds: ['location-123', 'location-456'],
  message: 'Welcome to our organization! Please complete your registration.',
  expiresIn: 14
};
```

The response will include:
- `id`: Invitation ID
- `email`: Email address of the invitee
- `status`: Invitation status (sent)
- `expiresAt`: Expiration date and time
- `invitationLink`: Link that will be sent to the invitee

### Send Bulk Invitations

Send invitations to multiple users at once:

```javascript
const sendBulkInvitations = async (token, invitations) => {
  try {
    const response = await fetch('/api/users/invitations/bulk', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ invitations })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to send bulk invitations:', error);
    throw error;
  }
};
```

The `invitations` parameter is an array of invitation objects, each with the same structure as in the single invitation method.

The response will include:
- `successful`: Array of successfully sent invitations
- `failed`: Array of failed invitations with error reasons
- `summary`: Summary of the operation
  - `total`: Total number of invitations
  - `successful`: Number of successful invitations
  - `failed`: Number of failed invitations

## Managing Invitations

### List Pending Invitations

Retrieve a list of pending invitations:

```javascript
const listPendingInvitations = async (token, page = 1, limit = 20) => {
  try {
    const response = await fetch(`/api/users/invitations?status=pending&page=${page}&limit=${limit}`, {
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
    console.error('Failed to list pending invitations:', error);
    throw error;
  }
};
```

The response will include:
- `invitations`: Array of invitation records
- `pagination`: Pagination information
  - `currentPage`: Current page number
  - `totalPages`: Total number of pages
  - `totalItems`: Total number of invitations
  - `itemsPerPage`: Number of invitations per page

Each invitation record includes:
- `id`: Invitation ID
- `email`: Email address of the invitee
- `firstName`: First name of the invitee
- `lastName`: Last name of the invitee
- `role`: Role assigned to the user
- `specialty`: Medical specialty (for physician role)
- `status`: Invitation status
- `sentAt`: Date and time the invitation was sent
- `expiresAt`: Expiration date and time
- `sentBy`: User who sent the invitation

### Get Invitation Details

Retrieve details for a specific invitation:

```javascript
const getInvitationDetails = async (token, invitationId) => {
  try {
    const response = await fetch(`/api/users/invitations/${invitationId}`, {
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
    console.error('Failed to retrieve invitation details:', error);
    throw error;
  }
};
```

The response will include all invitation details, including:
- `id`: Invitation ID
- `email`: Email address of the invitee
- `firstName`: First name of the invitee
- `lastName`: Last name of the invitee
- `role`: Role assigned to the user
- `specialty`: Medical specialty (for physician role)
- `status`: Invitation status
- `message`: Personalized message included in the invitation
- `locationIds`: Array of location IDs assigned to the user
- `sentAt`: Date and time the invitation was sent
- `expiresAt`: Expiration date and time
- `sentBy`: User who sent the invitation
- `acceptedAt`: Date and time the invitation was accepted (if accepted)
- `canceledAt`: Date and time the invitation was canceled (if canceled)

### Cancel an Invitation

Cancel a pending invitation:

```javascript
const cancelInvitation = async (token, invitationId) => {
  try {
    const response = await fetch(`/api/users/invitations/${invitationId}/cancel`, {
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
    console.error('Failed to cancel invitation:', error);
    throw error;
  }
};
```

The response will include:
- `id`: Invitation ID
- `status`: Updated invitation status (canceled)
- `canceledAt`: Date and time the invitation was canceled

### Resend an Invitation

Resend an expired or pending invitation:

```javascript
const resendInvitation = async (token, invitationId, expiresIn = 7) => {
  try {
    const response = await fetch(`/api/users/invitations/${invitationId}/resend`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ expiresIn })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to resend invitation:', error);
    throw error;
  }
};
```

The response will include:
- `id`: Invitation ID
- `status`: Updated invitation status (sent)
- `sentAt`: New sent date and time
- `expiresAt`: New expiration date and time

## User Registration Process

### Complete Registration (User Side)

When a user receives an invitation, they will click on the invitation link in the email, which will take them to a registration page. The registration process typically includes:

1. Verifying the email address
2. Setting a password
3. Accepting terms and conditions
4. Setting up two-factor authentication (optional)

The registration endpoint is typically called by the frontend application:

```javascript
const completeRegistration = async (token, registrationData) => {
  try {
    const response = await fetch('/api/auth/complete-registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token,
        ...registrationData
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to complete registration:', error);
    throw error;
  }
};
```

The `token` parameter is the invitation token from the URL.

The `registrationData` object should include:
- `password`: User's chosen password
- `acceptTerms`: Boolean indicating acceptance of terms and conditions
- `setupTwoFactor`: Boolean indicating whether to set up two-factor authentication

### Verify Registration Status

Check the status of a user's registration:

```javascript
const checkRegistrationStatus = async (token, userId) => {
  try {
    const response = await fetch(`/api/users/${userId}/registration-status`, {
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
    console.error('Failed to check registration status:', error);
    throw error;
  }
};
```

The response will include:
- `userId`: User ID
- `status`: Registration status (pending, completed, expired)
- `completedAt`: Date and time registration was completed (if completed)
- `lastLoginAt`: Date and time of the user's last login (if any)

## Post-Registration Setup

### Assign Locations to User

After a user completes registration, you may need to assign them to specific locations:

```javascript
const assignUserToLocations = async (token, userId, locationIds) => {
  try {
    const response = await fetch(`/api/users/${userId}/locations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ locationIds })
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

The `locationIds` parameter is an array of location IDs.

### Set User Permissions

Set custom permissions for a user:

```javascript
const setUserPermissions = async (token, userId, permissions) => {
  try {
    const response = await fetch(`/api/users/${userId}/permissions`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ permissions })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to set user permissions:', error);
    throw error;
  }
};
```

The `permissions` parameter is an array of permission strings.

## Invitation Templates

### Get Invitation Templates

Retrieve available invitation email templates:

```javascript
const getInvitationTemplates = async (token) => {
  try {
    const response = await fetch('/api/users/invitations/templates', {
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
    console.error('Failed to retrieve invitation templates:', error);
    throw error;
  }
};
```

The response will include an array of template objects, each with:
- `id`: Template ID
- `name`: Template name
- `description`: Template description
- `subject`: Email subject line
- `previewText`: Email preview text
- `isDefault`: Whether this is the default template

### Preview Invitation Email

Preview an invitation email with specific data:

```javascript
const previewInvitationEmail = async (token, previewData) => {
  try {
    const response = await fetch('/api/users/invitations/preview', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(previewData)
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to preview invitation email:', error);
    throw error;
  }
};
```

The `previewData` object should include:
- `templateId`: ID of the template to use
- `email`: Email address of the invitee
- `firstName`: First name of the invitee
- `lastName`: Last name of the invitee
- `role`: Role to assign to the user
- `message`: Personalized message to include in the invitation

The response will include:
- `subject`: Email subject line
- `htmlContent`: HTML content of the email
- `textContent`: Plain text content of the email

## Bulk User Import

### Import Users from CSV

Import multiple users from a CSV file:

```javascript
const importUsersFromCsv = async (token, csvFile, options = {}) => {
  try {
    const formData = new FormData();
    formData.append('file', csvFile);
    
    if (options.sendInvitations !== undefined) {
      formData.append('sendInvitations', options.sendInvitations);
    }
    
    if (options.defaultRole) {
      formData.append('defaultRole', options.defaultRole);
    }
    
    if (options.defaultLocationIds) {
      formData.append('defaultLocationIds', JSON.stringify(options.defaultLocationIds));
    }
    
    const response = await fetch('/api/users/import', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to import users:', error);
    throw error;
  }
};
```

The CSV file should have the following columns:
- `email` (required): Email address
- `firstName` (required): First name
- `lastName` (required): Last name
- `role` (optional): User role (defaults to the defaultRole option)
- `specialty` (optional): Medical specialty (required for physician role)
- `phoneNumber` (optional): Phone number
- `locations` (optional): Comma-separated list of location IDs

The response will include:
- `importId`: Import operation ID
- `totalRows`: Total number of rows in the CSV
- `validRows`: Number of valid rows
- `invalidRows`: Number of invalid rows
- `importedUsers`: Array of imported user records
- `errors`: Array of error records for invalid rows
- `invitationsSent`: Number of invitations sent (if sendInvitations is true)

### Get Import Status

Check the status of a bulk import operation:

```javascript
const getImportStatus = async (token, importId) => {
  try {
    const response = await fetch(`/api/users/import/${importId}`, {
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
    console.error('Failed to get import status:', error);
    throw error;
  }
};
```

The response will include:
- `importId`: Import operation ID
- `status`: Import status (processing, completed, failed)
- `progress`: Progress percentage
- `totalRows`: Total number of rows in the CSV
- `processedRows`: Number of processed rows
- `validRows`: Number of valid rows
- `invalidRows`: Number of invalid rows
- `importedUsers`: Array of imported user records
- `errors`: Array of error records for invalid rows
- `invitationsSent`: Number of invitations sent

## Error Handling

When working with user invitation endpoints, be prepared to handle these common errors:

- 400 Bad Request: Invalid input
- 401 Unauthorized: Missing or invalid authentication token
- 403 Forbidden: Insufficient permissions (non-admin role)
- 404 Not Found: Invitation not found
- 409 Conflict: Email already in use
- 410 Gone: Invitation expired or already used
- 422 Unprocessable Entity: Invalid data format

## Best Practices

1. **Use descriptive invitation messages**: Provide clear context in invitation messages
2. **Set appropriate expiration times**: Balance security with user convenience
3. **Follow up on pending invitations**: Regularly check for and follow up on pending invitations
4. **Use bulk import for large user groups**: Save time with CSV imports for many users
5. **Assign appropriate roles**: Give users the minimum necessary permissions
6. **Organize users by location**: Assign users to relevant locations
7. **Customize invitation templates**: Tailor invitation emails to your organization
8. **Preview invitations before sending**: Check how invitations will appear to recipients
9. **Monitor invitation acceptance rates**: Track which invitations are being accepted
10. **Document user onboarding process**: Maintain documentation for administrators