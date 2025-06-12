# Organization Management API Endpoints

**Version:** 1.0  
**Date:** June 12, 2025  
**Roles:** admin_referring, admin_radiology  

This document provides accurate documentation for organization management endpoints based on the actual code implementation.

---

## Table of Contents

1. [Organization Registration](#organization-registration)
2. [Get Organization Profile](#get-organization-profile)
3. [Update Organization Profile](#update-organization-profile)
4. [Search Organizations](#search-organizations)

---

## Organization Registration

Register a new organization and create the admin user.

**Endpoint:** `POST /api/auth/register`

**Authorization:** Public (no authentication required)

**Request Body:**
```json
{
  "organization": {
    "name": "ABC Medical Group",
    "type": "referring_practice",  // or "radiology_group"
    "npi": "1234567890",
    "tax_id": "12-3456789",
    "address_line1": "123 Main St",
    "address_line2": "Suite 100",
    "city": "Anytown",
    "state": "CA",
    "zip_code": "12345",
    "phone_number": "555-123-4567",
    "fax_number": "555-123-4568",
    "contact_email": "contact@abcmedical.com",
    "website": "https://abcmedical.com"
  },
  "user": {
    "email": "admin@abcmedical.com",
    "password": "SecurePassword123!",
    "first_name": "John",
    "last_name": "Smith",
    "npi": "1234567890",
    "specialty": "Internal Medicine",
    "phone_number": "555-123-4567"
  },
  "captchaToken": "recaptcha-token-here"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "admin@abcmedical.com",
    "firstName": "John",
    "lastName": "Smith",
    "role": "admin_referring",  // auto-assigned based on org type
    "organizationId": 1
  },
  "organization": {
    "id": 1,
    "name": "ABC Medical Group",
    "type": "referring_practice",
    "status": "pending_verification"
  },
  "message": "Registration successful. Please check your email to verify your account."
}
```

**Notes:**
- Organization type must be either `referring_practice` or `radiology_group`
- Admin role is automatically assigned:
  - `referring_practice` → `admin_referring`
  - `radiology_group` → `admin_radiology`
- Organization starts with status `pending_verification`
- A Stripe customer is automatically created
- Verification email is sent to the user

---

## Get Organization Profile

Retrieve details of the authenticated user's organization.

**Endpoint:** `GET /api/organizations/mine`

**Authorization:** Requires authentication (any role)

**Response:**
```json
{
  "success": true,
  "data": {
    "organization": {
      "id": 1,
      "name": "ABC Medical Group",
      "type": "referring_practice",
      "npi": "1234567890",
      "tax_id": "12-3456789",
      "address_line1": "123 Main St",
      "address_line2": "Suite 100",
      "city": "Anytown",
      "state": "CA",
      "zip_code": "12345",
      "phone_number": "555-123-4567",
      "fax_number": "555-123-4568",
      "contact_email": "contact@abcmedical.com",
      "website": "https://abcmedical.com",
      "logo_url": null,
      "billing_id": "cus_Qx1234567890",
      "credit_balance": 500,
      "basic_credit_balance": 0,
      "advanced_credit_balance": 0,
      "subscription_tier": "tier_1",
      "status": "active",
      "created_at": "2025-06-01T12:00:00.000Z",
      "updated_at": "2025-06-11T15:30:00.000Z"
    },
    "locations": [
      {
        "id": 1,
        "organization_id": 1,
        "name": "Main Office",
        "address_line1": "123 Main St",
        "address_line2": "Suite 100",
        "city": "Anytown",
        "state": "CA",
        "zip_code": "12345",
        "phone_number": "555-123-4567",
        "is_active": true,
        "created_at": "2025-06-01T12:00:00.000Z",
        "updated_at": "2025-06-01T12:00:00.000Z"
      }
    ],
    "users": [
      {
        "id": 1,
        "email": "admin@abcmedical.com",
        "firstName": "John",
        "lastName": "Smith",
        "role": "admin_referring",
        "npi": "1234567890",
        "specialty": "Internal Medicine",
        "phone_number": "555-123-4567",
        "organization_id": 1,
        "created_at": "2025-06-01T12:00:00.000Z",
        "updated_at": "2025-06-11T15:30:00.000Z",
        "last_login": "2025-06-11T14:00:00.000Z",
        "email_verified": true,
        "is_active": true
      }
    ]
  }
}
```

**Notes:**
- Returns complete organization details including all credit balances
- Includes all active locations for the organization
- Includes all users in the organization
- Available to any authenticated user (they can only see their own organization)

---

## Update Organization Profile

Update details of the authenticated user's organization.

**Endpoint:** `PUT /api/organizations/mine`

**Authorization:** Requires `admin_referring` or `admin_radiology` role

**Request Body:**
```json
{
  "name": "ABC Medical Group Updated",
  "npi": "1234567890",
  "tax_id": "12-3456789",
  "address_line1": "456 New Street",
  "address_line2": "Suite 200",
  "city": "Newtown",
  "state": "CA",
  "zip_code": "54321",
  "phone_number": "555-987-6543",
  "fax_number": "555-987-6544",
  "contact_email": "newcontact@abcmedical.com",
  "website": "https://new.abcmedical.com",
  "logo_url": "https://cdn.example.com/logo.png"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Organization profile updated successfully",
  "data": {
    "id": 1,
    "name": "ABC Medical Group Updated",
    "type": "referring_practice",
    "npi": "1234567890",
    "address_line1": "456 New Street",
    "address_line2": "Suite 200",
    "city": "Newtown",
    "state": "CA",
    "zip_code": "54321",
    "phone_number": "555-987-6543",
    "contact_email": "newcontact@abcmedical.com",
    "website": "https://new.abcmedical.com",
    "logo_url": "https://cdn.example.com/logo.png",
    "status": "active",
    "created_at": "2025-06-01T12:00:00.000Z",
    "updated_at": "2025-06-12T21:45:00.000Z"
  }
}
```

**Response Notes:**
- The response includes only the organization profile fields, not credit balances or billing information
- The `updated_at` timestamp is automatically updated
- To get the complete organization data including credits, use GET /api/organizations/mine

**Validation Rules:**
- Organization name cannot be empty if provided
- Email must be valid format if provided
- Website must be valid URL if provided

**Restricted Fields:**
The following fields are automatically filtered out and ignored if included in the request:
- `id`, `type`, `status`, `credit_balance`, `basic_credit_balance`, `advanced_credit_balance`
- `billing_id`, `subscription_tier`, `assigned_account_manager_id`
- Any unrecognized fields

**Note:** Including restricted fields will not cause an error; they are simply ignored. The update will proceed with only the allowed fields.

**Error Responses:**
- 400: Invalid update data or validation failure
- 401: Not authenticated
- 403: User doesn't have admin role
- 404: Organization not found

---

## Search Organizations

Search for potential partner organizations for connection requests.

**Endpoint:** `GET /api/organizations`

**Authorization:** Requires `admin_referring` or `admin_radiology` role

**Query Parameters:**
- `name` (optional): Filter by organization name (partial match)
- `npi` (optional): Filter by NPI number (exact match)
- `type` (optional): Filter by organization type (`referring_practice` or `radiology_group`)
- `city` (optional): Filter by city (partial match)
- `state` (optional): Filter by state (exact match)

**Example:** `GET /api/organizations?type=radiology_group&state=CA`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "name": "City Imaging Center",
      "type": "radiology_group",
      "npi": "0987654321",
      "address_line1": "789 Imaging Blvd",
      "city": "Los Angeles",
      "state": "CA",
      "zip_code": "90001",
      "phone_number": "555-456-7890",
      "contact_email": "info@cityimaging.com",
      "website": "https://cityimaging.com",
      "logo_url": null,
      "status": "active",
      "created_at": "2025-05-15T10:00:00.000Z"
    }
  ]
}
```

**Notes:**
- Returns up to 50 organizations
- Excludes the requesting user's own organization
- Only returns active organizations
- Results are ordered by organization name

---

## Location Management

See [location-management.md](./location-management.md) for endpoints related to managing organization locations.

---

## Common Error Responses

All endpoints may return these error responses:

- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: User lacks required role/permissions
- **500 Internal Server Error**: Server error occurred

Error response format:
```json
{
  "success": false,
  "message": "Error description"
}
```