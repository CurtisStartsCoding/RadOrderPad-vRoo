# Organization Profile Update Endpoint Implementation

The `PUT /api/organizations/mine` endpoint has been implemented and is now working correctly. This endpoint allows organization administrators to update their organization's profile information.

## Implementation Details

The implementation follows the modular, single-responsibility approach with proper validation and error handling:

1. A new service function `updateOrganizationProfile` was created in `src/services/organization/update-organization-profile.service.ts` that:
   - Handles updating organization profile data
   - Validates input fields
   - Uses queryMainDb for database operations
   - Returns the updated organization profile

2. The organization controller was updated with an `updateMyOrganizationController` method that:
   - Extracts allowed updatable fields from request body (name, npi, tax_id, address_line1, address_line2, city, state, zip_code, phone_number, fax_number, contact_email, website, logo_url)
   - Implements validation for request body fields
   - Adds proper error handling with appropriate HTTP status codes
   - Returns a 200 OK response with the updated organization profile on success

3. The organization routes were updated to add the PUT /mine route with:
   - authenticateJWT middleware to ensure only authenticated users can access the endpoint
   - authorizeRole middleware to restrict access to admin_referring and admin_radiology roles
   - JSDoc comments for API documentation

## Security Considerations

The endpoint is designed with security in mind:
- Only allows administrators to update their own organization's profile
- Restricts which fields can be updated (name, npi, tax_id, address_line1, address_line2, city, state, zip_code, phone_number, fax_number, contact_email, website, logo_url)
- Explicitly prevents updating sensitive fields like id, type, status, credit_balance, billing_id, subscription_tier, assigned_account_manager_id
- Validates email format and website URL format

## Testing

The implementation has been tested using the `test-update-org-mine.js` script, which:
- Tests successful organization profile updates
- Tests validation of input fields
- Tests handling of restricted fields
- Tests authentication and authorization requirements

Both batch (.bat) and shell (.sh) scripts have been created to run the test.

## Request Example

```javascript
// Example request to update organization profile
const response = await axios.put(
  'https://api.radorderpad.com/api/organizations/mine',
  {
    name: 'Updated Organization Name',
    npi: '1234567890',
    tax_id: '12-3456789',
    address_line1: '123 Main St',
    address_line2: 'Suite 100',
    city: 'San Francisco',
    state: 'CA',
    zip_code: '94105',
    phone_number: '555-123-4567',
    fax_number: '555-123-4568',
    contact_email: 'contact@example.com',
    website: 'https://example.com',
    logo_url: 'https://example.com/logo.png'
  },
  {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }
);
```

## Response Example

```json
{
  "success": true,
  "data": {
    "id": 123,
    "name": "Updated Organization Name",
    "npi": "1234567890",
    "tax_id": "12-3456789",
    "address_line1": "123 Main St",
    "address_line2": "Suite 100",
    "city": "San Francisco",
    "state": "CA",
    "zip_code": "94105",
    "phone_number": "555-123-4567",
    "fax_number": "555-123-4568",
    "contact_email": "contact@example.com",
    "website": "https://example.com",
    "logo_url": "https://example.com/logo.png",
    "type": "referring",
    "status": "active",
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-04-25T00:00:00.000Z"
  }
}
```

## Error Handling

The endpoint handles various error scenarios:

1. **Invalid Input**:
   - Returns 400 Bad Request with details about the validation errors
   - Example: Missing required fields, invalid email format, invalid website URL

2. **Authentication Errors**:
   - Returns 401 Unauthorized if the JWT token is missing or invalid
   - Example: Expired token, malformed token, missing token

3. **Authorization Errors**:
   - Returns 403 Forbidden if the user doesn't have the required role
   - Example: Non-admin users attempting to update organization profile

4. **Database Errors**:
   - Returns 500 Internal Server Error with a generic error message
   - Logs detailed error information for debugging

## Implementation Considerations

1. **Transaction Management**:
   - Uses a transaction to ensure atomicity of the update operation
   - Rolls back changes if any part of the update fails

2. **Audit Logging**:
   - Logs all organization profile updates for audit purposes
   - Includes user ID, organization ID, and timestamp

3. **Performance Optimization**:
   - Uses prepared statements to prevent SQL injection
   - Only updates fields that have changed
   - Returns the updated organization profile without requiring a separate query