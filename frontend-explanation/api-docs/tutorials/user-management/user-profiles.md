# User Profiles Management

This guide covers the management of user profiles in the RadOrderPad API, including retrieving, updating, and deleting user information.

## Prerequisites

- You must have a valid JWT token
- Your organization must be active
- You must have appropriate permissions for user management

## User Profile Overview

User profiles in RadOrderPad contain essential information about users, including:

1. Basic Information: Name, email, role
2. Contact Information: Phone number, address
3. Professional Information: Specialty, credentials
4. Account Settings: Notification preferences, UI settings
5. Security Settings: Password, two-factor authentication

## Retrieving User Information

### Get Your Own User Profile

Retrieve your own user profile:

```javascript
const getMyProfile = async (token) => {
  try {
    const response = await fetch('/api/users/me', {
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
    console.error('Failed to retrieve user profile:', error);
    throw error;
  }
};
```

The response will include:
- `id`: User ID
- `email`: User email
- `firstName`: User first name
- `lastName`: User last name
- `role`: User role
- `status`: User status
- `phoneNumber`: User phone number
- `specialty`: User medical specialty (for physicians)
- `organization`: Basic organization information
- `locations`: Array of assigned locations
- `profileImageUrl`: URL to the user's profile image
- `settings`: User settings
  - `notificationPreferences`: Notification preferences
  - `uiPreferences`: UI preferences
  - `language`: Preferred language
  - `timeZone`: Preferred time zone
- `createdAt`: Date the user was created
- `lastLoginAt`: Date of the user's last login

### Get User by ID (Admin Only)

Retrieve a user profile by ID (requires admin role):

```javascript
const getUserById = async (token, userId) => {
  try {
    const response = await fetch(`/api/users/${userId}`, {
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
    console.error('Failed to retrieve user:', error);
    throw error;
  }
};
```

### List Users in Your Organization (Admin Only)

Retrieve a list of users in your organization (requires admin role):

```javascript
const listOrganizationUsers = async (token, filters = {}, page = 1, limit = 20) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...filters
    }).toString();
    
    const response = await fetch(`/api/users?${queryParams}`, {
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
    console.error('Failed to list users:', error);
    throw error;
  }
};
```

The `filters` object can include:
- `status`: Filter by user status (active, inactive, pending)
- `role`: Filter by user role (admin, physician, staff, radiologist)
- `locationId`: Filter by assigned location
- `search`: Search term for user name or email

The response will include:
- `users`: Array of user records
- `pagination`: Pagination information
  - `currentPage`: Current page number
  - `totalPages`: Total number of pages
  - `totalItems`: Total number of users
  - `itemsPerPage`: Number of users per page

## Updating User Information

### Update Your Own Profile

Update your own user profile:

```javascript
const updateMyProfile = async (token, profileData) => {
  try {
    const response = await fetch('/api/users/me', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileData)
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to update profile:', error);
    throw error;
  }
};
```

The `profileData` object can include:
- `firstName`: First name
- `lastName`: Last name
- `phoneNumber`: Phone number
- `specialty`: Medical specialty (for physicians)
- `settings`: User settings
  - `notificationPreferences`: Notification preferences
  - `uiPreferences`: UI preferences
  - `language`: Preferred language
  - `timeZone`: Preferred time zone

### Update User Profile (Admin Only)

Update a user's profile (requires admin role):

```javascript
const updateUserProfile = async (token, userId, profileData) => {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileData)
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to update user profile:', error);
    throw error;
  }
};
```

The `profileData` object can include the same fields as in the updateMyProfile method, plus:
- `role`: User role
- `status`: User status

### Change User Status (Admin Only)

Change a user's status (requires admin role):

