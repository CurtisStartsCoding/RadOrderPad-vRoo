# Connection Management API Endpoints

This document provides comprehensive documentation for all connection management endpoints in the RadOrderPad system. These endpoints allow organizations to establish, manage, and terminate connections with each other.

## Overview

Connection management is restricted to admin roles:
- `admin_referring` - Administrators of referring practices
- `admin_radiology` - Administrators of radiology practices

All endpoints require JWT authentication and appropriate role authorization.

---

## 1. List Established Connections

**GET** `/api/connections`

Lists all active and pending connections for the authenticated user's organization.

### Authorization
- Roles: `admin_referring`, `admin_radiology`
- JWT Required: Yes

### Response Schema
```typescript
{
  success: boolean;
  connections: Array<{
    id: number;
    partnerOrgId: number;
    partnerOrgName: string;
    status: 'pending' | 'active' | 'rejected' | 'terminated';
    isInitiator: boolean;
    initiatedBy: string | null;
    approvedBy: string | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
  }>;
}
```

### Code Location
- Route: `/src/routes/connection.routes.ts` (line 14)
- Controller: `/src/controllers/connection/list/list-connections.ts`
- Service: `/src/services/connection/index.ts`

---

## 2. Search Organizations

**GET** `/api/organizations`

Search for organizations to connect with. Excludes the requesting organization and inactive organizations.

### Authorization
- Roles: `admin_referring`, `admin_radiology`
- JWT Required: Yes

### Query Parameters
- `name` (optional): Organization name (partial match)
- `npi` (optional): National Provider Identifier (exact match)
- `type` (optional): Organization type (exact match)
- `city` (optional): City name (partial match)
- `state` (optional): State code (exact match)

### Response Schema
```typescript
{
  success: boolean;
  data: Array<{
    id: number;
    name: string;
    type: string;
    npi: string;
    address_line1: string;
    city: string;
    state: string;
    zip_code: string;
    phone_number: string;
    contact_email: string;
    website: string;
    logo_url: string;
    status: string;
    created_at: Date;
  }>;
}
```

### Example Request
```
GET /api/organizations?name=radiology&state=CA&type=radiology
```

### Code Location
- Route: `/src/routes/organization.routes.ts` (line 17)
- Controller: `/src/controllers/organization/search-organizations.controller.ts`
- Service: `/src/services/organization/search-organizations.service.ts`

---

## 3. Request Connection

**POST** `/api/connections`

Request a new connection with another organization.

### Authorization
- Roles: `admin_referring`, `admin_radiology`
- JWT Required: Yes

### Request Body
```typescript
{
  targetOrgId: number;  // ID of the organization to connect with
  notes?: string;       // Optional notes about the connection request
}
```

### Response Schema
```typescript
{
  success: boolean;
  message: string;
  relationshipId: number;
  status?: 'pending' | 'active' | 'rejected' | 'terminated';
}
```

### Status Codes
- 201: Connection request created successfully
- 400: Bad request (e.g., trying to connect to own organization, connection already exists)
- 401: Unauthorized
- 500: Server error

### Code Location
- Route: `/src/routes/connection.routes.ts` (line 17)
- Controller: `/src/controllers/connection/request.controller.ts`
- Service: `/src/services/connection/services/request-connection.ts`

---

## 4. List Incoming Connection Requests

**GET** `/api/connections/requests`

List all pending incoming connection requests for the authenticated user's organization.

### Authorization
- Roles: `admin_referring`, `admin_radiology`
- JWT Required: Yes

### Response Schema
```typescript
{
  success: boolean;
  requests: Array<{
    id: number;
    initiatingOrgId: number;
    initiatingOrgName: string;
    initiatedBy: string | null;
    initiatorEmail: string | null;
    notes: string | null;
    createdAt: Date;
  }>;
}
```

### Code Location
- Route: `/src/routes/connection.routes.ts` (line 20)
- Controller: `/src/controllers/connection/list/list-incoming-requests.ts`
- Service: `/src/services/connection/index.ts`

---

## 5. Approve Connection Request

**POST** `/api/connections/:relationshipId/approve`

Approve a pending incoming connection request.

### Authorization
- Roles: `admin_referring`, `admin_radiology`
- JWT Required: Yes
- Note: Only the target organization can approve a connection request

### Path Parameters
- `relationshipId`: The ID of the connection relationship to approve

### Response Schema
```typescript
{
  success: boolean;
  message: string;
  relationshipId: number;
  status: 'active';
}
```

### Status Codes
- 200: Connection approved successfully
- 404: Connection request not found or not authorized
- 500: Server error

### Code Location
- Route: `/src/routes/connection.routes.ts` (line 23)
- Controller: `/src/controllers/connection/approve.controller.ts`
- Service: `/src/services/connection/services/approve-connection.ts`

---

## 6. Reject Connection Request

**POST** `/api/connections/:relationshipId/reject`

Reject a pending incoming connection request.

### Authorization
- Roles: `admin_referring`, `admin_radiology`
- JWT Required: Yes
- Note: Only the target organization can reject a connection request

### Path Parameters
- `relationshipId`: The ID of the connection relationship to reject

### Response Schema
```typescript
{
  success: boolean;
  message: string;
  relationshipId: number;
  status: 'rejected';
}
```

### Status Codes
- 200: Connection rejected successfully
- 404: Connection request not found or not authorized
- 500: Server error

### Code Location
- Route: `/src/routes/connection.routes.ts` (line 26)
- Controller: `/src/controllers/connection/reject.controller.ts`
- Service: `/src/services/connection/services/reject-connection.ts`

---

## 7. Terminate Connection

**DELETE** `/api/connections/:relationshipId`

Terminate an active connection between organizations.

### Authorization
- Roles: `admin_referring`, `admin_radiology`
- JWT Required: Yes
- Note: Either organization in an active connection can terminate it

### Path Parameters
- `relationshipId`: The ID of the connection relationship to terminate

### Response Schema
```typescript
{
  success: boolean;
  message: string;
  relationshipId: number;
  status: 'terminated';
}
```

### Status Codes
- 200: Connection terminated successfully
- 404: Connection not found or not authorized
- 500: Server error

### Code Location
- Route: `/src/routes/connection.routes.ts` (line 29)
- Controller: `/src/controllers/connection/terminate.controller.ts`
- Service: `/src/services/connection/services/terminate-connection.ts`

---

## Connection Workflow

1. **Discovery**: Admin uses the search organizations endpoint to find potential partners
2. **Request**: Admin sends a connection request to the desired organization
3. **Review**: Target organization reviews incoming requests
4. **Decision**: Target organization approves or rejects the request
5. **Active**: Once approved, both organizations can exchange data
6. **Termination**: Either organization can terminate the connection at any time

## Error Handling

All endpoints follow a consistent error response format:

```typescript
{
  success: false;
  message: string;  // Human-readable error message
  error?: {         // Additional error details (development only)
    code: string;
    details: any;
  }
}
```

## Notes

- All connections are bidirectional once approved
- Connection status transitions: `pending` → `active` | `rejected` | `terminated`
- Terminated connections cannot be reactivated; a new connection request must be made
- The system prevents duplicate connection requests between the same organizations
- Email notifications are sent for connection requests, approvals, rejections, and terminations

## Related Documentation

- [Authentication & Authorization](./auth-endpoints.md)
- [Organization Management](./organization-endpoints.md)
- [Notification Service](../services/notification-service.md)
- [Database Schema - Organization Relationships](../database/schema-organization-relationships.md)