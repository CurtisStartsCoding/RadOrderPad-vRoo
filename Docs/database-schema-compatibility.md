# Database Schema Compatibility Issue

## Problem

We encountered an issue with the `/api/organizations/mine` endpoint failing with a 500 error and the message:

```
Error: column "status" does not exist
```

This occurred because the code was attempting to query the `status` column from the `users` table, but this column doesn't exist in the production database.

## Root Cause

The issue was in the `getMyOrganization` service function, which was trying to select the `status` column from the `users` table:

```typescript
// Original problematic code
const usersResult = await queryMainDb(
  `SELECT 
     id, email, first_name as "firstName", last_name as "lastName", 
     role, status, npi, specialty, phone_number, organization_id,
     created_at, updated_at, last_login, email_verified
   FROM users
   WHERE organization_id = $1
   ORDER BY last_name, first_name`,
  [orgId]
);
```

## Solution

We fixed the issue by:

1. Removing the `status` column from the SQL query for users
2. Adding a default `status: 'active'` value to each user after retrieving them from the database

```typescript
// Fixed code
const usersResult = await queryMainDb(
  `SELECT 
     id, email, first_name as "firstName", last_name as "lastName", 
     role, npi, specialty, phone_number, organization_id,
     created_at, updated_at, last_login, email_verified
   FROM users
   WHERE organization_id = $1
   ORDER BY last_name, first_name`,
  [orgId]
);

// Add default status value to each user
const usersWithStatus = usersResult.rows.map(user => {
  return {
    ...user,
    status: 'active' // Default status value
  };
});
```

## Prevention

To prevent similar issues in the future:

1. **Be cautious with schema assumptions**: Don't assume that all columns exist in all environments.

2. **Add default values**: When a column might not exist, provide default values after retrieving data.

3. **Use enhanced logging**: Log detailed information about database operations to help diagnose issues.

4. **Test in all environments**: Ensure that code is tested in all environments before deployment.

5. **Document schema differences**: Keep documentation of schema differences between environments up to date.