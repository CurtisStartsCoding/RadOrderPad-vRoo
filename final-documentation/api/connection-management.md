# Connection Management API Documentation

## Overview

Connection management endpoints allow organizations to establish partnerships with each other. Referring practices can connect with radiology groups to enable order routing. These endpoints are restricted to admin roles and maintain strict organization isolation.

## Base URL

All connection endpoints are prefixed with `/api/connections`

## Authentication

All endpoints require JWT authentication with admin roles:
- `admin_referring` - Administrators of referring practices
- `admin_radiology` - Administrators of radiology groups

## Connection Lifecycle

1. **Request**: Organization A sends a connection request to Organization B
2. **Pending**: Organization B sees the request in their pending requests list
3. **Approve/Reject**: Organization B approves or rejects the request
4. **Active**: If approved, both organizations can now exchange orders
5. **Terminated**: Either organization can terminate an active connection

## Endpoints

### 1. List Connections

Get all connections (active, pending, rejected, terminated) for your organization.

**Endpoint:** `GET /api/connections`

**Authorization:** Admin roles only (admin_referring, admin_radiology)

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Success Response:**
- **Status:** 200 OK
- **Body:**
```json
{
  "connections": [
    {
      "id": 1,
      "partnerOrgId": 2,
      "partnerOrgName": "Test Radiology Group",
      "status": "active",
      "isInitiator": true,
      "initiatedBy": "John Doe",
      "approvedBy": "Jane Smith",
      "notes": "Partnership request for imaging services",
      "createdAt": "2025-04-13T21:53:09.227Z",
      "updatedAt": "2025-06-13T00:43:49.958Z"
    }
  ]
}
```

**Response Fields:**
- `id`: Connection ID (used for approve/reject/terminate)
- `partnerOrgId`: ID of the partner organization
- `partnerOrgName`: Name of the partner organization
- `status`: Connection status - "pending", "active", "rejected", "terminated"
- `isInitiator`: Boolean - true if your org initiated the request
- `initiatedBy`: Name of the user who created the request
- `approvedBy`: Name of the user who approved (null if not approved)
- `notes`: Optional notes provided with the request

---

### 2. Create Connection Request

Send a connection request to another organization.

**Endpoint:** `POST /api/connections`

**Authorization:** Admin roles only (admin_referring, admin_radiology)

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "targetOrgId": 2,
  "notes": "Partnership request for imaging services"
}
```

**Body Parameters:**
- `targetOrgId` (number, required): ID of the organization to connect with
- `notes` (string, optional): Message to include with the request

**Success Response:**
- **Status:** 200 OK
- **Body:**
```json
{
  "success": true,
  "message": "Connection request sent successfully",
  "relationshipId": 1
}
```

**Error Responses:**
- **Status:** 400 Bad Request - Duplicate request
  ```json
  {
    "success": false,
    "message": "A pending connection request already exists between these organizations",
    "relationshipId": 1,
    "status": "pending"
  }
  ```
- **Status:** 400 Bad Request - Already connected
  ```json
  {
    "success": false,
    "message": "An active connection already exists between these organizations"
  }
  ```
- **Status:** 404 Not Found - Invalid target organization
  ```json
  {
    "message": "One or both organizations not found"
  }
  ```

**Notes:**
- Can only have one connection (any status) between two organizations at a time
- Cannot send a request if one already exists (must terminate/reject first)

---

### 3. List Incoming Connection Requests

Get pending connection requests sent to your organization.

**Endpoint:** `GET /api/connections/requests`

**Authorization:** Admin roles only (admin_referring, admin_radiology)

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Success Response:**
- **Status:** 200 OK
- **Body:**
```json
{
  "requests": [
    {
      "id": 1,
      "requestingOrgId": 1,
      "requestingOrgName": "Test Referring Practice",
      "initiatedBy": "John Doe",
      "notes": "Partnership request for imaging services",
      "createdAt": "2025-06-13T00:43:50.250Z"
    }
  ]
}
```

**Response Fields:**
- `id`: Request ID (use this for approve/reject)
- `requestingOrgId`: ID of the organization requesting connection
- `requestingOrgName`: Name of the requesting organization
- `initiatedBy`: Name of the user who initiated the request
- `notes`: Optional message from the requesting organization

**Notes:**
- Only shows pending requests where your organization is the recipient
- Does not show requests your organization has sent

---

### 4. Approve Connection Request

Approve a pending incoming connection request.

**Endpoint:** `POST /api/connections/:relationshipId/approve`

**Authorization:** Admin roles only (admin_referring, admin_radiology)

**URL Parameters:**
- `relationshipId` (number, required): ID from the connection request

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "notes": "Approved - ready to accept orders"
}
```

**Body Parameters:**
- `notes` (string, optional): Approval message/notes

**Success Response:**
- **Status:** 200 OK
- **Body:**
```json
{
  "success": true,
  "message": "Connection request approved successfully"
}
```

**Error Responses:**
- **Status:** 404 Not Found - Invalid request ID
- **Status:** 403 Forbidden - Cannot approve requests you initiated

**Notes:**
- Can only approve requests sent TO your organization
- Once approved, the connection becomes active for both organizations
- Both organizations can then see each other in their connections list

