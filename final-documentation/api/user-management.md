# User Management API Documentation

## Overview

The user management endpoints allow administrators to manage users within their organization. These endpoints are restricted to admin roles (admin_referring and admin_radiology) and enforce strict organization isolation - admins can only manage users within their own organization.

## Base URLs

- User endpoints: `/api/users`
- User invite endpoints: `/api/user-invites`

## Authentication

All endpoints require JWT authentication with admin roles:
- `admin_referring`
- `admin_radiology`

## Endpoints

### 1. List Organization Users

Get all users belonging to the authenticated admin's organization with filtering and pagination options.

**Endpoint:** `GET /api/users`

**Authorization:** Admin roles only (admin_referring, admin_radiology)

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20)
- `sortBy` (string, optional): Field to sort by (default: last_name)
- `sortOrder` (string, optional): Sort direction - 'asc' or 'desc' (default: asc)
- `role` (string, optional): Filter by role (e.g., 'physician', 'admin_staff')
- `status` (boolean, optional): Filter by active status (true/false)
- `name` (string, optional): Search by first or last name

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
  "data": {
    "users": [
      {
        "id": 4,
        "email": "test.admin_staff@example.com",
        "first_name": "Test",
        "last_name": "AdminStaff",
        "role": "admin_staff",
        "organization_id": 1,
        "is_active": true,
        "email_verified": true,
        "created_at": "2025-04-21T16:06:38.559Z",
        "updated_at": "2025-06-13T00:06:50.097Z",
        "specialty": "General Practice"
      }
    ],
    "pagination": {
      "total": 6,
      "page": 1,
      "limit": 20,
      "pages": 1
    }
  }
}
```

**Error Responses:**
- **Status:** 403 Forbidden - Non-admin role
  ```json
  {
    "message": "Access denied: Insufficient permissions",
    "requiredRoles": ["admin_referring", "admin_radiology"],
    "userRole": "physician"
  }
  ```

**Example Requests:**

```javascript
// Get all users
await axios.get('/api/users', {
  headers: { 'Authorization': `Bearer ${adminToken}` }
});

// Filter by role with pagination
await axios.get('/api/users?role=physician&page=1&limit=10', {
  headers: { 'Authorization': `Bearer ${adminToken}` }
});

// Search by name
await axios.get('/api/users?name=John', {
  headers: { 'Authorization': `Bearer ${adminToken}` }
});
```

---

### 2. Get User by ID

Get details of a specific user within the organization.

**Endpoint:** `GET /api/users/:userId`

**Authorization:** Admin roles only (admin_referring, admin_radiology)

**URL Parameters:**
- `userId` (number, required): ID of the user

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
  "data": {
    "id": 4,
    "email": "test.admin_staff@example.com",
    "first_name": "Test",
    "last_name": "AdminStaff",
    "role": "admin_staff",
    "organization_id": 1,
    "is_active": true,
    "email_verified": true,
    "created_at": "2025-04-21T16:06:38.559Z",
    "updated_at": "2025-06-13T00:37:08.453Z",
    "specialty": "General Practice"
  }
}
```

**Error Responses:**
- **Status:** 400 Bad Request - Invalid user ID format
  ```json
  {
    "success": false,
    "message": "Invalid user ID format"
  }
  ```
- **Status:** 404 Not Found - User not found or in different organization
  ```json
  {
    "success": false,
    "message": "User not found or not in your organization"
  }
  ```

---

### 3. Invite New User

Send an invitation to a new user to join the organization.

**Endpoint:** `POST /api/user-invites/invite`

**Authorization:** Admin roles only (admin_referring, admin_radiology)

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "new.user@example.com",
  "role": "physician"
}
```

**Body Parameters:**
- `email` (string, required): Valid email address for the new user
- `role` (string, required): Role to assign - must be one of:
  - For admin_referring: 'physician', 'admin_staff'
  - For admin_radiology: 'scheduler', 'radiologist'

**Success Response:**
- **Status:** 200 OK
- **Body:**
```json
{
  "success": true,
  "message": "Invitation sent successfully"
}
```

**Error Responses:**
- **Status:** 400 Bad Request - Invalid email format
  ```json
  {
    "success": false,
    "message": "Invalid email format"
  }
  ```
- **Status:** 400 Bad Request - Invalid role
  ```json
  {
    "success": false,
    "message": "Invalid role. Valid roles are: physician, admin_staff, scheduler, radiologist"
  }
  ```
- **Status:** 409 Conflict - User already exists
  ```json
  {
    "success": false,
    "message": "User with this email already exists in this organization"
  }
  ```

**Notes:**
- Currently, invitations don't send actual emails in test mode
- The system prevents duplicate emails within the same organization
- Admins cannot create super_admin users

---

### 4. Update User Profile

Update a user's profile information within the organization.

**Endpoint:** `PUT /api/users/:userId`

**Authorization:** Admin roles only (admin_referring, admin_radiology)

**URL Parameters:**
- `userId` (number, required): ID of the user to update

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "Updated",
  "lastName": "Name",
  "phoneNumber": "555-1234",
  "specialty": "Cardiology",
  "npi": "1234567890",
  "role": "physician",
  "isActive": true
}
```

**Body Parameters (all optional):**
- `firstName` (string): User's first name
- `lastName` (string): User's last name
- `phoneNumber` (string): Phone number
- `specialty` (string): Medical specialty
- `npi` (string): National Provider Identifier
- `role` (string): User role (restricted to roles the admin can assign)
- `isActive` (boolean): Whether the account is active

