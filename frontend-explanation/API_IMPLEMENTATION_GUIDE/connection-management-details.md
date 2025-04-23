# Connection Management Details

This section covers endpoints related to managing connections between organizations in the RadOrderPad system.

## Get Connection Requests

**Endpoint:** `GET /api/connections/requests`

**Description:** Retrieves a list of pending connection requests for the user's organization.

**Authentication:** Required (admin_radiology role)

**Response:**
```json
{
  "requests": [
    {
      "id": 1,
      "sourceOrganizationId": 3,
      "sourceOrganizationName": "ABC Medical Group",
      "targetOrganizationId": 2,
      "targetOrganizationName": "XYZ Radiology",
      "status": "pending",
      "createdAt": "2025-04-01T12:00:00.000Z"
    }
  ]
}
```

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the admin_radiology role
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to display a list of pending connection requests for the user's organization.
- Use this endpoint when implementing the connection management view.

**Implementation Status:**
- **Status:** Exists but has implementation issues
- **Tested With:** test-all-missing-endpoints.js
- **Error:** Returns 500 "Internal server error"

## Approve Connection Request

**Endpoint:** `POST /api/connections/{relationshipId}/approve`

**Description:** Approves a pending connection request.

**Authentication:** Required (admin_radiology role)

**URL Parameters:**
- relationshipId: The ID of the relationship to approve

**Response:**
```json
{
  "success": true,
  "message": "Connection request approved",
  "relationship": {
    "id": 1,
    "sourceOrganizationId": 3,
    "sourceOrganizationName": "ABC Medical Group",
    "targetOrganizationId": 2,
    "targetOrganizationName": "XYZ Radiology",
    "status": "active",
    "updatedAt": "2025-04-22T12:00:00.000Z"
  }
}
```

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the admin_radiology role
- 404 Not Found: If the relationship does not exist
- 500 Internal Server Error: If the relationship is not in pending status or other server error

**Usage Notes:**
- This endpoint is used to approve a pending connection request.
- The relationship must be in the "pending" status.
- The user's organization must be the target organization of the relationship.

**Implementation Status:**
- **Status:** Exists but has implementation issues
- **Tested With:** test-all-missing-endpoints.js
- **Error:** Returns 500 "Internal server error"

## Reject Connection Request

**Endpoint:** `POST /api/connections/{relationshipId}/reject`

**Description:** Rejects a pending connection request.

**Authentication:** Required (admin_radiology role)

**URL Parameters:**
- relationshipId: The ID of the relationship to reject

**Response:**
```json
{
  "success": true,
  "message": "Connection request rejected",
  "relationship": {
    "id": 1,
    "sourceOrganizationId": 3,
    "sourceOrganizationName": "ABC Medical Group",
    "targetOrganizationId": 2,
    "targetOrganizationName": "XYZ Radiology",
    "status": "rejected",
    "updatedAt": "2025-04-22T12:00:00.000Z"
  }
}
```

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the admin_radiology role
- 404 Not Found: If the relationship does not exist
- 500 Internal Server Error: If the relationship is not in pending status or other server error

**Usage Notes:**
- This endpoint is used to reject a pending connection request.
- The relationship must be in the "pending" status.
- The user's organization must be the target organization of the relationship.

**Implementation Status:**
- **Status:** Exists but has implementation issues
- **Tested With:** test-all-missing-endpoints.js
- **Error:** Returns 500 "Internal server error"

## Delete Connection

**Endpoint:** `DELETE /api/connections/{relationshipId}`

**Description:** Deletes an active connection between organizations.

**Authentication:** Required (admin_radiology role)

**URL Parameters:**
- relationshipId: The ID of the relationship to delete

**Response:**
```json
{
  "success": true,
  "message": "Connection deleted successfully"
}
```

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the admin_radiology role
- 404 Not Found: If the relationship does not exist
- 500 Internal Server Error: If the relationship is not in active status or other server error

**Usage Notes:**
- This endpoint is used to delete an active connection between organizations.
- The relationship must be in the "active" status.
- The user's organization must be either the source or target organization of the relationship.

**Implementation Status:**
- **Status:** Exists but has implementation issues
- **Tested With:** test-all-missing-endpoints.js
- **Error:** Returns 500 "Internal server error"