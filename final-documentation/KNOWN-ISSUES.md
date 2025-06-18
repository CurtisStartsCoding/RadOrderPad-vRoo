# Known Issues and Troubleshooting

**Last Updated:** June 17, 2025

This document tracks known issues, their current status, and workarounds.

## 🔴 Critical Issues

### 1. Location-Based Filtering Not Implemented

**Status**: Design complete, implementation pending

**Severity**: High - Multi-location organizations see all orders from all locations

**Issue Description**:
Orders are not filtered by location. Admin staff in multi-location organizations can see and access ALL orders from ALL locations, which is a significant privacy and workflow issue.

**Details**: See [CRITICAL-LOCATION-INTEGRATION-GAP.md](CRITICAL-LOCATION-INTEGRATION-GAP.md) and [LOCATION-INTEGRATION-IMPLEMENTATION-PLAN.md](LOCATION-INTEGRATION-IMPLEMENTATION-PLAN.md)

---

### 2. Admin Staff Cannot Access Connection Locations

**Status**: Permission issue - needs authorization update

**Severity**: High - Prevents admin staff from selecting specific radiology group locations

**Issue Description**:
Admin staff users cannot retrieve location information for connected radiology groups. When selecting a radiology group to send an order to, they can see the organization but cannot access the organization's locations, preventing them from routing orders to specific facilities.

**Current Behavior**:
- Admin staff can view list of connected radiology organizations
- Clicking on an organization does not load its locations
- API returns 403 Forbidden or empty location list
- Orders can only be sent to the organization level, not specific locations

**Impact**:
- Cannot route orders to specific radiology locations
- Multi-location radiology groups receive all orders at organization level
- No way to distribute workload across different facilities

**Root Cause**: 
Admin staff role lacks permission to access the connections/locations endpoint or the endpoint doesn't properly authorize admin_staff role.

**Temporary Workaround**: 
None available - admin staff must manually coordinate with radiology groups about which location should handle orders

**Permanent Fix Required**:
1. Update API endpoint permissions to allow admin_staff to access connection locations
2. Verify `/api/connections/:connectionId/locations` includes admin_staff in authorized roles
3. Update frontend to properly display location selection for admin_staff users

**Related Endpoints**:
- `GET /api/connections` - Works for admin_staff
- `GET /api/connections/:connectionId/locations` - Currently blocked for admin_staff
- `PUT /api/orders/:orderId` - Needs location_id for proper routing

---

## 🟡 Known Limitations

### 1. Package Management on Production

**Issue**: Production deployment uses `npm prune --production` which removes all devDependencies, including TypeScript types. This can cause build failures if package.json is modified.

**Workaround**: 
- Avoid modifying package.json dependencies unless absolutely necessary
- If changes are required, ensure production server runs `npm install --include=dev` before building

### 2. Redis Search Limitations

**Issue**: Redis search indexes may become out of sync with database

**Workaround**: 
- Run `node debug-scripts/force-redis-population.js` to force repopulation
- Check index health with `node debug-scripts/redis-optimization/check-index-schema.js`

---

## 🟢 Resolved Issues

### 1. S3 Upload - SignatureDoesNotMatch (Resolved June 17, 2025)

**Issue**: S3 file uploads were failing with 403 Forbidden errors in production but working locally

**Root Causes Found**:
1. **Wrong AWS Credentials in Test Environment**
   - Test scripts were using `radorderpad-ses-user` credentials which had `AWSCompromisedKeyQuarantineV3` policy blocking S3 access
   - Correct credentials were in `.env.production` but test scripts loaded empty `.env.test`

2. **Typo in Production Server Credentials**
   - AWS Secret Key had lowercase 's' instead of uppercase 'S' at position 15
   - This caused "SignatureDoesNotMatch" errors

3. **Signed Headers Issue**
   - Code was signing `content-type` and `host` headers in presigned URLs
   - Production proxy/load balancer added extra headers not included in signature

**Fix Applied**:
1. Updated `.env.test` with correct AWS credentials from `.env.production`
2. Fixed typo in server's `.env` file (changed 's' to 'S' in secret key)
3. Modified `presigned-url.service.ts` to remove signed headers:
   ```typescript
   // Removed: signableHeaders: new Set(['host', 'content-type'])
   // Now generates URLs without signed headers for proxy compatibility
   ```
4. Restarted server with `pm2 restart RadOrderPad`

**Verification**: All upload methods now work correctly:
- ✅ Direct S3 SDK uploads
- ✅ Presigned URL generation
- ✅ Browser-based uploads through the application
- ✅ API-based uploads for all roles

### 2. TypeScript Import Errors (Resolved June 17, 2025)

**Issue**: Multiple import errors in presigned-url.service.ts preventing compilation

**Fix Applied**:
- Corrected config import path to `import config from '../../config/config'`
- Fixed logger import to use default export
- Updated JWT payload type to use `AuthTokenPayload` from models
- Added missing `random-string.ts` utility

---

## Troubleshooting Commands

### Check S3 Upload Status
```bash
# Test presigned URL generation
./test-s3-endpoints.sh

# Test complete upload flow
./test-s3-upload-complete.sh

# Check browser-based uploads
# Open test-s3-browser-upload.html in a browser
```

### Database Connection Issues
```bash
# Test both database connections
node debug-scripts/test-both-databases.js

# Check specific database
psql $MAIN_DATABASE_URL -c "SELECT 1"
psql $PHI_DATABASE_URL -c "SELECT 1"
```

### Redis Issues
```bash
# Test Redis connection
node debug-scripts/redis-optimization/test-redis-connection-simple.js

# Force Redis repopulation
node debug-scripts/force-redis-population.js

# Check Redis search functionality
node debug-scripts/redis-optimization/test-redis-json-search.js
```

### Build and Deployment Issues
```bash
# Clean build
rm -rf dist/
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Check for ESLint issues
npx eslint src/

# PM2 commands
pm2 status
pm2 logs RadOrderPad --lines 100
pm2 restart RadOrderPad
```

---

## Reporting New Issues

When reporting new issues, please include:
1. Environment (development/staging/production)
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Relevant logs from PM2 or browser console
6. Any error messages or status codes

Update this document when issues are discovered, progress is made, or resolutions are found.