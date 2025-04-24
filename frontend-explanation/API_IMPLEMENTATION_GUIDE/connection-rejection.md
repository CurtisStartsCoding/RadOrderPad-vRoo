# Connection Rejection API

## Overview

The Connection Rejection API allows an admin user (admin_referring or admin_radiology) to reject a pending connection request from another organization. This endpoint updates the relationship status to 'rejected' and notifies the initiating organization.

## Testing the Endpoint

Before testing the rejection endpoint, you must ensure there is a pending relationship in the database:

1. Use the `scripts/create-pending-relationship.js` script to set a relationship to pending status:
   ```bash
   node scripts/create-pending-relationship.js
   ```
   This script will:
   - Find an existing relationship or create a new one
   - Set its status to 'pending'
   - Output the relationship ID to use for testing

2. Update the `TEST_PENDING_RELATIONSHIP_ID` in `.env.test` with the relationship ID from step 1

3. Run the test script:
   ```bash
   # Using the JavaScript test
   node debug-scripts/vercel-tests/test-connection-reject.js
   
   # Or using the batch file (Windows)
   debug-scripts/vercel-tests/test-connection-reject.bat
   
   # Or using the shell script (Unix)
   ./debug-scripts/vercel-tests/test-connection-reject.sh
   ```

4. Verify the response shows a successful rejection with status code 200

## Endpoint

```
POST /api/connections/{relationshipId}/reject
```

## Authentication

- Requires a valid JWT token
- User must have one of the following roles:
  - `admin_referring`
  - `admin_radiology`

## Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| relationshipId | number | The ID of the relationship to reject |

## Request Body

No request body is required.

## Response

### Success Response

**Status Code**: 200 OK

**Response Body**:
```json
{
  "success": true,
  "message": "Connection request rejected successfully",
  "relationshipId": 1
}
```

### Error Responses

**Status Code**: 400 Bad Request
- If the relationshipId is invalid or not a number

**Status Code**: 401 Unauthorized
- If the user is not authenticated

**Status Code**: 403 Forbidden
- If the user does not have the required role

**Status Code**: 404 Not Found
- If the relationship does not exist
- If the relationship is not in pending status
- If the user's organization is not the target of the request

**Status Code**: 500 Internal Server Error
- If there is a server error

## Implementation Details

The connection rejection endpoint is implemented with the following components:

### Controller (src/controllers/connection/reject.controller.ts)
- Extracts and validates the relationship ID from request parameters
- Extracts the user's ID and organization ID from the JWT token
- Calls the service function with these parameters
- Handles errors and returns appropriate HTTP status codes:
  - 400 for invalid relationship ID
  - 404 for relationship not found or not in pending status
  - 500 for server errors

### Service (src/services/connection/services/reject-connection.ts)
- Uses a database transaction to ensure data consistency
- Fetches the relationship to verify it exists, is in pending status, and the user's organization is the target
- Updates the relationship status to 'rejected'
- Sends a notification to the initiating organization
- Returns a success response

### Database Queries
- GET_RELATIONSHIP_FOR_APPROVAL_QUERY: Fetches the relationship with its associated organization details
- REJECT_RELATIONSHIP_QUERY: Updates the relationship status to 'rejected' and sets approved_by_id

### Notification
- Uses the notification manager to send a rejection notification to the initiating organization
- The notification includes the name of the organization that requested the connection

### Key Fix
The implementation was fixed by updating the import path in the reject-connection.ts file:
```typescript
// Changed from
import notificationManager from '../../notification';

// To
import notificationManager from '../../notification/manager';
```

This ensures the notification manager is properly imported and can send notifications when a connection is rejected.

## Example Usage

```javascript
// Example using fetch API
const rejectConnection = async (relationshipId, token) => {
  try {
    const response = await fetch(`/api/connections/${relationshipId}/reject`, {
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
    return data;
  } catch (error) {
    console.error('Failed to reject connection:', error);
    throw error;
  }
};