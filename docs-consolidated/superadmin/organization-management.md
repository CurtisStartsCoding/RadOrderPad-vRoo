# Superadmin Organization Management Guide

This guide covers the organization management capabilities available to superadmins in the RadOrderPad API.

## Prerequisites

- You must have a superadmin role
- You must have a valid JWT token with superadmin privileges

## Organization Management Overview

Superadmins have extended capabilities for managing organizations, including:

1. Viewing all organizations in the system
2. Creating new organizations
3. Updating organization information
4. Managing organization status
5. Handling organization verification
6. Viewing organization activity and metrics
7. Managing organization settings and configurations

## Retrieving Organization Information

### List All Organizations

Retrieve a list of all organizations in the system:

```javascript
const getAllOrganizations = async (token, filters = {}, page = 1, limit = 20) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...filters
    }).toString();
    
    const response = await fetch(`/api/superadmin/organizations?${queryParams}`, {
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
    console.error('Failed to retrieve organizations:', error);
    throw error;
  }
};
```

The `filters` object can include:
- `status`: Filter by organization status (active, inactive, pending, suspended)
- `type`: Filter by organization type (referring, radiology, both)
- `verificationStatus`: Filter by verification status (verified, pending, rejected)
- `createdAfter`: Filter by creation date (ISO date string)
- `createdBefore`: Filter by creation date (ISO date string)
- `search`: Search term for organization name or ID

The response will include:
- `organizations`: Array of organization records
- `pagination`: Pagination information
  - `currentPage`: Current page number
  - `totalPages`: Total number of pages
  - `totalItems`: Total number of organizations
  - `itemsPerPage`: Number of organizations per page

Each organization record includes:
- `id`: Organization ID
- `name`: Organization name
- `type`: Organization type
- `status`: Organization status
- `verificationStatus`: Verification status
- `contactEmail`: Contact email
- `contactPhone`: Contact phone
- `address`: Organization address
- `createdAt`: Date the organization was created
- `updatedAt`: Date the organization was last updated
- `userCount`: Number of users in the organization
- `connectionCount`: Number of connections with other organizations

### Get Organization Details

Retrieve detailed information for a specific organization:

```javascript
const getOrganizationDetails = async (token, organizationId) => {
  try {
    const response = await fetch(`/api/superadmin/organizations/${organizationId}`, {
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
    console.error('Failed to retrieve organization details:', error);
    throw error;
  }
};
```

The response will include all organization information, including:
- `id`: Organization ID
- `name`: Organization name
- `type`: Organization type
- `status`: Organization status
- `verificationStatus`: Verification status
- `contactEmail`: Contact email
- `contactPhone`: Contact phone
- `website`: Organization website
- `address`: Organization address
- `mailingAddress`: Mailing address
- `billingInfo`: Billing information
- `specialties`: Array of medical specialties
- `settings`: Organization settings
- `createdAt`: Date the organization was created
- `updatedAt`: Date the organization was last updated
- `users`: Array of users in the organization
- `locations`: Array of organization locations
- `connections`: Array of connections with other organizations
- `subscriptionInfo`: Subscription information
- `creditBalance`: Credit balance information
- `activityMetrics`: Activity metrics
  - `totalOrders`: Total number of orders
  - `ordersLast30Days`: Orders in the last 30 days
  - `validationAccuracy`: Validation accuracy percentage
  - `averageResponseTime`: Average response time in seconds

## Creating and Updating Organizations

### Create a New Organization

Create a new organization:

```javascript
const createOrganization = async (token, organizationData) => {
  try {
    const response = await fetch('/api/superadmin/organizations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(organizationData)
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to create organization:', error);
    throw error;
  }
};
```

The `organizationData` object should include:
- `name`: Organization name (required)
- `type`: Organization type (required)
- `contactEmail`: Contact email (required)
- `contactPhone`: Contact phone (required)
- `address`: Organization address (required)
- `specialties`: Array of medical specialties (optional)
- `settings`: Organization settings (optional)
- `initialAdmin`: Initial admin user information (optional)
  - `email`: Admin email
  - `firstName`: Admin first name
  - `lastName`: Admin last name
  - `sendInvite`: Whether to send an invitation email

### Update Organization Information

Update an organization's information:

```javascript
const updateOrganization = async (token, organizationId, organizationData) => {
  try {
    const response = await fetch(`/api/superadmin/organizations/${organizationId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(organizationData)
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to update organization:', error);
    throw error;
  }
};
```

The `organizationData` object can include any of the fields mentioned in the create operation.

## Managing Organization Status

### Activate an Organization

Activate an organization:

```javascript
const activateOrganization = async (token, organizationId, notes = '') => {
  try {
    const response = await fetch(`/api/superadmin/organizations/${organizationId}/activate`, {
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
    console.error('Failed to activate organization:', error);
    throw error;
  }
};
```

### Deactivate an Organization

Deactivate an organization:

```javascript
const deactivateOrganization = async (token, organizationId, reason, notes = '') => {
  try {
    const response = await fetch(`/api/superadmin/organizations/${organizationId}/deactivate`, {
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
    console.error('Failed to deactivate organization:', error);
    throw error;
  }
};
```

### Suspend an Organization

Suspend an organization:

```javascript
const suspendOrganization = async (token, organizationId, reason, suspensionPeriod, notes = '') => {
  try {
    const response = await fetch(`/api/superadmin/organizations/${organizationId}/suspend`, {
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
    console.error('Failed to suspend organization:', error);
    throw error;
  }
};
```

The `suspensionPeriod` parameter specifies the suspension duration in days.

### Unsuspend an Organization

Remove the suspension from an organization:

```javascript
const unsuspendOrganization = async (token, organizationId, notes = '') => {
  try {
    const response = await fetch(`/api/superadmin/organizations/${organizationId}/unsuspend`, {
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
    console.error('Failed to unsuspend organization:', error);
    throw error;
  }
};
```

## Managing Organization Verification

### Review Verification Request

Review an organization's verification request:

```javascript
const reviewVerificationRequest = async (token, organizationId, decision, notes = '') => {
  try {
    const response = await fetch(`/api/superadmin/organizations/${organizationId}/verification`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ decision, notes })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to review verification request:', error);
    throw error;
  }
};
```

The `decision` parameter can be either `approve` or `reject`.

### Get Verification Documents

Retrieve verification documents for an organization:

```javascript
const getVerificationDocuments = async (token, organizationId) => {
  try {
    const response = await fetch(`/api/superadmin/organizations/${organizationId}/verification-documents`, {
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
    console.error('Failed to retrieve verification documents:', error);
    throw error;
  }
};
```

The response will include an array of document records, each with:
- `id`: Document ID
- `fileName`: Original file name
- `fileType`: MIME type of the file
- `fileSize`: Size of the file in bytes
- `uploadDate`: Date and time of the upload
- `downloadUrl`: URL for downloading the document

## Managing Organization Settings

### Update Organization Settings

Update an organization's settings:

```javascript
const updateOrganizationSettings = async (token, organizationId, settings) => {
  try {
    const response = await fetch(`/api/superadmin/organizations/${organizationId}/settings`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ settings })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to update organization settings:', error);
    throw error;
  }
};
```

The `settings` object can include:
- `featureFlags`: Feature flags for the organization
- `validationLimits`: Validation limits
- `connectionLimits`: Connection limits
- `userLimits`: User limits
- `securitySettings`: Security settings
- `notificationSettings`: Notification settings

### Reset Organization Password

Reset the password for an organization's admin user:

```javascript
const resetOrganizationPassword = async (token, organizationId, adminUserId) => {
  try {
    const response = await fetch(`/api/superadmin/organizations/${organizationId}/reset-admin-password`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ adminUserId })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to reset organization password:', error);
    throw error;
  }
};
```

The response will include:
- `success`: Boolean indicating success
- `resetLink`: Password reset link to provide to the admin user

## Viewing Organization Activity

### Get Organization Activity Log

Retrieve the activity log for an organization:

```javascript
const getOrganizationActivityLog = async (token, organizationId, filters = {}, page = 1, limit = 20) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...filters
    }).toString();
    
    const response = await fetch(`/api/superadmin/organizations/${organizationId}/activity-log?${queryParams}`, {
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
    console.error('Failed to retrieve organization activity log:', error);
    throw error;
  }
};
```

The `filters` object can include:
- `activityType`: Filter by activity type
- `startDate`: Filter by start date
- `endDate`: Filter by end date
- `userId`: Filter by user ID

The response will include:
- `activities`: Array of activity records
- `pagination`: Pagination information

Each activity record includes:
- `id`: Activity ID
- `timestamp`: Activity timestamp
- `activityType`: Type of activity
- `userId`: ID of the user who performed the activity
- `userName`: Name of the user who performed the activity
- `details`: Activity details
- `ipAddress`: IP address from which the activity was performed
- `userAgent`: User agent information

### Get Organization Metrics

Retrieve metrics for an organization:

```javascript
const getOrganizationMetrics = async (token, organizationId, timeframe = '30d') => {
  try {
    const response = await fetch(`/api/superadmin/organizations/${organizationId}/metrics?timeframe=${timeframe}`, {
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
    console.error('Failed to retrieve organization metrics:', error);
    throw error;
  }
};
```

The `timeframe` parameter can be one of:
- `7d`: Last 7 days
- `30d`: Last 30 days
- `90d`: Last 90 days
- `1y`: Last year

The response will include:
- `orderMetrics`: Order-related metrics
  - `totalOrders`: Total number of orders
  - `ordersByStatus`: Breakdown of orders by status
  - `ordersByModality`: Breakdown of orders by modality
  - `orderTrend`: Daily/weekly order counts
- `validationMetrics`: Validation-related metrics
  - `validationAccuracy`: Validation accuracy percentage
  - `averageAttemptsPerOrder`: Average validation attempts per order
  - `clarificationRate`: Percentage of orders requiring clarification
  - `overrideRate`: Percentage of orders requiring override
- `userMetrics`: User-related metrics
  - `activeUsers`: Number of active users
  - `usersByRole`: Breakdown of users by role
  - `newUsers`: Number of new users
- `connectionMetrics`: Connection-related metrics
  - `totalConnections`: Total number of connections
  - `connectionsByStatus`: Breakdown of connections by status
  - `newConnections`: Number of new connections
- `billingMetrics`: Billing-related metrics
  - `creditUsage`: Credit usage
  - `creditPurchases`: Credit purchases
  - `currentBalance`: Current credit balance

## Managing Organization Billing

### Adjust Credit Balance

Adjust an organization's credit balance:

```javascript
const adjustCreditBalance = async (token, organizationId, adjustment, reason, notes = '') => {
  try {
    const response = await fetch(`/api/superadmin/organizations/${organizationId}/adjust-credits`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ adjustment, reason, notes })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to adjust credit balance:', error);
    throw error;
  }
};
```

The `adjustment` parameter can be positive (add credits) or negative (remove credits).

### View Billing History

Retrieve the billing history for an organization:

```javascript
const getBillingHistory = async (token, organizationId, page = 1, limit = 20) => {
  try {
    const response = await fetch(`/api/superadmin/organizations/${organizationId}/billing-history?page=${page}&limit=${limit}`, {
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
    console.error('Failed to retrieve billing history:', error);
    throw error;
  }
};
```

The response will include:
- `transactions`: Array of transaction records
- `pagination`: Pagination information

Each transaction record includes:
- `id`: Transaction ID
- `type`: Transaction type
- `amount`: Transaction amount
- `date`: Transaction date
- `description`: Transaction description
- `status`: Transaction status
- `paymentMethod`: Payment method information (if applicable)
- `invoiceUrl`: URL to the invoice (if applicable)

## Error Handling

When working with superadmin organization management endpoints, be prepared to handle these common errors:

- 400 Bad Request: Invalid input
- 401 Unauthorized: Missing or invalid authentication token
- 403 Forbidden: Insufficient permissions (non-superadmin role)
- 404 Not Found: Organization not found
- 409 Conflict: Conflict with existing data
- 422 Unprocessable Entity: Cannot perform the requested operation

## Best Practices

1. **Document all actions**: Always provide detailed notes for administrative actions
2. **Use appropriate status changes**: Choose the correct status change for each situation
3. **Verify organizations thoroughly**: Review all verification documents carefully
4. **Monitor organization metrics**: Regularly review organization activity and metrics
5. **Handle billing adjustments carefully**: Document reasons for all credit adjustments
6. **Respect privacy**: Access organization data only when necessary
7. **Follow security protocols**: Adhere to security best practices when resetting passwords
8. **Maintain audit trail**: Ensure all administrative actions are properly logged
9. **Communicate changes**: Notify organization admins of significant changes
10. **Apply consistent policies**: Treat all organizations fairly and consistently