---

### 5. Reject Connection Request

Reject a pending incoming connection request.

**Endpoint:** `POST /api/connections/:relationshipId/reject`

**Authorization:** Admin roles only (admin_referring, admin_radiology)

**URL Parameters:**
- `relationshipId` (number, required): ID from the connection request

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "notes": "Not accepting new partners at this time"
}
```

**Body Parameters:**
- `notes` (string, optional): Rejection reason/message

**Success Response:**
- **Status:** 200 OK
- **Body:**
```json
{
  "success": true,
  "message": "Connection request rejected"
}
```

**Error Responses:**
- **Status:** 404 Not Found - Invalid request ID
- **Status:** 403 Forbidden - Cannot reject requests you initiated

**Notes:**
- Can only reject requests sent TO your organization
- Rejected connections can be seen in the connections list with status "rejected"
- To retry, the initiating organization must create a new request

---

### 6. Terminate Connection

Terminate an active connection with another organization.

**Endpoint:** `DELETE /api/connections/:relationshipId`

**Authorization:** Admin roles only (admin_referring, admin_radiology)

**URL Parameters:**
- `relationshipId` (number, required): ID of the connection to terminate

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Success Response:**
- **Status:** 200 OK
- **Body:**
```json
{
  "success": true,
  "message": "Connection terminated successfully"
}
```

**Error Responses:**
- **Status:** 404 Not Found - Connection not found
- **Status:** 400 Bad Request - Connection not active

**Notes:**
- Either organization can terminate an active connection
- Once terminated, a new connection request must be sent to reconnect
- Terminated connections appear in the list with status "terminated"

## Examples

### Example 1: Complete Connection Workflow

```javascript
// 1. Referring practice searches for radiology groups
const searchResponse = await axios.get(
  '/api/organizations?search=radiology&type=radiology_group',
  {
    headers: { 'Authorization': `Bearer ${adminReferringToken}` }
  }
);

// 2. Send connection request
const targetOrgId = searchResponse.data.data[0].id;
const requestResponse = await axios.post(
  '/api/connections',
  {
    targetOrgId: targetOrgId,
    notes: 'We would like to partner for MRI and CT imaging'
  },
  {
    headers: { 'Authorization': `Bearer ${adminReferringToken}` }
  }
);

// 3. Radiology group checks pending requests
const pendingResponse = await axios.get(
  '/api/connections/requests',
  {
    headers: { 'Authorization': `Bearer ${adminRadiologyToken}` }
  }
);

// 4. Radiology group approves the request
const requestId = pendingResponse.data.requests[0].id;
await axios.post(
  `/api/connections/${requestId}/approve`,
  { notes: 'Welcome! We look forward to working with you.' },
  {
    headers: { 'Authorization': `Bearer ${adminRadiologyToken}` }
  }
);

// 5. Both organizations can now see active connection
const activeConnections = await axios.get(
  '/api/connections',
  {
    headers: { 'Authorization': `Bearer ${adminReferringToken}` }
  }
);
```

### Example 2: Handling Connection States

```javascript
// Check current connections before requesting
const connections = await axios.get('/api/connections', {
  headers: { 'Authorization': `Bearer ${adminToken}` }
});

const existingConnection = connections.data.connections.find(
  conn => conn.partnerOrgId === targetOrgId
);

if (existingConnection) {
  switch (existingConnection.status) {
    case 'active':
      console.log('Already connected');
      break;
    case 'pending':
      console.log('Request already pending');
      break;
    case 'rejected':
    case 'terminated':
      console.log('Previous connection ended, can send new request');
      break;
  }
} else {
  // Safe to send new request
  await axios.post('/api/connections', {
    targetOrgId: targetOrgId,
    notes: 'Partnership request'
  });
}
```

### Example 3: Organization Search for Connections

```javascript
// Search for organizations by name or type
const searchByName = await axios.get(
  '/api/organizations?search=Premier',
  {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  }
);

// Filter by organization type
const radiologyGroups = await axios.get(
  '/api/organizations?type=radiology_group',
  {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  }
);

// Combine search and type filter
const specificSearch = await axios.get(
  '/api/organizations?search=imaging&type=radiology_group',
  {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  }
);
```

## Connection Rules

1. **One Connection Per Pair**: Only one connection record can exist between any two organizations
2. **Status Transitions**:
   - pending → active (via approval)
   - pending → rejected (via rejection)
   - active → terminated (via termination)
   - rejected/terminated → new request can be created
3. **Permissions**:
   - Any admin can create requests FROM their organization
   - Only admins can approve/reject requests TO their organization
   - Either organization can terminate an active connection
4. **Order Routing**: Orders can only be sent between organizations with active connections

## Security Considerations

1. **Organization Isolation**: Admins can only manage connections for their own organization
2. **Role-Based Access**: Only admin roles can manage connections
3. **Request Validation**: System validates both organizations exist and are active
4. **Audit Trail**: All connection changes are logged with user information

## Related Endpoints

- **Organization Search**: `/api/organizations` - Find organizations to connect with
- **Organization Management**: `/api/organizations/mine` - View your organization details
- **Order Management**: Orders can only be sent to connected organizations