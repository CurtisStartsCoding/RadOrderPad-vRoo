# Location Permissions Testing Guide

## Overview

These scripts help troubleshoot permissions issues with the new organization locations endpoint:
`GET /api/organizations/:orgId/locations`

## Scripts Created

### 1. `create-test-users-for-permissions.js`
Creates a complete test environment with:
- 4 test organizations (2 referring, 2 radiology)
- 8 test users with different roles
- Multiple locations per organization
- Connection requests between organizations

### 2. `approve-test-connections.js`
Approves pending connection requests so organizations can access each other's locations.

### 3. `test-location-permissions.js`
Runs comprehensive permission tests to verify:
- Admins can view their own locations
- Admins can view connected organization locations
- Admins cannot view non-connected organization locations
- Non-admins cannot access the endpoint
- Connections work bidirectionally

### 4. `diagnose-frontend-permissions.js`
Simulates frontend API calls and provides detailed debugging information:
- Shows exact request/response details
- Tests different authorization header formats
- Identifies common frontend integration issues

### 5. `run-permissions-test-suite.bat`
Runs all scripts in sequence for easy testing.

## Quick Start

1. **Run the complete test suite:**
   ```bash
   cd debug-scripts
   run-permissions-test-suite.bat
   ```

2. **Or run scripts individually:**
   ```bash
   # Create test environment
   node create-test-users-for-permissions.js
   
   # Approve connections
   node approve-test-connections.js
   
   # Test permissions
   node test-location-permissions.js
   ```

3. **For frontend debugging:**
   ```bash
   node diagnose-frontend-permissions.js
   ```

## Test Users Created

### Referring Organizations

**Test Referring Clinic A:**
- Admin: `admin.clinica@test.com` (password: `TestPass123!`)
- Staff: `staff.clinica@test.com` (password: `TestPass123!`)
- Physician: `doc.clinica@test.com` (password: `TestPass123!`)

**Test Referring Clinic B:**
- Admin: `admin.clinicb@test.com` (password: `TestPass123!`)
- Staff: `staff.clinicb@test.com` (password: `TestPass123!`)

### Radiology Organizations

**Test Radiology Center X:**
- Admin: `admin.radx@test.com` (password: `TestPass123!`)
- Scheduler: `scheduler.radx@test.com` (password: `TestPass123!`)

**Test Radiology Center Y:**
- Admin: `admin.rady@test.com` (password: `TestPass123!`)

## Expected Connections

After running the scripts:
- Clinic A → Radiology X (active)
- Clinic A → Radiology Y (active)
- Clinic B → Radiology X (active)
- Clinic B → Radiology Y (no connection)

## Common Issues & Solutions

### Issue: Getting 403 Forbidden

**Check:**
1. Is the connection active? (not pending)
2. Is the user an admin? (admin_referring or admin_radiology)
3. Is the Authorization header formatted correctly? (`Bearer <token>`)
4. Is the organization ID numeric? (not a string)

### Issue: Frontend not working but API tests pass

**Check the frontend code for:**
1. Correct endpoint: `/api/organizations/${orgId}/locations`
2. Proper authorization header setup
3. Numeric organization ID (not quoted string)
4. Connection status filtering (only show active connections)

### Issue: No locations returned

**Check:**
1. Does the organization have locations created?
2. Are the locations active?
3. Is the correct organization ID being used?

## Output Files

- `test-environment-summary.json` - Details of created test data
- `location-permissions-test-results.json` - Test results
- `tokens/test-*.txt` - Authentication tokens for each user

## Frontend Integration Example

```javascript
// Correct way to call the endpoint
const getRadiologyLocations = async (radiologyOrgId) => {
  const response = await axios.get(
    `/api/organizations/${radiologyOrgId}/locations`,
    {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    }
  );
  return response.data.data; // or response.data.locations
};

// Common mistakes to avoid:
// ❌ Wrong: `/api/organizations/mine/locations/${orgId}`
// ❌ Wrong: `/api/organizations/"${orgId}"/locations`
// ❌ Wrong: `Authorization: ${token}` (missing "Bearer")
```

## Need More Help?

1. Check `diagnose-frontend-permissions.js` output for detailed request/response info
2. Review the test results in `location-permissions-test-results.json`
3. Verify connections are active using the existing admin UI or API