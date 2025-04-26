# Requesting Connections

This guide covers the process of requesting connections between organizations in the RadOrderPad API, which enables referring physicians to send orders to radiology organizations.

## Prerequisites

- You must have an administrator role
- Your organization must be active
- You must have a valid JWT token

## Connection Request Flow

The connection request flow consists of these steps:

1. Search for organizations to connect with
2. Send a connection request
3. Wait for the request to be approved or rejected
4. Establish the connection

## Step 1: Search for Organizations

Search for organizations to connect with:

```javascript
const searchOrganizations = async (token, searchTerm, page = 1, limit = 20) => {
  try {
    const response = await fetch(`/api/organizations/search?q=${encodeURIComponent(searchTerm)}&page=${page}&limit=${limit}`, {
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
    console.error('Failed to search organizations:', error);
    throw error;
  }
};
```

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
- `type`: Organization type (referring, radiology, both)
- `address`: Organization address
- `city`: Organization city
- `state`: Organization state
- `zipCode`: Organization ZIP code
- `phone`: Organization phone number
- `website`: Organization website
- `connectionStatus`: Connection status (not_connected, pending_outgoing, pending_incoming, connected, rejected)

## Step 2: Send a Connection Request

Send a connection request to an organization:

```javascript
const sendConnectionRequest = async (token, targetOrganizationId, message) => {
  try {
    const response = await fetch('/api/connections/request', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        targetOrganizationId,
        message
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to send connection request:', error);
    throw error;
  }
};
```

The response will include:
- `connectionId`: The ID of the connection request
- `status`: Connection status (pending_approval)
- `requestDate`: Date the request was sent
- `targetOrganization`: Basic information about the target organization

## Step 3: Check Connection Request Status

Check the status of a connection request:

```javascript
const getConnectionRequestStatus = async (token, connectionId) => {
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
    console.error('Failed to check connection request status:', error);
    throw error;
  }
};
```

The response will include:
- `id`: Connection ID
- `status`: Connection status (pending_approval, approved, rejected)
- `requestDate`: Date the request was sent
- `responseDate`: Date of the response (if any)
- `sourceOrganization`: Information about the requesting organization
- `targetOrganization`: Information about the target organization
- `message`: The original request message
- `responseMessage`: Response message (if any)

## Step 4: Get All Outgoing Connection Requests

Retrieve all outgoing connection requests:

```javascript
const getOutgoingConnectionRequests = async (token, status = 'all', page = 1, limit = 20) => {
  try {
    const response = await fetch(`/api/connections/outgoing?status=${status}&page=${page}&limit=${limit}`, {
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
    console.error('Failed to retrieve outgoing connection requests:', error);
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
- `responseDate`: Date of the response (if any)
- `targetOrganization`: Information about the target organization
- `message`: The original request message
- `responseMessage`: Response message (if any)

## Step 5: Cancel a Connection Request

Cancel a pending connection request:

```javascript
const cancelConnectionRequest = async (token, connectionId) => {
  try {
    const response = await fetch(`/api/connections/${connectionId}/cancel`, {
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
    console.error('Failed to cancel connection request:', error);
    throw error;
  }
};
```

The response will include:
- `id`: Connection ID
- `status`: Updated connection status (canceled)
- `cancelDate`: Date the request was canceled

## Step 6: Resend a Rejected Connection Request

Resend a connection request that was previously rejected:

```javascript
const resendConnectionRequest = async (token, connectionId, newMessage) => {
  try {
    const response = await fetch(`/api/connections/${connectionId}/resend`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: newMessage
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to resend connection request:', error);
    throw error;
  }
};
```

The response will include:
- `id`: Connection ID
- `status`: Updated connection status (pending_approval)
- `requestDate`: New request date
- `message`: The new request message

## Connection Request Lifecycle

A connection request goes through these status changes:

1. `pending_approval`: The request has been sent and is awaiting approval
2. `approved`: The request has been approved and the connection is established
3. `rejected`: The request has been rejected
4. `canceled`: The request has been canceled by the requesting organization

## Error Handling

When working with connection request endpoints, be prepared to handle these common errors:

- 400 Bad Request: Invalid input
- 401 Unauthorized: Missing or invalid authentication token
- 403 Forbidden: Insufficient permissions (non-admin role)
- 404 Not Found: Organization or connection not found
- 409 Conflict: Connection already exists or is already pending

## Best Practices

1. Provide a clear search interface for finding organizations
2. Include relevant organization details in search results
3. Allow users to customize connection request messages
4. Display connection request status clearly
5. Implement notifications for connection status changes
6. Provide options to cancel pending requests
7. Allow resending rejected requests with updated messages
8. Implement pagination for connection request lists
9. Include filtering options for connection status
10. Display timestamps for request and response events

## Example Connection Request Message

When sending a connection request, include relevant information about your organization and the purpose of the connection:

```
Hello,

We are [Your Organization Name], a [specialty] practice located in [City, State]. We would like to establish a connection with your radiology organization to streamline our referral process for imaging studies.

Our practice has approximately [number] physicians who would be sending orders to your facility. We primarily refer patients for [types of imaging studies].

Please let us know if you need any additional information about our practice.

Thank you,
[Your Name]
[Your Title]
[Your Organization Name]
```

## Connection Request Limitations

- You can have up to 100 active connections per organization
- You can have up to 20 pending outgoing connection requests at a time
- You cannot send a new connection request to an organization that has rejected a request within the last 30 days
- Connection requests expire after 90 days if not approved or rejected