**Success Response:**
- **Status:** 200 OK
- **Body:**
```json
{
  "success": true,
  "message": "User profile updated successfully",
  "data": {
    "id": 9,
    "email": "test.admin_referring@example.com",
    "first_name": "Updated",
    "last_name": "Name",
    "role": "admin_referring",
    "organization_id": 1,
    "is_active": true,
    "email_verified": true,
    "created_at": "2025-04-22T16:51:07.445Z",
    "updated_at": "2025-06-13T00:34:35.191Z",
    "specialty": "Updated Specialty"
  }
}
```

**Error Responses:**
- **Status:** 400 Bad Request - Unauthorized role assignment
  ```json
  {
    "success": false,
    "message": "You are not authorized to assign the 'super_admin' role. Allowed roles: physician, admin_staff"
  }
  ```
- **Status:** 404 Not Found - User not found or in different organization
  ```json
  {
    "success": false,
    "message": "User not found or not in your organization"
  }
  ```

**Role Assignment Rules:**
- admin_referring can assign: physician, admin_staff
- admin_radiology can assign: scheduler, radiologist
- Cannot assign admin roles or super_admin

---

### 5. Deactivate User

Deactivate a user account (soft delete). The user will no longer be able to log in.

**Endpoint:** `DELETE /api/users/:userId`

**Authorization:** Admin roles only (admin_referring, admin_radiology)

**URL Parameters:**
- `userId` (number, required): ID of the user to deactivate

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
  "message": "User deactivated successfully"
}
```

**Error Responses:**
- **Status:** 400 Bad Request - Attempting to deactivate self
  ```json
  {
    "success": false,
    "message": "Administrators cannot deactivate their own account"
  }
  ```
- **Status:** 404 Not Found - User not found or in different organization
  ```json
  {
    "success": false,
    "message": "User not found or not in your organization"
  }
  ```

**Notes:**
- This is a soft delete - the user record remains in the database
- Deactivating an already inactive user returns success
- Administrators cannot deactivate their own account
- To reactivate, use the update endpoint with `isActive: true`

---

### 6. Get Current User Profile

Get the profile of the currently authenticated user.

**Endpoint:** `GET /api/users/me`

**Authorization:** Any authenticated user

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
  "data": {
    "id": 9,
    "email": "test.admin_referring@example.com",
    "firstName": "Test",
    "lastName": "Admin",
    "role": "admin_referring",
    "orgId": 1,
    "organizationName": "Test Referring Practice",
    "isActive": true,
    "emailVerified": true
  }
}
```

---

### 7. Update Current User Profile

Update the profile of the currently authenticated user.

**Endpoint:** `PUT /api/users/me`

**Authorization:** Any authenticated user

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "Updated",
  "lastName": "Name",
  "phoneNumber": "555-1234",
  "specialty": "Cardiology",
  "npi": "1234567890"
}
```

**Body Parameters (all optional):**
- `firstName` (string): User's first name
- `lastName` (string): User's last name
- `phoneNumber` (string): Phone number
- `specialty` (string): Medical specialty
- `npi` (string): National Provider Identifier

**Note:** Users cannot change their own role or active status through this endpoint.

## Examples

### Example 1: Complete User Onboarding Flow

```javascript
// 1. Invite a new physician
const inviteResponse = await axios.post(
  '/api/user-invites/invite',
  {
    email: 'dr.smith@example.com',
    role: 'physician'
  },
  {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  }
);

// 2. After user accepts invitation and creates account, assign them to locations
const userId = newUserId; // From invitation acceptance
await axios.post(
  `/api/users/${userId}/locations/81`,
  {},
  {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  }
);

// 3. Update their profile with additional information
await axios.put(
  `/api/users/${userId}`,
  {
    specialty: 'Internal Medicine',
    npi: '1234567890'
  },
  {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  }
);
```

### Example 2: Bulk User Management

```javascript
// Get all active physicians
const response = await axios.get(
  '/api/users?role=physician&status=true',
  {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  }
);

// Process each physician
for (const user of response.data.data.users) {
  if (!user.specialty) {
    // Update missing specialty
    await axios.put(
      `/api/users/${user.id}`,
      { specialty: 'General Practice' },
      {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      }
    );
  }
}
```

### Example 3: User Deactivation with Audit

```javascript
// Get user details before deactivation
const userResponse = await axios.get(
  `/api/users/${userId}`,
  {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  }
);

console.log('Deactivating user:', userResponse.data.data.email);

// Deactivate the user
await axios.delete(
  `/api/users/${userId}`,
  {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  }
);

console.log('User deactivated successfully');
```

## Security Considerations

1. **Organization Isolation**: All operations are strictly limited to users within the admin's organization
2. **Role-Based Access**: Only admin roles can access these endpoints
3. **Self-Protection**: Admins cannot deactivate their own accounts
4. **Role Assignment Limits**: Admins can only assign specific roles, not admin or super_admin roles
5. **Email Uniqueness**: Email addresses must be unique within an organization

## Related Endpoints

- **User-Location Assignment**: `/api/users/:userId/locations` - Manage location access
- **Organization Management**: `/api/organizations/mine` - View organization details
- **Authentication**: `/api/auth` - User login and registration