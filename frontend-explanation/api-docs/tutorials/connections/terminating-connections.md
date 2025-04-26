# Terminating Connections

This guide covers the process of terminating established connections between organizations in the RadOrderPad API.

## Prerequisites

- You must have an administrator role
- Your organization must be active
- You must have a valid JWT token

## Connection Termination Flow

The connection termination flow consists of these steps:

1. Review the connection to be terminated
2. Initiate the termination process
3. Provide a reason for termination
4. Handle any pending orders
5. Confirm the termination

## Step 1: Review the Connection

Before terminating a connection, review its details and activity:

```javascript
const getConnectionDetails = async (token, connectionId) => {
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
    console.error('Failed to retrieve connection details:', error);
    throw error;
  }
};
```

The response will include:
- `id`: Connection ID
- `status`: Connection status (approved)
- `requestDate`: Date the request was sent
- `responseDate`: Date of the approval
- `sourceOrganization`: Information about the requesting organization
- `targetOrganization`: Information about the target organization
- `connectionType`: Type of connection (incoming, outgoing)
- `orderCount`: Number of orders exchanged through this connection
- `lastOrderDate`: Date of the last order
- `pendingOrderCount`: Number of pending orders

## Step 2: Check for Pending Orders

Check if there are any pending orders that would be affected by terminating the connection:

```javascript
const getPendingOrders = async (token, connectionId, page = 1, limit = 20) => {
  try {
    const response = await fetch(`/api/connections/${connectionId}/pending-orders?page=${page}&limit=${limit}`, {
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
    console.error('Failed to retrieve pending orders:', error);
    throw error;
  }
};
```

The response will include:
- `orders`: Array of pending order records
- `pagination`: Pagination information
  - `currentPage`: Current page number
  - `totalPages`: Total number of pages
  - `totalItems`: Total number of orders
  - `itemsPerPage`: Number of orders per page

Each order record includes:
- `id`: Order ID
- `status`: Order status
- `createdAt`: Date the order was created
- `patientInfo`: Basic patient information
- `modalityType`: Type of imaging modality
- `urgency`: Order urgency level

## Step 3: Initiate Connection Termination

Initiate the termination of a connection:

