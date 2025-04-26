# Managing Connection Requests

This guide covers the process of managing incoming connection requests from other organizations in the RadOrderPad API.

## Prerequisites

- You must have an administrator role
- Your organization must be active
- You must have a valid JWT token

## Connection Request Management Flow

The connection request management flow consists of these steps:

1. Retrieve incoming connection requests
2. Review request details
3. Approve or reject the request
4. Manage established connections

## Step 1: Retrieve Incoming Connection Requests

Retrieve all incoming connection requests:

```javascript
const getIncomingConnectionRequests = async (token, status = 'pending', page = 1, limit = 20) => {
  try {
    const response = await fetch(`/api/connections/incoming?status=${status}&page=${page}&limit=${limit}`, {
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
    console.error('Failed to retrieve incoming connection requests:', error);
    throw error;
  }
};
```

The response will include:
- `connections`: Array of connection records
- `pagination`: Pagination information
  - `currentPage`: Current page number
  - `totalPages`: Total number of pages
  - `totalItems`: Total number of connections
  - `itemsPerPage`: Number of connections per page

Each connection record includes:
- `id`: Connection ID
- `status`: Connection status (pending_approval, approved, rejected)
- `requestDate`: Date the request was sent
- `sourceOrganization`: Information about the requesting organization
  - `id`: Organization ID
  - `name`: Organization name
  - `type`: Organization type (referring, radiology, both)
  - `address`: Organization address
  - `city`: Organization city
  - `state`: Organization state
  - `zipCode`: Organization ZIP code
  - `phone`: Organization phone number
  - `website`: Organization website
- `message`: The request message

## Step 2: Get Connection Request Details

Retrieve detailed information about a specific connection request:

```javascript
const getConnectionRequestDetails = async (token, connectionId) => {
  try {
    const response = await fetch(`/api/connections/${connectionId}`, {
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
    console.error('Failed to retrieve connection request details:', error);
    throw error;
  }
};
```

The response will include:
- `id`: Connection ID
- `status`: Connection status (pending_approval, approved, rejected)
- `requestDate`: Date the request was sent
- `responseDate`: Date of the response (if any)
- `sourceOrganization`: Detailed information about the requesting organization
  - `id`: Organization ID
  - `name`: Organization name
  - `type`: Organization type (referring, radiology, both)
  - `address`: Organization address
  - `city`: Organization city
  - `state`: Organization state
  - `zipCode`: Organization ZIP code
  - `phone`: Organization phone number
  - `website`: Organization website
  - `contactEmail`: Organization contact email
  - `contactName`: Organization contact name
  - `contactPhone`: Organization contact phone
  - `specialties`: Array of organization specialties
- `message`: The request message

## Step 3: Approve a Connection Request

Approve an incoming connection request:

```javascript
const approveConnectionRequest = async (token, connectionId, responseMessage = '') => {
  try {
    const response = await fetch(`/api/connections/${connectionId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        responseMessage
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to approve connection request:', error);
    throw error;
  }
};
```

The response will include:
- `id`: Connection ID
- `status`: Updated connection status (approved)
- `responseDate`: Date of the approval
- `responseMessage`: The response message
- `sourceOrganization`: Information about the requesting organization
- `targetOrganization`: Information about your organization

## Step 4: Reject a Connection Request

Reject an incoming connection request:

```javascript
const rejectConnectionRequest = async (token, connectionId, responseMessage = '') => {
  try {
    const response = await fetch(`/api/connections/${connectionId}/reject`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        responseMessage
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to reject connection request:', error);
    throw error;
  }
};
```

The response will include:
- `id`: Connection ID
- `status`: Updated connection status (rejected)
- `responseDate`: Date of the rejection
- `responseMessage`: The rejection message

## Step 5: Get All Established Connections

Retrieve all established connections:

```javascript
const getEstablishedConnections = async (token, page = 1, limit = 20) => {
  try {
    const response = await fetch(`/api/connections/established?page=${page}&limit=${limit}`, {
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
    console.error('Failed to retrieve established connections:', error);
    throw error;
  }
};
```

The response will include:
- `connections`: Array of connection records
- `pagination`: Pagination information
  - `currentPage`: Current page number
  - `totalPages`: Total number of pages
  - `totalItems`: Total number of connections
  - `itemsPerPage`: Number of connections per page

Each connection record includes:
- `id`: Connection ID
- `status`: Connection status (approved)
- `requestDate`: Date the request was sent
- `responseDate`: Date of the approval
- `organization`: Information about the connected organization
  - `id`: Organization ID
  - `name`: Organization name
  - `type`: Organization type (referring, radiology, both)
  - `address`: Organization address
  - `city`: Organization city
  - `state`: Organization state
  - `zipCode`: Organization ZIP code
  - `phone`: Organization phone number
  - `website`: Organization website
- `connectionType`: Type of connection (incoming, outgoing)
- `orderCount`: Number of orders exchanged through this connection
- `lastOrderDate`: Date of the last order

## Step 6: Get Connection Statistics

Retrieve statistics about a specific connection:

```javascript
const getConnectionStatistics = async (token, connectionId) => {
  try {
    const response = await fetch(`/api/connections/${connectionId}/statistics`, {
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
    console.error('Failed to retrieve connection statistics:', error);
    throw error;
  }
};
```

The response will include:
- `connectionId`: Connection ID
- `totalOrders`: Total number of orders exchanged
- `ordersByStatus`: Breakdown of orders by status
  - `pending`: Number of pending orders
  - `completed`: Number of completed orders
  - `canceled`: Number of canceled orders
- `ordersByModality`: Breakdown of orders by modality type
  - `CT`: Number of CT orders
  - `MRI`: Number of MRI orders
  - `XRAY`: Number of X-ray orders
  - `ULTRASOUND`: Number of ultrasound orders
  - `PET`: Number of PET orders
  - `NUCLEAR`: Number of nuclear medicine orders
- `monthlyOrderCounts`: Array of monthly order counts
  - `month`: Month (YYYY-MM format)
  - `count`: Number of orders in that month

## Connection Management Best Practices

### Reviewing Connection Requests

When reviewing incoming connection requests, consider these factors:

1. **Organization Type**: Is the requesting organization a referring physician practice, a radiology provider, or both?
2. **Geographic Location**: Is the organization located in your service area?
3. **Specialties**: Does the organization's specialty align with your services?
4. **Request Message**: Does the message provide clear information about the organization and its needs?
5. **Potential Volume**: How many physicians or orders might come from this connection?

### Approving Requests

When approving a connection request:

1. Include a welcoming response message
2. Provide contact information for support
3. Include any specific instructions or requirements
4. Mention any onboarding process or training resources

Example approval message:

```
Thank you for your connection request. We are pleased to approve this connection between our organizations.

For any technical support needs, please contact our support team at support@example.com or call (555) 123-4567.

We look forward to working with your organization.

Best regards,
[Your Name]
[Your Organization Name]
```

### Rejecting Requests

When rejecting a connection request:

1. Provide a clear reason for the rejection
2. Be professional and courteous
3. Suggest alternatives if applicable
4. Leave the door open for future connections if appropriate

Example rejection message:

```
Thank you for your connection request. Unfortunately, we are unable to approve this connection at this time because [reason for rejection].

We appreciate your interest in connecting with our organization and encourage you to [alternative suggestion or future possibility].

Best regards,
[Your Name]
[Your Organization Name]
```

## Error Handling

When working with connection management endpoints, be prepared to handle these common errors:

- 400 Bad Request: Invalid input
- 401 Unauthorized: Missing or invalid authentication token
- 403 Forbidden: Insufficient permissions (non-admin role)
- 404 Not Found: Connection not found
- 409 Conflict: Connection already approved or rejected

## Connection Lifecycle Management

Effective connection management involves:

1. **Regular Review**: Periodically review incoming connection requests
2. **Timely Responses**: Respond to requests within a reasonable timeframe (1-3 business days)
3. **Connection Monitoring**: Monitor established connections for activity and issues
4. **Documentation**: Maintain records of connection decisions and communications
5. **Relationship Management**: Nurture relationships with connected organizations