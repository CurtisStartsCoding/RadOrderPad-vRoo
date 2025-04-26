# Organization Profile Management

This guide covers the management of organization profiles in the RadOrderPad API, including creating, retrieving, updating, and deleting organization information.

## Prerequisites

- You must have an administrator role
- Your organization must be active
- You must have a valid JWT token

## Organization Profile Overview

The organization profile contains essential information about your organization, including:

1. Basic Information: Name, type, contact details
2. Address Information: Physical location and mailing address
3. Billing Information: Payment methods and billing contacts
4. Specialties: Medical specialties offered or required
5. Settings: Organization-specific settings and preferences

## Retrieving Organization Information

### Get Your Organization Profile

Retrieve your own organization's profile:

```javascript
const getMyOrganization = async (token) => {
  try {
    const response = await fetch('/api/organizations/mine', {
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
    console.error('Failed to retrieve organization profile:', error);
    throw error;
  }
};
```

The response will include:
- `id`: Organization ID
- `name`: Organization name
- `type`: Organization type (referring, radiology, both)
- `status`: Organization status (active, inactive, pending)
- `contactEmail`: Primary contact email
- `contactPhone`: Primary contact phone
- `website`: Organization website
- `address`: Physical address
  - `street1`: Street address line 1
  - `street2`: Street address line 2 (optional)
  - `city`: City
  - `state`: State/province
  - `zipCode`: ZIP/postal code
  - `country`: Country
- `mailingAddress`: Mailing address (if different from physical)
- `billingInfo`: Billing information
  - `billingEmail`: Billing email
  - `billingPhone`: Billing phone
  - `billingAddress`: Billing address
  - `taxId`: Tax ID/EIN
- `specialties`: Array of medical specialties
- `settings`: Organization settings
  - `defaultLanguage`: Default language
  - `timeZone`: Time zone
  - `dateFormat`: Date format preference
  - `notificationPreferences`: Notification settings
- `createdAt`: Date the organization was created
- `updatedAt`: Date the organization was last updated

### Get Organization by ID

Retrieve another organization's public profile by ID:

```javascript
const getOrganizationById = async (token, organizationId) => {
  try {
    const response = await fetch(`/api/organizations/${organizationId}`, {
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
    console.error('Failed to retrieve organization:', error);
    throw error;
  }
};
```

The response will include the public profile information, which is a subset of the full profile:
- `id`: Organization ID
- `name`: Organization name
- `type`: Organization type
- `contactEmail`: Public contact email
- `contactPhone`: Public contact phone
- `website`: Organization website
- `address`: Physical address
- `specialties`: Array of medical specialties
- `connectionStatus`: Connection status with your organization (if applicable)

## Updating Organization Information

### Update Basic Information

Update your organization's basic information:

```javascript
const updateBasicInfo = async (token, basicInfo) => {
  try {
    const response = await fetch('/api/organizations/mine/basic-info', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(basicInfo)
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to update basic information:', error);
    throw error;
  }
};
```

The `basicInfo` object can include:
- `name`: Organization name
- `type`: Organization type
- `contactEmail`: Primary contact email
- `contactPhone`: Primary contact phone
- `website`: Organization website

### Update Address Information

Update your organization's address information:

```javascript
const updateAddressInfo = async (token, addressInfo) => {
  try {
    const response = await fetch('/api/organizations/mine/address', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(addressInfo)
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to update address information:', error);
    throw error;
  }
};
```

The `addressInfo` object can include:
- `address`: Physical address
  - `street1`: Street address line 1
  - `street2`: Street address line 2
  - `city`: City
  - `state`: State/province
  - `zipCode`: ZIP/postal code
  - `country`: Country
- `mailingAddress`: Mailing address (if different from physical)
  - `street1`: Street address line 1
  - `street2`: Street address line 2
  - `city`: City
  - `state`: State/province
  - `zipCode`: ZIP/postal code
  - `country`: Country
- `usePhysicalForMailing`: Boolean indicating whether to use physical address for mailing

### Update Billing Information

Update your organization's billing information:

```javascript
const updateBillingInfo = async (token, billingInfo) => {
  try {
    const response = await fetch('/api/organizations/mine/billing-info', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(billingInfo)
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to update billing information:', error);
    throw error;
  }
};
```

The `billingInfo` object can include:
- `billingEmail`: Billing email
- `billingPhone`: Billing phone
- `billingAddress`: Billing address
  - `street1`: Street address line 1
  - `street2`: Street address line 2
  - `city`: City
  - `state`: State/province
  - `zipCode`: ZIP/postal code
  - `country`: Country
- `taxId`: Tax ID/EIN
- `usePhysicalForBilling`: Boolean indicating whether to use physical address for billing

### Update Specialties

Update your organization's medical specialties:

```javascript
const updateSpecialties = async (token, specialties) => {
  try {
    const response = await fetch('/api/organizations/mine/specialties', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ specialties })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to update specialties:', error);
    throw error;
  }
};
```

The `specialties` parameter is an array of specialty codes:
```javascript
const specialties = [
  'RADIOLOGY',
  'CARDIOLOGY',
  'ORTHOPEDICS',
  'NEUROLOGY',
  'ONCOLOGY'
];
```

### Update Organization Settings

Update your organization's settings:

```javascript
const updateSettings = async (token, settings) => {
  try {
    const response = await fetch('/api/organizations/mine/settings', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(settings)
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to update settings:', error);
    throw error;
  }
};
```

The `settings` object can include:
- `defaultLanguage`: Default language code
- `timeZone`: Time zone identifier
- `dateFormat`: Date format preference
- `notificationPreferences`: Notification settings
  - `email`: Email notification settings
  - `inApp`: In-app notification settings
  - `sms`: SMS notification settings

## Organization Logo Management

### Upload Organization Logo

Upload a logo for your organization:

```javascript
const uploadLogo = async (token, logoFile) => {
  try {
    // First, get a presigned URL for the logo upload
    const presignedUrlResponse = await fetch('/api/organizations/mine/logo-upload-url', {
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
    
    // Upload the logo to the presigned URL
    const uploadResponse = await fetch(presignedData.data.presignedUrl, {
      method: 'PUT',
      body: logoFile,
      headers: {
        'Content-Type': logoFile.type
      }
    });
    
    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadResponse.status}`);
    }
    
    // Confirm the logo upload
    const confirmResponse = await fetch('/api/organizations/mine/logo', {
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
    console.error('Failed to upload logo:', error);
    throw error;
  }
};
```

The response will include:
- `logoUrl`: URL for the uploaded logo
- `thumbnailUrl`: URL for a thumbnail version of the logo
- `uploadDate`: Date the logo was uploaded

### Remove Organization Logo

Remove your organization's logo:

```javascript
const removeLogo = async (token) => {
  try {
    const response = await fetch('/api/organizations/mine/logo', {
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
    console.error('Failed to remove logo:', error);
    throw error;
  }
};
```

## Organization Verification

### Request Organization Verification

Request verification for your organization:

```javascript
const requestVerification = async (token, verificationDocuments) => {
  try {
    const response = await fetch('/api/organizations/mine/request-verification', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        documents: verificationDocuments
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to request verification:', error);
    throw error;
  }
};
```

The `verificationDocuments` parameter is an array of document IDs that have been previously uploaded:
```javascript
const verificationDocuments = [
  'doc-123456',
  'doc-789012'
];
```

### Check Verification Status

Check the status of your organization's verification:

```javascript
const checkVerificationStatus = async (token) => {
  try {
    const response = await fetch('/api/organizations/mine/verification-status', {
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
    console.error('Failed to check verification status:', error);
    throw error;
  }
};
```

The response will include:
- `status`: Verification status (pending, verified, rejected)
- `requestDate`: Date the verification was requested
- `verificationDate`: Date the verification was completed (if verified)
- `rejectionReason`: Reason for rejection (if rejected)
- `documents`: Array of submitted documents
- `nextReviewDate`: Expected date for the next review

## Organization Deactivation

### Deactivate Organization

Deactivate your organization:

```javascript
const deactivateOrganization = async (token, reason) => {
  try {
    const response = await fetch('/api/organizations/mine/deactivate', {
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
    console.error('Failed to deactivate organization:', error);
    throw error;
  }
};
```

### Reactivate Organization

Reactivate your organization:

```javascript
const reactivateOrganization = async (token) => {
  try {
    const response = await fetch('/api/organizations/mine/reactivate', {
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
    console.error('Failed to reactivate organization:', error);
    throw error;
  }
};
```

## Error Handling

When working with organization profile endpoints, be prepared to handle these common errors:

- 400 Bad Request: Invalid input
- 401 Unauthorized: Missing or invalid authentication token
- 403 Forbidden: Insufficient permissions (non-admin role)
- 404 Not Found: Organization not found
- 409 Conflict: Duplicate information (e.g., email already in use)
- 422 Unprocessable Entity: Invalid data format

## Best Practices

1. **Keep information up-to-date**: Regularly review and update your organization profile
2. **Use clear contact information**: Ensure contact details are accurate and monitored
3. **Provide complete address information**: Include all address components for proper delivery
4. **Select appropriate specialties**: Choose specialties that accurately reflect your services
5. **Upload a professional logo**: Use a high-quality logo that represents your brand
6. **Verify your organization**: Complete the verification process for enhanced trust
7. **Configure notification preferences**: Set up notifications to ensure you receive important updates
8. **Maintain accurate billing information**: Keep billing details current to avoid payment issues
9. **Document organization changes**: Keep records of significant profile changes
10. **Review connected organizations**: Periodically review your connections with other organizations