```javascript
const terminateConnection = async (token, connectionId, reason, handlePendingOrders = 'complete') => {
  try {
    const response = await fetch(`/api/connections/${connectionId}/terminate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        reason,
        handlePendingOrders
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to terminate connection:', error);
    throw error;
  }
};
```

The `handlePendingOrders` parameter can have these values:
- `complete`: Allow pending orders to complete normally
- `cancel`: Cancel all pending orders
- `transfer`: Transfer pending orders to another connection (requires additional parameters)

The response will include:
- `id`: Connection ID
- `status`: Updated connection status (terminated)
- `terminationDate`: Date of the termination
- `terminationReason`: The provided reason for termination
- `pendingOrdersHandling`: How pending orders were handled
- `affectedOrderCount`: Number of orders affected by the termination

## Step 4: Transfer Pending Orders (Optional)

If you choose to transfer pending orders to another connection:

```javascript
const terminateConnectionWithTransfer = async (token, connectionId, reason, targetConnectionId) => {
  try {
    const response = await fetch(`/api/connections/${connectionId}/terminate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        reason,
        handlePendingOrders: 'transfer',
        targetConnectionId
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to terminate connection with transfer:', error);
    throw error;
  }
};
```

## Step 5: Get Terminated Connection History

Retrieve the history of terminated connections:

```javascript
const getTerminatedConnections = async (token, page = 1, limit = 20) => {
  try {
    const response = await fetch(`/api/connections/terminated?page=${page}&limit=${limit}`, {
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
    console.error('Failed to retrieve terminated connections:', error);
    throw error;
  }
};
```

The response will include:
- `connections`: Array of terminated connection records
- `pagination`: Pagination information
  - `currentPage`: Current page number
  - `totalPages`: Total number of pages
  - `totalItems`: Total number of connections
  - `itemsPerPage`: Number of connections per page

Each connection record includes:
- `id`: Connection ID
- `status`: Connection status (terminated)
- `requestDate`: Date the request was sent
- `responseDate`: Date of the approval
- `terminationDate`: Date of the termination
- `organization`: Information about the connected organization
- `connectionType`: Type of connection (incoming, outgoing)
- `terminationReason`: Reason for termination
- `terminatedBy`: Organization that initiated the termination

## Step 6: Reestablish a Terminated Connection

To reestablish a previously terminated connection:

```javascript
const reestablishConnection = async (token, connectionId, message) => {
  try {
    const response = await fetch(`/api/connections/${connectionId}/reestablish`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to reestablish connection:', error);
    throw error;
  }
};
```

The response will include:
- `id`: Connection ID
- `status`: Updated connection status (pending_approval)
- `requestDate`: New request date
- `message`: The new request message

## Connection Termination Considerations

### Reasons for Termination

Common reasons for terminating a connection include:

1. **Organizational Changes**: Mergers, acquisitions, or closures
2. **Service Area Changes**: No longer serving the same geographic area
3. **Relationship Changes**: Moving to a different provider
4. **Quality Issues**: Concerns about service quality
5. **Volume Changes**: Insufficient order volume to maintain the connection
6. **Contractual Issues**: Changes in contractual relationships
7. **Compliance Concerns**: Issues with regulatory compliance

### Impact of Termination

Terminating a connection has these impacts:

1. **Pending Orders**: Orders in progress may need to be completed, canceled, or transferred
2. **Historical Data**: Historical order data remains accessible for the retention period
3. **User Access**: Users from both organizations lose access to the connection
4. **Notifications**: Both organizations receive notifications about the termination
5. **Reporting**: The connection appears in terminated connection reports

### Handling Pending Orders

When terminating a connection, you have three options for handling pending orders:

1. **Complete**: Allow pending orders to complete their normal workflow
   - Best for orderly transitions with few pending orders
   - Ensures patient care continuity
   - Requires continued monitoring until all orders are complete

2. **Cancel**: Cancel all pending orders
   - Best for immediate terminations or compliance issues
   - Requires alternative arrangements for patient care
   - May require manual notification to affected patients

3. **Transfer**: Move pending orders to another connection
   - Best when switching between providers
   - Ensures continuity of care
   - Requires an existing connection with the new provider

## Best Practices for Connection Termination

1. **Plan Ahead**: Whenever possible, plan the termination in advance
2. **Communicate**: Notify the other organization before terminating
3. **Consider Timing**: Choose a time with minimal pending orders
4. **Document**: Keep records of the termination reason and process
5. **Patient Care**: Prioritize patient care continuity
6. **Follow Up**: Verify all pending orders are properly handled
7. **Exit Interview**: Consider conducting an exit interview or survey
8. **Data Retention**: Understand data retention policies for historical orders

## Example Termination Messages

### Professional Relationship Change

```
We are terminating this connection as we have established a new strategic partnership with [New Partner Organization]. All pending orders will be completed through this connection before termination is finalized. We appreciate our past collaboration and wish you continued success.
```

### Service Area Change

```
Due to changes in our service area coverage, we are terminating this connection effective [Date]. We will ensure all pending orders are completed. Thank you for your understanding and past collaboration.
```

### Low Volume

```
We are streamlining our connections and terminating those with low activity. As our organizations have exchanged fewer than 10 orders in the past 6 months, we are terminating this connection. All pending orders will be completed normally.
```

## Error Handling

When working with connection termination endpoints, be prepared to handle these common errors:

- 400 Bad Request: Invalid input
- 401 Unauthorized: Missing or invalid authentication token
- 403 Forbidden: Insufficient permissions (non-admin role)
- 404 Not Found: Connection not found
- 409 Conflict: Connection already terminated
- 422 Unprocessable Entity: Cannot terminate with pending orders (when using certain options)

## Cooling-Off Period

After terminating a connection, there is a 30-day cooling-off period before you can request a new connection with the same organization. This prevents connection cycling and ensures terminations are deliberate decisions.