```javascript
const changeUserStatus = async (token, userId, status, reason = '') => {
  try {
    const response = await fetch(`/api/users/${userId}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status,
        reason
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to change user status:', error);
    throw error;
  }
};
```

The `status` parameter can be one of:
- `active`: Activate the user
- `inactive`: Deactivate the user

## Managing Profile Images

### Upload Profile Image

Upload a profile image:

```javascript
const uploadProfileImage = async (token, imageFile) => {
  try {
    // First, get a presigned URL for the image upload
    const presignedUrlResponse = await fetch('/api/users/me/profile-image-upload-url', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!presignedUrlResponse.ok) {
      throw new Error(`Error: ${presignedUrlResponse.status}`);
    }
    
    const presignedData = await presignedUrlResponse.json();
    
    // Upload the image to the presigned URL
    const uploadResponse = await fetch(presignedData.data.presignedUrl, {
      method: 'PUT',
      body: imageFile,
      headers: {
        'Content-Type': imageFile.type
      }
    });
    
    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadResponse.status}`);
    }
    
    // Confirm the image upload
    const confirmResponse = await fetch('/api/users/me/profile-image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fileKey: presignedData.data.fileKey
      })
    });
    
    if (!confirmResponse.ok) {
      throw new Error(`Error: ${confirmResponse.status}`);
    }
    
    const data = await confirmResponse.json();
    return data.data;
  } catch (error) {
    console.error('Failed to upload profile image:', error);
    throw error;
  }
};
```

The response will include:
- `profileImageUrl`: URL for the uploaded profile image
- `thumbnailUrl`: URL for a thumbnail version of the profile image
- `uploadDate`: Date the image was uploaded

### Remove Profile Image

Remove your profile image:

```javascript
const removeProfileImage = async (token) => {
  try {
    const response = await fetch('/api/users/me/profile-image', {
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
    console.error('Failed to remove profile image:', error);
    throw error;
  }
};
```

## Managing User Settings

### Update Notification Preferences

Update your notification preferences:

```javascript
const updateNotificationPreferences = async (token, preferences) => {
  try {
    const response = await fetch('/api/users/me/notification-preferences', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ preferences })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to update notification preferences:', error);
    throw error;
  }
};
```

The `preferences` object can include:
```javascript
const preferences = {
  email: {
    orderUpdates: true,
    connectionRequests: true,
    systemAnnouncements: true,
    marketingCommunications: false
  },
  inApp: {
    orderUpdates: true,
    connectionRequests: true,
    systemAnnouncements: true
  },
  sms: {
    orderUpdates: false,
    connectionRequests: false,
    systemAnnouncements: false
  }
};
```

### Update UI Preferences

Update your UI preferences:

```javascript
const updateUiPreferences = async (token, preferences) => {
  try {
    const response = await fetch('/api/users/me/ui-preferences', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ preferences })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to update UI preferences:', error);
    throw error;
  }
};
```

The `preferences` object can include:
```javascript
const preferences = {
  theme: 'light', // 'light', 'dark', 'system'
  fontSize: 'medium', // 'small', 'medium', 'large'
  compactView: false,
  showTutorials: true,
  dashboardLayout: 'default'
};
```

## Managing Security Settings

### Change Password

Change your password:

```javascript
const changePassword = async (token, currentPassword, newPassword) => {
  try {
    const response = await fetch('/api/users/me/password', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        currentPassword,
        newPassword
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to change password:', error);
    throw error;
  }
};
```

### Enable Two-Factor Authentication

Enable two-factor authentication:

```javascript
const enableTwoFactorAuth = async (token) => {
  try {
    // Step 1: Request 2FA setup
    const setupResponse = await fetch('/api/users/me/two-factor/setup', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!setupResponse.ok) {
      throw new Error(`Error: ${setupResponse.status}`);
    }
    
    const setupData = await setupResponse.json();
    
    // Step 2: Display QR code to user and get verification code
    const qrCodeUrl = setupData.data.qrCodeUrl;
    const secretKey = setupData.data.secretKey;
    
    // Display QR code to user and prompt for verification code
    // This is a placeholder for your UI implementation
    const verificationCode = await promptUserForVerificationCode(qrCodeUrl, secretKey);
    
    // Step 3: Verify and enable 2FA
    const verifyResponse = await fetch('/api/users/me/two-factor/verify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        verificationCode
      })
    });
    
    if (!verifyResponse.ok) {
      throw new Error(`Error: ${verifyResponse.status}`);
    }
    
    const verifyData = await verifyResponse.json();
    return verifyData.data;
  } catch (error) {
    console.error('Failed to enable two-factor authentication:', error);
    throw error;
  }
};

// Placeholder function for UI implementation
const promptUserForVerificationCode = async (qrCodeUrl, secretKey) => {
  // Display QR code and secret key to user
  // Prompt user to enter verification code from authenticator app
  // Return the verification code
  return '123456'; // This should be replaced with actual user input
};
```

The response will include:
- `enabled`: Boolean indicating that 2FA is enabled
- `recoveryCodes`: Array of recovery codes to be saved by the user

### Disable Two-Factor Authentication

Disable two-factor authentication:

```javascript
const disableTwoFactorAuth = async (token, verificationCode) => {
  try {
    const response = await fetch('/api/users/me/two-factor/disable', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        verificationCode
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to disable two-factor authentication:', error);
    throw error;
  }
};
```

### Get Login History

Retrieve your login history:

```javascript
const getLoginHistory = async (token, page = 1, limit = 20) => {
  try {
    const response = await fetch(`/api/users/me/login-history?page=${page}&limit=${limit}`, {
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
    console.error('Failed to retrieve login history:', error);
    throw error;
  }
};
```

The response will include:
- `logins`: Array of login records
- `pagination`: Pagination information

Each login record includes:
- `timestamp`: Login timestamp
- `ipAddress`: IP address
- `location`: Geographic location (if available)
- `deviceType`: Device type
- `browser`: Browser information
- `operatingSystem`: Operating system information
- `status`: Login status (success, failure)
- `failureReason`: Reason for failure (if applicable)

## Error Handling

When working with user profile endpoints, be prepared to handle these common errors:

- 400 Bad Request: Invalid input
- 401 Unauthorized: Missing or invalid authentication token
- 403 Forbidden: Insufficient permissions
- 404 Not Found: User not found
- 409 Conflict: Email already in use
- 422 Unprocessable Entity: Invalid data format

## Best Practices

1. **Keep profile information up-to-date**: Regularly review and update user profiles
2. **Use strong passwords**: Encourage users to set strong, unique passwords
3. **Enable two-factor authentication**: Enhance security with 2FA
4. **Monitor login history**: Regularly check login history for suspicious activity
5. **Manage notification preferences**: Configure notifications to avoid alert fatigue
6. **Use appropriate roles**: Assign the least privileged role necessary for each user
7. **Maintain accurate contact information**: Ensure contact details are current for important communications
8. **Respect user privacy**: Only collect and store necessary user information
9. **Provide clear profile settings**: Make it easy for users to update their preferences
10. **Document user management procedures**: Maintain documentation for administrators